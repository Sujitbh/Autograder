'use client';

import { type ReactNode } from 'react';
import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import { StudentSidebar } from './StudentSidebar';

interface StudentLayoutProps {
  children: ReactNode;
  activeItem: string;
  courseId: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function StudentLayout({ children, activeItem, courseId, breadcrumbs }: StudentLayoutProps) {
  const defaultBreadcrumbs = [{ label: 'My Courses', href: '/student' }];
  const allBreadcrumbs = breadcrumbs
    ? [...defaultBreadcrumbs, ...breadcrumbs]
    : defaultBreadcrumbs;

  return (
    <PageLayout>
      <TopNav breadcrumbs={allBreadcrumbs} />
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        <StudentSidebar activeItem={activeItem} courseId={courseId} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </PageLayout>
  );
}
