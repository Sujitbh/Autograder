import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assignmentsAPI, submissionsAPI, coursesAPI } from '../../api/endpoints'
import {
  Plus,
  FileCode,
  Search,
  Calendar,
  Users,
  Loader2,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Clock,
} from 'lucide-react'

export default function FacultyAssignments() {
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    course_id: '',
    due_date: '',
    max_score: 100,
    language: 'python',
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [aRes, sRes, cRes] = await Promise.all([
        assignmentsAPI.list(),
        submissionsAPI.list(),
        coursesAPI.list(),
      ])
      setAssignments(aRes.data || [])
      setSubmissions(sRes.data || [])
      setCourses(cRes.data || [])
    } catch (err) {
      setError('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newAssignment.title.trim()) {
      setError('Title is required')
      return
    }
    setCreating(true)
    try {
      const data = {
        ...newAssignment,
        course_id: newAssignment.course_id ? parseInt(newAssignment.course_id) : null,
        max_score: parseInt(newAssignment.max_score) || 100,
      }
      await assignmentsAPI.create(data)
      setShowNewModal(false)
      setNewAssignment({ title: '', description: '', course_id: '', due_date: '', max_score: 100, language: 'python' })
      loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create assignment')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return
    try {
      await assignmentsAPI.delete(id)
      loadData()
    } catch (err) {
      setError('Failed to delete assignment')
    }
  }

  const filtered = assignments.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

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
          <p className="text-slate-500">Create and manage your assignments</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Assignment</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search assignments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
        />
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No assignments found</p>
          </div>
        ) : (
          filtered.map(assignment => {
            const subCount = submissions.filter(s => s.assignment_id === assignment.id).length
            const gradedCount = submissions.filter(s => s.assignment_id === assignment.id && s.status === 'graded').length
            const course = courses.find(c => c.id === assignment.course_id)
            const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date()

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link
                        to={`/faculty/assignments/${assignment.id}`}
                        className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
                      >
                        {assignment.title}
                      </Link>
                      {course && (
                        <p className="text-sm text-slate-500">{course.name}</p>
                      )}
                    </div>
                    <div className="relative group/menu">
                      <button className="p-1 rounded-lg hover:bg-slate-100">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                      <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-36 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                        <Link
                          to={`/faculty/assignments/${assignment.id}/edit`}
                          className="flex items-center px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {assignment.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-slate-500">
                        <Users className="w-4 h-4 mr-1" />{subCount}
                      </span>
                      {assignment.due_date && (
                        <span className={`flex items-center ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <span className="text-indigo-600 font-medium">{assignment.max_score || 100} pts</span>
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${gradedCount === subCount && subCount > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-xs text-slate-500">
                      {gradedCount}/{subCount} graded
                    </span>
                  </div>
                  <Link
                    to={`/faculty/assignments/${assignment.id}`}
                    className="text-sm text-indigo-600 font-medium hover:underline flex items-center"
                  >
                    View <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Create Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Create Assignment</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                  rows={3}
                  placeholder="Assignment description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                  <select
                    value={newAssignment.course_id}
                    onChange={(e) => setNewAssignment(p => ({ ...p, course_id: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                  >
                    <option value="">Select course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                  <select
                    value={newAssignment.language}
                    onChange={(e) => setNewAssignment(p => ({ ...p, language: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                  >
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    value={newAssignment.due_date}
                    onChange={(e) => setNewAssignment(p => ({ ...p, due_date: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={newAssignment.max_score}
                    onChange={(e) => setNewAssignment(p => ({ ...p, max_score: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                    min={1}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Create</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
