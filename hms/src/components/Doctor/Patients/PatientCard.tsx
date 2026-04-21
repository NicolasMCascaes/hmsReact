import { Avatar, Divider } from "@mantine/core"
import {
    IconCalendar,
    IconDroplet,
    IconMail,
    IconMapPin,
    IconPhone,
} from "@tabler/icons-react"
import { bloodGroups } from "../../../data/DropDownData"
import { formatDate } from "../../../utilities/DateUtility"

interface PatientCardProps {
    name: string
    email: string
    dob: string | null
    phone: string | null
    address: string | null
    bloodGroup: string | null
}

const PatientCard = ({ name, email, dob, phone, address, bloodGroup }: PatientCardProps) => {
    const formattedDob = dob == null ? "Não informado" : formatDate(dob)
    const formattedBloodGroup =
        bloodGroup == null ? "Não informado" : bloodGroups[bloodGroup] ?? bloodGroup
    const getAge = (dob:string | null) => {
        if (dob == null) return "Não informado"
        const birthDate = new Date(dob)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return `${age} anos`
    }
    return (
        <div className="flex flex-col bg-slate-200 rounded-xl p-2 gap-2 cursor-pointer hover:shadow-[0_0_4px_1px_blue] shadow-primary-500! hover:bg-slate-300 transition duration-300 ease-in-out">
            <div className="flex items-center gap-3">
                <Avatar size="lg" name={name} color="initials" variant="filled" />
                <div className="p-1">
                    {name}
                    <div className="text-sm text-gray-500">
                        {formattedBloodGroup} &bull; {getAge(dob)}
                    </div>
                </div>
            </div>
            <Divider color="gray" />
            <div className="flex items-center text-sm gap-2">
                <IconMail size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{email}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconCalendar size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{formattedDob}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconPhone size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{phone == null ? "Não informado" : phone}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconMapPin size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{address == null ? "Não informado" : address}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconDroplet size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{formattedBloodGroup}</div>
            </div>
        </div>
    )
}

export default PatientCard
