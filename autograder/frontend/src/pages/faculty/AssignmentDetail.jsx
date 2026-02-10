import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { assignmentsAPI, submissionsAPI, gradingAPI, facultyAPI, testcasesAPI, rubricsAPI } from '../../api/endpoints'
import {
  ArrowLeft,
  Download,
  Zap,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
  BarChart3,
  Calendar,
  Award,
  FileCode,
  Eye,
  Play,
} from 'lucide-react'

export default function FacultyAssignmentDetail() {
  const { id } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isGrading, setIsGrading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [aRes, sRes, statsRes] = await Promise.all([
        assignmentsAPI.get(id),
        submissionsAPI.getByAssignment(id).catch(() => ({ data: [] })),
        gradingAPI.getAssignmentStats(id).catch(() => ({ data: null })),
      ])
      setAssignment(aRes.data)
      setSubmissions(sRes.data || [])
      setStats(statsRes.data)
    } catch (err) {
      setError('Failed to load assignment')
    } finally {
      setLoading(false)
    }
  }

  const handleGradeAll = async () => {
    setIsGrading(true)
    setError(null)
    try {
      await gradingAPI.gradeAll(id)
      await loadData()
    } catch (err) {
      setError('Failed to grade submissions')
    } finally {
      setIsGrading(false)
    }
  }

  const handleDownloadZip = async () => {
    setIsDownloading(true)
    try {
      const response = await facultyAPI.downloadAssignmentZip(id)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `assignment_${id}_submissions.zip`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError('Failed to download')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleGradeOne = async (submissionId) => {
    try {
      await gradingAPI.gradeSubmission(submissionId)
      await loadData()
    } catch (err) {
      setError('Failed to grade submission')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">Assignment not found</p>
      </div>
    )
  }

  const gradedCount = submissions.filter(s => s.status === 'graded').length
  const pendingCount = submissions.filter(s => s.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/faculty/assignments"
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{assignment.title}</h1>
            <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
              {assignment.due_date && (
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Due: {new Date(assignment.due_date).toLocaleString()}
                </span>
              )}
              <span className="flex items-center">
                <Award className="w-4 h-4 mr-1" />
                {assignment.max_score || 100} points
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadZip}
            disabled={isDownloading || submissions.length === 0}
            className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Download All</span>
          </button>
          <button
            onClick={handleGradeAll}
            disabled={isGrading || pendingCount === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            {isGrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span>Grade All ({pendingCount})</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Submissions</p>
              <p className="text-2xl font-bold text-slate-800">{submissions.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Graded</p>
              <p className="text-2xl font-bold text-emerald-600">{gradedCount}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Average Score</p>
              <p className="text-2xl font-bold text-slate-800">
                {stats?.average_score?.toFixed(1) || '-'}
              </p>
            </div>
            <div className="p-3 bg-violet-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-violet-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {assignment.description && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
          <p className="text-slate-600 whitespace-pre-wrap">{assignment.description}</p>
        </div>
      )}

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Submissions</h3>
        </div>

        {submissions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No submissions yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Submitted</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Score</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map(sub => {
                const statusConfig = {
                  graded: { icon: CheckCircle2, label: 'Graded', color: 'text-emerald-600', bg: 'bg-emerald-100' },
                  pending: { icon: Clock, label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100' },
                  failed: { icon: XCircle, label: 'Failed', color: 'text-red-600', bg: 'bg-red-100' },
                }
                const cfg = statusConfig[sub.status] || statusConfig.pending
                const Icon = cfg.icon

                return (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                          {sub.student_name?.charAt(0) || 'S'}
                        </div>
                        <span className="font-medium text-slate-700">
                          {sub.student_name || `Student ${sub.student_id}`}
                        </span>
                      </div>
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
                          {sub.score}/{sub.max_score || assignment.max_score || 100}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {sub.status === 'pending' && (
                          <button
                            onClick={() => handleGradeOne(sub.id)}
                            className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600"
                            title="Grade"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                          title="View"
                        >
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
