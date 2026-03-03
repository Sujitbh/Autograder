"use client";

import {
<<<<<<< HEAD
  useMemo,
  useState,
} from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  GraduationCap,
  LogOut,
  AlertCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { PageLayout } from "./PageLayout";
import { Button } from "./ui/button";
import { useAuth } from "@/utils/AuthContext";
import { TAInvitations } from "./TAInvitations";
import { TeachingAssistantSection } from "./TeachingAssistantSection";
import { useRouter } from "next/navigation";
import { useStudentDashboardStats } from "@/hooks/queries/useStudentDashboardStats";
import { useTACourses } from "@/hooks/queries/useCourses";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api/client";

// ─────── COURSE CARD ────────────
=======
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
>>>>>>> origin/ree_update
interface StudentCourse {
  id: number | string;
  name: string;
  code: string;
  description?: string;
  assignments_count?: number;
  completed_count?: number;
  average_score?: number | null;
}

<<<<<<< HEAD
function StudentCourseCard({ course, onClick }: { course: StudentCourse; onClick: () => void }) {
  const progress = course.assignments_count && course.assignments_count > 0
    ? Math.round(((course.completed_count || 0) / course.assignments_count) * 100)
    : 0;

  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return '#9CA3AF';
    if (score >= 75) return '#16A34A';
    if (score >= 60) return '#D97706';
    return '#DC2626';
  };

  return (
    <div
      role="button"
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
    >
      {/* Top maroon bar */}
      <div className="h-2 w-full bg-[#6B0000]" />

      {/* Header with code badge */}
      <div className="flex items-start justify-between gap-2 px-5 pt-4 pb-3">
        <span className="inline-flex items-center rounded-full bg-[#6B0000] px-3 py-0.5 text-xs font-semibold text-white">
          {course.code}
        </span>
      </div>

      {/* Course name + description */}
      <div className="flex-1 px-5 pb-4">
        <h3 className="text-lg font-semibold leading-snug text-gray-900">
          {course.name}
        </h3>
        {course.description && (
          <p className="mt-2 text-xs text-gray-500 line-clamp-2">
            {course.description}
          </p>
        )}
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-px border-t border-gray-100 bg-gray-100">
        {/* Assignments */}
        <div className="flex flex-col items-center gap-1 bg-white py-3">
          <ClipboardList className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900">
            {course.assignments_count ?? 0}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-gray-400">
            Assignments
          </span>
        </div>

        {/* Completed */}
        <div className="flex flex-col items-center gap-1 bg-white py-3">
          <CheckCircle2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900">
            {course.completed_count ?? 0}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-gray-400">
            Completed
          </span>
        </div>

        {/* Average Score */}
        <div className="flex flex-col items-center gap-1 bg-white py-3">
          <TrendingUp className="h-4 w-4" style={{ color: getScoreColor(course.average_score) }} />
          <span className="text-sm font-semibold" style={{ color: getScoreColor(course.average_score) }}>
            {course.average_score !== null && course.average_score !== undefined
              ? `${Math.round(course.average_score)}%`
              : '—'}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-gray-400">
            Avg Score
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
        <div className="flex-1">
          {course.assignments_count && course.assignments_count > 0 ? (
            <div className="text-xs text-gray-500">
              {progress}% complete
            </div>
          ) : (
            <div className="text-xs text-gray-400">
              No assignments
            </div>
          )}
        </div>
        <Button
          size="sm"
          className="gap-1 bg-[#6B0000] text-white hover:bg-[#8B1A1A]"
          onClick={() => onClick()}
          aria-label={`Open ${course.name}`}
        >
          Open Course
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

interface AssignmentResult {
  assignment_id: number;
  assignment_title: string;
  course_id: number;
  course_name: string | null;
  due_date: string | null;
  status: string;
  submission_id: number | null;
  score: number | null;
  max_score: number | null;
  graded_at?: string | null;
}

interface DashboardResultsResponse {
  results: AssignmentResult[];
}

function parseSafeDate(dateValue: string | null | undefined) {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data: stats, isLoading } = useStudentDashboardStats();
  const { data: resultsData, isLoading: isLoadingResults } = useQuery({
    queryKey: ['student-dashboard-results', user?.id ?? 'anonymous'],
    queryFn: async () => {
      const { data } = await api.get<DashboardResultsResponse>('/student-dashboard/results');
      return data;
    },
    enabled: !!user,
    refetchOnMount: 'always',
    staleTime: 60 * 1000,
  });

  const results = resultsData?.results || [];

  const { overdue, dueSoon, waitingForGrade } = useMemo(() => {
    const now = new Date();
    
    const overdueItems = results
      .filter((r) => r.status === 'not_submitted')
      .filter((r) => {
        const due = parseSafeDate(r.due_date);
        return !!due && due < now;
      })
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());

    const dueSoonItems = results
      .filter((r) => r.status !== 'graded')
      .filter((r) => {
        const due = parseSafeDate(r.due_date);
        if (!due || due <= now) return false;
        const diff = due.getTime() - now.getTime();
        return diff <= 1000 * 60 * 60 * 48;
      })
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());

    const waitingItems = results.filter((r) => r.status === 'pending' || r.status === 'grading');

    return {
      overdue: overdueItems,
      dueSoon: dueSoonItems,
      waitingForGrade: waitingItems,
    };
  }, [results]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const firstName = (user as any)?.firstName ?? user?.email?.split("@")[0] ?? "Student";

  const [refreshInvitations, setRefreshInvitations] = useState(0);

  // Get TA courses for the Teaching Assistant section
  const { data: taCourses = [], isLoading: isLoadingTACourses } = useTACourses();

  return (
    <PageLayout>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-2 text-gray-500">
              Manage your courses and track your progress
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-3xl font-bold text-[#6B0000]">
              {stats?.courses?.length ?? 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Enrolled Courses</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-3xl font-bold text-blue-600">
              {stats?.total_assignments ?? 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Assignments</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-3xl font-bold text-orange-600">
              {overdue.length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Overdue</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-3xl font-bold text-green-600">
              {stats?.completed_assignments ?? 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Completed</p>
          </div>
        </div>

        {/* TA Invitations Section */}
        <div className="mb-8">
          <TAInvitations 
            key={refreshInvitations}
            onAccepted={() => {
              // Trigger refresh of invitations
=======
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
>>>>>>> origin/ree_update
              setRefreshInvitations(prev => prev + 1);
            }}
          />
        </div>

<<<<<<< HEAD
        {/* Teaching Assistant Section - Show only if user is a TA */}
        {taCourses.length > 0 && (
          <div className="mb-12">
            <TeachingAssistantSection
              courses={taCourses}
              isLoading={isLoadingTACourses}
              onSelectCourse={(courseId) => router.push(`/student/teaching-assistant/${courseId}/grading`)}
            />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Courses</h2>

            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin h-8 w-8 border-4 border-[#6B0000] border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading courses...</p>
              </div>
            ) : !stats?.courses || stats.courses.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl font-semibold text-gray-900">No Courses Yet</p>
                <p className="text-gray-500 mt-2">You haven't been enrolled in any courses yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.courses.map((course: StudentCourse) => (
                  <StudentCourseCard
                    key={course.id}
                    course={course}
                    onClick={() => router.push(`/student/courses/${course.id}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Action Items */}
          <div className="lg:col-span-1 space-y-6">
            {/* Overdue Assignments */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Overdue ({overdue.length})
                </h3>
              </div>

              {isLoadingResults ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : overdue.length === 0 ? (
                <p className="text-sm text-gray-500">No overdue assignments</p>
              ) : (
                <div className="space-y-2">
                  {overdue.slice(0, 3).map((item) => (
                    <button
                      key={item.assignment_id}
                      onClick={() => router.push(`/student/courses/${item.course_id}/assignments/${item.assignment_id}`)}
                      className="w-full text-left p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                    >
                      <p className="text-sm font-medium text-red-900 truncate">
                        {item.assignment_title}
                      </p>
                      <p className="text-xs text-red-700">
                        {item.course_name}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Due Soon Assignments */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Due Soon ({dueSoon.length})
                </h3>
              </div>

              {isLoadingResults ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : dueSoon.length === 0 ? (
                <p className="text-sm text-gray-500">No assignments due soon</p>
              ) : (
                <div className="space-y-2">
                  {dueSoon.slice(0, 3).map((item) => (
                    <button
                      key={item.assignment_id}
                      onClick={() => router.push(`/student/courses/${item.course_id}/assignments/${item.assignment_id}`)}
                      className="w-full text-left p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200"
                    >
                      <p className="text-sm font-medium text-orange-900 truncate">
                        {item.assignment_title}
                      </p>
                      <p className="text-xs text-orange-700">
                        {item.course_name}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Awaiting Grade */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Awaiting Grade ({waitingForGrade.length})
                </h3>
              </div>

              {isLoadingResults ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : waitingForGrade.length === 0 ? (
                <p className="text-sm text-gray-500">No assignments pending</p>
              ) : (
                <div className="space-y-2">
                  {waitingForGrade.slice(0, 3).map((item) => (
                    <button
                      key={item.assignment_id}
                      onClick={() => router.push(`/student/courses/${item.course_id}/assignments/${item.assignment_id}`)}
                      className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      <p className="text-sm font-medium text-blue-900 truncate">
                        {item.assignment_title}
                      </p>
                      <p className="text-xs text-blue-700">
                        {item.course_name}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
=======
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
>>>>>>> origin/ree_update
    </PageLayout>
  );
}

export default StudentDashboard;
