'use client';

import * as React from 'react';
import { cn } from '@/components/ui/utils';

/**
 * Hero — eyebrow + greeting + one-line intelligent summary.
 * Layered composition via a single radial maroon wash behind the type,
 * no photo, no giant banner. Calm, Linear-grade.
 */
export function Hero({
    eyebrow,
    greeting,
    summary,
    rightSlot,
    className,
}: {
    eyebrow: string;
    greeting: string;
    summary: string;
    rightSlot?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-[16px] p-5 md:p-7',
                className,
            )}
            style={{
                background: 'var(--dash-surface-3)',
                boxShadow:
                    'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-raised)',
            }}
        >
            {/* Quiet maroon wash — never shouts, never dominates */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(900px 260px at 0% 0%, var(--dash-primary-tint) 0%, transparent 55%)',
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                    background:
                        'linear-gradient(90deg, transparent, var(--dash-ring-strong) 40%, var(--dash-ring-strong) 60%, transparent)',
                }}
            />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex min-w-0 flex-col gap-2">
                    <p
                        className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.1em]"
                        style={{ color: 'var(--dash-ink-4)' }}
                    >
                        {eyebrow}
                    </p>
                    <h1
                        className="font-semibold tracking-[-0.02em]"
                        style={{
                            color: 'var(--dash-ink-1)',
                            fontSize: 'clamp(24px, 3vw, 32px)',
                            lineHeight: '1.15',
                        }}
                    >
                        {greeting}
                    </h1>
                    <p
                        className="text-[14px] leading-[20px]"
                        style={{ color: 'var(--dash-ink-3)' }}
                    >
                        {summary}
                    </p>
                </div>
                {rightSlot && (
                    <div className="relative w-full shrink-0 md:w-auto md:max-w-[380px]">
                        {rightSlot}
                    </div>
                )}
            </div>
        </div>
    );
}
