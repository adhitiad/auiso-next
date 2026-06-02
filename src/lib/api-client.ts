import axios from "axios"

export const vodApi = axios.create({
  baseURL: process.env.VOD_API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
})

export const peertubeApi = axios.create({
  baseURL: process.env.PEERTUBE_API_URL,
  timeout: 15000,
})

// Request interceptor untuk auth
vodApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
