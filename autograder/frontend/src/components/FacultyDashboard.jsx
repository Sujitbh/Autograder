import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, FileText, Zap, ShieldAlert, RefreshCw, Check } from 'lucide-react'

const DATA = [
  { name: 'Assign 1', avg: 85, top: 100 },
  { name: 'Assign 2', avg: 72, top: 98 },
  { name: 'Assign 3', avg: 90, top: 100 },
  { name: 'Assign 4', avg: 65, top: 92 },
  { name: 'Assign 5', avg: 88, top: 100 },
]

export default function FacultyDashboard() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)

  const handleCanvasSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setLastSync(new Date().toLocaleTimeString())
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">S{i}</div>
            ))}
          </div>
          <span className="text-sm text-slate-500 font-medium">CS101: Introduction to Algorithms</span>
        </div>
        <div className="flex items-center space-x-3">
          {lastSync && <span className="text-xs text-emerald-600 font-medium flex items-center"><Check className="w-3 h-3 mr-1"/> Synced at {lastSync}</span>}
          <button 
            onClick={handleCanvasSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Canvas...' : 'Sync Roster'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">142</h3>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter mt-1">Total Students</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">8</h3>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter mt-1">Active Assignments</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">24</h3>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter mt-1">Pending Grading</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">3</h3>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter mt-1">Integrity Flags</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Class Performance Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]} name="Average Grade" />
                <Bar dataKey="top" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Highest Grade" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Submissions</h3>
            <button className="text-indigo-600 text-sm font-bold hover:underline">Grade All</button>
          </div>
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">J{i}</div>
                  <div>
                    <p className="font-semibold text-slate-700">John Doe {i}</p>
                    <p className="text-xs text-slate-400">Submitted 2h ago</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold rounded-lg group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
