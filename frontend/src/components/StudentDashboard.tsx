"use client";

import { useMemo } from "react";
import {
  BookOpen,
  ClipboardList,
  Clock,
  CheckCircle2,
  GraduationCap,
  LogOut,
  ChevronRight,
  Calendar,
  AlertCircle,
  TrendingUp,
  FileText,
} from "lucide-react";
import { PageLayout } from "./PageLayout";
import { Button } from "./ui/button";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";
import { useStudentDashboardStats } from "@/hooks/queries/useStudentDashboardStats";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api/client";

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color, color: "white" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: "var(--color-text-dark)" }}>
          {value}
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-mid)" }}>
          {label}
        </p>
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

function UpcomingAssignmentsWidget({
  results,
  isLoading,
}: {
  results: AssignmentResult[];
  isLoading: boolean;
}) {
  const router = useRouter();

  // Filter and sort upcoming assignments
  const upcomingAssignments = results
    ?.filter((a) => {
      const dueDate = parseSafeDate(a.due_date);
      return !!dueDate && dueDate > new Date() && a.status !== 'graded';
    })
    .sort((a, b) => {
      const dateA = new Date(a.due_date!).getTime();
      const dateB = new Date(b.due_date!).getTime();
      return dateA - dateB;
    })
    .slice(0, 5) || [];

  const getTimeUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 7) {
      return { text: `${diffDays} days`, color: 'var(--color-text-mid)', urgent: false };
    } else if (diffDays > 2) {
      return { text: `${diffDays} days`, color: '#D97706', urgent: false };
    } else if (diffDays >= 1) {
      return { text: `${diffDays} day${diffDays > 1 ? 's' : ''}`, color: '#DC2626', urgent: true };
    } else if (diffHours > 0) {
      return { text: `${diffHours} hours`, color: '#DC2626', urgent: true };
    } else {
      return { text: 'Due soon!', color: '#DC2626', urgent: true };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text-dark)" }}>
          Upcoming Assignments
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-mid)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-dark)" }}>
          Upcoming Assignments
        </h2>
        <Calendar className="w-5 h-5" style={{ color: "var(--color-text-mid)" }} />
      </div>

      {upcomingAssignments.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-2" style={{ color: "var(--color-text-light)" }} />
          <p className="text-sm" style={{ color: "var(--color-text-mid)" }}>
            No upcoming assignments
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingAssignments.map((assignment) => {
            const timeInfo = getTimeUntilDue(assignment.due_date!);
            return (
              <button
                key={assignment.assignment_id}
                onClick={() => router.push(`/student/courses/${assignment.course_id}/assignments/${assignment.assignment_id}`)}
                className="w-full text-left p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-1 truncate" style={{ color: "var(--color-text-dark)" }}>
                      {assignment.assignment_title}
                    </p>
                    <p className="text-xs mb-2" style={{ color: "var(--color-text-mid)" }}>
                      {assignment.course_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" style={{ color: timeInfo.color }} />
                      <span className="text-xs font-medium" style={{ color: timeInfo.color }}>
                        Due in {timeInfo.text}
                      </span>
                      {timeInfo.urgent && (
                        <AlertCircle className="w-3 h-3" style={{ color: '#DC2626' }} />
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-primary)" }} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ActionCenterWidget({
  results,
  isLoading,
  onOpenAssignment,
  onViewResults,
}: {
  results: AssignmentResult[];
  isLoading: boolean;
  onOpenAssignment: (assignment: AssignmentResult) => void;
  onViewResults: () => void;
}) {
  const now = new Date();

  const { overdue, dueSoon, waitingForGrade, focusAssignment } = useMemo(() => {
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
    const focus = overdueItems[0] || dueSoonItems[0] || null;

    return {
      overdue: overdueItems,
      dueSoon: dueSoonItems,
      waitingForGrade: waitingItems,
      focusAssignment: focus,
    };
  }, [results]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>
          Action Center
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>Loading priorities…</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-dark)' }}>
        Action Center
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg border border-[var(--color-border)] p-3">
          <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>Overdue</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{overdue.length}</p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] p-3">
          <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>Due ≤ 48h</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{dueSoon.length}</p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] p-3">
          <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>Awaiting Grade</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{waitingForGrade.length}</p>
        </div>
      </div>

      {focusAssignment ? (
        <div className="rounded-lg border border-[var(--color-border)] p-4 mb-4">
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-mid)' }}>Recommended next action</p>
          <p className="font-semibold" style={{ color: 'var(--color-text-dark)' }}>{focusAssignment.assignment_title}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>{focusAssignment.course_name}</p>
          <div className="mt-3">
            <Button size="sm" className="w-full" onClick={() => onOpenAssignment(focusAssignment)}>
              Open Assignment
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--color-border)] p-4 mb-4 text-sm" style={{ color: 'var(--color-text-mid)' }}>
          You’re all caught up.
        </div>
      )}

      <Button variant="outline" className="w-full" onClick={onViewResults}>
        View Full Results
      </Button>
    </div>
  );
}

function RecentGradesWidget({
  results,
  isLoading,
  onViewAll,
}: {
  results: AssignmentResult[];
  isLoading: boolean;
  onViewAll: () => void;
}) {
  const recentGraded = useMemo(() => {
    return results
      .filter((r) => r.status === 'graded' && r.score !== null && r.max_score !== null)
      .sort((a, b) => {
        const dateA = parseSafeDate(a.graded_at) ?? parseSafeDate(a.due_date) ?? new Date(0);
        const dateB = parseSafeDate(b.graded_at) ?? parseSafeDate(b.due_date) ?? new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 4);
  }, [results]);

  return (
    <div className="mt-6 bg-white rounded-xl border border-[var(--color-border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-dark)' }}>
          Recent Grades
        </h3>
        <Button variant="ghost" size="sm" onClick={onViewAll}>View all</Button>
      </div>

      {isLoading ? (
        <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>Loading grades…</p>
      ) : recentGraded.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>No graded assignments yet.</p>
      ) : (
        <div className="space-y-3">
          {recentGraded.map((item) => {
            const pct = item.max_score && item.max_score > 0
              ? Math.round((item.score! / item.max_score) * 100)
              : 0;
            return (
              <div key={item.assignment_id} className="rounded-lg border border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <p className="font-medium truncate" style={{ color: 'var(--color-text-dark)' }}>{item.assignment_title}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>{item.course_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-dark)' }}>
                    {item.score}/{item.max_score}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface CourseWithProgress {
  id: number;
  name: string;
  code: string;
  description?: string;
  assignments_count?: number;
  completed_count?: number;
  average_score?: number;
}

function CourseCardWithProgress({ course, onClick }: { course: CourseWithProgress; onClick: () => void }) {
  const progress = course.assignments_count && course.assignments_count > 0
    ? Math.round((course.completed_count || 0) / course.assignments_count * 100)
    : 0;

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)] transition-colors group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate" style={{ color: "var(--color-text-dark)" }}>
            {course.name}
          </p>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-mid)" }}>
            {course.code}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-primary)" }} />
      </div>

      {/* Progress Bar */}
      {course.assignments_count && course.assignments_count > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: "var(--color-text-mid)" }}>
              {course.completed_count || 0} / {course.assignments_count} completed
            </span>
            <span className="font-medium" style={{ color: "var(--color-text-dark)" }}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: progress === 100 ? '#16A34A' : progress > 50 ? '#2563EB' : '#D97706'
              }}
            />
          </div>
          {course.average_score !== undefined && course.average_score !== null && (
            <div className="flex items-center gap-1 pt-1">
              <TrendingUp className="w-3 h-3" style={{ color: "var(--color-text-mid)" }} />
              <span className="text-xs" style={{ color: "var(--color-text-mid)" }}>
                Average: {Math.round(course.average_score)}%
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs" style={{ color: "var(--color-text-light)" }}>
          No assignments yet
        </p>
      )}
    </button>
  );
}

function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data: stats, isLoading } = useStudentDashboardStats();
  const { data: resultsData, isLoading: isLoadingResults } = useQuery({
    queryKey: ['student-dashboard-results'],
    queryFn: async () => {
      const { data } = await api.get<DashboardResultsResponse>('/student-dashboard/results');
      return data;
    },
    staleTime: 60 * 1000,
  });

  const results = resultsData?.results || [];

  const { averageScore, atRiskCount } = useMemo(() => {
    const graded = results.filter((r) => r.status === 'graded' && r.score !== null && r.max_score && r.max_score > 0);
    const totalPct = graded.reduce((sum, row) => sum + ((row.score! / row.max_score!) * 100), 0);
    const avg = graded.length > 0 ? Math.round(totalPct / graded.length) : null;

    const now = new Date();
    const atRisk = results.filter((r) => {
      if (r.status === 'graded') return false;
      const due = parseSafeDate(r.due_date);
      if (!due) return false;
      if (due < now) return true;
      const diff = due.getTime() - now.getTime();
      return diff <= 1000 * 60 * 60 * 48;
    }).length;

    return {
      averageScore: avg,
      atRiskCount: atRisk,
    };
  }, [results]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const firstName = (user as any)?.firstName ?? user?.email?.split("@")[0] ?? "Student";

  return (
    <PageLayout>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-dark)" }}>
              Welcome back, {firstName}!
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-mid)" }}>
              Here's an overview of your courses and assignments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push('/student/results')} className="gap-2">
              <FileText className="w-4 h-4" />
              View Results
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatCard icon={<BookOpen className="w-6 h-6" />} label="Enrolled Courses" value={stats?.courses?.length ?? 0} color="#6B0000" />
          <StatCard icon={<ClipboardList className="w-6 h-6" />} label="Total Assignments" value={stats?.total_assignments ?? 0} color="#2563EB" />
          <StatCard icon={<Clock className="w-6 h-6" />} label="Pending" value={stats?.pending_assignments ?? 0} color="#D97706" />
          <StatCard icon={<CheckCircle2 className="w-6 h-6" />} label="Completed" value={stats?.completed_assignments ?? 0} color="#16A34A" />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Average Score" value={averageScore !== null ? `${averageScore}%` : '—'} color="#2563EB" />
          <StatCard icon={<AlertCircle className="w-6 h-6" />} label="At Risk" value={atRiskCount} color="#8B0000" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Courses */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text-dark)" }}>
              Your Courses
            </h2>
            {isLoading ? (
              <div className="text-center py-16 text-sm" style={{ color: "var(--color-text-mid)" }}>
                Loading courses…
              </div>
            ) : stats?.courses?.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-white" style={{ borderColor: "var(--color-border)" }}>
                <GraduationCap className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--color-text-light)" }} />
                <p className="font-medium" style={{ color: "var(--color-text-dark)" }}>
                  No courses yet
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-mid)" }}>
                  You haven't been enrolled in any courses.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats && Array.isArray(stats.courses)
                  ? stats.courses.map((course: any) => (
                      <CourseCardWithProgress
                        key={course.id}
                        course={course}
                        onClick={() => router.push(`/student/courses/${course.id}`)}
                      />
                    ))
                  : null}
              </div>
            )}

            <RecentGradesWidget
              results={results}
              isLoading={isLoadingResults}
              onViewAll={() => router.push('/student/results')}
            />
          </div>

          {/* Sidebar - Action Center + Upcoming */}
          <div className="lg:col-span-1">
            <ActionCenterWidget
              results={results}
              isLoading={isLoadingResults}
              onOpenAssignment={(assignment) => router.push(`/student/courses/${assignment.course_id}/assignments/${assignment.assignment_id}`)}
              onViewResults={() => router.push('/student/results')}
            />
            <div className="mt-6">
              <UpcomingAssignmentsWidget results={results} isLoading={isLoadingResults} />
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

export default StudentDashboard;
