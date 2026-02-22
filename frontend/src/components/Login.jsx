import React, { useState } from 'react'
import { GraduationCap, Users, ShieldCheck, User, Lock } from 'lucide-react'
import { setToken as storeToken, setRole as storeRole, setUsername as storeUsername } from '../lib/auth'
import { apiFetch } from '../lib/api'

export default function Login({ onLogin, navigate }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const roles = [
    { key: 'student', label: 'Student', icon: GraduationCap },
    { key: 'faculty', label: 'Faculty', icon: Users },
    { key: 'admin', label: 'Admin', icon: ShieldCheck }
  ]
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [name, setName] = useState('')

  function validate() {
    if (!username) return 'University ID / Username is required'
    if (!password) return 'Password is required'
    return ''
  }

  async function submitLogin() {
    setError('')
    const v = validate()
    if (v) return setError(v)
    setLoading(true)
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.detail || 'Login failed')
        setLoading(false)
        return
      }
      const data = await res.json()
      const token = data.access_token
      if (!token) {
        setError('No token received')
        setLoading(false)
        return
      }
      storeToken(token)
      storeRole(role)
      storeUsername(username)
      onLogin && onLogin(token, role)
      navigate && navigate(role === 'faculty' ? 'faculty_dashboard' : 'student_dashboard')
    } catch (err) {
      setError('Network error')
    }
    setLoading(false)
  }

  async function submitRegister() {
    setError('')
    if (!name) return setError('Name is required')
    if (!username) return setError('Email is required')
    if (!password) return setError('Password is required')
    setLoading(true)
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          email: username,
          password: password,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.detail || 'Registration failed')
        setLoading(false)
        return
      }
      setMode('login')
      setError('Registration successful! Please sign in.')
    } catch (err) {
      setError('Network error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-slate-800">GradePulse</h1>
            <p className="text-sm text-slate-500 mt-1">Academic Excellence through Automation</p>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button onClick={() => setMode('login')} className={`px-4 py-2 rounded-xl font-semibold ${mode === 'login' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Sign In</button>
            <button onClick={() => setMode('register')} className={`px-4 py-2 rounded-xl font-semibold ${mode === 'register' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Sign Up</button>
          </div>

          {mode === 'register' && (
            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User className="w-4 h-4" /></div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="text-xs text-slate-400 uppercase tracking-wider">INSTITUTIONAL ROLE</label>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {roles.map((r) => {
                const Icon = r.icon
                const selected = role === r.key
                return (
                  <button
                    key={r.key}
                    onClick={() => setRole(r.key)}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all focus:outline-none ${selected ? 'bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}
                  >
                    <div className={`w-6 h-6 mb-2 flex items-center justify-center rounded ${selected ? '' : 'bg-white'}`}>
                      <Icon className={`w-4 h-4 ${selected ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-600'}`}>{r.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User className="w-4 h-4" /></div>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
            )}
            {mode === 'login' && (
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User className="w-4 h-4" /></div>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="University ID / Username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-4 h-4" /></div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>

            {error && <div className="text-sm text-rose-600">{error}</div>}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-slate-600">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
                <span>Remember me</span>
              </label>
              <button onClick={() => alert('Password reset flow not implemented')} className="text-indigo-600 font-medium">Forgot password?</button>
            </div>

            <button
              onClick={mode === 'login' ? submitLogin : submitRegister}
              disabled={loading}
              className="w-full mt-2 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {loading ? (mode === 'login' ? 'Signing in...' : 'Registering...') : (mode === 'login' ? 'Sign In to GradePulse →' : 'Sign Up →')}
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-slate-600">
          New to the platform? <button onClick={() => setMode('register')} className="text-indigo-600 font-medium">Sign Up</button>
        </div>
      </div>
    </div>
  )
}
