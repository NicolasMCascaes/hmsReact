import { Button, LoadingOverlay, Modal, Select, TextInput } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { useDisclosure } from "@mantine/hooks"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import dayjs from "dayjs"
import { FilterMatchMode } from "primereact/api"
import { Column } from "primereact/column"
import { DataTable, type DataTableFilterMeta } from "primereact/datatable"
import { Tag } from "primereact/tag"
import { Toolbar } from "primereact/toolbar"
import { type ChangeEvent, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getAllPatientsDropdown } from "../../../services/PatientProfileService"
import { createVideoCall, getAllByCaller, initiateVideoCall } from "../../../services/VideoCallService"
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility"
import { formatDateWithTime, toIsoLocalDateTime } from "../../../utilities/DateUtility"

type VideoCallStatus = "CREATED" | "WAITING_PATIENT" | "IN_PROGRESS" | "ENDED" | "CANCELED"

type VideoCallItem = {
    callId: number
    receiverName: string
    startTime: string
    callUrl: string | null
    status: VideoCallStatus
}

type PatientOption = {
    value: string
    label: string
}

type VideoCallSocketEvent = {
    eventType?: string
    message?: string
    videoCall?: VideoCallItem | null
}

const statusTranslations: Record<VideoCallStatus, string> = {
    CREATED: "Criada",
    WAITING_PATIENT: "Paciente aguardando",
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
    const [patients, setPatients] = useState<PatientOption[]>([])
    const [opened, { open, close }] = useDisclosure(false)
    const [loading, setLoading] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [globalFilterValue, setGlobalFilterValue] = useState("")
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    const form = useForm({
        initialValues: {
            receiverId: "",
            startTime: new Date(),
        },
        validate: {
            receiverId: (value) => (!value ? "Selecione um paciente para a chamada." : null),
            startTime: (value) => (!value ? "Informe a data e hora da chamada." : null),
        },
    })

    useEffect(() => {
        fetchPatients()
    }, [])

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

                if (message.eventType === "CALL_ACCEPTED") {
                    sucessNotification("O paciente aceitou a chamada.")
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
        getAllByCaller(user.profileId)
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

    const fetchPatients = () => {
        getAllPatientsDropdown()
            .then((data) => {
                const mappedPatients = Array.isArray(data)
                    ? data.map((patient: any) => ({
                        value: String(patient.id),
                        label: patient.name,
                    }))
                    : []

                setPatients(mappedPatients)
            })
            .catch((error: any) => {
                console.log(error)
                errorNotification(error?.response?.data?.errorMessage || "Erro ao carregar pacientes.")
            })
    }

    const handleSubmit = (values: typeof form.values) => {
        setLoading(true)
        createVideoCall({
            receiverId: values.receiverId,
            startTime: toIsoLocalDateTime(values.startTime),
        })
            .then((data) => {
                setCalls((prev) => [data, ...prev])
                sucessNotification("Chamada criada com sucesso!")
                form.setValues({
                    receiverId: "",
                    startTime: new Date(),
                })
                close()
            })
            .catch((error: any) => {
                console.log(error)
                errorNotification(error?.response?.data?.errorMessage || "Erro ao criar chamada.")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setGlobalFilterValue(value)
        setFilters({
            global: { value, matchMode: FilterMatchMode.CONTAINS },
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

    const getRoomIdFromUrl = (callUrl: string | null | undefined) => {
        if (!callUrl) {
            return null
        }

        return callUrl.split("/").filter(Boolean).pop() || callUrl
    }

    const roomBodyTemplate = (rowData: VideoCallItem) => {
        const roomId = getRoomIdFromUrl(rowData.callUrl)
        return <span>{roomId ?? "Sala indisponível"}</span>
    }

    const actionBodyTemplate = (rowData: VideoCallItem) => {
        const roomId = getRoomIdFromUrl(rowData.callUrl)

        const canStart: boolean = rowData.status === "WAITING_PATIENT" && !!roomId
        const canJoin: boolean = rowData.status === "IN_PROGRESS" && !!roomId
        const isEndedOrCanceled: boolean = rowData.status === "ENDED" || rowData.status === "CANCELED"

        const disabled = (!canStart && !canJoin) || isEndedOrCanceled

        const buttonLabel =
            canStart ? "Iniciar chamada" :
                canJoin ? "Entrar na chamada" :
                    rowData.status === "ENDED" ? "Chamada encerrada" :
                        "Indisponível"

        return (
            <Button
                size="xs"
                variant="light"
                disabled={disabled}
                onClick={() => handleInitiateCall(rowData)}
            >
                {buttonLabel}
            </Button>
        )
    }

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-between items-center">
                <Button leftSection={<IconPlus size={16} />} onClick={open}>
                    Criar chamada
                </Button>
            </div>
        )
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
    const handleInitiateCall = (call: VideoCallItem) => {
        if (!call.callUrl) {
            errorNotification("Essa chamada ainda não possui uma sala disponível.")
            return
        }

        const roomId = getRoomIdFromUrl(call.callUrl)

        if (call.status === "IN_PROGRESS") {
            navigate(`/doctor/video-room/${roomId}`, {
                state: { callId: call.callId, callUrl: call.callUrl },
            })
            return
        }

        if (call.status === "WAITING_PATIENT") {
            initiateVideoCall(call.callId)
                .then(() => {
                    navigate(`/doctor/video-room/${roomId}`, {
                        state: { callId: call.callId, callUrl: call.callUrl },
                    })
                })
                .catch((error) => {
                    errorNotification(error?.response?.data?.errorMessage || "Erro ao iniciar chamada.")
                })
        }
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
                globalFilterFields={["callId", "receiverName", "callUrl", "status"]}
                dataKey="callId"
                emptyMessage="Nenhuma chamada encontrada."
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} chamadas"
            >
                <Column field="callId" header="ID" sortable style={{ minWidth: "6rem" }} />
                <Column field="receiverName" header="Paciente" sortable style={{ minWidth: "14rem" }} />
                <Column field="startTime" header="Data e hora" body={startTimeBodyTemplate} sortable style={{ minWidth: "16rem" }} />
                <Column field="callUrl" header="Sala" body={roomBodyTemplate} sortable style={{ minWidth: "14rem" }} />
                <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: "14rem" }} />
                <Column header="Ações" body={actionBodyTemplate} style={{ minWidth: "12rem" }} />
            </DataTable>

            <Modal
                opened={opened}
                onClose={close}
                size="lg"
                title={<div className="text-xl font-semibold text-primary-400 font-poppins">Criar chamada de vídeo</div>}
                centered
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-5">
                        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

                        <Select
                            withAsterisk
                            searchable
                            data={patients}
                            label="Paciente"
                            placeholder="Selecione o paciente"
                            {...form.getInputProps("receiverId")}
                        />

                        <DateTimePicker
                            withAsterisk
                            minDate={new Date()}
                            label="Data e hora da chamada"
                            placeholder="Selecione a data e hora da chamada"
                            {...form.getInputProps("startTime")}
                            presets={[
                                { value: dayjs().format("YYYY-MM-DD HH:mm:ss"), label: "Hoje" },
                                { value: dayjs().add(1, "day").format("YYYY-MM-DD HH:mm:ss"), label: "Amanhã" },
                                { value: dayjs().add(1, "month").format("YYYY-MM-DD HH:mm:ss"), label: "No próximo mês" },
                            ]}
                        />

                        <Button type="submit" loading={loading}>
                            Criar chamada
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default VideoCall
