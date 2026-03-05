import {
  FileText,
  GraduationCap,
  BarChart3,
  Users,
  UsersRound,
  Settings,
  Menu,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface SidebarProps {
  activeItem?: string;
}

export function Sidebar({ activeItem = 'assignments' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const { courseId } = useParams() as { courseId: string };

  // Safety check - if no courseId, don't crash
  if (!courseId) {
    console.error('Sidebar: courseId is undefined');
    return null;
  }

  const menuItems = [
    { id: 'assignments', icon: FileText, label: 'Assignments', path: `/courses/${courseId}` },
    { id: 'grading', icon: GraduationCap, label: 'Grading', path: `/courses/${courseId}/grading` },
    { id: 'reports', icon: BarChart3, label: 'Reports', path: `/courses/${courseId}/reports` },
    { id: 'students', icon: Users, label: 'Students', path: `/courses/${courseId}/students` },
    { id: 'groups', icon: UsersRound, label: 'Groups', path: `/courses/${courseId}/groups` },
    { id: 'settings', icon: Settings, label: 'Settings', path: `/courses/${courseId}/settings` },
  ];

  return (
    <aside
      className="border-r h-full transition-all duration-300"
      style={{
        width: isCollapsed ? '64px' : '260px',
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Toggle Button */}
      <div
        className="h-16 flex items-center border-b"
        style={{
          padding: isCollapsed ? '0 20px' : '0 24px',
          borderColor: 'var(--color-border)'
        }}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded hover:bg-[var(--color-primary-bg)] transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-5 h-5" style={{ color: 'var(--color-text-dark)' }} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="py-4">
        {/* Back to Courses */}
        <button
          onClick={() => router.push('/courses')}
          className="w-full flex items-center gap-3 py-3 px-6 transition-colors mb-1"
          style={{ color: 'var(--color-primary)' }}
        >
          <ArrowLeft className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span style={{ fontSize: '13px', fontWeight: 600 }}>
              All Courses
            </span>
          )}
        </button>

        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 16px 8px' }} />

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
              {/* Active Indicator */}
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