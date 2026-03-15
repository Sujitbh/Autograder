import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, Users, Loader2, AlertCircle, Upload } from 'lucide-react';
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

type EnrollmentRole = 'student' | 'ta' | 'instructor';

function roleLabel(role: EnrollmentRole) {
  if (role === 'ta') return 'Grading Assistant';
  if (role === 'instructor') return 'Instructor';
  return 'Student';
}

export function StudentRoster() {
  const { courseId } = useParams<{ courseId: string }>();
  const cid = courseId ?? '';
  const [courseCode, setCourseCode] = useState(cid);

  const [members, setMembers] = useState<CourseEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<EnrollmentRole>('student');
  const [importRole, setImportRole] = useState<EnrollmentRole>('student');
  const [importDomain, setImportDomain] = useState('warhawks.ulm.edu');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);

  const downloadImportRowsAsCsv = (rows: Array<{
    row_number: number;
    name: string | null;
    email: string | null;
    sis_login_id: string | null;
    sis_user_id: string | null;
    external_id: string | null;
    status: string;
    message: string | null;
  }>) => {
    const headers = [
      'Row',
      'Name',
      'Email',
      'SIS Login ID',
      'SIS User ID',
      'Student ID',
      'Status',
      'Message',
    ];

    const csvEscape = (value: string) => {
      const escaped = value.replaceAll('"', '""');
      return `"${escaped}"`;
    };

    const lines = [
      headers.join(','),
      ...rows.map((row) => [
        String(row.row_number),
        row.name ?? '',
        row.email ?? '',
        row.sis_login_id ?? '',
        row.sis_user_id ?? '',
        row.external_id ?? '',
        row.status,
        row.message ?? '',
      ].map((cell) => csvEscape(cell)).join(',')),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${courseCode || cid}-roster-import.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const loadRoster = async () => {
    if (!cid) return;
    setIsLoading(true);
    setError(null);
    setStatusMessage(null);
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
    setStatusMessage(null);
    setStatusMessage(null);
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
    role: EnrollmentRole
  ) => {
    setError(null);
    try {
      const updated = await courseService.updateEnrollmentRole(cid, enrollmentId, role);
      setMembers((prev) => prev.map((m) => (m.id === enrollmentId ? updated : m)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update role');
    }
  };

  const handleImportRoster = async () => {
    if (!importFile) return;
    setIsSaving(true);
    setError(null);
    try {
      const result = await courseService.importEnrollmentsFromFile(cid, {
        file: importFile,
        role: importRole,
        createMissingUsers: true,
        defaultDomain: importDomain.trim().toLowerCase() || 'warhawks.ulm.edu',
      });

      setShowImportModal(false);
      setImportFile(null);
      await loadRoster();

      setStatusMessage(
        `Import complete.\nSuccessfully enrolled: ${result.enrolled_count}\nAlready enrolled: ${result.already_enrolled_count}\nUsers created: ${result.created_users_count}\nSkipped: ${result.skipped_count}\n\nCheck the status summary for detailed errors if applicable.`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to import roster');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (enrollmentId: number) => {
    setError(null);
    setPendingRemoveId(null);
    try {
      await courseService.removeEnrollment(cid, enrollmentId);
      setMembers((prev) => prev.filter((m) => m.id !== enrollmentId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to remove member');
    }
  };

  const rosterContent = (() => {
    if (isLoading) {
      return (
        <div className="p-10 flex items-center justify-center gap-2" style={{ color: 'var(--color-text-mid)' }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Loading roster...
        </div>
      );
    }

    if (filteredMembers.length === 0) {
      return (
        <div className="p-10 text-center" style={{ color: 'var(--color-text-mid)' }}>
          <Users className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--color-text-light)' }} />
          No members found.
        </div>
      );
    }

    return (
      <table className="w-full">
        <thead style={{ backgroundColor: 'var(--color-primary-bg)', borderBottom: '1px solid var(--color-border)' }}>
          <tr>
            <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)', width: '40px' }}>#</th>
            <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Name</th>
            <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>CWID</th>
            <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Email</th>
            <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Class Role</th>
            <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member, index) => (
            <tr key={member.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
              <td className="px-4 py-4 text-center" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                {index + 1}
              </td>
              <td className="px-4 py-4" style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                {member.user?.name ?? `User #${member.user_id}`}
              </td>
              <td className="px-4 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)', fontVariantNumeric: 'tabular-nums' }}>
                {member.user?.sis_user_id ?? '—'}
              </td>
              <td className="px-4 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                {member.user?.email ?? '—'}
              </td>
              <td className="px-4 py-4 w-[220px]">
                <Select
                  value={member.role}
                  onValueChange={(value) =>
                    handleRoleChange(member.id, value as EnrollmentRole)
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
                  onClick={() => setPendingRemoveId(member.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  })();

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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowImportModal(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Roster File
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Student / Grader
              </Button>
            </div>
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

          {statusMessage && (
            <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }}>
              <pre className="whitespace-pre-wrap font-sans" style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>{statusMessage}</pre>
            </div>
          )}

          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
            {rosterContent}
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
              <p className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                User Email
              </p>
              <Input
                type="email"
                placeholder="name@ulm.edu or student@warhawks.ulm.edu"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </div>
            <div>
              <p className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                Class Role
              </p>
              <Select
                value={newMemberRole}
                onValueChange={(value) => setNewMemberRole(value as EnrollmentRole)}
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

      {/* ── Remove confirmation dialog ── */}
      {(() => {
        const pending = members.find((m) => m.id === pendingRemoveId);
        const isFaculty = pending?.role === 'instructor' || pending?.role === 'ta';
        const displayName = pending?.user?.name ?? `User #${pending?.user_id}`;
        const roleDisplay = pending?.role === 'instructor' ? 'Instructor' : pending?.role === 'ta' ? 'Grading Assistant' : 'Student';
        return (
          <Dialog open={pendingRemoveId !== null} onOpenChange={(open) => { if (!open) setPendingRemoveId(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove {roleDisplay}?</DialogTitle>
              </DialogHeader>
              <div className="py-2 space-y-3">
                <p style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                  Are you sure you want to remove <strong>{displayName}</strong> from this course?
                </p>
                {isFaculty && (
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error)' }}>
                    <p style={{ fontSize: '13px', color: 'var(--color-error)', fontWeight: 500 }}>
                      Warning: This person is a {roleDisplay}. Removing them will revoke their access to all course submissions and grading tools.
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPendingRemoveId(null)}>Cancel</Button>
                <Button
                  onClick={() => pending && handleRemove(pending.id)}
                  style={{ backgroundColor: 'var(--color-error)', color: '#fff' }}
                >
                  Remove {roleDisplay}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })()}

      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Roster & Auto-Enroll</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <p className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                Roster File (CSV/TXT)
              </p>
              <Input
                type="file"
                accept=".csv,.txt,.tsv,.xlsx,.xls"
                onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
              />
              <p className="mt-2" style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>
                Uses SIS Login ID to build email like login@domain when email is missing.
              </p>
            </div>

            <div>
              <p className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                Default Email Domain
              </p>
              <Input
                type="text"
                value={importDomain}
                onChange={(e) => setImportDomain(e.target.value)}
                placeholder="warhawks.ulm.edu"
              />
            </div>

            <div>
              <p className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                Class Role for Imported Users
              </p>
              <Select
                value={importRole}
                onValueChange={(value) => setImportRole(value as EnrollmentRole)}
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
            <Button variant="outline" onClick={() => setShowImportModal(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleImportRoster} disabled={isSaving || !importFile}>
              {isSaving ? 'Importing...' : 'Import & Enroll'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
