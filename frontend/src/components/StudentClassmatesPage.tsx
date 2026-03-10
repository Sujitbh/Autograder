'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCourses } from '@/hooks/queries/useCourses';
import { Users, Search } from 'lucide-react';
import { StudentLayout } from './StudentLayout';
import api from '@/services/api/client';

interface StudentClassmatesPageProps {
  courseId: string;
}

export function StudentClassmatesPage({ courseId }: StudentClassmatesPageProps) {
  const { data: courses } = useCourses();
  const course = courses?.find((c) => c.id === courseId);
  const [search, setSearch] = useState('');

  const { data: classmates = [], isLoading } = useQuery({
    queryKey: ['classmates', courseId],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${courseId}/classmates`);
      return data;
    },
  });

  const filtered = classmates.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <StudentLayout
      activeItem="classmates"
      courseId={courseId}
      breadcrumbs={[
        { label: course?.name ?? 'Course', href: `/student/courses/${courseId}` },
        { label: 'Classmates' },
      ]}
    >
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-dark)' }}>Classmates</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)' }}>
              {classmates.length} student{classmates.length !== 1 ? 's' : ''} in {course?.name ?? 'this course'}
            </p>
          </div>
          {/* Search */}
          {classmates.length > 0 && (
            <div className="relative" style={{ minWidth: '220px' }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none transition"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-dark)',
                }}
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 rounded-full mx-auto" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
            <p className="mt-4" style={{ color: 'var(--color-text-mid)' }}>Loading classmates...</p>
          </div>
        ) : classmates.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
            <p className="font-semibold text-lg" style={{ color: 'var(--color-text-dark)' }}>No classmates yet</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-mid)' }}>
              Classmates list will appear here once others join the course.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            {/* Table header */}
            <div
              className="grid text-xs font-semibold uppercase tracking-wide px-5 py-3"
              style={{
                gridTemplateColumns: '2.5rem 1fr 1fr 1fr',
                backgroundColor: 'var(--color-surface-elevated)',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-mid)',
              }}
            >
              <span>#</span>
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-sm" style={{ color: 'var(--color-text-mid)' }}>
                No results match "{search}"
              </div>
            ) : (
              filtered.map((classmate: any, idx: number) => (
                <div
                  key={classmate.id}
                  className="grid items-center px-5 py-3 transition-colors"
                  style={{
                    gridTemplateColumns: '2.5rem 1fr 1fr 1fr',
                    borderBottom: idx < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                    backgroundColor: 'var(--color-surface)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
                >
                  {/* Index */}
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-light)' }}>{idx + 1}</span>

                  {/* Name + avatar */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))' }}
                    >
                      {classmate.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text-dark)' }}>{classmate.name}</span>
                  </div>

                  {/* Email */}
                  <span className="text-sm truncate" style={{ color: 'var(--color-text-mid)' }}>{classmate.email}</span>

                  {/* Role badge */}
                  <span>
                    <span
                      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(var(--color-primary-rgb, 107,0,0), 0.08)', color: 'var(--color-primary)' }}
                    >
                      Student
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
