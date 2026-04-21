import { Menu, Avatar } from '@mantine/core';
import {
  IconPhoto,
  IconMessageCircle,
  IconArrowsLeftRight,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { downloadMediaFile } from '../../services/MediaService';
import { getPatientProfile } from '../../services/PatientProfileService';
import { getDoctorProfile } from '../../services/DoctorProfileService';
import { removeUser } from '../../slices/UserSlice';
import { removeJwt } from '../../slices/JwtSlice';

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const handleLogout = () =>{
    console.log("logout")
    dispatch(removeJwt())
    dispatch(removeUser())

  }
  const user = useSelector((state:any)=> state.user)
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user.profileId) {
        setAvatarSrc(null)
        return
      }

      const data = user.roles === 'DOCTOR'
        ? await getDoctorProfile(user.profileId)
        : await getPatientProfile(user.profileId)

      if (data.profilePictureId) {
        const imageBlob = await downloadMediaFile(data.profilePictureId)
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarSrc(typeof reader.result === "string" ? reader.result : null)
        }
        reader.readAsDataURL(imageBlob)
        return
      }

      setAvatarSrc(null)
    }

    loadUserProfile()
  }, [user.profilePictureId, user.profileId, user.roles])
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
         <div className='flex items-center gap-3 cursor-pointer'>
           <span className='font-medium text-lg text-neutral-900'>{user.name}</span>
           <Avatar variant = "filled" src={avatarSrc} alt={user.name} size={50}/>
         </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Aplicação</Menu.Label>
        
        <Menu.Item leftSection={<IconMessageCircle size={14} />}>
          Mensagens
        </Menu.Item>
        <Menu.Item leftSection={<IconPhoto size={14} />}>
          Galeria
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
          leftSection={<IconArrowLeft size={14} />}
          onClick={handleLogout}
        >
          Sair
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
export default ProfileMenu
