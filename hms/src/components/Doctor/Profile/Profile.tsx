import { Avatar, Button, Divider, Modal, NumberInput, Select, Table, TextInput } from "@mantine/core"
import avatar from '../../../assets/avatar.jpg'
import { useSelector } from "react-redux"
import { useState } from "react";
import { IconEdit } from "@tabler/icons-react";
import { DateInput } from '@mantine/dates';
import 'dayjs/locale/pt-br';
import PhoneInput from 'react-phone-input-2'
import { useDisclosure } from "@mantine/hooks";

const doctor = {
  dob: "1985-09-14",
  phone: "(11) 99876-5432",
  address: "Av. Paulista, 1000 - São Paulo, SP",
  licenseNumber: "CRM-123456",
  specialization: "Cardiology",
  department: "Cardiology Department",
  totalExp: 15,
};
const Profile = () => {
    const [editMode, setEditMode] = useState(false)
    const user = useSelector((state: any) => state.user)
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <div className="p-10">
            <div className="flex justify-between items-center">
                <div className="flex gap-5 items-center">
                    <div className="flex flex-col items-center ">
                    <Avatar variant="filled" src={avatar} alt="Nicolas" size="200" className="mb-5" />
                    {editMode && <Button size = "sm" onClick={open} variant="filled" leftSection={<IconEdit/>}>Upload</Button>}
                    </div>
                    <div className="flex gap-3 flex-col">
                        <div className="text-3xl font-medium text-neutral-900">{user.name}</div>
                        <div className="text-xl text-neutral-700">{user.sub}</div>
                    </div>
                </div>
                {!editMode ? <Button size = "md" onClick={() => setEditMode(true)} variant="filled" leftSection={<IconEdit/>}>Editar</Button> :
                <Button size = "md" onClick={() => setEditMode(false)} variant="filled" leftSection={<IconEdit/>}>Confirmar</Button>}
            </div>
            <Divider my="xl" />
            <div>
                <div className="text-2xl font-medium text-neutral-900">Informações pessoais</div>
                <div className="flex gap-10">
                    <Table striped stripedColor="primary.1" withRowBorders={false}>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Data de nascimento</Table.Th>
                                {editMode ? <Table.Td><DateInput label="Data de nascimento" locale="pt-br" placeholder="Selecione sua data de nascimento"/></Table.Td>
                                 : <Table.Td>{doctor.dob}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Telefone</Table.Th>
                                {editMode ? <Table.Td><PhoneInput
                                        country={'br'}
                                /></Table.Td>
                                 : <Table.Td>{doctor.phone}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Endereço</Table.Th>
                                {editMode ? <Table.Td><TextInput label="Endereço" placeholder="Endereço"/></Table.Td>
                                 : <Table.Td>{doctor.address}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Documento Profissional</Table.Th>
                                {editMode ? <Table.Td><TextInput label="Documento Profissional" placeholder="Ex: CRM"/></Table.Td>
                                 : <Table.Td>{doctor.licenseNumber}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Especialização</Table.Th>
                                {editMode ? <Table.Td><Select label="Especialização" data={['Cardiologia', 'Dermatologia', 'Neurologia', 'Pediatria', 'Psiquiatria', 'Oncologia', 'Ortopedia', 'Oftalmologia', 'Ginecologia', 'Urologia', 'Gastroenterologia', 'Endocrinologia', 'Radiologia', 'Anestesiologia', 'Nefrologia', 'Pneumologia', 'Reumatologia', 'Cirurgia Geral', 'Cirurgia Plástica', 'Medicina de Emergência']}/></Table.Td>
                                 : <Table.Td>{doctor.specialization}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Departamento</Table.Th>
                                {editMode ? <Table.Td><Select label="Departamento" data={['Cardiologia', 'Dermatologia', 'Neurologia', 'Pediatria', 'Psiquiatria', 'Oncologia', 'Ortopedia', 'Oftalmologia', 'Ginecologia e Obstetrícia', 'Urologia', 'Gastroenterologia', 'Endocrinologia', 'Radiologia', 'Anestesiologia', 'Nefrologia', 'Pneumologia', 'Reumatologia', 'Cirurgia Geral', 'Cirurgia Plástica', 'Emergência', 'Medicina Intensiva', 'Laboratório', 'Fisioterapia', 'Farmácia', 'Administração Hospitalar']}/></Table.Td>
                                 : <Table.Td>{doctor.department}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Tempo de experiência profissional</Table.Th>
                                {editMode ? <Table.Td><NumberInput label="Tempo de experiência profissional" placeholder="" maxLength={3} hideControls
                                /></Table.Td>
                                 : <Table.Td>{doctor.totalExp}</Table.Td>}</Table.Tr>
                        </Table.Tbody>
                    </Table>
                </div>
            </div>
            <Modal opened={opened} onClose={close} title={<span className="text-xl">Atualizar foto de perfil</span>}>
                Nicolas games
            </Modal>
        </div>

    )
}

export default Profile