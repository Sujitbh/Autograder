import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  TrendingUp,
  FileCode,
  Award,
  Loader2,
  ChevronRight,
  XCircle,
  Timer
} from 'lucide-react'
import { getRole, getUsername } from '../lib/auth'
import { coursesApi, assignmentsApi, submissionsApi } from '../lib/api'

export default function StudentDashboard({ navigate, onOpenWorkspace }) {
  const role = getRole()
  const username = getUsername()
  
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)

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

  // Calculate stats
  const totalAssignments = assignments.length
  const completedAssignments = submissions.filter(s => s.status === 'graded').length
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length
  
  // Get upcoming assignments (due within 7 days)
  const now = new Date()
  const upcomingAssignments = assignments
    .filter(a => {
      if (!a.due_date) return false
      const dueDate = new Date(a.due_date)
      const daysUntil = (dueDate - now) / (1000 * 60 * 60 * 24)
      return daysUntil >= 0 && daysUntil <= 7
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))

  // Get recent submissions
  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.submitted_at || b.created_at) - new Date(a.submitted_at || a.created_at))
    .slice(0, 5)

  // Format date helpers
  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No due date'
    const date = new Date(dateStr)
    const diff = (date - now) / (1000 * 60 * 60 * 24)
    
    if (diff < 0) return 'Past due'
    if (diff < 1) return 'Due today'
    if (diff < 2) return 'Due tomorrow'
    return `Due in ${Math.ceil(diff)} days`
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getSubmissionStatus = (status) => {
    switch (status) {
      case 'graded':
        return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Graded' }
      case 'pending':
        return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Pending' }
      case 'failed':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Failed' }
      default:
        return { icon: AlertCircle, color: 'text-slate-600', bg: 'bg-slate-100', label: status || 'Unknown' }
    }
  }

  const handleStartAssignment = (assignment) => {
    if (onOpenWorkspace) {
      onOpenWorkspace(assignment)
    }
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
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome back, {username || 'Student'}!</h2>
          <p className="text-slate-500">Here's an overview of your academic progress</p>
        </div>
        <button 
          onClick={loadDashboardData}
          className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        >
          Refresh
        </button>
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
              <p className="text-sm text-slate-500">Enrolled Courses</p>
              <p className="text-2xl font-bold text-slate-800">{courses.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Assignments</p>
              <p className="text-2xl font-bold text-slate-800">{totalAssignments}</p>
            </div>
            <div className="p-3 bg-violet-100 rounded-xl">
              <FileCode className="w-6 h-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-emerald-600">{completedAssignments}</p>
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
              <p className="text-2xl font-bold text-amber-600">{pendingSubmissions}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Upcoming Assignments */}
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
              Upcoming Assignments
            </h3>
            <span className="text-sm text-slate-400">Next 7 days</span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {upcomingAssignments.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming assignments</p>
              </div>
            ) : (
              upcomingAssignments.map(assignment => {
                const dueDate = new Date(assignment.due_date)
                const isUrgent = (dueDate - now) / (1000 * 60 * 60 * 24) < 2
                
                return (
                  <div 
                    key={assignment.id}
                    className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-xl ${isUrgent ? 'bg-red-100' : 'bg-indigo-100'}`}>
                        <FileCode className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-indigo-600'}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{assignment.title}</h4>
                        <div className="flex items-center space-x-3 text-sm text-slate-500">
                          <span>{assignment.course_name || 'Course'}</span>
                          <span className={`flex items-center ${isUrgent ? 'text-red-600 font-medium' : ''}`}>
                            <Timer className="w-3 h-3 mr-1" />
                            {formatDueDate(assignment.due_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartAssignment(assignment)}
                      className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-700"
                    >
                      <span>Start</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          {/* All assignments link */}
          {assignments.length > upcomingAssignments.length && (
            <div className="p-3 border-t border-slate-100 text-center">
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View all {assignments.length} assignments →
              </button>
            </div>
          )}
        </div>

        {/* Right: Recent Submissions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
              Recent Submissions
            </h3>
          </div>
          
          <div className="divide-y divide-slate-100">
            {recentSubmissions.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FileCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No submissions yet</p>
              </div>
            ) : (
              recentSubmissions.map(submission => {
                const status = getSubmissionStatus(submission.status)
                const StatusIcon = status.icon
                
                return (
                  <div key={submission.id} className="p-3 hover:bg-slate-50 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-700 text-sm truncate">
                        {submission.assignment_title || `Assignment ${submission.assignment_id}`}
                      </span>
                      <div className={`flex items-center text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{formatDateTime(submission.submitted_at || submission.created_at)}</span>
                      {submission.score !== null && submission.score !== undefined && (
                        <span className="font-medium text-slate-600">
                          {submission.score}/{submission.max_score || 100}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="p-3 border-t border-slate-100 text-center">
            <button 
              onClick={() => navigate && navigate('submissions')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all submissions →
            </button>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-violet-600" />
            My Courses
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4 p-4">
          {courses.length === 0 ? (
            <div className="col-span-3 p-8 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>You're not enrolled in any courses</p>
            </div>
          ) : (
            courses.map(course => (
              <div 
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{course.name}</h4>
                    <p className="text-xs text-slate-500">{course.code}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{course.description || 'No description'}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{course.semester || 'Current semester'}</span>
                  <span>{course.assignment_count || 0} assignments</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
