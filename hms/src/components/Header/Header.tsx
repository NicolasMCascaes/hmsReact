import { ActionIcon } from '@mantine/core'
import { IconAdjustments, IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react'
import ProfileMenu from './ProfileMenu'

const Header = () => {
  return (
    <div className='bg-cyan-100 h-16 flex justify-between items-center'> 
    <ActionIcon variant="transparent" aria-label="Settings" size="xl">
    <IconLayoutSidebarLeftCollapseFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
    <ProfileMenu/>
    </div>
   
  )
}

export default Header