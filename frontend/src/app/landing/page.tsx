import type { Metadata } from 'next';
import ModernTechLanding from '@/components/landing/ModernTechLanding';

export const metadata: Metadata = {
  title: 'Axiom — Elevate Your Code. Simplify Your Grading.',
  description:
    'ULM’s premier automated grading platform for Computer Science. Fast feedback for students, scalable solutions for faculty.',
};

export default function LandingPage() {
  return <ModernTechLanding />;
}
