import React, { useState } from 'react'
import { analyzeCodeQuality } from '../services/geminiService'
import { Brain, Search, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'

export default function AISubmissionAnalyzer() {
  const [code, setCode] = useState(`def find_sum(arr):\n    # This looks like simple student code\n    total = 0\n    for num in arr:\n        total += num\n    return total`)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)

  const handleAnalyze = async () => {
    setLoading(true)
    const result = await analyzeCodeQuality(code, 'python')
    setReport(result)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">AI Integrity Shield</h2>
          <p className="text-slate-500">Analyze student submissions for AI generation and plagiarism signatures.</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
          <span className="font-semibold">Run AI Scan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-2xl overflow-hidden flex flex-col h-[500px]">
          <div className="px-4 py-2 bg-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-xs font-mono uppercase">Submission Source</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-transparent text-slate-300 p-6 font-mono text-sm focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>

        <div className="space-y-6">
          {!report && !loading && (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">Ready to analyze</p>
              <p className="text-sm">Click "Run AI Scan" to begin code introspection</p>
            </div>
          )}

          {loading && (
            <div className="h-full bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="w-12 h-12 mb-4 text-indigo-500 animate-spin" />
              <p className="text-lg font-bold text-slate-800">Gemini is thinking...</p>
              <p className="text-slate-500">Cross-referencing syntax patterns and common LLM markers</p>
            </div>
          )}

          {report && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-6 rounded-2xl border ${report.plagiarismScore > 30 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Plagiarism Score</p>
                  <p className={`text-3xl font-black ${report.plagiarismScore > 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {report.plagiarismScore}%
                  </p>
                </div>
                <div className={`p-6 rounded-2xl border ${report.isAIContent ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">AI Detection</p>
                  <div className="flex items-center space-x-2">
                    {report.isAIContent ? <AlertTriangle className="w-6 h-6 text-rose-600" /> : <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                    <span className={`text-xl font-bold ${report.isAIContent ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {report.isAIContent ? 'Likely AI' : 'Human Written'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-indigo-500" />
                  AI Reasoning
                </h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {report.reasoning}
                </p>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                  Flag Submission
                </button>
                <button className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                  Contact Student
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
