'use client';

import { useState } from 'react';
import { Search, Loader2, BookOpen, Users, Plus, LayoutGrid, List } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAdminCourses, useDeleteAdminCourse } from '@/hooks/queries/useAdmin';
import { useRouter } from 'next/navigation';

export function AdminCourseManagement() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const params = {
    search: search || undefined,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
  };

  const { data: courses, isLoading } = useAdminCourses(params);
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteAdminCourse();

  const handleDelete = (courseId: number, courseName: string) => {
    if (confirm(`Are you sure you want to delete the course "${courseName}"? This action cannot be undone and will delete all associated enrollments, assignments, and submissions.`)) {
      deleteCourse(courseId);
    }
  };

  return (
    <AdminLayout activeItem="courses" breadcrumbs={[{ label: 'Courses' }]}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>Course Management</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
            All courses — System-wide overview
            {!isLoading && courses && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}
              >
                {courses.length} {courses.length === 1 ? 'course' : 'courses'}
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/courses/new')}
          className="text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
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

        {/* View toggle */}
        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setViewMode('grid')}
            className="p-2 transition-colors"
            title="Grid view"
            style={{
              backgroundColor: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: viewMode === 'grid' ? '#fff' : 'var(--color-text-mid)',
            }}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="p-2 transition-colors"
            title="List view"
            style={{
              backgroundColor: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: viewMode === 'list' ? '#fff' : 'var(--color-text-mid)',
            }}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
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
      ) : viewMode === 'grid' ? (
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
                  <div className="flex gap-2">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase"
                      style={{
                        backgroundColor: course.is_active ? 'var(--color-success, #2D6A2D)' : 'var(--color-text-light)',
                        color: '#fff',
                      }}
                    >
                      {course.is_active ? 'Active' : 'Archived'}
                    </span>
                    <button
                      onClick={() => handleDelete(course.id, course.name)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded px-2 py-0.5 text-xs font-semibold transition-colors disabled:opacity-50"
                      title="Delete Course"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="line-clamp-2 mb-1"
                  style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-text-dark)' }}
                >
                  {course.name}
                </h3>

                {/* Faculty + Section */}
                <p className="text-sm mb-3" style={{ color: 'var(--color-text-mid)' }}>
                  {course.faculty_name ? `Instructor: ${course.faculty_name}` : 'No instructor assigned'}
                </p>
                {(course as any).section && (
                  <p className="text-sm mb-3" style={{ color: 'var(--color-text-mid)' }}>
                    Section: {(course as any).section}
                  </p>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>{course.student_count} students</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          {/* Table header */}
          <div
            className="grid gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide"
            style={{
              color: 'var(--color-text-light)',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-primary-bg)',
              gridTemplateColumns: '120px 1fr 180px 80px 80px 80px',
            }}
          >
            <span>Code</span>
            <span>Course Name</span>
            <span>Instructor</span>
            <span>Section</span>
            <span>Status</span>
            <span></span>
          </div>

          {courses.map((course, idx) => (
            <div
              key={course.id}
              className="grid gap-4 px-5 py-3 items-center hover:bg-[var(--color-primary-bg)] transition-colors"
              style={{
                gridTemplateColumns: '120px 1fr 180px 100px 80px 80px',
                borderBottom: idx < courses.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <span
                className="inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white w-fit"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {course.code || 'N/A'}
              </span>

              <span className="font-medium truncate" style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                {course.name}
              </span>

              <span className="truncate" style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                {course.faculty_name ?? <em style={{ color: 'var(--color-text-light)' }}>No instructor</em>}
              </span>

              <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                {(course as any).section ?? <em style={{ color: 'var(--color-text-light)' }}>—</em>}
              </span>

              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase w-fit"
                style={{
                  backgroundColor: course.is_active ? 'var(--color-success, #2D6A2D)' : 'var(--color-text-light)',
                  color: '#fff',
                }}
              >
                {course.is_active ? 'Active' : 'Archived'}
              </span>

              <button
                onClick={() => handleDelete(course.id, course.name)}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded px-2 py-0.5 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
