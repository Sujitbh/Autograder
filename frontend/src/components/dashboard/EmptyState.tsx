'use client';

import * as React from 'react';
import { GhostButton } from './primitives';
import { cn } from '@/components/ui/utils';

export type EmptyStateVariant =
    | 'caught-up' // student to-do empty
    | 'quiet-queue' // faculty to-do empty
    | 'no-activity'
    | 'no-courses';

/**
 * Composed glyph: not a lone lucide icon.
 * Each variant is hand-arranged (ring + chip + checkmark, stacked pages, etc.)
 * so the empty state feels intentional rather than missing content.
 */
function Glyph({ variant }: { variant: EmptyStateVariant }) {
    const okInk = 'var(--dash-ok-ink)';
    const okSoft = 'var(--dash-ok-tint)';
    const ringStrong = 'var(--dash-ring-strong)';
    const ringSubtle = 'var(--dash-ring-subtle)';
    const ink3 = 'var(--dash-ink-3)';
    const ink4 = 'var(--dash-ink-4)';
    const primaryInk = 'var(--dash-primary-ink)';

    if (variant === 'caught-up') {
        return (
            <svg width="88" height="72" viewBox="0 0 88 72" aria-hidden>
                <circle cx="44" cy="36" r="26" fill={okSoft} />
                <circle cx="44" cy="36" r="26" fill="none" stroke={ringStrong} strokeWidth="1" />
                <path
                    d="M33 36 L41 44 L56 28"
                    fill="none"
                    stroke={okInk}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="74" cy="18" r="4" fill={okInk} opacity="0.65" />
                <circle cx="14" cy="54" r="3" fill={okInk} opacity="0.45" />
            </svg>
        );
    }

    if (variant === 'quiet-queue') {
        return (
            <svg width="96" height="72" viewBox="0 0 96 72" aria-hidden>
                <rect x="18" y="16" width="44" height="40" rx="6" fill="var(--dash-surface-3)" stroke={ringStrong} />
                <rect x="26" y="12" width="44" height="40" rx="6" fill="var(--dash-surface-2)" stroke={ringStrong} />
                <rect x="34" y="22" width="28" height="3" rx="1.5" fill={ink4} opacity="0.55" />
                <rect x="34" y="30" width="20" height="3" rx="1.5" fill={ink4} opacity="0.35" />
                <circle cx="76" cy="20" r="9" fill={okSoft} />
                <path
                    d="M72 20 L75 23 L81 17"
                    fill="none"
                    stroke={okInk}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    if (variant === 'no-activity') {
        return (
            <svg width="96" height="72" viewBox="0 0 96 72" aria-hidden>
                <line x1="20" y1="18" x2="20" y2="62" stroke={ringStrong} strokeWidth="1" strokeDasharray="2 3" />
                <circle cx="20" cy="26" r="4" fill="var(--dash-surface-3)" stroke={ringStrong} />
                <circle cx="20" cy="44" r="4" fill="var(--dash-surface-3)" stroke={ringStrong} />
                <circle cx="20" cy="60" r="3" fill="var(--dash-surface-3)" stroke={ringSubtle} />
                <rect x="32" y="22" width="46" height="3" rx="1.5" fill={ink4} opacity="0.45" />
                <rect x="32" y="40" width="32" height="3" rx="1.5" fill={ink4} opacity="0.3" />
                <rect x="32" y="56" width="22" height="3" rx="1.5" fill={ink4} opacity="0.2" />
            </svg>
        );
    }

    // no-courses
    return (
        <svg width="96" height="72" viewBox="0 0 96 72" aria-hidden>
            <rect x="12" y="22" width="26" height="34" rx="4" fill="var(--dash-cat-1)" opacity="0.22" />
            <rect x="12" y="22" width="26" height="8" rx="4 4 0 0" fill={primaryInk} opacity="0.7" />
            <rect x="44" y="16" width="26" height="40" rx="4" fill="var(--dash-cat-3)" opacity="0.22" />
            <rect x="44" y="16" width="26" height="8" rx="4 4 0 0" fill="var(--dash-cat-3)" opacity="0.8" />
            <rect x="74" y="28" width="14" height="28" rx="4" fill="var(--dash-cat-2)" opacity="0.22" />
            <rect x="74" y="28" width="14" height="8" rx="4 4 0 0" fill="var(--dash-cat-2)" opacity="0.8" />
            <line x1="6" y1="62" x2="90" y2="62" stroke={ink3} opacity="0.18" strokeWidth="1" />
        </svg>
    );
}

/**
 * Composed empty state: glyph + one-line sentence + optional ghost action.
 * No scolding, no exclamation marks, no emoji.
 */
export function EmptyState({
    variant,
    title,
    hint,
    action,
    className,
}: {
    variant: EmptyStateVariant;
    title: string;
    hint?: string;
    action?: { label: string; onClick: () => void };
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-[10px] px-4 py-8 text-center',
                className,
            )}
            style={{
                background:
                    'color-mix(in srgb, var(--dash-ink-5) 4%, transparent)',
                boxShadow: 'inset 0 0 0 1px var(--dash-ring-subtle)',
            }}
        >
            <Glyph variant={variant} />
            <div className="flex flex-col gap-1">
                <p
                    className="text-[13px] font-semibold leading-[20px]"
                    style={{ color: 'var(--dash-ink-2)' }}
                >
                    {title}
                </p>
                {hint && (
                    <p
                        className="text-[12px] leading-[16px]"
                        style={{ color: 'var(--dash-ink-4)' }}
                    >
                        {hint}
                    </p>
                )}
            </div>
            {action && (
                <GhostButton tone="primary" onClick={action.onClick}>
                    {action.label}
                </GhostButton>
            )}
        </div>
    );
}
