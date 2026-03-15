'use client';

import { Users, BookOpen, FileText, Plus, Shield, Loader2 } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useAdminStats, useAdminActivity } from '@/hooks/queries/useAdmin';

export function AdminDashboard() {
  const router = useRouter();
  const { data: stats } = useAdminStats();
  const { data: activity, isLoading: activityLoading } = useAdminActivity(15);

  return (
    <AdminLayout activeItem="dashboard">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
            System Administration — University of Louisiana Monroe
          </p>
        </div>
      </div>

      {/* User Breakdown + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Breakdown */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-dark)' }}>Users by Role</h3>
          <div className="space-y-3">
            {[
              { label: 'Students', count: stats?.users_by_role?.student ?? 0, color: '#2D6A2D' },
              { label: 'Faculty', count: stats?.users_by_role?.faculty ?? 0, color: '#1A4D7A' },
              { label: 'Admins', count: stats?.users_by_role?.admin ?? 0, color: 'var(--color-primary)' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>{item.label}</span>
                <span className="font-semibold" style={{ fontSize: '16px', color: item.color }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-dark)' }}>Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => router.push('/admin/users')}
              className="text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button
              onClick={() => router.push('/admin/courses')}
              className="text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Courses
            </Button>
            <Button
              onClick={() => router.push('/admin/audit')}
              variant="outline"
            >
              <Shield className="w-4 h-4 mr-2" />
              View Audit Log
            </Button>
            <Button
              onClick={() => router.push('/admin/settings')}
              variant="outline"
            >
              System Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-dark)' }}>Recent Activity</h3>

        {activityLoading ? (
          <div className="flex items-center gap-2 py-4" style={{ color: 'var(--color-text-mid)' }}>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading activity...</span>
          </div>
        ) : !activity || activity.length === 0 ? (
          <p className="text-sm py-4" style={{ color: 'var(--color-text-light)' }}>No recent activity</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'var(--color-primary-bg)' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: item.type === 'registration' ? '#E3F2FD' : item.type === 'submission' ? '#E8F5E9' : '#FFF3CD',
                    color: item.type === 'registration' ? '#1A4D7A' : item.type === 'submission' ? '#2D6A2D' : '#8A5700',
                  }}
                >
                  {item.type === 'registration' ? <Users className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>{item.description}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
