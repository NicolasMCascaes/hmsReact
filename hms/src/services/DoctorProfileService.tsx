import axiosInstance from "../interceptor/AxiosInterceptor";
const getDoctorProfile = async(id:any) =>{
    return axiosInstance.get('/profile/doctor/get/' + id)
    .then((response: any) => response.data)
    .catch((error:any)=> {throw error})
}
const addDoctorProfile = async(doctor:any) =>{
    return axiosInstance.post('/profile/doctor/add', doctor)
    .then((response: any) => response.data)
    .catch((error:any)=> {throw error})
}
const updateDoctorProfile = async(doctor:any) =>{
    return axiosInstance.put('/profile/doctor/update', doctor)
    .then((response: any) => response.data)
    .catch((error:any)=> {throw error})
}
export {getDoctorProfile, addDoctorProfile, updateDoctorProfile}
