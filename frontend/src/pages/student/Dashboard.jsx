import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { assignmentsAPI, submissionsAPI } from '../../api/endpoints'
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react'

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [assignRes, subRes] = await Promise.all([
        assignmentsAPI.list().catch(() => ({ data: [] })),
        submissionsAPI.list().catch(() => ({ data: [] })),
      ])
      setAssignments(assignRes.data || [])
      setSubmissions(subRes.data || [])
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Stats calculations
  const pendingCount = assignments.filter(a => {
    const sub = submissions.find(s => s.assignment_id === a.id && s.status === 'graded')
    return !sub
  }).length
  
  const completedCount = submissions.filter(s => s.status === 'graded').length
  
  const avgGrade = submissions.length > 0
    ? Math.round(
        submissions
          .filter(s => s.score != null)
          .reduce((acc, s) => acc + (s.score / (s.max_score || 100)) * 100, 0) /
        (submissions.filter(s => s.score != null).length || 1)
      )
    : 0

  // Active assignments (not yet submitted or graded)
  const activeAssignments = assignments.filter(a => {
    const sub = submissions.find(s => s.assignment_id === a.id && s.status === 'graded')
    return !sub
  }).slice(0, 5)

  const getLanguageColor = (lang) => {
    const colors = {
      python: 'bg-blue-500',
      java: 'bg-orange-500',
      cpp: 'bg-purple-500',
      c: 'bg-gray-500',
      javascript: 'bg-yellow-500',
    }
    return colors[lang?.toLowerCase()] || 'bg-indigo-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{pendingCount}</h3>
          <p className="text-slate-500 text-sm">Assignments due this week</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{completedCount}</h3>
          <p className="text-slate-500 text-sm">Graded submissions</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Grade</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{avgGrade}%</h3>
          <p className="text-slate-500 text-sm">Cumulative performance</p>
        </div>
      </div>

      {/* Active Assignments */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Active Assignments</h2>
          <Link to="/student/assignments" className="text-indigo-600 text-sm font-semibold hover:underline">
            View All
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {activeAssignments.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active assignments</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            activeAssignments.map((assign) => (
              <div key={assign.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${getLanguageColor(assign.language)}`}>
                    {assign.language?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{assign.title}</h4>
                    <p className="text-sm text-slate-500">
                      Due: {assign.due_date ? new Date(assign.due_date).toLocaleDateString() : 'No deadline'} • {assign.total_points || 100} Points
                    </p>
                  </div>
                </div>
                <Link 
                  to={`/student/assignments/${assign.id}`}
                  className="flex items-center space-x-2 bg-slate-100 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl transition-all font-medium text-slate-700"
                >
                  <span>Open Editor</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
