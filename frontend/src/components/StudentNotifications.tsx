'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from './PageLayout';
import { Bell, Clock, AlertCircle, CheckCircle2, FileText, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import api from '@/services/api/client';

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

interface Notification {
  id: string;
  type: 'grade_posted' | 'due_soon' | 'overdue' | 'submitted';
  title: string;
  description: string;
  timestamp: Date;
  courseId: number;
  assignmentId: number;
}

function parseSafeDate(dateValue: string | null | undefined) {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function StudentNotifications() {
  const router = useRouter();

  const { data: resultsData, isLoading } = useQuery({
    queryKey: ['student-dashboard-results'],
    queryFn: async () => {
      const { data } = await api.get<{ results: AssignmentResult[] }>('/student-dashboard/results');
      return data;
    },
    staleTime: 60 * 1000,
  });

  const notifications = useMemo<Notification[]>(() => {
    const results = resultsData?.results || [];
    const now = new Date();
    const items: Notification[] = [];

    for (const r of results) {
      if (r.status === 'graded' && r.score !== null && r.graded_at) {
        items.push({
          id: `grade-${r.assignment_id}`,
          type: 'grade_posted',
          title: `Grade Posted: ${r.assignment_title}`,
          description: `You received ${r.score}/${r.max_score} in ${r.course_name ?? 'a course'}`,
          timestamp: new Date(r.graded_at),
          courseId: r.course_id,
          assignmentId: r.assignment_id,
        });
      }

      if (r.status === 'not_submitted') {
        const due = parseSafeDate(r.due_date);
        if (due && due < now) {
          items.push({
            id: `overdue-${r.assignment_id}`,
            type: 'overdue',
            title: `Overdue: ${r.assignment_title}`,
            description: `This assignment was due ${due.toLocaleDateString()} in ${r.course_name ?? 'a course'}`,
            timestamp: due,
            courseId: r.course_id,
            assignmentId: r.assignment_id,
          });
        }
      }

      const due = parseSafeDate(r.due_date);
      if (due && r.status !== 'graded') {
        const diff = due.getTime() - now.getTime();
        if (diff > 0 && diff <= 1000 * 60 * 60 * 48) {
          items.push({
            id: `due-soon-${r.assignment_id}`,
            type: 'due_soon',
            title: `Due Soon: ${r.assignment_title}`,
            description: `Due ${due.toLocaleDateString()} at ${due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} in ${r.course_name ?? 'a course'}`,
            timestamp: due,
            courseId: r.course_id,
            assignmentId: r.assignment_id,
          });
        }
      }

      if (r.status === 'pending' || r.status === 'grading') {
        items.push({
          id: `submitted-${r.assignment_id}`,
          type: 'submitted',
          title: `Awaiting Grade: ${r.assignment_title}`,
          description: `Your submission is being graded in ${r.course_name ?? 'a course'}`,
          timestamp: new Date(),
          courseId: r.course_id,
          assignmentId: r.assignment_id,
        });
      }
    }

    return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [resultsData]);

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'grade_posted':
        return { bg: 'var(--color-success-bg)', border: 'var(--color-success)', icon: CheckCircle2, iconColor: 'var(--color-success)' };
      case 'overdue':
        return { bg: 'var(--color-error-bg)', border: 'var(--color-error)', icon: AlertCircle, iconColor: 'var(--color-error)' };
      case 'due_soon':
        return { bg: 'var(--color-warning-bg)', border: 'var(--color-warning)', icon: Clock, iconColor: 'var(--color-warning)' };
      case 'submitted':
        return { bg: 'var(--color-info-bg)', border: 'var(--color-info)', icon: FileText, iconColor: 'var(--color-info)' };
    }
  };

  return (
    <PageLayout>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/student')}
          className="mb-6 gap-2 rounded-lg px-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-light)' }}>
            <Bell className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-dark)' }}>Notifications</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full mx-auto" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
            <p className="mt-4" style={{ color: 'var(--color-text-mid)' }}>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
            <Bell className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
            <p className="font-semibold text-lg" style={{ color: 'var(--color-text-dark)' }}>All caught up!</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-mid)' }}>You have no notifications right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const style = getNotificationStyle(notification.type);
              const Icon = style.icon;

              return (
                <button
                  key={notification.id}
                  onClick={() =>
                    router.push(`/student/courses/${notification.courseId}/assignments/${notification.assignmentId}`)
                  }
                  className="w-full text-left rounded-xl border p-4 hover:shadow-md transition-all"
                  style={{ backgroundColor: style.bg, borderColor: style.border }}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: style.iconColor }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-text-dark)' }}>{notification.title}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-mid)' }}>{notification.description}</p>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: 'var(--color-text-light)' }}>
                      {notification.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </PageLayout>
  );
}
