import React from 'react'
import { Database, Globe, Key, ShieldCheck, Terminal, HardDrive } from 'lucide-react'

export default function AdminPanel() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">System Administration</h2>
        <p className="text-slate-500">Manage global settings, language runtimes, and security audits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <Terminal className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800">Runtimes & Languages</h3>
          <p className="text-sm text-slate-500 mt-2">Add or configure compilers for Python, Java, C++, and Go.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800">Database Control</h3>
          <p className="text-sm text-slate-500 mt-2">Manage submission storage, backups, and data retention policies.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800">Security Audits</h3>
          <p className="text-sm text-slate-500 mt-2">View system access logs and integrity reports.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4">
            <Key className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800">Auth Management</h3>
          <p className="text-sm text-slate-500 mt-2">Manage user credentials and Canvas API integrations.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800">Global Settings</h3>
          <p className="text-sm text-slate-500 mt-2">Update platform branding and notification templates.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 mb-4">
            <HardDrive className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800">System Health</h3>
          <p className="text-sm text-slate-500 mt-2">Monitor server load and API response latencies.</p>
        </div>
      </div>
    </div>
  )
}
