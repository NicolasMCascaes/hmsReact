import { Button } from "@mantine/core"
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility"
import { IconMicrophone, IconMicrophoneOff, IconVideo, IconVideoOff } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import { endVideoCall } from "../../../services/VideoCallService"
import { useSelector } from "react-redux"

type VideoRoomState = {
    callId?: number
    callUrl?: string
}

type VideoCallSocketEvent = {
    eventType?: string
    data?: RTCIceCandidateInit | RTCSessionDescriptionInit | null | { isActive: boolean } | any
    participantId?: number
}

const VideoRoom = () => {
    const { roomId } = useParams()
    const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(true)
    const [audioEnabled, setAudioEnabled] = useState(true)
    const [opened, { close }] = useDisclosure(false);
    const user = useSelector((state: any) => state.user)
    const location = useLocation()
    const state = (location.state as VideoRoomState | null) ?? null
    const callId = state?.callId
    const localVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const socketRef = useRef<WebSocket | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([])
    const joinedRoomRef = useRef(false)
    const navigate = useNavigate()
    const [roomStatus, setRoomStatus] = useState<boolean>(false)
    const [lastMessage, setLastMessage] = useState("Nenhuma mensagem recebida.")
    const token = localStorage.getItem("token")

    useEffect(() => {
        connectSocket().catch((error) => {
            console.log("Erro ao conectar WebSocket:", error)
        })
        return () => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.close()
            }

            if (peerConnectionRef.current) {
                peerConnectionRef.current.close()
                peerConnectionRef.current = null
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
                streamRef.current = null
            }

            pendingIceCandidatesRef.current = []
        }
    }, [])

    const sendParticipantJoined = () => {
        if (!callId || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || joinedRoomRef.current) {
            return
        }
        socketRef.current.send(JSON.stringify({
            type: "PARTICIPANT_JOINED",
            callId,
            data: null,
        }))
        joinedRoomRef.current = true
    }

    const flushPendingIceCandidates = async (peerConnection: RTCPeerConnection) => {
        if (!peerConnection.remoteDescription) {
            return
        }

        while (pendingIceCandidatesRef.current.length > 0) {
            const candidate = pendingIceCandidatesRef.current.shift()

            if (!candidate) {
                continue
            }

            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        }
    }

    const handleIncomingIceCandidate = async (candidateData?: RTCIceCandidateInit | null) => {
        if (!candidateData) {
            return
        }

        const peerConnection = peerConnectionRef.current

        if (!peerConnection || !peerConnection.remoteDescription) {
            pendingIceCandidatesRef.current.push(candidateData)
            return
        }

        await peerConnection.addIceCandidate(new RTCIceCandidate(candidateData))
    }

    const connectSocket = async () => {
        if (!token) {
            throw new Error("Token não encontrado.")
        }

        if (socketRef.current?.readyState === WebSocket.OPEN) {
            return socketRef.current
        }

        if (socketRef.current?.readyState === WebSocket.CONNECTING) {
            return new Promise<WebSocket>((resolve, reject) => {
                const currentSocket = socketRef.current as WebSocket

                const handleOpen = () => {
                    cleanup()
                    resolve(currentSocket)
                }

                const handleError = () => {
                    cleanup()
                    reject(new Error("Erro ao conectar WebSocket."))
                }

                const cleanup = () => {
                    currentSocket.removeEventListener("open", handleOpen)
                    currentSocket.removeEventListener("error", handleError)
                }

                currentSocket.addEventListener("open", handleOpen)
                currentSocket.addEventListener("error", handleError)
            })
        }
        return new Promise<WebSocket>((resolve, reject) => {
            const socket = new WebSocket(`ws://localhost:9000/videocalls/ws?token=${token}`)
            socketRef.current = socket

            socket.onopen = () => {

                console.log("WebSocket conectado")
                resolve(socket)
            }

            socket.onerror = (error) => {

                console.log("Erro WebSocket:", error)
                reject(new Error("Erro ao conectar WebSocket."))
            }

            socket.onclose = () => {
                console.log("WebSocket desconectado")
            }

            socket.onmessage = async (event) => {
                setLastMessage(event.data)
                console.log("Mensagem recebida:", event.data)

                try {
                    const message = JSON.parse(event.data) as VideoCallSocketEvent

                    if (message.eventType === "WEBRTC_ANSWER" && message.data && peerConnectionRef.current) {
                        await peerConnectionRef.current.setRemoteDescription(
                            new RTCSessionDescription(message.data as RTCSessionDescriptionInit)
                        )
                        await flushPendingIceCandidates(peerConnectionRef.current)
                        console.log("ANSWER processada:", message.data)
                    }

                    if (message.eventType === "ICE_CANDIDATE") {
                        await handleIncomingIceCandidate(message.data as RTCIceCandidateInit | null)
                        console.log("ICE CANDIDATE:", message.data)
                    }
                    if (message.eventType === "PARTICIPANT_LEFT") {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = null
                        }
                        if (peerConnectionRef.current) {
                            peerConnectionRef.current.close()
                            peerConnectionRef.current = null
                        }
                        pendingIceCandidatesRef.current = []
                        sucessNotification("O paciente deixou a sala de videochamada.")
                    }
                    if (message.eventType === "ROOM_STATE" && message.data) {
                        const roomState = message.data as
                            {
                                callId: number; participantCount: number; hasEnoughParticipants: boolean
                            }
                        if (roomState.hasEnoughParticipants && roomState) {
                            await createAndSendOffer()
                        }
                    }
                    if (message.eventType === "VIDEO_OFF" && user.profileId !== message.participantId) {
                        setRemoteVideoEnabled(false)
                    }
                    if (message.eventType === "VIDEO_ON" && user.profileId !== message.participantId) {
                        setRemoteVideoEnabled(true)
                    }
                } catch (error) {
                    console.log("Erro ao processar mensagem WebSocket:", error)
                }
            }
        })
    }

    const ensureLocalStream = async () => {
        if (streamRef.current) {
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = streamRef.current
            }

            return streamRef.current
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })

        streamRef.current = mediaStream

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream
        }

        return mediaStream
    }
    const createPeerConnection = (mediaStream?: MediaStream) => {
        if (peerConnectionRef.current) {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => {
                    const senderAlreadyExists = peerConnectionRef.current?.getSenders().some((sender) => sender.track?.id === track.id)

                    if (!senderAlreadyExists) {
                        peerConnectionRef.current?.addTrack(track, mediaStream)
                    }
                })
            }

            return peerConnectionRef.current
        }

        const peerConnection = new RTCPeerConnection()
        peerConnectionRef.current = peerConnection

        peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0]
            }
        }

        peerConnection.onicecandidate = (event) => {
            if (!event.candidate || !callId || socketRef.current?.readyState !== WebSocket.OPEN) {
                return
            }

            socketRef.current.send(JSON.stringify({
                type: "ICE_CANDIDATE",
                callId,
                data: event.candidate,
            }))
        }

        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, mediaStream)
            })
        }

        return peerConnection
    }
    const joinRoom = async () => {
        if (!callId) return

        await connectSocket()
        sendParticipantJoined()
        setRoomStatus(true)

        if (streamRef.current) {
            createPeerConnection(streamRef.current)
        }
    }
    const createAndSendOffer = async () => {
        if (!callId) {
            errorNotification("Não foi possível identificar a chamada desta sala.")
            return
        }

        const mediaStream = await ensureLocalStream()
        const peerConnection = createPeerConnection(mediaStream)

        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)

        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "WEBRTC_OFFER",
                callId,
                data: offer,
            }))
        }

        console.log("OFFER enviada:", offer)
    }
    const startCamera = async () => {
        const mediaStream = await ensureLocalStream()

        mediaStream.getVideoTracks().forEach((track) => {
            track.enabled = true
        })

        if (roomStatus) {
            createPeerConnection(mediaStream)

            socketRef.current?.send(JSON.stringify({
                type: "VIDEO_ON",
                callId,
                data: null,
            }))
        }
    }
    const leftRoom = () => {
        navigate("/doctor/videocall")
        setRoomStatus(false)
        socketRef.current?.send(JSON.stringify({
            type: "PARTICIPANT_LEFT",
            callId,
            data: null,
        }))
    }
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getVideoTracks().forEach((track) => track.enabled = false)
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null
        }
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "VIDEO_OFF",
                callId,
                data: null,
            }))
        }
        pendingIceCandidatesRef.current = []
    }
    const toogleAudio = () => {
        if (streamRef.current) {
            const audioTracks = streamRef.current.getAudioTracks()
            if (audioTracks.length === 0) {
                return
            }
            const enabled = audioTracks[0].enabled
            audioTracks.forEach((track) => track.enabled = !enabled)
            const nextEnabled = !enabled
            audioTracks.forEach((track) => track.enabled = nextEnabled)
            setAudioEnabled(nextEnabled)
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    type: enabled ? "AUDIO_OFF" : "AUDIO_ON",
                    callId,
                    data: null,
                }))
            }
        }
    }

    const endCall = () => {
        endVideoCall(callId as number).then(() => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    type: "END_CALL",
                    callId,
                    data: null,
                }))
            }

            if (peerConnectionRef.current) {
                peerConnectionRef.current.close()
                peerConnectionRef.current = null
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
                streamRef.current = null
            }

            pendingIceCandidatesRef.current = []
        }).catch((error) => {
            console.log("Erro ao encerrar chamada:", error)
            errorNotification("Não foi possível encerrar a chamada.")
        }).finally(() => {
            navigate("/doctor/videocall")
        })

    }
    return (
        <div className="flex flex-col gap-5 p-5">
            <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex justify-between">
                    <div className="text-2xl font-semibold text-primary-500">Sala de videochamada</div>
                    <div>
                        <Button color="red" variant="gradient" onClick={endCall}>Encerrar chamada</Button>
                    </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">Room ID: {roomId}</div>

            </div>

            <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="mb-3 text-lg font-medium text-primary-500">Seu vídeo</div>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="aspect-video w-full rounded-xl bg-black object-cover"
                    />
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="mb-3 text-lg font-medium text-primary-500">Paciente</div>
                    {remoteVideoEnabled && (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="aspect-video w-full rounded-xl bg-black object-cover"
                        />
                    ) || (
                            <div className="flex h-full items-center justify-center rounded-xl bg-black text-white">
                                Vídeo do paciente desligado
                            </div>
                        )}
                </div>
            </div>

            <div className="flex justify-center items-center flex-wrap gap-3">
                {roomStatus ? (
                    <Button color="red" onClick={leftRoom}>
                        Deixar sala
                    </Button>
                ) : (
                    <Button onClick={joinRoom}>
                        Entrar na sala
                    </Button>
                )}
                <Button onClick={startCamera}>
                    <IconVideo />
                </Button>
                <Button onClick={stopCamera} color="red" variant="light">
                    <IconVideoOff />
                </Button>
                {audioEnabled ? (
                    <Button onClick={toogleAudio}>
                        <IconMicrophone />
                    </Button>
                ) : (
                    <Button onClick={toogleAudio} color="red" variant="light">
                        <IconMicrophoneOff />
                    </Button>
                )}
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="text-lg font-medium text-primary-500">Última mensagem</div>
                <pre className="mt-3 overflow-auto whitespace-pre-wrap wrap-break-word rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                    {lastMessage}
                </pre>
            </div>
        </div>
    )
}

export default VideoRoom
