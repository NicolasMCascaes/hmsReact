import { ActionIcon } from '@mantine/core'
import { IconBellRinging, IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react'
import ProfileMenu from './ProfileMenu'
import {useSelector } from 'react-redux'
const Header = () => {
  const jwt = useSelector((state:any)=> state.jwt)
  return (
    <div className='bg-light shadow-lg w-full h-16 flex justify-between px-5 items-center'> 
    <ActionIcon variant="transparent" aria-label="Settings" size="xl">
    <IconLayoutSidebarLeftCollapseFilled style={{ width: '90%', height: '90%' }} stroke={1.5} />
    </ActionIcon>

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