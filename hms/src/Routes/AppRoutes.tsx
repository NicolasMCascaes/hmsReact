import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import Random from '../components/Random'
import AdminDashboard from '../Layout/AdminDashboard'
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="dashboard" element={<Random />} />
          <Route path="pharmacy" element={<Random />} />
          <Route path="doctors" element={<Random />} />
          <Route path="appointments" element={<Random />} />
          <Route path="patients" element={<Random />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes