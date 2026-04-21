import Header from '../components/Header/Header'
import SideBar from '../components/Admin/SideBar/SideBar'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

const AdminDashboard = () => {
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

export default AdminDashboard
