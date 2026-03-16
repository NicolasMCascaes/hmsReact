import axiosInstance from "../interceptor/AxiosInterceptor"

const addStock = async (medicine: any) => {
    return axiosInstance.post('/pharmacy/inventory/addMedicine', medicine)
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const getStockById = async (id:any) => {
    return axiosInstance.get('/pharmacy/inventory/getMedicineById/'+id)
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const getAllStock = async () => {
    return axiosInstance.get('/pharmacy/inventory/getAllMedicines')
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const updateStockInventory = async (medicine:any) => {
    return axiosInstance.patch('/pharmacy/inventory/updateMedicine', medicine)
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
export {addStock, getStockById, getAllStock, updateStockInventory}