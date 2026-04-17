'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { AlertCircle, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/api';
import { useAuth } from '@/utils/AuthContext';

function dashboardForRole(role: string): string {
  switch (role) {
    case 'student': return '/student';
    case 'admin': return '/admin';
    case 'faculty':
    default: return '/courses';
  }
}

function OTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const mfaToken = searchParams.get('mfa_token') ?? '';
  const expiresIn = parseInt(searchParams.get('expires_in') ?? '300', 10);

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [timeLeft, setTimeLeft] = useState(expiresIn);
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const startTime = useRef(Date.now());

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      const remaining = Math.max(0, expiresIn - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresIn]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!mfaToken) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-surface)] px-8">
        <div className="w-full max-w-md text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ backgroundColor: 'var(--color-error-bg)' }}
          >
            <AlertCircle className="w-8 h-8" style={{ color: 'var(--color-error)' }} />
          </div>
          <h2 className="mb-3" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
            Invalid Session
          </h2>
          <p className="mb-6" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
            Your verification session is invalid or has expired. Please sign in again.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="w-full h-12 text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', fontWeight: 500 }}
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    if (value.length > 1) {
      // Handle paste of full code
      const pasted = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setDigits(newDigits);
      const lastFilled = Math.min(pasted.length, 6) - 1;
      inputRefs.current[lastFilled]?.focus();
      return;
    }

    newDigits[index] = value;
    setDigits(newDigits);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newDigits = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
      setDigits(newDigits);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      const result = await authService.verifyOtp(mfaToken, code);
      setSuccess(true);

      // Small delay to show success state, then redirect
      const user = await authService.getCurrentUser();
      login(user as any, result.access_token, false);
      setTimeout(() => {
        router.push(dashboardForRole(user.role));
      }, 500);
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? err?.message ?? 'Verification failed';

      if (detail.includes('Too many') || detail.includes('log in again') || detail.includes('No pending')) {
        setError(detail);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(detail);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError(null);

    try {
      await authService.resendOtp(mfaToken);
      setResendCooldown(60);
      startTime.current = Date.now();
      setTimeLeft(expiresIn);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? 'Failed to resend code';
      setError(detail);
    } finally {
      setIsResending(false);
    }
  };

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    const code = digits.join('');
    if (code.length === 6 && !isVerifying && !success) {
      handleVerify();
    }
  }, [digits]);

  return (
    <div className="flex h-screen">
      {/* Left Branding Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--ulm-maroon-dark) 100%)' }}
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
      <div className="flex-1 flex items-center justify-center bg-[var(--color-surface)] px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <img src="/images/axiom-logo.png" alt="Axiom" className="w-16 h-16 object-contain mx-auto mb-4" />
          </div>

          {success ? (
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                style={{ backgroundColor: 'var(--color-success-bg)' }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: 'var(--color-success)' }} />
              </div>
              <h2 className="mb-3" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                Verified
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                Redirecting to your dashboard…
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                  style={{ backgroundColor: 'var(--color-error-bg)' }}
                >
                  <ShieldCheck className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />
                </div>
                <h2 className="mb-2" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                  Verify Your Identity
                </h2>
                <p style={{ fontSize: '14px', lineHeight: '22px', color: 'var(--color-text-mid)' }}>
                  We sent a 6-digit code to your ULM email.
                  <br />Enter it below to complete sign-in.
                </p>
              </div>

              {error && (
                <div
                  className="p-4 rounded-lg flex items-start gap-3 mb-6"
                  style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error)' }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }} />
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-error)' }}>{error}</p>
                </div>
              )}

              {/* 6-digit input boxes */}
              <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    aria-label={`OTP digit ${i + 1}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={i === 0 ? 6 : 1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    disabled={isVerifying || timeLeft === 0}
                    className="text-center font-bold transition-all outline-none"
                    style={{
                      width: '52px',
                      height: '60px',
                      fontSize: '24px',
                      fontVariantNumeric: 'tabular-nums',
                      borderRadius: '10px',
                      border: error ? '2px solid var(--color-error)' : '2px solid var(--color-border)',
                      color: digit ? 'var(--color-primary)' : 'var(--color-text-dark)',
                      caretColor: 'var(--color-primary)',
                      backgroundColor: timeLeft === 0 ? 'var(--color-surface-elevated)' : 'var(--color-input-background)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(107,0,0,0.16)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                ))}
              </div>

              {/* Countdown timer */}
              <div className="text-center mb-6">
                {timeLeft > 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                    Code expires in{' '}
                    <span style={{ fontWeight: 600, color: timeLeft <= 60 ? 'var(--color-error)' : 'var(--color-text-dark)' }}>
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--color-error)', fontWeight: 500 }}>
                    Code has expired. Please request a new one.
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerify}
                disabled={isVerifying || digits.join('').length !== 6 || timeLeft === 0}
                className="w-full h-12 text-white hover:opacity-90 transition-opacity mb-4"
                style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', fontWeight: 500 }}
              >
                {isVerifying ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying…</>
                ) : (
                  'Verify Code'
                )}
              </Button>

              {/* Resend link */}
              <div className="text-center">
                <p style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                  Didn&apos;t receive the code?{' '}
                  {resendCooldown > 0 ? (
                    <span style={{ color: 'var(--color-text-light)' }}>
                      Resend in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending}
                      className="hover:underline"
                      style={{ color: 'var(--color-primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {isResending ? 'Sending…' : 'Resend Code'}
                    </button>
                  )}
                </p>
              </div>

              {/* Back to login */}
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="hover:underline"
                  style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTP() {
  return (
    <Suspense>
      <OTPContent />
    </Suspense>
  );
}
