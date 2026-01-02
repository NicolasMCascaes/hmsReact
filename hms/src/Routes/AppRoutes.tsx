import {BrowserRouter, Route, Routes} from "react-router-dom"
import Random from '../components/Random'
import AdminDashboard from '../Layout/AdminDashboard'
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import PublicRoute from "./PublicRoute"
import ProtectedRoute from "./ProtectedRoute"
import PatientDashboard from "../Layout/PatientDashboard"
import DoctorDashboard from "../Layout/DoctorDashboard"
import PatientProfilePage from "../pages/PatientProfilePage"
import DoctorProfilePage from "../pages/DoctorProfilePage"

const AppRoutes = () => {
  return (
    <BrowserRouter>
            <Routes>
              <Route path='/login' element={<PublicRoute><LoginPage/></PublicRoute>}/>
              <Route path="/register" element={<RegisterPage/>}/>
              <Route path='/' element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}>
                <Route path="/dashboard" element={<Random/>} />
                <Route path="/pharmacy" element={<Random/>} />
                <Route path="/doctors" element={<Random/>} />
                <Route path="/appointments" element={<Random/>} />
                <Route path="/patients" element={<Random/>} />
                <Route path="/doctors" element={<Random/>} />
              </Route>
              <Route path='/patient' element={<ProtectedRoute><PatientDashboard/></ProtectedRoute>}>
                <Route path="dashboard" element={<Random/>} />
                <Route path="profile" element={<PatientProfilePage/>} />
                <Route path="appointments" element={<Random/>} />
                
                
              </Route>
              <Route path='/doctor' element={<ProtectedRoute><DoctorDashboard/></ProtectedRoute>}>
                <Route path="dashboard" element={<Random/>} />
                <Route path="doctors" element={<Random/>} />
                <Route path="profile" element={<DoctorProfilePage/>} />
                <Route path="patients" element={<Random/>} />
                <Route path="appointments" element={<Random/>} />
                <Route path="pharmacy" element={<Random/>} />
              </Route>
            </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes