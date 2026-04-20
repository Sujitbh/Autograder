'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    CalendarDays,
    ChevronDown,
    GraduationCap,
    Inbox,
    MessageSquare,
} from 'lucide-react';
import type { DashboardActivityItem } from '@/services/api';
import { cn } from '@/components/ui/utils';
import { CoursePill } from './primitives';
import { EmptyState } from './EmptyState';
import {
    compressActivityBucket,
    formatAbsolute,
    formatDayHeader,
    groupActivityByDay,
    relativeShort,
    type CompressedActivity,
} from './utils';

const SHOW_LIMIT_DEFAULT = 8;

function iconFor(kind: DashboardActivityItem['kind']) {
    if (kind === 'grade' || kind === 'graded') return <GraduationCap className="h-3.5 w-3.5" />;
    if (kind === 'assignment') return <CalendarDays className="h-3.5 w-3.5" />;
    if (kind === 'submission') return <Inbox className="h-3.5 w-3.5" />;
    return <MessageSquare className="h-3.5 w-3.5" />;
}

function dotToneFor(kind: DashboardActivityItem['kind']): string {
    if (kind === 'grade' || kind === 'graded') return 'var(--dash-ok-ink)';
    if (kind === 'assignment') return 'var(--dash-warn-ink)';
    if (kind === 'submission') return 'var(--dash-info-ink)';
    return 'var(--dash-primary-ink)';
}

function ActivityDot({ kind }: { kind: DashboardActivityItem['kind'] }) {
    const ink = dotToneFor(kind);
    return (
        <span
            aria-hidden
            className="relative flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full"
            style={{
                background: 'var(--dash-surface-2)',
                boxShadow: `inset 0 0 0 1px var(--dash-ring-strong)`,
                color: ink,
            }}
        >
            <span
                className="absolute inset-1 rounded-full"
                style={{
                    background: `color-mix(in srgb, ${ink} 12%, transparent)`,
                }}
            />
            <span className="relative z-[1]">{iconFor(kind)}</span>
        </span>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Rail + row                                                                  */
/* The rail is drawn with a vertical CSS line 14px from the left edge.        */
/* Dots sit on top of the rail. Day headers are sticky.                       */
/* ────────────────────────────────────────────────────────────────────────── */

function Row({ item }: { item: CompressedActivity }) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const isGroup = Array.isArray(item.children) && item.children.length > 1;

    const onActivate = () => {
        if (isGroup) {
            setOpen((o) => !o);
            return;
        }
        if (item.link) router.push(item.link);
    };

    return (
        <>
            <button
                type="button"
                onClick={onActivate}
                className={cn(
                    'group relative flex w-full items-start gap-3 rounded-[8px] py-1.5 pl-0 pr-2 text-left',
                    'transition-colors duration-150',
                    'hover:bg-[var(--dash-ring-subtle)]',
                )}
                aria-expanded={isGroup ? open : undefined}
            >
                <ActivityDot kind={item.kind} />
                <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex min-w-0 items-center gap-2">
                        <span
                            className="truncate text-[13.5px] font-semibold leading-[18px]"
                            style={{ color: 'var(--dash-ink-1)' }}
                            title={item.title}
                        >
                            {item.title}
                        </span>
                        {item.course && <CoursePill course={item.course} />}
                        {isGroup && (
                            <ChevronDown
                                className={cn(
                                    'h-3.5 w-3.5 shrink-0 transition-transform',
                                    open && 'rotate-180',
                                )}
                                style={{ color: 'var(--dash-ink-4)' }}
                                aria-hidden
                            />
                        )}
                    </div>
                    {item.subtitle && (
                        <div
                            className="mt-0.5 truncate text-[12px] leading-[16px]"
                            style={{ color: 'var(--dash-ink-4)' }}
                        >
                            {item.subtitle}
                        </div>
                    )}
                </div>
                {item.at && (
                    <span
                        title={formatAbsolute(item.at)}
                        className="mt-1 whitespace-nowrap text-[11px] font-medium leading-[14px]"
                        style={{ color: 'var(--dash-ink-4)' }}
                    >
                        {relativeShort(item.at)}
                    </span>
                )}
            </button>

            {isGroup && open && (
                <div className="mb-1 ml-9 mt-0.5 flex flex-col gap-0.5 rounded-[8px] border-l pl-3 py-1"
                     style={{ borderColor: 'var(--dash-ring-subtle)' }}>
                    {item.children!.map((child, idx) => (
                        <button
                            key={`${child.link}-${idx}`}
                            type="button"
                            onClick={() => child.link && router.push(child.link)}
                            className="flex w-full items-start gap-2 rounded-[6px] px-2 py-1 text-left hover:bg-[var(--dash-ring-subtle)]"
                        >
                            <div className="min-w-0 flex-1">
                                <div
                                    className="truncate text-[12.5px] font-medium leading-[16px]"
                                    style={{ color: 'var(--dash-ink-2)' }}
                                >
                                    {child.title}
                                </div>
                                {child.subtitle && (
                                    <div
                                        className="truncate text-[11px] leading-[14px]"
                                        style={{ color: 'var(--dash-ink-4)' }}
                                    >
                                        {child.subtitle}
                                    </div>
                                )}
                            </div>
                            {child.at && (
                                <span
                                    className="whitespace-nowrap text-[10px]"
                                    style={{ color: 'var(--dash-ink-5)' }}
                                >
                                    {relativeShort(child.at)}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}

export function ActivityTimeline({
    items,
    showLimit = SHOW_LIMIT_DEFAULT,
}: {
    items: DashboardActivityItem[];
    showLimit?: number;
}) {
    const [expanded, setExpanded] = React.useState(false);

    const grouped = React.useMemo(() => {
        const all = groupActivityByDay(items);
        return all.map((bucket) => ({
            dayIso: bucket.dayIso,
            items: compressActivityBucket(bucket.items),
        }));
    }, [items]);

    if (grouped.length === 0) {
        return (
            <EmptyState
                variant="no-activity"
                title="No activity yet."
                hint="Submissions, grades, and announcements will appear on a timeline here."
            />
        );
    }

    // Flatten for show-limit counting (we collapse on compressed rows, not underlying events)
    const allRows = grouped.flatMap((b) => b.items);
    const hiddenCount =
        !expanded && allRows.length > showLimit ? allRows.length - showLimit : 0;

    // Slice per-bucket while respecting showLimit across the whole timeline
    let taken = 0;
    const limit = expanded ? Number.POSITIVE_INFINITY : showLimit;
    const visibleBuckets: typeof grouped = [];
    for (const bucket of grouped) {
        if (taken >= limit) break;
        const remaining = limit - taken;
        const slice = bucket.items.slice(0, remaining);
        visibleBuckets.push({ dayIso: bucket.dayIso, items: slice });
        taken += slice.length;
    }

    return (
        <div className="relative">
            {/* Vertical rail, anchored 14px from the inner content edge.
                We place it on the inner container so it only spans the timeline. */}
            <div
                aria-hidden
                className="pointer-events-none absolute left-[13px] top-2 bottom-2 w-px"
                style={{ background: 'var(--dash-ring-subtle)' }}
            />

            <div className="flex flex-col gap-4">
                {visibleBuckets.map((bucket) => (
                    <div key={bucket.dayIso}>
                        <div
                            className="sticky top-[-1px] z-[1] mb-1 flex items-center gap-2 py-1"
                            style={{
                                background:
                                    'linear-gradient(var(--dash-surface-2), var(--dash-surface-2) 88%, transparent)',
                            }}
                        >
                            <span
                                className="pl-[34px] text-[11px] font-semibold uppercase leading-[14px] tracking-[0.08em]"
                                style={{ color: 'var(--dash-ink-4)' }}
                            >
                                {formatDayHeader(bucket.dayIso)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            {bucket.items.map((it, i) => (
                                <Row key={`${it.kind}-${it.link}-${i}`} item={it} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {hiddenCount > 0 && (
                <div className="mt-3 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold"
                        style={{
                            borderColor: 'var(--dash-ring-strong)',
                            color: 'var(--dash-ink-3)',
                            background: 'var(--dash-surface-2)',
                        }}
                    >
                        Show {hiddenCount} earlier
                    </button>
                </div>
            )}
        </div>
    );
}
