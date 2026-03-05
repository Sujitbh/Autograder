'use client';

import { useState } from 'react';
import { User, Loader2, CheckCircle2, EyeOff, Eye } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '@/utils/AuthContext';
import api from '@/services/api/client';

export function AdminAccountSettings() {
  const { user } = useAuth();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setError(null);
    if (!currentPw || !newPw) {
      setError('Please fill in all password fields.');
      return;
    }
    if (newPw !== confirmPw) {
      setError('New passwords do not match.');
      return;
    }
    if (newPw.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/change-password', { current_password: currentPw, new_password: newPw });
      setToast('Password changed successfully!');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setError('Failed to change password. Check your current password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout activeItem="account" breadcrumbs={[{ label: 'My Account' }]}>
      <div className="mb-6">
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>My Account</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>Manage your admin account</p>
      </div>

      {toast && (
        <div className="flex items-center gap-3 p-4 rounded-lg mb-6" style={{ backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success)' }}>
          <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--color-success)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>{toast}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-bg)' }}
            >
              <User className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>{[user?.firstName, (user as any)?.lastName].filter(Boolean).join(' ') || 'Admin'}</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>{user?.email ?? ''}</p>
              <span
                className="inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-semibold uppercase text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {user?.role ?? 'admin'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-sm" style={{ color: 'var(--color-text-mid)' }}>Name</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>{[user?.firstName, (user as any)?.lastName].filter(Boolean).join(' ') || '—'}</span>
            </div>
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-sm" style={{ color: 'var(--color-text-mid)' }}>Email</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>{user?.email ?? '—'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm" style={{ color: 'var(--color-text-mid)' }}>Role</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>{user?.role ?? '—'}</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text-dark)' }}>Change Password</h3>

          {error && (
            <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: '#FFE6E6', border: '1px solid #8B0000' }}>
              <p className="text-sm" style={{ color: '#8B0000' }}>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>Current Password</label>
              <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>New Password</label>
              <div className="relative mt-1">
                <Input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>Confirm New Password</label>
              <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="mt-1" />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={saving}
              className="w-full text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
