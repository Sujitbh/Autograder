'use client';

import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, CheckCircle2, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import api from '@/services/api/client';
import { submissionService } from '@/services/api/submissionService';

interface ClassPerformancePageProps {
  courseId: string;
  assignmentId: string;
}

interface StudentPerf {
  student_id: number;
  name: string;
  email: string;
  submission_status: 'graded' | 'pending' | 'grading' | 'missing' | 'error';
  score: number | null;
  max_score: number | null;
  percentage: number | null;
  submission_id: number | null;
  submitted_at: string | null;
  graded_at: string | null;
}

interface TestcasePerf {
  testcase_id: number;
  name: string;
  is_public: boolean;
  points: number;
  passes: number;
  total_runs: number;
  pass_rate: number;
}

interface ClassPerformanceResponse {
  assignment_id: number;
  assignment_title: string;
  course_id: number;
  summary: {
    total_students: number;
    graded: number;
    pending: number;
    missing: number;
    average_percentage: number | null;
  };
  students: StudentPerf[];
  testcases: TestcasePerf[];
}

function statusBadge(status: StudentPerf['submission_status']) {
  if (status === 'graded') {
    return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Graded</span>;
  }
  if (status === 'pending' || status === 'grading') {
    return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Pending</span>;
  }
  if (status === 'error') {
    return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Error</span>;
  }
  return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Missing</span>;
}

export function ClassPerformancePage({ courseId, assignmentId }: ClassPerformancePageProps) {
  const router = useRouter();

  const { data, isLoading, error, refetch, isFetching } = useQuery<ClassPerformanceResponse>({
    queryKey: ['class-performance', assignmentId],
    queryFn: async () => {
      const { data } = await api.get(`/grading/assignments/${assignmentId}/class-performance`);
      return data;
    },
  });

  const bulkExecutionMutation = useMutation({
    mutationFn: () => submissionService.gradeAllSubmissions(assignmentId),
    onSuccess: async (result) => {
      await refetch();
      window.alert(`Executed grading for ${result.total_considered ?? result.total_graded} latest submission(s). Graded: ${result.total_graded}. Errors: ${result.total_errors}.`);
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to run bulk execution';
      window.alert(message);
    },
  });

  const gradedStudents = useMemo(() => {
    return (data?.students ?? []).filter((s) => s.submission_status === 'graded');
  }, [data]);

  const highest = useMemo(() => {
    if (!gradedStudents.length) return null;
    return Math.max(...gradedStudents.map((s) => s.percentage ?? 0));
  }, [gradedStudents]);

  const lowest = useMemo(() => {
    if (!gradedStudents.length) return null;
    return Math.min(...gradedStudents.map((s) => s.percentage ?? 0));
  }, [gradedStudents]);

  return (
    <PageLayout>
      <TopNav
        breadcrumbs={[
          { label: 'Courses', href: '/courses' },
          { label: `Course ${courseId}`, href: `/courses/${courseId}` },
          { label: 'Class Performance' },
        ]}
      />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar activeItem="assignments" />

        <main className="flex-1 overflow-auto p-8">
          <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.push(`/courses/${courseId}/grading`)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Grading
            </Button>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-dark)' }}>
              {data?.assignment_title ?? `Assignment ${assignmentId}`}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => bulkExecutionMutation.mutate()}
              disabled={bulkExecutionMutation.isPending}
            >
              {bulkExecutionMutation.isPending ? 'Running Bulk Execution...' : 'Run Bulk Execution'}
            </Button>
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full mx-auto" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
            <p className="mt-3" style={{ color: 'var(--color-text-mid)' }}>Loading class performance...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border p-6" style={{ borderColor: 'var(--color-error)', backgroundColor: 'var(--color-error-bg)' }}>
            <p className="font-semibold" style={{ color: 'var(--color-error)' }}>Unable to load class performance data.</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)' }}>
              Ensure you are enrolled as instructor/TA for this course.
            </p>
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-mid)' }}>
                  <Users className="w-4 h-4" />
                  Students
                </div>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-text-dark)' }}>
                  {data.summary.total_students}
                </p>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: '#ECFDF3' }}>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  Graded
                </div>
                <p className="text-2xl font-bold mt-1 text-green-700">{data.summary.graded}</p>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: '#FFF7ED' }}>
                <div className="flex items-center gap-2 text-sm text-amber-700">
                  <Clock className="w-4 h-4" />
                  Pending
                </div>
                <p className="text-2xl font-bold mt-1 text-amber-700">{data.summary.pending}</p>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: '#FEF2F2' }}>
                <div className="flex items-center gap-2 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  Missing
                </div>
                <p className="text-2xl font-bold mt-1 text-red-700">{data.summary.missing}</p>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: '#EEF2FF' }}>
                <div className="flex items-center gap-2 text-sm text-indigo-700">
                  <BarChart3 className="w-4 h-4" />
                  Average
                </div>
                <p className="text-2xl font-bold mt-1 text-indigo-700">
                  {data.summary.average_percentage !== null ? `${data.summary.average_percentage}%` : '--'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-dark)' }}>Test Dataset Performance</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>
                    Class-wide pass rates from latest submissions
                  </p>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {data.testcases.length === 0 ? (
                    <div className="p-4 text-sm" style={{ color: 'var(--color-text-mid)' }}>
                      No test cases defined for this assignment.
                    </div>
                  ) : data.testcases.map((tc) => (
                    <div key={tc.testcase_id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium" style={{ color: 'var(--color-text-dark)' }}>{tc.name}</p>
                          <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>
                            {tc.is_public ? 'Public' : 'Private'} • {tc.points} pts • {tc.passes}/{tc.total_runs} passed
                          </p>
                        </div>
                        <span className="font-semibold" style={{ color: tc.pass_rate >= 70 ? 'var(--color-success)' : tc.pass_rate >= 40 ? 'var(--color-warning)' : 'var(--color-error)' }}>
                          {tc.pass_rate}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--color-muted)' }}>
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.max(0, Math.min(100, tc.pass_rate))}%`,
                            backgroundColor: tc.pass_rate >= 70 ? 'var(--color-success)' : tc.pass_rate >= 40 ? 'var(--color-warning)' : 'var(--color-error)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-dark)' }}>Score Distribution</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>
                    Highest: {highest !== null ? `${highest}%` : '--'} • Lowest: {lowest !== null ? `${lowest}%` : '--'}
                  </p>
                </div>
                <div className="p-4 overflow-auto max-h-[420px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                        <th className="text-left py-2" style={{ color: 'var(--color-text-mid)' }}>Student</th>
                        <th className="text-left py-2" style={{ color: 'var(--color-text-mid)' }}>Status</th>
                        <th className="text-right py-2" style={{ color: 'var(--color-text-mid)' }}>Score</th>
                        <th className="text-right py-2" style={{ color: 'var(--color-text-mid)' }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.students.map((s) => (
                        <tr key={s.student_id} className="border-b last:border-none" style={{ borderColor: 'var(--color-border)' }}>
                          <td className="py-3">
                            <p className="font-medium" style={{ color: 'var(--color-text-dark)' }}>{s.name}</p>
                            <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>{s.email}</p>
                          </td>
                          <td className="py-3">{statusBadge(s.submission_status)}</td>
                          <td className="py-3 text-right" style={{ color: 'var(--color-text-dark)' }}>
                            {s.score !== null ? `${s.score}/${s.max_score ?? '--'}` : '--'}
                          </td>
                          <td className="py-3 text-right font-semibold" style={{ color: s.percentage !== null ? (s.percentage >= 70 ? 'var(--color-success)' : s.percentage >= 50 ? 'var(--color-warning)' : 'var(--color-error)') : 'var(--color-text-mid)' }}>
                            {s.percentage !== null ? `${s.percentage}%` : '--'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : null}
          </div>
        </main>
      </div>
    </PageLayout>
  );
}
