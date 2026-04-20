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
    return axiosInstance.get('/appointment/getAllByPatient/details/' + patientId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const getAllAppointmentByDoctor = (doctorId: any) => {
    return axiosInstance.get('/appointment/getAllByDoctor/details/' + doctorId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const createApReport = (apReport: any) =>{
    return axiosInstance.post('/appointment/report/create', apReport).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const reportExist = (appointmentId: any) =>{
    return axiosInstance.get('/appointment/report/isRecordExists/' + appointmentId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const getPatientReports = (patientId:any) =>{
    return axiosInstance.get('/appointment/report/getRecordsByPatientId/' + patientId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const getPrescriptionsByPatientId = (patientId:any) =>{
    return axiosInstance.get('/appointment/report/getPrescriptionsByPatientId/' + patientId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const getAllPrescriptionDetails = () =>{
    return axiosInstance.get('/appointment/report/getAllPrescriptionDetails').then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const getAllMedicinesByPrescriptionId = (id:any) =>{
    return axiosInstance.get('/appointment/report/getMedicinesByPrescriptionId/' + id).then((response: any) =>{
        return response.data 
    }).catch((error:any) => {
        throw error
    })
}
const countAppointmentsByPatientId = (patientId:any) =>{
    return axiosInstance.get('/appointment/getCurrentYearVisits/' + patientId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const countAllAppointmentsInCurrentYear = () =>{
    return axiosInstance.get('/appointment/getAppointmentCount').then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const countByReasonAndPatientId = (patientId: any) =>{
    return axiosInstance.get('/appointment/getByReasonAndPatientId/' + patientId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const countByReasonAndDoctorId = (doctorId: any) =>{
    return axiosInstance.get('/appointment/getByReasonAndDoctorId/' + doctorId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const countAllReasons = () => {
    return axiosInstance.get('/appointment/getReasonCount').then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const getAllMedicinesByPatientId = (patientId:any) =>{
    return axiosInstance.get('/appointment/report/getAllMedicinesByPatientId/' + patientId).then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const getAllTodaysAppointments = () => {
    return axiosInstance.get('/appointment/findAllTodayAppointments').then((response: any) =>{
        return response.data
    }).catch((error:any) => {
        throw error
    })
}
const getAllTodaysAppointmentsByDoctorId = (doctorId:any) => {
    return axiosInstance.get('/appointment/findAllTodayAppointmentsByDoctorId/' + doctorId).then((response: any) =>{
        return response.data}).catch((error:any) => {
            throw error
        })
}
const getAppointmentCountByDoctorId = (doctorId:any) => {
    return axiosInstance.get('/appointment/getAppointmentCountByDoctor/' + doctorId).then((response: any) =>{
        return response.data}).catch((error:any) => {
            throw error
    })
}
const getAllTodayAppointmentsByPatientId = (patientId:any) => {
    return axiosInstance.get('/appointment/findAllTodayAppointmentsByPatientId/' + patientId).then((response: any) =>{
        return response.data}).catch((error:any) => {
            throw error
        })
}



export {scheduleAppointment, cancelAppointment, getAppointmentDetails, getAppointment, getAllAppointmentByPatient, getAllAppointmentByDoctor, createApReport, reportExist, getPatientReports, getPrescriptionsByPatientId, getAllPrescriptionDetails, getAllMedicinesByPrescriptionId, countAppointmentsByPatientId, countAllAppointmentsInCurrentYear, countByReasonAndPatientId, countByReasonAndDoctorId, countAllReasons, getAllMedicinesByPatientId, getAllTodaysAppointments, getAllTodaysAppointmentsByDoctorId, getAppointmentCountByDoctorId, getAllTodayAppointmentsByPatientId}
