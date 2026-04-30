import Header from '../components/Header/Header'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import DoctorSideBar from '../components/Doctor/SideBar/DoctorSideBar'
import { useMediaQuery } from '@mantine/hooks'

const DoctorDashboard = () => {
  const [collapsed, setCollapsed] = useState(false)
   const matches = useMediaQuery ('(min-width: 768px)');
  return (
    <div className='flex'>
        {matches && <DoctorSideBar collapsed={collapsed}/>}
        <div className='w-full flex overflow-hidden flex-col'>
            <Header onToggleSideBar={() => setCollapsed(!collapsed)}/>
            <Outlet />
        </div>  
    </div>
  )
}

export default DoctorDashboard
