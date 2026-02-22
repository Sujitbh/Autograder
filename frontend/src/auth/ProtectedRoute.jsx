import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Loader2 } from 'lucide-react'

// Generic protected route - requires authentication
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// Role-based protected route
export function RoleRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = 
      user?.role === 'admin' ? '/admin/dashboard' :
      user?.role === 'faculty' ? '/faculty/dashboard' :
      '/student/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return children
}

// Redirect authenticated users away from login
export function PublicRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (isAuthenticated && user) {
    const from = location.state?.from?.pathname
    const redirectPath = from || (
      user.role === 'admin' ? '/admin/dashboard' :
      user.role === 'faculty' ? '/faculty/dashboard' :
      '/student/dashboard'
    )
    return <Navigate to={redirectPath} replace />
  }

  return children
}
