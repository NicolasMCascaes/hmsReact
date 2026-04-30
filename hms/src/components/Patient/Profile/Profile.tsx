import { Avatar, Button, Divider, Group, Modal, NumberInput, Select, Table, TagsInput, Text, TextInput } from "@mantine/core"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { IconEdit, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { DateInput } from '@mantine/dates';
import 'dayjs/locale/pt-br';
import PhoneInput from 'react-phone-input-2'
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { getPatientProfile, updatePatientPhoto, updatePatientProfile } from "../../../services/PatientProfileService";
import { formatDate } from "../../../utilities/DateUtility";
import { useForm } from "@mantine/form";
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility";
import { arrayToCsv } from "../../../utilities/OtherUtilities";
import { bloodGroup, bloodGroups } from "../../../data/DropDownData";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { downloadMediaFile, uploadMediaFile } from "../../../services/MediaService";
import { setProfilePictureId } from "../../../slices/UserSlice";

const Profile = () => {
    const [editMode, setEditMode] = useState(false)
    const user = useSelector((state: any) => state.user)
    const [opened, { open, close }] = useDisclosure(false);
    const [profile, setProfile] = useState<any>({})
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const dispatch = useDispatch()
    const matches = useMediaQuery('(min-width: 768px)');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getPatientProfile(user.profileId)
                setProfile({
                    ...data,
                    alergies: data.alergies ? JSON.parse(data.alergies) : [],
                    chronicDisease: data.chronicDisease ? JSON.parse(data.chronicDisease) : [],
                })

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
        const values = form.getValues()
        setLoading(true)

        updatePatientProfile({
            ...profile,
            dob: values.dob,
            phone: values.phone,
            address: values.address,
            cpf: values.cpf,
            bloodGroup: values.bloodGroup,
            alergies: values.alergies ? JSON.stringify(values.alergies) : null,
            chronicDisease: values.chronicDisease ? JSON.stringify(values.chronicDisease) : null
        }).then((data) => {
            setProfile({ ...data, ...values })
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
            cpf: profile.cpf ?? '',
            bloodGroup: profile.bloodGroup,
            chronicDisease: profile.chronicDisease ?? [],
            alergies: profile.alergies ?? []
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
            await updatePatientPhoto(profile.idPatient, media.id)
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
        <div className="p-4 sm:p-6 md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                    <div className="flex flex-col items-center">
                        <Avatar variant="filled" src={avatarSrc} alt={user.name} size={matches ? "200" : "100"} className="mb-5" />
                        {editMode &&
                            <Button
                                className="w-full"
                                size="sm"
                                onClick={open}
                                variant="filled"
                                loading={uploadingPhoto}
                                leftSection={<IconEdit />}
                            >
                                Upload
                            </Button>}
                    </div>
                    <div className="flex flex-col gap-2 text-center sm:text-left">
                        <div className="text-2xl font-medium text-neutral-900 md:text-3xl">{user.name}</div>
                        <div className="break-all text-base text-neutral-700 md:text-xl">{user.sub}</div>
                    </div>
                </div>
                {!editMode ? <Button className="w-full md:w-auto" size="md" onClick={handleEdit} variant="filled" leftSection={<IconEdit />}>Editar</Button> :
                    <Button className="w-full md:w-auto" size="md" onClick={handleUpdate} type="submit" variant="filled" loading={loading} disabled={uploadingPhoto} leftSection={<IconEdit />}>Confirmar</Button>}
            </div>
            <Divider my="xl" />
            <div>
                <div className="text-xl font-medium text-neutral-900 md:text-2xl">Informações pessoais</div>
                <div className="overflow-x-auto">
                    <Table striped stripedColor="primary.1" withRowBorders={false} className="min-w-[680px]">
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th className="whitespace-nowrap font-semibold text-base md:text-xl">Data de nascimento</Table.Th>
                                {editMode ? <Table.Td><DateInput label="Data de nascimento" locale="pt-br" placeholder="Selecione sua data de nascimento" {...form.getInputProps('dob')} /></Table.Td>
                                    : <Table.Td>{formatDate(profile.dob)}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="whitespace-nowrap font-semibold text-base md:text-xl">Telefone</Table.Th>
                                {editMode ? <Table.Td><PhoneInput
                                    country={'br'} {...form.getInputProps('phone')}
                                /></Table.Td>
                                    : <Table.Td>{profile.phone ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="whitespace-nowrap font-semibold text-base md:text-xl">Endereço</Table.Th>
                                {editMode ? <Table.Td><TextInput label="Endereço" placeholder="Endereço" {...form.getInputProps('address')} /></Table.Td>
                                    : <Table.Td>{profile.address ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="whitespace-nowrap font-semibold text-base md:text-xl">CPF</Table.Th>
                                {editMode ? <Table.Td><NumberInput label="CPF" placeholder="CPF" maxLength={11} hideControls {...form.getInputProps('cpf')}
                                /></Table.Td>
                                    : <Table.Td>{profile.cpf ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="whitespace-nowrap font-semibold text-base md:text-xl">Grupo Sanguíneo</Table.Th>
                                {editMode ? <Table.Td><Select label="Tipo sanguíneo" data={bloodGroup} {...form.getInputProps('bloodGroup')} /></Table.Td>
                                    : <Table.Td>{bloodGroups[profile.bloodGroup] ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="whitespace-nowrap font-semibold text-base md:text-xl">Alergias</Table.Th>
                                {editMode ? <Table.Td><TagsInput label="Alergias" {...form.getInputProps('alergies')} /></Table.Td>
                                    : <Table.Td>{arrayToCsv(profile.alergies) ?? '-'}</Table.Td>}</Table.Tr>
                            <Table.Tr>
                                <Table.Th className="whitespace-nowrap font-semibold text-base md:text-xl">Doenças Crônicas</Table.Th>
                                {editMode ? <Table.Td><TagsInput label="Doenças crônicas" {...form.getInputProps('chronicDisease')} /></Table.Td>
                                    : <Table.Td>{arrayToCsv(profile.chronicDisease) ?? '-'}</Table.Td>}</Table.Tr>
                        </Table.Tbody>
                    </Table>
                </div>
            </div>
            <Modal opened={opened} onClose={close} fullScreen={!matches} title={<span className="text-xl">Atualizar foto de perfil</span>}>
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
