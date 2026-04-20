'use client';

import * as React from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { cn } from '@/components/ui/utils';

export type GradeFilter = 'all' | 'graded' | 'pending' | 'not_submitted';
export type GradeSort =
    | 'due_asc'
    | 'name_asc'
    | 'name_desc'
    | 'score_desc'
    | 'score_asc'
    | 'status';

const SORT_OPTIONS: Array<{ value: GradeSort; label: string }> = [
    { value: 'due_asc', label: 'Sort: Due date (soonest)' },
    { value: 'score_desc', label: 'Sort: Highest score' },
    { value: 'score_asc', label: 'Sort: Lowest score' },
    { value: 'name_asc', label: 'Sort: Name A–Z' },
    { value: 'name_desc', label: 'Sort: Name Z–A' },
    { value: 'status', label: 'Sort: Status' },
];

interface FilterPillProps {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
    tone?: 'neutral' | 'danger';
}

function FilterPill({ label, count, active, onClick, tone = 'neutral' }: FilterPillProps) {
    const isDanger = tone === 'danger' && count > 0;
    const activeInk = isDanger ? 'var(--dash-danger-ink)' : 'var(--dash-primary-ink)';
    const activeBg = isDanger ? 'var(--dash-danger-tint)' : 'var(--dash-primary-tint)';
    const activeRing = isDanger
        ? 'color-mix(in srgb, var(--dash-danger-ink) 26%, transparent)'
        : 'color-mix(in srgb, var(--dash-primary-ink) 26%, transparent)';
    const idleRing = isDanger
        ? 'color-mix(in srgb, var(--dash-danger-ink) 18%, transparent)'
        : 'var(--dash-ring-strong)';

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                'inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-full pl-3 pr-2 text-[12px] font-semibold leading-none',
                'transition-colors duration-150',
                active
                    ? 'hover:bg-[color-mix(in_srgb,var(--dash-primary-ink)_10%,transparent)]'
                    : 'hover:bg-[var(--dash-ring-subtle)]',
            )}
            style={{
                color: active
                    ? activeInk
                    : isDanger
                    ? 'var(--dash-danger-ink)'
                    : 'var(--dash-ink-2)',
                background: active ? activeBg : 'var(--dash-surface-2)',
                boxShadow: `inset 0 0 0 1px ${active ? activeRing : idleRing}`,
            }}
        >
            {label}
            <span
                className="inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-semibold tabular-nums"
                style={{
                    background: active
                        ? 'color-mix(in srgb, ' + activeInk + ' 16%, transparent)'
                        : 'var(--dash-ring-subtle)',
                    color: active ? activeInk : 'var(--dash-ink-3)',
                }}
            >
                {count}
            </span>
        </button>
    );
}

export function GradesControls({
    query,
    onQueryChange,
    filter,
    onFilterChange,
    sort,
    onSortChange,
    counts,
    overdueCount,
}: {
    query: string;
    onQueryChange: (v: string) => void;
    filter: GradeFilter;
    onFilterChange: (f: GradeFilter) => void;
    sort: GradeSort;
    onSortChange: (s: GradeSort) => void;
    counts: { all: number; graded: number; pending: number; notSubmitted: number };
    overdueCount: number;
}) {
    return (
        <div
            className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center"
            role="toolbar"
            aria-label="Filter and sort grades"
        >
            {/* Search */}
            <div className="relative min-w-[260px] flex-1 lg:max-w-[380px]">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: 'var(--dash-ink-4)' }}
                    aria-hidden
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Search assignment name…"
                    aria-label="Search assignments"
                    className="h-[38px] w-full rounded-[10px] pl-9 pr-9 text-[13px] leading-[20px] outline-none transition-colors"
                    style={{
                        background: 'var(--dash-surface-2)',
                        color: 'var(--dash-ink-1)',
                        boxShadow: `inset 0 0 0 1px var(--dash-ring-strong)`,
                    }}
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => onQueryChange('')}
                        aria-label="Clear search"
                        className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full hover:bg-[var(--dash-ring-subtle)]"
                        style={{ color: 'var(--dash-ink-4)' }}
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
                <FilterPill
                    label="All"
                    count={counts.all}
                    active={filter === 'all'}
                    onClick={() => onFilterChange('all')}
                />
                <FilterPill
                    label="Graded"
                    count={counts.graded}
                    active={filter === 'graded'}
                    onClick={() => onFilterChange('graded')}
                />
                <FilterPill
                    label="Pending"
                    count={counts.pending}
                    active={filter === 'pending'}
                    onClick={() => onFilterChange('pending')}
                />
                <FilterPill
                    label={
                        overdueCount > 0
                            ? `Not Submitted · ${overdueCount} overdue`
                            : 'Not Submitted'
                    }
                    count={counts.notSubmitted}
                    active={filter === 'not_submitted'}
                    onClick={() => onFilterChange('not_submitted')}
                    tone={overdueCount > 0 ? 'danger' : 'neutral'}
                />
            </div>

            {/* Sort */}
            <div className="relative ml-auto min-w-[200px]">
                <select
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value as GradeSort)}
                    aria-label="Sort assignments"
                    className="h-[38px] w-full appearance-none rounded-[10px] pl-3 pr-8 text-[13px] outline-none"
                    style={{
                        background: 'var(--dash-surface-2)',
                        color: 'var(--dash-ink-2)',
                        boxShadow: `inset 0 0 0 1px var(--dash-ring-strong)`,
                    }}
                >
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: 'var(--dash-ink-4)' }}
                    aria-hidden
                />
            </div>
        </div>
    );
}
