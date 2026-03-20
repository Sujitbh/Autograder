'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

type Role = 'student' | 'faculty' | 'admin';

interface RoleData {
  title: string;
  subtitle: string;
  pills: string[];
  checklist: { title: string; description: string }[];
}

const rolesData: Record<Role, RoleData> = {
  student: {
    title: 'Student',
    subtitle: 'Submit, test, and track your progress.',
    pills: ['Code Submission', 'Instant Feedback', 'Grade Tracking', 'Group Projects'],
    checklist: [
      { title: 'Submit code in Python or Java', description: 'Upload files or paste code directly into the built-in editor with syntax highlighting.' },
      { title: 'Get instant automated feedback', description: 'See test results, output diffs, and detailed error messages within seconds.' },
      { title: 'Track grades and attempts', description: 'View your submission history, scores, and remaining attempts per assignment.' },
      { title: 'Collaborate on group assignments', description: 'Work with teammates on shared submissions with individual accountability.' },
    ],
  },
  faculty: {
    title: 'Faculty',
    subtitle: 'Create, grade, and monitor with ease.',
    pills: ['Assignment Builder', 'Auto-Grading', 'Analytics', 'Rubric Editor'],
    checklist: [
      { title: 'Build assignments with test suites', description: 'Define test cases, expected outputs, stdin inputs, and weighted scoring criteria.' },
      { title: 'Automated and manual grading', description: 'Let Axiom handle code evaluation while you focus on qualitative feedback.' },
      { title: 'View class-wide analytics', description: 'Monitor submission patterns, grade distributions, and identify struggling students.' },
      { title: 'Export grades to Canvas LMS', description: 'Seamlessly sync graded assignments back to your existing learning management system.' },
    ],
  },
  admin: {
    title: 'Administrator',
    subtitle: 'Manage users, courses, and security.',
    pills: ['User Management', 'Course Oversight', 'Audit Logs', 'System Config'],
    checklist: [
      { title: 'Manage users and roles', description: 'Create, edit, and deactivate accounts with role-based access control.' },
      { title: 'Oversee all courses and sections', description: 'View and manage every course, section, and enrollment across the institution.' },
      { title: 'Review audit trails', description: 'Track all system actions with comprehensive logging for compliance and security.' },
      { title: 'Configure system settings', description: 'Manage platform-wide settings, integrations, and security policies.' },
    ],
  },
};

const tabs: { key: Role; label: string }[] = [
  { key: 'student', label: 'Student' },
  { key: 'faculty', label: 'Faculty' },
  { key: 'admin', label: 'Admin' },
];

export default function LandingRoles() {
  const [active, setActive] = useState<Role>('student');
  const data = rolesData[active];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="roles"
      ref={ref}
      className="py-32"
      style={{ backgroundColor: 'var(--landing-bg)', fontFamily: 'var(--font-body)' }}
    >
      <div className="mx-auto px-8 text-center" style={{ maxWidth: 1100 }}>
        <span
          className="inline-block mb-5"
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--landing-primary)',
          }}
        >
          User Roles
        </span>

        <h2
          className="mb-5"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.12,
            color: 'var(--landing-ink)',
            letterSpacing: '-0.02em',
          }}
        >
          Built for everyone in the classroom.
        </h2>

        <p
          className="mb-12 mx-auto"
          style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--landing-muted)', maxWidth: 480 }}
        >
          Three distinct experiences tailored to each user&apos;s workflow.
        </p>

        {/* Tab switcher */}
        <div
          className="inline-flex rounded-full p-1.5 mb-16"
          style={{
            backgroundColor: 'var(--landing-surface)',
            border: '1px solid var(--landing-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className="rounded-full px-8 py-3 transition-all duration-250 cursor-pointer"
              style={{
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                border: 'none',
                backgroundColor: active === tab.key ? 'var(--landing-primary)' : 'transparent',
                color: active === tab.key ? '#fff' : 'var(--landing-muted)',
                boxShadow: active === tab.key ? '0 2px 8px rgba(123,13,13,0.2)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Two-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
          {/* LEFT — Crimson gradient card */}
          <div
            className="relative flex flex-col items-center justify-center p-12 overflow-hidden"
            style={{
              borderRadius: 22,
              background: 'linear-gradient(160deg, #9E1515 0%, var(--landing-primary) 40%, var(--landing-primary-dark) 100%)',
              minHeight: 380,
            }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                width: 300,
                height: 300,
                bottom: -60,
                right: -60,
                background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
              }}
            />
            <h3
              className="relative mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 38,
                fontWeight: 700,
                color: '#fff',
                textAlign: 'center',
              }}
            >
              {data.title}
            </h3>
            <p
              className="relative mb-10"
              style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.55)',
                textAlign: 'center',
                fontWeight: 400,
              }}
            >
              {data.subtitle}
            </p>
            <div className="relative flex flex-wrap justify-center gap-2.5">
              {data.pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full px-5 py-2"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — Checklist */}
          <div
            className="flex flex-col justify-center p-12"
            style={{
              borderRadius: 22,
              backgroundColor: 'var(--landing-surface)',
              border: '1px solid var(--landing-border)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            }}
          >
            <div className="flex flex-col gap-7">
              {data.checklist.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(123,13,13,0.08)',
                    }}
                  >
                    <CheckCircle2
                      size={18}
                      style={{ color: 'var(--landing-primary)' }}
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <h4
                      className="mb-1.5"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--landing-ink)',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.65,
                        color: 'var(--landing-muted)',
                        fontWeight: 400,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
