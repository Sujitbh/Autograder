'use client';

import * as React from 'react';
import { cn } from '@/components/ui/utils';
import { courseColorVar } from './utils';

/* ────────────────────────────────────────────────────────────────────────── */
/* CoursePill                                                                 */
/* A small rounded 999px pill that carries a course code with a hue dot.      */
/* Uses categorical palette + color-mix for tint/soft derivations.            */
/* ────────────────────────────────────────────────────────────────────────── */

export function CoursePill({
    course,
    className,
}: {
    course: { id: number; code: string | null; name?: string } | null | undefined;
    className?: string;
}) {
    if (!course) return null;
    const color = courseColorVar(course.id);
    const codeLabel = course.code ?? '—';
    return (
        <span
            className={cn(
                'inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-full px-2 text-[11px] font-semibold leading-none',
                'font-mono tracking-tight',
                className,
            )}
            title={course.name || codeLabel}
            style={{
                color,
                background: `color-mix(in srgb, ${color} 10%, transparent)`,
                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 22%, transparent)`,
            }}
        >
            <span
                aria-hidden
                className="h-[6px] w-[6px] rounded-full"
                style={{ background: color }}
            />
            {codeLabel}
        </span>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* SectionCard                                                                */
/* Soft-elevation surface with a consistent header.                           */
/* Supports an id/aria-labelledby so sections are proper landmarks.           */
/* ────────────────────────────────────────────────────────────────────────── */

export function SectionCard({
    id,
    title,
    action,
    children,
    className,
    density = 'default',
}: {
    id: string;
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    density?: 'default' | 'flush';
}) {
    return (
        <section
            aria-labelledby={`${id}-title`}
            className={cn(
                'relative rounded-[12px]',
                'border-0', // ring handles the border so it looks like 1 hairline
                className,
            )}
            style={{
                background: 'var(--dash-surface-2)',
                boxShadow: `inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-soft)`,
            }}
        >
            <header
                className={cn(
                    'flex items-center justify-between gap-2',
                    density === 'flush' ? 'px-4 pt-4' : 'px-5 pt-5',
                )}
            >
                <h2
                    id={`${id}-title`}
                    className="text-[13px] font-semibold leading-[20px] tracking-tight"
                    style={{ color: 'var(--dash-ink-2)' }}
                >
                    {title}
                </h2>
                {action}
            </header>
            <div
                className={cn(
                    density === 'flush' ? 'px-4 pb-4 pt-3' : 'px-5 pb-5 pt-3',
                )}
            >
                {children}
            </div>
        </section>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* GhostButton / LinkRow                                                      */
/* Standardized tertiary action used across the page.                         */
/* ────────────────────────────────────────────────────────────────────────── */

export const GhostButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'neutral' | 'primary' }
>(function GhostButton({ className, tone = 'neutral', ...props }, ref) {
    return (
        <button
            ref={ref}
            {...props}
            className={cn(
                'inline-flex items-center gap-1 rounded-[8px] px-2 py-1',
                'text-[12px] font-semibold leading-[16px]',
                'transition-colors duration-150',
                'hover:bg-[var(--dash-ring-subtle)] active:bg-[var(--dash-ring-strong)]',
                'disabled:opacity-50 disabled:pointer-events-none',
                className,
            )}
            style={{
                color:
                    tone === 'primary'
                        ? 'var(--dash-primary-ink)'
                        : 'var(--dash-ink-3)',
            }}
        />
    );
});

/* ────────────────────────────────────────────────────────────────────────── */
/* Sparkline                                                                  */
/* Tiny area chart for KPI cards. SVG only, no deps. Respects reduced-motion. */
/* ────────────────────────────────────────────────────────────────────────── */

export function Sparkline({
    values,
    tone = 'primary',
    height = 28,
    className,
}: {
    values: number[];
    tone?: 'primary' | 'ok' | 'warn' | 'danger' | 'info';
    height?: number;
    className?: string;
}) {
    if (!values || values.length === 0) {
        return <div style={{ height }} />;
    }
    const width = 96;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(1, max - min);
    const step = width / (values.length - 1 || 1);
    const pointsPx = values.map((v, i) => {
        const x = i * step;
        const y = height - ((v - min) / span) * (height - 4) - 2;
        return { x, y };
    });
    const linePath = pointsPx
        .map((p, i) => (i === 0 ? `M${p.x.toFixed(2)},${p.y.toFixed(2)}` : `L${p.x.toFixed(2)},${p.y.toFixed(2)}`))
        .join(' ');
    const areaPath = `${linePath} L${width.toFixed(2)},${height} L0,${height} Z`;

    const inkVar = {
        primary: 'var(--dash-primary-ink)',
        ok: 'var(--dash-ok-ink)',
        warn: 'var(--dash-warn-ink)',
        danger: 'var(--dash-danger-ink)',
        info: 'var(--dash-info-ink)',
    }[tone];
    const tintVar = {
        primary: 'var(--dash-primary-tint)',
        ok: 'var(--dash-ok-tint)',
        warn: 'var(--dash-warn-tint)',
        danger: 'var(--dash-danger-tint)',
        info: 'var(--dash-info-tint)',
    }[tone];
    const gradId = React.useId();
    return (
        <svg
            aria-hidden
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            preserveAspectRatio="none"
            className={cn('block', className)}
        >
            <defs>
                <linearGradient id={`spark-${gradId}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={tintVar} stopOpacity="1" />
                    <stop offset="100%" stopColor={tintVar} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#spark-${gradId})`} />
            <path
                d={linePath}
                fill="none"
                stroke={inkVar}
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* DeltaChip — tiny up/down chip with semantic tint                           */
/* ────────────────────────────────────────────────────────────────────────── */

export function DeltaChip({
    label,
    tone = 'neutral',
}: {
    label: string;
    tone?: 'up' | 'down' | 'neutral';
}) {
    const color =
        tone === 'up'
            ? 'var(--dash-ok-ink)'
            : tone === 'down'
            ? 'var(--dash-danger-ink)'
            : 'var(--dash-ink-4)';
    const bg =
        tone === 'up'
            ? 'var(--dash-ok-tint)'
            : tone === 'down'
            ? 'var(--dash-danger-tint)'
            : 'var(--dash-ring-subtle)';
    return (
        <span
            className="inline-flex h-[20px] items-center gap-1 rounded-full px-1.5 text-[11px] font-semibold leading-none"
            style={{ color, background: bg }}
        >
            {label}
        </span>
    );
}
