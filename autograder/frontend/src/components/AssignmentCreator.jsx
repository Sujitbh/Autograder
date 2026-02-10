import React, { useState, useEffect } from 'react'
import { Plus, Trash2, X, PlusCircle } from 'lucide-react'
import { coursesApi } from '../lib/api'

export default function AssignmentCreator({ onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [lang, setLang] = useState('python')
  const [rubric, setRubric] = useState([
    { id: '1', criterion: 'Core Functionality', points: 50, description: 'Code solves the primary problem.' }
  ])
  const [testCases, setTestCases] = useState([
    { id: '1', input: '5', expectedOutput: '120', isPublic: true }
  ])
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await coursesApi.list().catch(() => [])
        if (!mounted) return
        setCourses(data)
        if (data && data.length > 0) setSelectedCourse(data[0].id)
      } catch (err) {
        console.error('Failed to load courses', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const addRubricRow = () => {
    setRubric([...rubric, { id: Date.now().toString(), criterion: '', points: 0, description: '' }])
  }

  const removeRubricRow = (id) => {
    setRubric(rubric.filter(r => r.id !== id))
  }

  const addTestRow = () => {
    setTestCases([...testCases, { id: Date.now().toString(), input: '', expectedOutput: '', isPublic: true }])
  }

  const totalPoints = rubric.reduce((sum, item) => sum + (Number(item.points) || 0), 0)

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">New Assignment</h2>
            <p className="text-sm text-slate-500">Configure parameters, rubrics, and automated tests.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 text-sm">1</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Assignment Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g. Recursive Algorithms"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Programming Language</label>
                <select 
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Course</label>
                {courses.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-slate-400">No courses available</div>
                ) : (
                  <select
                    value={selectedCourse || ''}
                    onChange={e => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code}: {c.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 text-sm">2</span>
                Dynamic Rubric
              </h3>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Score</p>
                <p className="text-xl font-black text-emerald-600">{totalPoints} pts</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {rubric.map((item, idx) => (
                <div key={item.id} className="flex space-x-3 items-start animate-in slide-in-from-left-4 duration-200" style={{ animationDelay: `${idx * 50}ms` }}>
                  <input 
                    placeholder="Criterion" 
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    value={item.criterion}
                    onChange={e => {
                      const newRubric = [...rubric]
                      newRubric[idx].criterion = e.target.value
                      setRubric(newRubric)
                    }}
                  />
                  <input 
                    type="number" 
                    placeholder="Pts" 
                    className="w-20 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center font-bold"
                    value={item.points}
                    onChange={e => {
                      const newRubric = [...rubric]
                      newRubric[idx].points = parseInt(e.target.value) || 0
                      setRubric(newRubric)
                    }}
                  />
                  <button onClick={() => removeRubricRow(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button 
                onClick={addRubricRow}
                className="flex items-center space-x-2 text-indigo-600 font-semibold hover:text-indigo-700 p-2 text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Criterion</span>
              </button>
            </div>
          </section>

          <section className="space-y-4 pb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mr-3 text-sm">3</span>
              Automated Test Cases
            </h3>
            <div className="space-y-3">
              {testCases.map((tc, idx) => (
                <div key={tc.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">INPUT</label>
                    <input className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg font-mono text-xs" defaultValue={tc.input} />
                  </div>
                  <div className="col-span-5">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">EXPECTED OUTPUT</label>
                    <input className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg font-mono text-xs" defaultValue={tc.expectedOutput} />
                  </div>
                  <div className="col-span-2 flex justify-end items-end h-full">
                     <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addTestRow} className="w-full border-2 border-dashed border-slate-200 p-4 rounded-2xl text-slate-400 hover:border-indigo-300 hover:text-indigo-400 transition-all font-medium flex items-center justify-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Test Case</span>
              </button>
            </div>
          </section>
        </div>

        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors">Cancel</button>
          <button className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Save Assignment</button>
        </div>
      </div>
    </div>
  )
}
