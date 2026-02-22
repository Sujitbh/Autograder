import { useState, useEffect } from 'react';
import { Plus, Search, Grid3x3, List, Trash2, MoreVertical, AlertTriangle, CalendarDays, Loader2 } from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from './ui/dialog';
import { useRouter } from 'next/navigation';
import { useCourses, useDeleteCourse } from '@/hooks/queries';

/* ═══════════════════════════════════════════
   Types (local UI shape — mapped from API)
   ═══════════════════════════════════════════ */

interface CourseUI {
  id: string;
  code: string;
  title: string;
  semester: string;
  section?: string;
  description?: string;
  students: number;
  assignments: number;
  pendingGrades: number;
  nextDueDays?: number | null;
  status: 'active' | 'archived' | 'draft';
  enrollmentCode?: string;
  enrollmentCodeActive?: boolean;
}

export function CoursesLanding() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  /* ── Fetch courses from API ── */
  const { data: apiCourses, isLoading, error } = useCourses();
  const deleteMutation = useDeleteCourse();

  /* ── Map API Course → UI shape ── */
  const courses: CourseUI[] = (apiCourses ?? []).map(c => ({
    id: c.id,
    code: c.code || 'N/A',
    title: c.name,
    semester: c.semester || 'Spring 2026',
    description: c.description,
    students: c.studentCount ?? 0,
    assignments: c.assignmentCount ?? 0,
    pendingGrades: c.pendingGrades ?? 0,
    nextDueDays: null,
    status: (c.status as 'active' | 'archived' | 'draft') || 'active',
    enrollmentCode: c.enrollmentCode,
    enrollmentCodeActive: c.enrollmentCodeActive ?? true,
  }));

  /* Also persist to localStorage for other components that still read it */
  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem('autograde_courses', JSON.stringify(courses));
    }
  }, [courses]);

  /* ── Delete confirmation ── */
  const [courseToDelete, setCourseToDelete] = useState<CourseUI | null>(null);

  const handleDeleteCourse = () => {
    if (!courseToDelete) return;
    deleteMutation.mutate(courseToDelete.id);
    setCourseToDelete(null);
  };

  /* ── Filtering ── */
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = semesterFilter === 'all' || course.semester === semesterFilter;
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesSemester && matchesStatus;
  });



  const getStatusBadge = (status: CourseUI['status']) => {
    const styles = {
      active: { bg: 'var(--color-success)', text: '#fff' },
      archived: { bg: 'var(--color-text-light)', text: '#fff' },
      draft: { bg: 'var(--color-warning)', text: '#fff' },
    };
    const style = styles[status];

    return (
      <span
        className="px-2 py-1 rounded"
        style={{
          backgroundColor: style.bg,
          color: style.text,
          fontSize: '11px',
          fontWeight: 700,
          lineHeight: '14px',
          textTransform: 'uppercase'
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <PageLayout>
      <TopNav breadcrumbs={[{ label: 'My Courses' }]} />

      <main className="p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-primary)', fontFamily: 'Inter, sans-serif' }}>
              My Courses
            </h1>
            <p style={{ fontSize: '14px', fontWeight: 400, color: 'var(--color-text-mid)', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
              Spring 2026 — University of Louisiana Monroe
            </p>
          </div>
          <Button
            onClick={() => router.push('/courses/new')}
            className="text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', height: '40px', padding: '0 24px' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Course
          </Button>
        </div>

        {/* Filter Bar */}
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px' }}>
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div style={{ width: '50%', minWidth: '250px' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                <Input
                  placeholder="Search by course name or code…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[var(--color-border)]"
                />
              </div>
            </div>

            {/* Semester Filter */}
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger style={{ width: '180px' }}>
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                <SelectItem value="Summer 2025">Summer 2025</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger style={{ width: '140px' }}>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex gap-1 ml-auto" style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '2px' }}>
              <button
                onClick={() => setViewMode('grid')}
                className="flex items-center justify-center rounded transition-colors"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--primary-foreground)' : 'var(--color-text-mid)'
                }}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="flex items-center justify-center rounded transition-colors"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--primary-foreground)' : 'var(--color-text-mid)'
                }}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading / Error states */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading courses…</span>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-2" style={{ color: 'var(--color-danger, #ef4444)' }}>
            <AlertTriangle className="w-6 h-6" />
            <span>Failed to load courses. Is the backend running?</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>{(error as Error).message}</span>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && !error && <div
          className={viewMode === 'grid' ? 'grid gap-5' : 'space-y-4'}
          style={viewMode === 'grid' ? {
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          } : undefined}
        >
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => router.push(`/courses/${course.id}`)}
            >
              {/* Maroon Top Bar */}
              <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-primary)' }} />

              <div style={{ padding: '20px 20px 16px', flex: 1 }}>
                {/* Row 1: Course Code + Enrollment Code */}
                <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--primary-foreground)',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      borderRadius: '9999px',
                      padding: '3px 12px',
                      display: 'inline-block'
                    }}
                  >
                    {course.code}
                  </span>
                  {course.enrollmentCode && course.enrollmentCodeActive && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#888',
                        fontFamily: 'monospace',
                        letterSpacing: '1px',
                      }}
                      title="Course enrollment code"
                    >
                      {course.enrollmentCode}
                    </span>
                  )}
                </div>

                {/* Row 2: Course Title */}
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    lineHeight: '22px',
                    color: 'var(--color-text-dark)',
                    fontFamily: 'Inter, sans-serif',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {course.title}
                </h3>

                {/* Row 3: Semester • Students */}
                <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
                  {course.semester}{course.section ? ` · Section ${course.section}` : ''} · {course.students} Students
                </p>

                {/* Alerts */}
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {course.pendingGrades > 0 && (
                    <div className="flex items-center gap-2" style={{ fontSize: '13px', color: '#B45309', fontFamily: 'Inter, sans-serif' }}>
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span><strong>{course.pendingGrades}</strong> submissions need grading</span>
                    </div>
                  )}
                  {course.nextDueDays != null && course.nextDueDays > 0 && (
                    <div className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--color-text-mid)', fontFamily: 'Inter, sans-serif' }}>
                      <CalendarDays className="w-4 h-4 shrink-0" />
                      <span>Assignment due in {course.nextDueDays} day{course.nextDueDays !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {course.pendingGrades === 0 && (course.nextDueDays == null || course.nextDueDays <= 0) && (
                    <div className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--color-success)', fontFamily: 'Inter, sans-serif' }}>
                      <span>✓ All caught up</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderTop: '1px solid var(--color-border)',
                  borderRadius: '0 0 12px 12px'
                }}
              >
                <div className="flex items-center justify-between">
                  {getStatusBadge(course.status)}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="hover:underline"
                      style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/courses/${course.id}`);
                      }}
                    >
                      Open Course →
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center justify-center rounded-md transition-colors hover:bg-[var(--color-border)]"
                          style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer' }}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Course options"
                        >
                          <MoreVertical className="w-4 h-4" style={{ color: 'var(--color-text-mid)' }} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                          onClick={() => setCourseToDelete(course)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>}

        {!isLoading && !error && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
              No courses found matching your filters.
            </p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
          <DialogContent style={{ maxWidth: '440px' }}>
            <DialogHeader>
              <DialogTitle style={{ color: 'var(--color-text-dark)', fontSize: '18px', fontWeight: 700 }}>
                Delete Course
              </DialogTitle>
              <DialogDescription style={{ color: 'var(--color-text-mid)', fontSize: '14px', marginTop: '8px' }}>
                Are you sure you want to delete <strong style={{ color: 'var(--color-text-dark)' }}>{courseToDelete?.code} — {courseToDelete?.title}</strong>? This action cannot be undone and all associated data will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setCourseToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCourse}
                className="text-white"
                style={{ backgroundColor: '#dc2626' }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </PageLayout>
  );
}

