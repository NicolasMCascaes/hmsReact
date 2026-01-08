import Header from '../components/Header/Header'

import { Outlet } from 'react-router-dom'
import SideBar from '../components/Patient/SideBar/SideBar'

const PatientDashboard = () => {
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

export default PatientDashboard