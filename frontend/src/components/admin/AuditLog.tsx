'use client';

import { useState } from 'react';
import { Shield, Loader2, Search, Download } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAdminAuditLogs } from '@/hooks/queries/useAdmin';

export function AuditLog() {
  const [actionFilter, setActionFilter] = useState('all');
  const [page, setPage] = useState(0);
  const limit = 50;

  const params = {
    action: actionFilter !== 'all' ? actionFilter : undefined,
    skip: page * limit,
    limit,
  };

  const { data, isLoading } = useAdminAuditLogs(params);
  const logs = data?.logs ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const actionColor = (action: string) => {
    if (action.startsWith('create') || action === 'registration') return { bg: '#E8F5E9', color: '#2D6A2D' };
    if (action.startsWith('delete') || action === 'deactivate') return { bg: '#FFE6E6', color: '#8B0000' };
    if (action.startsWith('update') || action === 'role_change') return { bg: '#E3F2FD', color: '#1A4D7A' };
    return { bg: '#FFF3CD', color: '#8A5700' };
  };

  const handleExportCSV = () => {
    if (!logs.length) return;
    const headers = ['Date', 'User', 'Action', 'Resource', 'Details', 'IP Address'];
    const rows = logs.map((l) => [
      l.created_at ? new Date(l.created_at).toLocaleString() : '',
      l.user_name,
      l.action,
      l.resource_type ? `${l.resource_type}${l.resource_id ? ` #${l.resource_id}` : ''}` : '',
      l.details ?? '',
      l.ip_address ?? '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout activeItem="audit" breadcrumbs={[{ label: 'Audit Log' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>Security & Audit Log</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
            System activity trail ({total} entries)
          </p>
        </div>
        <Button variant="outline" onClick={handleExportCSV} disabled={logs.length === 0}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(0); }}>
          <SelectTrigger style={{ width: '200px' }}><SelectValue placeholder="All Actions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="registration">Registration</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="role_change">Role Change</SelectItem>
            <SelectItem value="create_course">Create Course</SelectItem>
            <SelectItem value="update_course">Update Course</SelectItem>
            <SelectItem value="delete_course">Delete Course</SelectItem>
            <SelectItem value="create_assignment">Create Assignment</SelectItem>
            <SelectItem value="submission">Submission</SelectItem>
            <SelectItem value="password_reset">Password Reset</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
          <Loader2 className="w-5 h-5 animate-spin" /> <span>Loading audit logs...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-light)' }} />
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>No Audit Logs</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Activity will appear here as events occur</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                  <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Date & Time</th>
                  <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>User</th>
                  <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Action</th>
                  <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Resource</th>
                  <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Details</th>
                  <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const ac = actionColor(log.action);
                  return (
                    <tr key={log.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-5 py-4" style={{ fontSize: '13px', color: 'var(--color-text-mid)', whiteSpace: 'nowrap' }}>
                        {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                      </td>
                      <td className="px-5 py-4 font-medium" style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                        {log.user_name}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs font-semibold"
                          style={{ backgroundColor: ac.bg, color: ac.color }}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-4" style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                        {log.resource_type ? `${log.resource_type}${log.resource_id ? ` #${log.resource_id}` : ''}` : '—'}
                      </td>
                      <td className="px-5 py-4" style={{ fontSize: '13px', color: 'var(--color-text-mid)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.details ?? '—'}
                      </td>
                      <td className="px-5 py-4" style={{ fontSize: '13px', color: 'var(--color-text-light)', fontFamily: 'monospace' }}>
                        {log.ip_address ?? '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <Button size="sm" variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
