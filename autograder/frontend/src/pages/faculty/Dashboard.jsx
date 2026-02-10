import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { assignmentsAPI, submissionsAPI, coursesAPI, gradingAPI } from '../../api/endpoints'
import {
  Users,
  FileText,
  Zap,
  Clock,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Eye,
  Download,
  BarChart3,
} from 'lucide-react'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']

export default function FacultyDashboard() {
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isGrading, setIsGrading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [aRes, sRes, cRes] = await Promise.all([
        assignmentsAPI.list().catch(() => ({ data: [] })),
        submissionsAPI.list().catch(() => ({ data: [] })),
        coursesAPI.list().catch(() => ({ data: [] })),
      ])
      setAssignments(aRes.data || [])
      setSubmissions(sRes.data || [])
      setCourses(cRes.data || [])
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Stats
  const totalStudents = new Set(submissions.map(s => s.student_id)).size
  const activeAssignments = assignments.filter(a => !a.due_date || new Date(a.due_date) > new Date()).length
  const pendingGrading = submissions.filter(s => s.status === 'pending').length

  // Chart data - assignment performance
  const performanceData = assignments.slice(0, 5).map((a, i) => {
    const subs = submissions.filter(s => s.assignment_id === a.id && s.score != null)
    const avg = subs.length ? Math.round(subs.reduce((sum, s) => sum + s.score, 0) / subs.length) : 0
    const max = subs.length ? Math.max(...subs.map(s => s.score)) : 0
    return { name: `A${i + 1}`, title: a.title, avg, max }
  })

  // Submission status distribution
  const statusData = [
    { name: 'Graded', value: submissions.filter(s => s.status === 'graded').length },
    { name: 'Pending', value: submissions.filter(s => s.status === 'pending').length },
    { name: 'Failed', value: submissions.filter(s => s.status === 'failed').length },
  ].filter(s => s.value > 0)

  // Recent submissions
  const recentSubs = [...submissions]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  const formatTimeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const handleGradeAll = async () => {
    if (pendingGrading === 0) return
    setIsGrading(true)
    try {
      // Grade all pending assignments
      for (const assignment of assignments) {
        const pending = submissions.filter(s => s.assignment_id === assignment.id && s.status === 'pending')
        if (pending.length > 0) {
          await gradingAPI.gradeAll(assignment.id).catch(() => {})
        }
      }
      await loadData()
    } finally {
      setIsGrading(false)
    }
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
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Faculty Dashboard</h1>
          <p className="text-slate-500">Manage assignments and grade submissions</p>
        </div>
        <Link
          to="/faculty/assignments/new"
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Assignment</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Students</p>
              <p className="text-2xl font-bold text-slate-800">{totalStudents}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Assignments</p>
              <p className="text-2xl font-bold text-slate-800">{activeAssignments}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div
          onClick={handleGradeAll}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending Grading</p>
              <p className="text-2xl font-bold text-amber-600">{pendingGrading}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              {isGrading ? (
                <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
              ) : (
                <Zap className="w-6 h-6 text-amber-600" />
              )}
            </div>
          </div>
          <p className="text-xs text-amber-600 mt-2">Click to auto-grade all</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Courses</p>
              <p className="text-2xl font-bold text-slate-800">{courses.length}</p>
            </div>
            <div className="p-3 bg-violet-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-violet-600" />
            </div>
          </div>
          {courses.length > 0 && (
            <div className="mt-3 space-y-2">
              {courses.slice(0,3).map(c => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/faculty/assignments?course_id=${c.id}`)}
                  className="text-left w-full text-sm text-slate-600 hover:text-indigo-600"
                >
                  {c.code ? `${c.code} — ${c.name}` : c.name}
                </button>
              ))}
              {courses.length > 3 && (
                <button onClick={() => navigate('/faculty/courses')} className="text-sm text-indigo-600">View all courses</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Assignment Performance</h3>
          <div className="h-72">
            {performanceData.some(d => d.avg > 0 || d.max > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(v, n) => [v, n === 'avg' ? 'Average' : 'Highest']}
                    labelFormatter={(_, p) => p[0]?.payload?.title || ''}
                  />
                  <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]} name="Average" />
                  <Bar dataKey="max" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Highest" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No grading data yet
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Submission Status</h3>
          <div className="h-52">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No submissions yet
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center text-sm">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-slate-600">{s.name}: {s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Assignments & Recent Submissions */}
      <div className="grid grid-cols-2 gap-6">
        {/* Assignments */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">My Assignments</h3>
            <Link to="/faculty/assignments" className="text-sm text-indigo-600 font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {assignments.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No assignments yet</p>
              </div>
            ) : (
              assignments.slice(0, 4).map(a => {
                const subCount = submissions.filter(s => s.assignment_id === a.id).length
                return (
                  <Link
                    key={a.id}
                    to={`/faculty/assignments/${a.id}`}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all group"
                  >
                    <div>
                      <h4 className="font-medium text-slate-800">{a.title}</h4>
                      <p className="text-sm text-slate-500">{subCount} submissions</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Recent Submissions</h3>
            <Link to="/faculty/grading" className="text-sm text-indigo-600 font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentSubs.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No submissions yet</p>
              </div>
            ) : (
              recentSubs.map(sub => {
                const assignment = assignments.find(a => a.id === sub.assignment_id)
                return (
                  <div key={sub.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        sub.status === 'graded' ? 'bg-emerald-100 text-emerald-600' :
                        sub.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {sub.student_name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">{sub.student_name || `Student ${sub.student_id}`}</p>
                        <p className="text-xs text-slate-400">{assignment?.title} • {formatTimeAgo(sub.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {sub.score != null && (
                        <span className={`font-medium ${sub.score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {sub.score}/{sub.max_score || 100}
                        </span>
                      )}
                      <Link
                        to={`/faculty/assignments/${sub.assignment_id}`}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
