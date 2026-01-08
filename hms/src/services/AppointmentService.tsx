import axiosInstance from "../interceptor/AxiosInterceptor"

const scheduleAppointment = (appointment:any) =>{
    return axiosInstance.post('http://localhost:9000/appointment/schedule', appointment)
    .then((response:any)=>{
        response.data
    }).catch((error:any)=>{
        throw error
    })
}
export {scheduleAppointment}