import axiosInstance from "../interceptor/AxiosInterceptor"

const scheduleAppointment = (appointment:any) =>{
    return axiosInstance.post('http://localhost:9000/appointment/schedule', appointment)
    .then((response:any)=>{
        return response.data
    }).catch((error:any)=>{
        throw error
    })
}
const cancelAppointment = (id: any) =>{
    return axiosInstance.patch('/appointment/cancel/' + id).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const getAppointmentDetails = (appointmentId:any) => {
    return axiosInstance.get('/appointment/get/details/' + appointmentId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const getAppointment= (appointmentId:any) => {
    return axiosInstance.get('/appointment/get/' + appointmentId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const getAllAppointmentByPatient = (patientId: any) => {
    return axiosInstance.get('/appointment/getAll/details/' + patientId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}

export {scheduleAppointment, cancelAppointment, getAppointmentDetails, getAppointment, getAllAppointmentByPatient}