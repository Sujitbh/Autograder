'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Zap,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  FileCode2,
  Users,
  Lock,
  Server,
  Activity,
  Quote,
} from 'lucide-react';
import { FloatingCodeBackground } from './FloatingCodeBackground';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const LandingDemoEditor = dynamic(() => import('./LandingDemoEditor'), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[240px] items-center justify-center rounded-lg border text-sm"
      style={{ borderColor: 'var(--landing-border)', color: 'var(--landing-muted)' }}
    >
      Loading editor preview…
    </div>
  ),
});

const features = [
  {
    icon: Zap,
    title: 'Faster feedback loops',
    description:
      'Automated runs against your tests cut the wait between submission and a first signal on correctness.',
    extra:
      'You still decide how results surface to students and when partial credit applies, so the course policy stays yours.',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity you can explain',
    description:
      'Structured workflows make it easier to treat every student consistently and document what happened if a grade is questioned.',
    extra:
      'Similarity and audit-friendly views are there to support your judgment, not to replace a conversation in borderline cases.',
  },
  {
    icon: LayoutDashboard,
    title: 'One place to run the course',
    description:
      'Assignments, queues, rubrics, and records live together so you spend less time reconciling spreadsheets and inboxes.',
    extra:
      'Teaching assistants see what you allow them to see, which helps align grading without you re-explaining the same rules every week.',
  },
];

const pillars = [
  {
    icon: FileCode2,
    label: 'Built for real CS assignments',
    detail:
      'Executables, test harnesses, and the kinds of files students actually submit, not a generic file drop box.',
    extra:
      'Assignment specs stay practical and reproducible across semesters.',
  },
  {
    icon: Users,
    label: 'Roles that match how you teach',
    detail:
      'Faculty own outcomes. TAs work inside boundaries you set. Students get clarity on what is due and what they earned.',
    extra:
      'Permission boundaries reduce rework and keep grading decisions aligned.',
  },
  {
    icon: CheckCircle2,
    label: 'Anchored at ULM',
    detail:
      'Developed with the department in mind: availability, predictable behavior, and room to evolve with the curriculum.',
    extra:
      'Department-specific workflows can evolve without losing consistency.',
  },
];

const daySteps = [
  {
    title: 'Publish the assignment',
    body: 'Set due dates, languages, and tests once. Students see the same requirements you intend.',
  },
  {
    title: 'Submissions arrive in one queue',
    body: 'No more hunting through email attachments. Everything is timestamped and tied to the roster.',
  },
  {
    title: 'Review with context',
    body: 'Auto results, rubric lines, and notes sit side by side so you or a TA can defend the mark quickly.',
  },
  {
    title: 'Release feedback on your schedule',
    body: 'You choose when scores go out, so late policies and regrade windows stay under your control.',
  },
];

const faqItems = [
  {
    q: 'Does Axiom replace faculty judgment?',
    a: 'No. It automates repeatable checks and organizes work so you spend time on judgment calls, not clerical steps. Final responsibility for grades stays with the instructor of record.',
  },
  {
    q: 'Where does student data live?',
    a: 'The platform is operated for ULM Computer Science. Data handling follows institutional policy; access is role-based and intended for educational use only. Your program office can provide the official data governance summary.',
  },
  {
    q: 'How long does onboarding take?',
    a: 'Most faculty can publish a first assignment in a single sitting once their account is active. Larger courses may want a short pilot week to tune rubrics and TA permissions.',
  },
  {
    q: 'What if the system is slow or unavailable?',
    a: 'Like any campus system, you should keep a contingency syllabus statement. The team monitors availability; planned maintenance is communicated when possible.',
  },
];

export default function ModernTechLanding() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 56]);

  return (
    <div
      className="axiom-landing min-h-screen flex flex-col"
      style={{
        fontFamily: 'var(--font-body)',
        backgroundColor: 'var(--landing-bg)',
      }}
    >
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--landing-bg) 92%, transparent)',
          borderColor: 'var(--landing-border)',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5 lg:px-8">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img
              src="/images/axiom-logo.png"
              alt="Axiom"
              width={40}
              height={40}
              className="rounded-full object-contain"
            />
            <div className="hidden min-[380px]:block">
              <span
                className="block text-base font-semibold tracking-tight"
                style={{ color: 'var(--landing-ink)' }}
              >
                Axiom
              </span>
              <span className="block text-[11px] font-medium" style={{ color: 'var(--landing-muted)' }}>
                CS assessment platform
              </span>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Page sections">
            {[
              ['#story', 'Why Axiom'],
              ['#platform', 'Platform'],
              ['#day', 'Workflow'],
              ['#demo', 'Demo'],
              ['#trust', 'Trust'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium no-underline transition-opacity hover:opacity-80"
                style={{ color: 'var(--landing-ink-soft)' }}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/signup"
              className="hidden rounded-lg border px-4 py-2 text-sm font-semibold no-underline transition-colors md:inline"
              style={{
                borderColor: 'var(--landing-border)',
                color: 'var(--landing-ink-soft)',
                backgroundColor: 'var(--landing-surface)',
              }}
            >
              Register
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-md transition-all hover:opacity-95 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                backgroundColor: 'var(--landing-primary)',
                outlineColor: 'var(--landing-primary)',
              }}
            >
              Access Axiom
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section
          ref={heroRef}
          className="relative overflow-hidden px-6 pb-10 pt-14 lg:px-8 lg:pb-14 lg:pt-20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.38]"
            style={{
              backgroundImage:
                'linear-gradient(color-mix(in srgb, var(--landing-primary) 12%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--landing-primary) 12%, transparent) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
            style={{ y: parallaxY }}
            aria-hidden
          >
            <FloatingCodeBackground />
          </motion.div>
          <div
            className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full opacity-[0.1]"
            style={{
              background: 'radial-gradient(circle, var(--landing-primary) 0%, transparent 70%)',
            }}
          />

          <div className="relative mx-auto max-w-4xl text-center">
            <p
              className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: 'var(--landing-primary)' }}
            >
              University of Louisiana Monroe, Computer Science
            </p>
            <h1
              className="mb-6 text-[2.35rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.65rem] lg:leading-[1.06]"
              style={{
                color: 'var(--landing-ink)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Rigorous assessment for computing coursework.
            </h1>
            <p
              className="mx-auto mb-6 max-w-2xl text-lg font-medium sm:text-xl"
              style={{ color: 'var(--landing-primary)' }}
            >
              Tired of losing weekends to hand-running student code? Worried your TAs are grading the
              same bug differently? Axiom removes the tedious steps while you keep academic
              authority.
            </p>
            <p
              className="mx-auto mb-10 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: 'var(--landing-ink-soft)' }}
            >
              Built with faculty input for ULM. One environment for submissions, tests, rubrics, and
              records so you can teach, review, and document grades without juggling a dozen tools.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white no-underline shadow-lg transition-all hover:opacity-95 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
                style={{
                  backgroundColor: 'var(--landing-primary)',
                  boxShadow:
                    '0 14px 40px color-mix(in srgb, var(--landing-primary) 36%, transparent)',
                  outlineColor: 'var(--landing-primary)',
                }}
              >
                Access Axiom
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-xl border-2 px-8 py-3.5 text-base font-semibold no-underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
                style={{
                  borderColor: 'var(--landing-border)',
                  color: 'var(--landing-ink)',
                  backgroundColor: 'var(--landing-surface)',
                  outlineColor: 'var(--landing-ink-soft)',
                }}
              >
                Register for access
              </Link>
            </div>
          </div>
        </section>

        <section
          id="story"
          className="scroll-mt-24 border-t px-6 py-14 lg:px-8 lg:py-16"
          style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <Quote className="mx-auto mb-4 h-10 w-10 opacity-30" style={{ color: 'var(--landing-primary)' }} />
            <h2
              className="mb-4 text-2xl font-semibold sm:text-3xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--landing-ink)' }}
            >
              Built for faculty
            </h2>
            <p className="text-base leading-relaxed sm:text-lg" style={{ color: 'var(--landing-ink-soft)' }}>
              Axiom exists because instructors asked for a serious tool, not a toy. The point is to
              protect your time, tighten fairness, and give students faster, clearer feedback, without
              pretending that algorithms can replace professional judgment.
            </p>
          </div>
        </section>

        <section
          id="platform"
          className="scroll-mt-24 border-t px-6 py-14 lg:px-8 lg:py-16"
          style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-bg)' }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-2xl">
              <p
                className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: 'var(--landing-primary)' }}
              >
                Platform
              </p>
              <h2
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--landing-ink)' }}
              >
                Operational efficiency that respects your oversight
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {pillars.map(({ icon: Icon, label, detail, extra }) => (
                <div
                  key={label}
                  className="group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    borderColor: 'var(--landing-border)',
                    backgroundColor: 'var(--landing-surface)',
                  }}
                >
                  <div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-colors group-hover:opacity-90"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--landing-primary) 12%, transparent)',
                      color: 'var(--landing-primary)',
                    }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold" style={{ color: 'var(--landing-ink)' }}>
                    {label}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--landing-muted)' }}>
                    {detail}
                  </p>
                  <p
                    className="mt-3 max-h-0 overflow-hidden text-sm leading-relaxed opacity-0 transition-all duration-300 group-hover:max-h-28 group-hover:opacity-100"
                    style={{ color: 'var(--landing-gold)' }}
                  >
                    {extra}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-24 border-t px-6 py-16 lg:px-8 lg:py-20"
          style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p
                className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: 'var(--landing-primary)' }}
              >
                Capabilities
              </p>
              <h2
                className="mb-4 text-2xl font-semibold tracking-tight sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--landing-ink)' }}
              >
                What changes when Axiom is in the loop
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--landing-muted)' }}>
                Hover a card to see how each capability shows up in day-to-day teaching.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description, extra }) => (
                <div
                  key={title}
                  className="group rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    borderColor: 'var(--landing-border)',
                    backgroundColor: 'var(--landing-bg)',
                    boxShadow:
                      '0 2px 12px color-mix(in srgb, var(--landing-ink) 8%, transparent)',
                  }}
                >
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--landing-primary) 12%, transparent)',
                      color: 'var(--landing-primary)',
                    }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold" style={{ color: 'var(--landing-ink)' }}>
                    {title}
                  </h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: 'var(--landing-muted)' }}>
                    {description}
                  </p>
                  <p
                    className="max-h-0 overflow-hidden text-[15px] leading-relaxed opacity-0 transition-all duration-300 group-hover:max-h-40 group-hover:pt-3 group-hover:opacity-100"
                    style={{ color: 'var(--landing-ink-soft)' }}
                  >
                    {extra}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="day"
          className="scroll-mt-24 border-t px-6 py-16 lg:px-8 lg:py-20"
          style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-bg)' }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p
                className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: 'var(--landing-primary)' }}
              >
                A day in the life
              </p>
              <h2
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--landing-ink)' }}
              >
                From publish to grade release
              </h2>
            </div>
            <ol className="relative grid gap-8 md:grid-cols-2 md:gap-10">
              <div
                className="absolute left-[1.15rem] top-3 hidden h-[calc(100%-1.5rem)] w-px md:block"
                style={{ backgroundColor: 'var(--landing-border)' }}
                aria-hidden
              />
              {daySteps.map((step, i) => (
                <li key={step.title} className="relative flex gap-4 md:pl-0">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: 'var(--landing-primary)' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold" style={{ color: 'var(--landing-ink)' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--landing-muted)' }}>
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="demo"
          className="scroll-mt-24 border-t px-6 py-16 lg:px-8 lg:py-20"
          style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <p
                className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: 'var(--landing-primary)' }}
              >
                Live-style preview
              </p>
              <h2
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--landing-ink)' }}
              >
                See the editor students recognize
              </h2>
              <p className="mt-3 text-base" style={{ color: 'var(--landing-muted)' }}>
                Read-only sample. The full product uses your course configuration and permissions.
              </p>
            </div>
            <div
              className="overflow-hidden rounded-xl border shadow-xl"
              style={{ borderColor: 'var(--landing-border)' }}
            >
              <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{ backgroundColor: 'var(--landing-bg)' }}
              >
                <span className="h-3 w-3 rounded-full bg-red-400/90" />
                <span className="h-3 w-3 rounded-full bg-amber-400/90" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
                <span className="ml-3 text-xs font-medium" style={{ color: 'var(--landing-muted)' }}>
                  submission_preview.py
                </span>
              </div>
              <LandingDemoEditor />
            </div>
          </div>
        </section>

        <section
          id="register"
          className="scroll-mt-24 border-t px-6 py-14 lg:px-8 lg:py-16"
          style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-bg)' }}
        >
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-2 text-center text-2xl font-semibold sm:text-3xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--landing-ink)' }}
            >
              Registration at a glance
            </h2>
            <p className="mb-10 text-center text-sm" style={{ color: 'var(--landing-muted)' }}>
              Three straightforward steps. Actual screens may vary slightly by role.
            </p>
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              {['Create your account', 'Confirm role and profile', 'Join or create a course'].map(
                (label, i, arr) => (
                  <div key={label} className="flex flex-1 flex-col items-center text-center">
                    <div className="flex w-full items-center md:flex-col md:gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                        style={{ backgroundColor: 'var(--landing-primary)' }}
                      >
                        {i + 1}
                      </div>
                      {i < arr.length - 1 && (
                        <div
                          className="mx-2 hidden h-px flex-1 md:mx-0 md:mt-0 md:h-8 md:w-px md:shrink-0"
                          style={{ backgroundColor: 'var(--landing-border)' }}
                          aria-hidden
                        />
                      )}
                    </div>
                    <p
                      className="mt-3 text-sm font-semibold sm:text-base"
                      style={{ color: 'var(--landing-ink)' }}
                    >
                      {label}
                    </p>
                  </div>
                ),
              )}
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white no-underline shadow-md transition-opacity hover:opacity-95"
                style={{ backgroundColor: 'var(--landing-primary)' }}
              >
                Start registration
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="trust"
          className="scroll-mt-24 border-t px-6 py-16 lg:px-8 lg:py-20"
          style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}
        >
          <div className="mx-auto max-w-6xl">
            <h2
              className="mb-10 text-center text-2xl font-semibold sm:text-3xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--landing-ink)' }}
            >
              Trust, security, and privacy
            </h2>
            <div className="mb-12 grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Lock,
                  title: 'Encryption in transit',
                  text: 'Browser traffic is protected with modern TLS in line with campus standards.',
                },
                {
                  icon: Server,
                  title: 'Institutional hosting',
                  text: 'Operated for ULM Computer Science so data stays in your educational context.',
                },
                {
                  icon: Activity,
                  title: 'Reliability mindset',
                  text: 'Target 99.9% availability during instructional weeks, excluding announced work.',
                },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border p-6 text-center"
                  style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-bg)' }}
                >
                  <Icon
                    className="mx-auto mb-3 h-8 w-8"
                    style={{ color: 'var(--landing-primary)' }}
                    strokeWidth={1.5}
                  />
                  <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--landing-ink)' }}>
                    {title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--landing-muted)' }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
            <div
              className="rounded-2xl border p-6 sm:p-8"
              style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-bg)' }}
            >
              <div className="flex flex-wrap items-center gap-4">
                <ShieldCheck className="h-10 w-10 shrink-0" style={{ color: 'var(--landing-primary)' }} />
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--landing-ink)' }}>
                    Data privacy commitments (summary)
                  </h3>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-sm" style={{ color: 'var(--landing-ink-soft)' }}>
                    <li>Access is limited by role; students see their work, not their classmates&apos;.</li>
                    <li>Administrative exports should follow FERPA training and departmental policy.</li>
                    <li>Contact your program office for the official retention and subprocessors list.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="scroll-mt-24 border-t px-6 py-16 lg:px-8 lg:py-20"
          style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-bg)' }}
        >
          <div className="mx-auto max-w-3xl">
            <h2
              className="mb-8 text-center text-2xl font-semibold sm:text-3xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--landing-ink)' }}
            >
              Frequently asked questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full rounded-xl border px-4"
              style={{
                borderColor: 'var(--landing-border)',
                backgroundColor: 'var(--landing-surface)',
              }}
            >
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`item-${i}`}
                  className="border-b"
                  style={{ borderColor: 'var(--landing-border)' }}
                >
                  <AccordionTrigger className="text-left text-base hover:no-underline" style={{ color: 'var(--landing-ink)' }}>
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent style={{ color: 'var(--landing-ink-soft)' }}>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section
          className="border-t px-6 py-14 lg:px-8"
          style={{
            borderColor: 'var(--landing-border)',
            backgroundColor: 'var(--landing-primary-dark)',
            color: 'rgba(255,255,255,0.92)',
          }}
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
              Ready to reclaim your grading time?
            </h2>
            <p className="max-w-xl text-base opacity-90">
              Access Axiom if you already have an account, or register to get started with the department
              workflow.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold no-underline transition-opacity hover:opacity-95"
                style={{ color: 'var(--landing-primary-dark)' }}
              >
                Access Axiom
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white no-underline transition-opacity hover:opacity-90"
              >
                Register
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer
        className="border-t"
        style={{
          borderColor: 'var(--landing-border)',
          backgroundColor: 'var(--landing-contrast-bg)',
          color: 'rgba(255,255,255,0.72)',
        }}
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3 lg:px-8">
          <div>
            <p className="mb-2 text-sm font-semibold text-white">Axiom</p>
            <p className="text-sm leading-relaxed">
              In-house assessment tooling for the ULM Department of Computer Science. Built around
              faculty oversight, grading you can justify, and integrity as part of normal operations.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/90">Access</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-white/75 no-underline hover:text-white">
                  Access Axiom
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-white/75 no-underline hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/90">
              Institution
            </p>
            <p className="text-sm leading-relaxed">
              University of Louisiana Monroe
              <br />
              <a
                href="mailto:support@ulm.edu"
                className="mt-2 inline-block font-medium text-white no-underline hover:underline"
              >
                support@ulm.edu
              </a>
            </p>
          </div>
        </div>
        <div
          className="border-t px-6 py-5 text-center text-xs lg:px-8"
          style={{ borderColor: 'rgba(255,255,255,0.12)' }}
        >
          © {new Date().getFullYear()} University of Louisiana Monroe. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
