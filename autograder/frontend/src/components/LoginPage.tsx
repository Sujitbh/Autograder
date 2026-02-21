import { useState } from 'react';
import { Eye, EyeOff, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useRouter, useSearchParams } from 'next/navigation';

interface LoginPageProps {
  onLogin: () => void;
}

// Mock registered users database - includes default demo accounts
const DEFAULT_USERS = [
  { email: 'sjohnson@ulm.edu', password: 'password123', firstName: 'Sarah', lastName: 'Johnson' },
  { email: 'professor@ulm.edu', password: 'demo123', firstName: 'Demo', lastName: 'Professor' },
  { email: 'faculty@ulm.edu', password: 'faculty123', firstName: 'Faculty', lastName: 'Member' },
];

// Function to get all registered users (including newly signed up ones)
const getRegisteredUsers = () => {
  const storedUsers = localStorage.getItem('autograde_users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  return DEFAULT_USERS;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get('signup') === 'success';
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotRegisteredPrompt, setShowNotRegisteredPrompt] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateULMEmail = (email: string) => {
    const emailLower = email.toLowerCase().trim();
    if (!emailLower.endsWith('@ulm.edu')) {
      return 'Email address must be a valid @ulm.edu address';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowNotRegisteredPrompt(false);
    setEmailError(null);

    // Validate ULM email first
    const emailValidationError = validateULMEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    // Get current registered users
    const REGISTERED_USERS = getRegisteredUsers();

    // Check if email is registered
    const user = REGISTERED_USERS.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Email not registered
      setShowNotRegisteredPrompt(true);
      setError('This email is not registered in our system.');
      return;
    }

    // Check if password is correct
    if (user.password !== password) {
      setError('Incorrect password. Please try again.');
      return;
    }

    // Store the current logged-in user info so the auth context can read it
    localStorage.setItem('autograde_current_user', JSON.stringify({
      firstName: user.firstName || email.split('@')[0],
      lastName: user.lastName || '',
      email: email.toLowerCase(),
      role: 'faculty',
    }));

    // Successful login
    onLogin();
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
          {/* ULM Shield Logo (using graduation cap as placeholder) */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-20 h-20 text-white" />
            </div>
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}>
            AutoGrade
          </h1>
          <p className="text-white/80" style={{ fontSize: '18px', lineHeight: '26px' }}>
            University of Louisiana Monroe
          </p>
          <p className="text-white/70 mt-2" style={{ fontSize: '14px', lineHeight: '22px' }}>
            Automated Grading System for Faculty
          </p>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 600, lineHeight: '30px', color: 'var(--color-text-dark)' }}>
              AutoGrade
            </h2>
          </div>

          <div className="mb-8">
            <h2 className="mb-2" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '22px', color: 'var(--color-text-mid)' }}>
              Sign in to your faculty account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Signup Success Message */}
            {signupSuccess && !error && (
              <div
                className="p-4 rounded-lg flex items-center gap-3"
                style={{
                  backgroundColor: '#E8F5E8',
                  border: '1px solid #2D6A2D'
                }}
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
                  {showNotRegisteredPrompt && (
                    <Button
                      type="button"
                      onClick={() => router.push('/signup')}
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
                placeholder="yourname@ulm.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                  setShowNotRegisteredPrompt(false);
                  setEmailError(null);
                }}
                onBlur={() => {
                  // Validate on blur
                  if (email && email.trim() !== '') {
                    const validationError = validateULMEmail(email);
                    if (validationError) {
                      setEmailError(validationError);
                    }
                  }
                }}
                className={`h-12 border-2 focus:border-[var(--color-primary)] focus:ring-0 ${emailError ? 'border-[var(--color-error)] bg-[var(--color-error-bg)]' : 'border-[var(--color-border)]'
                  }`}
                style={{
                  fontSize: '14px',
                  ...(emailError && { borderColor: 'var(--color-error)', backgroundColor: 'var(--color-error-bg)' })
                }}
                required
              />
              {emailError ? (
                <p className="mt-2 flex items-start gap-1" style={{ fontSize: '12px', color: 'var(--color-error)' }}>
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  {emailError}
                </p>
              ) : (
                <p className="mt-2" style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                  Must be a valid @ulm.edu email address
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
                  className={`h-12 pr-12 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] ${error && !showNotRegisteredPrompt ? 'border-[var(--color-error)]' : ''
                    }`}
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
                <label
                  htmlFor="remember"
                  className="cursor-pointer select-none"
                  style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-text-dark)' }}
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="hover:underline"
                style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-primary)' }}
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-12 text-white hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'var(--color-primary)',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Sign In
            </Button>

            {/* Sign Up Link */}
            <p className="text-center" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-text-light)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="hover:underline"
                style={{ color: 'var(--color-primary)', fontWeight: 500 }}
              >
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