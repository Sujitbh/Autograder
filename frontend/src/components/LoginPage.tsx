import { useState } from 'react';
import { Eye, EyeOff, GraduationCap, AlertCircle, CheckCircle, Loader2, ArrowLeft, BookOpen, Shield, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/api';

type SelectedRole = 'student' | 'faculty' | 'admin';

interface LoginPageProps {
  onLogin: (user: { id: string; name: string; email: string; role: string }, token: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get('signup') === 'success';
  const [selectedRole, setSelectedRole] = useState<SelectedRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotRegisteredPrompt, setShowNotRegisteredPrompt] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const createAccountPath =
    selectedRole === 'student'
      ? '/signup/student'
      : selectedRole === 'admin'
        ? '/signup/admin'
        : '/signup/faculty';

  const validateULMEmail = (emailVal: string) => {
    const emailLower = emailVal.toLowerCase().trim();
    if (selectedRole === 'student') {
      if (!emailLower.endsWith('@warhawks.ulm.edu')) {
        return 'Student email must end with @warhawks.ulm.edu';
      }
    } else {
      // faculty or admin
      if (!emailLower.endsWith('@ulm.edu') || emailLower.endsWith('@warhawks.ulm.edu')) {
        return 'Faculty / Admin email must end with @ulm.edu';
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowNotRegisteredPrompt(false);
    setEmailError(null);

    // Validate email format
    const emailValidationError = validateULMEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    setIsSubmitting(true);
    try {
      // Call the real backend
      const { user, token } = await authService.login(email.trim(), password);
      const displayName =
        `${(user as any).firstName ?? ''} ${(user as any).lastName ?? ''}`.trim() ||
        user.email.split('@')[0];
      onLogin(
        { id: user.id, name: displayName, email: user.email, role: user.role as string },
        token,
      );
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

  // ── Role-selection cards ──────────────────────────────────────────

  const roleCards: { role: SelectedRole; icon: React.ReactNode; label: string; description: string }[] = [
    { role: 'student', icon: <BookOpen className="w-8 h-8" />, label: 'Student', description: 'View courses, submit assignments & track grades' },
    { role: 'faculty', icon: <Users className="w-8 h-8" />, label: 'Faculty', description: 'Manage courses, create assignments & grade submissions' },
    { role: 'admin', icon: <Shield className="w-8 h-8" />, label: 'Admin', description: 'System administration & user management' },
  ];

  // ── Render ───────────────────────────────────────────────────────

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
            <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-20 h-20 text-[#FFFFFF]" />
            </div>
          </div>
          <h1 className="text-[#FFFFFF] mb-4" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}>
            Axiom
          </h1>
          <p className="text-[#FFFFFF]/80" style={{ fontSize: '18px', lineHeight: '26px' }}>
            University of Louisiana Monroe
          </p>
          <p className="text-[#FFFFFF]/70 mt-2" style={{ fontSize: '14px', lineHeight: '22px' }}>
            Automated Grading System
          </p>
        </div>
      </div>

      {/* Right Panel — Role selection OR Login form */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
              <GraduationCap className="w-10 h-10 text-[#FFFFFF]" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 600, lineHeight: '30px', color: 'var(--color-text-dark)' }}>
              Axiom
            </h2>
          </div>

          {/* ─── STEP 1: Role Selection ──────────────────────────── */}
          {!selectedRole && (
            <div>
              <div className="mb-8">
                <h2 className="mb-2" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                  Welcome
                </h2>
                <p style={{ fontSize: '14px', lineHeight: '22px', color: 'var(--color-text-mid)' }}>
                  Choose how you'd like to sign in
                </p>
              </div>

              <div className="space-y-4">
                {roleCards.map(({ role, icon, label, description }) => (
                  <button
                    key={role}
                    onClick={() => { setSelectedRole(role); setError(null); setEmailError(null); }}
                    className="w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div
                      className="flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>{label}</p>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginTop: '2px' }}>{description}</p>
                    </div>
                    <ArrowLeft className="w-5 h-5 rotate-180 flex-shrink-0" style={{ color: 'var(--color-text-light)' }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 2: Login Form ─────────────────────────────── */}
          {selectedRole && (
            <div>
              <button
                type="button"
                onClick={() => { setSelectedRole(null); setError(null); setEmailError(null); setEmail(''); setPassword(''); }}
                className="flex items-center gap-1 mb-6 text-sm hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                <ArrowLeft className="w-4 h-4" /> Back to role selection
              </button>

              <div className="mb-8">
                <h2 className="mb-2" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                  {selectedRole === 'student' ? 'Student Sign In' : selectedRole === 'faculty' ? 'Faculty Sign In' : 'Admin Sign In'}
                </h2>
                <p style={{ fontSize: '14px', lineHeight: '22px', color: 'var(--color-text-mid)' }}>
                  Sign in to your {selectedRole} account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Signup Success Message */}
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

                {/* Error Message */}
                {error && (
                  <div
                    className="p-4 rounded-lg flex items-start gap-3"
                    style={{
                      backgroundColor: showNotRegisteredPrompt ? 'var(--color-warning-bg)' : 'var(--color-error-bg)',
                      border: `1px solid ${showNotRegisteredPrompt ? 'var(--color-warning)' : 'var(--color-error)'}`
                    }}
                  >
                    <AlertCircle
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: showNotRegisteredPrompt ? 'var(--color-warning)' : 'var(--color-error)' }}
                    />
                    <div className="flex-1">
                      <p style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: showNotRegisteredPrompt ? 'var(--color-warning)' : 'var(--color-error)',
                        marginBottom: showNotRegisteredPrompt ? '8px' : '0'
                      }}>
                        {error}
                      </p>
                      {showNotRegisteredPrompt && selectedRole !== 'admin' && (
                        <Button
                          type="button"
                          onClick={() => router.push(createAccountPath)}
                          className="mt-2 h-9 text-white hover:opacity-90"
                          style={{ backgroundColor: 'var(--color-warning)', fontSize: '13px' }}
                        >
                          Create an Account
                        </Button>
                      )}
                    </div>
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
                    placeholder={selectedRole === 'student' ? 'yourname@warhawks.ulm.edu' : 'yourname@ulm.edu'}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                      setShowNotRegisteredPrompt(false);
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
                      {selectedRole === 'student' ? 'Must be a valid @warhawks.ulm.edu email' : 'Must be a valid @ulm.edu email'}
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                        setShowNotRegisteredPrompt(false);
                      }}
                      className={`h-12 pr-12 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] ${error && !showNotRegisteredPrompt ? 'border-[var(--color-error)]' : ''}`}
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
                  <a href="#" className="hover:underline" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-primary)' }}>
                    Forgot password?
                  </a>
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

                {/* Sign Up Link — hidden for admin (accounts cannot be self-registered) */}
                {selectedRole !== 'admin' && (
                  <p className="text-center" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-text-light)' }}>
                    Don't have an account?{' '}
                    <button type="button" onClick={() => router.push(createAccountPath)} className="hover:underline" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                      Create Account
                    </button>
                  </p>
                )}

                {/* Help Text */}
                <p className="text-center" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-text-light)' }}>
                  Need help? Contact{' '}
                  <a href="mailto:support@ulm.edu" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
                    support@ulm.edu
                  </a>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
