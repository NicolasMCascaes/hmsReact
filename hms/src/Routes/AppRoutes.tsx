import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import AdminDashboard from '../Layout/AdminDashboard'
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import PublicRoute from "./PublicRoute"
import ProtectedRoute from "./ProtectedRoute"
import PatientDashboard from "../Layout/PatientDashboard"
import DoctorDashboard from "../Layout/DoctorDashboard"
import PatientProfilePage from "../pages/Patient/PatientProfilePage"
import DoctorProfilePage from "../pages/Doctor/DoctorProfilePage"
import DoctorAppointmentPage from "../pages/Doctor/DoctorAppointmentPage"
import PatientAppointmentPage from "../pages/Patient/PatientAppointmentPage"
import DoctorAppointmentDetailsPage from "../pages/Doctor/DoctorAppointmentDetailsPage"
import NotFoundPage from "../pages/NotFoundPage"
import AdminMedicinePage from "../pages/Admin/AdminMedicinePage"
import AdminInventoryPage from "../pages/Admin/AdminInventoryPage"
import AdminSalesPage from "../pages/Admin/AdminSalesPage"
import AdminPatientsPage from "../pages/Admin/AdminPatientsPage"
import AdminDashboradPage from "../pages/Admin/AdminDashboradPage"
import AdminDoctorsPage from "../pages/Admin/AdminDoctorsPage"
import DoctorDashboardPage from "../pages/Doctor/DoctorDashboardPage"
import PatientDashboardPage from "../pages/Patient/PatientDashboardPage"
import DoctorPharmacyPage from "../pages/Doctor/DoctorPharmacyPage"
import DoctorPatientsPage from "../pages/Doctor/DoctorPatientsPage"

const AppRoutes = () => {
  return (
    <BrowserRouter>
            <Routes>
              <Route path='/login' element={<PublicRoute><LoginPage/></PublicRoute>}/>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/register" element={<RegisterPage/>}/>
              <Route path='/admin' element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}>
                <Route path="dashboard" element={<AdminDashboradPage/>} />
                <Route path="medicines" element={<AdminMedicinePage/>} />
                <Route path="doctors" element={<AdminDoctorsPage/>} />
                <Route path="inventory" element={<AdminInventoryPage/>} />
                <Route path="patients" element={<AdminPatientsPage/>} />
                <Route path="sales" element={<AdminSalesPage/>} />
              </Route>
              <Route path='/patient' element={<ProtectedRoute><PatientDashboard/></ProtectedRoute>}>
                <Route path="dashboard" element={<PatientDashboardPage/>} />
                <Route path="profile" element={<PatientProfilePage/>} />
                <Route path="appointments" element={<PatientAppointmentPage/>} />
                
                
              </Route>
              <Route path='/doctor' element={<ProtectedRoute><DoctorDashboard/></ProtectedRoute>}>
                <Route path="dashboard" element={<DoctorDashboardPage/>} />
                <Route path="profile" element={<DoctorProfilePage/>} />
                <Route path="patients" element={<DoctorPatientsPage/>} />
                <Route path="appointments" element={<DoctorAppointmentPage/>} />
                <Route path="appointments/:idAppointment" element={<DoctorAppointmentDetailsPage/>} />
                <Route path="pharmacy" element={<DoctorPharmacyPage/>} />
              </Route>
              <Route path='*' element={<NotFoundPage/>} />
            </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes