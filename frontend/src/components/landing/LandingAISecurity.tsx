'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight, Scan, ShieldCheck, FlaskConical } from 'lucide-react';

export default function LandingAISecurity() {
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
      id="ai-security"
      ref={ref}
      className="py-32"
      style={{ backgroundColor: 'var(--landing-surface)', fontFamily: 'var(--font-body)' }}
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
          AI &amp; Security
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
          Academic integrity, intelligently enforced.
        </h2>

        <p
          className="mb-16 mx-auto"
          style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--landing-muted)', maxWidth: 520 }}
        >
          Advanced detection and security features built to protect the integrity of every evaluation.
        </p>

        {/* Featured card */}
        <div
          className="relative mb-6 overflow-hidden"
          style={{
            borderRadius: 22,
            background: 'linear-gradient(160deg, #9E1515 0%, var(--landing-primary) 40%, var(--landing-primary-dark) 100%)',
          }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              width: 500,
              height: 500,
              top: -100,
              right: -100,
              background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative flex flex-col items-center justify-center p-14 text-center">
              <div
                className="flex items-center justify-center mb-6"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Scan size={28} color="#fff" strokeWidth={1.5} />
              </div>
              <h3
                className="mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.2,
                }}
              >
                Plagiarism &amp; AI Code Detection
              </h3>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.55)',
                  maxWidth: 380,
                }}
              >
                Intelligent pattern analysis compares submissions against known sources, peer code, and
                AI-generation signatures to flag suspicious work automatically.
              </p>
            </div>

            <div className="relative flex items-center justify-center p-14 gap-5">
              <StatWidget label="Accuracy" value="98.5%" />
              <StatWidget label="Status" value="Active" />
              <StatWidget label="Audit Trail" value="Full" />
            </div>
          </div>
        </div>

        {/* Two regular cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityCard
            icon={ShieldCheck}
            title="Auditable Account Security"
            description="Role-based access control with complete audit logging for every action across the platform."
            items={['Multi-role permission system', 'Session management & timeout', 'Action audit logging']}
          />
          <SecurityCard
            icon={FlaskConical}
            title="Comprehensive Test Evaluation"
            description="Sandboxed code execution with timeout controls, memory limits, and detailed output comparison."
            items={['Isolated execution sandbox', 'Configurable resource limits', 'Output diff & error capture']}
          />
        </div>
      </div>
    </section>
  );
}

function StatWidget({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-7 flex-1"
      style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 26,
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.2,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.4)',
          marginTop: 6,
          fontFamily: 'var(--font-body)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SecurityCard({
  icon: Icon,
  title,
  description,
  items,
}: {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div
      className="flex flex-col items-center text-center p-12"
      style={{
        borderRadius: 22,
        backgroundColor: 'var(--landing-bg)',
        border: '1px solid var(--landing-border)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(123, 13, 13, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        className="flex items-center justify-center mb-6"
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: 'rgba(123,13,13,0.06)',
        }}
      >
        <Icon size={24} color="var(--landing-primary)" strokeWidth={1.7} />
      </div>
      <h3
        className="mb-3"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 19,
          fontWeight: 600,
          color: 'var(--landing-ink)',
        }}
      >
        {title}
      </h3>
      <p
        className="mb-7"
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--landing-muted)',
          maxWidth: 340,
        }}
      >
        {description}
      </p>
      <div className="flex flex-col gap-3 items-center">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2.5" style={{ color: 'var(--landing-ink-soft)' }}>
            <ArrowRight size={14} style={{ color: 'var(--landing-primary)', flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
