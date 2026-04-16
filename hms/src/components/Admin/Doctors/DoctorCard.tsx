import { Avatar, Divider } from "@mantine/core"
import { IconBriefcase, IconCertificate, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react"
interface DoctorCardProps {
    name: string
    email: string
    dob: string | null
    phone: string | null
    address: string | null
    licenseNumber: string | null
    specialization: string | null
    department: string | null
    totalExp: number | null
}

const DoctorCard = ({
    name,
    email,
    phone,
    address,
    licenseNumber,
    specialization,
    department,
    totalExp,
}: DoctorCardProps) => {
    return (
        <div className="flex flex-col bg-slate-200 rounded-xl p-2 gap-2 cursor-pointer hover:shadow-[0_0_4px_1px_blue] shadow-primary-500! hover:bg-slate-300 transition duration-300 ease-in-out">
            <div className="flex items-center gap-3">
            <Avatar size="lg" name={name} color="initials" variant="filled" />
            <div className="p-1">{name}
                 <div className="text-sm text-gray-500">{specialization == null ? "?" : specialization} &bull; {department == null ? "?" : department}</div>
            </div>
            </div>
            <Divider color="gray" />
            <div className="flex items-center text-sm gap-2">
                <IconMail size={30} className="text-primary-700  bg-primary-100 rounded-full p-1" />
                <div>{email}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconPhone size={30} className="text-primary-700  bg-primary-100 rounded-full p-1" />
                <div>{phone == null ? "Não informado" : phone}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconMapPin size={30} className="text-primary-700  bg-primary-100 rounded-full p-1" />
                <div>{address == null ? "Não informado" : address}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconCertificate size={30} className="text-primary-700  bg-primary-100 rounded-full p-1" />
                <div>{licenseNumber == null ? "Não informado" : licenseNumber}</div>
            </div>
            
            <div className="flex items-center text-sm gap-2">
                <IconBriefcase size={30} className="text-primary-700  bg-primary-100 rounded-full p-1" />
                <div>{totalExp == null ? "Não informado" : `${totalExp} anos`}</div>
            </div>
        </div>
    )
}

export default DoctorCard
