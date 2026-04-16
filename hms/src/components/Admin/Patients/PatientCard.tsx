import { Avatar } from "@mantine/core"
import { formatDate } from "../../../utilities/DateUtility"
import { bloodGroups } from "../../../data/DropDownData"

const PatientCard = ({name, email, dob, phone, address, bloodGroup }:any) => {
    
  return (
    <div className="flex flex-col bg-slate-200 rounded-lg p-2 gap-2 shadow-md cursor-pointer hover:bg-slate-300 transition-colors">
    <Avatar name={name} color="initials" variant="filled" />
        <div className="p-1">{name}</div>
    <div className="flex justify-between items-center text-sm gap-2">
        <div className="p-1 text-gray-600">Email:</div>
        <div>{email}</div>
    </div>
    <div className="flex justify-between items-center text-sm gap-2">
        <div className="p-1 text-gray-600">Data de nascimento:</div>
        <div>{dob == null ? "Não informado" : formatDate(dob)}</div>
    </div>
    <div className="flex justify-between items-center text-sm gap-2">
        <div className="p-1 text-gray-600">Data de nascimento:</div>
        <div>{dob == null ? "Não informado" : formatDate(dob)}</div>
    </div>
    <div className="flex justify-between items-center text-sm gap-2">
        <div className="p-1 text-gray-600">Telefone:</div>
        <div>{phone == null ? "Não informado" : phone}</div>
    </div>
    <div className="flex justify-between items-center text-sm gap-2">
        <div className="p-1 text-gray-600">Endereço:</div>
        <div>{address == null ? "Não informado" : address}</div>
    </div>
    <div className="flex justify-between items-center text-sm gap-2">
        <div className="p-1 text-gray-600">Grupo sanguíneo:</div>
        <div>{bloodGroup == null ? "Não informado" : bloodGroups[bloodGroup]}</div>
    </div>
    </div>
   
  )
}

export default PatientCard