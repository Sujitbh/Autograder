/* ═══════════════════════════════════════════════════════════════════
   AutoGrade — Comprehensive TypeScript Type Definitions
   ═══════════════════════════════════════════════════════════════════ */

// ── User Types ──────────────────────────────────────────────────────

export interface Faculty {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    department: string;
    profilePhoto?: string;
    role: 'faculty';
}

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    sisUserId: string;
    sisLoginId: string;
    enrolledCourses: string[];
    profilePhoto?: string;
    role: 'student';
}

export type User = Faculty | Student;
export type UserRole = 'faculty' | 'student';

// ── Course Types ────────────────────────────────────────────────────

export type CourseStatus = 'active' | 'archived' | 'draft';

export interface Course {
    id: string;
    code: string;
    name: string;
    semester: string;
    section?: string;
    description?: string;
    facultyId: string;
    enrollmentCode: string;
    enrollmentCodeActive: boolean;
    status: CourseStatus;
    studentCount: number;
    assignmentCount: number;
    pendingGrades: number;
    createdAt: string;
    updatedAt: string;
}

export interface Enrollment {
    id: string;
    studentId: string;
    courseId: string;
    enrolledAt: string;
    status: 'active' | 'dropped' | 'completed';
}

// ── Assignment Types ────────────────────────────────────────────────

export type ProgrammingLanguage = 'python' | 'java';
export type AssignmentStatus = 'draft' | 'published' | 'closed';
export type AssignmentCategory = 'Homework' | 'Quiz' | 'Exam' | 'Lab' | 'Project';

export interface Assignment {
    id: string;
    courseId: string;
    name: string;
    shortName: string;
    description: string;
    language: ProgrammingLanguage;
    category: AssignmentCategory;
    dueDate: string;
    maxPoints: number;
    status: AssignmentStatus;
    isGroup: boolean;
    allowLateSubmissions: boolean;
    latePenalty?: LatePenalty;
    starterCode?: string;
    publicTests: TestCase[];
    privateTests: TestCase[];
    rubric: RubricCriterion[];
    createdAt: string;
    updatedAt: string;
}

export interface LatePenalty {
    type: 'percentage' | 'fixed';
    amount: number;
    /** Maximum days late allowed (after which score is 0) */
    maxDaysLate?: number;
}

// ── Submission Types ────────────────────────────────────────────────

export type SubmissionStatus = 'pending' | 'graded' | 'returned';

export interface Submission {
    id: string;
    assignmentId: string;
    studentId: string;
    code: string;
    language: ProgrammingLanguage;
    submittedAt: string;
    isLate: boolean;
    status: SubmissionStatus;
    testResults?: TestCaseResult[];
    grade?: Grade;
}

// ── Test Case Types ─────────────────────────────────────────────────

export interface TestCase {
    id: string;
    assignmentId: string;
    name: string;
    input: string;
    expectedOutput: string;
    isPublic: boolean;
    points: number;
}

export interface TestCaseResult {
    testCase: TestCase;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    executionTime: number; // milliseconds
    error?: string;
}

// ── Grading Types ───────────────────────────────────────────────────

export type GradingMethod = 'auto' | 'manual' | 'hybrid';

export interface RubricCriterion {
    id: string;
    name: string;
    description: string;
    maxPoints: number;
    gradingMethod: GradingMethod;
}

export interface Rubric {
    id: string;
    assignmentId: string;
    criteria: RubricCriterion[];
}

export interface RubricScore {
    criterionId: string;
    earnedPoints: number;
    comment?: string;
}

export interface Grade {
    id: string;
    submissionId: string;
    rubricScores: RubricScore[];
    totalScore: number;
    maxScore: number;
    percentage: number;
    letterGrade: string;
    feedback?: string;
    gradedAt: string;
    gradedBy: string;
}

// ── Code Execution Types ────────────────────────────────────────────

export interface ExecuteCodeParams {
    language: ProgrammingLanguage;
    sourceCode: string;
    stdin?: string;
    args?: string[];
}

export interface ExecutionResult {
    output: string;
    stderr: string;
    exitCode: number;
    executionTime: number; // milliseconds
    success: boolean;
    error?: string;
}

// ── API Response Types ──────────────────────────────────────────────

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
}

// ── DTO Types (Data Transfer Objects) ───────────────────────────────

export interface CreateCourseDto {
    code: string;
    name: string;
    semester: string;
    section?: string;
    description?: string;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {
    status?: CourseStatus;
    enrollmentCodeActive?: boolean;
}

export interface CreateAssignmentDto {
    courseId: string;
    name: string;
    shortName: string;
    description: string;
    language: ProgrammingLanguage;
    category: AssignmentCategory;
    dueDate: string;
    maxPoints: number;
    isGroup: boolean;
    allowLateSubmissions: boolean;
    latePenalty?: LatePenalty;
    starterCode?: string;
    publicTests: Omit<TestCase, 'id' | 'assignmentId'>[];
    privateTests: Omit<TestCase, 'id' | 'assignmentId'>[];
    rubric: Omit<RubricCriterion, 'id'>[];
}

export interface UpdateAssignmentDto extends Partial<CreateAssignmentDto> {
    status?: AssignmentStatus;
}

export interface SubmitCodeDto {
    assignmentId: string;
    code: string;
    language: ProgrammingLanguage;
}

export interface GradeSubmissionDto {
    submissionId: string;
    rubricScores: RubricScore[];
    feedback?: string;
    applyToGroup?: boolean;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    department?: string;
    title?: string;
}

// ── Analytics / Report Types ────────────────────────────────────────

export interface CourseAnalytics {
    courseId: string;
    averageGrade: number;
    submissionRate: number;
    gradeDistribution: GradeDistribution;
    assignmentPerformance: AssignmentPerformance[];
    trendData: TrendDataPoint[];
}

export interface GradeDistribution {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
}

export interface AssignmentPerformance {
    assignmentId: string;
    assignmentName: string;
    averageScore: number;
    maxScore: number;
    submissionCount: number;
    totalStudents: number;
}

export interface TrendDataPoint {
    date: string;
    averageGrade: number;
    submissionCount: number;
}

export interface StudentReport {
    student: Student;
    courseId: string;
    assignments: {
        assignment: Assignment;
        submission?: Submission;
        grade?: Grade;
    }[];
    totalEarned: number;
    totalPossible: number;
    percentage: number;
    letterGrade: string;
}

// ── WebSocket Event Types ───────────────────────────────────────────

export interface SubmissionEvent {
    type: 'submission:new';
    assignmentId: string;
    studentId: string;
    studentName: string;
    submittedAt: string;
}

export interface GradeEvent {
    type: 'grade:updated';
    assignmentId: string;
    studentId: string;
    grade: number;
}

export interface AssignmentEvent {
    type: 'assignment:created';
    courseId: string;
    assignmentId: string;
    assignmentName: string;
    dueDate: string;
}

export type WebSocketEvent = SubmissionEvent | GradeEvent | AssignmentEvent;
