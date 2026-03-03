'use client';

import { useQuery } from '@tanstack/react-query';
import { useCourses } from '@/hooks/queries/useCourses';
import { Users } from 'lucide-react';
import { StudentLayout } from './StudentLayout';
import api from '@/services/api/client';

interface GroupMember {
  id: number;
  name: string;
  email: string;
  role: string | null;
}

interface StudentGroup {
  id: number;
  name: string;
  assignment_name: string | null;
  is_reusable: boolean;
  members: GroupMember[];
}

interface StudentGroupsPageProps {
  courseId: string;
}

export function StudentGroupsPage({ courseId }: StudentGroupsPageProps) {
  const { data: courses } = useCourses();
  const course = courses?.find((c) => c.id === courseId);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['studentGroups', courseId],
    queryFn: async () => {
      const { data } = await api.get<StudentGroup[]>(`/courses/${courseId}/my-groups`);
      return data;
    },
  });

  return (
    <StudentLayout
      activeItem="groups"
      courseId={courseId}
      breadcrumbs={[
        { label: course?.name ?? 'Course', href: `/student/courses/${courseId}` },
        { label: 'Groups' },
      ]}
    >
      <div className="max-w-5xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-dark)' }}>My Groups</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)' }}>
            Groups you are a member of in {course?.name ?? 'this course'}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full mx-auto" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
            <p className="mt-4" style={{ color: 'var(--color-text-mid)' }}>Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
            <p className="font-semibold text-lg" style={{ color: 'var(--color-text-dark)' }}>No groups yet</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-mid)' }}>
              You haven&apos;t been assigned to any groups in this course yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                {/* Group Header */}
                <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                        <Users className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <div>
                        <h3 className="font-bold" style={{ color: 'var(--color-text-dark)' }}>{group.name}</h3>
                        {group.assignment_name && (
                          <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>For: {group.assignment_name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {group.is_reusable && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
                          Reusable
                        </span>
                      )}
                      <span className="text-xs" style={{ color: 'var(--color-text-mid)' }}>
                        {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Members List */}
                <div>
                  {group.members.map((member, idx) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 px-6 py-3"
                      style={{ borderTop: idx > 0 ? '1px solid var(--color-border)' : 'none' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))' }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-dark)' }}>{member.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--color-text-mid)' }}>{member.email}</p>
                      </div>
                      {member.role && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-mid)' }}>
                          {member.role}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
