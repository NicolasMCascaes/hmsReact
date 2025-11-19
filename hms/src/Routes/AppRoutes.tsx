import React from 'react'
import SideBar from '../components/SideBar/SideBar'
import Header from '../components/Header/Header'

const AppRoutes = () => {
  return (
        <div className='flex'>
        <SideBar/>
        <div className='w-full'>
            <Header/>
        </div>
        
    </div>
  )
}

export default AppRoutes