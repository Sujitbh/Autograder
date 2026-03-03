'use client';

import { useState } from 'react';
import { KeyRound, Search, Loader2, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAdminUsers, useResetPassword } from '@/hooks/queries/useAdmin';

export function PasswordManagement() {
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    limit: 50,
  });
  const resetMutation = useResetPassword();

  const users = data?.users ?? [];

  const handleReset = (userId: number, userName: string) => {
    const password = newPassword || undefined;
    resetMutation.mutate(
      { userId, newPassword: password },
      {
        onSuccess: (data: { temporary_password?: string }) => {
          const tempPw = data?.temporary_password;
          setSuccessMsg(
            tempPw
              ? `Password reset for ${userName}. Temporary password: ${tempPw}`
              : `Password reset for ${userName} successfully.`
          );
          setSelectedUserId(null);
          setNewPassword('');
          setTimeout(() => setSuccessMsg(''), 8000);
        },
      }
    );
  };

  return (
    <AdminLayout activeItem="passwords" breadcrumbs={[{ label: 'Password Management' }]}>
      <div className="mb-6">
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>Password Management</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
          Search for a user and reset their password
        </p>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div
          className="flex items-center gap-3 p-4 rounded-lg mb-6"
          style={{ backgroundColor: '#E8F5E9', border: '1px solid #2D6A2D' }}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: '#2D6A2D' }} />
          <p className="text-sm font-medium" style={{ color: '#2D6A2D' }}>{successMsg}</p>
        </div>
      )}

      {/* Search */}
      <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* User List */}
      {!search ? (
        <div className="text-center py-20 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <KeyRound className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-light)' }} />
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>Search for a User</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
            Enter a name or email above to find the account
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
          <Loader2 className="w-5 h-5 animate-spin" /> <span>Searching...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>No Users Found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Try a different search term</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Name</th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Email</th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Role</th>
                <th className="text-right px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-5 py-4 font-medium" style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>{u.name}</td>
                  <td className="px-5 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>{u.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold uppercase text-white"
                      style={{
                        backgroundColor: u.role === 'admin' ? 'var(--color-primary)' : u.role === 'faculty' ? '#1A4D7A' : '#2D6A2D',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {selectedUserId === u.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <Input
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password (optional)"
                          type="password"
                          style={{ width: '200px' }}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleReset(u.id, u.name)}
                          disabled={resetMutation.isPending}
                          className="text-white"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          {resetMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Reset'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedUserId(null); setNewPassword(''); }}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUserId(u.id)}
                      >
                        <KeyRound className="w-3.5 h-3.5 mr-1" /> Reset Password
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
