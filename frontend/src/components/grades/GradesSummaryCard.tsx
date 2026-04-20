'use client';

import * as React from 'react';
import { ArrowRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { FocusCard } from '../dashboard/FocusCard';
import { GradeRing } from './GradeRing';
import {
    dueLabel,
    pickNextDue,
    type GradeAssignment,
} from './utils';

function BreakdownRow({
    dotColor,
    label,
    count,
    emphasize = false,
    muted = false,
}: {
    dotColor: string;
    label: string;
    count: number;
    emphasize?: boolean;
    muted?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3 py-1.5">
            <span className="flex min-w-0 items-center gap-2">
                <span
                    aria-hidden
                    className="h-[8px] w-[8px] shrink-0 rounded-full"
                    style={{ background: dotColor }}
                />
                <span
                    className="truncate text-[13px] leading-[18px]"
                    style={{
                        color: muted ? 'var(--dash-ink-4)' : 'var(--dash-ink-2)',
                        fontWeight: emphasize ? 600 : 500,
                    }}
                >
                    {label}
                </span>
            </span>
            <span
                className="shrink-0 text-[13px] font-semibold tabular-nums leading-[18px]"
                style={{
                    color: emphasize ? 'var(--dash-danger-ink)' : 'var(--dash-ink-1)',
                }}
            >
                {count}
            </span>
        </div>
    );
}

export function GradesSummaryCard({
    average,
    gradedCount,
    totalCount,
    pendingCount,
    notSubmittedCount,
    overdueCount,
    assignments,
    onOpenAssignment,
}: {
    average: number | null;
    gradedCount: number;
    totalCount: number;
    pendingCount: number;
    notSubmittedCount: number;
    overdueCount: number;
    assignments: GradeAssignment[];
    onOpenAssignment: (assignmentId: number) => void;
}) {
    const nextDue = React.useMemo(() => pickNextDue(assignments), [assignments]);

    const focusProps = React.useMemo(() => {
        if (!nextDue) {
            return {
                variant: 'calm' as const,
                eyebrow: 'All caught up',
                title: "Nothing is due right now.",
                hint: 'Your pending work is clear — keep it that way.',
                cta: undefined,
                onClick: undefined,
            };
        }
        const overdue = nextDue.is_overdue;
        const label = dueLabel(nextDue.due_date) ?? 'No due date';
        return {
            variant: 'urgent' as const,
            eyebrow: overdue ? 'Overdue' : 'Next due',
            title: nextDue.assignment_name,
            hint: label,
            cta: 'Submit now',
            onClick: () => onOpenAssignment(nextDue.assignment_id),
        };
    }, [nextDue, onOpenAssignment]);

    return (
        <section
            aria-labelledby="grades-summary-title"
            className="relative overflow-hidden rounded-[16px]"
            style={{
                background: 'var(--dash-surface-3)',
                boxShadow:
                    'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-raised)',
            }}
        >
            {/* quiet tone-aware wash behind the ring */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(720px 220px at 0% 0%, var(--dash-primary-tint) 0%, transparent 55%)',
                }}
            />

            <h2 id="grades-summary-title" className="sr-only">
                Grade summary
            </h2>

            <div
                className="relative grid gap-6 p-5 md:p-6"
                style={{ gridTemplateColumns: '1fr' }}
            >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr_minmax(240px,320px)] lg:items-center">
                    {/* Ring */}
                    <div className="flex items-center justify-center lg:justify-start">
                        <GradeRing
                            average={average}
                            graded={gradedCount}
                            total={totalCount}
                        />
                    </div>

                    {/* Divider (lg only) */}
                    <div className="min-w-0">
                        <div
                            aria-hidden
                            className="hidden lg:block"
                            style={{
                                height: 96,
                                width: 1,
                                background: 'var(--dash-ring-subtle)',
                                float: 'left',
                                marginRight: 20,
                            }}
                        />
                        <p
                            className="mb-2 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.08em]"
                            style={{ color: 'var(--dash-ink-4)' }}
                        >
                            Breakdown
                        </p>
                        <BreakdownRow
                            dotColor="var(--dash-ok-ink)"
                            label="Graded"
                            count={gradedCount}
                        />
                        <BreakdownRow
                            dotColor="var(--dash-warn-ink)"
                            label="Pending review"
                            count={pendingCount}
                        />
                        <BreakdownRow
                            dotColor={
                                overdueCount > 0
                                    ? 'var(--dash-danger-ink)'
                                    : 'var(--dash-ink-5)'
                            }
                            label={
                                overdueCount > 0
                                    ? `Not Submitted · ${overdueCount} overdue`
                                    : 'Not Submitted'
                            }
                            count={notSubmittedCount}
                            emphasize={overdueCount > 0}
                        />
                    </div>

                    {/* Focus mini-card */}
                    <div className="w-full">
                        <FocusCard
                            variant={focusProps.variant}
                            eyebrow={focusProps.eyebrow}
                            title={focusProps.title}
                            hint={focusProps.hint}
                            cta={focusProps.cta}
                            onClick={focusProps.onClick}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* Icons re-exported for downstream consumers that want them inline */
export { CheckCircle2, Clock, AlertTriangle, ArrowRight };
