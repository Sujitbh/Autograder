'use client';

import {
  FileText,
  BarChart3,
  Users,
  UsersRound,
  ArrowLeft,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StudentSidebarProps {
  activeItem?: string;
  courseId: string;
}

export function StudentSidebar({ activeItem = 'assignments', courseId }: StudentSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const menuItems = [
    { id: 'assignments', icon: FileText, label: 'Assignments', path: `/student/courses/${courseId}` },
    { id: 'grades', icon: BarChart3, label: 'Grades', path: `/student/courses/${courseId}/grades` },
    { id: 'classmates', icon: Users, label: 'Classmates', path: `/student/courses/${courseId}/classmates` },
    { id: 'groups', icon: UsersRound, label: 'Groups', path: `/student/courses/${courseId}/groups` },
  ];

  return (
    <aside
      className="border-r h-full transition-all duration-300 flex-shrink-0"
      style={{
        width: isCollapsed ? '64px' : '260px',
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Toggle + Back */}
      <div
        className="h-16 flex items-center gap-2 border-b"
        style={{
          padding: isCollapsed ? '0 20px' : '0 24px',
          borderColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded hover:bg-[var(--color-primary-bg)] transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-5 h-5" style={{ color: 'var(--color-text-dark)' }} />
        </button>
        {!isCollapsed && (
          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-2 text-sm hover:underline"
            style={{ color: 'var(--color-text-mid)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            My Courses
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className="w-full flex items-center gap-3 py-3 px-6 transition-colors relative"
              style={{
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-mid)',
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
              )}
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span style={{ fontSize: '14px', fontWeight: isActive ? 500 : 400 }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
