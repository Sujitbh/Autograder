'use client';

import { useState, useEffect } from 'react';
import { Settings, Loader2, Save } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAdminSettings, useUpdateAdminSettings } from '@/hooks/queries/useAdmin';

const SETTING_CATEGORIES = [
  {
    key: 'general',
    label: 'General',
    fields: [
      { key: 'site_name', label: 'Site Name', placeholder: 'Axiom' },
      { key: 'institution_name', label: 'Institution', placeholder: 'University of Louisiana Monroe' },
      { key: 'support_email', label: 'Support Email', placeholder: 'support@ulm.edu' },
    ],
  },
  {
    key: 'email',
    label: 'Email',
    fields: [
      { key: 'smtp_host', label: 'SMTP Host', placeholder: 'smtp.gmail.com' },
      { key: 'smtp_port', label: 'SMTP Port', placeholder: '587' },
      { key: 'smtp_user', label: 'SMTP User', placeholder: 'noreply@ulm.edu' },
      { key: 'from_email', label: 'From Email', placeholder: 'autograder@ulm.edu' },
    ],
  },
  {
    key: 'security',
    label: 'Security',
    fields: [
      { key: 'session_timeout_minutes', label: 'Session Timeout (minutes)', placeholder: '60' },
      { key: 'max_login_attempts', label: 'Max Login Attempts', placeholder: '5' },
      { key: 'password_min_length', label: 'Min Password Length', placeholder: '8' },
    ],
  },
  {
    key: 'grading',
    label: 'Grading',
    fields: [
      { key: 'max_file_size_mb', label: 'Max Upload Size (MB)', placeholder: '10' },
      { key: 'execution_timeout_seconds', label: 'Execution Timeout (seconds)', placeholder: '30' },
      { key: 'max_concurrent_submissions', label: 'Max Concurrent Submissions', placeholder: '5' },
    ],
  },
];

export function SystemSettings() {
  const { data: settings, isLoading } = useAdminSettings();
  const updateMutation = useUpdateAdminSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      const flat: Record<string, string> = {};
      for (const [, entries] of Object.entries(settings)) {
        if (typeof entries === 'object') {
          for (const [k, v] of Object.entries(entries)) {
            flat[k] = v;
          }
        }
      }
      setForm(flat);
    }
  }, [settings]);

  const handleSave = () => {
    updateMutation.mutate(form, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  const activeCategory = SETTING_CATEGORIES.find((c) => c.key === activeTab) ?? SETTING_CATEGORIES[0];

  return (
    <AdminLayout activeItem="settings" breadcrumbs={[{ label: 'System Settings' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>System Settings</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>Configure system-wide preferences</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="text-white"
          style={{ backgroundColor: saved ? '#2D6A2D' : 'var(--color-primary)' }}
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
          <Loader2 className="w-5 h-5 animate-spin" /> <span>Loading settings...</span>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Category tabs - vertical */}
          <div className="flex flex-col gap-1 p-1 rounded-lg shrink-0" style={{ backgroundColor: 'var(--color-primary-bg)', minWidth: '180px' }}>
            {SETTING_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className="px-4 py-2.5 rounded-md text-sm font-medium transition-colors text-left"
                style={{
                  backgroundColor: activeTab === cat.key ? 'var(--color-surface)' : 'transparent',
                  color: activeTab === cat.key ? 'var(--color-primary)' : 'var(--color-text-mid)',
                  boxShadow: activeTab === cat.key ? 'var(--shadow-card)' : 'none',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Settings form */}
          <div className="flex-1 rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text-dark)' }}>
              {activeCategory.label} Settings
            </h3>
            <div className="space-y-5">
              {activeCategory.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>
                    {field.label}
                  </label>
                  <Input
                    value={form[field.key] ?? ''}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
