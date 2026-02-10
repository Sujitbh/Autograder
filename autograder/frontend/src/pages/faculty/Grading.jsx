import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { submissionsAPI, assignmentsAPI, gradingAPI } from '../../api/endpoints'
import {
  FileCode,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Zap,
  Filter,
  Play,
  Eye,
} from 'lucide-react'

export default function FacultyGrading() {
  const [submissions, setSubmissions] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('pending')
  const [gradingIds, setGradingIds] = useState(new Set())

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
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleGrade = async (submissionId) => {
    setGradingIds(prev => new Set([...prev, submissionId]))
    try {
      await gradingAPI.gradeSubmission(submissionId)
      await loadData()
    } catch (err) {
      setError('Failed to grade submission')
    } finally {
      setGradingIds(prev => {
        const next = new Set(prev)
        next.delete(submissionId)
        return next
      })
    }
  }

  const handleGradeAll = async () => {
    const pending = submissions.filter(s => s.status === 'pending')
    for (const sub of pending) {
      setGradingIds(prev => new Set([...prev, sub.id]))
      try {
        await gradingAPI.gradeSubmission(sub.id)
      } catch (e) {}
    }
    await loadData()
    setGradingIds(new Set())
  }

  const getAssignment = (id) => assignments.find(a => a.id === id)

  const statusConfig = {
    graded: { icon: CheckCircle2, label: 'Graded', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    pending: { icon: Clock, label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100' },
    failed: { icon: XCircle, label: 'Failed', color: 'text-red-600', bg: 'bg-red-100' },
  }

  const filtered = submissions
    .filter(s => filter === 'all' || s.status === filter)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const pendingCount = submissions.filter(s => s.status === 'pending').length

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
          <h1 className="text-2xl font-bold text-slate-800">Grading Center</h1>
          <p className="text-slate-500">Review and grade student submissions</p>
        </div>
        <button
          onClick={handleGradeAll}
          disabled={pendingCount === 0}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          <Zap className="w-5 h-5" />
          <span>Auto Grade All ({pendingCount})</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="flex bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {['pending', 'graded', 'failed', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              filter === f ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No submissions found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Assignment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Submitted</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Score</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(sub => {
                const assignment = getAssignment(sub.assignment_id)
                const cfg = statusConfig[sub.status] || statusConfig.pending
                const Icon = cfg.icon
                const isGrading = gradingIds.has(sub.id)

                return (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                          sub.status === 'graded' ? 'bg-emerald-100 text-emerald-600' :
                          sub.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {sub.student_name?.charAt(0) || 'S'}
                        </div>
                        <span className="font-medium text-slate-700">
                          {sub.student_name || `Student ${sub.student_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/faculty/assignments/${sub.assignment_id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {assignment?.title || `Assignment ${sub.assignment_id}`}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {new Date(sub.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {sub.score != null ? (
                        <span className={`font-bold ${sub.score >= 70 ? 'text-emerald-600' : sub.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {sub.score}/{sub.max_score || 100}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {sub.status === 'pending' && (
                          <button
                            onClick={() => handleGrade(sub.id)}
                            disabled={isGrading}
                            className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 disabled:opacity-50"
                            title="Grade"
                          >
                            {isGrading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
