'use client';

import { useEffect, useRef } from 'react';

export default function LandingCTA() {
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
      { threshold: 0.2 }
    );
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #9E1515 0%, var(--landing-primary) 35%, var(--landing-primary-dark) 70%, #3D0606 100%)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(196,154,60,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto px-8 text-center" style={{ maxWidth: 720 }}>
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
          Join Now
        </span>

        <h2
          className="mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.1,
            color: '#fff',
            letterSpacing: '-0.02em',
          }}
        >
          Ready to transform how you grade code?
        </h2>

        <p
          className="mb-10"
          style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          Axiom brings automated evaluation, AI-powered integrity checks, and instant feedback to every classroom.
        </p>

        {/* CTA button */}
        <a
          href="/login"
          className="inline-flex items-center rounded-full px-10 py-4 no-underline transition-all duration-300"
          style={{
            backgroundColor: '#fff',
            color: 'var(--landing-primary)',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.01em',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
          }}
        >
          Sign In / Sign Up
        </a>
      </div>
    </section>
  );
}
