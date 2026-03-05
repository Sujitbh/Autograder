'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { taService } from '@/services/api/taService';
import { useAuth } from '@/utils/AuthContext';

interface TAInvitation {
  id: number;
  course_id: number;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  course_name: string;
  course_code: string;
  instructor_name: string;
}

interface TAInvitationsProps {
  onAccepted?: () => void;
}

export function TAInvitations({ onAccepted }: Readonly<TAInvitationsProps>) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [invitations, setInvitations] = useState<TAInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only load invitations if authentication is ready and user is authenticated
    if (!authLoading && isAuthenticated) {
      loadInvitations();
    } else if (!authLoading && !isAuthenticated) {
      // User is not authenticated, stop loading
      setLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taService.getMyInvitations();
      setInvitations(data);
    } catch (err) {
      console.error('Failed to load TA invitations:', err);
      // Don't show error message for authentication issues - just silently fail
      if (err instanceof Error && err.message.includes('authenticated')) {
        // Silent fail for auth issues
        setInvitations([]);
      } else {
        setError('Failed to load invitations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId: number) => {
    setRespondingId(invitationId);
    setError(null);

    try {
      await taService.acceptInvitation(invitationId);
      setInvitations(inv =>
        inv.map(i => (i.id === invitationId ? { ...i, status: 'accepted' } : i))
      );
      onAccepted?.();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to accept invitation');
    } finally {
      setRespondingId(null);
    }
  };

  const handleDecline = async (invitationId: number) => {
    setRespondingId(invitationId);
    setError(null);

    try {
      await taService.declineInvitation(invitationId);
      setInvitations(inv =>
        inv.map(i => (i.id === invitationId ? { ...i, status: 'declined' } : i))
      );
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to decline invitation');
    } finally {
      setRespondingId(null);
    }
  };

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const acceptedInvitations = invitations.filter(inv => inv.status === 'accepted');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (invitations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
          Grading Assistant Invitations
        </h2>
      </div>

      {error && (
        <div
          className="p-4 rounded-lg flex items-start gap-3"
          style={{
            backgroundColor: 'var(--color-error-bg)',
            border: '1px solid var(--color-error)',
          }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }} />
          <p style={{ fontSize: '14px', color: 'var(--color-error)' }}>{error}</p>
        </div>
      )}

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div className="space-y-3">
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-mid)' }}>
            Pending Invitations ({pendingInvitations.length})
          </p>
          {pendingInvitations.map(invitation => (
            <div
              key={invitation.id}
              className="p-4 rounded-lg border"
              style={{
                borderColor: 'var(--color-warning)',
                backgroundColor: 'var(--color-warning-light)',
              }}
            >
              <div className="space-y-3">
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                    {invitation.course_name}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                    {invitation.course_code} • Instructor: {invitation.instructor_name}
                  </p>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                  You've been invited to serve as a Grading Assistant for this course. You'll be able to:
                </p>

                <ul style={{ fontSize: '13px', color: 'var(--color-text-mid)', paddingLeft: '20px' }}>
                  <li>View student submissions</li>
                  <li>Grade and provide feedback</li>
                  <li>Track assignment progress</li>
                </ul>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAccept(invitation.id)}
                    disabled={respondingId === invitation.id}
                    className="flex items-center gap-2 flex-1"
                    style={{
                      backgroundColor: 'var(--color-success)',
                      color: 'white',
                    }}
                  >
                    {respondingId === invitation.id && <Loader2 className="w-4 h-4 animate-spin" />}
                    <Check className="w-4 h-4" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDecline(invitation.id)}
                    disabled={respondingId === invitation.id}
                    className="flex items-center gap-2 flex-1"
                    style={{
                      backgroundColor: 'var(--color-error)',
                      color: 'white',
                    }}
                  >
                    {respondingId === invitation.id && <Loader2 className="w-4 h-4 animate-spin" />}
                    <X className="w-4 h-4" />
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accepted Invitations */}
      {acceptedInvitations.length > 0 && (
        <div className="space-y-3">
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-mid)' }}>
            Active Grading Assistant Roles ({acceptedInvitations.length})
          </p>
          {acceptedInvitations.map(invitation => (
            <div
              key={invitation.id}
              className="p-4 rounded-lg border flex items-center justify-between"
              style={{
                borderColor: 'var(--color-success)',
                backgroundColor: 'var(--color-success-light)',
              }}
            >
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                  {invitation.course_name}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                  {invitation.course_code}
                </p>
              </div>
              <Check className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
