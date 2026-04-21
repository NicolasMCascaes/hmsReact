import axios, { type InternalAxiosRequestConfig } from "axios"
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_NGROK_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"
})
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) =>{
        if(config.headers){
            config.headers["ngrok-skip-browser-warning"] = "1"
            const token = localStorage.getItem('token')
            if(token){
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    }
)
export default axiosInstance
