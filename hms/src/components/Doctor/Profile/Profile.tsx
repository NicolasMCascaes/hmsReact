import { Avatar, Button, Divider, Modal, NumberInput, Select, Table, TextInput } from "@mantine/core"
import avatar from '../../../assets/avatar.jpg'
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { IconEdit } from "@tabler/icons-react";
import { DateInput } from '@mantine/dates';
import 'dayjs/locale/pt-br';
import PhoneInput from 'react-phone-input-2'
import { useDisclosure } from "@mantine/hooks";
import { getDoctorProfile, updateDoctorProfile } from "../../../services/DoctorProfileService";
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility";
import { useForm } from "@mantine/form";
import { formatDate } from "../../../utilities/DateUtility";

const Profile = () => {
    const [editMode, setEditMode] = useState(false)
    const user = useSelector((state: any) => state.user)
    const [opened, { open, close }] = useDisclosure(false);
    const [profile, setProfile] = useState<any>({})
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
  getDoctorProfile(user.profileId)
    .then((data) => {
      setProfile({
        ...data,
        alergies: data.alergies ? JSON.parse(data.alergies) : [],
        chronicDisease: data.chronicDisease ? JSON.parse(data.chronicDisease) : [],
      });
    })
    .catch((error) => console.log(error));
}, []);
    const form = useForm({
        initialValues: {
        profileId: profile.profileId ?? '',
        dob: profile.dob ?? '',
        phone: profile.phone ?? '',
        address: profile.address ?? '', 
        licenseNumber: profile.licenseNumber ?? '', 
        specialization: profile.specializatio ?? '',
        department: profile.department ?? '',
        totalExp: profile.totalExp ?? ''
  },

    validate: {
        dob: (value) => !value ? 'A data de nascimento é obrigatória!' : undefined,
        phone: (value) => !value ? 'O número de telefone é obrigatório!' : undefined,
        address: (value) => !value ? 'Informe seu endereço!' : undefined,
        licenseNumber: (value) => !value ? 'O documento profissional é obrigatório!' : undefined,
        specialization: (value) => !value ? 'Informe sua especialização!' : undefined,
        department: (value) => !value ? 'Informe o departamento em que você trabalha!' : undefined,
        totalExp: (value) => !value ? 'Informe sua o seu tempo de experiência profissional!' : undefined,
    }
    
  });
  const handleUpdate = () => {
    let values = form.getValues()
    if (form.validate().hasErrors) {
        return
    }
    updateDoctorProfile(profile).then((data)=>{
        setLoading(true)
        setProfile({...data, ...values})
        setEditMode(false)
        sucessNotification("Perfil atualizado com sucesso!")
    }).catch((error)=>{
        console.log(error)
        errorNotification(error.response.data.errorMessage)
    }).finally(()=>setLoading(false))
  }
  const handleEdit = () => {
    form.setValues({...profile, dob: profile.dob?new Date(profile.dob):undefined})
    setEditMode(true)
  }
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
                {!editMode ? <Button size = "md" onClick={handleEdit} variant="filled" leftSection={<IconEdit/>}>Editar</Button> :
                <Button size = "md" onClick={handleUpdate} variant="filled" loading={loading} leftSection={<IconEdit/>}>Confirmar</Button>}
            </div>
            <Divider my="xl" />
            <div>
                <div className="text-2xl font-medium text-neutral-900">Informações pessoais</div>
                <div className="flex gap-10">
                    <Table striped stripedColor="primary.1" withRowBorders={false}>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Data de nascimento</Table.Th>
                                {editMode ? <Table.Td><DateInput label="Data de nascimento" locale="pt-br" placeholder="Selecione sua data de nascimento" {...form.getInputProps("dob")}/></Table.Td>
                                 : <Table.Td>{formatDate(profile.dob) ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Telefone</Table.Th>
                                {editMode ? <Table.Td><PhoneInput
                                        country={'br'} {...form.getInputProps("phone")}
                                /></Table.Td>
                                 : <Table.Td>{profile.phone ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Endereço</Table.Th>
                                {editMode ? <Table.Td><TextInput label="Endereço" placeholder="Endereço" {...form.getInputProps("address")}/></Table.Td>
                                 : <Table.Td>{profile.address ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Documento Profissional</Table.Th>
                                {editMode ? <Table.Td><TextInput label="Documento Profissional" placeholder="Ex: CRM" {...form.getInputProps("licenseNumber")}/></Table.Td>
                                 : <Table.Td>{profile.licenseNumber ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Especialização</Table.Th>
                                {editMode ? <Table.Td><Select label="Especialização" data={['Cardiologia', 'Dermatologia', 'Neurologia', 'Pediatria', 'Psiquiatria', 'Oncologia', 'Ortopedia', 'Oftalmologia', 'Ginecologia', 'Urologia', 'Gastroenterologia', 'Endocrinologia', 'Radiologia', 'Anestesiologia', 'Nefrologia', 'Pneumologia', 'Reumatologia', 'Cirurgia Geral', 'Cirurgia Plástica', 'Medicina de Emergência']} {...form.getInputProps("specialization")}/></Table.Td>
                                 : <Table.Td>{profile.specialization ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Departamento</Table.Th>
                                {editMode ? <Table.Td><Select label="Departamento" {...form.getInputProps("department")} data={['Cardiologia', 'Dermatologia', 'Neurologia', 'Pediatria', 'Psiquiatria', 'Oncologia', 'Ortopedia', 'Oftalmologia', 'Ginecologia e Obstetrícia', 'Urologia', 'Gastroenterologia', 'Endocrinologia', 'Radiologia', 'Anestesiologia', 'Nefrologia', 'Pneumologia', 'Reumatologia', 'Cirurgia Geral', 'Cirurgia Plástica', 'Emergência', 'Medicina Intensiva', 'Laboratório', 'Fisioterapia', 'Farmácia', 'Administração Hospitalar']}/></Table.Td>
                                 : <Table.Td>{profile.department ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Tempo de experiência profissional</Table.Th>
                                {editMode ? <Table.Td><NumberInput label="Tempo de experiência profissional" placeholder="" maxLength={3} hideControls
                                {...form.getInputProps("totalExp")}/></Table.Td>
                                 : <Table.Td>{profile.totalExp ?? '-'}</Table.Td>}</Table.Tr>
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