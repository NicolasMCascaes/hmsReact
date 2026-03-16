import axiosInstance from "../interceptor/AxiosInterceptor"

const addMedicine = async (medicine: any) => {
    return axiosInstance.post('/pharmacy/medicine/add', medicine)
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const getMedicineById = async (id:any) => {
    return axiosInstance.get('/pharmacy/getMedicineById/' + id)
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const getAllMedicines = async () => {
    return axiosInstance.get('/pharmacy/medicine/getAllMedicines')
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const updateMedicine = async (medicine:any) => {
    return axiosInstance.patch('/pharmacy/medicine/update', medicine)
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
export {addMedicine, getMedicineById, getAllMedicines, updateMedicine}