'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, AlertCircle, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { taService } from '@/services/api/taService';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface GradeEnrollment {
  student_id: number;
  student_name: string;
  email: string;
}

interface TAInvitation {
  id: number;
  student_id: number;
  status: 'pending' | 'accepted' | 'declined';
<<<<<<< HEAD
  student_name: string;
=======
  student_name?: string;
>>>>>>> origin/ree_update
}

interface TAManagementProps {
  courseId: number;
  enrolledStudents: GradeEnrollment[];
  onInvitationSent?: () => void;
}

export function TAManagement({
  courseId,
  enrolledStudents,
  onInvitationSent,
}: TAManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [invitations, setInvitations] = useState<TAInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadInvitations();
  }, [courseId]);

  const loadInvitations = async () => {
    try {
      const data = await taService.getCourseInvitations(courseId);
      setInvitations(data);
    } catch (err) {
      console.error('Failed to load TA invitations:', err);
    }
  };

  const handleInvite = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await taService.inviteTA(courseId, selectedStudent);
      setSuccess('TA invitation sent successfully!');
      setShowModal(false);
      setSelectedStudent(null);
      await loadInvitations();
      onInvitationSent?.();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  // Get students who haven't been invited or already accepted
  const availableStudents = enrolledStudents.filter(student => {
    const existingInv = invitations.find(inv => inv.student_id === student.student_id);
    return !existingInv || existingInv.status === 'declined';
  });

  const getInvitationStatus = (studentId: number) => {
    return invitations.find(inv => inv.student_id === studentId);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
            Grading Assistants
          </h3>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
          style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
        >
          <Plus className="w-4 h-4" />
          Invite TA
        </Button>
      </div>

      {/* Active TAs List */}
      {invitations.some(inv => inv.status === 'accepted') && (
        <div className="space-y-2">
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-mid)' }}>
            Active Grading Assistants
          </p>
          {invitations
            .filter(inv => inv.status === 'accepted')
            .map(inv => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-border)' }}
              >
                <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                  {inv.student_name}
                </span>
                <Check className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
              </div>
            ))}
        </div>
      )}

      {/* Pending Invitations */}
      {invitations.some(inv => inv.status === 'pending') && (
        <div className="space-y-2">
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-mid)' }}>
            Pending Invitations
          </p>
          {invitations
            .filter(inv => inv.status === 'pending')
            .map(inv => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: 'var(--color-warning-light)', border: '1px solid var(--color-border)' }}
              >
                <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                  {inv.student_name}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-warning)' }}>Pending...</span>
              </div>
            ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 space-y-4"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
              Invite Grading Assistant
            </h2>

            {error && (
              <div
                className="p-3 rounded-lg flex items-start gap-2"
                style={{
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error)',
                }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5" style={{ color: 'var(--color-error)' }} />
                <p style={{ fontSize: '13px', color: 'var(--color-error)' }}>{error}</p>
              </div>
            )}

            {success && (
              <div
                className="p-3 rounded-lg flex items-start gap-2"
                style={{
                  backgroundColor: 'var(--color-success-light)',
                  border: '1px solid var(--color-success)',
                }}
              >
                <Check className="w-4 h-4 mt-0.5" style={{ color: 'var(--color-success)' }} />
                <p style={{ fontSize: '13px', color: 'var(--color-success)' }}>{success}</p>
              </div>
            )}

            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)', display: 'block', marginBottom: '8px' }}>
                Select Student
              </label>
              <select
                value={selectedStudent || ''}
                onChange={e => setSelectedStudent(Number(e.target.value))}
                className="w-full p-2 rounded border"
                style={{ borderColor: 'var(--color-border)', fontSize: '14px' }}
              >
                <option value="">-- Choose a student --</option>
                {availableStudents.map(student => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.student_name} ({student.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setShowModal(false);
                  setSelectedStudent(null);
                  setError(null);
                }}
                style={{
                  backgroundColor: 'var(--color-border)',
                  color: 'var(--color-text-dark)',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                disabled={!selectedStudent || loading}
                className="flex items-center gap-2"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
