import React, { useState } from 'react'

export default function CodeWorkspace({ assignment, onBack }) {
  const [code, setCode] = useState(assignment?.starterCode || '')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{assignment?.title}</h2>
          <p className="text-sm text-slate-500">{assignment?.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="px-4 py-2 bg-slate-100 rounded-lg">Back</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Run Tests</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <textarea className="w-full h-[420px] font-mono p-4 bg-slate-50 rounded-lg resize-none" value={code} onChange={(e) => setCode(e.target.value)} />
      </div>
    </div>
  )
}
