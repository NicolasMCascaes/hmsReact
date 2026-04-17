import { Avatar, Button, Divider, Group, Modal, NumberInput, Select, Table, Text, TextInput } from "@mantine/core"
import avatar from '../../../assets/avatar.jpg'
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { IconEdit, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { DateInput } from '@mantine/dates';
import 'dayjs/locale/pt-br';
import PhoneInput from 'react-phone-input-2'
import { useDisclosure } from "@mantine/hooks";
import { getDoctorProfile, updateDoctorPhoto, updateDoctorProfile } from "../../../services/DoctorProfileService";
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility";
import { useForm } from "@mantine/form";
import { formatDate } from "../../../utilities/DateUtility";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { downloadMediaFile, uploadMediaFile } from "../../../services/MediaService";
import { setProfilePictureId } from "../../../slices/UserSlice";

const specializations = [
    'Cardiologia', 'Dermatologia', 'Neurologia', 'Pediatria', 'Psiquiatria', 'Oncologia',
    'Ortopedia', 'Oftalmologia', 'Ginecologia', 'Urologia', 'Gastroenterologia',
    'Endocrinologia', 'Radiologia', 'Anestesiologia', 'Nefrologia', 'Pneumologia',
    'Reumatologia', 'Cirurgia Geral', 'Cirurgia Plástica', 'Medicina de Emergência'
]

const departments = [
    'Cardiologia', 'Dermatologia', 'Neurologia', 'Pediatria', 'Psiquiatria', 'Oncologia',
    'Ortopedia', 'Oftalmologia', 'Ginecologia e Obstetrícia', 'Urologia', 'Gastroenterologia',
    'Endocrinologia', 'Radiologia', 'Anestesiologia', 'Nefrologia', 'Pneumologia',
    'Reumatologia', 'Cirurgia Geral', 'Cirurgia Plástica', 'Emergência',
    'Medicina Intensiva', 'Laboratório', 'Fisioterapia', 'Farmácia', 'Administração Hospitalar'
]

const Profile = () => {
    const [editMode, setEditMode] = useState(false)
    const user = useSelector((state: any) => state.user)
    const [opened, { open, close }] = useDisclosure(false);
    const [profile, setProfile] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getDoctorProfile(user.profileId)
                setProfile(data)

                if (data.profilePictureId == null) {
                    setAvatarSrc(null)
                    return
                }

                const imageBlob = await downloadMediaFile(data.profilePictureId)
                const reader = new FileReader()
                reader.onloadend = () => {
                    setAvatarSrc(typeof reader.result === "string" ? reader.result : null)
                }
                reader.readAsDataURL(imageBlob)
            } catch (error) {
                console.log(error)
            }
        }

        loadProfile()
    }, [user.profileId]);

    const form = useForm({
        initialValues: {
            dob: profile.dob ?? '',
            phone: profile.phone ?? '',
            address: profile.address ?? '',
            licenseNumber: profile.licenseNumber ?? '',
            specialization: profile.specialization ?? '',
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
            totalExp: (value) => !value ? 'Informe seu tempo de experiência profissional!' : undefined,
        }
    });

    const handleUpdate = () => {
        const values = form.getValues()
        const validation = form.validate()

        if (validation.hasErrors) {
            return
        }

        setLoading(true)

        updateDoctorProfile({
            ...profile,
            dob: values.dob,
            phone: values.phone,
            address: values.address,
            licenseNumber: values.licenseNumber,
            specialization: values.specialization,
            department: values.department,
            totalExp: values.totalExp
        }).then((data) => {
            setProfile(data)
            setEditMode(false)
            sucessNotification("Perfil atualizado com sucesso!")
        }).catch((error) => {
            console.log(error)
            errorNotification(error.response.data.errorMessage)
        }).finally(() => setLoading(false))
    }

    const handleEdit = () => {
        form.setValues({
            dob: profile.dob ? new Date(profile.dob) : undefined,
            phone: profile.phone ?? '',
            address: profile.address ?? '',
            licenseNumber: profile.licenseNumber ?? '',
            specialization: profile.specialization ?? '',
            department: profile.department ?? '',
            totalExp: profile.totalExp ?? ''
        })
        setEditMode(true)
    }

    const handlePhotoUpload = async (files: File[]) => {
        const file = files[0]

        if (!file) {
            errorNotification("Nenhum arquivo selecionado!")
            return
        }

        close()
        setUploadingPhoto(true)

        try {
            const media = await uploadMediaFile(file)
            await updateDoctorPhoto(profile.idDoctor, media.id)
            setProfile((current: any) => ({ ...current, profilePictureId: media.id }))
            dispatch(setProfilePictureId(media.id))

            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarSrc(typeof reader.result === "string" ? reader.result : null)
            }
            reader.readAsDataURL(file)

            sucessNotification("Foto de perfil atualizada com sucesso!")
        } catch (error: any) {
            console.log(error)
            errorNotification(error.response?.data?.errorMessage ?? "Não foi possível atualizar a foto de perfil.")
        } finally {
            setUploadingPhoto(false)
        }
    }

    return (
        <div className="p-10">
            <div className="flex justify-between items-center">
                <div className="flex gap-5 items-center">
                    <div className="flex flex-col items-center ">
                        <Avatar variant="filled" src={avatarSrc ?? avatar} alt={user.name} size="200" className="mb-5" />
                        {editMode &&
                            <Button
                                size="sm"
                                onClick={open}
                                variant="filled"
                                loading={uploadingPhoto}
                                leftSection={<IconEdit />}
                            >
                                Upload
                            </Button>}
                    </div>
                    <div className="flex gap-3 flex-col">
                        <div className="text-3xl font-medium text-neutral-900">{user.name}</div>
                        <div className="text-xl text-neutral-700">{user.sub}</div>
                    </div>
                </div>
                {!editMode ? <Button size="md" onClick={handleEdit} variant="filled" leftSection={<IconEdit />}>Editar</Button> :
                    <Button size="md" onClick={handleUpdate} variant="filled" loading={loading} disabled={uploadingPhoto} leftSection={<IconEdit />}>Confirmar</Button>}
            </div>
            <Divider my="xl" />
            <div>
                <div className="text-2xl font-medium text-neutral-900">Informações pessoais</div>
                <div className="flex gap-10">
                    <Table striped stripedColor="primary.1" withRowBorders={false}>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Data de nascimento</Table.Th>
                                {editMode ? <Table.Td><DateInput label="Data de nascimento" locale="pt-br" placeholder="Selecione sua data de nascimento" {...form.getInputProps("dob")} /></Table.Td>
                                    : <Table.Td>{formatDate(profile.dob) ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Telefone</Table.Th>
                                {editMode ? <Table.Td><PhoneInput
                                    country={'br'} {...form.getInputProps("phone")}
                                /></Table.Td>
                                    : <Table.Td>{profile.phone ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Endereço</Table.Th>
                                {editMode ? <Table.Td><TextInput label="Endereço" placeholder="Endereço" {...form.getInputProps("address")} /></Table.Td>
                                    : <Table.Td>{profile.address ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Documento Profissional</Table.Th>
                                {editMode ? <Table.Td><TextInput label="Documento Profissional" placeholder="Ex: CRM" {...form.getInputProps("licenseNumber")} /></Table.Td>
                                    : <Table.Td>{profile.licenseNumber ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Especialização</Table.Th>
                                {editMode ? <Table.Td><Select label="Especialização" data={specializations} {...form.getInputProps("specialization")} /></Table.Td>
                                    : <Table.Td>{profile.specialization ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Departamento</Table.Th>
                                {editMode ? <Table.Td><Select label="Departamento" data={departments} {...form.getInputProps("department")} /></Table.Td>
                                    : <Table.Td>{profile.department ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="font-semibold text-xl">Tempo de experiência profissional</Table.Th>
                                {editMode ? <Table.Td><NumberInput label="Tempo de experiência profissional" maxLength={3} hideControls {...form.getInputProps("totalExp")} /></Table.Td>
                                    : <Table.Td>{profile.totalExp ?? '-'}</Table.Td>}</Table.Tr>
                        </Table.Tbody>
                    </Table>
                </div>
            </div>
            <Modal opened={opened} onClose={close} title={<span className="text-xl">Atualizar foto de perfil</span>}>
                <Dropzone
                    onDrop={handlePhotoUpload}
                    onReject={() => errorNotification("Selecione uma imagem PNG ou JPEG de até 5 MB.")}
                    maxSize={5 * 1024 ** 2}
                    accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
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
