import React from 'react'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-12 px-4">
      <main className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-slate-800">Welcome back,</h1>
          <div className="text-sm text-slate-500 mt-2">Academic Year 2024/25</div>
        </div>

        <div>
          {children}
        </div>
      </main>
    </div>
  )
}
