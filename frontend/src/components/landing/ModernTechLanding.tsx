'use client';

import Link from 'next/link';
import { Zap, ShieldCheck, LayoutDashboard } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Evaluation',
    description: 'Submit your projects and receive immediate test results.',
  },
  {
    icon: ShieldCheck,
    title: 'Academic Integrity',
    description: 'Built-in originality checks to keep the playing field level.',
  },
  {
    icon: LayoutDashboard,
    title: 'One Dashboard',
    description: 'All your assignments, feedback, and grades in one place.',
  },
];

export default function ModernTechLanding() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: 'var(--font-body)',
        background:
          'linear-gradient(180deg, #FAF8F5 0%, #F0EBE3 45%, #FAF8F5 100%)',
      }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(250, 248, 245, 0.92)',
          borderColor: 'var(--landing-border)',
        }}
      >
        <div
          className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-8"
        >
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img
              src="/images/axiom-logo.png"
              alt="Axiom"
              width={44}
              height={44}
              className="rounded-full object-contain"
            />
            <span
              className="hidden sm:inline text-lg font-semibold tracking-tight"
              style={{ color: 'var(--landing-ink)' }}
            >
              Axiom
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-sm font-medium no-underline transition-opacity hover:opacity-80"
              style={{ color: 'var(--landing-ink-soft)' }}
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white no-underline shadow-md transition-all hover:opacity-95 hover:shadow-lg"
              style={{ backgroundColor: 'var(--landing-primary)' }}
            >
              Access Axiom
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(123, 13, 13, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 13, 13, 0.06) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: 'var(--landing-primary)' }}
            >
              University of Louisiana Monroe
            </p>
            <h1
              className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]"
              style={{
                color: 'var(--landing-ink)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Elevate Your Code.
              <br />
              <span style={{ color: 'var(--landing-primary)' }}>Simplify Your Grading.</span>
            </h1>
            <p
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl"
              style={{ color: 'var(--landing-muted)' }}
            >
              Axiom is the University of Louisiana Monroe&apos;s premier automated grading platform for
              Computer Science. Fast feedback for students, scalable solutions for faculty.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl px-10 py-4 text-base font-semibold text-white no-underline shadow-lg transition-all hover:opacity-95 hover:shadow-xl"
              style={{
                backgroundColor: 'var(--landing-primary)',
                boxShadow: '0 8px 32px rgba(123, 13, 13, 0.25)',
              }}
            >
              Access Axiom
            </Link>
          </div>
        </section>

        {/* Features grid */}
        <section
          className="border-t px-6 py-16 lg:px-8 lg:py-20"
          style={{
            borderColor: 'var(--landing-border)',
            backgroundColor: 'var(--landing-surface)',
          }}
        >
          <div className="mx-auto max-w-6xl">
            <h2
              className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: 'var(--landing-ink)' }}
            >
              Built for CS courses
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border p-8 transition-shadow hover:shadow-md"
                  style={{
                    borderColor: 'var(--landing-border)',
                    backgroundColor: '#FFFCF9',
                  }}
                >
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: 'rgba(123, 13, 13, 0.08)',
                      color: 'var(--landing-primary)',
                    }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3
                    className="mb-3 text-lg font-semibold"
                    style={{ color: 'var(--landing-ink)' }}
                  >
                    {title}
                  </h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: 'var(--landing-muted)' }}>
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 flex justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl px-10 py-4 text-base font-semibold text-white no-underline shadow-md transition-all hover:opacity-95"
                style={{ backgroundColor: 'var(--landing-primary)' }}
              >
                Access Axiom
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer
        className="border-t py-8 text-center text-sm"
        style={{
          borderColor: 'var(--landing-border)',
          color: 'var(--landing-muted)',
        }}
      >
        <p className="mb-1">University of Louisiana Monroe · Automated Grading System</p>
        <p className="text-xs">Need help? Contact support@ulm.edu</p>
      </footer>
    </div>
  );
}
