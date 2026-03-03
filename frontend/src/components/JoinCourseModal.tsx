'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/services/api/courseService';
import { Button } from './ui/button';
import { X, BookOpen, Loader2, CheckCircle2 } from 'lucide-react';

interface JoinCourseModalProps {
  open: boolean;
  onClose: () => void;
}

export function JoinCourseModal({ open, onClose }: JoinCourseModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    try {
      await courseService.enrollStudent(trimmed);
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['student-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['student-dashboard-results'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setTimeout(() => handleClose(), 1500);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || 'Failed to join course. Please check the code and try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative rounded-2xl w-full max-w-md mx-4 overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-modal)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-light)' }}>
              <BookOpen className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-dark)' }}>Join a Course</h2>
              <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>Enter the enrollment code from your instructor</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--color-text-mid)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-success)' }} />
              <p className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>Successfully Joined!</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)' }}>The course has been added to your dashboard.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="enrollment-code" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Enrollment Code
                </label>
                <input
                  id="enrollment-code"
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  placeholder="e.g. ABC1234"
                  className="w-full px-4 py-3 rounded-xl border text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-white)', color: 'var(--color-text-dark)', '--tw-ring-color': 'var(--color-primary)' } as any}
                  autoFocus
                  maxLength={10}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error)' }}>
                  <p className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  disabled={isLoading || !code.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Joining...
                    </>
                  ) : (
                    'Join Course'
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
