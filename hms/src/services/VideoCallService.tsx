import axiosInstance from "../interceptor/AxiosInterceptor"

const basePath = "/videocalls"

const createVideoCall = async (data: any) => {
    return axiosInstance.post(`${basePath}/create`, data)
        .then((response: any) => response.data)
        .catch((error: any) => { throw error })
}

const getAllByCaller = async (callerId: string) => {
    return axiosInstance.get(`${basePath}/getAllByCaller/${callerId}`)
        .then((response: any) => response.data)
        .catch((error: any) => { throw error })
}

const getAllByReceiver = async (receiverId: string) => {
    return axiosInstance.get(`${basePath}/getAllByReceiver/${receiverId}`)
        .then((response: any) => response.data)
        .catch((error: any) => { throw error })
}

const acceptVideoCall = async (callId: number) => {
    return axiosInstance.patch(`${basePath}/accept/${callId}`)
        .then((response: any) => response.data)
        .catch((error: any) => { throw error })
}
const initiateVideoCall = async (callId: number) => {
    return axiosInstance.patch(`${basePath}/initiate/${callId}`)
        .then((response: any) => response.data)
        .catch((error: any) => { throw error })
}
const endVideoCall = async (callId: number) => {
    return axiosInstance.patch(`${basePath}/end/${callId}`)
        .then((response: any) => response.data)
        .catch((error: any) => { throw error })
}

export { acceptVideoCall, createVideoCall, getAllByCaller, getAllByReceiver, initiateVideoCall, endVideoCall }
