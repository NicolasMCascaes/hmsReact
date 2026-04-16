import { Avatar, Button, Divider, Group, Modal, NumberInput, Select, Table, TagsInput, Text, TextInput } from "@mantine/core"
import avatar from '../../../assets/avatar.jpg'
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { IconEdit, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { DateInput } from '@mantine/dates';
import 'dayjs/locale/pt-br';
import PhoneInput from 'react-phone-input-2'
import { useDisclosure } from "@mantine/hooks";
import { getPatientProfile, updatePatientProfile } from "../../../services/PatientProfileService";
import { formatDate } from "../../../utilities/DateUtility";
import { useForm } from "@mantine/form";
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility";
import { arrayToCsv } from "../../../utilities/OtherUtilities";
import { bloodGroup, bloodGroups } from "../../../data/DropDownData";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { uploadMediaFile } from "../../../services/MediaService";

const Profile = () => {
    const [editMode, setEditMode] = useState(false)
    const user = useSelector((state: any) => state.user)
    const [opened, { open, close }] = useDisclosure(false);
    const [profile, setProfile] = useState<any>({})
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getPatientProfile(user.profileId)
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
            cpf: profile.cpf ?? '',
            bloodGroup: profile.bloodGroup,
            alergies: [],
            chronicDisease: []
        },

        validate: {
            dob: (value) => !value ? 'A data de nascimento é obrigatória!' : undefined,
            phone: (value) => !value ? 'O número de telefone é obrigatório!' : undefined,
            address: (value) => !value ? 'Informe seu endereço!' : undefined,
            cpf: (value) => !value ? 'O CPF é obrigatório!' : undefined,
        }

    });
    const handleUpdate = () => {
        let values = form.getValues()
        updatePatientProfile({ ...profile, ...values, alergies: values.alergies ? JSON.stringify(values.alergies) : null, chronicDisease: values.chronicDisease ? JSON.stringify(values.chronicDisease) : null }).then((data) => {
            setLoading(true)
            setProfile({ ...data, ...values })
            setEditMode(false)
            sucessNotification("Perfil atualizado com sucesso!")
        }).catch((error) => {
            console.log(error)
            errorNotification(error.response.data.errorMessage)
        }).finally(() => setLoading(false))
    }
    const handleEdit = () => {
        form.setValues({ ...profile, dob: profile.dob ? new Date(profile.dob) : undefined, chronicDisease: profile.chronicDisease ?? [], alergies: profile.alergies ?? [] })
        setEditMode(true)
    }
    const handlePhotoUpload = async (files: File[]) => {
        const file = files[0]
        if (!file) {
            errorNotification("Nenhum arquivo selecionado!")
            return
        }
        const media = await uploadMediaFile(file)
        updatePatientProfile({ ...profile, profilePictureId: media.id })
        setProfile({ ...profile, profilePictureId: media.id })
        sucessNotification("Foto de perfil atualizada com sucesso!")
    }
    return (
        <div className="p-10">
            <div className="flex justify-between items-center">
                <div className="flex gap-5 items-center">
                    <div className="flex flex-col items-center ">
                        <Avatar variant="filled" src={avatar} alt="Nicolas" size="200" className="mb-5" />
                        {editMode && <Button size="sm" onClick={open} variant="filled" leftSection={<IconEdit />}>Upload</Button>}
                    </div>
                    <div className="flex gap-3 flex-col">
                        <div className="text-3xl font-medium text-neutral-900">{user.name}</div>
                        <div className="text-xl text-neutral-700">{user.sub}</div>
                    </div>
                </div>
                {!editMode ? <Button size="md" onClick={handleEdit} variant="filled" leftSection={<IconEdit />}>Editar</Button> :
                    <Button size="md" onClick={handleUpdate} type="submit" variant="filled" loading={loading} leftSection={<IconEdit />}>Confirmar</Button>}
            </div>
            <Divider my="xl" />
            <div>
                <div className="text-2xl font-medium text-neutral-900">Informações pessoais</div>
                <div className="flex gap-10">
                    <Table striped stripedColor="primary.1" withRowBorders={false}>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Data de nascimento</Table.Th>
                                {editMode ? <Table.Td><DateInput label="Data de nascimento" locale="pt-br" placeholder="Selecione sua data de nascimento" {...form.getInputProps('dob')} /></Table.Td>
                                    : <Table.Td>{formatDate(profile.dob)}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Telefone</Table.Th>
                                {editMode ? <Table.Td><PhoneInput
                                    country={'br'} {...form.getInputProps('phone')}
                                /></Table.Td>
                                    : <Table.Td>{profile.phone ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Endereço</Table.Th>
                                {editMode ? <Table.Td><TextInput label="Endereço" placeholder="Endereço" {...form.getInputProps('address')} /></Table.Td>
                                    : <Table.Td>{profile.address ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">CPF</Table.Th>
                                {editMode ? <Table.Td><NumberInput label="CPF" placeholder="CPF" maxLength={11} hideControls {...form.getInputProps('cpf')}
                                /></Table.Td>
                                    : <Table.Td>{profile.cpf ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Grupo Sanguíneo</Table.Th>
                                {editMode ? <Table.Td><Select label="Tipo sanguíneo" data={bloodGroup} {...form.getInputProps('bloodGroup')} /></Table.Td>
                                    : <Table.Td>{bloodGroups[profile.bloodGroup] ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Alergias</Table.Th>
                                {editMode ? <Table.Td><TagsInput label="Alergias" {...form.getInputProps('alergies')} /></Table.Td>
                                    : <Table.Td>{arrayToCsv(profile.alergies) ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Doenças Crônicas</Table.Th>
                                {editMode ? <Table.Td><TagsInput label="Doenças crônicas" {...form.getInputProps('chronicDisease')} /></Table.Td>
                                    : <Table.Td>{arrayToCsv(profile.chronicDisease) ?? '-'}</Table.Td>}</Table.Tr>
                        </Table.Tbody>
                    </Table>
                </div>
            </div>
            <Modal opened={opened} onClose={close} title={<span className="text-xl">Atualizar foto de perfil</span>}>
                <Dropzone
                    onDrop={(files) => handlePhotoUpload(files)}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={5 * 1024 ** 2}
                    accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.jpeg]}
                    multiple={false}
                >
                    <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                        <Dropzone.Accept>
                            <IconUpload size={52} color="var(--mantine-color-blue-6)" />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX size={52} color="var(--mantine-color-red-6)" />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconPhoto size={52} color="var(--mantine-color-dimmed)" />
                        </Dropzone.Idle>

                        <div>
                            <Text size="xl" inline>
                                Arraste a nova foto de perfil aqui ou clique para selecionar
                            </Text>
                            <Text size="sm" c="dimmed" inline mt={7}>
                                A foto não deve exceder 5mb e deve ser do tipo PNG, JPG ou JPEG
                            </Text>
                        </div>
                    </Group>
                </Dropzone>
            </Modal>
        </div>

    )
}

export default Profile
