import axiosInstance from "../interceptor/AxiosInterceptor";
const getPatientProfile = async(id:any) =>{
    return axiosInstance.get('/profile/patient/get/' + id)
    .then((response: any) => response.data)
    .catch((error:any)=> {throw error})
}
const addPatientProfile = async(patient:any) =>{
    return axiosInstance.post('/profile/patient/add', patient)
    .then((response: any) => response.data)
    .catch((error:any)=> {throw error})
}
const updatePatientProfile = async(patient:any) =>{
    return axiosInstance.put('/profile/patient/update', patient)
    .then((response: any) => response.data)
    .catch((error:any)=> {throw error})
}

export {getPatientProfile, addPatientProfile, updatePatientProfile}
