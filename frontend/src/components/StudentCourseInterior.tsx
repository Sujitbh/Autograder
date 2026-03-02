'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from './PageLayout';
import { Button } from './ui/button';
import { useAssignments } from '@/hooks/queries/useAssignments';
import { useCourses } from '@/hooks/queries/useCourses';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Users,
  TrendingUp,
  BookOpen,
  BarChart3
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
  const [activeTab, setActiveTab] = useState<'assignments' | 'classmates' | 'grades'>('assignments');

  const course = courses?.find((c) => c.id === courseId);
  const now = new Date();

  // Fetch classmates
  const { data: classmates = [] } = useQuery({
    queryKey: ['classmates', courseId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/courses/${courseId}/classmates`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: activeTab === 'classmates'
  });

  // Fetch grades
  const { data: gradesData } = useQuery({
    queryKey: ['courseGrades', courseId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/courses/${courseId}/grades`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: activeTab === 'grades'
  });

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
    
    // Count completed (this would be from submission status, for now use published as proxy)
    const completed = all.filter((a) => a.status === 'published').length;

    return {
      total: all.length,
      published,
      dueSoon,
      completed,
    };
  }, [assignments, now]);

  return (
    <PageLayout>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/student')}
          className="mb-6 gap-2 hover:bg-gray-100 rounded-lg px-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Button>

        {/* Header Section with Gradient */}
        <div className="mb-8">
          <div className="relative bg-gradient-to-br from-[#6B0000] to-[#8B0000] rounded-3xl p-8 text-white shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">
                {course?.name ?? 'Course'}
              </h1>
              {course?.code && (
                <p className="text-xl opacity-90 mb-4">
                  {course.code}
                </p>
              )}
              {course?.description && (
                <p className="text-sm opacity-80 max-w-3xl leading-relaxed">
                  {course.description}
                </p>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <p className="text-xs opacity-80 mb-1">Total</p>
                  <p className="text-3xl font-bold">{courseStats.total}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <p className="text-xs opacity-80 mb-1">Active</p>
                  <p className="text-3xl font-bold">{courseStats.published}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <p className="text-xs opacity-80 mb-1">Due Soon</p>
                  <p className="text-3xl font-bold">{courseStats.dueSoon}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                  <p className="text-xs opacity-80 mb-1">Completed</p>
                  <p className="text-3xl font-bold">{courseStats.completed ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex items-center gap-2 pb-4 px-1 font-semibold transition-all border-b-2 ${
                activeTab === 'assignments'
                  ? 'border-[#6B0000] text-[#6B0000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-5 h-5" />
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('classmates')}
              className={`flex items-center gap-2 pb-4 px-1 font-semibold transition-all border-b-2 ${
                activeTab === 'classmates'
                  ? 'border-[#6B0000] text-[#6B0000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-5 h-5" />
              Classmates
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`flex items-center gap-2 pb-4 px-1 font-semibold transition-all border-b-2 ${
                activeTab === 'grades'
                  ? 'border-[#6B0000] text-[#6B0000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Grades
            </button>
          </div>
        </div>

        {/* Tabs Content */}
        <div>
          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Assignments
                </h2>
                <p className="text-sm mt-1 text-gray-500">
                  {assignments?.length ?? 0} assignment{assignments?.length !== 1 ? 's' : ''} in this course
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-16 text-sm text-gray-500">
                  Loading assignments…
                </div>
              ) : !assignments || assignments.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                  <div className="bg-white rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-semibold text-lg text-gray-900">
                    No assignments yet
                  </p>
                  <p className="text-sm mt-2 text-gray-500">
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
                        className="w-full text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-[#6B0000] hover:shadow-md hover:scale-[1.01] transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-3">
                              <h3 className="font-bold text-lg text-gray-900">
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
                                      ? '#DC262620'
                                      : dueLabel.tone === 'warning'
                                      ? '#D9770620'
                                      : '#E5E7EB',
                                  color:
                                    dueLabel.tone === 'danger'
                                      ? '#DC2626'
                                      : dueLabel.tone === 'warning'
                                      ? '#D97706'
                                      : '#6B7280',
                                }}
                              >
                                <DueIcon className="w-3 h-3" />
                                {dueLabel.label}
                              </div>
                            </div>

                            {assignment.description && (
                              <p className="text-sm mb-4 line-clamp-2 leading-relaxed text-gray-600">
                                {assignment.description}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-sm">
                              {dueDate && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50" style={{ color: isOverdue ? '#DC2626' : '#374151' }}>
                                  <Calendar className="w-4 h-4" />
                                  <span className="font-medium">
                                    {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              )}
                              {assignment.maxPoints && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-700">
                                  <FileText className="w-4 h-4" />
                                  <span className="font-medium">{assignment.maxPoints} points</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-center min-h-[60px] gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight 
                              className="w-5 h-5 text-[#6B0000]" 
                            />
                            <span className="text-xs font-semibold text-[#6B0000]">
                              View
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Classmates Tab */}
          {activeTab === 'classmates' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Classmates
                </h2>
                <p className="text-sm mt-1 text-gray-500">
                  {classmates.length} student{classmates.length !== 1 ? 's' : ''} in this course
                </p>
              </div>

              {classmates.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="font-semibold text-lg text-gray-900">
                    No classmates yet
                  </p>
                  <p className="text-sm mt-2 text-gray-500">
                    Classmates list will appear here once others join the course.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classmates.map((classmate: any) => (
                    <div
                      key={classmate.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B0000] to-[#8B0000] flex items-center justify-center text-white font-bold text-sm">
                          {classmate.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">
                            {classmate.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {classmate.email}
                          </p>
                        </div>
                      </div>
                      <div className="h-px bg-gray-200 mt-3 pt-3">
                        <p className="text-xs text-center text-gray-500">
                          Student in this course
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Grades Tab */}
          {activeTab === 'grades' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  My Grades
                </h2>
                <p className="text-sm mt-1 text-gray-500">
                  Your performance in this course
                </p>
              </div>

              {gradesData && (
                <>
                  {/* Grade Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <p className="text-sm font-semibold text-gray-700">Average Score</p>
                      </div>
                      {gradesData.averageScore !== null ? (
                        <p className="text-4xl font-bold text-green-600">{gradesData.averageScore}%</p>
                      ) : (
                        <p className="text-lg text-gray-500">No grades yet</p>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-6 h-6 text-blue-600" />
                        <p className="text-sm font-semibold text-gray-700">Graded</p>
                      </div>
                      <p className="text-4xl font-bold text-blue-600">
                        {gradesData.graded_count}/{gradesData.total_count}
                      </p>
                      <p className="text-xs mt-2 text-gray-500">
                        assignments graded
                      </p>
                    </div>
                  </div>

                  {/* Assignment Grades */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-900">
                      Assignment Breakdown
                    </h3>
                    {gradesData.assignments && gradesData.assignments.length > 0 ? (
                      <div className="space-y-3">
                        {gradesData.assignments.map((ag: any) => (
                          <div
                            key={ag.assignment_id}
                            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
                                  {ag.assignment_name}
                                </h4>
                              </div>
                              {ag.percentage !== null ? (
                                <div className="text-right">
                                  <p className="text-2xl font-bold" style={{ color: ag.percentage >= 70 ? '#16A34A' : ag.percentage >= 50 ? '#D97706' : '#DC2626' }}>
                                    {ag.percentage}%
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {ag.score}/{ag.max_score}
                                  </p>
                                </div>
                              ) : ag.submitted ? (
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-gray-600">
                                    Submitted
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Pending grade
                                  </p>
                                </div>
                              ) : (
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-orange-600">
                                    Not submitted
                                  </p>
                                </div>
                              )}
                            </div>
                            {ag.percentage !== null && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${ag.percentage}%`,
                                    backgroundColor: ag.percentage >= 70 ? '#16A34A' : ag.percentage >= 50 ? '#D97706' : '#DC2626'
                                  }}
                                ></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No grades available yet.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
