'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock,
    FileText,
    MessageSquare,
    GraduationCap,
    AlertTriangle,
    Inbox,
    BookOpen,
    Users,
    ChevronRight,
} from 'lucide-react';
import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import { useAuth } from '@/utils/AuthContext';
import { useStudentFeed, useFacultyFeed } from '@/hooks/queries/useDashboardFeed';
import type {
    StudentDashboardFeed,
    FacultyDashboardFeed,
    StudentTodoItem,
    FacultyTodoItem,
    DashboardActivityItem,
} from '@/services/api';

/* ── Utilities ───────────────────────────────────────────────────────── */

function timeOfDayGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function formatDayHeader(iso: string): string {
    const d = new Date(iso);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const that = new Date(d);
    that.setHours(0, 0, 0, 0);
    const diff = Math.round((that.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
    if (diff > 1 && diff <= 6) {
        return d.toLocaleDateString(undefined, { weekday: 'long' });
    }
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function courseColor(courseId: number | null | undefined): string {
    // Deterministic pill color per course, pulled from a small themed palette
    // so two adjacent course chips are visually distinguishable.
    const palette = [
        '#6B0000',
        '#0F766E',
        '#1D4ED8',
        '#B45309',
        '#6D28D9',
        '#BE185D',
    ];
    if (!courseId) return palette[0];
    return palette[Math.abs(courseId) % palette.length];
}

function groupByDay<T extends { at: string | null }>(
    items: T[],
): Array<{ day: string; items: T[] }> {
    const buckets = new Map<string, T[]>();
    items.forEach((it) => {
        if (!it.at) return;
        const d = new Date(it.at);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        const list = buckets.get(key);
        if (list) {
            list.push(it);
        } else {
            buckets.set(key, [it]);
        }
    });
    return Array.from(buckets.entries())
        .map(([, arr]) => ({ day: arr[0].at!, items: arr }))
        .sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime());
}

/* ── Small reusable atoms ────────────────────────────────────────────── */

function StatChip({
    label,
    value,
    tone,
    icon,
}: {
    label: string;
    value: React.ReactNode;
    tone: 'primary' | 'warn' | 'ok' | 'info';
    icon: React.ReactNode;
}) {
    const toneMap = {
        primary: { bg: 'rgba(107,0,0,.08)', fg: '#6B0000', border: 'rgba(107,0,0,.2)' },
        warn: { bg: 'rgba(180,83,9,.08)', fg: '#B45309', border: 'rgba(180,83,9,.2)' },
        ok: { bg: 'rgba(22,163,74,.08)', fg: '#15803D', border: 'rgba(22,163,74,.2)' },
        info: { bg: 'rgba(29,78,216,.08)', fg: '#1D4ED8', border: 'rgba(29,78,216,.2)' },
    } as const;
    const t = toneMap[tone];
    return (
        <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.fg }}
        >
            <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: 'rgba(255,255,255,.75)', color: t.fg }}
            >
                {icon}
            </div>
            <div className="leading-tight">
                <div className="text-[11px] font-semibold uppercase tracking-wide opacity-75">
                    {label}
                </div>
                <div className="text-xl font-bold">{value}</div>
            </div>
        </div>
    );
}

function CoursePill({
    course,
}: {
    course: { id: number; name: string; code: string } | null | undefined;
}) {
    if (!course) return null;
    const color = courseColor(course.id);
    return (
        <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: `${color}14`, color, border: `1px solid ${color}33` }}
        >
            <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: color }}
                aria-hidden
            />
            {course.code}
        </span>
    );
}

function HeroStrip({
    greeting,
    stats,
}: {
    greeting: { name: string; role: string };
    stats: React.ReactNode;
}) {
    return (
        <div
            className="rounded-2xl p-5 md:p-6"
            style={{
                background:
                    'linear-gradient(135deg, rgba(107,0,0,.08) 0%, rgba(107,0,0,.02) 100%)',
                border: '1px solid var(--color-border)',
            }}
        >
            <div className="flex flex-col gap-1 mb-4">
                <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-light)' }}
                >
                    {new Date().toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                    })}
                </p>
                <h1
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: 'var(--color-text-dark)' }}
                >
                    {timeOfDayGreeting()}, {greeting.name}
                </h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{stats}</div>
        </div>
    );
}

/* ── Todo rows ───────────────────────────────────────────────────────── */

function TodoEntry({
    icon,
    title,
    subtitle,
    course,
    rightLabel,
    rightTone = 'primary',
    onClick,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string | null;
    course?: { id: number; name: string; code: string } | null;
    rightLabel: string;
    rightTone?: 'primary' | 'warn' | 'ok' | 'info';
    onClick?: () => void;
}) {
    const toneColor: Record<string, string> = {
        primary: '#6B0000',
        warn: '#B45309',
        ok: '#15803D',
        info: '#1D4ED8',
    };
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-lg border bg-transparent px-3 py-2.5 text-left transition-colors hover:bg-[rgba(107,0,0,.04)]"
            style={{ borderColor: 'var(--color-border)' }}
        >
            <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                style={{ background: 'rgba(107,0,0,.06)', color: '#6B0000' }}
            >
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span
                        className="truncate text-sm font-semibold"
                        style={{ color: 'var(--color-text-dark)' }}
                    >
                        {title}
                    </span>
                    <CoursePill course={course ?? null} />
                </div>
                {subtitle && (
                    <div
                        className="mt-0.5 truncate text-[11px]"
                        style={{ color: 'var(--color-text-light)' }}
                    >
                        {subtitle}
                    </div>
                )}
            </div>
            <span
                className="whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={{
                    background: `${toneColor[rightTone]}14`,
                    color: toneColor[rightTone],
                    border: `1px solid ${toneColor[rightTone]}33`,
                }}
            >
                {rightLabel}
            </span>
        </button>
    );
}

function StudentTodoList({ todos }: { todos: StudentTodoItem[] }) {
    const router = useRouter();
    if (todos.length === 0) {
        return <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} label="You're all caught up." />;
    }
    return (
        <div className="flex flex-col gap-2">
            {todos.map((t, i) => {
                if (t.kind === 'graded') {
                    const pct =
                        t.score != null && t.max_score && t.max_score > 0
                            ? Math.round((t.score / t.max_score) * 100)
                            : null;
                    return (
                        <TodoEntry
                            key={`graded-${t.submission_id}-${i}`}
                            icon={<GraduationCap className="h-4 w-4" />}
                            title={t.title}
                            subtitle={
                                t.graded_at ? `Graded ${formatDayHeader(t.graded_at)}` : 'Recently graded'
                            }
                            course={t.course}
                            rightLabel={
                                pct != null
                                    ? `${pct}%`
                                    : t.score != null && t.max_score
                                    ? `${t.score}/${t.max_score}`
                                    : 'Graded'
                            }
                            rightTone={pct == null ? 'info' : pct >= 90 ? 'ok' : pct >= 50 ? 'warn' : 'primary'}
                            onClick={() => {
                                if (t.course) {
                                    router.push(
                                        `/courses/${t.course.id}/assignments/${t.assignment_id}/view`,
                                    );
                                }
                            }}
                        />
                    );
                }
                const isMissing = t.kind === 'missing';
                const due = t.due_date ? formatDayHeader(t.due_date) : '—';
                return (
                    <TodoEntry
                        key={`${t.kind}-${t.assignment_id}-${i}`}
                        icon={
                            isMissing ? (
                                <AlertTriangle className="h-4 w-4" />
                            ) : (
                                <Clock className="h-4 w-4" />
                            )
                        }
                        title={t.title}
                        subtitle={isMissing ? `Missing — was due ${due}` : `Due ${due}`}
                        course={t.course}
                        rightLabel={isMissing ? 'Missing' : due}
                        rightTone={isMissing ? 'primary' : 'warn'}
                        onClick={() => {
                            if (t.course) {
                                router.push(
                                    `/courses/${t.course.id}/assignments/${t.assignment_id}/view`,
                                );
                            }
                        }}
                    />
                );
            })}
        </div>
    );
}

function FacultyTodoList({ todos }: { todos: FacultyTodoItem[] }) {
    const router = useRouter();
    if (todos.length === 0) {
        return <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} label="Nothing needs your attention right now." />;
    }
    return (
        <div className="flex flex-col gap-2">
            {todos.map((t, i) => {
                if (t.kind === 'to_grade') {
                    return (
                        <TodoEntry
                            key={`grade-${t.assignment_id}-${i}`}
                            icon={<ClipboardList className="h-4 w-4" />}
                            title={t.title}
                            subtitle={`${t.count} submission${t.count === 1 ? '' : 's'} waiting`}
                            course={t.course}
                            rightLabel={`${t.count} to grade`}
                            rightTone="primary"
                            onClick={() => {
                                if (t.course) {
                                    router.push(`/courses/${t.course.id}/grading`);
                                }
                            }}
                        />
                    );
                }
                if (t.kind === 'draft') {
                    return (
                        <TodoEntry
                            key={`draft-${t.assignment_id}-${i}`}
                            icon={<FileText className="h-4 w-4" />}
                            title={t.title}
                            subtitle="Draft — not published yet"
                            course={t.course}
                            rightLabel="Draft"
                            rightTone="info"
                            onClick={() => {
                                if (t.course) {
                                    router.push(
                                        `/courses/${t.course.id}/assignments/${t.assignment_id}`,
                                    );
                                }
                            }}
                        />
                    );
                }
                const due = t.due_date ? formatDayHeader(t.due_date) : '—';
                return (
                    <TodoEntry
                        key={`closing-${t.assignment_id}-${i}`}
                        icon={<Clock className="h-4 w-4" />}
                        title={t.title}
                        subtitle={`Closes ${due}`}
                        course={t.course}
                        rightLabel={due}
                        rightTone="warn"
                        onClick={() => {
                            if (t.course) {
                                router.push(
                                    `/courses/${t.course.id}/assignments/${t.assignment_id}`,
                                );
                            }
                        }}
                    />
                );
            })}
        </div>
    );
}

/* ── Activity feed ───────────────────────────────────────────────────── */

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center"
            style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-light)',
            }}
        >
            <div className="mb-1">{icon}</div>
            <div className="text-xs">{label}</div>
        </div>
    );
}

function ActivityIcon({ kind }: { kind: DashboardActivityItem['kind'] }) {
    if (kind === 'grade' || kind === 'graded')
        return <GraduationCap className="h-4 w-4" />;
    if (kind === 'assignment') return <CalendarDays className="h-4 w-4" />;
    if (kind === 'submission') return <Inbox className="h-4 w-4" />;
    return <MessageSquare className="h-4 w-4" />;
}

function ActivityFeed({ items }: { items: DashboardActivityItem[] }) {
    const router = useRouter();
    const grouped = useMemo(() => groupByDay(items), [items]);
    if (grouped.length === 0) {
        return <EmptyState icon={<Inbox className="h-5 w-5" />} label="No recent activity yet." />;
    }
    return (
        <div className="flex flex-col gap-4">
            {grouped.map((bucket) => (
                <div key={bucket.day}>
                    <div
                        className="mb-2 text-[11px] font-bold uppercase tracking-wide"
                        style={{ color: 'var(--color-text-light)' }}
                    >
                        {formatDayHeader(bucket.day)}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {bucket.items.map((it, i) => (
                            <button
                                type="button"
                                key={`${it.kind}-${i}`}
                                onClick={() => it.link && router.push(it.link)}
                                className="flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[rgba(107,0,0,.04)]"
                            >
                                <div
                                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                                    style={{
                                        background: 'rgba(107,0,0,.08)',
                                        color: '#6B0000',
                                    }}
                                >
                                    <ActivityIcon kind={it.kind} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="truncate text-sm font-semibold"
                                            style={{ color: 'var(--color-text-dark)' }}
                                        >
                                            {it.title}
                                        </span>
                                        <CoursePill course={it.course} />
                                    </div>
                                    {it.subtitle && (
                                        <div
                                            className="truncate text-[11px]"
                                            style={{ color: 'var(--color-text-light)' }}
                                        >
                                            {it.subtitle}
                                        </div>
                                    )}
                                </div>
                                {it.at && (
                                    <span
                                        className="whitespace-nowrap text-[10px] font-medium"
                                        style={{ color: 'var(--color-text-light)' }}
                                    >
                                        {formatTime(it.at)}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Course strip ────────────────────────────────────────────────────── */

function CourseStrip({
    role,
    courses,
}: {
    role: 'student' | 'faculty';
    courses: Array<
        | { id: number; name: string; code: string; assignments_count: number; completed_count: number; average_score: number | null }
        | { id: number; name: string; code: string; student_count: number; published_count: number; draft_count: number }
    >;
}) {
    const router = useRouter();
    if (courses.length === 0) {
        return (
            <EmptyState
                icon={<BookOpen className="h-5 w-5" />}
                label={role === 'faculty' ? 'No courses yet.' : 'You are not enrolled in any courses yet.'}
            />
        );
    }
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => {
                const color = courseColor(c.id);
                return (
                    <button
                        key={c.id}
                        type="button"
                        onClick={() => router.push(`/courses/${c.id}`)}
                        className="flex flex-col overflow-hidden rounded-xl text-left transition-shadow hover:shadow-sm"
                        style={{ border: '1px solid var(--color-border)' }}
                    >
                        <div
                            style={{
                                background: color,
                                height: 48,
                                padding: '10px 12px',
                                color: 'white',
                            }}
                        >
                            <div className="text-[11px] font-bold uppercase tracking-wider opacity-90">
                                {c.code}
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 p-3">
                            <div
                                className="line-clamp-2 text-sm font-semibold"
                                style={{ color: 'var(--color-text-dark)' }}
                            >
                                {c.name}
                            </div>
                            <div
                                className="mt-1 flex items-center gap-3 text-[11px]"
                                style={{ color: 'var(--color-text-light)' }}
                            >
                                {role === 'student' ? (
                                    <>
                                        <span>
                                            {(c as any).completed_count} / {(c as any).assignments_count} done
                                        </span>
                                        {(c as any).average_score != null && (
                                            <span className="font-semibold" style={{ color }}>
                                                {(c as any).average_score}% avg
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <span className="inline-flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {(c as any).student_count}
                                        </span>
                                        <span>{(c as any).published_count} published</span>
                                        {(c as any).draft_count > 0 && (
                                            <span className="font-semibold" style={{ color: '#B45309' }}>
                                                {(c as any).draft_count} draft
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

/* ── Section card wrapper ────────────────────────────────────────────── */

function SectionCard({
    title,
    action,
    children,
}: {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section
            className="rounded-2xl p-4 md:p-5"
            style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
            }}
        >
            <div className="mb-3 flex items-center justify-between">
                <h2
                    className="text-sm font-bold uppercase tracking-wide"
                    style={{ color: 'var(--color-text-dark)' }}
                >
                    {title}
                </h2>
                {action}
            </div>
            {children}
        </section>
    );
}

/* ── Role bodies ─────────────────────────────────────────────────────── */

function StudentDashboardBody({ data }: { data: StudentDashboardFeed }) {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-5">
            <HeroStrip
                greeting={data.greeting}
                stats={
                    <>
                        <StatChip
                            label="Due this week"
                            value={data.stats.due_this_week}
                            tone="warn"
                            icon={<Clock className="h-4 w-4" />}
                        />
                        <StatChip
                            label="Missing"
                            value={data.stats.missing}
                            tone="primary"
                            icon={<AlertTriangle className="h-4 w-4" />}
                        />
                        <StatChip
                            label="Graded recently"
                            value={data.stats.graded_recently}
                            tone="ok"
                            icon={<GraduationCap className="h-4 w-4" />}
                        />
                        <StatChip
                            label="Avg grade"
                            value={
                                data.stats.average_grade == null
                                    ? '—'
                                    : `${data.stats.average_grade}%`
                            }
                            tone="info"
                            icon={<CheckCircle2 className="h-4 w-4" />}
                        />
                    </>
                }
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <SectionCard
                        title="To Do"
                        action={
                            <button
                                type="button"
                                onClick={() => router.push('/student')}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold"
                                style={{ color: '#6B0000' }}
                            >
                                View all assignments <ChevronRight className="h-3 w-3" />
                            </button>
                        }
                    >
                        <StudentTodoList todos={data.todos} />
                    </SectionCard>

                    <SectionCard title="Recent Activity">
                        <ActivityFeed items={data.activity} />
                    </SectionCard>
                </div>

                <div className="flex flex-col gap-5">
                    <SectionCard
                        title="My Courses"
                        action={
                            <button
                                type="button"
                                onClick={() => router.push('/student')}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold"
                                style={{ color: '#6B0000' }}
                            >
                                Open courses <ChevronRight className="h-3 w-3" />
                            </button>
                        }
                    >
                        <CourseStrip role="student" courses={data.courses} />
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}

function FacultyDashboardBody({ data }: { data: FacultyDashboardFeed }) {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-5">
            <HeroStrip
                greeting={data.greeting}
                stats={
                    <>
                        <StatChip
                            label="To grade"
                            value={data.stats.to_grade}
                            tone="primary"
                            icon={<ClipboardList className="h-4 w-4" />}
                        />
                        <StatChip
                            label="Drafts"
                            value={data.stats.drafts}
                            tone="info"
                            icon={<FileText className="h-4 w-4" />}
                        />
                        <StatChip
                            label="Closing soon"
                            value={data.stats.closing_soon}
                            tone="warn"
                            icon={<Clock className="h-4 w-4" />}
                        />
                        <StatChip
                            label="Students"
                            value={data.stats.total_students}
                            tone="ok"
                            icon={<Users className="h-4 w-4" />}
                        />
                    </>
                }
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <SectionCard
                        title="Needs Attention"
                        action={
                            <button
                                type="button"
                                onClick={() => router.push('/courses')}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold"
                                style={{ color: '#6B0000' }}
                            >
                                All courses <ChevronRight className="h-3 w-3" />
                            </button>
                        }
                    >
                        <FacultyTodoList todos={data.todos} />
                    </SectionCard>

                    <SectionCard title="Recent Activity">
                        <ActivityFeed items={data.activity} />
                    </SectionCard>
                </div>

                <div className="flex flex-col gap-5">
                    <SectionCard
                        title="My Courses"
                        action={
                            <button
                                type="button"
                                onClick={() => router.push('/courses')}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold"
                                style={{ color: '#6B0000' }}
                            >
                                Open courses <ChevronRight className="h-3 w-3" />
                            </button>
                        }
                    >
                        <CourseStrip role="faculty" courses={data.courses} />
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}

/* ── Skeleton ────────────────────────────────────────────────────────── */

function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-5">
            <div
                className="rounded-2xl p-6"
                style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                }}
            >
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800 mb-3" />
                <div className="h-7 w-64 rounded bg-gray-200 dark:bg-gray-800 mb-5" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800"
                        />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="lg:col-span-2 h-64 rounded-2xl bg-gray-100 dark:bg-gray-800" />
                <div className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800" />
            </div>
        </div>
    );
}

/* ── Main export ─────────────────────────────────────────────────────── */

export default function DashboardPage() {
    const { role } = useAuth();
    const isStudent = role === 'student';
    const isFaculty = role === 'faculty' || role === 'admin';

    const studentQuery = useStudentFeed(isStudent);
    const facultyQuery = useFacultyFeed(isFaculty);

    const loading =
        (isStudent && studentQuery.isLoading) || (isFaculty && facultyQuery.isLoading);
    const error =
        (isStudent && studentQuery.isError) || (isFaculty && facultyQuery.isError);

    return (
        <PageLayout>
            <TopNav />
            <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
                {loading ? (
                    <DashboardSkeleton />
                ) : error ? (
                    <div
                        className="rounded-xl border px-4 py-6 text-sm"
                        style={{
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-mid)',
                        }}
                    >
                        We couldn&apos;t load your dashboard right now. Please refresh the page or
                        try again in a moment.
                    </div>
                ) : isStudent && studentQuery.data ? (
                    <StudentDashboardBody data={studentQuery.data} />
                ) : isFaculty && facultyQuery.data ? (
                    <FacultyDashboardBody data={facultyQuery.data} />
                ) : (
                    <div
                        className="rounded-xl border px-4 py-6 text-sm"
                        style={{
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-mid)',
                        }}
                    >
                        Dashboard is not available for this account.
                    </div>
                )}
            </main>
        </PageLayout>
    );
}
