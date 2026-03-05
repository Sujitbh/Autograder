'use client';

import { useState } from 'react';
import { Search, Loader2, UserPlus, MoreVertical, Shield, UserCheck, UserX } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useAdminUsers, useUpdateUserRole, useToggleUserActive } from '@/hooks/queries/useAdmin';

const roleBadgeColors: Record<string, { bg: string; text: string }> = {
  admin: { bg: 'var(--color-primary)', text: '#fff' },
  faculty: { bg: '#1A4D7A', text: '#fff' },
  student: { bg: '#2D6A2D', text: '#fff' },
};

export function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const params = {
    search: search || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
    limit: 200,
  };

  const { data, isLoading } = useAdminUsers(params);
  const updateRole = useUpdateUserRole();
  const toggleActive = useToggleUserActive();

  const users = data?.users ?? [];

  return (
    <AdminLayout activeItem="users" breadcrumbs={[{ label: 'Users' }]}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>User Management</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
            Manage all system accounts ({data?.total ?? 0} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger style={{ width: '160px' }}><SelectValue placeholder="All Roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="faculty">Faculty</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger style={{ width: '140px' }}><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading users...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <UserPlus className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-light)' }} />
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>No users found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Name</th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Email</th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Role</th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Status</th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Created</th>
                <th className="text-right px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const badgeColor = roleBadgeColors[u.role] ?? { bg: '#888', text: '#fff' };
                return (
                  <tr key={u.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-5 py-4" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>{u.name}</td>
                    <td className="px-5 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>{u.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold uppercase"
                        style={{ backgroundColor: badgeColor.bg, color: badgeColor.text }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: u.is_active ? 'var(--color-success-bg, #E8F5E9)' : 'var(--color-error-bg, #FFE6E6)',
                          color: u.is_active ? 'var(--color-success, #2D6A2D)' : 'var(--color-error, #8B0000)',
                        }}
                      >
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4" style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button type="button" className="p-2 rounded hover:bg-[var(--color-primary-bg)] transition-colors" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                            <MoreVertical className="w-4 h-4" style={{ color: 'var(--color-text-mid)' }} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {['student', 'faculty', 'admin'].filter(r => r !== u.role).map((r) => (
                            <DropdownMenuItem
                              key={r}
                              onClick={() => updateRole.mutate({ userId: u.id, role: r })}
                              className="cursor-pointer"
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Make {r.charAt(0).toUpperCase() + r.slice(1)}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuItem
                            onClick={() => toggleActive.mutate({ userId: u.id, activate: !u.is_active })}
                            className="cursor-pointer"
                          >
                            {u.is_active ? (
                              <><UserX className="w-4 h-4 mr-2" /> Deactivate</>
                            ) : (
                              <><UserCheck className="w-4 h-4 mr-2" /> Activate</>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
