'use client';

import * as React from 'react';
import { cn } from '@/components/ui/utils';
import { Sparkline, DeltaChip } from './primitives';

export type KpiTone = 'primary' | 'ok' | 'warn' | 'danger' | 'info' | 'neutral';

/**
 * KpiCard — Display-size number with eyebrow label, optional delta chip,
 * and a subtle sparkline. The 0-state is never a big "0" — it renders an
 * em-dash so it reads as "absence of data" rather than "you scored 0".
 */
export function KpiCard({
    label,
    value,
    delta,
    deltaTone,
    sparkline,
    tone = 'primary',
    footer,
    className,
}: {
    label: string;
    value: number | string | null;
    delta?: string;
    deltaTone?: 'up' | 'down' | 'neutral';
    sparkline?: number[];
    tone?: KpiTone;
    footer?: string;
    className?: string;
}) {
    // Render rules for the primary value:
    //   null / undefined  → em-dash
    //   0                 → em-dash + "All clear" microcopy
    //   '' (empty string) → em-dash
    //   everything else   → as-is
    let display: React.ReactNode;
    let calmFooter = footer;
    if (value === null || value === undefined || value === '') {
        display = '—';
    } else if (value === 0) {
        display = '—';
        calmFooter = footer ?? 'All clear';
    } else {
        display = value;
    }

    const sparkTone =
        tone === 'neutral' ? 'info' : (tone as Exclude<KpiTone, 'neutral'>);

    return (
        <div
            className={cn(
                'group relative flex flex-col justify-between gap-4 overflow-hidden rounded-[12px] p-4',
                'transition-all duration-200',
                'hover:-translate-y-[1px]',
                className,
            )}
            style={{
                background: 'var(--dash-surface-2)',
                boxShadow:
                    'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-soft)',
            }}
        >
            <div className="flex items-start justify-between gap-2">
                <span
                    className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.08em]"
                    style={{ color: 'var(--dash-ink-4)' }}
                >
                    {label}
                </span>
                {delta && <DeltaChip label={delta} tone={deltaTone ?? 'neutral'} />}
            </div>

            <div className="flex items-end justify-between gap-3">
                <div
                    className="flex items-baseline gap-1 font-semibold tracking-[-0.02em]"
                    style={{
                        color:
                            value === 0 || value === null || value === undefined
                                ? 'var(--dash-ink-3)'
                                : 'var(--dash-ink-1)',
                        fontSize: 'clamp(22px, 2.2vw, 30px)',
                        lineHeight: '1.1',
                    }}
                >
                    {display}
                </div>
                {sparkline && sparkline.length > 0 && (
                    <Sparkline values={sparkline} tone={sparkTone} />
                )}
            </div>

            {calmFooter && (
                <p
                    className="text-[11px] leading-[14px]"
                    style={{ color: 'var(--dash-ink-4)' }}
                >
                    {calmFooter}
                </p>
            )}
        </div>
    );
}
