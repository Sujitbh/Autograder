'use client';

import { useState, useMemo } from 'react';
import { Shield, AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import type { Course } from '@/types';

interface Submission {
  id: number;
  assignment_id: number;
  assignment_name: string;
  student_id: number;
  student_name: string;
  student_email: string;
  status: 'submitted' | 'grading' | 'graded';
  score?: number | null;
  max_score?: number | null;
  created_at: string;
}

interface TADashboardOverviewProps {
  courses: Course[];
  submissions: Submission[];
  isLoadingCourses?: boolean;
  isLoadingSubmissions?: boolean;
  onSelectCourse?: (courseId: string) => void;
}

export function TADashboardOverview({
  courses,
  submissions,
  isLoadingCourses = false,
  isLoadingSubmissions = false,
  onSelectCourse,
}: TADashboardOverviewProps) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(
    courses.length > 0 ? courses[0].id : null
  );

  const courseById = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.id, c])),
    [courses]
  );

  const stats = useMemo(() => {
    const pending = submissions.filter((s) => s.status === 'submitted').length;
    const inProgress = submissions.filter((s) => s.status === 'grading').length;
    const completed = submissions.filter((s) => s.status === 'graded').length;

    return { pending, inProgress, completed, total: submissions.length };
  }, [submissions]);

  if (isLoadingCourses) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading TA dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6" style={{ color: '#1967d2' }} />
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text-dark)' }}
          >
            Teaching Assistant Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-mid)' }} className="text-sm">
            {courses.length} course{courses.length !== 1 ? 's' : ''} • {stats.total} submission
            {stats.total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={AlertCircle} label="Pending" value={stats.pending} color="#EA4335" />
        <StatCard icon={Clock} label="In Progress" value={stats.inProgress} color="#FBBC04" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} color="#34A853" />
        <StatCard
          label="Total"
          value={stats.total}
          color="#1967d2"
        />
      </div>

      {/* Course Selector */}
      {courses.length > 0 && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-dark)' }}
          >
            Filter by Course
          </label>
          <select
            value={selectedCourse || ''}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              onSelectCourse?.(e.target.value);
            }}
            className="w-full p-2 rounded border"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-dark)',
            }}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Course Cards Summary */}
      {courses.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text-dark)' }}>
            Your TA Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => {
              const courseSubmissions = submissions.filter(
                (s) => courseById[s.assignment_id.toString()] // This is a simplification
              );
              const pendingCount = courseSubmissions.filter((s) => s.status === 'submitted').length;

              return (
                <div
                  key={course.id}
                  className="p-4 rounded-lg border transition-all hover:shadow-md"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3
                        className="font-semibold"
                        style={{ color: 'var(--color-text-dark)' }}
                      >
                        {course.code}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: 'var(--color-text-mid)' }}
                      >
                        {course.name}
                      </p>
                    </div>
                    {pendingCount > 0 && (
                      <div
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: '#ffbf46',
                          color: '#6d4c00',
                        }}
                      >
                        {pendingCount} pending
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCourse(course.id);
                      onSelectCourse?.(course.id);
                    }}
                    className="w-full mt-3 py-2 px-3 rounded text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: '#1967d2',
                      color: 'white',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#1557b0';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#1967d2';
                    }}
                  >
                    Grade Submissions
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="text-center py-12 px-4 rounded-lg border border-dashed border-gray-300">
          <Shield className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 mb-2">You're not a TA for any courses yet</p>
          <p className="text-sm text-gray-500">
            Ask an instructor to appoint you as a teaching assistant
          </p>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon?: React.ElementType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: number;
  color?: string;
}

function StatCard({ icon: Icon, label, value, color = '#1967d2' }: StatCardProps) {
  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--color-text-mid)' }}
        >
          {label}
        </p>
        {Icon ? <Icon className="w-5 h-5" style={{ color }} /> : null}
      </div>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
