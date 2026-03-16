import Header from '../components/Header/Header'
import SideBar from '../components/Admin/SideBar/SideBar'
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <div className='flex'>
        <SideBar/>
        <div className='w-full overflow-hidden flex flex-col'>
            <Header/>
            <Outlet />
        </div>  
    </div>
  )
}

export default AdminDashboard