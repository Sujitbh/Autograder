'use client';

import { useEffect, useRef } from 'react';

const steps = [
  { num: '01', title: 'Faculty Creates Assignment', description: 'Define test cases, rubrics, due dates, and starter code for each assignment.' },
  { num: '02', title: 'Student Submits Code', description: 'Upload or write code directly in the browser with multi-language support.' },
  { num: '03', title: 'Axiom Evaluates', description: 'Automated testing, output comparison, and AI-powered integrity checks run instantly.' },
  { num: '04', title: 'Results Delivered', description: 'Students get instant feedback; faculty see grades, analytics, and reports.' },
];

export default function LandingHowItWorks() {
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
      id="how-it-works"
      ref={ref}
      className="py-32"
      style={{ backgroundColor: 'var(--landing-ink)', fontFamily: 'var(--font-body)' }}
    >
      <div className="mx-auto px-8 text-center" style={{ maxWidth: 1200 }}>
        <span
          className="inline-block mb-5"
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--landing-gold)',
          }}
        >
          How It Works
        </span>

        <h2
          className="mb-5"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.12,
            color: '#fff',
            letterSpacing: '-0.02em',
          }}
        >
          From assignment to grade in four steps.
        </h2>

        <p
          className="mb-20 mx-auto"
          style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.35)', maxWidth: 480 }}
        >
          A streamlined workflow that eliminates manual grading overhead.
        </p>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-0">
          {/* Dashed connector line */}
          <div
            className="hidden md:block absolute"
            style={{
              top: 44,
              left: '16%',
              right: '16%',
              height: 0,
              borderTop: '2px dashed rgba(196,154,60,0.25)',
            }}
          />

          {steps.map((step, i) => (
            <div key={step.num} className="relative flex flex-col items-center text-center px-4">
              {/* Number circle */}
              <div
                className="flex items-center justify-center mb-8"
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  border: '2px solid rgba(196,154,60,0.5)',
                  backgroundColor: 'var(--landing-ink)',
                  position: 'relative',
                  zIndex: 2,
                  boxShadow: '0 0 24px rgba(196,154,60,0.08)',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 30,
                    fontWeight: 700,
                    color: 'var(--landing-gold)',
                  }}
                >
                  {step.num}
                </span>
              </div>

              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute"
                  style={{
                    top: 38,
                    right: -8,
                    color: 'rgba(196,154,60,0.3)',
                    fontSize: 18,
                    zIndex: 3,
                  }}
                >
                  ›
                </div>
              )}

              <h3
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 17,
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: 1.3,
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.35)',
                  fontWeight: 400,
                  maxWidth: 230,
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
