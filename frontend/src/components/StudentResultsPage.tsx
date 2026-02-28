'use client';

import { useEffect, useState } from 'react';
import { PageLayout } from './PageLayout';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import api from '@/services/api/client';

interface StudentResultItem {
  assignment_id: number;
  assignment_title: string;
  course_id: number;
  course_name: string | null;
  due_date: string | null;
  status: string;
  submission_id: number | null;
  score: number | null;
  max_score: number | null;
  graded_at: string | null;
}

export function StudentResultsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<StudentResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api
      .get<{ results: StudentResultItem[] }>('/student-dashboard/results')
      .then((res) => {
        if (!mounted) return;
        setRows(res.data.results || []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Failed to load results');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageLayout>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-dark)' }}>My Results</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)' }}>
              Assignment status and scores from the backend.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/student')}>Back to Dashboard</Button>
        </div>

        {isLoading ? (
          <div className="p-6 text-sm" style={{ color: 'var(--color-text-mid)' }}>Loading results...</div>
        ) : error ? (
          <div className="p-6 text-sm" style={{ color: 'var(--color-error)' }}>{error}</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm" style={{ color: 'var(--color-text-mid)' }}>No assignments yet.</div>
        ) : (
          <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                <tr>
                  <th className="text-left p-3 text-sm">Course</th>
                  <th className="text-left p-3 text-sm">Assignment</th>
                  <th className="text-left p-3 text-sm">Status</th>
                  <th className="text-left p-3 text-sm">Score</th>
                  <th className="text-left p-3 text-sm">Due</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.assignment_id} className="border-t border-[var(--color-border)]">
                    <td className="p-3 text-sm">{r.course_name ?? `Course ${r.course_id}`}</td>
                    <td className="p-3 text-sm">{r.assignment_title}</td>
                    <td className="p-3 text-sm">{r.status}</td>
                    <td className="p-3 text-sm">
                      {r.score != null ? `${r.score}${r.max_score != null ? ` / ${r.max_score}` : ''}` : '—'}
                    </td>
                    <td className="p-3 text-sm">{r.due_date ? new Date(r.due_date).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </PageLayout>
  );
}
