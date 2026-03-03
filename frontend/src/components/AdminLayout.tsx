'use client';

import { type ReactNode } from 'react';
import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  activeItem: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminLayout({ children, activeItem, breadcrumbs }: AdminLayoutProps) {
  const defaultBreadcrumbs = [{ label: 'Admin', href: '/admin' }];
  const allBreadcrumbs = breadcrumbs
    ? [...defaultBreadcrumbs, ...breadcrumbs]
    : defaultBreadcrumbs;

  return (
    <PageLayout>
      <TopNav breadcrumbs={allBreadcrumbs} />
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        <AdminSidebar activeItem={activeItem} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </PageLayout>
  );
}
