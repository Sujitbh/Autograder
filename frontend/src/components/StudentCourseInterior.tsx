'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueries } from '@tanstack/react-query';
import { useAssignments } from '@/hooks/queries/useAssignments';
import { useCourses } from '@/hooks/queries/useCourses';
import { submissionService } from '@/services/api';
import { StudentLayout } from './StudentLayout';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Upload,
} from 'lucide-react';

interface StudentCourseInteriorProps {
  courseId: string;
}

/** Determine the student-facing status badge for an assignment */
function getStudentStatus(submissionStatus: string | null, score: number | null, maxScore: number | null) {
  if (!submissionStatus) {
    return { label: 'Not Submitted', cssColor: 'var(--color-text-mid)', icon: Upload };
  }
  if (submissionStatus === 'graded' && score != null) {
    return { label: `Graded — ${score}/${maxScore ?? '?'}`, cssColor: 'var(--color-success)', icon: CheckCircle2 };
  }
  if (submissionStatus === 'grading') {
    return { label: 'Grading...', cssColor: 'var(--color-warning)', icon: Clock };
  }
  // pending or any other status = submitted but not yet graded
  return { label: 'Submitted', cssColor: 'var(--color-info, #2563eb)', icon: CheckCircle2 };
}

export function StudentCourseInterior({ courseId }: StudentCourseInteriorProps) {
  const router = useRouter();
  const { data: courses } = useCourses();
  const { data: assignments, isLoading } = useAssignments(courseId);

  const course = courses?.find((c) => c.id === courseId);
  const now = new Date();

  // Fetch submissions for each assignment to determine status
  const submissionQueries = useQueries({
    queries: (assignments ?? []).map((a) => ({
      queryKey: ['submissions', a.id],
      queryFn: () => submissionService.getSubmissions(a.id),
      enabled: !!a.id,
    })),
  });

  // Build a map: assignmentId → latest submission
  const submissionMap = useMemo(() => {
    const map: Record<string, { status: string; score: number | null; maxScore: number | null }> = {};
    (assignments ?? []).forEach((a, idx) => {
      const q = submissionQueries[idx];
      if (q?.data && q.data.length > 0) {
        const latest = q.data[0]; // most recent
        map[a.id] = {
          status: latest.status,
          score: latest.grade?.totalScore ?? null,
          maxScore: latest.grade?.maxScore ?? null,
        };
      }
    });
    return map;
  }, [assignments, submissionQueries]);

  const courseStats = useMemo(() => {
    const all = assignments ?? [];
    const published = all.filter((a) => a.status === 'published').length;
    const dueSoon = all.filter((a) => {
      if (!a.dueDate) return false;
      const due = new Date(a.dueDate);
      if (Number.isNaN(due.getTime())) return false;
      if (due < now) return false;
      const diff = due.getTime() - now.getTime();
      return diff <= 1000 * 60 * 60 * 48;
    }).length;
    const submitted = all.filter((a) => submissionMap[a.id] != null).length;
    const graded = all.filter((a) => submissionMap[a.id]?.status === 'graded').length;

    return { total: all.length, published, dueSoon, submitted, graded };
  }, [assignments, now, submissionMap]);

  return (
    <StudentLayout
      activeItem="assignments"
      courseId={courseId}
      breadcrumbs={[{ label: course?.name ?? 'Course' }]}
    >
      <div className="max-w-5xl">
        {/* Header Section with Gradient */}
        <div className="mb-8">
          <div className="relative rounded-3xl p-8 text-white shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">{course?.name ?? 'Course'}</h1>
              {course?.code && <p className="text-xl opacity-90 mb-4">{course.code}</p>}
              {course?.description && (
                <p className="text-sm opacity-80 max-w-3xl leading-relaxed">{course.description}</p>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <p className="text-xs opacity-80 mb-1">Total</p>
                  <p className="text-3xl font-bold">{courseStats.total}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <p className="text-xs opacity-80 mb-1">Active</p>
                  <p className="text-3xl font-bold">{courseStats.published}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <p className="text-xs opacity-80 mb-1">Submitted</p>
                  <p className="text-3xl font-bold">{courseStats.submitted}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <p className="text-xs opacity-80 mb-1">Graded</p>
                  <p className="text-3xl font-bold">{courseStats.graded}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-dark)' }}>Assignments</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)' }}>
              {assignments?.length ?? 0} assignment{assignments?.length !== 1 ? 's' : ''} in this course
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-sm" style={{ color: 'var(--color-text-mid)' }}>Loading assignments...</div>
          ) : !assignments || assignments.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
              <div className="rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <FileText className="w-8 h-8" style={{ color: 'var(--color-text-light)' }} />
              </div>
              <p className="font-semibold text-lg" style={{ color: 'var(--color-text-dark)' }}>No assignments yet</p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-mid)' }}>
                Your instructor hasn&apos;t posted any assignments for this course.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => {
                const sub = submissionMap[assignment.id];
                const statusInfo = getStudentStatus(sub?.status ?? null, sub?.score ?? null, sub?.maxScore ?? null);
                const StatusIcon = statusInfo.icon;
                const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
                const isOverdue = dueDate && dueDate < now;

                const dueLabel = (() => {
                  if (!dueDate || Number.isNaN(dueDate.getTime())) {
                    return { label: 'No due date', tone: 'neutral' as const, icon: Calendar };
                  }
                  if (isOverdue) {
                    return { label: 'Overdue', tone: 'danger' as const, icon: AlertCircle };
                  }
                  const diff = dueDate.getTime() - now.getTime();
                  if (diff <= 1000 * 60 * 60 * 24) {
                    return { label: 'Due today', tone: 'warning' as const, icon: Clock };
                  }
                  if (diff <= 1000 * 60 * 60 * 48) {
                    return { label: 'Due in 48h', tone: 'warning' as const, icon: Clock };
                  }
                  return { label: 'Upcoming', tone: 'neutral' as const, icon: Calendar };
                })();
                const DueIcon = dueLabel.icon;

                return (
                  <button
                    key={assignment.id}
                    onClick={() =>
                      router.push(`/student/courses/${courseId}/assignments/${assignment.id}`)
                    }
                    className="w-full text-left rounded-xl border p-5 hover:shadow-md hover:scale-[1.01] transition-all duration-200 group"
                    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-3">
                          <h3 className="font-bold text-lg" style={{ color: 'var(--color-text-dark)' }}>{assignment.name}</h3>
                          <div
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: statusInfo.cssColor === 'var(--color-success)' ? 'var(--color-success-bg)' : statusInfo.cssColor === 'var(--color-warning)' ? 'var(--color-warning-bg)' : 'var(--color-surface-elevated)',
                              color: statusInfo.cssColor,
                            }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </div>
                          <div
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor:
                                dueLabel.tone === 'danger'
                                  ? 'var(--color-error-bg)'
                                  : dueLabel.tone === 'warning'
                                    ? 'var(--color-warning-bg)'
                                    : 'var(--color-surface-elevated)',
                              color:
                                dueLabel.tone === 'danger'
                                  ? 'var(--color-error)'
                                  : dueLabel.tone === 'warning'
                                    ? 'var(--color-warning)'
                                    : 'var(--color-text-mid)',
                            }}
                          >
                            <DueIcon className="w-3 h-3" />
                            {dueLabel.label}
                          </div>
                        </div>

                        {assignment.description && (
                          <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: 'var(--color-text-mid)' }}>
                            {assignment.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          {dueDate && (
                            <div
                              className="flex items-center gap-2 px-3 py-2 rounded-lg"
                              style={{ backgroundColor: 'var(--color-surface-elevated)', color: isOverdue ? 'var(--color-error)' : 'var(--color-text-dark)' }}
                            >
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">
                                {dueDate.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}{' '}
                                at{' '}
                                {dueDate.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          )}
                          {assignment.maxPoints && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-dark)' }}>
                              <FileText className="w-4 h-4" />
                              <span className="font-medium">{assignment.maxPoints} points</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center min-h-[60px] gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>View</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
