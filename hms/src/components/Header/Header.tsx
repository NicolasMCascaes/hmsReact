import { ActionIcon } from '@mantine/core'
import { IconBellRinging, IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react'
import ProfileMenu from './ProfileMenu'
import {useSelector } from 'react-redux'
import SideDrawer from '../SideDrawer/SideDrawer'
import { useMediaQuery } from '@mantine/hooks'
const Header = ({onToggleSideBar}: {onToggleSideBar: () => void}) => {
  const jwt = useSelector((state:any)=> state.jwt)
  const user = useSelector((state:any)=> state.user)
  const matches = useMediaQuery('(min-width: 768px)');
  return (
    <div className='bg-light shadow-lg w-full h-16 flex justify-between px-5 items-center'> 
    {matches ? (
      <ActionIcon onClick={onToggleSideBar} variant="transparent" aria-label="Settings" size="xl">
        <IconLayoutSidebarLeftCollapseFilled style={{ width: '90%', height: '90%' }} stroke={1.5} />
      </ActionIcon>
    ) : <div><SideDrawer user={user.roles}/></div>}
    <div className='flex gap-5 items-center'>
      { jwt&&<><ActionIcon variant="transparent" aria-label="Settings" size="md">
    <IconBellRinging style={{ width: '90%', height: '90%' }} stroke={1.5} />
    </ActionIcon>
      <ProfileMenu/></>}
    </div>
    
    </div>
   
  )
}

export default Header
