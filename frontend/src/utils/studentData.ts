/* ═══════════════════════════════════════════════════════════════════
   SHARED TYPES & UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════════ */

/* ── Types ── */

export interface StudentSeed {
    fn: string;
    ln: string;
    id: string;
    sis: string;
    login: string;
    base: number;
}

export interface SharedStudent {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    studentId: string;
    sisUserId: string;
    sisLoginId: string;
    email: string;
    avatarInitials: string;
    enrollmentDate: string;
    section: string;
    baseGrade: number;
    avgGrade: number;
    trend: 'up' | 'down' | 'stable';
    lastActive: string;
    submissions: number;
    grades: Record<string, number | null>;
    lateFlags: Record<string, boolean>;
}

export interface AssignmentDef {
    id: string;
    shortName: string;
    fullName: string;
    category: 'Homework' | 'Quiz' | 'Exam';
    maxPoints: number;
    dueDate: string;
    isGroup?: boolean;
}

/* ── Deterministic hash ── */

export function hashStr(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h) + s.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

/* ── Helper utilities used by multiple components ── */

export function gradeColor(earned: number, max: number): string {
    if (max === 0) return '#8A8A8A';
    const pct = (earned / max) * 100;
    if (pct >= 90) return '#2D6A2D';
    if (pct >= 80) return '#6B0000';
    if (pct >= 70) return '#8A5700';
    return '#8B0000';
}

export function pctColor(pct: number): string {
    if (pct >= 90) return '#2D6A2D';
    if (pct >= 80) return '#6B0000';
    if (pct >= 70) return '#8A5700';
    return '#8B0000';
}

export function letterGrade(pct: number): string {
    if (pct >= 93) return 'A';
    if (pct >= 90) return 'A-';
    if (pct >= 87) return 'B+';
    if (pct >= 83) return 'B';
    if (pct >= 80) return 'B-';
    if (pct >= 77) return 'C+';
    if (pct >= 73) return 'C';
    if (pct >= 70) return 'C-';
    if (pct >= 67) return 'D+';
    if (pct >= 60) return 'D';
    return 'F';
}

export function ordinal(n: number): string {
    if (n % 100 >= 11 && n % 100 <= 13) return n + 'th';
    if (n % 10 === 1) return n + 'st';
    if (n % 10 === 2) return n + 'nd';
    if (n % 10 === 3) return n + 'rd';
    return n + 'th';
}
