import React from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../auth'
import { 
  LayoutDashboard, 
  BookOpen, 
  Code2, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  ShieldCheck,
  GraduationCap,
  FileText,
  ClipboardCheck,
} from 'lucide-react'

const menuItems = {
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { id: 'assignments', label: 'My Assignments', icon: BookOpen, path: '/student/assignments' },
    { id: 'grades', label: 'My Grades', icon: GraduationCap, path: '/student/submissions' },
  ],
  faculty: [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/faculty/dashboard' },
    { id: 'classes', label: 'Classes', icon: Users, path: '/faculty/classes' },
    { id: 'assignments', label: 'Assignments', icon: Code2, path: '/faculty/assignments' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/faculty/grading' },
  ],
  admin: [
    { id: 'dashboard', label: 'Admin Panel', icon: ShieldCheck, path: '/admin/dashboard' },
    { id: 'config', label: 'System Config', icon: Settings, path: '/admin/config' },
    { id: 'logs', label: 'Security Logs', icon: ShieldCheck, path: '/admin/logs' },
  ]
}

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const currentMenuItems = menuItems[user?.role] || menuItems.student

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">A</div>
          <span className="text-xl font-bold tracking-tight">Autograder</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {currentMenuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center p-3 mb-4 bg-slate-800/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold mr-3 uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role || 'student'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg text-sm transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-800">Welcome back, {user?.name || 'User'}</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-500">Academic Year 2024/25</div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
