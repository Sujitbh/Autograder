'use client';

import { CheckCircle2, XCircle, Clock, Terminal } from 'lucide-react';
import { useEffect, useRef } from 'react';

const stats = [
  { value: '3', label: 'User Roles' },
  { value: 'Python + Java', label: 'Languages Supported' },
  { value: 'AI-Powered', label: 'Integrity Detection' },
];


export default function LandingHero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        fontFamily: 'var(--font-body)',
        paddingTop: 73,
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1A1410 0%, #241A14 50%, #1A1410 100%)',
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div
        className="relative z-10 mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-8 px-8 sm:px-12 lg:px-16"
        style={{ maxWidth: 1280, minHeight: 'calc(100vh - 73px)', paddingTop: 80, paddingBottom: 80 }}
      >
        {/* LEFT — Text content */}
        <div className="flex-1 flex flex-col items-start max-w-[560px]">
          {/* Brand + Headline */}
          <h1 className="mb-6">
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 52,
                fontWeight: 700,
                color: 'var(--landing-gold)',
                display: 'block',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Axiom
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 52,
                fontWeight: 700,
                color: '#fff',
                display: 'block',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginTop: 4,
              }}
            >
              Automated Grading,{' '}
              <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>Simplified.</em>
            </span>
          </h1>

          {/* Description */}
          <p
            className="mb-10"
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.45)',
              maxWidth: 440,
              fontWeight: 400,
            }}
          >
            The code evaluation platform for the University of Louisiana Monroe — automated testing, AI-powered integrity checks, and instant feedback.
          </p>

          {/* Two CTA buttons */}
          <div className="flex items-center gap-4 mb-16">
            <a
              href="/login"
              className="inline-flex items-center rounded-full px-8 py-3.5 no-underline transition-all duration-300"
              style={{
                backgroundColor: 'var(--landing-primary)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 16px rgba(123,13,13,0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--landing-primary-light)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(123,13,13,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--landing-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(123,13,13,0.3)';
              }}
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 no-underline transition-all duration-300"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: 15,
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
              }}
            >
              Sign Up
            </a>
          </div>

          {/* Stats row */}
          <div className="flex items-start gap-0">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-start"
                style={{
                  paddingRight: i < stats.length - 1 ? 32 : 0,
                  marginRight: i < stats.length - 1 ? 32 : 0,
                  borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.2,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.3)',
                    marginTop: 4,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Product mockup */}
        <div className="flex-1 flex items-center justify-center">
          <ProductMockup />
        </div>
      </div>
    </section>
  );
}

function ProductMockup() {
  return (
    <div
      className="w-full max-w-[520px]"
      style={{
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-5 py-3.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(0,0,0,0.15)' }}
      >
        <span className="rounded-full" style={{ width: 10, height: 10, backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <span className="rounded-full" style={{ width: 10, height: 10, backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <span className="rounded-full" style={{ width: 10, height: 10, backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <span
          className="ml-3 rounded-md flex-1 text-center"
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.3)',
            backgroundColor: 'rgba(255,255,255,0.04)',
            padding: '4px 0',
            fontFamily: 'var(--font-body)',
          }}
        >
          axiom — Assignment #3: Binary Search
        </span>
      </div>

      {/* Code editor section */}
      <div className="px-5 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            solution.py
          </span>
          <span
            className="ml-auto rounded-full px-2 py-0.5"
            style={{ fontSize: 10, color: 'var(--landing-gold)', backgroundColor: 'rgba(196,154,60,0.1)', fontWeight: 600 }}
          >
            Python
          </span>
        </div>
        <pre
          className="leading-relaxed"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
            overflow: 'hidden',
          }}
        >
          <code>
            <Line n={1}><K>def</K> <F>binary_search</F>(arr, target):</Line>
            <Line n={2}>    lo, hi = <N>0</N>, <F>len</F>(arr) - <N>1</N></Line>
            <Line n={3}>    <K>while</K> lo &lt;= hi:</Line>
            <Line n={4}>        mid = (lo + hi) // <N>2</N></Line>
            <Line n={5}>        <K>if</K> arr[mid] == target:</Line>
            <Line n={6}>            <K>return</K> mid</Line>
            <Line n={7}>        <K>elif</K> arr[mid] &lt; target:</Line>
            <Line n={8}>            lo = mid + <N>1</N></Line>
            <Line n={9}>        <K>else</K>:</Line>
            <Line n={10}>            hi = mid - <N>1</N></Line>
            <Line n={11}>    <K>return</K> -<N>1</N></Line>
          </code>
        </pre>
      </div>

      {/* Test results */}
      <div className="px-5 py-4" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Test Results
          </span>
          <span
            className="rounded-full px-2.5 py-1"
            style={{ fontSize: 11, fontWeight: 600, color: '#4ade80', backgroundColor: 'rgba(74,222,128,0.1)' }}
          >
            5/5 Passed
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <TestRow label="Basic search — found" status="pass" time="2ms" />
          <TestRow label="Element not in array" status="pass" time="1ms" />
          <TestRow label="Empty array edge case" status="pass" time="1ms" />
          <TestRow label="First element target" status="pass" time="1ms" />
          <TestRow label="Large array (10k items)" status="pass" time="4ms" />
        </div>
      </div>

      {/* Bottom score bar */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(0,0,0,0.2)' }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} style={{ color: '#4ade80' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            All tests passed
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
            Score
          </span>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            100
          </span>
        </div>
      </div>
    </div>
  );
}

function TestRow({ label, status, time }: { label: string; status: 'pass' | 'fail'; time: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-3 py-2"
      style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
    >
      {status === 'pass' ? (
        <CheckCircle2 size={14} style={{ color: '#4ade80', flexShrink: 0 }} />
      ) : (
        <XCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
      )}
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)', fontWeight: 500, flex: 1 }}>
        {label}
      </span>
      <div className="flex items-center gap-1">
        <Clock size={10} style={{ color: 'rgba(255,255,255,0.2)' }} />
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}>{time}</span>
      </div>
    </div>
  );
}

function Line({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex">
      <span style={{ width: 28, textAlign: 'right', color: 'rgba(255,255,255,0.15)', marginRight: 16, userSelect: 'none', fontSize: 12 }}>{n}</span>
      <span>{children}</span>
    </div>
  );
}

function K({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--landing-primary-light)' }}>{children}</span>;
}

function F({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--landing-gold)' }}>{children}</span>;
}

function N({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#7dd3fc' }}>{children}</span>;
}
