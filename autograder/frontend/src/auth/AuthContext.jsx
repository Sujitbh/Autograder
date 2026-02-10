import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api/endpoints'
import { setTokens, clearTokens, getAccessToken } from '../api/axios'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch current user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken()
      if (token) {
        try {
          const response = await authAPI.me()
          setUser(response.data)
          localStorage.setItem('user', JSON.stringify(response.data))
        } catch (err) {
          console.error('Failed to fetch user:', err)
          clearTokens()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = useCallback(async (email, password) => {
    setError(null)
    try {
      const response = await authAPI.login(email, password)
      const { access_token, refresh_token, user: userData } = response.data
      
      setTokens(access_token, refresh_token)
      
      // Fetch user data if not returned with login
      let currentUser = userData
      if (!currentUser) {
        const meResponse = await authAPI.me()
        currentUser = meResponse.data
      }
      
      setUser(currentUser)
      localStorage.setItem('user', JSON.stringify(currentUser))
      
      return currentUser
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    setError(null)
    try {
      await authAPI.register(name, email, password)
      return true
    } catch (err) {
      const message = err.response?.data?.detail || 'Registration failed'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
    localStorage.removeItem('user')
  }, [])

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    clearError: () => setError(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
