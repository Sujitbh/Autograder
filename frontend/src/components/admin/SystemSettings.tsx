'use client';

import { useState, useEffect } from 'react';
import { Settings, Loader2, Save } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAdminSettings, useUpdateAdminSettings, useIntegrityDetectorStatus } from '@/hooks/queries/useAdmin';

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
  const { data: detector, isLoading: detectorLoading } = useIntegrityDetectorStatus();
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

      <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-dark)' }}>Integrity Detector</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginTop: 2 }}>
              AI-generated vs human-written classifier status and latest training metrics.
            </p>
          </div>
          {detectorLoading ? (
            <span className="inline-flex items-center gap-2" style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </span>
          ) : (
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 999,
                backgroundColor: detector?.model_available ? '#DCFCE7' : '#FEE2E2',
                color: detector?.model_available ? '#166534' : '#991B1B',
                border: detector?.model_available ? '1px solid #86EFAC' : '1px solid #FCA5A5',
              }}
            >
              {detector?.model_available ? 'Model Ready' : 'Model Missing'}
            </span>
          )}
        </div>

        {!detectorLoading && detector && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
            <div className="rounded-lg p-3" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-primary-bg)' }}>
              <p style={{ fontSize: '11px', color: 'var(--color-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Accuracy</p>
              <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-dark)' }}>
                {detector.metrics?.accuracy != null ? `${(detector.metrics.accuracy * 100).toFixed(1)}%` : '--'}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-primary-bg)' }}>
              <p style={{ fontSize: '11px', color: 'var(--color-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Macro F1</p>
              <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-dark)' }}>
                {detector.metrics?.macro_f1 != null ? detector.metrics.macro_f1.toFixed(4) : '--'}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-primary-bg)' }}>
              <p style={{ fontSize: '11px', color: 'var(--color-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Train/Test</p>
              <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-dark)' }}>
                {detector.metrics?.train_size != null && detector.metrics?.test_size != null
                  ? `${detector.metrics.train_size}/${detector.metrics.test_size}`
                  : '--'}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-primary-bg)' }}>
              <p style={{ fontSize: '11px', color: 'var(--color-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Last Trained</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-dark)', marginTop: 4 }}>
                {detector.model_last_modified
                  ? new Date(detector.model_last_modified * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                  : '--'}
              </p>
            </div>
          </div>
        )}
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
