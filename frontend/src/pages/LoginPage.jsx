import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
import {
  GraduationCap,
  Users,
  ShieldCheck,
  User,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react'

const ROLES = [
  { key: 'student', label: 'Student', icon: GraduationCap, color: 'indigo' },
  { key: 'faculty', label: 'Faculty', icon: Users, color: 'violet' },
  { key: 'admin', label: 'Admin', icon: ShieldCheck, color: 'rose' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, error, clearError } = useAuth()
  
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [selectedRole, setSelectedRole] = useState('student')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setLocalError('')
    clearError()
  }

  const validateForm = () => {
    if (mode === 'register' && !formData.name.trim()) {
      return 'Name is required'
    }
    if (!formData.email.trim()) {
      return 'Email / Username is required'
    }
    if (!formData.password) {
      return 'Password is required'
    }
    if (mode === 'register' && formData.password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setLocalError(validationError)
      return
    }

    setLoading(true)
    setLocalError('')

    try {
      if (mode === 'register') {
        await register(formData.name, formData.email, formData.password)
        setMode('login')
        setLocalError('')
        // Show success message
        alert('Registration successful! Please sign in.')
      } else {
        const user = await login(formData.email, formData.password)
        
        // Navigate based on role (backend determines role, but we can use selected as fallback)
        const role = user?.role || selectedRole
        const from = location.state?.from?.pathname
        const redirectPath = from || (
          role === 'admin' ? '/admin/dashboard' :
          role === 'faculty' ? '/faculty/dashboard' :
          '/student/dashboard'
        )
        navigate(redirectPath, { replace: true })
      }
    } catch (err) {
      setLocalError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Autograder</h1>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {ROLES.map((role) => {
              const Icon = role.icon
              const isSelected = selectedRole === role.key
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => setSelectedRole(role.key)}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${isSelected
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{role.label}</span>
                </button>
              )
            })}
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {displayError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {mode === 'register' ? 'Email' : 'University ID / Email'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={mode === 'register' ? 'john@university.edu' : 'Enter your ID or email'}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login')
                  setLocalError('')
                  clearError()
                }}
                className="ml-1 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          © 2026 Autograder. All rights reserved.
        </p>
      </div>
    </div>
  )
}
