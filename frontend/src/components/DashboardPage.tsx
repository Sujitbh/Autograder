'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight } from 'lucide-react';

import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import { useAuth } from '@/utils/AuthContext';
import { useStudentFeed, useFacultyFeed } from '@/hooks/queries/useDashboardFeed';
import type {
    StudentDashboardFeed,
    FacultyDashboardFeed,
} from '@/services/api';

import {
    Hero,
    FocusCard,
    KpiCard,
    StudentTodoList,
    FacultyTodoList,
    ActivityTimeline,
    CourseGrid,
    SectionCard,
    GhostButton,
    DashboardSkeleton,
    timeOfDayGreeting,
    eyebrowLine,
    studentSummary,
    facultySummary,
    pickStudentFocus,
    pickFacultyFocus,
    deriveSparkline,
} from './dashboard';

/* ────────────────────────────────────────────────────────────────────────── */
/* Animation helpers                                                           */
/* The .dash-enter class hooks into the theme's keyframes; --dash-stagger     */
/* lets each section fade in 20ms after the one above it.                     */
/* ────────────────────────────────────────────────────────────────────────── */

function stagger(i: number): React.CSSProperties {
    return { ['--dash-stagger' as any]: `${i * 20}ms` };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Student body                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

function StudentDashboardBody({ data }: { data: StudentDashboardFeed }) {
    const router = useRouter();

    const focus = useMemo(() => pickStudentFocus(data), [data]);
    const summary = useMemo(() => studentSummary(data), [data]);

    const firstName = data.greeting.name || 'there';

    return (
        <div className="flex flex-col gap-6">
            <div className="dash-enter" style={stagger(0)}>
                <Hero
                    eyebrow={eyebrowLine('student')}
                    greeting={`${timeOfDayGreeting()}, ${firstName}.`}
                    summary={summary}
                    rightSlot={
                        <FocusCard
                            variant={focus.variant}
                            eyebrow={focus.eyebrow}
                            title={focus.title}
                            hint={focus.hint}
                            cta={focus.href ? 'Open' : undefined}
                            onClick={
                                focus.href ? () => router.push(focus.href!) : undefined
                            }
                        />
                    }
                />
            </div>

            <div
                className="dash-enter grid grid-cols-2 gap-3 lg:grid-cols-4"
                style={stagger(1)}
                aria-label="Key metrics"
            >
                <KpiCard
                    label="Due this week"
                    value={data.stats.due_this_week}
                    tone="warn"
                    sparkline={deriveSparkline(data.stats.due_this_week, 3)}
                    footer={data.stats.due_this_week === 0 ? 'All clear' : undefined}
                />
                <KpiCard
                    label="Missing"
                    value={data.stats.missing}
                    tone="danger"
                    sparkline={deriveSparkline(data.stats.missing, 5)}
                    footer={data.stats.missing === 0 ? 'Nothing overdue' : undefined}
                />
                <KpiCard
                    label="Graded recently"
                    value={data.stats.graded_recently}
                    tone="ok"
                    sparkline={deriveSparkline(data.stats.graded_recently, 7)}
                />
                <KpiCard
                    label="Avg grade"
                    value={
                        data.stats.average_grade == null
                            ? null
                            : `${data.stats.average_grade}%`
                    }
                    tone="info"
                    sparkline={
                        data.stats.average_grade == null
                            ? []
                            : deriveSparkline(data.stats.average_grade, 11)
                    }
                />
            </div>

            {/* Responsive layout:
                  <1024 → single column
                  1024–1279 → two column: todos+activity main, courses sidebar (8/4)
                  ≥1280 → 5/4/3 triptych */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div
                    className="dash-enter lg:col-span-8 xl:col-span-5"
                    style={stagger(2)}
                >
                    <SectionCard
                        id="todo"
                        title="To-Do"
                        action={
                            <GhostButton
                                onClick={() => router.push('/student')}
                                aria-label="View all assignments"
                            >
                                All assignments <ArrowRight className="h-3 w-3" />
                            </GhostButton>
                        }
                    >
                        <StudentTodoList todos={data.todos} />
                    </SectionCard>
                </div>

                <div
                    className="dash-enter lg:col-span-8 lg:col-start-1 xl:col-span-4 xl:col-start-auto"
                    style={stagger(3)}
                >
                    <SectionCard id="activity" title="Recent Activity">
                        <ActivityTimeline items={data.activity} />
                    </SectionCard>
                </div>

                <div
                    className="dash-enter lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 xl:col-span-3 xl:col-start-auto xl:row-span-1 xl:row-start-auto"
                    style={stagger(4)}
                >
                    <SectionCard
                        id="courses"
                        title="My Courses"
                        action={
                            <GhostButton
                                onClick={() => router.push('/student')}
                                aria-label="View all courses"
                            >
                                All <ArrowRight className="h-3 w-3" />
                            </GhostButton>
                        }
                    >
                        <CourseGrid
                            role="student"
                            courses={data.courses}
                            onExplore={() => router.push('/student')}
                        />
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Faculty body                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

function FacultyDashboardBody({ data }: { data: FacultyDashboardFeed }) {
    const router = useRouter();
    const focus = useMemo(() => pickFacultyFocus(data), [data]);
    const summary = useMemo(() => facultySummary(data), [data]);
    const firstName = data.greeting.name || 'there';

    return (
        <div className="flex flex-col gap-6">
            <div className="dash-enter" style={stagger(0)}>
                <Hero
                    eyebrow={eyebrowLine('faculty')}
                    greeting={`${timeOfDayGreeting()}, ${firstName}.`}
                    summary={summary}
                    rightSlot={
                        <FocusCard
                            variant={focus.variant}
                            eyebrow={focus.eyebrow}
                            title={focus.title}
                            hint={focus.hint}
                            cta={focus.href ? 'Open' : undefined}
                            onClick={
                                focus.href ? () => router.push(focus.href!) : undefined
                            }
                        />
                    }
                />
            </div>

            <div
                className="dash-enter grid grid-cols-2 gap-3 lg:grid-cols-4"
                style={stagger(1)}
                aria-label="Key metrics"
            >
                <KpiCard
                    label="To grade"
                    value={data.stats.to_grade}
                    tone="primary"
                    sparkline={deriveSparkline(data.stats.to_grade, 3)}
                />
                <KpiCard
                    label="Drafts"
                    value={data.stats.drafts}
                    tone="info"
                    sparkline={deriveSparkline(data.stats.drafts, 5)}
                />
                <KpiCard
                    label="Closing soon"
                    value={data.stats.closing_soon}
                    tone="warn"
                    sparkline={deriveSparkline(data.stats.closing_soon, 7)}
                />
                <KpiCard
                    label="Students"
                    value={data.stats.total_students}
                    tone="ok"
                    sparkline={deriveSparkline(data.stats.total_students, 11)}
                />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div
                    className="dash-enter lg:col-span-8 xl:col-span-5"
                    style={stagger(2)}
                >
                    <SectionCard
                        id="todo"
                        title="Needs Attention"
                        action={
                            <GhostButton
                                onClick={() => router.push('/courses')}
                                aria-label="View all courses"
                            >
                                All courses <ArrowRight className="h-3 w-3" />
                            </GhostButton>
                        }
                    >
                        <FacultyTodoList todos={data.todos} />
                    </SectionCard>
                </div>

                <div
                    className="dash-enter lg:col-span-8 lg:col-start-1 xl:col-span-4 xl:col-start-auto"
                    style={stagger(3)}
                >
                    <SectionCard id="activity" title="Recent Activity">
                        <ActivityTimeline items={data.activity} />
                    </SectionCard>
                </div>

                <div
                    className="dash-enter lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 xl:col-span-3 xl:col-start-auto xl:row-span-1 xl:row-start-auto"
                    style={stagger(4)}
                >
                    <SectionCard
                        id="courses"
                        title="My Courses"
                        action={
                            <GhostButton
                                onClick={() => router.push('/courses')}
                                aria-label="Open all courses"
                            >
                                All <ArrowRight className="h-3 w-3" />
                            </GhostButton>
                        }
                    >
                        <CourseGrid
                            role="faculty"
                            courses={data.courses}
                            onExplore={() => router.push('/courses')}
                        />
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Error surface                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

function DashboardError({ onRetry }: { onRetry?: () => void }) {
    return (
        <div
            className="flex flex-col items-start gap-3 rounded-[12px] p-5"
            style={{
                background: 'var(--dash-surface-2)',
                boxShadow:
                    'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-soft)',
            }}
        >
            <div
                className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                style={{
                    background: 'var(--dash-danger-tint)',
                    color: 'var(--dash-danger-ink)',
                }}
            >
                <AlertCircle className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5">
                <p
                    className="text-[14px] font-semibold leading-[20px]"
                    style={{ color: 'var(--dash-ink-1)' }}
                >
                    We couldn&apos;t load your dashboard.
                </p>
                <p
                    className="text-[12px] leading-[16px]"
                    style={{ color: 'var(--dash-ink-4)' }}
                >
                    Please refresh the page or try again in a moment.
                </p>
            </div>
            {onRetry && (
                <GhostButton tone="primary" onClick={onRetry}>
                    Try again
                </GhostButton>
            )}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Main export                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
    const { role } = useAuth();
    const isStudent = role === 'student';
    const isFaculty = role === 'faculty' || role === 'admin';

    const studentQuery = useStudentFeed(isStudent);
    const facultyQuery = useFacultyFeed(isFaculty);

    const loading =
        (isStudent && studentQuery.isLoading) ||
        (isFaculty && facultyQuery.isLoading);
    const error =
        (isStudent && studentQuery.isError) ||
        (isFaculty && facultyQuery.isError);

    const refetch = () => {
        if (isStudent) studentQuery.refetch();
        else if (isFaculty) facultyQuery.refetch();
    };

    return (
        <PageLayout>
            <TopNav />
            <main
                className="dash-root mx-auto w-full max-w-[1440px] px-4 py-6 md:px-6 md:py-8"
                aria-labelledby="dashboard-heading"
            >
                {/* Screen-reader-only page heading for a11y landmarks */}
                <h1 id="dashboard-heading" className="sr-only">
                    Dashboard
                </h1>

                {loading ? (
                    <DashboardSkeleton />
                ) : error ? (
                    <DashboardError onRetry={refetch} />
                ) : isStudent && studentQuery.data ? (
                    <StudentDashboardBody data={studentQuery.data} />
                ) : isFaculty && facultyQuery.data ? (
                    <FacultyDashboardBody data={facultyQuery.data} />
                ) : (
                    <div
                        className="rounded-[12px] p-5 text-[13px]"
                        style={{
                            background: 'var(--dash-surface-2)',
                            color: 'var(--dash-ink-3)',
                            boxShadow:
                                'inset 0 0 0 1px var(--dash-ring-subtle)',
                        }}
                    >
                        Dashboard is not available for this account.
                    </div>
                )}
            </main>
        </PageLayout>
    );
}
