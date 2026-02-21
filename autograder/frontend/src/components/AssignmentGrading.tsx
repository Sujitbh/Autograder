import { useState, useMemo, useEffect } from 'react';
import {
    ChevronLeft, Calendar, Code, Users, Download, CheckCircle2, Search,
    Inbox, BarChart3, AlertTriangle, ChevronUp, ChevronDown,
    Edit, Trash2, FileText, ClipboardList, Clock, Star, BookOpen, Settings2,
    UserCheck,
} from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useRouter, useParams } from 'next/navigation';
import { GradingModal } from './GradingModal';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from './ui/dialog';
import { getStudentsForCourse, hashStr, COURSE_STUDENT_COUNTS } from '../utils/studentData';

/* ─── Rubric criterion ─── */
interface RubricCriterion {
    name: string;
    description: string;
    maxPoints: number;
}

/* ─── Full assignment metadata ─── */
interface AssignmentMeta {
    name: string;
    language: string;
    dueDate: string;
    createdDate: string;
    totalStudents: number;
    totalPoints: number;
    description: string;
    instructions: string;
    allowedAttempts: number;
    latePolicy: string;
    aiDetection: boolean;
    rubric: RubricCriterion[];
    isGroupAssignment?: boolean;
}

function lookupCourseCode(id: string) {
    try { const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]'); const f = s.find((c: any) => c.id === id); if (f) return f.code; } catch { } return id;
}

const assignmentsMeta: Record<string, AssignmentMeta> = {
    a1: {
        name: 'Hello World Program',
        language: 'Python',
        dueDate: '2026-02-24',
        createdDate: '2026-02-10',
        totalStudents: COURSE_STUDENT_COUNTS['cs-1001'],
        totalPoints: 100,
        description: 'Write your first Python program that prints "Hello, World!" to the console. This introductory assignment familiarizes students with basic syntax, the print function, and running Python scripts.',
        instructions: '1. Create a file named hello.py\n2. Write a program that prints "Hello, World!"\n3. Add a comment at the top with your name and date\n4. Test your program locally before submitting\n5. Submit via AutoGrade before the deadline',
        allowedAttempts: 3,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: true,
        rubric: [
            { name: 'Correct Output', description: 'Program prints exactly "Hello, World!"', maxPoints: 40 },
            { name: 'Code Style', description: 'Proper indentation, naming conventions, PEP8 compliance', maxPoints: 20 },
            { name: 'Documentation', description: 'Header comment with name, date, and purpose', maxPoints: 20 },
            { name: 'File Structure', description: 'Correct file name and structure', maxPoints: 20 },
        ],
    },
    a2: {
        name: 'Variables and Data Types',
        language: 'Python',
        dueDate: '2026-03-03',
        createdDate: '2026-02-17',
        totalStudents: COURSE_STUDENT_COUNTS['cs-1001'],
        totalPoints: 100,
        description: 'Explore Python\'s built-in data types including integers, floats, strings, and booleans. Students will practice variable declaration, type conversion, and basic operations on different data types.',
        instructions: '1. Create a file named datatypes.py\n2. Declare variables of each type (int, float, str, bool)\n3. Perform type conversions between types\n4. Implement the required functions as specified\n5. All test cases must pass for full marks',
        allowedAttempts: 5,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: true,
        rubric: [
            { name: 'Code Correctness', description: 'All functions return expected results and pass test cases', maxPoints: 40 },
            { name: 'Type Handling', description: 'Proper use of type conversions and type checking', maxPoints: 20 },
            { name: 'Code Style', description: 'Clean code, proper naming, PEP8 compliance', maxPoints: 20 },
            { name: 'Documentation', description: 'Docstrings for functions, inline comments where needed', maxPoints: 20 },
        ],
    },
    a3: {
        name: 'Control Flow: Loops',
        language: 'Python',
        dueDate: '2026-03-10',
        createdDate: '2026-02-24',
        totalStudents: COURSE_STUDENT_COUNTS['cs-1001'],
        totalPoints: 100,
        description: 'Master Python\'s loop constructs including for loops, while loops, and nested loops. Implement algorithms using iteration patterns and loop control statements.',
        instructions: '1. Implement all functions in loops.py\n2. Use appropriate loop types (for vs while)\n3. Avoid infinite loops — include proper termination conditions\n4. Optimize for efficiency where possible\n5. Include error handling for edge cases',
        allowedAttempts: 5,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: true,
        rubric: [
            { name: 'Correctness', description: 'All loop implementations produce correct results', maxPoints: 50 },
            { name: 'Efficiency', description: 'Appropriate algorithm complexity, no unnecessary iterations', maxPoints: 20 },
            { name: 'Code Style', description: 'Readable loop structures, proper indentation', maxPoints: 15 },
            { name: 'Documentation', description: 'Comments explaining loop logic and edge cases', maxPoints: 15 },
        ],
    },
    a4: {
        name: 'Functions and Modules',
        language: 'Python',
        dueDate: '2026-03-17',
        createdDate: '2026-03-03',
        totalStudents: COURSE_STUDENT_COUNTS['cs-1001'],
        totalPoints: 100,
        description: 'Learn to write modular code using functions, parameters, return values, and modules. Create reusable code components and understand scope, default parameters, and *args/**kwargs.',
        instructions: '1. Create a module file named utils.py with helper functions\n2. Create main.py that imports and uses the module\n3. All functions must have type hints and docstrings\n4. Implement at least one function with *args and **kwargs\n5. Write a __main__ guard in main.py',
        allowedAttempts: 5,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: true,
        rubric: [
            { name: 'Function Design', description: 'Well-designed functions with single responsibility', maxPoints: 30 },
            { name: 'Module Structure', description: 'Proper module organization and imports', maxPoints: 20 },
            { name: 'Type Hints & Docstrings', description: 'Complete type annotations and documentation', maxPoints: 20 },
            { name: 'Correctness', description: 'All functions work correctly with edge cases', maxPoints: 30 },
        ],
    },
    a5: {
        name: 'Object-Oriented Programming',
        language: 'Python',
        dueDate: '2026-03-24',
        createdDate: '2026-03-10',
        totalStudents: COURSE_STUDENT_COUNTS['cs-1001'],
        totalPoints: 100,
        description: 'Introduction to OOP concepts in Python including classes, objects, inheritance, encapsulation, and polymorphism. Build a small class hierarchy to model a real-world system.',
        instructions: '1. Design a class hierarchy with at least 3 classes\n2. Use inheritance and method overriding\n3. Implement __str__ and __repr__ for all classes\n4. Use encapsulation with property decorators\n5. Write unit tests for your classes',
        allowedAttempts: 5,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: true,
        isGroupAssignment: true,
        rubric: [
            { name: 'Class Design', description: 'Well-structured classes with proper inheritance', maxPoints: 30 },
            { name: 'Encapsulation', description: 'Proper use of private attributes and properties', maxPoints: 20 },
            { name: 'Polymorphism', description: 'Effective use of method overriding and duck typing', maxPoints: 20 },
            { name: 'Testing', description: 'Comprehensive unit tests for all classes', maxPoints: 15 },
            { name: 'Documentation', description: 'Docstrings, type hints, and inline comments', maxPoints: 15 },
        ],
    },

    /* ─── CS-2050: Data Structures and Algorithms ─── */
    ds1: {
        name: 'Linked List Implementation',
        language: 'Java',
        dueDate: '2026-02-26',
        createdDate: '2026-02-12',
        totalStudents: COURSE_STUDENT_COUNTS['cs-2050'],
        totalPoints: 100,
        description: 'Implement a singly linked list data structure with standard operations. Students will build the list from scratch including insert, delete, search, and traversal operations.',
        instructions: '1. Create a LinkedList<T> generic class\n2. Implement add, remove, contains, size, and toString methods\n3. Handle edge cases (empty list, single element)\n4. Write JUnit tests for all operations\n5. Ensure O(1) head insertion and O(n) search',
        allowedAttempts: 5,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: true,
        rubric: [
            { name: 'Correctness', description: 'All list operations work correctly', maxPoints: 40 },
            { name: 'Edge Cases', description: 'Proper handling of empty list, null, and boundary conditions', maxPoints: 20 },
            { name: 'Testing', description: 'Comprehensive JUnit test coverage', maxPoints: 20 },
            { name: 'Code Quality', description: 'Clean Java style, generics usage, documentation', maxPoints: 20 },
        ],
    },
    ds2: {
        name: 'Binary Search Trees',
        language: 'Java',
        dueDate: '2026-03-05',
        createdDate: '2026-02-19',
        totalStudents: COURSE_STUDENT_COUNTS['cs-2050'],
        totalPoints: 100,
        description: 'Implement a binary search tree with insert, search, delete, and traversal operations. Understand tree properties and recursive algorithms.',
        instructions: '1. Implement a BST<T extends Comparable<T>> class\n2. Implement insert, search, delete, and three traversal orders\n3. Handle deletion of nodes with 0, 1, and 2 children\n4. Implement a height() and isBalanced() method\n5. Write comprehensive JUnit tests',
        allowedAttempts: 5,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: true,
        rubric: [
            { name: 'BST Operations', description: 'Insert, search, delete work correctly', maxPoints: 35 },
            { name: 'Traversals', description: 'In-order, pre-order, post-order implemented correctly', maxPoints: 25 },
            { name: 'Edge Cases', description: 'Empty tree, single node, duplicate handling', maxPoints: 20 },
            { name: 'Testing & Style', description: 'JUnit tests and clean code', maxPoints: 20 },
        ],
    },
    ds3: {
        name: 'Graph Algorithms',
        language: 'Java',
        dueDate: '2026-03-19',
        createdDate: '2026-03-05',
        totalStudents: COURSE_STUDENT_COUNTS['cs-2050'],
        totalPoints: 100,
        description: 'Implement graph representations and fundamental graph algorithms including BFS, DFS, and shortest path. Work with both adjacency list and adjacency matrix representations.',
        instructions: '1. Implement a Graph class with adjacency list representation\n2. Implement BFS and DFS traversals\n3. Implement Dijkstra\'s shortest path algorithm\n4. Handle both directed and undirected graphs\n5. Write tests with various graph topologies',
        allowedAttempts: 5,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: true,
        rubric: [
            { name: 'Graph Representation', description: 'Correct adjacency list with add/remove operations', maxPoints: 25 },
            { name: 'BFS & DFS', description: 'Correct traversal implementations', maxPoints: 30 },
            { name: 'Shortest Path', description: 'Working Dijkstra implementation', maxPoints: 25 },
            { name: 'Testing & Documentation', description: 'Comprehensive tests and code documentation', maxPoints: 20 },
        ],
    },

    /* ─── CS-3100: Software Engineering Principles ─── */
    se1: {
        name: 'Requirements Document',
        language: 'Markdown',
        dueDate: '2026-02-28',
        createdDate: '2026-02-14',
        totalStudents: COURSE_STUDENT_COUNTS['cs-3100'],
        totalPoints: 100,
        description: 'Draft a complete Software Requirements Specification (SRS) document for your team project. Apply requirements elicitation techniques and write clear functional and non-functional requirements.',
        instructions: '1. Use the IEEE SRS template provided\n2. Include at least 15 functional requirements\n3. Include at least 5 non-functional requirements\n4. Create use case diagrams for key features\n5. Submit as a Markdown file with proper formatting',
        allowedAttempts: 3,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: false,
        isGroupAssignment: true,
        rubric: [
            { name: 'Functional Requirements', description: 'Clear, testable, and complete requirements', maxPoints: 35 },
            { name: 'Non-Functional Requirements', description: 'Performance, security, usability requirements', maxPoints: 20 },
            { name: 'Use Cases', description: 'Well-defined use case diagrams and descriptions', maxPoints: 25 },
            { name: 'Document Quality', description: 'Formatting, clarity, and consistency', maxPoints: 20 },
        ],
    },
    se2: {
        name: 'System Design Diagram',
        language: 'UML',
        dueDate: '2026-03-12',
        createdDate: '2026-02-26',
        totalStudents: COURSE_STUDENT_COUNTS['cs-3100'],
        totalPoints: 100,
        description: 'Create comprehensive system design diagrams for your team project including architecture, class, and sequence diagrams. Apply design patterns and SOLID principles.',
        instructions: '1. Create a high-level architecture diagram\n2. Create detailed class diagrams with relationships\n3. Create sequence diagrams for 3 key use cases\n4. Identify and document at least 2 design patterns used\n5. Submit all diagrams as PNG/SVG with a written explanation',
        allowedAttempts: 3,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: false,
        isGroupAssignment: true,
        rubric: [
            { name: 'Architecture Diagram', description: 'Clear high-level system architecture', maxPoints: 25 },
            { name: 'Class Diagrams', description: 'Detailed UML class diagrams with relationships', maxPoints: 30 },
            { name: 'Sequence Diagrams', description: 'Accurate sequence diagrams for key flows', maxPoints: 25 },
            { name: 'Design Patterns', description: 'Appropriate pattern identification and documentation', maxPoints: 20 },
        ],
    },
    se3: {
        name: 'Sprint Review Presentation',
        language: 'Presentation',
        dueDate: '2026-03-26',
        createdDate: '2026-03-12',
        totalStudents: COURSE_STUDENT_COUNTS['cs-3100'],
        totalPoints: 100,
        description: 'Present your team\'s sprint review demonstrating working software, sprint metrics, and retrospective insights. Showcase agile methodology in practice.',
        instructions: '1. Prepare a 15-minute presentation\n2. Demo working features from the sprint\n3. Show sprint burndown chart and velocity\n4. Conduct a brief retrospective summary\n5. Submit slides and a recorded demo video',
        allowedAttempts: 2,
        latePolicy: 'No late submissions accepted',
        aiDetection: false,
        isGroupAssignment: true,
        rubric: [
            { name: 'Demo Quality', description: 'Working software demonstration with clear narration', maxPoints: 30 },
            { name: 'Sprint Metrics', description: 'Burndown chart, velocity, and completion rate', maxPoints: 25 },
            { name: 'Retrospective', description: 'Meaningful retrospective with actionable improvements', maxPoints: 20 },
            { name: 'Presentation', description: 'Professional slides, timing, and delivery', maxPoints: 25 },
        ],
    },

    /* ─── CS-4200: Advanced Web Development ─── */
    wd1: {
        name: 'React Portfolio App',
        language: 'TypeScript',
        dueDate: '2026-03-07',
        createdDate: '2026-02-21',
        totalStudents: COURSE_STUDENT_COUNTS['cs-4200'],
        totalPoints: 100,
        description: 'Build a personal portfolio single-page application using React and TypeScript. Implement responsive design, component composition, and client-side routing.',
        instructions: '1. Use Create React App or Vite with TypeScript template\n2. Implement at least 4 pages with React Router\n3. Use responsive CSS (mobile-first approach)\n4. Fetch and display data from a public API\n5. Deploy to Vercel or Netlify and submit the live URL',
        allowedAttempts: 5,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: true,
        rubric: [
            { name: 'React Components', description: 'Well-structured, reusable component architecture', maxPoints: 30 },
            { name: 'TypeScript Usage', description: 'Proper types, interfaces, and type safety', maxPoints: 20 },
            { name: 'Responsive Design', description: 'Works well on mobile, tablet, and desktop', maxPoints: 25 },
            { name: 'Deployment & Polish', description: 'Live deployment, loading states, error handling', maxPoints: 25 },
        ],
    },
    wd2: {
        name: 'REST API Project',
        language: 'TypeScript',
        dueDate: '2026-03-21',
        createdDate: '2026-03-07',
        totalStudents: COURSE_STUDENT_COUNTS['cs-4200'],
        totalPoints: 100,
        description: 'Design and implement a RESTful API using Node.js, Express, and TypeScript. Include authentication, database integration, and comprehensive API documentation.',
        instructions: '1. Set up Express with TypeScript\n2. Implement CRUD endpoints for at least 2 resources\n3. Add JWT authentication middleware\n4. Connect to a PostgreSQL or MongoDB database\n5. Write Swagger/OpenAPI documentation\n6. Include integration tests with Supertest',
        allowedAttempts: 5,
        latePolicy: '10% deduction per day, max 3 days late',
        aiDetection: true,
        rubric: [
            { name: 'API Design', description: 'RESTful endpoints with proper HTTP methods and status codes', maxPoints: 25 },
            { name: 'Authentication', description: 'JWT auth with proper middleware and security', maxPoints: 25 },
            { name: 'Database Integration', description: 'Schema design, migrations, and query efficiency', maxPoints: 25 },
            { name: 'Testing & Docs', description: 'Integration tests and Swagger documentation', maxPoints: 25 },
        ],
    },
};

interface StudentSubmission {
    id: string;
    studentName: string;
    studentId: string;
    avatarInitials: string;
    submittedAt: string | null;   // null = not submitted
    autoScore: number | null;
    finalGrade: number | null;
    maxPoints: number;
    status: 'not-submitted' | 'submitted' | 'graded' | 'needs-review';
    late: boolean;
    flagged: boolean;
}

function makeMockSubmissions(assignmentId: string, courseId: string): StudentSubmission[] {
    const students = getStudentsForCourse(courseId);
    const maxPts = 100; // assignment max points

    return students.map((s, i) => {
        // Deterministic status/score based on student+assignment hash
        const h = hashStr(s.id + ':' + assignmentId + ':status');
        const scoreH = hashStr(s.id + ':' + assignmentId + ':score');
        const scoreVal = Math.round(55 + (scoreH % 46)); // 55-100
        const isLate = hashStr(s.id + ':' + assignmentId + ':late') % 8 === 0;
        const isFlagged = hashStr(s.id + ':' + assignmentId + ':flag') % 12 === 0;

        // ~15% not-submitted, ~30% graded, ~30% submitted, ~25% needs-review
        const statusRoll = h % 100;
        let status: StudentSubmission['status'];
        let autoScore: number | null = null;
        let finalGrade: number | null = null;
        let submittedAt: string | null = null;

        if (statusRoll < 15) {
            status = 'not-submitted';
        } else {
            // Generate a deterministic submit time
            const dayOff = (hashStr(s.id + assignmentId + 'day') % 5) + 1;
            const hourOff = hashStr(s.id + assignmentId + 'hr') % 24;
            const minOff = hashStr(s.id + assignmentId + 'min') % 60;
            submittedAt = `2026-03-0${dayOff}T${String(hourOff).padStart(2, '0')}:${String(minOff).padStart(2, '0')}:00`;
            autoScore = scoreVal;

            if (statusRoll < 45) {
                status = 'graded';
                finalGrade = scoreVal;
            } else if (statusRoll < 75) {
                status = 'submitted';
            } else {
                status = 'needs-review';
            }
        }

        return {
            id: `${assignmentId}-sub-${i}`,
            studentName: s.name,
            studentId: s.studentId,
            avatarInitials: s.avatarInitials,
            submittedAt,
            autoScore,
            finalGrade,
            maxPoints: maxPts,
            status,
            late: status !== 'not-submitted' && isLate,
            flagged: status !== 'not-submitted' && isFlagged,
        };
    });
}

/* ─── Mock group membership (maps studentId → group) ─── */
interface MockGroup {
    id: string;
    name: string;
    memberIds: string[];   // studentIds within the group
}

function buildMockGroups(courseId: string): MockGroup[] {
    const students = getStudentsForCourse(courseId);
    const GROUP_NAMES = ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon',
        'Team Zeta', 'Team Eta', 'Team Theta', 'Team Iota', 'Team Kappa'];
    const groupSize = 4;
    const groups: MockGroup[] = [];
    const numGroups = Math.min(Math.ceil(students.length / groupSize), GROUP_NAMES.length);
    for (let i = 0; i < numGroups; i++) {
        const members = students.slice(i * groupSize, (i + 1) * groupSize);
        if (members.length === 0) break;
        groups.push({ id: `g${i + 1}`, name: GROUP_NAMES[i], memberIds: members.map(m => m.studentId) });
    }
    return groups;
}

function getGroupForStudent(studentId: string, groups: MockGroup[]): MockGroup | undefined {
    return groups.find(g => g.memberIds.includes(studentId));
}

function getGroupMembers(studentId: string, submissions: StudentSubmission[], groups: MockGroup[]): StudentSubmission[] {
    const group = getGroupForStudent(studentId, groups);
    if (!group) return [];
    return submissions.filter(s => group.memberIds.includes(s.studentId) && s.studentId !== studentId);
}

type SortField = 'studentName' | 'submittedAt' | 'autoScore' | 'finalGrade';
type SortOrder = 'asc' | 'desc';

function scoreColor(score: number, max: number): string {
    const pct = (score / max) * 100;
    if (pct >= 90) return '#2D6A2D';
    if (pct >= 70) return '#6B0000';
    return '#8B0000';
}

export function AssignmentGrading() {
    const router = useRouter();
    const { courseId, assignmentId } = useParams() as { courseId: string; assignmentId: string };

    // Try hardcoded meta first; fall back to localStorage for user-created assignments
    const meta: AssignmentMeta | undefined = useMemo(() => {
        const hardcoded = assignmentsMeta[assignmentId ?? ''];
        if (hardcoded) return hardcoded;
        try {
            const stored: any[] = JSON.parse(localStorage.getItem('createdAssignments') || '[]');
            const found = stored.find((a: any) => a.id === assignmentId);
            if (found) {
                return {
                    name: found.name ?? 'Untitled',
                    language: found.language ?? 'Python',
                    dueDate: found.dueDate ?? '',
                    createdDate: found.createdDate ?? new Date().toISOString().slice(0, 10),
                    totalStudents: found.totalStudents ?? 42,
                    totalPoints: found.totalPoints ?? 100,
                    description: found.description ?? '',
                    instructions: found.instructions ?? '',
                    allowedAttempts: found.allowedAttempts ?? 3,
                    latePolicy: found.latePolicy ?? '10% deduction per day, max 3 days late',
                    aiDetection: found.aiDetection ?? true,
                    rubric: (found.rubric ?? [
                        { name: 'Code Correctness', description: 'Produces correct output', maxPoints: 50 },
                        { name: 'Code Style', description: 'Follows style guidelines', maxPoints: 20 },
                        { name: 'Documentation', description: 'Includes comments', maxPoints: 30 },
                    ]) as RubricCriterion[],
                    isGroupAssignment: found.isGroupAssignment ?? false,
                } as AssignmentMeta;
            }
        } catch { /* ignore */ }
        return undefined;
    }, [assignmentId]);

    const initialSubmissions = useMemo(() => makeMockSubmissions(assignmentId ?? '', courseId ?? 'cs-1001'), [assignmentId, courseId]);
    const [submissions, setSubmissions] = useState<StudentSubmission[]>(initialSubmissions);
    // Reset when assignment/course changes
    useEffect(() => { setSubmissions(initialSubmissions); }, [initialSubmissions]);
    const mockGroups = useMemo(() => buildMockGroups(courseId ?? 'cs-1001'), [courseId]);

    /* ─── Grade submission handler ─── */
    const handleSubmitGrade = (studentId: string, grade: number, _feedback: string) => {
        setSubmissions(prev => prev.map(s =>
            s.id === studentId
                ? { ...s, finalGrade: grade, status: 'graded' as const }
                : s
        ));
    };

    /* ─── Apply grade to all group members ─── */
    const handleApplyGroupGrade = (sourceStudentId: string, grade: number) => {
        const group = getGroupForStudent(
            submissions.find(s => s.id === sourceStudentId)?.studentId ?? '', mockGroups
        );
        if (!group) return;
        setSubmissions(prev => prev.map(s =>
            group.memberIds.includes(s.studentId)
                ? { ...s, finalGrade: grade, status: 'graded' as const }
                : s
        ));
    };

    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('studentName');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [gradingStudentIdx, setGradingStudentIdx] = useState<number | null>(null);
    const [showBulkGradeDialog, setShowBulkGradeDialog] = useState(false);
    const [pageSection, setPageSection] = useState<'overview' | 'rubric' | 'submissions'>('overview');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editName, setEditName] = useState(meta?.name ?? '');
    const [editDescription, setEditDescription] = useState(meta?.description ?? '');
    const [editDueDate, setEditDueDate] = useState(meta?.dueDate ?? '');
    const [editInstructions, setEditInstructions] = useState(meta?.instructions ?? '');

    /* ── Apply-to-Group dialog state ── */
    const [showApplyGroupDialog, setShowApplyGroupDialog] = useState(false);
    const [applyGroupStudent, setApplyGroupStudent] = useState<StudentSubmission | null>(null);
    const [applyGroupGrade, setApplyGroupGrade] = useState<number | null>(null);
    const [groupGradeApplied, setGroupGradeApplied] = useState(false);

    if (!courseId || !assignmentId || !meta) {
        return (
            <PageLayout>
                <TopNav breadcrumbs={[{ label: 'Courses', href: '/courses' }]} />
                <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
                    <div className="text-center">
                        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '16px' }}>Assignment Not Found</h2>
                        <Button onClick={() => router.back()} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>Go Back</Button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    /* ─── Tab counts ─── */
    const counts = useMemo(() => {
        const all = submissions.length;
        const notSubmitted = submissions.filter(s => s.status === 'not-submitted').length;
        const submitted = submissions.filter(s => s.status === 'submitted').length;
        const graded = submissions.filter(s => s.status === 'graded').length;
        const needsReview = submissions.filter(s => s.status === 'needs-review').length;
        return { all, notSubmitted, submitted, graded, needsReview };
    }, [submissions]);

    const tabs = [
        { id: 'all', label: 'All', count: counts.all },
        { id: 'not-submitted', label: 'Not Submitted', count: counts.notSubmitted },
        { id: 'submitted', label: 'Submitted', count: counts.submitted },
        { id: 'graded', label: 'Graded', count: counts.graded },
        { id: 'needs-review', label: 'Needs Review', count: counts.needsReview },
    ];

    /* ─── Filter ─── */
    const filtered = useMemo(() => {
        return submissions.filter(s => {
            if (activeTab !== 'all' && s.status !== activeTab) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return s.studentName.toLowerCase().includes(q) || s.studentId.includes(q);
            }
            return true;
        });
    }, [submissions, activeTab, searchQuery]);

    /* ─── Sort ─── */
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            let cmp = 0;
            switch (sortField) {
                case 'studentName': cmp = a.studentName.localeCompare(b.studentName); break;
                case 'submittedAt':
                    cmp = (a.submittedAt ? new Date(a.submittedAt).getTime() : Infinity) - (b.submittedAt ? new Date(b.submittedAt).getTime() : Infinity);
                    break;
                case 'autoScore': cmp = (a.autoScore ?? -1) - (b.autoScore ?? -1); break;
                case 'finalGrade': cmp = (a.finalGrade ?? -1) - (b.finalGrade ?? -1); break;
            }
            return sortOrder === 'asc' ? cmp : -cmp;
        });
    }, [filtered, sortField, sortOrder]);

    const handleSort = (field: SortField) => {
        if (sortField === field) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortOrder('asc'); }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ChevronDown className="w-3.5 h-3.5 opacity-30" />;
        return sortOrder === 'asc'
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
            : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />;
    };

    /* ─── Grading modal student list (for prev/next navigation) ─── */
    const gradableStudents = sorted.filter(s => s.status !== 'not-submitted');
    const currentGradingStudent = gradingStudentIdx !== null ? gradableStudents[gradingStudentIdx] : null;

    return (
        <PageLayout>
            <TopNav breadcrumbs={[
                { label: 'Courses', href: '/courses' },
                { label: lookupCourseCode(courseId!), href: `/courses/${courseId}` },
                { label: 'Grading' },
                { label: meta.name },
            ]} />

            <div className="flex h-[calc(100vh-64px)]">
                <Sidebar activeItem="assignments" />

                <main className="flex-1 overflow-auto p-8">
                    {/* Back link */}
                    <button
                        onClick={() => router.push(`/courses/${courseId}`)}
                        className="flex items-center gap-1 mb-5 hover:underline transition-colors"
                        style={{ fontSize: '13px', color: '#6B0000' }}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Assignments
                    </button>

                    {/* Page Header */}
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#6B0000', lineHeight: '32px' }}>
                                {meta.name}
                            </h1>
                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                                <span className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#595959', backgroundColor: '#F5F5F5', padding: '6px 12px', borderRadius: '8px' }}>
                                    <Calendar className="w-4 h-4" />
                                    Due: {new Date(meta.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#595959', backgroundColor: '#F5F5F5', padding: '6px 12px', borderRadius: '8px' }}>
                                    <Code className="w-4 h-4" />
                                    {meta.language}
                                </span>
                                <span className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#595959', backgroundColor: '#F5F5F5', padding: '6px 12px', borderRadius: '8px' }}>
                                    <Users className="w-4 h-4" />
                                    {submissions.length} Students
                                </span>
                                <span className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#595959', backgroundColor: '#F5F5F5', padding: '6px 12px', borderRadius: '8px' }}>
                                    <Star className="w-4 h-4" />
                                    {meta.totalPoints} Points
                                </span>
                                {meta.isGroupAssignment && (
                                    <span className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 600, color: '#fff', backgroundColor: '#6B0000', padding: '6px 12px', borderRadius: '8px' }}>
                                        <UserCheck className="w-4 h-4" />
                                        Group Assignment
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="border-[var(--color-border)] h-9"
                                onClick={() => {
                                    setEditName(meta.name);
                                    setEditDescription(meta.description);
                                    setEditDueDate(meta.dueDate);
                                    setEditInstructions(meta.instructions);
                                    setShowEditDialog(true);
                                }}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                className="border-red-200 text-red-700 hover:bg-red-50 h-9"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                            <Button variant="outline" className="border-[var(--color-border)] h-9">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* ── Section Tabs ── */}
                    <div className="flex items-center gap-1 mb-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        {([
                            { id: 'overview' as const, label: 'Overview', icon: FileText },
                            { id: 'rubric' as const, label: 'Rubric', icon: ClipboardList },
                            { id: 'submissions' as const, label: 'Submissions', icon: Users },
                        ]).map(sec => {
                            const active = pageSection === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => setPageSection(sec.id)}
                                    className="flex items-center gap-2 px-5 py-3 transition-colors relative"
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: active ? 600 : 400,
                                        color: active ? '#6B0000' : '#595959',
                                        borderBottom: active ? '2px solid #6B0000' : '2px solid transparent',
                                        marginBottom: '-1px',
                                    }}
                                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#6B0000'; }}
                                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = '#595959'; }}
                                >
                                    <sec.icon className="w-4 h-4" />
                                    {sec.label}
                                    {sec.id === 'submissions' && (
                                        <span style={{ fontSize: '11px', fontWeight: 600, backgroundColor: active ? '#6B0000' : '#E0E0E0', color: active ? '#fff' : '#595959', padding: '1px 7px', borderRadius: '10px' }}>
                                            {counts.all}
                                        </span>
                                    )}
                                    {sec.id === 'rubric' && (
                                        <span style={{ fontSize: '11px', fontWeight: 600, backgroundColor: active ? '#6B0000' : '#E0E0E0', color: active ? '#fff' : '#595959', padding: '1px 7px', borderRadius: '10px' }}>
                                            {meta.rubric.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ══════════════════ OVERVIEW SECTION ══════════════════ */}
                    {pageSection === 'overview' && (
                        <div className="space-y-6">
                            {/* Description Card */}
                            <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                <h2 className="flex items-center gap-2 mb-4" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                    <BookOpen className="w-5 h-5" style={{ color: '#6B0000' }} />
                                    Description
                                </h2>
                                <p style={{ fontSize: '14px', color: '#595959', lineHeight: '1.7' }}>{meta.description}</p>
                            </div>

                            {/* Instructions Card */}
                            <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                <h2 className="flex items-center gap-2 mb-4" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                    <FileText className="w-5 h-5" style={{ color: '#6B0000' }} />
                                    Instructions
                                </h2>
                                <div style={{ fontSize: '14px', color: '#595959', lineHeight: '1.8' }}>
                                    {meta.instructions.split('\n').map((line, i) => (
                                        <p key={i} className="mb-1">{line}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Settings + Points Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Points Breakdown */}
                                <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                    <h2 className="flex items-center gap-2 mb-4" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                        <Star className="w-5 h-5" style={{ color: '#C9A84C' }} />
                                        Points Breakdown
                                    </h2>
                                    <div className="space-y-3">
                                        {meta.rubric.map((c, i) => (
                                            <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < meta.rubric.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                                                <span style={{ fontSize: '14px', color: '#2D2D2D' }}>{c.name}</span>
                                                <span className="flex items-center gap-1" style={{ fontSize: '14px', fontWeight: 700, color: '#6B0000' }}>
                                                    {c.maxPoints} pts
                                                </span>
                                            </div>
                                        ))}
                                        <div className="flex items-center justify-between pt-3" style={{ borderTop: '2px solid var(--color-border)' }}>
                                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#2D2D2D' }}>Total</span>
                                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#6B0000' }}>{meta.totalPoints} pts</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Assignment Settings */}
                                <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                    <h2 className="flex items-center gap-2 mb-4" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                        <Settings2 className="w-5 h-5" style={{ color: '#6B0000' }} />
                                        Settings
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Language', value: meta.language, icon: Code },
                                            { label: 'Due Date', value: new Date(meta.dueDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }), icon: Calendar },
                                            { label: 'Created', value: new Date(meta.createdDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), icon: Clock },
                                            { label: 'Allowed Attempts', value: `${meta.allowedAttempts}`, icon: FileText },
                                            { label: 'Late Policy', value: meta.latePolicy, icon: AlertTriangle },
                                            { label: 'AI Detection', value: meta.aiDetection ? 'Enabled' : 'Disabled', icon: BarChart3 },
                                            { label: 'Group Assignment', value: meta.isGroupAssignment ? 'Yes — grades can be applied to group' : 'No', icon: Users },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#8A8A8A' }} />
                                                <div>
                                                    <p style={{ fontSize: '12px', fontWeight: 500, color: '#8A8A8A', marginBottom: '2px' }}>{item.label}</p>
                                                    <p style={{ fontSize: '14px', color: '#2D2D2D' }}>{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════ RUBRIC SECTION ══════════════════ */}
                    {pageSection === 'rubric' && (
                        <div className="space-y-6">
                            {/* Rubric Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>Grading Rubric</h2>
                                    <p style={{ fontSize: '13px', color: '#595959', marginTop: '4px' }}>
                                        {meta.rubric.length} criteria • {meta.totalPoints} total points
                                    </p>
                                </div>
                            </div>

                            {/* Rubric Criteria Cards */}
                            <div className="space-y-4">
                                {meta.rubric.map((criterion, i) => {
                                    const pct = Math.round((criterion.maxPoints / meta.totalPoints) * 100);
                                    return (
                                        <div key={i} className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                        style={{ backgroundColor: 'var(--color-primary-bg)', color: '#6B0000', fontSize: '13px', fontWeight: 700 }}
                                                    >
                                                        {i + 1}
                                                    </div>
                                                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2D2D2D' }}>{criterion.name}</h3>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span style={{ fontSize: '12px', color: '#8A8A8A' }}>{pct}% weight</span>
                                                    <span className="flex items-center justify-center px-3 py-1 rounded-full" style={{ backgroundColor: '#F5EDED', color: '#6B0000', fontSize: '14px', fontWeight: 700, minWidth: '60px', textAlign: 'center' }}>
                                                        {criterion.maxPoints} pts
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="px-6 py-4">
                                                <p style={{ fontSize: '14px', color: '#595959', lineHeight: '1.6' }}>{criterion.description}</p>
                                                {/* Progress indicator for weight */}
                                                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F0F0F0' }}>
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${pct}%`, backgroundColor: '#6B0000', transition: 'width 0.3s ease' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Total Points Summary */}
                            <div className="rounded-lg p-6" style={{ backgroundColor: '#F5EDED', border: '2px solid #6B0000' }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Star className="w-6 h-6" style={{ color: '#C9A84C' }} />
                                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#2D2D2D' }}>Total Points</span>
                                    </div>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#6B0000' }}>{meta.totalPoints}</span>
                                </div>
                                <div className="mt-3 flex items-center gap-4 flex-wrap">
                                    {meta.rubric.map((c, i) => (
                                        <span key={i} style={{ fontSize: '12px', color: '#595959' }}>
                                            {c.name}: <strong style={{ color: '#6B0000' }}>{c.maxPoints}</strong>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════ SUBMISSIONS SECTION ══════════════════ */}
                    {pageSection === 'submissions' && (
                        <>
                            {/* Top bar: Grade All + filter tabs */}
                            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {tabs.map(tab => {
                                        const active = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className="transition-colors"
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '20px',
                                                    fontSize: '13px',
                                                    fontWeight: active ? 600 : 400,
                                                    backgroundColor: active ? '#6B0000' : 'transparent',
                                                    color: active ? '#fff' : '#595959',
                                                }}
                                                onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = '#F5EDED'; }}
                                                onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                            >
                                                {tab.label}
                                                {tab.count > 0 && (
                                                    <span
                                                        style={{
                                                            marginLeft: '6px',
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            backgroundColor: active ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
                                                            color: active ? '#fff' : '#595959',
                                                            padding: '1px 7px',
                                                            borderRadius: '10px',
                                                        }}
                                                    >
                                                        {tab.count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <Button
                                    className="text-white h-9"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                    onClick={() => setShowBulkGradeDialog(true)}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Grade All
                                </Button>
                            </div>

                            {/* Search */}
                            <div className="mb-5">
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                                    <Input
                                        placeholder="Search students by name or ID..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="pl-10 border-[var(--color-border)]"
                                    />
                                </div>
                            </div>

                            {/* Submissions Table or Empty States */}
                            {sorted.length === 0 && counts.all === 0 ? (
                                <div className="text-center py-20">
                                    <Inbox className="w-16 h-16 mx-auto mb-4" style={{ color: '#D9D9D9' }} />
                                    <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>No Submissions Yet</p>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
                                        Students haven't submitted their work yet. Check back after the due date or send a reminder.
                                    </p>
                                </div>
                            ) : counts.graded === counts.all && activeTab === 'graded' ? (
                                <div className="text-center py-20">
                                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#2D6A2D' }} />
                                    <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>All Submissions Graded!</p>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '24px' }}>
                                        Great work! All submissions for this assignment have been graded.
                                    </p>
                                    <Button variant="outline" className="border-[var(--color-border)]" onClick={() => router.push(`/courses/${courseId}/reports`)}>
                                        <BarChart3 className="w-4 h-4 mr-2" /> View Reports
                                    </Button>
                                </div>
                            ) : sorted.length === 0 ? (
                                <div className="text-center py-16">
                                    <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-mid)', marginBottom: '8px' }}>No students match this filter.</p>
                                    <button onClick={() => { setActiveTab('all'); setSearchQuery(''); }} className="hover:underline" style={{ fontSize: '14px', color: 'var(--color-primary)' }}>Clear filters</button>
                                </div>
                            ) : (
                                <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                                    <table className="w-full">
                                        <thead style={{ backgroundColor: 'var(--color-primary-bg)', borderBottom: '1px solid var(--color-border)' }}>
                                            <tr>
                                                <th className="text-left px-6 py-4">
                                                    <button onClick={() => handleSort('studentName')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Student Name <SortIcon field="studentName" />
                                                    </button>
                                                </th>
                                                <th className="text-left px-5 py-4 hidden md:table-cell" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Student ID</th>
                                                <th className="text-left px-5 py-4">
                                                    <button onClick={() => handleSort('submittedAt')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Submitted <SortIcon field="submittedAt" />
                                                    </button>
                                                </th>
                                                <th className="text-left px-5 py-4">
                                                    <button onClick={() => handleSort('autoScore')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Auto Score <SortIcon field="autoScore" />
                                                    </button>
                                                </th>
                                                <th className="text-left px-5 py-4">
                                                    <button onClick={() => handleSort('finalGrade')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Grade <SortIcon field="finalGrade" />
                                                    </button>
                                                </th>
                                                <th className="text-left px-5 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sorted.map((sub) => {
                                                const rowFlagged = sub.flagged;
                                                return (
                                                    <tr
                                                        key={sub.id}
                                                        className="border-b transition-colors"
                                                        style={{
                                                            borderColor: 'var(--color-border)',
                                                            borderLeft: rowFlagged ? '4px solid #FF6B00' : '4px solid transparent',
                                                            backgroundColor: rowFlagged ? '#FFF9F5' : undefined,
                                                            cursor: sub.status !== 'not-submitted' ? 'pointer' : 'default',
                                                            opacity: sub.status === 'graded' ? 0.85 : 1,
                                                        }}
                                                        onMouseEnter={(e) => { if (sub.status !== 'not-submitted') e.currentTarget.style.backgroundColor = rowFlagged ? '#FFF0E6' : '#F5EDED'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = rowFlagged ? '#FFF9F5' : ''; }}
                                                        onClick={() => {
                                                            if (sub.status === 'not-submitted') return;
                                                            const idx = gradableStudents.findIndex(g => g.id === sub.id);
                                                            if (idx >= 0) setGradingStudentIdx(idx);
                                                        }}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 700 }}>
                                                                    {sub.avatarInitials}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        {rowFlagged && <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF6B00' }} />}
                                                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>{sub.studentName}</span>
                                                                    </div>
                                                                    {meta.isGroupAssignment && (() => {
                                                                        const grp = getGroupForStudent(sub.studentId, mockGroups);
                                                                        return grp ? (
                                                                            <span style={{ fontSize: '11px', color: '#6B0000', fontWeight: 500 }}>
                                                                                {grp.name}
                                                                            </span>
                                                                        ) : null;
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4 hidden md:table-cell" style={{ fontSize: '13px', color: '#595959' }}>{sub.studentId}</td>
                                                        <td className="px-5 py-4">
                                                            {sub.submittedAt ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span style={{ fontSize: '13px', color: sub.late ? '#8B0000' : '#595959' }}>
                                                                        {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                                                                        {new Date(sub.submittedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                                    </span>
                                                                    {sub.late && (
                                                                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', backgroundColor: '#8B0000', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Late</span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span style={{ fontSize: '13px', color: '#8A8A8A' }}>Not Yet</span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            {sub.autoScore !== null ? (
                                                                <span style={{ fontSize: '14px', fontWeight: 600, color: scoreColor(sub.autoScore, sub.maxPoints) }}>{sub.autoScore} / {sub.maxPoints}</span>
                                                            ) : (
                                                                <span style={{ fontSize: '14px', color: '#8A8A8A' }}>—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            {sub.finalGrade !== null ? (
                                                                <div className="flex items-center gap-1.5">
                                                                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#2D6A2D' }} />
                                                                    <span style={{ fontSize: '14px', fontWeight: 700, color: scoreColor(sub.finalGrade, sub.maxPoints) }}>{sub.finalGrade} / {sub.maxPoints}</span>
                                                                </div>
                                                            ) : (
                                                                <span style={{ fontSize: '14px', color: '#8A8A8A' }}>—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4" onClick={e => e.stopPropagation()} style={{ cursor: 'default' }}>
                                                            {sub.status === 'not-submitted' ? (
                                                                <button disabled style={{ fontSize: '13px', color: '#8A8A8A', padding: '6px 16px', height: '32px' }}>—</button>
                                                            ) : sub.status === 'graded' ? (
                                                                <Button variant="outline" className="border-[var(--color-border)] h-8 px-4 text-xs" onClick={() => { const idx = gradableStudents.findIndex(g => g.id === sub.id); if (idx >= 0) setGradingStudentIdx(idx); }}>View</Button>
                                                            ) : (
                                                                <Button className="text-white h-8 px-4 text-xs" style={{ backgroundColor: '#6B0000' }} onClick={() => { const idx = gradableStudents.findIndex(g => g.id === sub.id); if (idx >= 0) setGradingStudentIdx(idx); }}>Grade</Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* Bulk Grade All Dialog */}
            <Dialog open={showBulkGradeDialog} onOpenChange={setShowBulkGradeDialog}>
                <DialogContent className="max-w-md" style={{ boxShadow: '0 8px 24px rgba(107,0,0,.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                            Apply Auto-Scores as Final Grades
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                            This will use automated test scores as final grades for all ungraded submissions. Manual review is recommended for accuracy.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#FFF8E1' }}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#8A5700' }} />
                        <p style={{ fontSize: '12px', color: '#8A5700' }}>
                            {counts.submitted + counts.needsReview} ungraded submission(s) will receive their auto-score as the final grade.
                        </p>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowBulkGradeDialog(false)} className="border-[var(--color-border)]">Cancel</Button>
                        <Button onClick={() => setShowBulkGradeDialog(false)} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Apply Grades
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-md" style={{ boxShadow: '0 8px 24px rgba(107,0,0,.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#B91C1C' }}>
                            Delete Assignment
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                            Are you sure you want to delete <strong style={{ color: '#2D2D2D' }}>{meta.name}</strong>? This will permanently remove the assignment and all {counts.all} student submissions.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#FEF2F2' }}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#B91C1C' }} />
                        <p style={{ fontSize: '12px', color: '#B91C1C' }}>
                            This action cannot be undone. All grades, submissions, and feedback will be lost.
                        </p>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="border-[var(--color-border)]">Cancel</Button>
                        <Button
                            onClick={() => { setShowDeleteDialog(false); router.push(`/courses/${courseId}`); }}
                            className="text-white"
                            style={{ backgroundColor: '#B91C1C' }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Assignment Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" style={{ boxShadow: '0 8px 24px rgba(107,0,0,.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                            Edit Assignment
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
                            Update the assignment details below. Changes will be reflected for all students.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 mt-4">
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Assignment Name</label>
                            <Input value={editName} onChange={e => setEditName(e.target.value)} className="border-[var(--color-border)]" />
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Description</label>
                            <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="border-[var(--color-border)] min-h-[100px]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Due Date</label>
                                <Input type="date" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} className="border-[var(--color-border)]" />
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Total Points</label>
                                <Input type="number" value={meta.totalPoints} readOnly className="border-[var(--color-border)] bg-gray-50" />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Instructions</label>
                            <Textarea value={editInstructions} onChange={e => setEditInstructions(e.target.value)} className="border-[var(--color-border)] min-h-[120px]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Allowed Attempts</label>
                                <Input type="number" value={meta.allowedAttempts} readOnly className="border-[var(--color-border)] bg-gray-50" />
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', display: 'block', marginBottom: '6px' }}>Language</label>
                                <Input value={meta.language} readOnly className="border-[var(--color-border)] bg-gray-50" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-[var(--color-border)]">Cancel</Button>
                        <Button onClick={() => setShowEditDialog(false)} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Grading Modal */}
            {currentGradingStudent && gradingStudentIdx !== null && (() => {
                const studentGroup = meta.isGroupAssignment ? getGroupForStudent(currentGradingStudent.studentId, mockGroups) : undefined;
                const groupMembers = meta.isGroupAssignment ? getGroupMembers(currentGradingStudent.studentId, submissions, mockGroups) : [];
                return (
                    <GradingModal
                        studentName={currentGradingStudent.studentName}
                        assignmentName={meta.name}
                        submittedAt={currentGradingStudent.submittedAt ?? ''}
                        autoScore={currentGradingStudent.autoScore}
                        maxPoints={currentGradingStudent.maxPoints}
                        rubric={meta.rubric}
                        hasPrev={gradingStudentIdx > 0}
                        hasNext={gradingStudentIdx < gradableStudents.length - 1}
                        onPrev={() => setGradingStudentIdx(prev => (prev !== null && prev > 0 ? prev - 1 : prev))}
                        onNext={() => setGradingStudentIdx(prev => (prev !== null && prev < gradableStudents.length - 1 ? prev + 1 : prev))}
                        onClose={() => setGradingStudentIdx(null)}
                        onSubmitGrade={(grade, fb) => handleSubmitGrade(currentGradingStudent.id, grade, fb)}
                        onSaveDraft={(grade, fb) => handleSubmitGrade(currentGradingStudent.id, grade, fb)}
                        isGroupAssignment={meta.isGroupAssignment}
                        groupName={studentGroup?.name}
                        groupMemberNames={groupMembers.map(m => m.studentName)}
                        onApplyToGroup={meta.isGroupAssignment && studentGroup ? (grade: number) => {
                            setApplyGroupStudent(currentGradingStudent);
                            setApplyGroupGrade(grade);
                            setShowApplyGroupDialog(true);
                        } : undefined}
                    />
                );
            })()}

            {/* Apply Grade to Group Dialog */}
            <Dialog open={showApplyGroupDialog} onOpenChange={setShowApplyGroupDialog}>
                <DialogContent className="max-w-lg" style={{ boxShadow: '0 8px 24px rgba(107,0,0,.15)' }}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                            <UserCheck className="w-5 h-5" style={{ color: '#2D6A2D' }} />
                            Apply Grade to Group Members
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                            Apply the same grade from <strong style={{ color: '#2D2D2D' }}>{applyGroupStudent?.studentName}</strong> to all other members of{' '}
                            <strong style={{ color: '#6B0000' }}>{applyGroupStudent ? getGroupForStudent(applyGroupStudent.studentId, mockGroups)?.name : ''}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Grade to apply */}
                    <div className="mt-3 p-4 rounded-lg" style={{ backgroundColor: '#F5EDED' }}>
                        <div className="flex items-center justify-between">
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#2D2D2D' }}>Grade to Apply</span>
                            <span style={{ fontSize: '22px', fontWeight: 700, color: '#6B0000' }}>
                                {applyGroupGrade ?? '—'} / {meta.totalPoints}
                            </span>
                        </div>
                    </div>

                    {/* Members who will receive the grade */}
                    <div className="mt-3">
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', marginBottom: '8px' }}>
                            Group members who will receive this grade:
                        </p>
                        <div className="space-y-2">
                            {applyGroupStudent && getGroupMembers(applyGroupStudent.studentId, submissions, mockGroups).map(member => (
                                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-bg)', color: '#6B0000', fontSize: '10px', fontWeight: 700 }}>
                                            {member.avatarInitials}
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>{member.studentName}</span>
                                            <span style={{ fontSize: '11px', color: '#8A8A8A', marginLeft: '8px' }}>{member.studentId}</span>
                                        </div>
                                    </div>
                                    <div>
                                        {member.finalGrade !== null ? (
                                            <span style={{ fontSize: '12px', color: '#8A8A8A' }}>
                                                Current: {member.finalGrade}/{member.maxPoints} → <strong style={{ color: '#6B0000' }}>{applyGroupGrade}</strong>
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '12px', color: '#2D6A2D', fontWeight: 500 }}>
                                                Will receive: {applyGroupGrade}/{member.maxPoints}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {groupGradeApplied && (
                        <div className="mt-3 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: '#F0FDF4' }}>
                            <CheckCircle2 className="w-4 h-4" style={{ color: '#2D6A2D' }} />
                            <p style={{ fontSize: '13px', color: '#2D6A2D', fontWeight: 500 }}>Grade applied to all group members!</p>
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => { setShowApplyGroupDialog(false); setGroupGradeApplied(false); }} className="border-[var(--color-border)]">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (applyGroupStudent && applyGroupGrade !== null) {
                                    handleApplyGroupGrade(applyGroupStudent.id, applyGroupGrade);
                                }
                                setGroupGradeApplied(true);
                                setTimeout(() => {
                                    setShowApplyGroupDialog(false);
                                    setGroupGradeApplied(false);
                                    setGradingStudentIdx(null);
                                }, 1500);
                            }}
                            className="text-white"
                            style={{ backgroundColor: '#2D6A2D' }}
                            disabled={groupGradeApplied}
                        >
                            <UserCheck className="w-4 h-4 mr-2" />
                            {groupGradeApplied ? 'Applied!' : 'Apply to All Members'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}
