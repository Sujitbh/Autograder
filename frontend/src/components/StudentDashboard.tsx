"use client";

import {
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
interface StudentCourse {
  id: number | string;
  name: string;
  code: string;
  description?: string;
  assignments_count?: number;
  completed_count?: number;
  average_score?: number | null;
}

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
              setRefreshInvitations(prev => prev + 1);
            }}
          />
        </div>

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
    </PageLayout>
  );
}

export default StudentDashboard;
