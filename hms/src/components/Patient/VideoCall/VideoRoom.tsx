import { Button } from "@mantine/core"
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { errorNotification } from "../../../utilities/NotificationUtility"
import { IconMicrophone, IconMicrophoneOff, IconVideo, IconVideoOff } from "@tabler/icons-react"
import { useSelector } from "react-redux"

type VideoRoomState = {
    callId?: number
    callUrl?: string
}

type VideoCallSocketEvent = {
    eventType?: string
    data?: RTCIceCandidateInit | RTCSessionDescriptionInit | null | { participantId: number } | { isActive: boolean } | any
}

const VideoRoom = () => {
    const user = useSelector((state: any) => state.user)
    const location = useLocation()
    const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(true)
    const state = (location.state as VideoRoomState | null) ?? null
    const callId = state?.callId
    const localVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const socketRef = useRef<WebSocket | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([])
    const joinedRoomRef = useRef(false)
    const [roomStatus, setRoomStatus] = useState<boolean>(false)
    const [lastMessage, setLastMessage] = useState("Nenhuma mensagem recebida.")
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    useEffect(() => {
        joinRoom()

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
        setRoomStatus(true)
        setLastMessage("Você entrou na sala.")
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

                    console.log("PATIENT mensagem bruta:", event.data)
                    console.log("PATIENT message.eventType:", message.eventType)
                    console.log("PATIENT message.data:", message.data)
                    if (message.eventType === "WEBRTC_OFFER" && message.data) {
                        const mediaStream = await ensureLocalStream()
                        const peerConnection = createPeerConnection(mediaStream)

                        await peerConnection.setRemoteDescription(
                            new RTCSessionDescription(message.data as RTCSessionDescriptionInit)
                        )
                        console.log("PATIENT remoteDescription setada")
                        await flushPendingIceCandidates(peerConnection)

                        const answer = await peerConnection.createAnswer()
                        console.log("PATIENT answer criada:", answer)
                        await peerConnection.setLocalDescription(answer)
                        console.log("PATIENT localDescription setada")
                        console.log("PATIENT callId antes de enviar ANSWER:", callId)
                        if (socketRef.current?.readyState === WebSocket.OPEN) {
                            socketRef.current.send(JSON.stringify({
                                type: "WEBRTC_ANSWER",
                                callId,
                                data: answer,
                            }))
                        }

                        console.log("ANSWER enviada:", answer)
                    }

                    if (message.eventType === "ICE_CANDIDATE") {
                        await handleIncomingIceCandidate(message.data as RTCIceCandidateInit | null)
                        console.log("ICE CANDIDATE:", message.data)
                    }
                    if (message.eventType === "CALL_ENDED") {
                        navigate("/patient/videocall")
                    }
                    if (message.eventType === "VIDEO_OFF" && user.profileId !== message.data?.participantId) {
                        setRemoteVideoEnabled(false)
                    }
                    if (message.eventType === "VIDEO_ON" && user.profileId !== message.data?.participantId) {
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
        try {
            if (!callId) {
                errorNotification("Não foi possível identificar a chamada desta sala.")
                return
            }

            await connectSocket()
            createPeerConnection(streamRef.current ?? undefined)
            sendParticipantJoined()
        } catch (error) {
            console.log("Erro ao entrar na sala:", error)
            errorNotification("Não foi possível entrar na sala.")
        }
    }

    const startCamera = async () => {
        try {
            await connectSocket()
            const mediaStream = await ensureLocalStream()
            createPeerConnection(mediaStream)
            streamRef.current = mediaStream
            sendParticipantJoined()
        } catch (error) {
            console.log("Erro ao iniciar câmera:", error)
            errorNotification("Não foi possível iniciar a câmera.")
        }
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getVideoTracks().forEach((track) => track.stop())
            streamRef.current = null
        }

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null
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

            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    type: enabled ? "AUDIO_OFF" : "AUDIO_ON",
                    callId,
                    data: null,
                }))
            }
        }
    }
    const leftRoom = () => {
        navigate("/patient/videocall")
    }

    return (
        <div className="flex flex-col gap-5 p-5">
            <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="text-2xl font-semibold text-primary-500">Sala de videochamada</div>
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
                    <div className="mb-3 text-lg font-medium text-primary-500">Doutor</div>
                    <div className="relative aspect-video w-full rounded-xl bg-black">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="h-full w-full rounded-xl object-cover"
                        />

                        {!remoteVideoEnabled && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black text-white">
                                Vídeo do doutor desligado
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center flex-wrap gap-3">
                {!roomStatus ? <Button onClick={joinRoom} >
                    Entrar na sala
                </Button> : <Button onClick={leftRoom}>Sair</Button>}
                <Button onClick={startCamera} variant="light">
                    <IconVideo />
                </Button>
                <Button onClick={stopCamera} color="red" variant="light">
                    <IconVideoOff />
                </Button>
                {streamRef.current?.getAudioTracks()[0]?.enabled ? (
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
