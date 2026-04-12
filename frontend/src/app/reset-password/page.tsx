'use client';

import { useState, Suspense } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/api';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-white px-8">
        <div className="w-full max-w-md text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ backgroundColor: 'var(--color-error-bg)' }}
          >
            <AlertCircle className="w-8 h-8" style={{ color: 'var(--color-error)' }} />
          </div>
          <h2 className="mb-3" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
            Invalid Reset Link
          </h2>
          <p className="mb-6" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
            This password reset link is invalid. Please request a new one.
          </p>
          <Button
            onClick={() => router.push('/forgot-password')}
            className="w-full h-12 text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', fontWeight: 500 }}
          >
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? err?.message ?? 'Something went wrong';
      if (msg.includes('Network') || msg.includes('connect')) {
        setError('Cannot reach the server. Is the backend running?');
      } else {
        setError(String(msg));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Branding Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6B0000 0%, #3A0000 100%)' }}
      >
        <div className="text-center z-10 px-8">
          <div className="mb-8 flex justify-center">
            <img src="/images/axiom-logo.png" alt="Axiom" className="w-32 h-32 object-contain" />
          </div>
          <p className="text-[#FFFFFF]/80" style={{ fontSize: '18px', lineHeight: '26px' }}>
            University of Louisiana Monroe
          </p>
          <p className="text-[#FFFFFF]/70 mt-2" style={{ fontSize: '14px', lineHeight: '22px' }}>
            Automated Grading System
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <img src="/images/axiom-logo.png" alt="Axiom" className="w-16 h-16 object-contain mx-auto mb-4" />
          </div>

          {success ? (
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                style={{ backgroundColor: '#E8F5E8' }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: '#2D6A2D' }} />
              </div>
              <h2 className="mb-3" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                Password Reset Complete
              </h2>
              <p className="mb-8" style={{ fontSize: '14px', lineHeight: '22px', color: 'var(--color-text-mid)' }}>
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full h-12 text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', fontWeight: 500 }}
              >
                Sign In
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="mb-2" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                  Set New Password
                </h2>
                <p style={{ fontSize: '14px', lineHeight: '22px', color: 'var(--color-text-mid)' }}>
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div
                    className="p-4 rounded-lg flex items-start gap-3"
                    style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error)' }}
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }} />
                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-error)' }}>{error}</p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2"
                    style={{ fontSize: '13px', fontWeight: 500, lineHeight: '18px', color: 'var(--color-text-dark)' }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      className="h-12 pr-12 border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-0"
                      style={{ fontSize: '14px' }}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-mid)] hover:text-[var(--color-text-dark)]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-2" style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                    Must be at least 6 characters
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2"
                    style={{ fontSize: '13px', fontWeight: 500, lineHeight: '18px', color: 'var(--color-text-dark)' }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError(null);
                      }}
                      className={`h-12 pr-12 border-2 focus:ring-0 ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-[var(--color-error)]'
                          : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'
                      }`}
                      style={{ fontSize: '14px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-mid)] hover:text-[var(--color-text-dark)]"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-2" style={{ fontSize: '12px', color: 'var(--color-error)' }}>
                      Passwords do not match
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', fontWeight: 500 }}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting…</>
                  ) : (
                    'Reset Password'
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="w-full flex items-center justify-center gap-2 hover:underline"
                  style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
