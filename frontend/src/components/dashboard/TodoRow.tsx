'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { CoursePill } from './primitives';

export type TodoKind =
    | 'missing'
    | 'upcoming'
    | 'graded'
    | 'to_grade'
    | 'draft'
    | 'closing';

const ACCENT: Record<TodoKind, string> = {
    missing: 'var(--dash-danger-ink)',
    upcoming: 'var(--dash-warn-ink)',
    graded: 'var(--dash-ok-ink)',
    to_grade: 'var(--dash-primary-ink)',
    draft: 'var(--dash-ink-4)',
    closing: 'var(--dash-warn-ink)',
};

const ICON_TINT: Record<TodoKind, string> = {
    missing: 'var(--dash-danger-tint)',
    upcoming: 'var(--dash-warn-tint)',
    graded: 'var(--dash-ok-tint)',
    to_grade: 'var(--dash-primary-tint)',
    draft: 'color-mix(in srgb, var(--dash-ink-5) 12%, transparent)',
    closing: 'var(--dash-warn-tint)',
};

export interface TodoRowProps {
    kind: TodoKind;
    icon: React.ReactNode;
    title: string;
    subtitle?: string | null;
    course?: { id: number; code: string | null; name?: string } | null;
    /** Short trailing badge (due label, count, percentage, etc.) */
    trail?: { label: string; tone?: 'primary' | 'warn' | 'ok' | 'info' | 'danger' | 'neutral' };
    /** Only rendered when onClick is provided (makes the row itself interactive). */
    onClick?: () => void;
    /** Extra right-aligned CTA text revealed on hover/focus. */
    hoverCta?: string;
    className?: string;
}

/**
 * TodoRow — a single "Needs Attention" item.
 * Left: 3px accent bar colored by `kind`.
 * Then: icon chip (colored by kind), two-line content, course pill,
 * right-aligned trail badge, and a hover-revealed CTA.
 */
export function TodoRow({
    kind,
    icon,
    title,
    subtitle,
    course,
    trail,
    onClick,
    hoverCta,
    className,
}: TodoRowProps) {
    const accent = ACCENT[kind];
    const tint = ICON_TINT[kind];
    const interactive = Boolean(onClick);

    const tone = trail?.tone ?? 'neutral';
    const trailColor =
        tone === 'primary'
            ? 'var(--dash-primary-ink)'
            : tone === 'warn'
            ? 'var(--dash-warn-ink)'
            : tone === 'ok'
            ? 'var(--dash-ok-ink)'
            : tone === 'info'
            ? 'var(--dash-info-ink)'
            : tone === 'danger'
            ? 'var(--dash-danger-ink)'
            : 'var(--dash-ink-3)';
    const trailBg =
        tone === 'primary'
            ? 'var(--dash-primary-tint)'
            : tone === 'warn'
            ? 'var(--dash-warn-tint)'
            : tone === 'ok'
            ? 'var(--dash-ok-tint)'
            : tone === 'info'
            ? 'var(--dash-info-tint)'
            : tone === 'danger'
            ? 'var(--dash-danger-tint)'
            : 'var(--dash-ring-subtle)';

    const Comp = (interactive ? 'button' : 'div') as React.ElementType;

    return (
        <Comp
            type={interactive ? 'button' : undefined}
            onClick={onClick}
            className={cn(
                'group relative flex w-full items-center gap-3 rounded-[10px] py-2.5 pl-4 pr-3 text-left',
                'transition-colors duration-150',
                interactive && 'hover:bg-[var(--dash-ring-subtle)]',
                className,
            )}
        >
            {/* 3px left accent bar */}
            <span
                aria-hidden
                className="absolute left-1.5 top-2 bottom-2 w-[3px] rounded-full"
                style={{ background: accent, opacity: 0.85 }}
            />

            <span
                aria-hidden
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]"
                style={{ background: tint, color: accent }}
            >
                {icon}
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                    <span
                        className="truncate text-[13.5px] font-semibold leading-[18px]"
                        style={{ color: 'var(--dash-ink-1)' }}
                        title={title}
                    >
                        {title}
                    </span>
                    {course && <CoursePill course={course} />}
                </div>
                {subtitle && (
                    <div
                        className="mt-0.5 truncate text-[12px] leading-[16px]"
                        style={{ color: 'var(--dash-ink-4)' }}
                    >
                        {subtitle}
                    </div>
                )}
            </div>

            {trail && (
                <span
                    className="whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none"
                    style={{ color: trailColor, background: trailBg }}
                >
                    {trail.label}
                </span>
            )}

            {hoverCta ? (
                <span
                    aria-hidden
                    className="ml-1 hidden items-center gap-1 text-[12px] font-semibold text-[var(--dash-ink-3)] group-hover:flex group-focus-within:flex"
                >
                    {hoverCta}
                    <ChevronRight className="h-3.5 w-3.5" />
                </span>
            ) : (
                interactive && (
                    <ChevronRight
                        className="ml-1 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                        style={{ color: 'var(--dash-ink-4)' }}
                        aria-hidden
                    />
                )
            )}
        </Comp>
    );
}
