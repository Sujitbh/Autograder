import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { submissionsAPI, testcasesAPI, rubricsAPI } from '../api/endpoints'
import { 
  Play, 
  Save, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ListChecks, 
  Code, 
  Terminal 
} from 'lucide-react'

export default function CodeWorkspace({ assignment, onBack }) {
  const navigate = useNavigate()
  const [code, setCode] = useState(assignment?.starter_code || '# Start coding here...')
  const [activeTab, setActiveTab] = useState('code')
  const [testCases, setTestCases] = useState([])
  const [rubric, setRubric] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (assignment?.id) {
      loadTestCasesAndRubric()
    }
  }, [assignment?.id])

  const loadTestCasesAndRubric = async () => {
    try {
      const [tcRes, rubricRes] = await Promise.all([
        testcasesAPI.listByAssignment(assignment.id).catch(() => ({ data: [] })),
        rubricsAPI.listByAssignment(assignment.id).catch(() => ({ data: [] })),
      ])
      setTestCases((tcRes.data || []).map(tc => ({ ...tc, status: null, actualOutput: null })))
      setRubric(rubricRes.data || [])
    } catch (err) {
      console.error('Failed to load test cases/rubric:', err)
    }
  }

  const runTests = async () => {
    setIsRunning(true)
    setError(null)
    
    // Reset test statuses to running
    setTestCases(prev => prev.map(tc => ({ ...tc, status: 'running' })))

    // Simulate test execution (in real app, this would call backend)
    const publicTests = testCases.filter(tc => tc.is_public)
    
    for (let i = 0; i < publicTests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setTestCases(prev => {
        const updated = [...prev]
        const idx = prev.findIndex(t => t.id === publicTests[i].id)
        if (idx !== -1) {
          // Simulate - in real app this would be actual test result
          const passed = Math.random() > 0.3
          updated[idx] = {
            ...updated[idx],
            status: passed ? 'passed' : 'failed',
            actualOutput: passed ? updated[idx].expected_output : 'Runtime Error or Wrong Output'
          }
        }
        return updated
      })
    }
    
    setIsRunning(false)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Create a file from the code
      const ext = getFileExtension(assignment?.language)
      const file = new File([code], `solution.${ext}`, {
        type: 'text/plain'
      })
      
      console.log('[CodeWorkspace] Submitting file:', file.name, 'size:', file.size, 'for assignment:', assignment.id)
      const response = await submissionsAPI.upload(assignment.id, [file])
      console.log('[CodeWorkspace] Submission response:', response.data)
      
      // Navigate back or show success
      if (onBack) {
        onBack()
      } else {
        navigate('/student/submissions')
      }
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Failed to submit assignment'
      console.error('[CodeWorkspace] Submission failed:', detail, err)
      setError(detail)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFileExtension = (language) => {
    const extensions = {
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      javascript: 'js',
    }
    return extensions[language?.toLowerCase()] || 'txt'
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
      {/* Workspace Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="font-bold text-slate-800">{assignment?.title || 'Assignment'}</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest">{assignment?.language || 'python'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {error && (
            <span className="text-red-600 text-sm mr-2">{error}</span>
          )}
          <button 
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>Run Public Tests</span>
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Submit Assignment</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-16 border-r border-slate-200 bg-slate-50 flex flex-col items-center py-6 space-y-6">
          <button 
            onClick={() => setActiveTab('code')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'code' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            title="Code Editor"
          >
            <Code className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('rubric')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'rubric' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            title="Grading Rubric"
          >
            <ListChecks className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('tests')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'tests' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            title="Test Results"
          >
            <Terminal className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'code' && (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-8 font-mono text-sm bg-slate-900 text-slate-300 resize-none focus:outline-none"
              spellCheck={false}
              placeholder="// Write your code here..."
            />
          )}

          {activeTab === 'rubric' && (
            <div className="p-8 overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Grading Rubric</h3>
              {rubric.length === 0 ? (
                <div className="text-center text-slate-400 py-12">
                  <ListChecks className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No rubric defined for this assignment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rubric.map(item => (
                    <div key={item.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-slate-700">{item.criterion || item.name}</span>
                        <span className="text-indigo-600 font-bold">{item.points || item.max_points} pts</span>
                      </div>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="p-8 overflow-y-auto bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Test Results</h3>
              {testCases.length === 0 ? (
                <div className="text-center text-slate-400 py-12">
                  <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No test cases defined for this assignment</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {testCases.filter(tc => tc.is_public).map((tc, idx) => (
                    <div key={tc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Test Case: Public</p>
                          <p className="text-xs text-slate-500 font-mono">Input: {tc.input || 'N/A'}</p>
                          {tc.actualOutput && tc.status === 'failed' && (
                            <p className="text-xs text-red-500 font-mono mt-1">Output: {tc.actualOutput}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        {tc.status === 'passed' && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                        {tc.status === 'failed' && <XCircle className="w-6 h-6 text-rose-500" />}
                        {tc.status === 'running' && <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />}
                        {!tc.status && <div className="w-6 h-6 border-2 border-slate-200 rounded-full" />}
                      </div>
                    </div>
                  ))}
                  
                  {/* Private test indicator */}
                  {testCases.filter(tc => !tc.is_public).length > 0 && (
                    <div className="bg-slate-100 p-4 rounded-xl border border-dashed border-slate-300 text-center">
                      <p className="text-slate-500 text-sm">
                        + {testCases.filter(tc => !tc.is_public).length} private test(s) will run on submission
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
