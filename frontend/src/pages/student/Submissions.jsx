import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { submissionsAPI, assignmentsAPI } from '../../api/endpoints'
import {
  FileCode,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Calendar,
  ChevronRight,
  Filter,
} from 'lucide-react'

export default function StudentSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [sRes, aRes] = await Promise.all([
        submissionsAPI.list(),
        assignmentsAPI.list(),
      ])
      setSubmissions(sRes.data || [])
      setAssignments(aRes.data || [])
    } catch (err) {
      setError('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  const getAssignment = (assignmentId) => {
    return assignments.find(a => a.id === assignmentId)
  }

  const statusConfig = {
    graded: { icon: CheckCircle2, label: 'Graded', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    pending: { icon: Clock, label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100' },
    failed: { icon: XCircle, label: 'Failed', color: 'text-red-600', bg: 'bg-red-100' },
  }

  const filteredSubmissions = submissions
    .filter(s => filter === 'all' || s.status === filter)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

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
          <h1 className="text-2xl font-bold text-slate-800">My Submissions</h1>
          <p className="text-slate-500">Track all your assignment submissions</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="flex bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {['all', 'pending', 'graded', 'failed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              filter === f ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No submissions found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSubmissions.map(sub => {
              const assignment = getAssignment(sub.assignment_id)
              const cfg = statusConfig[sub.status] || statusConfig.pending
              const Icon = cfg.icon

              return (
                <Link
                  key={sub.id}
                  to={`/student/assignments/${sub.assignment_id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${cfg.bg}`}>
                      <Icon className={`w-6 h-6 ${cfg.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {assignment?.title || `Assignment ${sub.assignment_id}`}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-slate-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(sub.created_at).toLocaleString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {sub.score !== null && sub.score !== undefined && (
                      <div className="text-right">
                        <span className="text-2xl font-bold text-slate-800">{sub.score}</span>
                        <span className="text-slate-400">/{sub.max_score || 100}</span>
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
