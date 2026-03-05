'use client';

import { Shield, Loader2 } from 'lucide-react';
import type { Course } from '@/types';

interface TeachingAssistantSectionProps {
  courses: Course[];
  isLoading: boolean;
  onSelectCourse?: (courseId: string) => void;
}

export function TeachingAssistantSection({
  courses,
  isLoading,
  onSelectCourse,
}: TeachingAssistantSectionProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading TA courses...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8 px-4 rounded-lg border border-dashed border-gray-300">
        <Shield className="w-8 h-8 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-600">You're not a TA for any courses yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2
          className="text-2xl font-bold mb-2 flex items-center gap-2"
          style={{ color: 'var(--color-text-dark)' }}
        >
          <Shield className="w-6 h-6" />
          Teaching Assistant
        </h2>
        <p
          style={{ color: 'var(--color-text-mid)' }}
          className="text-sm"
        >
          Grade assignments for these courses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <TACoursesCard
            key={course.id}
            course={course}
            onSelectCourse={onSelectCourse}
          />
        ))}
      </div>
    </div>
  );
}

interface TACoursesCardProps {
  course: Course;
  onSelectCourse?: (courseId: string) => void;
}

function TACoursesCard({ course, onSelectCourse }: TACoursesCardProps) {
  return (
    <div
      className="p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
      onClick={() => onSelectCourse?.(course.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3
            className="font-semibold text-base mb-1"
            style={{ color: 'var(--color-text-dark)' }}
          >
            {course.name}
          </h3>
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-mid)' }}
          >
            {course.code}
          </p>
        </div>
        <div
          className="px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: '#e8f0fe',
            color: '#1967d2',
          }}
        >
          TA
        </div>
      </div>

      {course.description && (
        <p
          className="text-xs mb-3 line-clamp-2"
          style={{ color: 'var(--color-text-mid)' }}
        >
          {course.description}
        </p>
      )}

      <button
        className="w-full py-2 px-3 rounded text-sm font-medium transition-colors"
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
}
