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
const updatePatientPhoto = async(idPatient:any, profilePictureId:number) =>{
    return axiosInstance.put('/profile/patient/updatePhoto', { idPatient, profilePictureId })
    .then((response: any) => response.data)
    .catch((error:any)=> {throw error})
}
const getAllPatients = async() =>{
    return axiosInstance.get('/profile/patient/getAll')
    .then((response: any) => response.data)
    .catch((error:any)=> {throw error})
}
const getAllPatientsDropdown = async() =>{
    return axiosInstance.get('/profile/patient/getAllPatientsDropdown')
    .then((response: any) => response.data)
    .catch((error:any)=> {throw error})
}
export {getPatientProfile, addPatientProfile, updatePatientProfile, updatePatientPhoto, getAllPatients, getAllPatientsDropdown}
