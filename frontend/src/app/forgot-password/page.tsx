'use client';

import { useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.forgotPassword(email.trim());
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
                <Mail className="w-8 h-8" style={{ color: '#2D6A2D' }} />
              </div>
              <h2 className="mb-3" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                Check Your Email
              </h2>
              <p className="mb-6" style={{ fontSize: '14px', lineHeight: '22px', color: 'var(--color-text-mid)' }}>
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
                Please check your inbox and spam folder.
              </p>
              <p className="mb-8" style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                The link expires in 1 hour.
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full h-12 text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', fontWeight: 500 }}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="mb-2" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                  Reset Password
                </h2>
                <p style={{ fontSize: '14px', lineHeight: '22px', color: 'var(--color-text-mid)' }}>
                  Enter your institutional email and we&apos;ll send you a link to reset your password.
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
                    htmlFor="email"
                    className="block mb-2"
                    style={{ fontSize: '13px', fontWeight: 500, lineHeight: '18px', color: 'var(--color-text-dark)' }}
                  >
                    Institutional Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="h-12 border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-0"
                    style={{ fontSize: '14px' }}
                    required
                  />
                  <p className="mt-2" style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                    Use your @warhawks.ulm.edu or @ulm.edu email
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', fontWeight: 500 }}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
                  ) : (
                    'Send Reset Link'
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
