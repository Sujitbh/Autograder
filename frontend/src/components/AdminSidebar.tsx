'use client';

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Code,
  UserCheck,
  Shield,
  Settings,
  KeyRound,
  User,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  activeItem?: string;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { id: 'users', icon: Users, label: 'Users', path: '/admin/users' },
  { id: 'courses', icon: BookOpen, label: 'Courses', path: '/admin/courses' },
  { id: 'semesters', icon: Calendar, label: 'Semesters', path: '/admin/semesters' },
  { id: 'languages', icon: Code, label: 'Languages', path: '/admin/languages' },
  { id: 'ta', icon: UserCheck, label: 'TA Management', path: '/admin/ta' },
  { id: 'audit', icon: Shield, label: 'Audit Log', path: '/admin/audit' },
  { id: 'settings', icon: Settings, label: 'System Settings', path: '/admin/settings' },
  { id: 'passwords', icon: KeyRound, label: 'Passwords', path: '/admin/passwords' },
  { id: 'account', icon: User, label: 'My Account', path: '/admin/account' },
];

export function AdminSidebar({ activeItem = 'dashboard' }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const router = useRouter();

  return (
    <aside
      className="border-r h-full transition-all duration-300 flex-shrink-0"
      style={{
        width: isCollapsed ? '64px' : '260px',
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Toggle Button */}
      <div
        className="h-16 flex items-center border-b"
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
          <span
            className="ml-3"
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--color-primary)',
              letterSpacing: '0.3px',
            }}
          >
            Admin Panel
          </span>
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
