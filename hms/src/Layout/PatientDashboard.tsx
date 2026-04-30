import Header from '../components/Header/Header'

import { Outlet } from 'react-router-dom'
import SideBar from '../components/Patient/SideBar/SideBar'
import { useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'

const PatientDashboard = () => {
  const [collapsed, setCollapsed] = useState(false)
   const matches = useMediaQuery ('(min-width: 768px)');
  return (
    <div className='flex'>
        {matches && <SideBar collapsed={collapsed} />}
        <div className='w-full overflow-hidden flex flex-col'>
            <Header onToggleSideBar={() => setCollapsed(!collapsed)}/>
            <Outlet />
        </div>  
    </div>
  )
}

export default PatientDashboard
