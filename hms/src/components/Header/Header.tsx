import { ActionIcon, Button } from '@mantine/core'
import { IconBellRinging, IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react'
import ProfileMenu from './ProfileMenu'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeJwt } from '../../slices/JwtSlice'
import { removeUser } from '../../slices/UserSlice'

const Header = () => {
  const jwt = useSelector((state:any)=> state.jwt)
  const dispatch = useDispatch();
  const handleLogout = () =>{
    console.log("logout")
    dispatch(removeJwt())
    dispatch(removeUser())

  }
  return (
    <div className='bg-light shadow-lg w-full h-16 flex justify-between px-5 items-center'> 
    <ActionIcon variant="transparent" aria-label="Settings" size="xl">
    <IconLayoutSidebarLeftCollapseFilled style={{ width: '90%', height: '90%' }} stroke={1.5} />
    </ActionIcon>

    <div className='flex gap-5 items-center'>
      {jwt?<Button color='red' onClick={handleLogout}>Logout</Button>:<Link to="login"><Button>Entrar</Button></Link>}
      { jwt&&<><ActionIcon variant="transparent" aria-label="Settings" size="md">
    <IconBellRinging style={{ width: '90%', height: '90%' }} stroke={1.5} />
    </ActionIcon>
      <ProfileMenu/></>}
    </div>
    
    </div>
   
  )
}

export default Header