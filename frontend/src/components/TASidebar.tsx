'use client';

import {
    LayoutDashboard,
    FileText,
    Inbox,
    PenLine,
    BarChart3,
    Users,
    UsersRound,
    Settings,
    ArrowLeft,
    Menu,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TAPermissions } from '@/services/api/taDashboardService';

interface TASidebarProps {
    activeItem?: string;
    courseId?: string;
    permissions?: Partial<TAPermissions>;
}

interface MenuItem {
    id: string;
    icon: typeof LayoutDashboard;
    label: string;
    path: string;
}

function buildMenuItems(courseId?: string, permissions?: Partial<TAPermissions>): MenuItem[] {
    if (!courseId) {
        return [{ id: 'overview', icon: LayoutDashboard, label: 'Overview', path: '/ta' }];
    }

    const items: MenuItem[] = [
        { id: 'assignments', icon: FileText, label: 'Assignments', path: `/ta/courses/${courseId}` },
    ];

    if (permissions?.can_view_submissions === undefined || permissions.can_view_submissions) {
        items.push({ id: 'submissions', icon: Inbox, label: 'Submissions', path: `/ta/courses/${courseId}/submissions` });
    }
    if (permissions?.can_grade === undefined || permissions.can_grade) {
        items.push({ id: 'grading', icon: PenLine, label: 'Grading', path: `/ta/courses/${courseId}/grading` });
    }
    if (permissions?.can_access_reports === undefined || permissions.can_access_reports) {
        items.push({ id: 'gradebook', icon: BarChart3, label: 'Gradebook', path: `/ta/courses/${courseId}/gradebook` });
    }
    if (permissions?.can_view_students === undefined || permissions.can_view_students) {
        items.push({ id: 'students', icon: Users, label: 'Students', path: `/ta/courses/${courseId}/students` });
    }
    if (permissions?.can_manage_groups) {
        items.push({ id: 'groups', icon: UsersRound, label: 'Groups', path: `/ta/courses/${courseId}/groups` });
    }
    items.push({ id: 'settings', icon: Settings, label: 'Settings', path: '/student/settings' });

    return items;
}

export function TASidebar({ activeItem = 'overview', courseId, permissions }: Readonly<TASidebarProps>) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    const menuItems = buildMenuItems(courseId, permissions);

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
                        onClick={() => router.push(courseId ? '/ta' : '/student')}
                        className="flex items-center gap-2 text-sm hover:underline"
                        style={{ color: 'var(--color-text-mid)' }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {courseId ? 'TA Dashboard' : 'Student Dashboard'}
                    </button>
                )}
            </div>

            {/* TA Badge */}
            {!isCollapsed && (
                <div
                    className="mx-4 mt-4 mb-2 px-3 py-1.5 rounded-lg text-center"
                    style={{
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                    }}
                >
                    Teaching Assistant
                </div>
            )}

            {/* Navigation Items */}
            <nav className="py-2">
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
