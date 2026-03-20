'use client';

import { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Roles', href: '#roles' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'AI & Security', href: '#ai-security' },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bgColor = scrolled ? 'rgba(250, 248, 245, 0.95)' : 'rgba(26, 20, 16, 0.6)';
  const textColor = scrolled ? 'var(--landing-ink-soft)' : 'rgba(255,255,255,0.7)';
  const textHover = scrolled ? 'var(--landing-primary)' : '#fff';
  const logoColor = scrolled ? 'var(--landing-ink)' : '#fff';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: bgColor,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid var(--landing-border)' : '1px solid transparent',
        fontFamily: 'var(--font-body)',
        boxShadow: scrolled ? '0 1px 12px rgba(123,13,13,0.05)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <div className="mx-auto flex items-center justify-between px-8 lg:px-16 py-4" style={{ maxWidth: 1280 }}>
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 no-underline">
          <div
            className="flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--landing-primary) 0%, var(--landing-primary-dark) 100%)',
              boxShadow: '0 2px 8px rgba(123,13,13,0.2)',
            }}
          >
            <GraduationCap size={21} color="#fff" strokeWidth={1.7} />
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 700,
              color: logoColor,
              letterSpacing: '-0.01em',
              transition: 'color 0.4s ease',
            }}
          >
            Axiom
          </span>
        </a>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="no-underline"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 500,
                color: textColor,
                letterSpacing: '0.01em',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = textHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Sign In */}
        <a
          href="/login"
          className="hidden md:inline-flex items-center rounded-full px-7 py-2.5 no-underline transition-all duration-300"
          style={{
            backgroundColor: 'var(--landing-primary)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.01em',
            boxShadow: '0 2px 8px rgba(123,13,13,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--landing-primary-light)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(123, 13, 13, 0.3)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--landing-primary)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(123,13,13,0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Sign In
        </a>
      </div>
    </nav>
  );
}
