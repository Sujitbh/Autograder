'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    AlertTriangle,
    Clock,
    GraduationCap,
    ClipboardList,
    FileText,
    Send,
} from 'lucide-react';
import type {
    StudentTodoItem,
    FacultyTodoItem,
} from '@/services/api';
import { TodoRow } from './TodoRow';
import { EmptyState } from './EmptyState';
import { formatDayHeader, urgencyFor, type UrgencyBand } from './utils';

type BandKey = Extract<UrgencyBand, 'today' | 'thisWeek' | 'later'>;

const BAND_LABELS: Record<BandKey, string> = {
    today: 'Today',
    thisWeek: 'This Week',
    later: 'Later',
};

function BandHeader({ label, count }: { label: string; count: number }) {
    return (
        <div
            className="mb-1.5 mt-1 flex items-center gap-2 px-1.5"
            role="presentation"
        >
            <span
                className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.08em]"
                style={{ color: 'var(--dash-ink-4)' }}
            >
                {label}
            </span>
            <span
                className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none"
                style={{
                    background: 'var(--dash-ring-subtle)',
                    color: 'var(--dash-ink-3)',
                }}
            >
                {count}
            </span>
            <div
                aria-hidden
                className="dash-hairline h-px flex-1"
            />
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Student                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

export function StudentTodoList({ todos }: { todos: StudentTodoItem[] }) {
    const router = useRouter();

    if (todos.length === 0) {
        return (
            <EmptyState
                variant="caught-up"
                title="You're all caught up."
                hint="When assignments come due, they will land here."
            />
        );
    }

    const bucketed: Record<BandKey | 'graded', StudentTodoItem[]> = {
        today: [],
        thisWeek: [],
        later: [],
        graded: [],
    };
    todos.forEach((t) => {
        if (t.kind === 'graded') {
            bucketed.graded.push(t);
            return;
        }
        const band = urgencyFor(t.due_date);
        if (band === 'today' || band === 'thisWeek' || band === 'later') {
            bucketed[band].push(t);
        } else {
            // No due date: park under Later so it's still visible
            bucketed.later.push(t);
        }
    });

    const renderActionable = (t: Extract<StudentTodoItem, { kind: 'missing' | 'upcoming' }>) => {
        const isMissing = t.kind === 'missing';
        const due = t.due_date ? formatDayHeader(t.due_date) : 'No due date';
        return (
            <TodoRow
                key={`${t.kind}-${t.assignment_id}`}
                kind={isMissing ? 'missing' : 'upcoming'}
                icon={
                    isMissing ? (
                        <AlertTriangle className="h-4 w-4" />
                    ) : (
                        <Clock className="h-4 w-4" />
                    )
                }
                title={t.title}
                subtitle={
                    isMissing
                        ? `Missing — was due ${due}`
                        : `Due ${due}`
                }
                course={t.course}
                trail={{
                    label: isMissing ? 'Missing' : due,
                    tone: isMissing ? 'danger' : 'warn',
                }}
                hoverCta={isMissing ? 'Submit' : 'Open'}
                onClick={() => {
                    if (t.course) {
                        router.push(
                            `/student/courses/${t.course.id}/assignments/${t.assignment_id}`,
                        );
                    }
                }}
            />
        );
    };

    return (
        <div className="flex flex-col gap-0.5">
            {(['today', 'thisWeek', 'later'] as BandKey[]).map((band) => {
                const items = bucketed[band];
                if (items.length === 0) return null;
                return (
                    <div key={band} className="flex flex-col gap-0.5">
                        <BandHeader label={BAND_LABELS[band]} count={items.length} />
                        {items.map((t) => {
                            if (t.kind === 'graded') return null;
                            return renderActionable(t);
                        })}
                    </div>
                );
            })}

            {bucketed.graded.length > 0 && (
                <div className="flex flex-col gap-0.5">
                    <BandHeader
                        label="Recently graded"
                        count={bucketed.graded.length}
                    />
                    {bucketed.graded.map((t) => {
                        if (t.kind !== 'graded') return null;
                        const pct =
                            t.score != null && t.max_score && t.max_score > 0
                                ? Math.round((t.score / t.max_score) * 100)
                                : null;
                        return (
                            <TodoRow
                                key={`graded-${t.submission_id}`}
                                kind="graded"
                                icon={<GraduationCap className="h-4 w-4" />}
                                title={t.title}
                                subtitle={
                                    t.graded_at
                                        ? `Graded ${formatDayHeader(t.graded_at)}`
                                        : 'Recently graded'
                                }
                                course={t.course}
                                trail={
                                    pct != null
                                        ? {
                                              label: `${pct}%`,
                                              tone:
                                                  pct >= 90
                                                      ? 'ok'
                                                      : pct >= 50
                                                      ? 'warn'
                                                      : 'danger',
                                          }
                                        : t.score != null && t.max_score
                                        ? { label: `${t.score}/${t.max_score}`, tone: 'neutral' }
                                        : { label: 'Graded', tone: 'ok' }
                                }
                                hoverCta="Review"
                                onClick={() => {
                                    if (t.course) {
                                        router.push(
                                            `/student/courses/${t.course.id}/assignments/${t.assignment_id}`,
                                        );
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Faculty                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

export function FacultyTodoList({ todos }: { todos: FacultyTodoItem[] }) {
    const router = useRouter();

    if (todos.length === 0) {
        return (
            <EmptyState
                variant="quiet-queue"
                title="Nothing needs you right now."
                hint="Grading queues and draft assignments will show up here."
            />
        );
    }

    // Group by functional band, not strictly by date:
    //  - Today:    to_grade items + anything closing today/overdue
    //  - This Week: closing within 7 days
    //  - Later:    drafts + everything else
    const today: FacultyTodoItem[] = [];
    const thisWeek: FacultyTodoItem[] = [];
    const later: FacultyTodoItem[] = [];

    todos.forEach((t) => {
        if (t.kind === 'to_grade') {
            today.push(t);
            return;
        }
        if (t.kind === 'closing') {
            const band = urgencyFor(t.due_date);
            if (band === 'today') today.push(t);
            else if (band === 'thisWeek') thisWeek.push(t);
            else later.push(t);
            return;
        }
        later.push(t);
    });

    const renderRow = (t: FacultyTodoItem) => {
        if (t.kind === 'to_grade') {
            return (
                <TodoRow
                    key={`grade-${t.assignment_id}`}
                    kind="to_grade"
                    icon={<ClipboardList className="h-4 w-4" />}
                    title={t.title}
                    subtitle={`${t.count} submission${t.count === 1 ? '' : 's'} waiting`}
                    course={t.course}
                    trail={{
                        label: `${t.count} to grade`,
                        tone: 'primary',
                    }}
                    hoverCta="Open queue"
                    onClick={() => {
                        if (t.course) {
                            router.push(`/courses/${t.course.id}/grading`);
                        }
                    }}
                />
            );
        }
        if (t.kind === 'draft') {
            return (
                <TodoRow
                    key={`draft-${t.assignment_id}`}
                    kind="draft"
                    icon={<FileText className="h-4 w-4" />}
                    title={t.title}
                    subtitle="Draft — not published yet"
                    course={t.course}
                    trail={{ label: 'Draft', tone: 'neutral' }}
                    hoverCta="Finish"
                    onClick={() => {
                        if (t.course) {
                            router.push(
                                `/courses/${t.course.id}/assignments/${t.assignment_id}`,
                            );
                        }
                    }}
                />
            );
        }
        // closing
        const due = t.due_date ? formatDayHeader(t.due_date) : '—';
        return (
            <TodoRow
                key={`closing-${t.assignment_id}`}
                kind="closing"
                icon={<Send className="h-4 w-4" />}
                title={t.title}
                subtitle={`Closes ${due}`}
                course={t.course}
                trail={{ label: due, tone: 'warn' }}
                hoverCta="Review"
                onClick={() => {
                    if (t.course) {
                        router.push(
                            `/courses/${t.course.id}/assignments/${t.assignment_id}`,
                        );
                    }
                }}
            />
        );
    };

    return (
        <div className="flex flex-col gap-0.5">
            {today.length > 0 && (
                <div className="flex flex-col gap-0.5">
                    <BandHeader label="Today" count={today.length} />
                    {today.map(renderRow)}
                </div>
            )}
            {thisWeek.length > 0 && (
                <div className="flex flex-col gap-0.5">
                    <BandHeader label="This Week" count={thisWeek.length} />
                    {thisWeek.map(renderRow)}
                </div>
            )}
            {later.length > 0 && (
                <div className="flex flex-col gap-0.5">
                    <BandHeader label="Later" count={later.length} />
                    {later.map(renderRow)}
                </div>
            )}
        </div>
    );
}
