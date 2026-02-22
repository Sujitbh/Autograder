/* ═══════════════════════════════════════════════════════════════════
   Utility Helpers — Date, grade, string, file, and course utilities
   ═══════════════════════════════════════════════════════════════════ */

// ── Date / Time Utilities ───────────────────────────────────────────

/**
 * Format a date to "Feb 20, 2026" style.
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Format a date with time: "Feb 20, 2026 at 3:45 PM".
 */
export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const datePart = formatDate(d);
    const timePart = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
    return `${datePart} at ${timePart}`;
}

/**
 * Get a human-readable relative time string, e.g. "2 hours ago", "in 3 days".
 */
export function getRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = Date.now();
    const diffMs = now - d.getTime();
    const absDiff = Math.abs(diffMs);
    const isFuture = diffMs < 0;

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    let label: string;
    if (seconds < 60) label = 'just now';
    else if (minutes < 60) label = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    else if (hours < 24) label = `${hours} hour${hours > 1 ? 's' : ''}`;
    else if (days < 7) label = `${days} day${days > 1 ? 's' : ''}`;
    else if (weeks < 5) label = `${weeks} week${weeks > 1 ? 's' : ''}`;
    else label = `${months} month${months > 1 ? 's' : ''}`;

    if (label === 'just now') return label;
    return isFuture ? `in ${label}` : `${label} ago`;
}

/**
 * Check if a date is in the past.
 */
export function isPast(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.getTime() < Date.now();
}

/**
 * Calculate days until a deadline (negative if past).
 */
export function getDaysUntil(date: Date | string): number {
    const d = typeof date === 'string' ? new Date(date) : date;
    const diff = d.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ── Grade Utilities ─────────────────────────────────────────────────

/**
 * Get a Tailwind text-color class based on grade percentage.
 * - ≥ 90% → green
 * - 80–89% → maroon
 * - 70–79% → orange
 * - < 70% → red
 */
export function getGradeColor(percentage: number): string {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-[#6B0000]';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-red-600';
}

/**
 * Get a Tailwind bg-color class based on grade percentage (for badges, cells).
 */
export function getGradeBgColor(percentage: number): string {
    if (percentage >= 90) return 'bg-green-50 text-green-700';
    if (percentage >= 80) return 'bg-red-50 text-[#6B0000]';
    if (percentage >= 70) return 'bg-orange-50 text-orange-700';
    return 'bg-red-50 text-red-700';
}

/**
 * Get the letter grade for a percentage.
 */
export function getLetterGrade(percentage: number): string {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 60) return 'D';
    return 'F';
}

/**
 * Calculate percentage (0-100). Returns 0 when max is 0.
 */
export function calculatePercentage(earned: number, max: number): number {
    if (max <= 0) return 0;
    return Math.round((earned / max) * 100 * 100) / 100; // 2 decimal places
}

// ── String Utilities ────────────────────────────────────────────────

/**
 * Truncate a string to `maxLength` characters, adding "…" if truncated.
 */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 1) + '…';
}

/**
 * Generate initials from a full name: "John Doe" → "JD".
 */
export function getInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .slice(0, 2)
        .join('');
}

/**
 * Validate email format (basic RFC 5322 pattern).
 */
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── File Utilities ──────────────────────────────────────────────────

/**
 * Convert bytes to a human-readable size string: 1536 → "1.5 KB".
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'] as const;
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / 1024 ** i;
    return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Get the file extension: "main.py" → "py".
 */
export function getFileExtension(filename: string): string {
    const idx = filename.lastIndexOf('.');
    return idx >= 0 ? filename.slice(idx + 1).toLowerCase() : '';
}

/**
 * Check whether a filename has one of the allowed extensions.
 */
export function isValidFileType(
    filename: string,
    allowedTypes: string[]
): boolean {
    const ext = getFileExtension(filename);
    return allowedTypes.map((t) => t.toLowerCase().replace('.', '')).includes(ext);
}

// ── Course Code Generation ──────────────────────────────────────────

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O, I, 0, 1

/**
 * Generate a unique 7-character enrollment code.
 */
export function generateCourseCode(): string {
    let code = '';
    for (let i = 0; i < 7; i++) {
        code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    return code;
}

// ── Misc ────────────────────────────────────────────────────────────

/**
 * Create a className-safe string by merging Tailwind classes (using clsx pattern).
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Sleep for a given number of milliseconds (useful for testing / delays).
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
