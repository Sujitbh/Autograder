'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/components/ui/utils';
import { courseColorVar } from './utils';
import type { DashboardActivityItem } from '@/services/api';
import type { StudentTodoItem, FacultyTodoItem } from '@/services/api';

/**
 * WeekAhead — a compact 7-day horizontal strip that shows everything due
 * in the next week. Each day cell carries:
 *   - day-of-week label + date number
 *   - up to 2 course-coded chips for assignments due that day (with
 *     "+N more" overflow indicator beyond that)
 *   - "Today" gets a primary-tint background + bold label
 *   - empty days show a subtle dot placeholder
 *
 * Totally data-derived from existing feed items — no backend changes needed.
 * Click-through on any chip opens its link.
 */

export interface WeekAheadItem {
    key: string;
    title: string;
    course: { id: number; code: string; name?: string } | null;
    due: string; // ISO
    link: string;
}

/* ───────── derivation helpers ───────── */

/** Build WeekAheadItems from faculty todos (closing + to_grade with due_date). */
export function facultyWeekItems(todos: FacultyTodoItem[]): WeekAheadItem[] {
    const out: WeekAheadItem[] = [];
    for (const t of todos) {
        if (!t.due_date) continue;
        if (t.kind === 'draft') continue; // drafts aren't due-date events
        out.push({
            key: `f-${t.kind}-${t.assignment_id}`,
            title: t.title,
            course: t.course,
            due: t.due_date,
            link: t.course
                ? `/courses/${t.course.id}/assignments/${t.assignment_id}`
                : '/courses',
        });
    }
    return out;
}

/** Build WeekAheadItems from activity (kind === 'assignment'). */
export function facultyWeekItemsFromActivity(
    activity: DashboardActivityItem[],
): WeekAheadItem[] {
    const out: WeekAheadItem[] = [];
    for (const a of activity) {
        if (a.kind !== 'assignment' || !a.at) continue;
        // titles from backend look like "Lab 3 due" → strip trailing " due"
        const title = a.title.replace(/\s+due$/i, '');
        out.push({
            key: `a-${a.link}-${a.at}`,
            title,
            course: a.course ?? null,
            due: a.at,
            link: a.link,
        });
    }
    return out;
}

/** Build WeekAheadItems from student todos (upcoming kind, with due_date). */
export function studentWeekItems(todos: StudentTodoItem[]): WeekAheadItem[] {
    const out: WeekAheadItem[] = [];
    for (const t of todos) {
        if (t.kind !== 'upcoming') continue;
        if (!t.due_date) continue;
        out.push({
            key: `s-${t.assignment_id}`,
            title: t.title,
            course: t.course,
            due: t.due_date,
            link: t.course
                ? `/student/courses/${t.course.id}/assignments/${t.assignment_id}`
                : '/student',
        });
    }
    return out;
}

/* ───────── grouping ───────── */

interface DayBucket {
    date: Date; // midnight local
    items: WeekAheadItem[];
}

function startOfDay(d: Date): Date {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
}

function sameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function buildWeek(
    items: WeekAheadItem[],
    now: Date = new Date(),
): { buckets: DayBucket[]; total: number } {
    const today = startOfDay(now);
    const buckets: DayBucket[] = [];
    for (let i = 0; i < 7; i += 1) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        buckets.push({ date: d, items: [] });
    }
    let total = 0;
    // Unique by key + rounded day key so duplicates don't double-count
    const seen = new Set<string>();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);
    for (const it of items) {
        const dt = new Date(it.due);
        if (Number.isNaN(dt.getTime())) continue;
        if (dt < today || dt >= endOfWeek) continue;
        const dayOffset = Math.floor(
            (startOfDay(dt).getTime() - today.getTime()) / 86400000,
        );
        if (dayOffset < 0 || dayOffset > 6) continue;
        const uniq = `${it.key}@${dayOffset}`;
        if (seen.has(uniq)) continue;
        seen.add(uniq);
        buckets[dayOffset].items.push(it);
        total += 1;
    }
    // Sort items within each bucket by due time
    for (const b of buckets) {
        b.items.sort((a, c) => new Date(a.due).getTime() - new Date(c.due).getTime());
    }
    return { buckets, total };
}

/* ───────── pieces ───────── */

function Chip({ item, onOpen }: { item: WeekAheadItem; onOpen: (link: string) => void }) {
    const color = courseColorVar(item.course?.id ?? 0);
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onOpen(item.link);
            }}
            title={`${item.course?.code ?? ''} · ${item.title}`}
            className="group flex w-full items-center gap-1.5 rounded-[6px] px-1.5 py-1 text-left transition-colors hover:bg-[var(--dash-ring-subtle)]"
        >
            <span
                aria-hidden
                className="h-[8px] w-[8px] shrink-0 rounded-full"
                style={{ background: color }}
            />
            <span
                className="truncate text-[11px] font-medium leading-[14px]"
                style={{ color: 'var(--dash-ink-2)' }}
            >
                {item.title}
            </span>
        </button>
    );
}

function EmptyDot() {
    return (
        <span
            aria-hidden
            className="inline-block h-[4px] w-[4px] rounded-full"
            style={{ background: 'var(--dash-ring-strong)', opacity: 0.6 }}
        />
    );
}

function DayCell({
    bucket,
    today,
    onOpen,
    onOpenAllForDay,
}: {
    bucket: DayBucket;
    today: boolean;
    onOpen: (link: string) => void;
    onOpenAllForDay: (link: string) => void;
}) {
    const MAX_VISIBLE = 2;
    const overflow = Math.max(0, bucket.items.length - MAX_VISIBLE);
    const visible = bucket.items.slice(0, MAX_VISIBLE);
    const dayLabel = bucket.date.toLocaleDateString(undefined, { weekday: 'short' });
    const dayNum = bucket.date.getDate();
    const isEmpty = bucket.items.length === 0;

    return (
        <div
            className={cn(
                'relative flex min-w-0 flex-col rounded-[10px] p-2 transition-colors',
                today && 'shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--dash-primary-ink)_26%,transparent)]',
            )}
            style={{
                background: today
                    ? 'var(--dash-primary-tint)'
                    : 'var(--dash-surface-2)',
                boxShadow: today
                    ? undefined
                    : 'inset 0 0 0 1px var(--dash-ring-subtle)',
            }}
        >
            <div className="flex items-baseline justify-between gap-1">
                <span
                    className="text-[10px] font-semibold uppercase leading-[12px] tracking-[0.08em]"
                    style={{
                        color: today
                            ? 'var(--dash-primary-ink)'
                            : 'var(--dash-ink-4)',
                    }}
                >
                    {today ? 'Today' : dayLabel}
                </span>
                <span
                    className="text-[12px] font-semibold tabular-nums leading-[14px]"
                    style={{
                        color: today
                            ? 'var(--dash-primary-ink)'
                            : 'var(--dash-ink-2)',
                    }}
                >
                    {dayNum}
                </span>
            </div>

            <div className="mt-1.5 flex min-h-[44px] flex-col gap-0.5">
                {isEmpty ? (
                    <div className="flex h-full items-center justify-center">
                        <EmptyDot />
                    </div>
                ) : (
                    <>
                        {visible.map((it) => (
                            <Chip key={it.key} item={it} onOpen={onOpen} />
                        ))}
                        {overflow > 0 && (
                            <button
                                type="button"
                                onClick={() =>
                                    onOpenAllForDay(bucket.items[0].link)
                                }
                                className="truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10px] font-semibold leading-[14px] transition-colors hover:bg-[var(--dash-ring-subtle)]"
                                style={{ color: 'var(--dash-ink-3)' }}
                            >
                                +{overflow} more
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

/* ───────── main component ───────── */

export function WeekAhead({
    items,
    emptyHint,
}: {
    items: WeekAheadItem[];
    /** Optional hint text for the no-activity-this-week state. */
    emptyHint?: string;
}) {
    const router = useRouter();
    const now = React.useMemo(() => new Date(), []);
    const { buckets, total } = React.useMemo(() => buildWeek(items, now), [items, now]);
    const today = startOfDay(now);
    const open = (href: string) => router.push(href);

    if (total === 0) {
        return (
            <div
                className="flex items-center gap-3 rounded-[10px] px-3 py-3"
                style={{
                    background: 'var(--dash-surface-2)',
                    boxShadow: 'inset 0 0 0 1px var(--dash-ring-subtle)',
                }}
            >
                <span
                    aria-hidden
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{
                        background: 'var(--dash-ok-tint)',
                        color: 'var(--dash-ok-ink)',
                    }}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden
                    >
                        <path
                            d="M2.5 7.5l3 3 6-7"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
                <div className="min-w-0">
                    <p
                        className="text-[13px] font-semibold leading-[18px]"
                        style={{ color: 'var(--dash-ink-1)' }}
                    >
                        Nothing is due this week.
                    </p>
                    <p
                        className="text-[12px] leading-[16px]"
                        style={{ color: 'var(--dash-ink-4)' }}
                    >
                        {emptyHint ??
                            'A quiet week — good time to look ahead or plan next one.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-7 gap-1.5" role="list">
            {buckets.map((b) => (
                <div key={b.date.toISOString()} role="listitem">
                    <DayCell
                        bucket={b}
                        today={sameDay(b.date, today)}
                        onOpen={open}
                        onOpenAllForDay={open}
                    />
                </div>
            ))}
        </div>
    );
}
