'use client';

import * as React from 'react';

type Variant = 'no-assignments' | 'no-results' | 'filter-empty';

function Glyph({ variant }: { variant: Variant }) {
    if (variant === 'no-assignments') {
        return (
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden>
                <rect
                    x="18"
                    y="14"
                    width="60"
                    height="72"
                    rx="10"
                    fill="var(--dash-surface-2)"
                    stroke="var(--dash-ring-strong)"
                    strokeWidth="1.5"
                />
                <path
                    d="M30 32h36M30 44h36M30 56h24"
                    stroke="var(--dash-ring-strong)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <circle
                    cx="68"
                    cy="70"
                    r="12"
                    fill="var(--dash-primary-tint)"
                    stroke="var(--dash-primary-ink)"
                    strokeWidth="1.5"
                />
                <path
                    d="M63 70l4 4 7-8"
                    stroke="var(--dash-primary-ink)"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }
    if (variant === 'no-results') {
        return (
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden>
                <circle
                    cx="42"
                    cy="42"
                    r="20"
                    stroke="var(--dash-ring-strong)"
                    strokeWidth="2"
                    fill="var(--dash-surface-2)"
                />
                <path
                    d="M58 58l14 14"
                    stroke="var(--dash-ink-3)"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <path
                    d="M34 42h16M42 34v16"
                    stroke="var(--dash-ring-strong)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </svg>
        );
    }
    return (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden>
            <rect
                x="14"
                y="20"
                width="68"
                height="16"
                rx="8"
                fill="var(--dash-surface-2)"
                stroke="var(--dash-ring-strong)"
                strokeWidth="1.5"
            />
            <rect
                x="14"
                y="42"
                width="52"
                height="16"
                rx="8"
                fill="var(--dash-surface-2)"
                stroke="var(--dash-ring-strong)"
                strokeWidth="1.5"
            />
            <rect
                x="14"
                y="64"
                width="40"
                height="16"
                rx="8"
                fill="var(--dash-surface-2)"
                stroke="var(--dash-ring-strong)"
                strokeWidth="1.5"
            />
            <path
                d="M74 56l-8 8"
                stroke="var(--dash-primary-ink)"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function GradesEmptyState({
    variant,
    title,
    hint,
    action,
}: {
    variant: Variant;
    title: string;
    hint?: string;
    action?: { label: string; onClick: () => void };
}) {
    return (
        <div
            className="flex flex-col items-center justify-center rounded-[16px] p-8 text-center"
            style={{
                background: 'var(--dash-surface-2)',
                boxShadow:
                    'inset 0 0 0 1px var(--dash-ring-subtle), var(--dash-shadow-soft)',
            }}
            role="status"
        >
            <Glyph variant={variant} />
            <p
                className="mt-4 text-[15px] font-semibold leading-[20px]"
                style={{ color: 'var(--dash-ink-1)' }}
            >
                {title}
            </p>
            {hint && (
                <p
                    className="mt-1 max-w-[420px] text-[13px] leading-[18px]"
                    style={{ color: 'var(--dash-ink-3)' }}
                >
                    {hint}
                </p>
            )}
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="mt-4 inline-flex h-[34px] items-center rounded-full px-4 text-[12.5px] font-semibold"
                    style={{
                        background: 'var(--dash-primary-tint)',
                        color: 'var(--dash-primary-ink)',
                        boxShadow:
                            'inset 0 0 0 1px color-mix(in srgb, var(--dash-primary-ink) 22%, transparent)',
                    }}
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
