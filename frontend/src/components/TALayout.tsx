'use client';

import { type ReactNode } from 'react';
import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import { TASidebar } from './TASidebar';
import type { TAPermissions } from '@/services/api/taDashboardService';

interface TALayoutProps {
    readonly children: ReactNode;
    readonly activeItem: string;
    readonly courseId?: string;
    readonly permissions?: Partial<TAPermissions>;
    readonly breadcrumbs?: { label: string; href?: string }[];
}

export function TALayout({ children, activeItem, courseId, permissions, breadcrumbs }: TALayoutProps) {
    const defaultBreadcrumbs = [{ label: 'TA Dashboard', href: '/ta' }];
    const allBreadcrumbs = breadcrumbs
        ? [...defaultBreadcrumbs, ...breadcrumbs]
        : defaultBreadcrumbs;

    return (
        <PageLayout>
            <TopNav breadcrumbs={allBreadcrumbs} />
            <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
                <TASidebar activeItem={activeItem} courseId={courseId} permissions={permissions} />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </PageLayout>
    );
}
