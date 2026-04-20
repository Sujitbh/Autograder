import type {
    DashboardActivityItem,
    StudentDashboardFeed,
    FacultyDashboardFeed,
    StudentTodoItem,
    FacultyTodoItem,
} from '@/services/api';

/* ───────────────────────── Time / calendar helpers ───────────────────────── */

export function timeOfDayGreeting(now: Date = new Date()): string {
    const h = now.getHours();
    if (h < 5) return 'Still up';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Good night';
}

export function eyebrowLine(
    role: 'student' | 'faculty',
    now: Date = new Date(),
): string {
    const roleLabel = role === 'faculty' ? 'Faculty' : 'Student';
    const month = now.toLocaleDateString(undefined, { month: 'long' });
    const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
    return `${roleLabel} · ${weekday}, ${month} ${now.getDate()}`;
}

export function formatDayHeader(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const that = new Date(d);
    that.setHours(0, 0, 0, 0);
    const diff = Math.round((that.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
    if (diff > 1 && diff <= 6) {
        return d.toLocaleDateString(undefined, { weekday: 'long' });
    }
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatClock(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function formatAbsolute(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

/**
 * Compact relative time, biased toward short glanceable values.
 * e.g. "just now", "12m", "2h", "yesterday", "Apr 3".
 */
export function relativeShort(iso: string, now: Date = new Date()): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const diffMs = d.getTime() - now.getTime();
    const abs = Math.abs(diffMs);
    const future = diffMs > 0;
    const min = 60_000;
    const hr = 3_600_000;
    const day = 86_400_000;
    if (abs < 45_000) return 'just now';
    if (abs < hr) return `${Math.round(abs / min)}m${future ? '' : ''}`;
    if (abs < day) return `${Math.round(abs / hr)}h`;
    if (abs < 2 * day) return future ? 'tomorrow' : 'yesterday';
    if (abs < 6 * day) {
        return d.toLocaleDateString(undefined, { weekday: 'short' });
    }
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/* ───────────────────────── Urgency bucketing ───────────────────────── */

export type UrgencyBand = 'today' | 'thisWeek' | 'later' | 'none';

export function urgencyFor(iso: string | null | undefined, now: Date = new Date()): UrgencyBand {
    if (!iso) return 'none';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'none';
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const dayIdx = Math.floor(
        (new Date(d).setHours(0, 0, 0, 0) - startOfToday.getTime()) / 86400000,
    );
    if (dayIdx <= 0) return 'today';
    if (dayIdx <= 7) return 'thisWeek';
    return 'later';
}

/* ───────────────────────── Course palette ───────────────────────── */

/**
 * Returns a categorical CSS var reference for a given course id.
 * Stays within the 6-hue dashboard palette — which means the same id always
 * renders the same color across the page.
 */
export function courseColorVar(courseId: number | null | undefined): string {
    const n = Math.abs(courseId ?? 0);
    const idx = (n % 6) + 1;
    return `var(--dash-cat-${idx})`;
}

function courseCodeLabel(course: { code: string | null } | null | undefined): string {
    return course?.code ?? '—';
}

/* ───────────────────────── Activity grouping + compression ───────────────────────── */

export interface ActivityBucket {
    dayIso: string;
    items: DashboardActivityItem[];
}

export function groupActivityByDay(items: DashboardActivityItem[]): ActivityBucket[] {
    const buckets = new Map<string, DashboardActivityItem[]>();
    items
        .filter((it): it is DashboardActivityItem & { at: string } => Boolean(it.at))
        .forEach((it) => {
            const d = new Date(it.at);
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            const list = buckets.get(key);
            if (list) list.push(it);
            else buckets.set(key, [it]);
        });
    return Array.from(buckets.values())
        .map((arr) => ({ dayIso: arr[0].at!, items: arr }))
        .sort(
            (a, b) => new Date(b.dayIso).getTime() - new Date(a.dayIso).getTime(),
        );
}

/**
 * Compression rule: when 3+ consecutive items in the same bucket share
 * kind + (assignment title root), merge them into a single "3 submissions
 * for Lab 5" entry with an expandable children[] array.
 */
export interface CompressedActivity {
    kind: DashboardActivityItem['kind'];
    title: string;
    subtitle?: string | null;
    course?: DashboardActivityItem['course'];
    at: string | null;
    link: string;
    /** When set, this row is a collapsed group; contains the underlying items. */
    children?: DashboardActivityItem[];
}

export function compressActivityBucket(
    items: DashboardActivityItem[],
): CompressedActivity[] {
    const out: CompressedActivity[] = [];
    let i = 0;
    while (i < items.length) {
        const head = items[i];
        let j = i + 1;
        while (
            j < items.length &&
            items[j].kind === head.kind &&
            items[j].title === head.title &&
            (items[j].course?.id ?? null) === (head.course?.id ?? null)
        ) {
            j++;
        }
        const run = j - i;
        if (run >= 3) {
            out.push({
                kind: head.kind,
                title: `${run} ${head.kind === 'submission' ? 'submissions' : 'events'} for ${head.title}`,
                subtitle: head.subtitle ?? null,
                course: head.course,
                at: head.at,
                link: head.link,
                children: items.slice(i, j),
            });
        } else {
            for (let k = i; k < j; k++) out.push({ ...items[k] });
        }
        i = j;
    }
    return out;
}

/* ───────────────────────── Intelligent summary line ───────────────────────── */

export function studentSummary(feed: StudentDashboardFeed): string {
    const { stats } = feed;
    const parts: string[] = [];
    if (stats.due_this_week > 0) {
        parts.push(
            `${stats.due_this_week} ${stats.due_this_week === 1 ? 'item' : 'items'} due this week`,
        );
    }
    if (stats.missing > 0) {
        parts.push(
            `${stats.missing} missing`,
        );
    }
    if (stats.graded_recently > 0) {
        parts.push(
            `${stats.graded_recently} newly graded`,
        );
    }
    if (parts.length === 0) return 'Nothing needs you right now.';
    return parts.slice(0, 2).join(' · ');
}

export function facultySummary(feed: FacultyDashboardFeed): string {
    const { stats } = feed;
    const parts: string[] = [];
    if (stats.to_grade > 0) {
        parts.push(
            `${stats.to_grade} to grade`,
        );
    }
    if (stats.closing_soon > 0) {
        parts.push(
            `${stats.closing_soon} closing soon`,
        );
    }
    if (stats.drafts > 0) {
        parts.push(
            `${stats.drafts} draft${stats.drafts === 1 ? '' : 's'}`,
        );
    }
    if (parts.length === 0) return 'Nothing needs you right now.';
    return parts.slice(0, 2).join(' · ');
}

/* ───────────────────────── Focus card picker ───────────────────────── */

export interface StudentFocus {
    variant: 'urgent' | 'calm';
    eyebrow: string;
    title: string;
    hint: string;
    href?: string;
}

export function pickStudentFocus(feed: StudentDashboardFeed): StudentFocus {
    const missing = feed.todos.find((t): t is Extract<StudentTodoItem, { kind: 'missing' }> => t.kind === 'missing');
    if (missing && missing.course) {
        return {
            variant: 'urgent',
            eyebrow: 'Missing work',
            title: missing.title,
            hint: `Submit now — ${courseCodeLabel(missing.course)}`,
            href: `/student/courses/${missing.course.id}/assignments/${missing.assignment_id}`,
        };
    }
    const nextUp = feed.todos.find((t): t is Extract<StudentTodoItem, { kind: 'upcoming' }> => t.kind === 'upcoming' && Boolean(t.due_date));
    if (nextUp && nextUp.course && nextUp.due_date) {
        return {
            variant: 'urgent',
            eyebrow: 'Up next',
            title: nextUp.title,
            hint: `Due ${formatDayHeader(nextUp.due_date)} · ${courseCodeLabel(nextUp.course)}`,
            href: `/student/courses/${nextUp.course.id}/assignments/${nextUp.assignment_id}`,
        };
    }
    return {
        variant: 'calm',
        eyebrow: 'You are clear',
        title: 'Nothing is due right now.',
        hint: 'Use this window to review feedback or read ahead.',
    };
}

export interface FacultyFocus {
    variant: 'urgent' | 'calm';
    eyebrow: string;
    title: string;
    hint: string;
    href?: string;
}

export function pickFacultyFocus(feed: FacultyDashboardFeed): FacultyFocus {
    const grading = feed.todos.find((t): t is Extract<FacultyTodoItem, { kind: 'to_grade' }> => t.kind === 'to_grade');
    if (grading && grading.course) {
        return {
            variant: 'urgent',
            eyebrow: 'Grading queue',
            title: `Grade ${grading.count} submission${grading.count === 1 ? '' : 's'}`,
            hint: `${grading.title} · ${courseCodeLabel(grading.course)}`,
            href: `/courses/${grading.course.id}/grading`,
        };
    }
    const closing = feed.todos.find((t): t is Extract<FacultyTodoItem, { kind: 'closing' }> => t.kind === 'closing');
    if (closing && closing.course && closing.due_date) {
        return {
            variant: 'urgent',
            eyebrow: 'Closing soon',
            title: closing.title,
            hint: `Closes ${formatDayHeader(closing.due_date)} · ${courseCodeLabel(closing.course)}`,
            href: `/courses/${closing.course.id}/assignments/${closing.assignment_id}`,
        };
    }
    const draft = feed.todos.find((t): t is Extract<FacultyTodoItem, { kind: 'draft' }> => t.kind === 'draft');
    if (draft && draft.course) {
        return {
            variant: 'urgent',
            eyebrow: 'Finish publishing',
            title: draft.title,
            hint: `Draft · ${courseCodeLabel(draft.course)}`,
            href: `/courses/${draft.course.id}/assignments/${draft.assignment_id}`,
        };
    }
    return {
        variant: 'calm',
        eyebrow: 'All clear',
        title: 'Nothing needs you right now.',
        hint: 'You can review class performance or plan next week.',
    };
}

/* ───────────────────────── Sparkline generator ───────────────────────── */

/**
 * Seeded-deterministic micro-series generator for KPI sparklines.
 * We don't yet have time-series from the feed, so we derive a calm series
 * that ends on the current value — never a bright-flat line, never random jitter.
 * If/when the backend ships history, replace with real data.
 */
export function deriveSparkline(current: number, seed: number, points = 12): number[] {
    const out: number[] = [];
    let v = Math.max(0, current - Math.max(1, Math.round(current * 0.4)));
    const target = current;
    for (let i = 0; i < points; i++) {
        const t = i / (points - 1);
        // Smoothed ease-in toward target with a low-amplitude wobble.
        const eased = v + (target - v) * (t * t * (3 - 2 * t));
        const wobble = ((seed * (i + 1)) % 7) * 0.08 - 0.24;
        out.push(Math.max(0, eased + wobble * Math.max(1, target * 0.1)));
    }
    return out;
}
