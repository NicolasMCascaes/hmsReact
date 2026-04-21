import { ActionIcon, Avatar, Divider } from "@mantine/core"
import {
    IconClock,
    IconEye,
    IconNote,
    IconPhone,
    IconTrash,
    IconUser
} from "@tabler/icons-react"
import { formatDateWithTime } from "../../../utilities/DateUtility"

interface ApCardProps {
    patientName: string
    patientPhone: string | null
    appointmentTime: string
    reason: string | null
    notes: string | null
    status: string | null
    onViewDetails: () => void
    onDelete: () => void
}

const ApCard = ({
    patientName,
    patientPhone,
    appointmentTime,
    reason,
    notes,
    status,
    onViewDetails,
    onDelete
}: ApCardProps) => {
    return (
        <div
            className="flex flex-col bg-slate-200 rounded-xl p-2 gap-2 cursor-pointer hover:shadow-[0_0_4px_1px_blue] shadow-primary-500! hover:bg-slate-300 transition duration-300 ease-in-out"
            onClick={onViewDetails}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Avatar size="lg" name={patientName} color="initials" variant="filled" />
                    <div className="p-1">
                        {patientName}
                        <div className="text-sm text-gray-500">
                            {reason} &bull; {status == "SCHEDULED" ? "Agendada" : status == "COMPLETED" ? "Concluida" : "Cancelada"}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <ActionIcon
                        variant="subtle"
                        onClick={(event) => {
                            event.stopPropagation()
                            onViewDetails()
                        }}
                    >
                        <IconEye size={20} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={(event) => {
                            event.stopPropagation()
                            onDelete()
                        }}
                    >
                        <IconTrash size={20} stroke={1.5} />
                    </ActionIcon>
                </div>
            </div>
            <Divider color="gray" />
            <div className="flex items-center text-sm gap-2">
                <IconClock size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{formatDateWithTime(appointmentTime)}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconNote size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{notes || "Sem observacoes"}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconPhone size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{patientPhone || "Nao informado"}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconUser size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{reason || "Motivo nao informado"}</div>
            </div>
        </div>
    )
}

export default ApCard
