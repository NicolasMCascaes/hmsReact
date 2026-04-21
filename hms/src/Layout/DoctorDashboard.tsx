import Header from '../components/Header/Header'
import SideBar from '../components/Doctor/SideBar/SideBar'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

const DoctorDashboard = () => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className='flex'>
        <SideBar collapsed={collapsed}/>
        <div className='w-full flex overflow-hidden flex-col'>
            <Header onToggleSideBar={() => setCollapsed(!collapsed)}/>
            <Outlet />
        </div>  
    </div>
  )
}

export default DoctorDashboard
