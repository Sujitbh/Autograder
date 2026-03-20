import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/api';

interface LoginPageProps {
  onLogin: (user: { id: string; name: string; email: string; role: string }, token: string, rememberMe: boolean) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get('signup') === 'success';
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateULMEmail = (emailVal: string) => {
    const emailLower = emailVal.toLowerCase().trim();
    if (emailLower.endsWith('@warhawks.ulm.edu') || emailLower.endsWith('@ulm.edu')) {
      return null;
    }
    return 'Please use your @warhawks.ulm.edu or @ulm.edu email';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);

    const emailValidationError = validateULMEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const { user, token } = await authService.login(email.trim(), password);
      onLogin(user as any, token, rememberMe);
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? err?.message ?? 'Login failed';
      if (msg === 'Invalid credentials' || msg === 'Unauthorized') {
        setError('Invalid email or password. Please try again.');
      } else if (msg.includes('Network') || msg.includes('connect')) {
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
        style={{
          background: 'linear-gradient(135deg, #6B0000 0%, #3A0000 100%)'
        }}
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

      {/* Right Panel — Login form */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <img src="/images/axiom-logo.png" alt="Axiom" className="w-16 h-16 object-contain mx-auto mb-4" />
          </div>

          <div className="mb-8">
            <h2 className="mb-2" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
              Sign In
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '22px', color: 'var(--color-text-mid)' }}>
              Sign in with your ULM institutional email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {signupSuccess && !error && (
              <div
                className="p-4 rounded-lg flex items-center gap-3"
                style={{ backgroundColor: '#E8F5E8', border: '1px solid #2D6A2D' }}
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#2D6A2D' }} />
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#2D6A2D' }}>
                  Account created successfully! Please sign in with your credentials.
                </p>
              </div>
            )}

            {error && (
              <div
                className="p-4 rounded-lg flex items-start gap-3"
                style={{
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error)',
                }}
              >
                <AlertCircle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--color-error)' }}
                />
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-error)' }}>
                  {error}
                </p>
              </div>
            )}

            {/* Email Field */}
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
                placeholder=""
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                  setEmailError(null);
                }}
                onBlur={() => {
                  if (email && email.trim() !== '') {
                    const validationError = validateULMEmail(email);
                    if (validationError) setEmailError(validationError);
                  }
                }}
                className={`h-12 border-2 focus:border-[var(--color-primary)] focus:ring-0 ${emailError ? 'border-[var(--color-error)] bg-[var(--color-error-bg)]' : 'border-[var(--color-border)]'}`}
                style={{ fontSize: '14px', ...(emailError && { borderColor: 'var(--color-error)', backgroundColor: 'var(--color-error-bg)' }) }}
                required
              />
              {emailError ? (
                <p className="mt-2 flex items-start gap-1" style={{ fontSize: '12px', color: 'var(--color-error)' }}>
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  {emailError}
                </p>
              ) : (
                <p className="mt-2" style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                  Use your @warhawks.ulm.edu or @ulm.edu email
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2"
                style={{ fontSize: '13px', fontWeight: 500, lineHeight: '18px', color: 'var(--color-text-dark)' }}
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                      placeholder=""
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  className={`h-12 pr-12 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] ${error ? 'border-[var(--color-error)]' : ''}`}
                  required
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="cursor-pointer select-none" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-text-dark)' }}>
                  Remember me
                </label>
              </div>
              <button type="button" onClick={() => router.push('/forgot-password')} className="hover:underline" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--color-primary)', fontSize: '14px', fontWeight: 500 }}
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in…</> : 'Sign In'}
            </Button>

            {/* Sign Up Link */}
            <p className="text-center" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-text-light)' }}>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => router.push('/signup')} className="hover:underline" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                Create Account
              </button>
            </p>

            {/* Help Text */}
            <p className="text-center" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-text-light)' }}>
              Need help? Contact{' '}
              <a href="mailto:support@ulm.edu" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
                support@ulm.edu
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
