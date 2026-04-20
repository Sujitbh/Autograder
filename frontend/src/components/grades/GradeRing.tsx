'use client';

import * as React from 'react';
import { toneForPercentage, toneInk, toneTint } from './utils';

/**
 * Donut ring showing the student's average percentage, tone-colored by band.
 * - No grades yet → faint track + "No grades yet" microcopy in center.
 * - Graded → filled arc proportional to percentage, large % + tone-ink.
 *
 * Size and stroke are configurable, defaults sized for the summary hero.
 */
export function GradeRing({
    average,
    graded,
    total,
    size = 148,
    stroke = 12,
    className,
}: {
    average: number | null;
    graded: number;
    total: number;
    size?: number;
    stroke?: number;
    className?: string;
}) {
    const r = (size - stroke) / 2;
    const circumference = 2 * Math.PI * r;
    const hasGrades = average !== null && average !== undefined;
    const pct = Math.max(0, Math.min(100, hasGrades ? average! : 0));
    const offset = circumference * (1 - pct / 100);
    const tone = toneForPercentage(hasGrades ? average : null);
    const inkColor = toneInk(tone);
    const tintColor = toneTint(tone);

    return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
                position: 'relative',
                flexShrink: 0,
            }}
            role="img"
            aria-label={
                hasGrades
                    ? `Average grade ${Math.round(average!)} percent across ${graded} of ${total} assignments`
                    : `No grades yet, ${graded} of ${total} assignments graded`
            }
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{ transform: 'rotate(-90deg)', display: 'block' }}
            >
                {/* track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke="var(--dash-ring-subtle)"
                    strokeWidth={stroke}
                />
                {/* filled arc */}
                {hasGrades && (
                    <>
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={r}
                            fill="none"
                            stroke={tintColor}
                            strokeWidth={stroke}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            style={{ filter: 'blur(0.5px)' }}
                        />
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={r}
                            fill="none"
                            stroke={inkColor}
                            strokeWidth={Math.max(2, stroke - 6)}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                    </>
                )}
            </svg>

            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                    textAlign: 'center',
                }}
            >
                {hasGrades ? (
                    <>
                        <div
                            className="font-semibold tracking-[-0.02em]"
                            style={{
                                color: inkColor,
                                fontSize: 'clamp(22px, 2.4vw, 30px)',
                                lineHeight: '1.05',
                            }}
                        >
                            {Math.round(average!)}
                            <span
                                className="font-semibold"
                                style={{
                                    fontSize: '0.55em',
                                    marginLeft: 1,
                                    color: inkColor,
                                    opacity: 0.7,
                                }}
                            >
                                %
                            </span>
                        </div>
                        <div
                            className="text-[11px] font-medium leading-[14px]"
                            style={{ color: 'var(--dash-ink-4)', marginTop: 2 }}
                        >
                            {graded} of {total} graded
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className="text-[12px] font-semibold uppercase leading-[14px] tracking-[0.08em]"
                            style={{ color: 'var(--dash-ink-4)' }}
                        >
                            Average
                        </div>
                        <div
                            className="text-[13px] font-semibold leading-[18px]"
                            style={{ color: 'var(--dash-ink-2)', marginTop: 2 }}
                        >
                            No grades yet
                        </div>
                        <div
                            className="text-[11px] leading-[14px]"
                            style={{ color: 'var(--dash-ink-4)', marginTop: 2 }}
                        >
                            0 of {total} graded
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
