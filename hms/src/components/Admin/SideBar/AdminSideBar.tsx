import { Avatar, Text } from '@mantine/core'
import { IconBox, IconBrandCashapp, IconHeartbeat, IconLayoutGrid, IconMoodHeart, IconVaccine } from '@tabler/icons-react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
const Links = [
  { name: "Painel", url: "/admin/dashboard", icon: <IconLayoutGrid size = {20} stroke={1.5} /> },
  { name: "Pacientes", url: "/admin/patients", icon: <IconMoodHeart size = {20} stroke={1.5} /> },
  {name: "Médicos", url: "/admin/doctors", icon: <IconHeartbeat size = {20} stroke={1.5} /> },
  { name: "Medicamentos", url: "/admin/medicines", icon: <IconVaccine size = {20} stroke={1.5} /> },
  {name: "Estoque", url: "/admin/inventory", icon: <IconBox size = {20} stroke={1.5} /> },
  {name: "Vendas", url: "/admin/sales", icon: <IconBrandCashapp size = {20} stroke={1.5} /> },
]
const AdminSideBar = ({collapsed}: {collapsed: boolean}) => {
  const user = useSelector((state:any)=> state.user)
  const collapsedAvatarSize = collapsed ? 50 : 80
  return (
    <div className='flex'>
      <div className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out`}>

      </div>
      <div className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out fixed bg-dark overflow-y-auto hide-scrollbar flex flex-col gap-7 items-center h-screen`}>
        <div className='fixed z-500 py-3 text-primary-400 bg-dark flex gap-1 items-center'>
          <IconHeartbeat size={40} stroke={2.5} />
          {!collapsed && <h2 className='text-3xl font-semibold'>Pulse</h2>}
        </div>
        <div className='flex flex-col gap-2 mt-20'>

          <div className='flex flex-col gap-1 items-center'>
            <div className='p-1 bg-white rounded-full shadow-lg'>
              <Avatar variant="filled" src={undefined} alt="Nicolas" size={collapsedAvatarSize} />
            </div>
            { !collapsed && <span className='font-medium text-light'>{user.name}</span> }
            { !collapsed && <Text c="dimmed" size='xs' className='text-light'>{user.roles}</Text> }
          </div>
          <div className='flex flex-col gap-1'>
            {
              Links.map((link) => {
                return <NavLink to={link.url} key={link.url} className={({ isActive }) => `flex items-center  gap-3 ${!collapsed ? 'w-full ' : 'justify-center mt-2'} font-medium text-light px-4 py-5 rounded-lg ${isActive ? "bg-primary-400 text-dark" : "hover:bg-gray-100 hover:text-dark"}`}>
                  {link.icon}
                  {!collapsed && <span>{link.name}</span>}
                </NavLink>
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSideBar
