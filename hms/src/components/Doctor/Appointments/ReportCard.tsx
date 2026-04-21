import { Divider } from "@mantine/core"
import {
    IconClock,
    IconEmpathize,
    IconNote,
    IconReportMedical,
    IconUser
} from "@tabler/icons-react"
import { formatDateWithTime } from "../../../utilities/DateUtility"


interface ReportCardProps {
    id: number
    doctorName: string
    diagnosis: string | null
    notes: string | null
    createdAt: string
    status: string | null
    referral: string | null
    onNavigateToDetails: () => void

}

const ReportCard = ({
    doctorName,
    diagnosis,
    notes,
    createdAt,
    referral,
    onNavigateToDetails
}: ReportCardProps) => {

    return (
        <div onClick={onNavigateToDetails} className="flex flex-col bg-slate-200 rounded-xl p-2 gap-2 cursor-pointer hover:shadow-[0_0_4px_1px_blue] shadow-primary-500! hover:bg-slate-300 transition duration-300 ease-in-out">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <IconUser size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                    <div className="p-1">
                        {doctorName}
                    </div>
                </div>
            </div>
            <Divider color="gray" />
            <div className="flex items-center text-sm gap-2">
                <IconClock size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{formatDateWithTime(createdAt)}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconReportMedical size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{diagnosis || "Sem diagnóstico"}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconEmpathize size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{referral || "Sem indicação"}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconNote size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{notes || "Sem observações"}</div>
            </div>
        </div>
    )
}

export default ReportCard
