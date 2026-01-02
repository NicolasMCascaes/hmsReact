import { Avatar, Button, Divider, Modal, NumberInput, Select, Table, TagsInput, TextInput } from "@mantine/core"
import avatar from '../../../assets/avatar.jpg'
import { useSelector } from "react-redux"
import { useState } from "react";
import { IconEdit } from "@tabler/icons-react";
import { DateInput } from '@mantine/dates';
import 'dayjs/locale/pt-br';
import PhoneInput from 'react-phone-input-2'
import { useDisclosure } from "@mantine/hooks";

const patient = {
    dob: "2001-04-23",
    phone: "(48) 98825-7905",
    address: "Rua das Flores, 123",
    cpf: "123.456.789-00",
    bloodGroup: "O+",
    alergies: "Nenhuma",
    chronicDisease: "Asma",
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
                                 : <Table.Td>{patient.dob}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Telefone</Table.Th>
                                {editMode ? <Table.Td><PhoneInput
                                        country={'br'}
                                /></Table.Td>
                                 : <Table.Td>{patient.phone}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Endereço</Table.Th>
                                {editMode ? <Table.Td><TextInput label="Endereço" placeholder="Endereço"/></Table.Td>
                                 : <Table.Td>{patient.address}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">CPF</Table.Th>
                                {editMode ? <Table.Td><NumberInput label="CPF" placeholder="CPF" maxLength={11} hideControls
                                /></Table.Td>
                                 : <Table.Td>{patient.cpf}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Grupo Sanguíneo</Table.Th>
                                {editMode ? <Table.Td><Select label="Tipo sanguíneo" data={['A+','A-','B+','B-','AB+','AB-','O+','O-',]}/></Table.Td>
                                 : <Table.Td>{patient.bloodGroup}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Alergias</Table.Th>
                                {editMode ? <Table.Td><TagsInput label="Alergias" /></Table.Td>
                                 : <Table.Td>{patient.alergies}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Doenças Crônicas</Table.Th>
                                {editMode ? <Table.Td><TagsInput label="Doenças crônicas" /></Table.Td>
                                 : <Table.Td>{patient.chronicDisease}</Table.Td>}</Table.Tr>
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