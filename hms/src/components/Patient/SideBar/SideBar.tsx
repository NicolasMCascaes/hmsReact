import { Avatar, Text } from '@mantine/core'
import { IconCalendarCheck, IconHeartbeat, IconLayoutGrid, IconUser } from '@tabler/icons-react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { downloadMediaFile } from '../../../services/MediaService'
import { getPatientProfile } from '../../../services/PatientProfileService'
const Links = [
  { name: "Painel", url: "/patient/dashboard", icon: <IconLayoutGrid size = {20} stroke={1.5} /> },
  { name: "Perfil", url: "/patient/profile", icon: <IconUser size = {20} stroke={1.5} /> },
  { name: "Consultas", url: "/patient/appointments", icon: <IconCalendarCheck size = {20} stroke={1.5} /> },
  
]
const SideBar = ({collapsed}: {collapsed: boolean}) => {
  const user = useSelector((state:any)=> state.user)
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const collapsedAvatarSize = collapsed ? 50 : 80

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
  }, [user.profilePictureId])


  return (
    <div className='flex'>
      <div className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out`}>

      </div>
      <div className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out fixed bg-dark overflow-y-auto hide-scrollbar flex flex-col gap-7 items-center h-screen`}>
        <div className='fixed z-500 py-3 text-primary-400 bg-dark flex gap-1 items-center'>
          <IconHeartbeat size={40} stroke={2.5} />
          {!collapsed && <h2 className='text-3xl font-semibold'>Pulse</h2>}
        </div>
        <div className='flex flex-col gap-2 mt-20'>

          <div className='flex flex-col gap-1 items-center'>
            <div className='p-1 bg-white rounded-full shadow-lg'>
              <Avatar variant="filled" src={avatarSrc} alt="Nicolas" size={collapsedAvatarSize} />
            </div>
            { !collapsed && <span className='font-medium text-light'>{user.name}</span> }
            { !collapsed && <Text c="dimmed" size='xs' className='text-light'>{user.roles}</Text> }
          </div>
          <div className='flex flex-col gap-1'>
            {
              Links.map((link) => {
                return <NavLink to={link.url} key={link.url} className={({ isActive }) => `flex items-center  gap-3 ${!collapsed ? 'w-full ' : 'justify-center mt-2'} font-medium text-light px-4 py-5 rounded-lg ${isActive ? "bg-primary-400 text-dark" : "hover:bg-gray-100 hover:text-dark"}`}>
                  {link.icon}
                  {!collapsed && <span>{link.name}</span>}
                </NavLink>
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
