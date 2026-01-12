import Header from '../components/Header/Header'
import SideBar from '../components/Doctor/SideBar/SideBar'
import { Outlet } from 'react-router-dom'

const DoctorDashboard = () => {
  return (
    <div className='flex'>
        <SideBar/>
        <div className='w-full flex overflow-hidden flex-col'>
            <Header/>
            <Outlet />
        </div>  
    </div>
  )
}

export default DoctorDashboard