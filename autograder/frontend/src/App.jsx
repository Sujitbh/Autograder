import React, { useState } from 'react'
import './App.css'
import Layout from './components/Layout'
import StudentDashboard from './components/StudentDashboard'
import CodeWorkspace from './components/CodeWorkspace'
import FacultyDashboard from './components/FacultyDashboard'
import AISubmissionAnalyzer from './components/AISubmissionAnalyzer'
import AssignmentCreator from './components/AssignmentCreator'
import AdminPanel from './components/AdminPanel'
import Login from './components/Login'
import { getToken, getRole, clearAuth } from './lib/auth'
import { Plus } from 'lucide-react'

const MOCK_ASSIGNMENT = {
  id: '1',
  title: 'Binary Tree Implementation',
  description: 'Implement a BST in Python.',
  language: 'python',
  dueDate: '2024-12-01',
  totalPoints: 100,
  starterCode: 'class Node:\n    def __init__(self, key):\n        self.left = None\n        self.right = None\n        self.val = key\n\n# Your code here',
  status: 'active',
  rubric: [
    { id: '1', criterion: 'Insertion Logic', points: 40, description: 'Correctly places nodes based on values.' },
    { id: '2', criterion: 'Search Efficiency', points: 30, description: 'Implementation stays O(log n).' },
    { id: '3', criterion: 'Code Cleanliness', points: 30, description: 'PEP8 compliance and comments.' }
  ],
  testCases: [
    { id: '1', input: 'insert 5, 3, 7', expectedOutput: 'Tree rooted at 5', isPublic: true },
    { id: '2', input: 'search 3', expectedOutput: 'Found', isPublic: true },
    { id: '3', input: 'delete 5', expectedOutput: 'Success', isPublic: false }
  ]
}

function App() {
  const token = getToken()
  const storedRole = getRole()
  const [user, setUser] = useState(token ? { id: 'u1', name: 'Sarah Drasner', email: 'sarah@university.edu', role: storedRole || 'faculty' } : null)
  const [view, setView] = useState(user ? 'dashboard' : 'login')
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)

  const handleRoleChange = (role) => {
    setUser({ ...user, role })
    setView('dashboard')
  }

  const handleLogout = () => {
    clearAuth()
    setUser(null)
    setView('login')
  }

  const renderContent = () => {
    if (!user) {
      return <Login onLogin={(token, role) => {
        setUser({ id: 'u1', name: 'Sarah Drasner', email: 'sarah@university.edu', role })
        setView(role === 'faculty' ? 'dashboard' : 'dashboard')
      }} navigate={(target) => setView(target === 'faculty_dashboard' ? 'dashboard' : 'dashboard')} />
    }
    if (view === 'workspace') {
      return <CodeWorkspace assignment={MOCK_ASSIGNMENT} onBack={() => setView('dashboard')} />
    }

    switch (user.role) {
      case 'student':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-indigo-600 p-8 rounded-3xl text-white flex justify-between items-center shadow-xl shadow-indigo-100">
              <div>
                <h2 className="text-2xl font-bold">In Progress: {MOCK_ASSIGNMENT.title}</h2>
                <p className="opacity-80">You have 3 days remaining to submit this assignment.</p>
              </div>
              <button 
                onClick={() => setView('workspace')}
                className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg"
              >
                Resume Coding
              </button>
            </div>
            <StudentDashboard />
          </div>
        )
      case 'faculty':
        return (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Faculty Control Center</h2>
                <p className="text-slate-500">Manage your classes and AI-assisted grading.</p>
              </div>
              <button 
                onClick={() => setIsCreatorOpen(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Plus className="w-5 h-5" />
                <span>Create Assignment</span>
              </button>
            </div>
            <FacultyDashboard />
            <AISubmissionAnalyzer />
            {isCreatorOpen && <AssignmentCreator onClose={() => setIsCreatorOpen(false)} onSave={() => setIsCreatorOpen(false)} />}
          </div>
        )
      case 'admin':
        return <AdminPanel />
      default:
        return <div>Access Denied</div>
    }
  }

  return (
    <Layout user={user} onRoleChange={handleRoleChange} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </Layout>
  )
}

export default App
