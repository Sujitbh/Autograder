import { useState, useMemo, useCallback } from 'react';
import { Plus, MoreVertical, Edit, Trash2, Copy, Search, FileText, Clock, AlertTriangle, ChevronUp, ChevronDown, ClipboardX, FilterX, RefreshCw, Download, BarChart3, Eye, Archive } from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useRouter, useParams } from 'next/navigation';
import { GradingModal } from './GradingModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from './ui/dialog';
import { COURSE_STUDENT_COUNTS } from '../utils/studentData';

interface Assignment {
  id: string;
  name: string;
  language: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  gradedCount: number;
  published: boolean;
  courseId?: string;
}

const cs1 = COURSE_STUDENT_COUNTS['cs-1001'];
const cs2 = COURSE_STUDENT_COUNTS['cs-2050'];
const cs3 = COURSE_STUDENT_COUNTS['cs-3100'];
const cs4 = COURSE_STUDENT_COUNTS['cs-4200'];

const mockAssignmentsByCourse: Record<string, Assignment[]> = {
  'cs-1001': [
    { id: 'a1', name: 'Hello World Program', language: 'Python', dueDate: '2026-02-24', submissions: cs1, totalStudents: cs1, gradedCount: cs1, published: true },
    { id: 'a2', name: 'Variables and Data Types', language: 'Python', dueDate: '2026-03-03', submissions: Math.round(cs1 * 0.9), totalStudents: cs1, gradedCount: Math.round(cs1 * 0.71), published: true },
    { id: 'a3', name: 'Control Flow: Loops', language: 'Python', dueDate: '2026-03-10', submissions: Math.round(cs1 * 0.83), totalStudents: cs1, gradedCount: Math.round(cs1 * 0.48), published: true },
    { id: 'a4', name: 'Functions and Modules', language: 'Python', dueDate: '2026-03-17', submissions: Math.round(cs1 * 0.29), totalStudents: cs1, gradedCount: 0, published: true },
    { id: 'a5', name: 'Object-Oriented Programming', language: 'Python', dueDate: '2026-03-24', submissions: 0, totalStudents: cs1, gradedCount: 0, published: false },
  ],
  'cs-2050': [
    { id: 'ds1', name: 'Linked List Implementation', language: 'Java', dueDate: '2026-02-26', submissions: Math.round(cs2 * 0.86), totalStudents: cs2, gradedCount: Math.round(cs2 * 0.8), published: true },
    { id: 'ds2', name: 'Binary Search Trees', language: 'Java', dueDate: '2026-03-05', submissions: Math.round(cs2 * 0.71), totalStudents: cs2, gradedCount: Math.round(cs2 * 0.43), published: true },
    { id: 'ds3', name: 'Graph Algorithms', language: 'Java', dueDate: '2026-03-19', submissions: 0, totalStudents: cs2, gradedCount: 0, published: true },
  ],
  'cs-3100': [
    { id: 'se1', name: 'Requirements Document', language: 'Markdown', dueDate: '2026-02-28', submissions: Math.round(cs3 * 0.93), totalStudents: cs3, gradedCount: Math.round(cs3 * 0.86), published: true },
    { id: 'se2', name: 'System Design Diagram', language: 'UML', dueDate: '2026-03-12', submissions: Math.round(cs3 * 0.36), totalStudents: cs3, gradedCount: 0, published: true },
    { id: 'se3', name: 'Sprint Review Presentation', language: 'Presentation', dueDate: '2026-03-26', submissions: 0, totalStudents: cs3, gradedCount: 0, published: false },
  ],
  'cs-4200': [
    { id: 'wd1', name: 'React Portfolio App', language: 'TypeScript', dueDate: '2026-03-07', submissions: Math.round(cs4 * 0.78), totalStudents: cs4, gradedCount: Math.round(cs4 * 0.56), published: true },
    { id: 'wd2', name: 'REST API Project', language: 'TypeScript', dueDate: '2026-03-21', submissions: 0, totalStudents: cs4, gradedCount: 0, published: true },
  ],
};

function loadCreatedAssignments(courseId: string): Assignment[] {
  try {
    const stored = JSON.parse(localStorage.getItem('createdAssignments') || '[]');
    return (stored as any[]).filter(a => a.courseId === courseId).map(a => ({
      id: a.id,
      name: a.name,
      language: a.language,
      dueDate: a.dueDate,
      submissions: a.submissions ?? 0,
      totalStudents: a.totalStudents ?? 0,
      gradedCount: a.gradedCount ?? 0,
      published: a.published ?? false,
      courseId: a.courseId,
    }));
  } catch {
    return [];
  }
}

function getAllAssignments(courseId: string): Assignment[] {
  const mock = mockAssignmentsByCourse[courseId] || [];
  return [...mock, ...loadCreatedAssignments(courseId)];
}

function saveCreatedAssignments(assignments: Assignment[], courseId: string) {
  try {
    const all = JSON.parse(localStorage.getItem('createdAssignments') || '[]');
    const otherCourses = all.filter((a: any) => a.courseId !== courseId);
    const thisCourse = assignments
      .filter(a => a.courseId === courseId)
      .map(a => ({ ...a, courseId }));
    localStorage.setItem('createdAssignments', JSON.stringify([...otherCourses, ...thisCourse]));
  } catch { /* ignore */ }
}

// Current date for overdue logic
const NOW = new Date('2026-02-19');

type SortField = 'name' | 'language' | 'dueDate' | 'submitted' | 'needsGrade' | 'status';
type SortOrder = 'asc' | 'desc';

function getNeedsGrade(a: Assignment): number {
  return a.submissions - a.gradedCount;
}

function getStatus(a: Assignment): 'draft' | 'open' | 'graded' | 'closed' {
  if (!a.published) return 'draft';
  const needsGrade = getNeedsGrade(a);
  if (needsGrade === 0 && a.submissions > 0) return 'graded';
  if (new Date(a.dueDate) < NOW && needsGrade === 0) return 'closed';
  return 'open';
}

function getSubmittedPct(a: Assignment): number {
  if (a.totalStudents === 0) return 0;
  return Math.round((a.submissions / a.totalStudents) * 100);
}

function isOverdue(a: Assignment): boolean {
  const status = getStatus(a);
  return new Date(a.dueDate) < NOW && status === 'open' && getNeedsGrade(a) > 0;
}

const STATUS_ORDER: Record<string, number> = { open: 0, graded: 1, draft: 2, closed: 3 };

function lookupCourse(courseId: string): { code: string; title: string } {
  try {
    const stored = JSON.parse(localStorage.getItem('autograde_courses') || '[]');
    const found = stored.find((c: any) => c.id === courseId);
    if (found) return { code: found.code, title: found.title };
  } catch { /* ignore */ }
  return { code: courseId, title: '' };
}

export function CourseInterior() {
  const router = useRouter();
  const { courseId } = useParams() as { courseId: string };
  const courseInfo = lookupCourse(courseId ?? '');
  const [activeTab, setActiveTab] = useState('all');
  const [_showGradingModal, _setShowGradingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);
  const [duplicateTarget, setDuplicateTarget] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>(() => getAllAssignments(courseId ?? ''));

  const handleDeleteAssignment = useCallback(() => {
    if (!deleteTarget || !courseId) return;
    const updated = assignments.filter(a => a.id !== deleteTarget.id);
    setAssignments(updated);
    // Only user-created assignments are in localStorage; mock ones just get filtered from state
    const userCreated = updated.filter(a => a.courseId === courseId);
    saveCreatedAssignments(userCreated, courseId);
    setDeleteTarget(null);
  }, [deleteTarget, assignments, courseId]);

  const handleDuplicateAssignment = useCallback(() => {
    if (!duplicateTarget || !courseId) return;
    const copy: Assignment = {
      ...duplicateTarget,
      id: `a-${Date.now()}`,
      name: `${duplicateTarget.name} (Copy)`,
      published: false,
      submissions: 0,
      gradedCount: 0,
      courseId,
    };
    const updated = [...assignments, copy];
    setAssignments(updated);
    // Persist the new copy
    try {
      const existing = JSON.parse(localStorage.getItem('createdAssignments') || '[]');
      existing.push(copy);
      localStorage.setItem('createdAssignments', JSON.stringify(existing));
    } catch { /* ignore */ }
    setDuplicateTarget(null);
  }, [duplicateTarget, assignments, courseId]);

  if (!courseId) {
    return (
      <PageLayout>
        <TopNav breadcrumbs={[{ label: 'Courses', href: '/courses' }]} />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center">
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '16px' }}>
              Course Not Found
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '24px' }}>
              The course ID is missing or invalid.
            </p>
            <Button onClick={() => router.push('/courses')} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
              Back to Courses
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Derived counts for tabs
  const tabCounts = useMemo(() => {
    const all = assignments.length;
    const open = assignments.filter(a => getStatus(a) === 'open').length;
    const totalNeedsGrade = assignments.reduce((s, a) => s + getNeedsGrade(a), 0);
    const graded = assignments.filter(a => getStatus(a) === 'graded').length;
    const draft = assignments.filter(a => getStatus(a) === 'draft').length;
    return { all, open, totalNeedsGrade, graded, draft };
  }, [assignments]);

  const tabs = [
    { id: 'all', label: 'All', count: tabCounts.all },
    { id: 'open', label: 'Open', count: tabCounts.open },
    { id: 'pending', label: 'Pending Grading', count: tabCounts.totalNeedsGrade },
    { id: 'graded', label: 'Graded', count: tabCounts.graded },
    { id: 'draft', label: 'Drafts', count: tabCounts.draft },
  ];

  // Filter
  const filtered = useMemo(() => {
    return assignments.filter(a => {
      const status = getStatus(a);
      if (activeTab === 'open' && status !== 'open') return false;
      if (activeTab === 'pending' && getNeedsGrade(a) === 0) return false;
      if (activeTab === 'graded' && status !== 'graded') return false;
      if (activeTab === 'draft' && status !== 'draft') return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return a.name.toLowerCase().includes(q) || a.language.toLowerCase().includes(q);
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'language': cmp = a.language.localeCompare(b.language); break;
        case 'dueDate': cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); break;
        case 'submitted': cmp = getSubmittedPct(a) - getSubmittedPct(b); break;
        case 'needsGrade': cmp = getNeedsGrade(a) - getNeedsGrade(b); break;
        case 'status': cmp = (STATUS_ORDER[getStatus(a)] ?? 9) - (STATUS_ORDER[getStatus(b)] ?? 9); break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-3.5 h-3.5 opacity-30" />;
    return sortOrder === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
      : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />;
  };

  // Status badge per spec: pill shape, light bg + colored text
  const getStatusBadge = (status: ReturnType<typeof getStatus>) => {
    const cfg = {
      draft: { bg: '#F5F5F5', text: '#595959' },
      open: { bg: '#E8F0FF', text: '#1A4D7A' },
      graded: { bg: '#E8F5E8', text: '#2D6A2D' },
      closed: { bg: '#F0F0F0', text: '#8A8A8A' },
    };
    const s = cfg[status];
    return (
      <span
        style={{
          display: 'inline-block',
          backgroundColor: s.bg,
          color: s.text,
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: '12px',
          lineHeight: '14px',
          letterSpacing: '0.5px',
        }}
      >
        {status}
      </span>
    );
  };

  // Language chip: neutral gray pill
  const getLanguageChip = (language: string) => (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: '#F5F5F5',
        color: '#2D2D2D',
        fontSize: '12px',
        fontWeight: 500,
        padding: '4px 10px',
        borderRadius: '12px',
      }}
    >
      {language}
    </span>
  );

  return (
    <PageLayout>
      <TopNav breadcrumbs={[
        { label: 'Courses', href: '/courses' },
        { label: courseInfo.code || 'Course' },
        { label: 'Assignments' }
      ]} />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar activeItem="assignments" />

        <main className="flex-1 overflow-auto p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                Assignments
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                {assignments.length} assignments · {courseInfo.code} {courseInfo.title}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-lg hover:bg-[var(--color-primary-bg)] transition-colors"
                aria-label="Refresh data"
                title="Refresh data"
              >
                <RefreshCw className="w-4.5 h-4.5 text-[var(--color-text-mid)]" />
              </button>
              <Button
                onClick={() => router.push(`/courses/${courseId}/assignment/new`)}
                className="text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Assignment
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[var(--color-border)]"
              />
            </div>
          </div>

          {/* Filter Tabs with Counts */}
          <div className="flex gap-1 mb-6 border-b-2" style={{ borderColor: 'var(--color-border)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-3 transition-colors relative flex items-center gap-2"
                style={{
                  color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-mid)',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                      color: activeTab === tab.id ? '#fff' : 'var(--color-text-mid)',
                      padding: '1px 7px',
                      borderRadius: '10px',
                      lineHeight: '16px',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{ height: '2px', backgroundColor: 'var(--color-primary)' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Assignments Table */}
          {assignments.length === 0 ? (
            /* Empty State: No Assignments at all */
            <div className="text-center py-20">
              <ClipboardX className="w-16 h-16 mx-auto mb-4" style={{ color: '#D9D9D9' }} />
              <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>
                No Assignments Yet
              </p>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '24px' }}>
                Create your first assignment to get started.
              </p>
              <Button
                onClick={() => router.push(`/courses/${courseId}/assignment/new`)}
                className="text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Assignment
              </Button>
            </div>
          ) : sorted.length === 0 ? (
            /* Empty State: No Filter Results */
            <div className="text-center py-20">
              <FilterX className="w-12 h-12 mx-auto mb-4" style={{ color: '#D9D9D9' }} />
              <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>
                No {tabs.find(t => t.id === activeTab)?.label} Assignments
              </p>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '16px' }}>
                Try selecting a different filter.
              </p>
              <button
                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-primary)' }}
                className="hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
              <table className="w-full">
                <thead style={{ backgroundColor: 'var(--color-primary-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <tr>
                    <th className="text-left px-6 py-4">
                      <button onClick={() => handleSort('name')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        Assignment Name <SortIcon field="name" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-4 hidden md:table-cell">
                      <button onClick={() => handleSort('language')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        Language <SortIcon field="language" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-4">
                      <button onClick={() => handleSort('dueDate')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        Due Date <SortIcon field="dueDate" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-4">
                      <button onClick={() => handleSort('submitted')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        Submitted <SortIcon field="submitted" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-4">
                      <button onClick={() => handleSort('needsGrade')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        Needs Grade <SortIcon field="needsGrade" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-4">
                      <button onClick={() => handleSort('status')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        Status <SortIcon field="status" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((assignment) => {
                    const status = getStatus(assignment);
                    const needsGrade = getNeedsGrade(assignment);
                    const pct = getSubmittedPct(assignment);
                    const overdue = isOverdue(assignment);

                    // Submitted color per spec: green ≥80%, orange 50-79%, red <50%
                    const submittedColor = pct >= 80 ? '#2D6A2D' : pct >= 50 ? '#8A5700' : '#8B0000';

                    // Needs Grade color: gray if 0, orange 1-10, red >10, dash for draft
                    const needsGradeColor = needsGrade === 0 ? '#8A8A8A' : needsGrade <= 10 ? '#8A5700' : '#8B0000';

                    // Due date overdue if past AND status is open
                    const dueDateOverdue = new Date(assignment.dueDate) < NOW && status === 'open';

                    return (
                      <tr
                        key={assignment.id}
                        className="border-b transition-colors"
                        style={{
                          borderColor: 'var(--color-border)',
                          borderLeft: overdue ? '4px solid #8B0000' : '4px solid transparent',
                          cursor: 'pointer',
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View grading for ${assignment.name}`}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('.actions-column')) return;
                          router.push(`/courses/${courseId}/assignments/${assignment.id}/grading`);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (!(e.target as HTMLElement).closest('.actions-column')) {
                              router.push(`/courses/${courseId}/assignments/${assignment.id}/grading`);
                            }
                          }
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5EDED'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                      >
                        {/* Assignment Name */}
                        <td className="px-6 py-4">
                          <span
                            className="assignment-name"
                            style={{ fontSize: '14px', fontWeight: 600, color: '#6B0000' }}
                          >
                            {assignment.name}
                          </span>
                        </td>

                        {/* Language — hidden on small screens */}
                        <td className="px-5 py-4 hidden md:table-cell">
                          {getLanguageChip(assignment.language)}
                        </td>

                        {/* Due Date — overdue warning */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            {dueDateOverdue && (
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#8B0000' }} />
                            )}
                            <span style={{
                              fontSize: '13px',
                              color: dueDateOverdue ? '#8B0000' : '#595959',
                              fontWeight: dueDateOverdue ? 500 : 400,
                            }}>
                              {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </td>

                        {/* Submitted — stacked: "X / Y" + "(Z%)" */}
                        <td className="px-5 py-4">
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: submittedColor }}>
                              {assignment.submissions} / {assignment.totalStudents}
                            </span>
                            <br />
                            <span style={{ fontSize: '12px', fontWeight: 400, color: submittedColor }}>
                              ({pct}%)
                            </span>
                          </div>
                        </td>

                        {/* Needs Grade — color-coded count or dash for draft */}
                        <td className="px-5 py-4">
                          {status === 'draft' ? (
                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#8A8A8A' }}>—</span>
                          ) : (
                            <span style={{ fontSize: '16px', fontWeight: 700, color: needsGradeColor }}>
                              {needsGrade}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {getStatusBadge(status)}
                        </td>

                        {/* Actions — Edit, Duplicate, Delete (red on hover), More dropdown */}
                        <td className="px-5 py-4 actions-column" onClick={(e) => e.stopPropagation()} style={{ cursor: 'default' }}>
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1.5 hover:bg-[var(--color-primary-bg)] rounded transition-colors"
                              aria-label="Edit assignment"
                              title="Edit"
                              onClick={() => router.push(`/courses/${courseId}/assignments/${assignment.id}/grading`)}
                            >
                              <Edit className="w-4.5 h-4.5 text-[var(--color-text-mid)]" />
                            </button>
                            <button
                              className="p-1.5 hover:bg-[var(--color-primary-bg)] rounded transition-colors"
                              aria-label="Duplicate assignment"
                              title="Duplicate"
                              onClick={() => setDuplicateTarget(assignment)}
                            >
                              <Copy className="w-4.5 h-4.5 text-[var(--color-text-mid)]" />
                            </button>
                            <button
                              className="p-1.5 rounded transition-colors group hover:bg-red-50"
                              aria-label="Delete assignment"
                              title="Delete"
                              onClick={() => setDeleteTarget(assignment)}
                            >
                              <Trash2 className="w-4.5 h-4.5 text-[var(--color-text-mid)] group-hover:text-[#8B0000]" />
                            </button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="p-1.5 hover:bg-[var(--color-primary-bg)] rounded transition-colors"
                                  aria-label="More actions"
                                  title="More"
                                >
                                  <MoreVertical className="w-4.5 h-4.5 text-[var(--color-text-mid)]" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() => router.push(`/courses/${courseId}/assignments/${assignment.id}/grading`)}
                                >
                                  <Eye className="w-4 h-4" /> View Submissions
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() => router.push(`/courses/${courseId}/reports`)}
                                >
                                  <Download className="w-4 h-4" /> Export Grades
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() => router.push(`/courses/${courseId}/reports`)}
                                >
                                  <BarChart3 className="w-4 h-4" /> View Reports
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    const updated = assignments.map(a =>
                                      a.id === assignment.id ? { ...a, published: false } : a
                                    );
                                    setAssignments(updated);
                                  }}
                                >
                                  <Archive className="w-4 h-4" /> Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md" style={{ boxShadow: '0 8px 24px rgba(107, 0, 0, 0.15)' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
              Delete Assignment
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
              Delete &ldquo;{deleteTarget?.name}&rdquo;? This will permanently remove the assignment and all submissions. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="border-[var(--color-border)]">
              Cancel
            </Button>
            <Button onClick={handleDeleteAssignment} className="text-white" style={{ backgroundColor: '#8B0000' }}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Confirmation Dialog */}
      <Dialog open={!!duplicateTarget} onOpenChange={() => setDuplicateTarget(null)}>
        <DialogContent className="max-w-md" style={{ boxShadow: '0 8px 24px rgba(107, 0, 0, 0.15)' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
              Duplicate Assignment
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
              Duplicate &ldquo;{duplicateTarget?.name}&rdquo;? A copy will be created as a draft.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDuplicateTarget(null)} className="border-[var(--color-border)]">
              Cancel
            </Button>
            <Button onClick={handleDuplicateAssignment} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Copy className="w-4 h-4 mr-2" /> Duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageLayout>
  );
}