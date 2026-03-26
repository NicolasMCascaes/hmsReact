import axiosInstance from "../interceptor/AxiosInterceptor"

const createSaleItem = async (saleItem: any) => {
    return axiosInstance.post('/pharmacy/saleItem/create', saleItem).then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const deleteSaleItemById = async (itemId: number) => {
    return axiosInstance.delete('/pharmacy/saleItem/delete/'+itemId)
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const createMultipleSaleItems = async (saleItems: any[]) => {
    return axiosInstance.post('/pharmacy/saleItem/createMultipleSaleItems', saleItems).then((response:any) => response.data)
    .catch((error:any) => {throw error})
}
const getSaleItemsBySaleId = async (saleId: number) => {
    return axiosInstance.get('/pharmacy/saleItem/getBySaleId/'+saleId)
    .then((response:any) => response.data)
    .catch((error:any) => {throw error})
}

export {createSaleItem, deleteSaleItemById, createMultipleSaleItems, getSaleItemsBySaleId}