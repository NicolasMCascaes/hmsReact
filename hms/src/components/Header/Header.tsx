import { ActionIcon } from '@mantine/core'
import { IconAdjustments, IconBellRinging, IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react'
import ProfileMenu from './ProfileMenu'

const Header = () => {
  return (
    <div className='bg-cyan-100 w-full h-16 flex justify-between px-5 items-center'> 
    <ActionIcon variant="transparent" aria-label="Settings" size="xl">
    <IconLayoutSidebarLeftCollapseFilled style={{ width: '90%', height: '90%' }} stroke={1.5} />
    </ActionIcon>

    <div className='flex gap-5 items-center'>
      <ActionIcon variant="transparent" aria-label="Settings" size="md">
    <IconBellRinging style={{ width: '90%', height: '90%' }} stroke={1.5} />
    </ActionIcon>
      <ProfileMenu/>
    </div>
    
    </div>
   
  )
}

export default Header