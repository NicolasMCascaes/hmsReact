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

const getMediaFileUrl = (id: number | null | undefined) => {
    if (id == null) {
        return null
    }

    return `http://localhost:9000/media/${id}`
}

export { uploadMediaFile, getMediaFileUrl }
export type { MediaFileDto }
