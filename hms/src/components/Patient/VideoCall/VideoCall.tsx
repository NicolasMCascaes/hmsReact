import { Button, TextInput } from "@mantine/core"
import { IconCheck, IconSearch, IconVideo } from "@tabler/icons-react"
import { FilterMatchMode } from "primereact/api"
import { Column } from "primereact/column"
import { DataTable, type DataTableFilterMeta } from "primereact/datatable"
import { Tag } from "primereact/tag"
import { Toolbar } from "primereact/toolbar"
import { type ChangeEvent, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { acceptVideoCall, getAllByReceiver } from "../../../services/VideoCallService"
import { formatDateWithTime } from "../../../utilities/DateUtility"
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility"

type VideoCallStatus = "CREATED" | "WAITING_PATIENT" | "IN_PROGRESS" | "ENDED" | "CANCELED"

type VideoCallItem = {
    callId: number
    callerName: string
    startTime: string
    callUrl: string | null
    status: VideoCallStatus
}

type VideoCallSocketEvent = {
    eventType?: string
    message?: string
    videoCall?: VideoCallItem | null
}

const statusTranslations: Record<VideoCallStatus, string> = {
    CREATED: "Criada",
    WAITING_PATIENT: "Aguardando início",
    IN_PROGRESS: "Em andamento",
    ENDED: "Encerrada",
    CANCELED: "Cancelada",
}

const VideoCall = () => {
    const user = useSelector((state: any) => state.user)
    const navigate = useNavigate()
    const socketRef = useRef<WebSocket | null>(null)
    const token = localStorage.getItem("token")
    const [calls, setCalls] = useState<VideoCallItem[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [actionLoadingCallId, setActionLoadingCallId] = useState<number | null>(null)
    const [globalFilterValue, setGlobalFilterValue] = useState("")
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    useEffect(() => {
        if (user.profileId) {
            fetchCalls()
        }
    }, [user.profileId])

    useEffect(() => {
        connectSocket()

        return () => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.close()
            }
        }
    }, [])

    const upsertCall = (incomingCall: VideoCallItem) => {
        setCalls((currentCalls) => {
            const callIndex = currentCalls.findIndex((call) => call.callId === incomingCall.callId)

            if (callIndex === -1) {
                return [incomingCall, ...currentCalls]
            }

            const nextCalls = [...currentCalls]
            nextCalls[callIndex] = { ...nextCalls[callIndex], ...incomingCall }
            return nextCalls
        })
    }

    const connectSocket = () => {
        if (!token) {
            return
        }

        if (socketRef.current?.readyState === WebSocket.OPEN || socketRef.current?.readyState === WebSocket.CONNECTING) {
            return
        }

        const socket = new WebSocket(`ws://localhost:9000/videocalls/ws?token=${token}`)
        socketRef.current = socket

        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as VideoCallSocketEvent

                if (message.videoCall) {
                    upsertCall(message.videoCall)
                }

                if (message.eventType === "CALL_CREATED") {
                    sucessNotification("Você recebeu uma nova chamada.")
                }
            } catch (error) {
                console.log("Erro ao processar mensagem WebSocket:", error)
            }
        }

        socket.onerror = (error) => {
            console.log("Erro WebSocket:", error)
        }
    }

    const fetchCalls = () => {
        if (!user.profileId) {
            return
        }

        setTableLoading(true)
        getAllByReceiver(user.profileId)
            .then((data) => {
                setCalls(Array.isArray(data) ? data : [])
            })
            .catch((error: any) => {
                console.log(error)
                errorNotification(error?.response?.data?.errorMessage || "Erro ao carregar chamadas.")
            })
            .finally(() => {
                setTableLoading(false)
            })
    }

    const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setGlobalFilterValue(value)
        setFilters({
            global: { value, matchMode: FilterMatchMode.CONTAINS },
        })
    }

    const getRoomIdFromUrl = (callUrl: string | null | undefined) => {
        if (!callUrl) {
            return null
        }

        return callUrl.split("/").filter(Boolean).pop() || callUrl
    }

    const navigateToRoom = (rowData: VideoCallItem) => {
        const roomId = getRoomIdFromUrl(rowData.callUrl)

        if (!roomId) {
            errorNotification("Essa chamada ainda não possui uma sala disponível.")
            return
        }

        navigate(`/patient/video-room/${roomId}`, {
            state: {
                callId: rowData.callId,
                callUrl: rowData.callUrl,
            },
        })
    }

    const handleAccept = (rowData: VideoCallItem) => {
        setActionLoadingCallId(rowData.callId)

        acceptVideoCall(rowData.callId)
            .then(() => {
                const acceptedCall: VideoCallItem = {
                    ...rowData,
                    status: "WAITING_PATIENT",
                }

                upsertCall(acceptedCall)
                sucessNotification("Chamada aceita com sucesso!")
            })
            .catch((error: any) => {
                console.log(error)
                errorNotification(error?.response?.data?.errorMessage || "Erro ao aceitar chamada.")
            })
            .finally(() => {
                setActionLoadingCallId(null)
            })
    }

    const statusBodyTemplate = (rowData: VideoCallItem) => {
        const severity =
            rowData.status === "CREATED"
                ? "info"
                : rowData.status === "WAITING_PATIENT"
                    ? "warning"
                    : rowData.status === "IN_PROGRESS"
                        ? "success"
                        : rowData.status === "ENDED"
                            ? "secondary"
                            : "danger"

        return <Tag value={statusTranslations[rowData.status]} severity={severity} />
    }

    const startTimeBodyTemplate = (rowData: VideoCallItem) => {
        return <span className="text-red-400">{formatDateWithTime(rowData.startTime)}</span>
    }

    const roomBodyTemplate = (rowData: VideoCallItem) => {
        const roomId = getRoomIdFromUrl(rowData.callUrl)
        return <span>{roomId ?? "Sala indisponível"}</span>
    }

    const actionBodyTemplate = (rowData: VideoCallItem) => {
        const roomId = getRoomIdFromUrl(rowData.callUrl)

        if (rowData.status === "CREATED") {
            return (
                <Button
                    size="xs"
                    loading={actionLoadingCallId === rowData.callId}
                    leftSection={<IconCheck size={14} />}
                    onClick={() => handleAccept(rowData)}
                >
                    Aceitar
                </Button>
            )
        }else if (rowData.status === "WAITING_PATIENT" || rowData.status === "IN_PROGRESS") {
            return (
                <Button
                    size="xs"
                    variant="light"
                    leftSection={<IconVideo size={14} />}
                    disabled={!roomId || rowData.status ==="WAITING_PATIENT"}
                    onClick={() => navigateToRoom(rowData)}
                >
                    {rowData.status === "WAITING_PATIENT" ? "Aguardar início" : "Entrar na sala"}
                </Button>
            )
        }

        return (
            <Button
                size="xs"
                variant="light"
                leftSection={<IconVideo size={14} />}
                disabled={!roomId || rowData.status === "CANCELED" || rowData.status === "ENDED"}
                onClick={() => navigateToRoom(rowData)}
            >
                Entrar na sala
            </Button>
        )
    }

    const leftToolbarTemplate = () => {
        return <div className="text-lg font-semibold text-primary-500">Minhas videochamadas</div>
    }

    const rightToolbarTemplate = () => {
        return (
            <TextInput
                value={globalFilterValue}
                leftSection={<IconSearch size={16} />}
                fw={500}
                onChange={onGlobalFilterChange}
                placeholder="Pesquisar chamada"
            />
        )
    }

    return (
        <div className="card">
            <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate} />
            <DataTable
                value={calls}
                size="small"
                paginator
                rows={10}
                loading={tableLoading}
                filters={filters}
                globalFilterFields={["callId", "callerName", "callUrl", "status"]}
                dataKey="callId"
                emptyMessage="Nenhuma chamada encontrada."
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} chamadas"
            >
                <Column field="callId" header="ID" sortable style={{ minWidth: "6rem" }} />
                <Column field="callerName" header="Médico" sortable style={{ minWidth: "14rem" }} />
                <Column field="startTime" header="Data e hora" body={startTimeBodyTemplate} sortable style={{ minWidth: "16rem" }} />
                <Column field="callUrl" header="Sala" body={roomBodyTemplate} sortable style={{ minWidth: "14rem" }} />
                <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: "14rem" }} />
                <Column header="Ações" body={actionBodyTemplate} style={{ minWidth: "12rem" }} />
            </DataTable>
        </div>
    )
}

export default VideoCall
