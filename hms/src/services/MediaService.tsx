import axiosInstance from "../interceptor/AxiosInterceptor";

interface MediaFileDto {
    id: number
    name: string
    type: string
    size: number
}

const uploadMediaFile = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    return axiosInstance.post<MediaFileDto>("/media/save", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
        .then((response) => response.data)
        .catch((error) => { throw error })
}

const downloadMediaFile = async (id: number) => {
    return axiosInstance.get(`/media/${id}`, {
        responseType: "blob",
    })
        .then((response) => response.data)
        .catch((error) => { throw error })
}

const getMediaFileUrl = (id: number | null | undefined) => {
    if (id == null) {
        return null
    }

    return `${axiosInstance.defaults.baseURL}/media/${id}`
}

export { uploadMediaFile, downloadMediaFile, getMediaFileUrl }
export type { MediaFileDto }
