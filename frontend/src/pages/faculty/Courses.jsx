import React, { useState, useEffect } from 'react'
import { coursesAPI } from '../../api/endpoints'
import { Plus, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react'

export default function FacultyCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newCourse, setNewCourse] = useState({ name: '', code: '', description: '' })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await coursesAPI.list()
      // endpoints wrapper returns Axios-like response in this file pattern
      setCourses(res.data || res || [])
    } catch (err) {
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e?.preventDefault()
    if (!newCourse.name.trim()) return setError('Name required')
    setCreating(true)
    try {
      await coursesAPI.create(newCourse)
      setShowNew(false)
      setNewCourse({ name: '', code: '', description: '' })
      await load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create course')
    } finally { setCreating(false) }
  }

  const handleUpdate = async (e) => {
    e?.preventDefault()
    if (!editing) return
    setSaving(true)
    try {
      await coursesAPI.update(editing.id, editing)
      setEditing(null)
      await load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return
    try {
      await coursesAPI.delete(id)
      await load()
    } catch (err) {
      setError('Failed to delete course')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-56"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Courses</h1>
          <p className="text-slate-500">Create and manage courses</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl">
          <Plus className="w-4 h-4" /><span>New Course</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />{error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.length === 0 ? (
          <div className="col-span-1 p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">No courses found</div>
        ) : courses.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">{c.name}</h3>
                <p className="text-sm text-slate-500">{c.code}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3">{c.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <button onClick={() => setEditing({ ...c })} className="p-2 rounded-md hover:bg-slate-50"><Edit className="w-4 h-4 text-slate-500" /></button>
                <button onClick={() => handleDelete(c.id)} className="p-2 rounded-md hover:bg-rose-50"><Trash2 className="w-4 h-4 text-rose-500" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold">Create Course</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input value={newCourse.name} onChange={e => setNewCourse(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                <input value={newCourse.code} onChange={e => setNewCourse(p => ({ ...p, code: e.target.value }))} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={newCourse.description} onChange={e => setNewCourse(p => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2 border rounded-xl" rows={4} />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" disabled={creating} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">{creating ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold">Edit Course</h2>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input value={editing.name} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                <input value={editing.code} onChange={e => setEditing(p => ({ ...p, code: e.target.value }))} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={editing.description} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2 border rounded-xl" rows={4} />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
