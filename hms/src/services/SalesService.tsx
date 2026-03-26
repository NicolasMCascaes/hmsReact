import axiosInstance from "../interceptor/AxiosInterceptor"

const createSale = async (sale: any) => {
    return axiosInstance.post('/pharmacy/sales/create', sale).then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const updateSale = async (sale: any) => {
    return axiosInstance.patch('/pharmacy/sales/update', sale).then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const deleteSaleByPrescriptionId = async (prescriptionId: number) => {
    return axiosInstance.delete('/pharmacy/sales/delete/'+prescriptionId)
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const getSaleById = async (saleId: number) => {
    return axiosInstance.get('/pharmacy/sales/getById/'+saleId)
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const getSaleByPrescriptionId = async (prescriptionId: number) => {
    return axiosInstance.get('/pharmacy/sales/getByPrescriptionId/'+prescriptionId)
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
export {createSale, updateSale, deleteSaleByPrescriptionId, getSaleById, getSaleByPrescriptionId}