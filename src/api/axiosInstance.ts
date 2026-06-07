import axios from 'axios'
import toast from 'react-hot-toast'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
export const TOKEN_KEY = 'token'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('user')
      toast.error('Session expired. Please log in again.')
      window.location.href = '/'
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Request failed'
    return Promise.reject(new Error(message))
  },
)

export default api
