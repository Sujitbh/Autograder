/**
 * Shared types + helpers for the student grades page.
 * Single source of truth for:
 *   - the backend payload shape,
 *   - status derivation,
 *   - tone mapping by percentage,
 *   - human-friendly due-date labels.
 */

export interface GradeAssignment {
    assignment_id: number;
    assignment_name: string;
    score: number | null;
    max_score: number | null;
    percentage: number | null;
    submitted: boolean;
    status?: string | null;
    feedback?: string | null;
    graded_at?: string | null;
    due_date?: string | null;
    is_overdue?: boolean;
}

export interface GradesPayload {
    assignments: GradeAssignment[];
    averageScore: number | null;
    graded_count: number;
    total_count: number;
}

export type GradeStatus = 'Graded' | 'Pending Grade' | 'Not Submitted';

export function statusOf(a: GradeAssignment): GradeStatus {
    if (a.percentage !== null && a.percentage !== undefined) return 'Graded';
    if (a.submitted) return 'Pending Grade';
    return 'Not Submitted';
}

export type Tone = 'ok' | 'info' | 'warn' | 'danger' | 'neutral';

/**
 * Semantic tone by percentage — mirrors the dashboard palette.
 * ≥85 → ok, ≥70 → info, ≥50 → warn, <50 → danger, null → neutral.
 */
export function toneForPercentage(pct: number | null | undefined): Tone {
    if (pct === null || pct === undefined) return 'neutral';
    if (pct >= 85) return 'ok';
    if (pct >= 70) return 'info';
    if (pct >= 50) return 'warn';
    return 'danger';
}

export function toneInk(tone: Tone): string {
    return {
        ok: 'var(--dash-ok-ink)',
        info: 'var(--dash-info-ink)',
        warn: 'var(--dash-warn-ink)',
        danger: 'var(--dash-danger-ink)',
        neutral: 'var(--dash-ink-3)',
    }[tone];
}

export function toneTint(tone: Tone): string {
    return {
        ok: 'var(--dash-ok-tint)',
        info: 'var(--dash-info-tint)',
        warn: 'var(--dash-warn-tint)',
        danger: 'var(--dash-danger-tint)',
        neutral: 'var(--dash-ring-subtle)',
    }[tone];
}

export function toneSoft(tone: Tone): string {
    return {
        ok: 'var(--dash-ok-soft)',
        info: 'var(--dash-info-soft)',
        warn: 'var(--dash-warn-soft)',
        danger: 'var(--dash-danger-soft)',
        neutral: 'var(--dash-ring-strong)',
    }[tone];
}

/**
 * Humanized due-date label. Examples:
 *   "Due in 3 days"
 *   "Due today"
 *   "Due tomorrow"
 *   "Overdue by 2 days"
 *   "Due Apr 22"          (further out than a week)
 */
export function dueLabel(iso: string | null | undefined, now: Date = new Date()): string | null {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    const startOfNow = new Date(now);
    startOfNow.setHours(0, 0, 0, 0);
    const startOfDue = new Date(d);
    startOfDue.setHours(0, 0, 0, 0);
    const diffDays = Math.round(
        (startOfDue.getTime() - startOfNow.getTime()) / 86400000,
    );
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays === -1) return 'Overdue by 1 day';
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays <= 6) return `Due in ${diffDays} days`;
    return `Due ${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
}

/**
 * Pick the "next due" unsubmitted assignment for the Focus mini-card.
 * Prefers overdue items first (newest overdue first), otherwise nearest future.
 */
export function pickNextDue(
    rows: GradeAssignment[],
    now: Date = new Date(),
): GradeAssignment | null {
    const open = rows.filter((a) => !a.submitted);
    if (open.length === 0) return null;

    const withDue = open.filter((a) => a.due_date);
    const withoutDue = open.filter((a) => !a.due_date);

    withDue.sort((a, b) => {
        const ta = new Date(a.due_date!).getTime();
        const tb = new Date(b.due_date!).getTime();
        const overdueA = ta < now.getTime();
        const overdueB = tb < now.getTime();
        if (overdueA && !overdueB) return -1;
        if (!overdueA && overdueB) return 1;
        // both overdue → most recently missed first; both upcoming → nearest first
        return overdueA ? tb - ta : ta - tb;
    });

    return withDue[0] ?? withoutDue[0] ?? null;
}
