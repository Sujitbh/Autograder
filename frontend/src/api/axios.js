import axios from 'axios'

// Use empty baseURL to leverage Vite's proxy in development
// In production, set VITE_API_URL to the actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management
let accessToken = localStorage.getItem('access_token')
let refreshToken = localStorage.getItem('refresh_token')

export const setTokens = (access, refresh = null) => {
  accessToken = access
  if (access) {
    localStorage.setItem('access_token', access)
  } else {
    localStorage.removeItem('access_token')
  }
  
  if (refresh !== null) {
    refreshToken = refresh
    if (refresh) {
      localStorage.setItem('refresh_token', refresh)
    } else {
      localStorage.removeItem('refresh_token')
    }
  }
}

export const getAccessToken = () => accessToken
export const getRefreshToken = () => refreshToken

export const clearTokens = () => {
  accessToken = null
  refreshToken = null
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}

// Request interceptor - attach Bearer token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and we have a refresh token, try to refresh
    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const { access_token, refresh_token: newRefresh } = response.data
        setTokens(access_token, newRefresh || refreshToken)
        
        processQueue(null, access_token)
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
