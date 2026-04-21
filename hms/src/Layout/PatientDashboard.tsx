import Header from '../components/Header/Header'

import { Outlet } from 'react-router-dom'
import SideBar from '../components/Patient/SideBar/SideBar'
import { useState } from 'react'

const PatientDashboard = () => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className='flex'>
        <SideBar collapsed={collapsed} />
        <div className='w-full overflow-hidden flex flex-col'>
            <Header onToggleSideBar={() => setCollapsed(!collapsed)}/>
            <Outlet />
        </div>  
    </div>
  )
}

export default PatientDashboard
