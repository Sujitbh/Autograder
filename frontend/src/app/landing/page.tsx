import type { Metadata } from 'next';
import LandingNav from '@/components/landing/LandingNav';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingRoles from '@/components/landing/LandingRoles';
import LandingHowItWorks from '@/components/landing/LandingHowItWorks';
import LandingAISecurity from '@/components/landing/LandingAISecurity';
import LandingCTA from '@/components/landing/LandingCTA';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Axiom — Automated Grading System',
  description:
    'Axiom is the automated grading platform for the University of Louisiana Monroe — streamlining code evaluation for students, faculty, and administrators.',
};

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--landing-bg)', scrollBehavior: 'smooth' }}>
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingRoles />
        <LandingHowItWorks />
        <LandingAISecurity />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
