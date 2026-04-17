import type { Metadata } from 'next';
import ModernTechLanding from '@/components/landing/ModernTechLanding';

export const metadata: Metadata = {
  title: 'Axiom | Rigorous assessment for ULM Computer Science',
  description:
    'Axiom is ULM Computer Science’s grading platform: less weekend busywork, clearer TA alignment, and faculty authority preserved. Built for courses that process serious submission volume.',
};

export default function LandingPage() {
  return <ModernTechLanding />;
}
