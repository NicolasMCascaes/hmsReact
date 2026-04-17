import { Menu, Text, Avatar } from '@mantine/core';
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { downloadMediaFile } from '../../services/MediaService';
import { getPatientProfile } from '../../services/PatientProfileService';

const ProfileMenu = () => {
  const user = useSelector((state:any)=> state.user)
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)

  useEffect(() => {
    const loadUserProfile = async () => {
       if (!user.profileId) {
        setAvatarSrc(null)
        return
      } 
      const data = await getPatientProfile(user.profileId)
      if (data.profilePictureId) {
        const imageBlob = await downloadMediaFile(data.profilePictureId)
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = reader.result as string
          setAvatarSrc(base64data)
        }
        if (imageBlob) {
          setAvatarSrc(typeof reader.result === "string" ? reader.result : null)
        }
        reader.readAsDataURL(imageBlob)
      }
    }

    loadUserProfile()
  }, [user.profilePictureId, user.profileId])
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
         <div className='flex items-center gap-3 cursor-pointer'>
           <span className='font-medium text-lg text-neutral-900'>{user.name}</span>
           <Avatar variant = "filled" src={avatarSrc} alt="Nicolas" size={50}/>
         </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Aplicação</Menu.Label>
        <Menu.Item leftSection={<IconSettings size={14} />}>
          Configurações
        </Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle size={14} />}>
          Mensagens
        </Menu.Item>
        <Menu.Item leftSection={<IconPhoto size={14} />}>
          Galeria
        </Menu.Item>
        <Menu.Item
          leftSection={<IconSearch size={14} />}
          rightSection={
            <Text size="xs" c="dimmed">
              ⌘K
            </Text>
          }
        >
          Pesquisar
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Zona de risco</Menu.Label>
        <Menu.Item
          leftSection={<IconArrowsLeftRight size={14} />}
        >
          Transferir meus dados
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={14} />}
        >
          Deletar minha conta
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
export default ProfileMenu