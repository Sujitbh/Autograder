'use client';

import { useState } from 'react';
import {
  Loader2,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  UserPlus,
  Trash2,
  Settings2,
  Search,
} from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  useAdminTAAssignments,
  useAdminTAInvitations,
  useAssignTA,
  useRemoveTA,
  useUpdateTAPermissions,
  useAdminCourses,
} from '@/hooks/queries/useAdmin';
import type { TAAssignment, TAPermissions } from '@/services/api/adminService';

/* ── Permission labels ─────────────────────────────────────────── */
const PERMISSION_LABELS: { key: keyof TAPermissions; label: string; description: string }[] = [
  { key: 'can_grade', label: 'Grade Submissions', description: 'View and grade student submissions' },
  { key: 'can_view_submissions', label: 'View Submissions', description: 'See all submitted student work' },
  { key: 'can_view_students', label: 'View Students', description: 'Access the student roster' },
  { key: 'can_manage_testcases', label: 'Manage Test Cases', description: 'Create, edit, and delete test cases' },
  { key: 'can_manage_assignments', label: 'Manage Assignments', description: 'Create and update assignments' },
];

/* ── Assign TA dialog ──────────────────────────────────────────── */
function AssignTADialog({
  open,
  onOpenChange,
}: Readonly<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
}>) {
  const [email, setEmail] = useState('');
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');

  const { data: courses } = useAdminCourses();
  const assignTA = useAssignTA();

  const handleSubmit = async () => {
    setError('');
    if (!email.trim()) return setError('Please enter a user email');
    if (!courseId) return setError('Please select a course');

    try {
      await assignTA.mutateAsync({ user_email: email.trim(), course_id: Number(courseId) });
      setEmail('');
      setCourseId('');
      onOpenChange(false);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setError(msg || 'Failed to assign TA');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: '480px' }}>
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--color-primary)' }}>Assign TA to Course</DialogTitle>
          <DialogDescription>
            Enter the user&apos;s email and select the course to assign them as a TA.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Email */}
          <div>
            <label htmlFor="ta-email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-dark)' }}>
              User Email
            </label>
            <Input
              id="ta-email"
              placeholder="user@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Course select */}
          <div>
            <label htmlFor="ta-course" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-dark)' }}>
              Course
            </label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a course..." />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-y-auto">
                {(courses ?? []).map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.code ? `${c.code} — ${c.name}` : c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm font-medium" style={{ color: 'var(--color-error, #dc2626)' }}>
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={assignTA.isPending}
            className="text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {assignTA.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Assigning…
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" /> Assign TA
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Permissions dialog ────────────────────────────────────────── */
function PermissionsDialog({
  assignment,
  open,
  onOpenChange,
}: Readonly<{
  assignment: TAAssignment | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}>) {
  const updatePerms = useUpdateTAPermissions();
  const [local, setLocal] = useState<TAPermissions | null>(null);

  // Sync local state when dialog opens
  const perms = local ?? assignment?.permissions;

  const handleToggle = (key: keyof TAPermissions) => {
    if (!perms) return;
    setLocal({ ...perms, [key]: !perms[key] });
  };

  const handleSave = async () => {
    if (!assignment || !local) return;
    await updatePerms.mutateAsync({
      enrollmentId: assignment.enrollment_id,
      permissions: local,
    });
    setLocal(null);
    onOpenChange(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) setLocal(null);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent style={{ maxWidth: '520px' }}>
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--color-primary)' }}>TA Permissions</DialogTitle>
          <DialogDescription>
            Configure what <strong>{assignment?.user_name ?? 'this TA'}</strong> can do in{' '}
            <strong>{assignment?.course_name ?? 'this course'}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 py-2">
          {PERMISSION_LABELS.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50"
              style={{ backgroundColor: 'var(--color-primary-bg)' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>
                  {label}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>
                  {description}
                </p>
              </div>
              <Switch
                checked={perms?.[key] ?? false}
                onCheckedChange={() => handleToggle(key)}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updatePerms.isPending || !local}
            className="text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {updatePerms.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
              </>
            ) : (
              'Save Permissions'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Remove confirmation dialog ────────────────────────────────── */
function RemoveDialog({
  assignment,
  open,
  onOpenChange,
}: Readonly<{
  assignment: TAAssignment | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}>) {
  const removeTA = useRemoveTA();

  const handleRemove = async () => {
    if (!assignment) return;
    await removeTA.mutateAsync(assignment.enrollment_id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: '440px' }}>
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--color-error, #dc2626)' }}>Remove TA</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{assignment?.user_name}</strong> as TA from{' '}
            <strong>{assignment?.course_name}</strong>? This will revoke all their TA permissions
            for this course.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRemove}
            disabled={removeTA.isPending}
            className="text-white"
            style={{ backgroundColor: 'var(--color-error, #dc2626)' }}
          >
            {removeTA.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Removing…
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" /> Remove TA
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Permission badges ─────────────────────────────────────────── */
function PermBadges({ permissions }: Readonly<{ permissions: TAPermissions }>) {
  const active = PERMISSION_LABELS.filter(({ key }) => permissions[key]);
  if (active.length === 0) return <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>No permissions</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {active.map(({ key, label }) => (
        <span
          key={key}
          className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────── */
export function AdminTAManagement() {
  const { data: assignments, isLoading: loadingAssignments } = useAdminTAAssignments();
  const { data: invitations, isLoading: loadingInvitations } = useAdminTAInvitations();

  const [tab, setTab] = useState<'assignments' | 'invitations'>('assignments');
  const [search, setSearch] = useState('');

  // Dialogs state
  const [assignOpen, setAssignOpen] = useState(false);
  const [permsTarget, setPermsTarget] = useState<TAAssignment | null>(null);
  const [removeTarget, setRemoveTarget] = useState<TAAssignment | null>(null);

  const filteredAssignments = (assignments ?? []).filter((a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      a.user_name?.toLowerCase().includes(s) ||
      a.user_email?.toLowerCase().includes(s) ||
      a.course_name?.toLowerCase().includes(s) ||
      a.course_code?.toLowerCase().includes(s)
    );
  });

  const statusIcon = (status: string) => {
    if (status === 'accepted') return <CheckCircle2 className="w-4 h-4" style={{ color: '#2D6A2D' }} />;
    if (status === 'declined') return <XCircle className="w-4 h-4" style={{ color: 'var(--color-error)' }} />;
    return <Clock className="w-4 h-4" style={{ color: '#8A5700' }} />;
  };

  const statusColor = (status: string) => {
    if (status === 'accepted') return { bg: '#E8F5E9', color: '#2D6A2D' };
    if (status === 'declined') return { bg: '#FFE6E6', color: '#8B0000' };
    return { bg: '#FFF3CD', color: '#8A5700' };
  };

  return (
    <AdminLayout activeItem="ta" breadcrumbs={[{ label: 'TA Management' }]}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>
            TA Management
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
            Assign TAs to courses and manage their permissions
          </p>
        </div>
        <Button
          onClick={() => setAssignOpen(true)}
          className="text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <UserPlus className="w-4 h-4 mr-2" /> Assign TA
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
        {[
          { id: 'assignments' as const, label: `Assignments (${assignments?.length ?? 0})` },
          { id: 'invitations' as const, label: `Invitations (${invitations?.length ?? 0})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: tab === t.id ? 'var(--color-surface)' : 'transparent',
              color: tab === t.id ? 'var(--color-primary)' : 'var(--color-text-mid)',
              boxShadow: tab === t.id ? 'var(--shadow-card)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ───────────── Assignments Tab ───────────── */}
      {tab === 'assignments' && (
        <>
          {/* Search bar */}
          <div
            className="flex items-center gap-4 mb-4 p-3 rounded-lg"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
              <Input
                placeholder="Search by name, email, or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loadingAssignments && (
            <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
              <Loader2 className="w-5 h-5 animate-spin" /> <span>Loading...</span>
            </div>
          )}

          {!loadingAssignments && filteredAssignments.length === 0 && (
            <div
              className="text-center py-20 rounded-xl"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <UserCheck className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-light)' }} />
              <p className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>
                {search ? 'No matching TAs' : 'No TAs Assigned'}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)' }}>
                {search ? 'Try a different search' : 'Click "Assign TA" to get started'}
              </p>
            </div>
          )}

          {!loadingAssignments && filteredAssignments.length > 0 && (
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                    <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                      TA Name
                    </th>
                    <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                      Email
                    </th>
                    <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                      Course
                    </th>
                    <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                      Permissions
                    </th>
                    <th className="text-right px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((a) => (
                    <tr key={a.enrollment_id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-5 py-4 font-medium" style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                        {a.user_name}
                      </td>
                      <td className="px-5 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                        {a.user_email}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                            {a.course_code}
                          </span>
                          <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>{a.course_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <PermBadges permissions={a.permissions} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPermsTarget(a)}
                            title="Edit permissions"
                          >
                            <Settings2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRemoveTarget(a)}
                            title="Remove TA"
                            style={{ borderColor: 'var(--color-error, #dc2626)', color: 'var(--color-error, #dc2626)' }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ───────────── Invitations Tab ───────────── */}
      {tab === 'invitations' && loadingInvitations && (
        <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
          <Loader2 className="w-5 h-5 animate-spin" /> <span>Loading...</span>
        </div>
      )}

      {tab === 'invitations' && !loadingInvitations && (!invitations || invitations.length === 0) && (
        <div
          className="text-center py-20 rounded-xl"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>
            No Invitations
          </p>
        </div>
      )}

      {tab === 'invitations' && !loadingInvitations && invitations && invitations.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                  Student
                </th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                  Course
                </th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                  Invited By
                </th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                  Status
                </th>
                <th className="text-left px-5 py-3" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((inv) => {
                const sc = statusColor(inv.status);
                return (
                  <tr key={inv.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-5 py-4 font-medium" style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                      {inv.student_name}
                    </td>
                    <td className="px-5 py-4" style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                      {inv.course_name}
                    </td>
                    <td className="px-5 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                      {inv.faculty_name}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        {statusIcon(inv.status)} {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4" style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                      {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ───────────── Dialogs ───────────── */}
      <AssignTADialog open={assignOpen} onOpenChange={setAssignOpen} />
      <PermissionsDialog
        assignment={permsTarget}
        open={!!permsTarget}
        onOpenChange={(v) => { if (!v) setPermsTarget(null); }}
      />
      <RemoveDialog
        assignment={removeTarget}
        open={!!removeTarget}
        onOpenChange={(v) => { if (!v) setRemoveTarget(null); }}
      />
    </AdminLayout>
  );
}
