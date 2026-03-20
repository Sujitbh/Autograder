'use client';

import { useEffect, useRef } from 'react';
import {
  Code2,
  FlaskConical,
  BrainCircuit,
  Link2,
  Scale,
  BarChart3,
  Users,
  ShieldCheck,
  FileCode2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Code2,
    title: 'Multi-Language Support',
    description: 'Run and evaluate student submissions in Python and Java with extensible language support.',
  },
  {
    icon: FlaskConical,
    title: 'Flexible Test Suites',
    description: 'Define custom test cases with expected outputs, stdin inputs, and weighted scoring.',
  },
  {
    icon: BrainCircuit,
    title: 'AI-Powered Detection',
    description: 'Identify plagiarism and AI-generated code with intelligent pattern analysis.',
  },
  {
    icon: Link2,
    title: 'Canvas Integration',
    description: 'Seamlessly sync courses, rosters, and grades with your existing LMS workflow.',
  },
  {
    icon: Scale,
    title: 'Weighted Rubrics',
    description: 'Create detailed rubrics with percentage-based sections for structured grading.',
  },
  {
    icon: BarChart3,
    title: 'Reporting Dashboard',
    description: 'Export grade reports, view class statistics, and track submission analytics.',
  },
  {
    icon: Users,
    title: 'Group Assignments',
    description: 'Support collaborative projects with group submission and individual accountability.',
  },
  {
    icon: ShieldCheck,
    title: 'Auditable Security',
    description: 'Full audit trails, role-based access control, and secure sandboxed execution.',
  },
  {
    icon: FileCode2,
    title: 'Starter Code & Rubrics',
    description: 'Provide boilerplate code and rubric templates to standardize assignments.',
  },
];

function useScrollReveal() {
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
      { threshold: 0.15 }
    );
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function LandingFeatures() {
  const ref = useScrollReveal();

  return (
    <section
      id="features"
      ref={ref}
      className="py-32"
      style={{ backgroundColor: 'var(--landing-surface)', fontFamily: 'var(--font-body)' }}
    >
      <div className="mx-auto px-8 text-center" style={{ maxWidth: 1200 }}>
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
          Platform Capabilities
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
          Everything grading demands, nothing it doesn&apos;t.
        </h2>

        <p
          className="mb-16 mx-auto"
          style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: 'var(--landing-muted)',
            maxWidth: 520,
          }}
        >
          A comprehensive platform covering every aspect of automated code evaluation and academic integrity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, delay }: { feature: Feature; delay: number }) {
  const Icon = feature.icon;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center p-9 cursor-default group"
      style={{
        backgroundColor: 'var(--landing-bg)',
        borderRadius: 14,
        border: '1px solid var(--landing-border)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(123, 13, 13, 0.07), 0 4px 12px rgba(123, 13, 13, 0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        className="flex items-center justify-center mb-6"
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: 'linear-gradient(135deg, var(--landing-primary) 0%, var(--landing-primary-dark) 100%)',
          boxShadow: '0 4px 12px rgba(123, 13, 13, 0.15)',
        }}
      >
        <Icon size={24} color="#fff" strokeWidth={1.7} />
      </div>

      <h3
        className="mb-2.5"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 17,
          fontWeight: 600,
          color: 'var(--landing-ink)',
        }}
      >
        {feature.title}
      </h3>

      <p
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--landing-muted)',
          fontWeight: 400,
        }}
      >
        {feature.description}
      </p>
    </div>
  );
}
