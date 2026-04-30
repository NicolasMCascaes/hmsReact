import Header from '../components/Header/Header'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import AdminSideBar from '../components/Admin/SideBar/AdminSideBar'

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false)
  const matches = useMediaQuery ('(min-width: 768px)');
  return (
    <div className='flex'>
        {matches && <AdminSideBar collapsed={collapsed} />}
        <div className='w-full overflow-hidden flex flex-col'>
            <Header onToggleSideBar={() => setCollapsed(!collapsed)}/>
            <Outlet />
        </div>  
    </div>
  )
}

export default AdminDashboard
