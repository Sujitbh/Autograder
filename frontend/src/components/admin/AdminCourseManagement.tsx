'use client';

import { useState } from 'react';
import { Search, Loader2, BookOpen, Users, FileText, AlertTriangle } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAdminCourses } from '@/hooks/queries/useAdmin';

export function AdminCourseManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const params = {
    search: search || undefined,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
  };

  const { data: courses, isLoading } = useAdminCourses(params);

  return (
    <AdminLayout activeItem="courses" breadcrumbs={[{ label: 'Courses' }]}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>Course Management</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
            All courses — System-wide overview
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
          <Input
            placeholder="Search by course name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger style={{ width: '140px' }}><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading courses...</span>
        </div>
      ) : !courses || courses.length === 0 ? (
        <div className="text-center py-20 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-light)' }} />
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>No courses found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-xl"
              style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}
            >
              {/* Maroon bar */}
              <div style={{ height: '6px', backgroundColor: 'var(--color-primary)' }} />

              <div className="p-5">
                {/* Code badge + status */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="inline-block px-3 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {course.code || 'N/A'}
                  </span>
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase"
                    style={{
                      backgroundColor: course.is_active ? 'var(--color-success, #2D6A2D)' : 'var(--color-text-light)',
                      color: '#fff',
                    }}
                  >
                    {course.is_active ? 'Active' : 'Archived'}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="line-clamp-2 mb-1"
                  style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-text-dark)' }}
                >
                  {course.name}
                </h3>

                {/* Faculty */}
                <p className="text-sm mb-3" style={{ color: 'var(--color-text-mid)' }}>
                  {course.faculty_name ? `Instructor: ${course.faculty_name}` : 'No instructor assigned'}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>{course.student_count} students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>{course.assignment_count} assignments</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
