/* ═══════════════════════════════════════════════════════════════════
   SHARED STUDENT DATA — Single source of truth for the entire app
   ═══════════════════════════════════════════════════════════════════ */

/* ── Types ── */

export interface StudentSeed {
    fn: string;
    ln: string;
    id: string;
    sis: string;
    login: string;
    base: number;           // base grade percentage (0-100)
}

export interface SharedStudent {
    // Identity
    id: string;             // seed id, e.g. "4790"
    firstName: string;
    lastName: string;
    name: string;           // "FirstName LastName"
    studentId: string;      // "S20230001" format (sequential)
    sisUserId: string;      // "30154740" format
    sisLoginId: string;     // "acharyas1"
    email: string;          // "{login}@warhawks.ulm.edu"
    avatarInitials: string; // "SA"
    enrollmentDate: string;
    section: string;

    // Computed per-course
    baseGrade: number;
    avgGrade: number;       // overall percentage across all assignments
    trend: 'up' | 'down' | 'stable';
    lastActive: string;
    submissions: number;    // number of assignments submitted

    // Detailed grades
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

/* ── Course roster sizes ── */

export const COURSE_STUDENT_COUNTS: Record<string, number> = {
    'cs-1001': 42,
    'cs-2050': 35,
    'cs-3100': 28,
    'cs-4200': 18,
    'cs-1001-fall': 38,
    'cs-3500': 22,
};

export function getStudentCountForCourse(courseId: string): number {
    if (COURSE_STUDENT_COUNTS[courseId]) return COURSE_STUDENT_COUNTS[courseId];
    try {
        const stored = JSON.parse(localStorage.getItem('autograde_courses') || '[]');
        const found = stored.find((c: { id: string; students?: number }) => c.id === courseId);
        if (found && found.students && found.students > 0) return Math.min(found.students, STUDENT_SEEDS.length);
    } catch { /* ignore */ }
    return 0;
}

/* ── Section map ── */

export const SECTION_MAP: Record<string, string> = {
    'cs-1001': 'Spring 2026 - 64251',
    'cs-2050': 'Spring 2026 - 64252',
    'cs-3100': 'Spring 2026 - 64253',
    'cs-4200': 'Spring 2026 - 64254',
    'cs-1001-fall': 'Fall 2025 - 52180',
    'cs-3500': 'Spring 2026 - 64255',
};

/* ── Standard assignments (gradebook columns) ── */

export const ASSIGNMENTS: AssignmentDef[] = [
    { id: 'hw1', shortName: 'HW1', fullName: 'HW1: Variables & Data Types', category: 'Homework', maxPoints: 100, dueDate: '2026-01-31' },
    { id: 'hw2', shortName: 'HW2', fullName: 'HW2: Control Flow', category: 'Homework', maxPoints: 100, dueDate: '2026-02-07' },
    { id: 'hw3', shortName: 'HW3', fullName: 'HW3: Functions & Modules', category: 'Homework', maxPoints: 100, dueDate: '2026-02-14' },
    { id: 'hw4', shortName: 'HW4', fullName: 'HW4: OOP Basics', category: 'Homework', maxPoints: 100, dueDate: '2026-02-21', isGroup: true },
    { id: 'hw5', shortName: 'HW5', fullName: 'HW5: File I/O', category: 'Homework', maxPoints: 100, dueDate: '2026-02-28', isGroup: true },
    { id: 'hw6', shortName: 'HW6', fullName: 'HW6: Error Handling', category: 'Homework', maxPoints: 100, dueDate: '2026-03-07' },
    { id: 'q1', shortName: 'Quiz 1', fullName: 'Quiz 1: Fundamentals', category: 'Quiz', maxPoints: 50, dueDate: '2026-02-10' },
    { id: 'q2', shortName: 'Quiz 2', fullName: 'Quiz 2: Functions & OOP', category: 'Quiz', maxPoints: 50, dueDate: '2026-02-24' },
    { id: 'mid', shortName: 'Midterm', fullName: 'Midterm Exam', category: 'Exam', maxPoints: 150, dueDate: '2026-03-01' },
    { id: 'final', shortName: 'Final', fullName: 'Final Exam', category: 'Exam', maxPoints: 150, dueDate: '2026-04-25' },
];

export const TOTAL_MAX = ASSIGNMENTS.reduce((s, a) => s + a.maxPoints, 0); // 1000

/* ── 42 student seeds ── */

export const STUDENT_SEEDS: StudentSeed[] = [
    { fn: 'James', ln: 'Anderson', id: '4790', sis: '30154740', login: 'andersonj', base: 87.5 },
    { fn: 'Michael', ln: 'Brooks', id: '2478', sis: '30155679', login: 'brooksm', base: 88.3 },
    { fn: 'William', ln: 'Carter', id: '4842', sis: '30155241', login: 'carterw', base: 91.8 },
    { fn: 'David', ln: 'Chen', id: '2400', sis: '30161748', login: 'chend', base: 83.8 },
    { fn: 'Robert', ln: 'Davis', id: '4901', sis: '30153512', login: 'davisr', base: 81.7 },
    { fn: 'Daniel', ln: 'Edwards', id: '4948', sis: '30156286', login: 'edwardsd', base: 89.0 },
    { fn: 'Matthew', ln: 'Fisher', id: '4562', sis: '30146118', login: 'fisherm', base: 88.1 },
    { fn: 'Andrew', ln: 'Garcia', id: '4772', sis: '30154647', login: 'garciaa', base: 89.5 },
    { fn: 'Emily', ln: 'Harris', id: '4615', sis: '30157892', login: 'harrise', base: 94.2 },
    { fn: 'Christopher', ln: 'Jackson', id: '3291', sis: '30158234', login: 'jacksonc', base: 76.4 },
    { fn: 'Ryan', ln: 'Kim', id: '4103', sis: '30159467', login: 'kimr', base: 82.5 },
    { fn: 'Brandon', ln: 'Lopez', id: '3856', sis: '30160123', login: 'lopezb', base: 91.0 },
    { fn: 'Justin', ln: 'Martinez', id: '4234', sis: '30161456', login: 'martinezj', base: 78.3 },
    { fn: 'Tyler', ln: 'Nelson', id: '3567', sis: '30162789', login: 'nelsont', base: 85.6 },
    { fn: 'Nathan', ln: 'Ortiz', id: '4089', sis: '30163012', login: 'ortizn', base: 72.1 },
    { fn: 'Kevin', ln: 'Patel', id: '3945', sis: '30164345', login: 'patelk', base: 90.3 },
    { fn: 'Jason', ln: 'Quinn', id: '4678', sis: '30165678', login: 'quinnj', base: 86.7 },
    { fn: 'Aaron', ln: 'Robinson', id: '3412', sis: '30166901', login: 'robinsona', base: 68.5 },
    { fn: 'Samuel', ln: 'Stewart', id: '4567', sis: '30168234', login: 'stewarts', base: 93.4 },
    { fn: 'Derek', ln: 'Thompson', id: '3789', sis: '30169567', login: 'thompsond', base: 79.8 },
    { fn: 'Brian', ln: 'Alvarez', id: '4821', sis: '30170234', login: 'alvarezb', base: 84.2 },
    { fn: 'Patrick', ln: 'Bennett', id: '3654', sis: '30171567', login: 'bennettp', base: 77.9 },
    { fn: 'Ethan', ln: 'Clark', id: '4912', sis: '30172890', login: 'clarke', base: 86.1 },
    { fn: 'Jordan', ln: 'Diaz', id: '3478', sis: '30174123', login: 'diazj', base: 90.7 },
    { fn: 'Kyle', ln: 'Evans', id: '4156', sis: '30175456', login: 'evansk', base: 73.5 },
    { fn: 'Connor', ln: 'Foster', id: '3890', sis: '30176789', login: 'fosterc', base: 88.9 },
    { fn: 'Sean', ln: 'Gray', id: '4267', sis: '30178012', login: 'grays', base: 81.3 },
    { fn: 'Trevor', ln: 'Hill', id: '3523', sis: '30179345', login: 'hillt', base: 75.8 },
    { fn: 'Marcus', ln: 'Ingram', id: '4689', sis: '30180678', login: 'ingramm', base: 92.1 },
    { fn: 'Dylan', ln: 'Johnson', id: '3345', sis: '30181901', login: 'johnsond', base: 70.4 },
    { fn: 'Caleb', ln: 'King', id: '4534', sis: '30183234', login: 'kingc', base: 87.3 },
    { fn: 'Logan', ln: 'Lee', id: '3712', sis: '30184567', login: 'leel', base: 83.0 },
    { fn: 'Austin', ln: 'Mitchell', id: '4445', sis: '30185890', login: 'mitchella', base: 91.5 },
    { fn: 'Gavin', ln: 'Nguyen', id: '3267', sis: '30187123', login: 'nguyeng', base: 78.6 },
    { fn: 'Owen', ln: 'Parker', id: '4578', sis: '30188456', login: 'parkero', base: 85.0 },
    { fn: 'Cole', ln: 'Reed', id: '3901', sis: '30189789', login: 'reedc', base: 80.2 },
    { fn: 'Grant', ln: 'Scott', id: '4134', sis: '30191012', login: 'scottg', base: 74.7 },
    { fn: 'Blake', ln: 'Turner', id: '3678', sis: '30192345', login: 'turnerb', base: 89.4 },
    { fn: 'Ian', ln: 'Walker', id: '4356', sis: '30193678', login: 'walkeri', base: 82.8 },
    { fn: 'Chase', ln: 'White', id: '3145', sis: '30194901', login: 'whitec', base: 76.1 },
    { fn: 'Luke', ln: 'Young', id: '4723', sis: '30196234', login: 'youngl', base: 87.6 },
    { fn: 'Mason', ln: 'Zimmerman', id: '3456', sis: '30197567', login: 'zimmermanm', base: 83.4 },
];

/* ── Deterministic hash (same as previous) ── */

export function hashStr(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h) + s.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

/* ── Grade computation for a single student across all assignments ── */

function computeGrades(seedId: string, base: number): { grades: Record<string, number | null>; lateFlags: Record<string, boolean> } {
    const grades: Record<string, number | null> = {};
    const lateFlags: Record<string, boolean> = {};

    ASSIGNMENTS.forEach(a => {
        const h = hashStr(seedId + ':' + a.id);
        const variation = (h % 25) - 12;
        const pct = Math.min(100, Math.max(15, base + variation));

        // ~5% chance of missing for non-Exam assignments
        const missH = hashStr(seedId + ':miss:' + a.id);
        if (missH % 100 < 5 && a.category !== 'Exam') {
            grades[a.id] = null;
        } else {
            grades[a.id] = Math.round(a.maxPoints * pct / 100);
        }

        lateFlags[a.id] = hashStr(seedId + ':late:' + a.id) % 10 === 0;
    });

    return { grades, lateFlags };
}

/* ── Cache ── */
const courseCache: Record<string, SharedStudent[]> = {};

/* ── Main getter — returns the same array for a given courseId ── */

export function getStudentsForCourse(courseId: string): SharedStudent[] {
    if (courseCache[courseId]) return courseCache[courseId];

    const count = getStudentCountForCourse(courseId);
    const section = SECTION_MAP[courseId] || 'Spring 2026 - 64251';
    const seeds = STUDENT_SEEDS.slice(0, count);

    const students: SharedStudent[] = seeds.map((s, idx) => {
        const { grades, lateFlags } = computeGrades(s.id, s.base);

        // Compute aggregate stats
        let earned = 0;
        let possible = 0;
        let submitted = 0;
        ASSIGNMENTS.forEach(a => {
            possible += a.maxPoints;
            if (grades[a.id] !== null && grades[a.id] !== undefined) {
                earned += grades[a.id]!;
                submitted++;
            }
        });
        const avgGrade = possible > 0 ? Math.round((earned / possible) * 100) : 0;

        // Deterministic trend & lastActive
        const trendH = hashStr(s.id + ':trend');
        const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
        const trend = trends[trendH % 3];

        const dayOffset = hashStr(s.id + ':active') % 10;
        const lastActive = `2026-02-${String(10 + dayOffset).padStart(2, '0')}`;

        return {
            id: s.id,
            firstName: s.fn,
            lastName: s.ln,
            name: `${s.fn} ${s.ln}`,
            studentId: `S${20230001 + idx}`,
            sisUserId: s.sis,
            sisLoginId: s.login,
            email: `${s.login}@warhawks.ulm.edu`,
            avatarInitials: `${s.fn[0]}${s.ln[0]}`,
            enrollmentDate: '2026-01-15',
            section,
            baseGrade: s.base,
            avgGrade,
            trend,
            lastActive,
            submissions: submitted,
            grades,
            lateFlags,
        };
    });

    courseCache[courseId] = students;
    return students;
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

/* ── Rubric & feedback (shared by grading pages) ── */

export const RUBRIC_CRITERIA = [
    { name: 'Code Correctness', weight: 40 },
    { name: 'Code Style', weight: 20 },
    { name: 'Documentation', weight: 20 },
    { name: 'Efficiency', weight: 20 },
];

export const FEEDBACK_POOL = [
    'Excellent work! Clean and well-documented code.',
    'Good effort. Consider adding more edge case handling.',
    'Solid submission. Code style could be improved with consistent formatting.',
    'Great job on the logic! Minor issues with variable naming conventions.',
    'Well-structured code. Documentation needs more detail on complex functions.',
    'Good understanding of concepts. Some room for optimization in inner loops.',
    'Strong performance overall. Keep up the good work!',
    'Needs improvement in error handling — consider try/catch blocks.',
];
