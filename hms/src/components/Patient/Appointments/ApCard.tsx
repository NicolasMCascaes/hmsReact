import {
    IconClock,
    IconEmergencyBed,
    IconNote,
    IconPhone,
    IconProgress,
    IconTrash,
    IconUserHeart,
} from "@tabler/icons-react"
import { Tag } from "primereact/tag"
import { formatDateWithTime } from "../../../utilities/DateUtility"
import { ActionIcon } from "@mantine/core"

interface ApCardProps {
    doctorName: string
    appointmentTime: string
    reason: string | null
    notes: string | null
    status: string | null
    doctorEmail: string | null
    onDelete: () => void
}

const getSeverity = (status: string | null) => {
    switch (status) {
        case "CANCELLED":
            return "danger"
        case "COMPLETED":
            return "success"
        case "SCHEDULED":
            return "info"
    }
}

const ApCard = ({ doctorName, appointmentTime, reason, notes, status, doctorEmail, onDelete }: ApCardProps) => {
    return (
        <div className="flex flex-col bg-slate-200 rounded-xl p-2 gap-2 cursor-pointer hover:shadow-[0_0_4px_1px_blue] shadow-primary-500! hover:bg-slate-300 transition duration-300 ease-in-out">
            <div className="flex items-center gap-3">
                <IconUserHeart size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div className="text-lg font-semibold text-primary-500">{`Dr. ${doctorName}`}</div>
                <div className="flex gap-2">
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
            
            <div className="flex items-center text-sm gap-2">
                <IconClock size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{formatDateWithTime(appointmentTime)}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconNote size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{notes}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconEmergencyBed size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{reason}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconPhone size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{doctorEmail || "Nao informado"}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconProgress size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <Tag severity={getSeverity(status)}>
                    {status == "CANCELLED" ? "Cancelada" : status == "SCHEDULED" ? "Agendada" : "Nao informado"}
                </Tag>
            </div>
        </div>
    )
}

export default ApCard
