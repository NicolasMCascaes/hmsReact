import { ActionIcon, Avatar, Divider } from "@mantine/core"
import {
    IconClock,
    IconMedicineSyrup,
    IconNote,
    IconPill
} from "@tabler/icons-react"
import { formatDateWithTime } from "../../../utilities/DateUtility"


interface PresCardProps {
    id: number
    doctorName: string
    notes: string | null
    prescriptionDate: string
    status: string | null
    medicines: any[]
    onViewMedicines: () => void
    onNavigateToDetails: () => void
}

const PresCard = ({
    doctorName,
    notes,
    prescriptionDate,
    onViewMedicines,
    medicines,
    onNavigateToDetails
}: PresCardProps) => {

    return (
        <div onClick={onNavigateToDetails} className="flex flex-col bg-slate-200 rounded-xl p-2 gap-2 cursor-pointer hover:shadow-[0_0_4px_1px_blue] shadow-primary-500! hover:bg-slate-300 transition duration-300 ease-in-out">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Avatar size="lg" name={doctorName} color="initials" variant="filled" />
                    <div className="p-1">
                        {doctorName}
                    </div>
                </div>
                <div className="flex gap-2">
                    <ActionIcon
                        variant="filled"
                        color="red"
                        onClick={(event) => {
                            event.stopPropagation()
                            onViewMedicines()
                        }}
                    >
                        <IconMedicineSyrup size={20} stroke={1.5} />
                    </ActionIcon>
                </div>
            </div>
            <Divider color="gray" />
            <div className="flex items-center text-sm gap-2">
                <IconClock size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{formatDateWithTime(prescriptionDate)}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconNote size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{notes || "Sem observações"}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconPill size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{medicines.length > 0 && medicines.length > 1 ? `${medicines.length} medicamentos` : medicines.length == 1 ? `${medicines.length} medicamento` : "Nenhum medicamento registrado"}</div>
            </div>
        </div>
    )
}

export default PresCard
