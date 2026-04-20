'use client';

import * as React from 'react';
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    FileText,
    ChevronRight,
    CalendarClock,
} from 'lucide-react';
import {
    statusOf,
    toneForPercentage,
    toneInk,
    toneTint,
    toneSoft,
    dueLabel,
    type GradeAssignment,
    type GradeStatus,
} from './utils';

/**
 * Status chip used in the left icon + status area.
 * The icon is kept monochromatic (uses currentColor) so it inherits tone ink.
 */
function StatusChip({ status, overdue }: { status: GradeStatus; overdue: boolean }) {
    let label: string = status;
    let tone: 'ok' | 'warn' | 'danger' | 'neutral' = 'neutral';
    let Icon: React.ComponentType<{ className?: string }> = FileText;

    if (status === 'Graded') {
        tone = 'ok';
        Icon = CheckCircle2;
    } else if (status === 'Pending Grade') {
        tone = 'warn';
        Icon = Clock;
    } else if (status === 'Not Submitted') {
        if (overdue) {
            tone = 'danger';
            Icon = AlertTriangle;
            label = 'Overdue';
        } else {
            tone = 'neutral';
            Icon = FileText;
        }
    }

    const inkVar = {
        ok: 'var(--dash-ok-ink)',
        warn: 'var(--dash-warn-ink)',
        danger: 'var(--dash-danger-ink)',
        neutral: 'var(--dash-ink-3)',
    }[tone];

    const tintVar = {
        ok: 'var(--dash-ok-tint)',
        warn: 'var(--dash-warn-tint)',
        danger: 'var(--dash-danger-tint)',
        neutral: 'var(--dash-ring-subtle)',
    }[tone];

    return (
        <span
            className="inline-flex h-[24px] shrink-0 items-center gap-1 rounded-full px-2 text-[11px] font-semibold leading-none"
            style={{
                background: tintVar,
                color: inkVar,
                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${inkVar} 18%, transparent)`,
            }}
        >
            <Icon className="h-3 w-3" />
            {label}
        </span>
    );
}

/**
 * The tone-colored meter that doubles as both percentage bar (for graded)
 * and a quiet "not yet" affordance (for others).
 */
function ScoreMeter({
    percentage,
    status,
}: {
    percentage: number | null;
    status: GradeStatus;
}) {
    const tone = toneForPercentage(percentage);
    const inkColor = toneInk(tone);
    const softColor = toneSoft(tone);
    const filled = Math.max(0, Math.min(100, percentage ?? 0));

    if (status !== 'Graded') {
        return (
            <div
                aria-hidden
                className="relative h-[6px] w-full overflow-hidden rounded-full"
                style={{ background: 'var(--dash-ring-subtle)' }}
            >
                <div
                    className="absolute inset-y-0 left-0"
                    style={{
                        width: '100%',
                        background:
                            'repeating-linear-gradient(90deg, var(--dash-ring-subtle) 0 6px, transparent 6px 10px)',
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className="relative h-[6px] w-full overflow-hidden rounded-full"
            style={{ background: softColor }}
            aria-hidden
        >
            <div
                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
                style={{
                    width: `${filled}%`,
                    background: inkColor,
                }}
            />
        </div>
    );
}

export function GradeRow({
    assignment,
    onOpen,
}: {
    assignment: GradeAssignment;
    onOpen: (id: number) => void;
}) {
    const status = statusOf(assignment);
    const tone = toneForPercentage(assignment.percentage);
    const tint = toneTint(tone);
    const ink = toneInk(tone);
    const overdue = !!assignment.is_overdue;
    const dueText = dueLabel(assignment.due_date);

    const handleClick = () => onOpen(assignment.assignment_id);

    return (
        <article
            className="dash-enter group relative isolate overflow-hidden rounded-[14px]"
            style={{
                background: 'var(--dash-surface-2)',
                boxShadow:
                    'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-soft)',
                transition: 'box-shadow 160ms var(--dash-motion-enter), transform 160ms var(--dash-motion-enter)',
            }}
        >
            {/* Left accent bar — tone-colored for graded, danger for overdue, quiet otherwise */}
            <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{
                    background:
                        status === 'Graded'
                            ? ink
                            : overdue
                            ? 'var(--dash-danger-ink)'
                            : 'var(--dash-ring-strong)',
                    opacity: status === 'Graded' || overdue ? 0.95 : 0.45,
                }}
            />

            <button
                type="button"
                onClick={handleClick}
                className="flex w-full flex-col gap-3 p-4 text-left md:flex-row md:items-center md:gap-4 md:p-5"
                style={{ color: 'inherit' }}
                aria-label={`Open ${assignment.assignment_name}`}
            >
                {/* Left: title + status + due */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3
                            className="min-w-0 truncate text-[15px] font-semibold leading-[20px]"
                            style={{ color: 'var(--dash-ink-1)' }}
                        >
                            {assignment.assignment_name}
                        </h3>
                        <StatusChip status={status} overdue={overdue} />
                    </div>
                    <div
                        className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] leading-[16px]"
                        style={{ color: 'var(--dash-ink-3)' }}
                    >
                        {dueText && (
                            <span className="inline-flex items-center gap-1">
                                <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                                <span
                                    style={{
                                        color: overdue
                                            ? 'var(--dash-danger-ink)'
                                            : 'var(--dash-ink-3)',
                                        fontWeight: overdue ? 600 : 500,
                                    }}
                                >
                                    {dueText}
                                </span>
                            </span>
                        )}
                        {status === 'Graded' && assignment.graded_at && (
                            <span>
                                Graded{' '}
                                {new Date(assignment.graded_at).toLocaleDateString(
                                    undefined,
                                    { month: 'short', day: 'numeric' },
                                )}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: meter + score + chevron */}
                <div className="flex w-full items-center gap-4 md:w-[340px] md:shrink-0">
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <ScoreMeter percentage={assignment.percentage} status={status} />
                        <div
                            className="flex items-center justify-between text-[11px] leading-[14px]"
                            style={{ color: 'var(--dash-ink-4)' }}
                        >
                            <span>
                                {status === 'Graded' && assignment.max_score
                                    ? `${assignment.score} / ${assignment.max_score}`
                                    : status === 'Pending Grade'
                                    ? 'Awaiting instructor'
                                    : overdue
                                    ? 'Submit ASAP'
                                    : 'Not started'}
                            </span>
                            {status === 'Graded' && assignment.percentage !== null && (
                                <span
                                    className="font-semibold tabular-nums"
                                    style={{ color: ink, fontSize: 12 }}
                                >
                                    {Math.round(assignment.percentage)}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Big percentage (only graded) */}
                    {status === 'Graded' && assignment.percentage !== null ? (
                        <div
                            className="flex h-[52px] w-[72px] shrink-0 items-center justify-center rounded-[10px]"
                            style={{
                                background: tint,
                                color: ink,
                                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${ink} 22%, transparent)`,
                            }}
                            aria-label={`Final score ${Math.round(assignment.percentage)}%`}
                        >
                            <div className="text-[22px] font-semibold leading-[24px] tabular-nums">
                                {Math.round(assignment.percentage)}
                                <span className="text-[12px] font-semibold opacity-70">
                                    %
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="flex h-[52px] w-[72px] shrink-0 items-center justify-center rounded-[10px] text-[13px] font-semibold"
                            style={{
                                color: 'var(--dash-ink-4)',
                                background: 'var(--dash-ring-subtle)',
                            }}
                            aria-hidden
                        >
                            —
                        </div>
                    )}

                    <ChevronRight
                        className="h-5 w-5 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5"
                        style={{ color: 'var(--dash-ink-4)' }}
                        aria-hidden
                    />
                </div>
            </button>
        </article>
    );
}
