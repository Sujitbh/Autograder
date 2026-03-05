"use client";

import {
  useState,
} from "react";
import {
  Search,
  Grid3x3,
  List,
  GraduationCap,
  Plus,
  AlertTriangle,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { PageLayout } from "./PageLayout";
import { TopNav } from "./TopNav";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TAInvitations } from "./TAInvitations";
import { JoinCourseModal } from "./JoinCourseModal";
import { useRouter } from "next/navigation";
import { useStudentDashboardStats } from "@/hooks/queries/useStudentDashboardStats";

// ─────── Types ────────────
interface StudentCourse {
  id: number | string;
  name: string;
  code: string;
  description?: string;
  assignments_count?: number;
  completed_count?: number;
  average_score?: number | null;
}

function StudentDashboard() {
  const router = useRouter();
  const { data: stats, isLoading, error } = useStudentDashboardStats();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshInvitations, setRefreshInvitations] = useState(0);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const courses: StudentCourse[] = stats?.courses ?? [];

  /* ── Filtering ── */
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getProgressLabel = (course: StudentCourse) => {
    const total = course.assignments_count ?? 0;
    const completed = course.completed_count ?? 0;
    if (total === 0) return { text: '✓ No assignments yet', color: 'var(--color-text-mid)' };
    if (completed === total) return { text: '✓ All caught up', color: 'var(--color-success)' };
    const overdue = total - completed;
    return { text: `${overdue} assignment${overdue === 1 ? '' : 's'} remaining`, color: 'var(--color-warning)' };
  };

  return (
    <PageLayout>
      <TopNav breadcrumbs={[{ label: 'My Courses' }]} />

      <main className="p-8">
        {/* TA Invitations (above everything) */}
        <div className="mb-6">
          <TAInvitations
            key={refreshInvitations}
            onAccepted={() => {
              setRefreshInvitations(prev => prev + 1);
            }}
          />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-primary)', fontFamily: 'Inter, sans-serif' }}>
              My Courses
            </h1>
            <p style={{ fontSize: '14px', fontWeight: 400, color: 'var(--color-text-mid)', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
              Spring 2026 — University of Louisiana Monroe
            </p>
          </div>
          <Button
            onClick={() => setShowJoinModal(true)}
            className="text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', height: '40px', padding: '0 24px' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Join Course
          </Button>
        </div>

        {/* Filter Bar */}
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px' }}>
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div style={{ width: '50%', minWidth: '250px' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                <Input
                  placeholder="Search by course name or code…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[var(--color-border)]"
                />
              </div>
            </div>

            {/* Semester Filter */}
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger style={{ width: '180px' }}>
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                <SelectItem value="Summer 2025">Summer 2025</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger style={{ width: '140px' }}>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex gap-1 ml-auto" style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '2px' }}>
              <button
                onClick={() => setViewMode('grid')}
                className="flex items-center justify-center rounded transition-colors"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--primary-foreground)' : 'var(--color-text-mid)'
                }}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="flex items-center justify-center rounded transition-colors"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--primary-foreground)' : 'var(--color-text-mid)'
                }}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading courses…</span>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-2" style={{ color: 'var(--color-danger, #ef4444)' }}>
            <AlertTriangle className="w-6 h-6" />
            <span>Failed to load courses.</span>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredCourses.length === 0 && courses.length === 0 && (
          <div className="rounded-xl border-2 border-dashed p-12 text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
            <GraduationCap className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
            <p className="text-xl font-semibold" style={{ color: 'var(--color-text-dark)' }}>No Courses Yet</p>
            <p className="mt-2" style={{ color: 'var(--color-text-mid)' }}>
              You haven&apos;t joined any courses yet. Click &quot;Join Course&quot; to get started.
            </p>
          </div>
        )}

        {/* No filter matches */}
        {!isLoading && !error && filteredCourses.length === 0 && courses.length > 0 && (
          <div className="text-center py-12">
            <p style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
              No courses found matching your filters.
            </p>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && !error && filteredCourses.length > 0 && (
          <div
            className={viewMode === 'grid' ? 'grid gap-5' : 'space-y-4'}
            style={viewMode === 'grid' ? { gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' } : undefined}
          >
            {filteredCourses.map((course) => {
              const progress = getProgressLabel(course);
              const completedPct = course.assignments_count && course.assignments_count > 0
                ? Math.round(((course.completed_count ?? 0) / course.assignments_count) * 100)
                : null;

              return (
                <div
                  key={course.id}
                  role="article"
                  className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer text-left"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    border: 'none',
                    padding: 0,
                    width: '100%',
                  }}
                  onClick={() => router.push(`/student/courses/${course.id}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/student/courses/${course.id}`); } }}
                  tabIndex={0}
                >
                  {/* Maroon Top Bar */}
                  <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-primary)' }} />

                  <div style={{ padding: '20px 20px 16px', flex: 1 }}>
                    {/* Row 1: Course Code */}
                    <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--primary-foreground)',
                          fontSize: '12px',
                          fontWeight: 700,
                          fontFamily: 'Inter, sans-serif',
                          borderRadius: '9999px',
                          padding: '3px 12px',
                          display: 'inline-block'
                        }}
                      >
                        {course.code}
                      </span>
                      {completedPct !== null && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#888',
                            fontFamily: 'monospace',
                          }}
                        >
                          {completedPct}%
                        </span>
                      )}
                    </div>

                    {/* Row 2: Course Title */}
                    <h3
                      style={{
                        fontSize: '17px',
                        fontWeight: 600,
                        lineHeight: '22px',
                        color: 'var(--color-text-dark)',
                        fontFamily: 'Inter, sans-serif',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {course.name}
                    </h3>

                    {/* Row 3: Semester • Assignments */}
                    <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
                      Spring 2026 · {course.assignments_count ?? 0} Assignment{(course.assignments_count ?? 0) === 1 ? '' : 's'}
                    </p>

                    {/* Progress / Status */}
                    <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div className="flex items-center gap-2" style={{ fontSize: '13px', color: progress.color, fontFamily: 'Inter, sans-serif' }}>
                        <span>{progress.text}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'var(--color-surface-elevated)',
                      borderTop: '1px solid var(--color-border)',
                      borderRadius: '0 0 12px 12px'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="px-2 py-1 rounded"
                        style={{
                          backgroundColor: 'var(--color-success)',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 700,
                          lineHeight: '14px',
                          textTransform: 'uppercase' as const,
                        }}
                      >
                        ACTIVE
                      </span>
                      <button
                        type="button"
                        className="hover:underline"
                        style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/student/courses/${course.id}`);
                        }}
                      >
                        Open Course →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <JoinCourseModal open={showJoinModal} onClose={() => setShowJoinModal(false)} />
    </PageLayout>
  );
}

export default StudentDashboard;
