import { useState } from 'react';
import { Eye, EyeOff, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useRouter } from 'next/navigation';

interface SignupPageProps {
  onSignup: () => void;
}

export function SignupPage({ onSignup }: SignupPageProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const validateULMEmail = (email: string) => {
    const emailLower = email.toLowerCase().trim();
    if (!emailLower.endsWith('@ulm.edu')) {
      return 'Email address must be a valid @ulm.edu address';
    }
    return null;
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });

    // Calculate password strength
    if (password.length === 0) {
      setPasswordStrength(null);
    } else if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 10) {
      setPasswordStrength('medium');
    } else if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('medium');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setEmailError(null);

    // Validate ULM email
    const emailValidationError = validateULMEmail(formData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    // Validate all required fields
    if (!formData.firstName || !formData.lastName) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      setFormError('Please enter and confirm your password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    if (!formData.agreeToTerms) {
      setFormError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    // Check if email is already registered
    const existingUsers = localStorage.getItem('autograde_users');
    const users = existingUsers ? JSON.parse(existingUsers) : [
      { email: 'sjohnson@ulm.edu', password: 'password123', firstName: 'Sarah', lastName: 'Johnson' },
      { email: 'professor@ulm.edu', password: 'demo123', firstName: 'Demo', lastName: 'Professor' },
      { email: 'faculty@ulm.edu', password: 'faculty123', firstName: 'Faculty', lastName: 'Member' },
    ];

    const emailExists = users.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
    if (emailExists) {
      setEmailError('This email is already registered. Please sign in instead.');
      return;
    }

    // Save new user to localStorage
    const newUser = {
      email: formData.email.toLowerCase(),
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    users.push(newUser);
    localStorage.setItem('autograde_users', JSON.stringify(users));

    // All validation passed - redirect to login page with success message
    router.push('/login?signup=success');
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'var(--color-error)';
      case 'medium':
        return 'var(--color-warning)';
      case 'strong':
        return 'var(--color-success)';
      default:
        return 'var(--color-border)';
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
          {/* ULM Shield Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-20 h-20 text-white" />
            </div>
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}>
            Autograder
          </h1>
          <p className="text-white/80" style={{ fontSize: '18px', lineHeight: '26px' }}>
            University of Louisiana Monroe
          </p>
          <p className="text-white/70 mt-2" style={{ fontSize: '14px', lineHeight: '22px' }}>
            Automated Grading System for Faculty
          </p>

          {/* Features List */}
          <div className="mt-12 text-left max-w-md mx-auto space-y-4">
            {[
              'Automated code grading and testing',
              'Real-time student performance analytics',
              'AI-powered plagiarism detection',
              'Seamless Canvas LMS integration'
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--color-gold-accent)] flex-shrink-0 mt-0.5" />
                <p className="text-white/80" style={{ fontSize: '14px', lineHeight: '22px' }}>
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Signup Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 overflow-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 600, lineHeight: '30px', color: 'var(--color-text-dark)' }}>
              Autograder
            </h2>
          </div>

          <div className="mb-8">
            <h2 className="mb-2" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
              Create Faculty Account
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '22px', color: 'var(--color-text-mid)' }}>
              Join the Autograder system and streamline your grading workflow
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-2"
                  style={{ fontSize: '13px', fontWeight: 500, lineHeight: '18px', color: 'var(--color-text-dark)' }}
                >
                  First Name *
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="h-11 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-2"
                  style={{ fontSize: '13px', fontWeight: 500, lineHeight: '18px', color: 'var(--color-text-dark)' }}
                >
                  Last Name *
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="h-11 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2"
                style={{ fontSize: '13px', fontWeight: 500, lineHeight: '18px', color: 'var(--color-text-dark)' }}
              >
                ULM Email Address *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="professor@ulm.edu"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setEmailError(null);
                }}
                onBlur={(e) => {
                  const error = validateULMEmail(e.target.value);
                  setEmailError(error);
                }}
                className={`h-11 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] ${emailError ? 'border-[var(--color-error)]' : ''
                  }`}
                required
              />
              {emailError ? (
                <p className="mt-1" style={{ fontSize: '12px', color: 'var(--color-error)' }}>
                  {emailError}
                </p>
              ) : (
                <p className="mt-1 text-[var(--color-text-light)]" style={{ fontSize: '12px' }}>
                  Must be a @ulm.edu email address
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
                Password *
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="h-11 pr-12 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    <div
                      className="h-1 flex-1 rounded-full transition-colors"
                      style={{ backgroundColor: passwordStrength ? getPasswordStrengthColor() : 'var(--color-border)' }}
                    />
                    <div
                      className="h-1 flex-1 rounded-full transition-colors"
                      style={{ backgroundColor: passwordStrength && passwordStrength !== 'weak' ? getPasswordStrengthColor() : 'var(--color-border)' }}
                    />
                    <div
                      className="h-1 flex-1 rounded-full transition-colors"
                      style={{ backgroundColor: passwordStrength === 'strong' ? getPasswordStrengthColor() : 'var(--color-border)' }}
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: getPasswordStrengthColor() }}>
                    Password strength: {passwordStrength}
                  </p>
                </div>
              )}
              <p className="mt-1 text-[var(--color-text-light)]" style={{ fontSize: '12px' }}>
                At least 6 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2"
                style={{ fontSize: '13px', fontWeight: 500, lineHeight: '18px', color: 'var(--color-text-dark)' }}
              >
                Confirm Password *
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="h-11 pr-12 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-mid)] hover:text-[var(--color-text-dark)]"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1" style={{ fontSize: '12px', color: 'var(--color-error)' }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2 pt-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                className="mt-0.5"
              />
              <label
                htmlFor="terms"
                className="cursor-pointer select-none"
                style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-text-dark)' }}
              >
                I agree to the{' '}
                <a href="#" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Form Error Message */}
            {formError && (
              <div
                className="p-3 rounded-lg flex items-start gap-3"
                style={{
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error)'
                }}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }} />
                <p style={{ fontSize: '14px', color: 'var(--color-error)' }}>
                  {formError}
                </p>
              </div>
            )}

            {/* Create Account Button */}
            <Button
              type="submit"
              className="w-full h-11 text-white hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'var(--color-primary)',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Create Account
            </Button>

            {/* Sign In Link */}
            <p className="text-center" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-text-light)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="hover:underline"
                style={{ color: 'var(--color-primary)', fontWeight: 500 }}
              >
                Sign In
              </button>
            </p>

            {/* Help Text */}
            <p className="text-center" style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--color-text-light)' }}>
              Need assistance? Contact{' '}
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