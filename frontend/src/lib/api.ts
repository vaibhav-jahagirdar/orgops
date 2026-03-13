import axios from "axios"
import { error } from "console"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  async(error) => {
    const originalRequest = error.config
    if(
    error.response?.status === 401 
    && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await api.post("/auth/refresh")
        return api(originalRequest)
      } catch (refreshError) {
        window.location.href = "/login"
        return Promise.reject(refreshError)
        
      }
    }

    return Promise.reject(error)
  }
  
)