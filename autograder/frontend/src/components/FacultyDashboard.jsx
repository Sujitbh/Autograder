import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { 
  Users, 
  FileText, 
  Zap, 
  ShieldAlert, 
  RefreshCw, 
  Check, 
  Loader2,
  Clock,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  BookOpen,
  Award,
  Eye,
  Play
} from 'lucide-react'
import { coursesApi, assignmentsApi, submissionsApi, gradingApi } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function FacultyDashboard({ navigate, onSelectSubmission }) {
  const routerNavigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isGrading, setIsGrading] = useState(false)
  const [gradingProgress, setGradingProgress] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [coursesData, assignmentsData, submissionsData] = await Promise.all([
        coursesApi.list().catch(() => []),
        assignmentsApi.list().catch(() => []),
        submissionsApi.list().catch(() => []),
      ])
      setCourses(coursesData)
      setAssignments(assignmentsData)
      setSubmissions(submissionsData)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCanvasSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setLastSync(new Date().toLocaleTimeString())
      loadDashboardData()
    }, 2000)
  }

  const handleGradeAll = async () => {
    const pendingSubmissions = submissions.filter(s => s.status === 'pending')
    if (pendingSubmissions.length === 0) {
      alert('No pending submissions to grade')
      return
    }
    
    setIsGrading(true)
    setGradingProgress({ current: 0, total: pendingSubmissions.length })
    
    for (let i = 0; i < pendingSubmissions.length; i++) {
      try {
        await gradingApi.gradeSubmission(pendingSubmissions[i].id)
      } catch (err) {
        console.error(`Failed to grade submission ${pendingSubmissions[i].id}`, err)
      }
      setGradingProgress({ current: i + 1, total: pendingSubmissions.length })
    }
    
    setIsGrading(false)
    setGradingProgress(null)
    loadDashboardData()
  }

  // Calculate stats
  const totalStudents = new Set(submissions.map(s => s.student_id)).size || 0
  const activeAssignments = assignments.filter(a => {
    if (!a.due_date) return true
    return new Date(a.due_date) > new Date()
  }).length
  const pendingGrading = submissions.filter(s => s.status === 'pending').length
  const integrityFlags = submissions.filter(s => s.plagiarism_flag).length

  // Get performance data for chart
  const performanceData = assignments.slice(0, 5).map((assignment, idx) => {
    const relatedSubs = submissions.filter(s => s.assignment_id === assignment.id && s.score !== null)
    const avg = relatedSubs.length > 0 
      ? Math.round(relatedSubs.reduce((sum, s) => sum + (s.score || 0), 0) / relatedSubs.length)
      : 0
    const top = relatedSubs.length > 0 
      ? Math.max(...relatedSubs.map(s => s.score || 0))
      : 0
    return {
      name: `A${idx + 1}`,
      fullName: assignment.title,
      avg,
      top,
    }
  })

  // Get submission status distribution
  const statusDistribution = [
    { name: 'Graded', value: submissions.filter(s => s.status === 'graded').length },
    { name: 'Pending', value: submissions.filter(s => s.status === 'pending').length },
    { name: 'Failed', value: submissions.filter(s => s.status === 'failed').length },
  ].filter(s => s.value > 0)

  // Get recent submissions
  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.submitted_at || b.created_at) - new Date(a.submitted_at || a.created_at))
    .slice(0, 5)

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Unknown'
    const date = new Date(dateStr)
    const diff = (new Date() - date) / 1000
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-slate-600">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with sync */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {courses.slice(0, 4).map((course, i) => (
              <div key={course.id} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                {course.code?.slice(0, 2) || `C${i + 1}`}
              </div>
            ))}
          </div>
          <select
            value={selectedCourse?.id || ''}
            onChange={(e) => {
              const val = e.target.value
              setSelectedCourse(courses.find(c => c.id === parseInt(val)) || null)
              if (val) routerNavigate(`/faculty/assignments?course_id=${val}`)
            }}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-200 outline-none"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.code}: {course.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-3">
          {lastSync && <span className="text-xs text-emerald-600 font-medium flex items-center"><Check className="w-3 h-3 mr-1"/> Synced at {lastSync}</span>}
          <button 
            onClick={handleCanvasSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Refresh'}</span>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{totalStudents}</h3>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter mt-1">Total Students</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{activeAssignments}</h3>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter mt-1">Active Assignments</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={handleGradeAll}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            {isGrading ? (
              <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
            ) : (
              <Play className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{pendingGrading}</h3>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter mt-1">
            {isGrading ? `Grading ${gradingProgress?.current}/${gradingProgress?.total}...` : 'Pending Grading'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{integrityFlags}</h3>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter mt-1">Integrity Flags</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Assignment Performance</h3>
          <div className="h-[300px]">
            {performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value, name) => [value, name === 'avg' ? 'Average' : 'Highest']}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                  />
                  <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]} name="Average Grade" />
                  <Bar dataKey="top" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Highest Grade" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No grading data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Submission Status</h3>
          <div className="h-[250px]">
            {statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            {statusDistribution.map((entry, idx) => (
              <div key={entry.name} className="flex items-center text-sm">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx] }} />
                <span className="text-slate-600">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Submissions & Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Submissions</h3>
            <button 
              onClick={handleGradeAll}
              disabled={isGrading || pendingGrading === 0}
              className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center"
            >
              {isGrading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Zap className="w-3 h-3 mr-1" />}
              Auto Grade All
            </button>
          </div>
          <div className="space-y-3">
            {recentSubmissions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No submissions yet</div>
            ) : (
              recentSubmissions.map(sub => (
                <div 
                  key={sub.id} 
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all cursor-pointer group"
                  onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      sub.status === 'graded' ? 'bg-emerald-100 text-emerald-600' :
                      sub.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {sub.student_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{sub.student_name || `Student ${sub.student_id}`}</p>
                      <p className="text-xs text-slate-400">{formatTimeAgo(sub.submitted_at || sub.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {sub.score !== null && (
                      <span className={`text-sm font-medium ${
                        sub.score >= 80 ? 'text-emerald-600' :
                        sub.score >= 60 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {sub.score}/{sub.max_score || 100}
                      </span>
                    )}
                    <button className="p-2 bg-white border border-slate-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">My Courses</h3>
          <div className="space-y-3">
            {courses.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No courses found</div>
            ) : (
              courses.map(course => (
                <div 
                    key={course.id}
                    onClick={() => routerNavigate(`/faculty/assignments?course_id=${course.id}`)}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition-all cursor-pointer group"
                  >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700">{course.name}</h4>
                      <p className="text-xs text-slate-400">{course.code} • {course.semester || 'Current'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-all" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
