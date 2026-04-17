import React, { useState, useEffect } from 'react'
import { authAPI } from '../../api/endpoints'
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  GraduationCap,
  BookOpen,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from 'lucide-react'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [actionMenu, setActionMenu] = useState(null)
  const [processing, setProcessing] = useState(new Set())

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.getUsers()
      setUsers(res.data || [])
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    setProcessing(prev => new Set([...prev, userId]))
    try {
      await authAPI.updateUserRole(userId, newRole)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      setActionMenu(null)
    } catch (err) {
      setError('Failed to update role')
    } finally {
      setProcessing(prev => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }
  }

  const handleToggleActive = async (userId, currentlyActive) => {
    setProcessing(prev => new Set([...prev, userId]))
    try {
      if (currentlyActive) {
        await authAPI.deactivateUser(userId)
      } else {
        await authAPI.activateUser(userId)
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentlyActive } : u))
      setActionMenu(null)
    } catch (err) {
      setError('Failed to update user status')
    } finally {
      setProcessing(prev => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }
  }

  const roleConfig = {
    admin: { icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Admin' },
    faculty: { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Faculty' },
    student: { icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Student' },
  }

  const filtered = users.filter(u => {
    const matchesSearch = !search || 
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    students: users.filter(u => u.role === 'student').length,
    faculty: users.filter(u => u.role === 'faculty').length,
    admins: users.filter(u => u.role === 'admin').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500">Manage users, roles, and system settings</p>
        </div>
        <button
          onClick={loadUsers}
          className="flex items-center space-x-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-100 rounded-xl">
              <Users className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
              <p className="text-sm text-slate-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.students}</p>
              <p className="text-sm text-slate-500">Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.faculty}</p>
              <p className="text-sm text-slate-500">Faculty</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-100 rounded-xl">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.admins}</p>
              <p className="text-sm text-slate-500">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex bg-white border border-slate-200 rounded-xl p-1">
          {['all', 'student', 'faculty', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                roleFilter === r ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Joined</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(user => {
                const roleCfg = roleConfig[user.role] || roleConfig.student
                const RoleIcon = roleCfg.icon
                const isProcessing = processing.has(user.id)

                return (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-lg ${roleCfg.bg} ${roleCfg.color}`}>
                          {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </div>
                        <span className="font-medium text-slate-700">
                          {user.name || 'No name'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${roleCfg.bg} ${roleCfg.color}`}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {roleCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                        user.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {user.is_active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-4 text-right relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)}
                        disabled={isProcessing}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <MoreVertical className="w-4 h-4" />
                        )}
                      </button>

                      {actionMenu === user.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1">
                          <div className="px-3 py-2 text-xs font-medium text-slate-400 uppercase">
                            Change Role
                          </div>
                          {['student', 'faculty', 'admin'].map(role => (
                            <button
                              key={role}
                              onClick={() => handleRoleChange(user.id, role)}
                              disabled={user.role === role}
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2 ${
                                user.role === role ? 'text-slate-400' : 'text-slate-700'
                              }`}
                            >
                              {React.createElement(roleConfig[role].icon, { className: 'w-4 h-4' })}
                              <span>{roleConfig[role].label}</span>
                              {user.role === role && (
                                <CheckCircle2 className="w-4 h-4 ml-auto text-indigo-600" />
                              )}
                            </button>
                          ))}
                          <div className="border-t border-slate-100 my-1" />
                          <button
                            onClick={() => handleToggleActive(user.id, user.is_active)}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2 ${
                              user.is_active ? 'text-red-600' : 'text-emerald-600'
                            }`}
                          >
                            {user.is_active ? (
                              <>
                                <UserX className="w-4 h-4" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Click outside to close menu */}
      {actionMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActionMenu(null)}
        />
      )}
    </div>
  )
}
