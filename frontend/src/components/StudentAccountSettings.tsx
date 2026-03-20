'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from './PageLayout';
import { Button } from './ui/button';
import { useAuth } from '@/utils/AuthContext';
import { ArrowLeft, User, Lock, Loader2, CheckCircle2, Camera, Trash2 } from 'lucide-react';
import api from '@/services/api/client';
import { authService } from '@/services/api';

export function StudentAccountSettings() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    setPhotoLoading(true);
    try {
      const updated = await authService.uploadPhoto(file);
      updateUser({ profilePhoto: updated.profilePhoto });
    } catch (err: any) {
      setPhotoError(err?.response?.data?.detail || 'Failed to upload photo');
    } finally {
      setPhotoLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePhotoDelete = async () => {
    setPhotoError(null);
    setPhotoLoading(true);
    try {
      await authService.deletePhoto();
      updateUser({ profilePhoto: undefined });
    } catch (err: any) {
      setPhotoError(err?.response?.data?.detail || 'Failed to remove photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (e: any) {
      setPasswordError(e?.response?.data?.detail || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <PageLayout>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/student')}
          className="mb-6 gap-2 rounded-lg px-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text-dark)' }}>Account Settings</h1>

        {/* Profile Photo */}
        <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-dark)' }}>Profile Photo</h2>
          <div className="flex items-center gap-6">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="rounded-full flex-shrink-0 object-cover"
                style={{ width: '80px', height: '80px', border: '2px solid #D9D9D9' }}
              />
            ) : (
              <div
                className="rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'var(--color-primary)',
                  fontSize: '28px',
                  fontWeight: 700,
                  border: '2px solid #D9D9D9',
                }}
              >
                {`${((user as any)?.firstName || 'S')[0]}${((user as any)?.lastName || '')[0] || ''}`.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-mid)' }}>
                Your photo helps others recognize you
              </p>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={photoLoading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                  {user?.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {user?.profilePhoto && (
                  <button
                    onClick={handlePhotoDelete}
                    disabled={photoLoading}
                    style={{ fontSize: '13px', color: '#8B0000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Remove Photo
                  </button>
                )}
              </div>
              {photoError && (
                <p className="mt-2 text-xs" style={{ color: 'var(--color-error)' }}>{photoError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-dark)' }}>Profile Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-mid)' }}>Name</label>
              <div className="px-4 py-3 rounded-xl border text-sm" style={{ backgroundColor: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-dark)' }}>
                {`${(user as any)?.firstName ?? ''} ${(user as any)?.lastName ?? ''}`.trim() || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-mid)' }}>Email</label>
              <div className="px-4 py-3 rounded-xl border text-sm" style={{ backgroundColor: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-dark)' }}>
                {user?.email || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-mid)' }}>Role</label>
              <div className="px-4 py-3 rounded-xl border text-sm capitalize" style={{ backgroundColor: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-dark)' }}>
                {(user as any)?.role || 'Student'}
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-dark)' }}>Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-mid)' }}>
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-white)', color: 'var(--color-text-dark)', '--tw-ring-color': 'var(--color-primary)' } as any}
                required
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-mid)' }}>
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-white)', color: 'var(--color-text-dark)', '--tw-ring-color': 'var(--color-primary)' } as any}
                required
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-mid)' }}>
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-white)', color: 'var(--color-text-dark)', '--tw-ring-color': 'var(--color-primary)' } as any}
                required
                minLength={6}
              />
            </div>

            {passwordError && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error)' }}>
                <p className="text-sm" style={{ color: 'var(--color-error)' }}>{passwordError}</p>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success)' }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                <p className="text-sm" style={{ color: 'var(--color-success)' }}>Password changed successfully!</p>
              </div>
            )}

            <Button
              type="submit"
              className="text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </form>
        </div>
      </main>
    </PageLayout>
  );
}
