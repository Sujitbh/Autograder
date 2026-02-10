import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { assignmentsAPI, submissionsAPI } from '../../api/endpoints'
import {
  FileCode,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Calendar,
  Circle,
  Loader2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all, pending, completed, overdue

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [aRes, sRes] = await Promise.all([
        assignmentsAPI.list(),
        submissionsAPI.list(),
      ])
      setAssignments(aRes.data || [])
      setSubmissions(sRes.data || [])
    } catch (err) {
      setError('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const getStatus = (assignment) => {
    const sub = submissions.find(s => s.assignment_id === assignment.id)
    const now = new Date()
    const due = assignment.due_date ? new Date(assignment.due_date) : null
    
    if (sub?.status === 'graded') return 'completed'
    if (due && due < now) return 'overdue'
    if (sub?.status === 'pending') return 'pending'
    return 'not-started'
  }

  const statusConfig = {
    completed: { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    pending: { label: 'Pending Review', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    overdue: { label: 'Overdue', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    'not-started': { label: 'Not Started', icon: Circle, color: 'text-slate-400', bg: 'bg-slate-100' },
  }

  const filteredAssignments = assignments
    .filter(a => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
      if (filter !== 'all' && getStatus(a) !== filter) return false
      return true
    })
    .sort((a, b) => {
      // Sort by due date, then by status
      if (a.due_date && b.due_date) {
        return new Date(a.due_date) - new Date(b.due_date)
      }
      return 0
    })

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
          <h1 className="text-2xl font-bold text-slate-800">Assignments</h1>
          <p className="text-slate-500">View and submit your assignments</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
          />
        </div>
        <div className="flex bg-white border border-slate-200 rounded-xl p-1">
          {['all', 'not-started', 'pending', 'completed', 'overdue'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                filter === f ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'not-started' ? 'Not Started' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredAssignments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No assignments found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAssignments.map(assignment => {
              const status = getStatus(assignment)
              const cfg = statusConfig[status]
              const Icon = cfg.icon
              const sub = submissions.find(s => s.assignment_id === assignment.id)

              return (
                <Link
                  key={assignment.id}
                  to={`/student/assignments/${assignment.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <FileCode className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {assignment.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                        {assignment.due_date && (
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(assignment.due_date).toLocaleDateString()}
                          </span>
                        )}
                        {assignment.max_score && (
                          <span>{assignment.max_score} pts</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${cfg.bg}`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                      <span className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    {sub?.score !== undefined && sub?.score !== null && (
                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-800">{sub.score}</span>
                        <span className="text-slate-400">/{sub.max_score || assignment.max_score || 100}</span>
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-all" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
