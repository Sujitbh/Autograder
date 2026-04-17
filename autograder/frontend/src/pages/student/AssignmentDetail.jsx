import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { assignmentsAPI, submissionsAPI, gradingAPI, testcasesAPI, rubricsAPI } from '../../api/endpoints'
import CodeWorkspace from '../../components/CodeWorkspace'
import {
  ArrowLeft,
  FileCode,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Loader2,
  File,
  X,
  Code,
  Award,
  List,
} from 'lucide-react'

export default function AssignmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [results, setResults] = useState(null)
  const [testcases, setTestcases] = useState([])
  const [rubric, setRubric] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [activeTab, setActiveTab] = useState('details') // details, submission, results

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [aRes, sRes, tcRes, rRes] = await Promise.all([
        assignmentsAPI.get(id),
        submissionsAPI.getByAssignment(id).catch(() => ({ data: [] })),
        testcasesAPI.list(id).catch(() => ({ data: [] })),
        rubricsAPI.list(id).catch(() => ({ data: [] })),
      ])
      
      setAssignment(aRes.data)
      setTestcases(tcRes.data || [])
      setRubric(rRes.data || [])
      
      // Get latest submission
      const subs = sRes.data || []
      if (subs.length > 0) {
        const latest = subs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        setSubmission(latest)
        
        // Get grading results if graded
        if (latest.status === 'graded') {
          try {
            const resRes = await gradingAPI.getResults(latest.id)
            setResults(resRes.data)
          } catch (e) {
            console.error('Failed to load results:', e)
          }
        }
      }
    } catch (err) {
      setError('Failed to load assignment')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files)
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file')
      return
    }

    setUploading(true)
    setError(null)
    try {
      const response = await submissionsAPI.upload(id, files)
      setSubmission(response.data)
      setFiles([])
      setActiveTab('submission')
      alert('Submission uploaded successfully!')
      loadData() // Refresh to get latest data
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
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
        <Link to="/student/assignments" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to Assignments
        </Link>
      </div>
    )
  }

  // Show CodeWorkspace if user clicked "Open Editor"
  if (showCodeEditor) {
    return (
      <CodeWorkspace 
        assignment={assignment} 
        onBack={() => {
          setShowCodeEditor(false)
          loadData() // Refresh data after returning
        }} 
      />
    )
  }

  const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/student/assignments"
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">{assignment.title}</h1>
          <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
            {assignment.due_date && (
              <span className={`flex items-center ${isOverdue ? 'text-red-600' : ''}`}>
                <Calendar className="w-4 h-4 mr-1" />
                Due: {new Date(assignment.due_date).toLocaleString()}
                {isOverdue && ' (Overdue)'}
              </span>
            )}
            {assignment.max_score && (
              <span className="flex items-center">
                <Award className="w-4 h-4 mr-1" />
                {assignment.max_score} points
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {['details', 'submission', 'results'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab
                ? 'text-indigo-600 border-indigo-600'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Description</h3>
              <p className="text-slate-600 whitespace-pre-wrap">
                {assignment.description || 'No description provided.'}
              </p>
            </div>

            {/* Rubric */}
            {rubric.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <List className="w-5 h-5 mr-2 text-indigo-600" />
                  Grading Rubric
                </h3>
                <div className="space-y-3">
                  {rubric.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-700">{item.criterion}</p>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
                        {item.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Test Cases Preview */}
            {testcases.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h4 className="font-medium text-slate-800 mb-3">Test Cases</h4>
                <p className="text-sm text-slate-500">
                  {testcases.filter(t => t.is_public).length} public, {testcases.filter(t => !t.is_public).length} hidden
                </p>
              </div>
            )}

            {/* Upload Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h4 className="font-medium text-slate-800 mb-3">Submit Your Work</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setShowCodeEditor(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
                >
                  <Code className="w-5 h-5" />
                  <span>Open Code Editor</span>
                </button>
                <button
                  onClick={() => setActiveTab('submission')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Files</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'submission' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            {/* Upload Area */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Upload Submission</h3>
              
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-all">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-400 mt-1">Python, Java, C++, JavaScript files</p>
                </label>
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <File className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-700">{file.name}</span>
                        <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Submit {files.length} file(s)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Previous Submissions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h4 className="font-medium text-slate-800 mb-3">Latest Submission</h4>
            {submission ? (
              <div className="space-y-3">
                <div className={`p-3 rounded-xl ${
                  submission.status === 'graded' ? 'bg-emerald-50' :
                  submission.status === 'pending' ? 'bg-amber-50' : 'bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Status</span>
                    <span className={`text-sm font-medium ${
                      submission.status === 'graded' ? 'text-emerald-600' :
                      submission.status === 'pending' ? 'text-amber-600' : 'text-slate-600'
                    }`}>
                      {submission.status?.charAt(0).toUpperCase() + submission.status?.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Submitted {new Date(submission.created_at).toLocaleString()}
                  </p>
                </div>
                
                {submission.score !== null && submission.score !== undefined && (
                  <div className="text-center p-4 bg-indigo-50 rounded-xl">
                    <p className="text-sm text-slate-500">Score</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {submission.score}<span className="text-lg text-slate-400">/{submission.max_score || 100}</span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No submissions yet</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Grading Results</h3>
          
          {!submission ? (
            <div className="text-center py-8 text-slate-400">
              <FileCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Submit your assignment to see results</p>
            </div>
          ) : submission.status !== 'graded' ? (
            <div className="text-center py-8 text-amber-500">
              <Clock className="w-12 h-12 mx-auto mb-2" />
              <p>Your submission is being graded...</p>
            </div>
          ) : results ? (
            <div className="space-y-4">
              {/* Score Summary */}
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                <span className="font-medium text-emerald-700">Total Score</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {submission.score}/{submission.max_score || 100}
                </span>
              </div>
              
              {/* Test Results */}
              {results.test_results && (
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700">Test Cases</h4>
                  {results.test_results.map((test, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${
                      test.passed ? 'bg-emerald-50' : 'bg-red-50'
                    }`}>
                      <span className="font-medium text-slate-700">Test {idx + 1}</span>
                      <div className="flex items-center space-x-2">
                        {test.passed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={test.passed ? 'text-emerald-600' : 'text-red-600'}>
                          {test.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Feedback */}
              {submission.feedback && (
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-700 mb-2">Feedback</h4>
                  <p className="text-slate-600 whitespace-pre-wrap">{submission.feedback}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
              <p>Graded! Score: {submission.score}/{submission.max_score || 100}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
