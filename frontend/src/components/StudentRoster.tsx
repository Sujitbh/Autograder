import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, Users, Loader2, AlertCircle } from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Sidebar } from './Sidebar';
import { useParams } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { courseService } from '@/services/api';
import type { CourseEnrollment } from '@/services/api/courseService';

function roleLabel(role: 'student' | 'ta' | 'instructor') {
  if (role === 'ta') return 'Grading Assistant';
  if (role === 'instructor') return 'Instructor';
  return 'Student';
}

export function StudentRoster() {
  const { courseId } = useParams() as { courseId: string };
  const cid = courseId ?? '';
  const [courseCode, setCourseCode] = useState(cid);

  const [members, setMembers] = useState<CourseEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'student' | 'ta' | 'instructor'>('student');
  const [isSaving, setIsSaving] = useState(false);

  const loadRoster = async () => {
    if (!cid) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseService.getEnrollments(cid);
      setMembers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load roster');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoster();
  }, [cid]);

  useEffect(() => {
    if (!cid) return;
    courseService
      .getCourse(cid)
      .then((course) => setCourseCode(course.code || cid))
      .catch(() => setCourseCode(cid));
  }, [cid]);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => {
      const name = (m.user?.name ?? '').toLowerCase();
      const email = (m.user?.email ?? '').toLowerCase();
      return name.includes(q) || email.includes(q) || String(m.user_id).includes(q);
    });
  }, [members, searchQuery]);

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      await courseService.addEnrollment(cid, {
        email: newMemberEmail.trim().toLowerCase(),
        role: newMemberRole,
      });
      setShowAddModal(false);
      setNewMemberEmail('');
      setNewMemberRole('student');
      await loadRoster();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleChange = async (
    enrollmentId: number,
    role: 'student' | 'ta' | 'instructor'
  ) => {
    setError(null);
    try {
      const updated = await courseService.updateEnrollmentRole(cid, enrollmentId, role);
      setMembers((prev) => prev.map((m) => (m.id === enrollmentId ? updated : m)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update role');
    }
  };

  const handleRemove = async (enrollmentId: number) => {
    setError(null);
    try {
      await courseService.removeEnrollment(cid, enrollmentId);
      setMembers((prev) => prev.filter((m) => m.id !== enrollmentId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to remove member');
    }
  };

  return (
    <PageLayout>
      <TopNav
        breadcrumbs={[
          { label: 'Courses', href: '/courses' },
          { label: courseCode, href: `/courses/${cid}` },
          { label: 'Students & Graders' },
        ]}
      />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar activeItem="students" />

        <main className="flex-1 overflow-auto p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                Class Roster
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                {members.length} total members
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student / Grader
            </Button>
          </div>

          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
              <Input
                placeholder="Search by name/email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[var(--color-border)]"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error)' }}>
              <AlertCircle className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
              <span style={{ fontSize: '13px', color: 'var(--color-error)' }}>{error}</span>
            </div>
          )}

<<<<<<< HEAD
          <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
=======
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
>>>>>>> origin/ree_update
            {isLoading ? (
              <div className="p-10 flex items-center justify-center gap-2" style={{ color: 'var(--color-text-mid)' }}>
                <Loader2 className="w-4 h-4 animate-spin" /> Loading roster...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-10 text-center" style={{ color: 'var(--color-text-mid)' }}>
                <Users className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--color-text-light)' }} />
                No members found.
              </div>
            ) : (
              <table className="w-full">
                <thead style={{ backgroundColor: 'var(--color-primary-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <tr>
                    <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Name</th>
                    <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Email</th>
                    <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Class Role</th>
                    <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-4 py-4" style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                        {member.user?.name ?? `User #${member.user_id}`}
                      </td>
                      <td className="px-4 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                        {member.user?.email ?? '—'}
                      </td>
                      <td className="px-4 py-4 w-[220px]">
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            handleRoleChange(member.id, value as 'student' | 'ta' | 'instructor')
                          }
                        >
                          <SelectTrigger className="h-9 border-[var(--color-border)]">
                            <SelectValue placeholder={roleLabel(member.role)} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="ta">Grading Assistant</SelectItem>
                            <SelectItem value="instructor">Instructor</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          variant="outline"
                          className="border-[var(--color-error)] text-[var(--color-error)]"
                          onClick={() => handleRemove(member.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Class Member</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                User Email
              </label>
              <Input
                type="email"
                placeholder="name@ulm.edu or student@warhawks.ulm.edu"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                Class Role
              </label>
              <Select
                value={newMemberRole}
                onValueChange={(value) => setNewMemberRole(value as 'student' | 'ta' | 'instructor')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="ta">Grading Assistant</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={isSaving || !newMemberEmail.trim()}>
              {isSaving ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
