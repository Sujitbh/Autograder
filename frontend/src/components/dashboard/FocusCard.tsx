'use client';

import * as React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/components/ui/utils';

/**
 * FocusCard — the single most important thing this user should do next.
 * Sits in the top-right of the hero as a compact CTA card.
 * When there's nothing urgent, renders a calm "clear" state.
 */
export function FocusCard({
    variant,
    eyebrow,
    title,
    hint,
    cta,
    onClick,
    className,
}: {
    variant: 'urgent' | 'calm';
    eyebrow: string;
    title: string;
    hint?: string;
    cta?: string;
    onClick?: () => void;
    className?: string;
}) {
    const interactive = Boolean(onClick);
    const baseBg =
        variant === 'urgent' ? 'var(--color-primary)' : 'var(--dash-surface-2)';
    const fg =
        variant === 'urgent' ? '#FFFFFF' : 'var(--dash-ink-2)';
    const eyebrowColor =
        variant === 'urgent'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'var(--dash-ink-4)';
    const hintColor =
        variant === 'urgent'
            ? 'rgba(255, 255, 255, 0.84)'
            : 'var(--dash-ink-4)';

    const Comp = (interactive ? 'button' : 'div') as React.ElementType;
    return (
        <Comp
            type={interactive ? 'button' : undefined}
            onClick={onClick}
            aria-label={interactive ? `${title} — ${cta ?? 'open'}` : undefined}
            className={cn(
                'group relative flex w-full flex-col gap-3 overflow-hidden rounded-[12px] px-4 py-4 text-left',
                'transition-all duration-200',
                interactive &&
                    'hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-none',
                className,
            )}
            style={{
                background: baseBg,
                color: fg,
                boxShadow:
                    variant === 'urgent'
                        ? 'inset 0 0 0 1px rgba(255,255,255,0.14), 0 8px 24px color-mix(in srgb, var(--color-primary) 25%, transparent)'
                        : 'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-soft)',
            }}
        >
            {/* Subtle top-light gradient on urgent variant only */}
            {variant === 'urgent' && (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)',
                    }}
                />
            )}

            <div className="relative flex items-center gap-2">
                {variant === 'calm' && (
                    <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--dash-ok-ink)' }} />
                )}
                <span
                    className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.08em]"
                    style={{ color: eyebrowColor }}
                >
                    {eyebrow}
                </span>
            </div>

            <div className="relative flex flex-col gap-0.5">
                <p
                    className="line-clamp-2 text-[15px] font-semibold leading-[20px]"
                    style={{ color: fg }}
                >
                    {title}
                </p>
                {hint && (
                    <p
                        className="text-[12px] leading-[16px]"
                        style={{ color: hintColor }}
                    >
                        {hint}
                    </p>
                )}
            </div>

            {cta && (
                <div
                    className={cn(
                        'relative mt-1 inline-flex items-center gap-1 text-[12px] font-semibold leading-[16px]',
                        variant === 'urgent' && 'group-hover:gap-2 transition-[gap]',
                    )}
                    style={{ color: fg }}
                >
                    {cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                </div>
            )}
        </Comp>
    );
}
