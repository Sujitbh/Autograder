'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from './PageLayout';
import { Button } from './ui/button';
import { useAssignments } from '@/hooks/queries/useAssignments';
import { useCourses } from '@/hooks/queries/useCourses';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  ChevronRight 
} from 'lucide-react';

interface StudentCourseInteriorProps {
  courseId: string;
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'published':
      return { label: 'Active', color: '#16A34A', icon: CheckCircle2 };
    case 'draft':
      return { label: 'Draft', color: '#D97706', icon: Clock };
    default:
      return { label: status, color: '#6B7280', icon: FileText };
  }
};

export function StudentCourseInterior({ courseId }: StudentCourseInteriorProps) {
  const router = useRouter();
  const { data: courses } = useCourses();
  const { data: assignments, isLoading } = useAssignments(courseId);

  const course = courses?.find((c) => c.id === courseId);
  const now = new Date();

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

    return {
      total: all.length,
      published,
      dueSoon,
    };
  }, [assignments, now]);

  return (
    <PageLayout>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/student')}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-dark)' }}>
              {course?.name ?? 'Course'}
            </h1>
            {course?.code && (
              <p className="text-lg mt-1" style={{ color: 'var(--color-text-mid)' }}>
                {course.code}
              </p>
            )}
            {course?.description && (
              <p className="mt-3 text-sm max-w-3xl" style={{ color: 'var(--color-text-mid)' }}>
                {course.description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              <div className="rounded-xl border border-[var(--color-border)] px-4 py-3">
                <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>Total Assignments</p>
                <p className="text-xl font-semibold" style={{ color: 'var(--color-text-dark)' }}>{courseStats.total}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] px-4 py-3">
                <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>Active</p>
                <p className="text-xl font-semibold" style={{ color: 'var(--color-text-dark)' }}>{courseStats.published}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] px-4 py-3">
                <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>Due in 48h</p>
                <p className="text-xl font-semibold" style={{ color: 'var(--color-text-dark)' }}>{courseStats.dueSoon}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text-dark)' }}>
            Assignments
          </h2>

          {isLoading ? (
            <div className="text-center py-16 text-sm" style={{ color: 'var(--color-text-mid)' }}>
              Loading assignments…
            </div>
          ) : !assignments || assignments.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-white" style={{ borderColor: 'var(--color-border)' }}>
              <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-light)' }} />
              <p className="font-medium" style={{ color: 'var(--color-text-dark)' }}>
                No assignments yet
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)' }}>
                Your instructor hasn't posted any assignments for this course.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => {
                const statusInfo = getStatusInfo(assignment.status);
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
                    onClick={() => router.push(`/student/courses/${courseId}/assignments/${assignment.id}`)}
                    className="w-full text-left bg-white rounded-2xl border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)] hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text-dark)' }}>
                            {assignment.name}
                          </h3>
                          <div 
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${statusInfo.color}20`,
                              color: statusInfo.color 
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
                          <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-text-mid)' }}>
                            {assignment.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          {dueDate && (
                            <div className="flex items-center gap-1.5" style={{ color: isOverdue ? '#DC2626' : 'var(--color-text-mid)' }}>
                              <Calendar className="w-4 h-4" />
                              <span>
                                Due: {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          )}
                          {assignment.maxPoints && (
                            <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-mid)' }}>
                              <FileText className="w-4 h-4" />
                              <span>{assignment.maxPoints} points</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between h-full min-h-[90px]">
                        <ChevronRight 
                          className="w-5 h-5 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" 
                          style={{ color: 'var(--color-primary)' }} 
                        />
                        <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                          Open assignment
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
