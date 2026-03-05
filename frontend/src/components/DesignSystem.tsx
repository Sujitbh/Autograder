import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';

/**
 * Design System Reference Page
 * Shows all design tokens, colors, typography, and spacing
 * This is a living style guide for developers and designers
 */
export function DesignSystem() {
  const colorTokens = [
    { name: '--color-primary', value: 'var(--color-primary)', usage: 'Primary CTAs, active states, headers, logo accents' },
    { name: '--color-primary-hover', value: 'var(--color-primary-hover)', usage: 'Button hover, active navigation items' },
    { name: '--color-primary-bg', value: 'var(--color-primary-bg)', usage: 'Page backgrounds, sidebar fill, inactive card states' },
    { name: '--color-primary-light', value: 'var(--color-primary-light)', usage: 'Notification badges, alert backgrounds, hover fills' },
    { name: '--color-gold-accent', value: 'var(--color-gold-accent)', usage: 'Notification badges, callout borders, award icons' },
    { name: '--color-text-dark', value: 'var(--color-text-dark)', usage: 'Primary body text, headings (non-maroon)' },
    { name: '--color-text-mid', value: 'var(--color-text-mid)', usage: 'Secondary labels, captions, metadata' },
    { name: '--color-text-light', value: 'var(--color-text-light)', usage: 'Placeholder text, disabled states, helper text' },
    { name: '--color-border', value: 'var(--color-border)', usage: 'Card borders, table borders, input outlines (default)' },
    { name: '--color-white', value: 'var(--color-surface)', usage: 'Card backgrounds, modal backgrounds, input fills' },
    { name: '--color-success', value: 'var(--color-success)', usage: 'Pass indicators, success toasts, positive metrics' },
    { name: '--color-warning', value: 'var(--color-warning)', usage: 'Warning toasts, late flags, caution indicators' },
    { name: '--color-error', value: 'var(--color-error)', usage: 'Fail indicators, error toasts, critical alerts' },
    { name: '--color-info', value: 'var(--color-info)', usage: 'Info chips, helper text, documentation links' },
  ];

  const typographyScale = [
    { size: '28px', weight: 700, usage: 'Page titles (H1)', example: 'Assignment Overview' },
    { size: '22px', weight: 600, usage: 'Page subheadings', example: 'Test Results' },
    { size: '18px', weight: 600, usage: 'Panel titles, modal headers', example: 'Basic Information' },
    { size: '16px', weight: 500, usage: 'Section headers, emphasized text', example: 'Code Correctness' },
    { size: '14px', weight: 400, usage: 'Body text (base), buttons', example: 'This is standard body text' },
    { size: '13px', weight: 500, usage: 'Form labels, secondary UI', example: 'Assignment Name' },
    { size: '12px', weight: 400, usage: 'Helper text, metadata', example: 'Submitted Feb 18, 2026' },
    { size: '11px', weight: 700, usage: 'Micro labels, table headers', example: 'STATUS' },
  ];

  const spacingScale = [
    { token: '--space-1', value: '4px' },
    { token: '--space-2', value: '8px', note: 'Base grid unit' },
    { token: '--space-3', value: '12px' },
    { token: '--space-4', value: '16px' },
    { token: '--space-5', value: '20px' },
    { token: '--space-6', value: '24px' },
    { token: '--space-8', value: '32px' },
    { token: '--space-10', value: '40px' },
    { token: '--space-12', value: '48px' },
  ];

  return (
    <PageLayout>
      <TopNav breadcrumbs={[{ label: 'Design System Reference' }]} />

      <main className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)', marginBottom: '8px' }}>
            AutoGrade Design System
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
            Complete reference for colors, typography, spacing, and components
          </p>
        </div>

        {/* Color Palette */}
        <section className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '24px' }}>
            1.1 Color Palette
          </h2>
          
          <div className="space-y-4">
            {colorTokens.map((token) => (
              <div key={token.name} className="flex items-center gap-4 p-4 border rounded-lg" style={{ borderColor: 'var(--color-border)' }}>
                <div 
                  className="w-16 h-16 rounded-lg border flex-shrink-0"
                  style={{ backgroundColor: token.value, borderColor: 'var(--color-border)' }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <code style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {token.name}
                    </code>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-mid)' }}>
                      {token.value}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>
                    {token.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Scale */}
        <section className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '24px' }}>
            1.2 Typography Scale
          </h2>
          
          <div className="space-y-6">
            {typographyScale.map((type, index) => (
              <div key={index} className="p-4 border rounded-lg" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                      {type.size} / {type.weight}
                    </span>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
                      {type.usage}
                    </p>
                  </div>
                </div>
                <div style={{ fontSize: type.size, fontWeight: type.weight, color: 'var(--color-text-dark)' }}>
                  {type.example}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing Scale */}
        <section className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '24px' }}>
            1.3 Spacing Scale (8px Grid)
          </h2>
          
          <div className="space-y-3">
            {spacingScale.map((space) => (
              <div key={space.token} className="flex items-center gap-4">
                <code style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)', fontFamily: 'JetBrains Mono, monospace', width: '120px' }}>
                  {space.token}
                </code>
                <span style={{ fontSize: '13px', color: 'var(--color-text-mid)', width: '60px' }}>
                  {space.value}
                </span>
                <div 
                  className="bg-[var(--color-primary)]"
                  style={{ width: space.value, height: '32px' }}
                />
                {space.note && (
                  <span style={{ fontSize: '12px', color: 'var(--color-warning)', fontWeight: 500 }}>
                    {space.note}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Shadows */}
        <section className="bg-white rounded-lg p-6 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '24px' }}>
            1.4 Shadows
          </h2>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 mb-2" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
                <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>Card Shadow</p>
              </div>
              <code style={{ fontSize: '11px', color: 'var(--color-text-mid)', fontFamily: 'JetBrains Mono, monospace' }}>
                --shadow-card
              </code>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-6 mb-2" style={{ boxShadow: '0 4px 12px rgba(107, 0, 0, 0.10)' }}>
                <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>Dropdown Shadow</p>
              </div>
              <code style={{ fontSize: '11px', color: 'var(--color-text-mid)', fontFamily: 'JetBrains Mono, monospace' }}>
                --shadow-dropdown
              </code>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-6 mb-2" style={{ boxShadow: '0 8px 24px rgba(107, 0, 0, 0.15)' }}>
                <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>Modal Shadow</p>
              </div>
              <code style={{ fontSize: '11px', color: 'var(--color-text-mid)', fontFamily: 'JetBrains Mono, monospace' }}>
                --shadow-modal
              </code>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '24px' }}>
            1.5 Border Radius
          </h2>
          
          <div className="grid grid-cols-4 gap-6">
            {[
              { token: '--radius-sm', value: '4px' },
              { token: '--radius-md', value: '8px' },
              { token: '--radius-lg', value: '12px' },
              { token: '--radius-xl', value: '16px' },
            ].map((radius) => (
              <div key={radius.token} className="text-center">
                <div 
                  className="bg-[var(--color-primary)] w-24 h-24 mb-2 mx-auto"
                  style={{ borderRadius: radius.value }}
                />
                <code style={{ fontSize: '11px', color: 'var(--color-text-mid)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {radius.token}
                </code>
                <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                  {radius.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageLayout>
  );
}