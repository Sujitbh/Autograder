import { useState, useMemo } from 'react';
import {
    ChevronLeft, ChevronRight, Check, Copy, Mail, Printer,
    BookOpen, Users, ClipboardList, Info, AlertTriangle, Sparkles,
    GraduationCap, Calendar, Hash, FileText,
} from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { useRouter } from 'next/navigation';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface Course {
    id: string;
    code: string;
    title: string;
    semester: string;
    section?: string;
    description?: string;
    students: number;
    assignments: number;
    pendingGrades: number;
    status: 'active' | 'archived' | 'draft';
    enrollmentCode?: string;
    enrollmentCodeActive?: boolean;
}

interface FormErrors {
    [key: string]: string;
}

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

const CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCourseCode(): string {
    let code = '';
    for (let i = 0; i < 7; i++) {
        code += CODE_CHARSET[Math.floor(Math.random() * CODE_CHARSET.length)];
    }
    return code;
}

function generateSemesters(): { value: string; label: string }[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const terms: { value: string; label: string }[] = [];
    let y = year;
    let startSeason: number;
    if (month >= 0 && month <= 4) startSeason = 0;
    else if (month >= 5 && month <= 6) startSeason = 1;
    else startSeason = 2;
    const seasons = ['Spring', 'Summer', 'Fall'];
    let si = startSeason;
    for (let i = 0; i < 6; i++) {
        if (si > 2) { si = 0; y++; }
        const label = `${seasons[si]} ${y}`;
        terms.push({ value: label, label });
        si++;
    }
    return terms;
}

function getDefaultSemester(): string {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    if (month >= 0 && month <= 4) return `Spring ${year}`;
    if (month >= 5 && month <= 6) return `Summer ${year}`;
    return `Fall ${year}`;
}

function loadCourses(): Course[] {
    try {
        const stored = localStorage.getItem('autograde_courses');
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [];
}

function saveCourses(courses: Course[]) {
    localStorage.setItem('autograde_courses', JSON.stringify(courses));
}

/* ═══════════════════════════════════════════
   Steps
   ═══════════════════════════════════════════ */

const STEPS = [
    { id: 1, label: 'Course Info', icon: BookOpen },
    { id: 2, label: 'Enrollment', icon: Users },
    { id: 3, label: 'Review & Create', icon: ClipboardList },
];

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export function CreateCourse() {
    const router = useRouter();
    const semesters = useMemo(() => generateSemesters(), []);

    /* ── Step ── */
    const [currentStep, setCurrentStep] = useState(1);

    /* ── Form fields ── */
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [semester, setSemester] = useState(getDefaultSemester());
    const [section, setSection] = useState('');
    const [description, setDescription] = useState('');
    const [enrollmentMethod, setEnrollmentMethod] = useState<'code' | 'manual'>('code');
    const [maxStudents, setMaxStudents] = useState('');

    /* ── Validation ── */
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    /* ── Creation state ── */
    const [isCreating, setIsCreating] = useState(false);
    const [createdCourse, setCreatedCourse] = useState<Course | null>(null);
    const [codeCopied, setCodeCopied] = useState(false);

    /* ── Validate per step ── */
    const validateStep = (step: number): boolean => {
        const errors: FormErrors = {};

        if (step === 1) {
            if (!courseCode.trim()) errors.courseCode = 'Course code is required';
            else if (!/^[A-Z0-9\s\-]+$/i.test(courseCode.trim()))
                errors.courseCode = 'Use letters, numbers, spaces, or hyphens (e.g., CS-1001)';
            if (!courseName.trim()) errors.courseName = 'Course name is required';
            if (!semester) errors.semester = 'Semester is required';

            // Check duplicate
            const existing = loadCourses();
            const dup = existing.find(c =>
                c.code.toLowerCase() === courseCode.trim().toLowerCase() &&
                c.semester === semester &&
                (c.section || '') === section.trim()
            );
            if (dup)
                errors.courseCode = 'A course with this code, semester, and section already exists.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const goNext = () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setFormErrors({});
        }
    };

    /* ── Create course ── */
    const handleCreate = () => {
        setIsCreating(true);

        setTimeout(() => {
            const enrollCode = enrollmentMethod === 'code' ? generateCourseCode() : undefined;
            const courseId = `course-${Date.now()}`;
            const newCourse: Course = {
                id: courseId,
                code: courseCode.trim().toUpperCase(),
                title: courseName.trim(),
                semester,
                section: section.trim() || undefined,
                description: description.trim() || undefined,
                students: 0,
                assignments: 0,
                pendingGrades: 0,
                status: 'active',
                enrollmentCode: enrollCode,
                enrollmentCodeActive: enrollmentMethod === 'code',
            };

            const existing = loadCourses();
            saveCourses([newCourse, ...existing]);
            setCreatedCourse(newCourse);
            setIsCreating(false);
            setCurrentStep(4); // success step
        }, 1000);
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), 3000);
        });
    };

    const FieldError = ({ error }: { error?: string }) => {
        if (!error) return null;
        return <p style={{ fontSize: '12px', color: '#B91C1C', marginTop: '4px' }}>{error}</p>;
    };

    /* ═══════════════════════════════════════════
       Step Indicator
       ═══════════════════════════════════════════ */
    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-0 mb-10">
            {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id || currentStep === 4;

                return (
                    <div key={step.id} className="flex items-center">
                        <div className="flex flex-col items-center" style={{ minWidth: '120px' }}>
                            <div
                                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                                style={{
                                    backgroundColor: isComplete ? '#2D6A2D' : isActive ? '#6B0000' : '#F1F1F1',
                                    color: isComplete || isActive ? '#fff' : '#8A8A8A',
                                    boxShadow: isActive ? '0 0 0 4px rgba(107,0,0,0.15)' : 'none',
                                }}
                            >
                                {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <span
                                className="mt-2 text-center"
                                style={{
                                    fontSize: '12px',
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? '#6B0000' : isComplete ? '#2D6A2D' : '#8A8A8A',
                                }}
                            >
                                {step.label}
                            </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div
                                className="h-[2px] transition-colors duration-300"
                                style={{
                                    width: '80px',
                                    backgroundColor: currentStep > step.id || currentStep === 4 ? '#2D6A2D' : '#E5E5E5',
                                    marginBottom: '20px',
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );

    /* ═══════════════════════════════════════════
       STEP 1: Course Information
       ═══════════════════════════════════════════ */
    const Step1 = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ backgroundColor: '#F5EDED' }}>
                    <GraduationCap className="w-7 h-7" style={{ color: '#6B0000' }} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#2D2D2D' }}>Course Information</h2>
                <p style={{ fontSize: '14px', color: '#595959', marginTop: '4px' }}>
                    Enter the basic details for your new course
                </p>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-6">
                {/* Course Code */}
                <div>
                    <label className="flex items-center gap-2 mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>
                        <Hash className="w-3.5 h-3.5" style={{ color: '#6B0000' }} />
                        Course Code <span style={{ color: '#B91C1C' }}>*</span>
                    </label>
                    <Input
                        value={courseCode}
                        onChange={e => setCourseCode(e.target.value)}
                        placeholder="e.g., CS-1001"
                        maxLength={20}
                        className="border-[var(--color-border)] h-11"
                        style={{ fontSize: '15px' }}
                    />
                    <p style={{ fontSize: '11px', color: '#8A8A8A', marginTop: '6px' }}>
                        Official course code from your institution's catalog
                    </p>
                    <FieldError error={formErrors.courseCode} />
                </div>

                {/* Course Name */}
                <div>
                    <label className="flex items-center gap-2 mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>
                        <BookOpen className="w-3.5 h-3.5" style={{ color: '#6B0000' }} />
                        Course Name <span style={{ color: '#B91C1C' }}>*</span>
                    </label>
                    <Input
                        value={courseName}
                        onChange={e => setCourseName(e.target.value)}
                        placeholder="e.g., Introduction to Computer Science"
                        maxLength={100}
                        className="border-[var(--color-border)] h-11"
                        style={{ fontSize: '15px' }}
                    />
                    <div className="flex justify-between mt-1">
                        <FieldError error={formErrors.courseName} />
                        <span style={{ fontSize: '11px', color: '#8A8A8A' }}>{courseName.length}/100</span>
                    </div>
                </div>
            </div>

            {/* Semester + Section */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="flex items-center gap-2 mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>
                        <Calendar className="w-3.5 h-3.5" style={{ color: '#6B0000' }} />
                        Semester <span style={{ color: '#B91C1C' }}>*</span>
                    </label>
                    <Select value={semester} onValueChange={setSemester}>
                        <SelectTrigger className="border-[var(--color-border)] h-11" style={{ fontSize: '15px' }}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {semesters.map(s => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FieldError error={formErrors.semester} />
                </div>
                <div>
                    <label className="flex items-center gap-2 mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>
                        <FileText className="w-3.5 h-3.5" style={{ color: '#6B0000' }} />
                        Section Number
                        <span style={{ fontSize: '11px', color: '#8A8A8A', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <Input
                        value={section}
                        onChange={e => setSection(e.target.value)}
                        placeholder="e.g., 001, A"
                        maxLength={10}
                        className="border-[var(--color-border)] h-11"
                        style={{ fontSize: '15px' }}
                    />
                    <p style={{ fontSize: '11px', color: '#8A8A8A', marginTop: '6px' }}>
                        Use if you teach multiple sections of this course
                    </p>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="flex items-center gap-2 mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>
                    <FileText className="w-3.5 h-3.5" style={{ color: '#6B0000' }} />
                    Course Description
                    <span style={{ fontSize: '11px', color: '#8A8A8A', fontWeight: 400 }}>(optional)</span>
                </label>
                <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Brief description of the course content, learning objectives, or prerequisites..."
                    rows={4}
                    maxLength={500}
                    className="border-[var(--color-border)]"
                    style={{ fontSize: '14px' }}
                />
                <div className="flex justify-between mt-1">
                    <p style={{ fontSize: '11px', color: '#8A8A8A' }}>Helps students identify your course</p>
                    <span style={{ fontSize: '11px', color: '#8A8A8A' }}>{description.length}/500</span>
                </div>
            </div>

            {/* Max Students */}
            <div className="max-w-xs">
                <label className="flex items-center gap-2 mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>
                    <Users className="w-3.5 h-3.5" style={{ color: '#6B0000' }} />
                    Max Students
                    <span style={{ fontSize: '11px', color: '#8A8A8A', fontWeight: 400 }}>(optional)</span>
                </label>
                <Input
                    type="number"
                    value={maxStudents}
                    onChange={e => setMaxStudents(e.target.value)}
                    placeholder="e.g., 40"
                    min={1}
                    max={999}
                    className="border-[var(--color-border)] h-11"
                    style={{ fontSize: '15px' }}
                />
                <p style={{ fontSize: '11px', color: '#8A8A8A', marginTop: '6px' }}>
                    Leave blank for no enrollment cap
                </p>
            </div>
        </div>
    );

    /* ═══════════════════════════════════════════
       STEP 2: Enrollment Method
       ═══════════════════════════════════════════ */
    const Step2 = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ backgroundColor: '#F5EDED' }}>
                    <Users className="w-7 h-7" style={{ color: '#6B0000' }} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#2D2D2D' }}>Student Enrollment</h2>
                <p style={{ fontSize: '14px', color: '#595959', marginTop: '4px' }}>
                    Choose how students will join your course
                </p>
            </div>

            {/* Enrollment Options */}
            <div className="grid grid-cols-2 gap-5">
                {/* Code Option */}
                <label
                    className="flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
                    style={{
                        borderColor: enrollmentMethod === 'code' ? '#6B0000' : 'var(--color-border)',
                        backgroundColor: enrollmentMethod === 'code' ? '#FBF5F5' : '#fff',
                    }}
                >
                    <input
                        type="radio"
                        name="enrollmentMethod"
                        checked={enrollmentMethod === 'code'}
                        onChange={() => setEnrollmentMethod('code')}
                        className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{
                                backgroundColor: enrollmentMethod === 'code' ? '#6B0000' : '#F1F1F1',
                                color: enrollmentMethod === 'code' ? '#fff' : '#8A8A8A',
                            }}
                        >
                            <Sparkles className="w-6 h-6" />
                        </div>
                        {enrollmentMethod === 'code' && (
                            <span className="px-3 py-1 rounded-full" style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#6B0000', color: '#fff' }}>
                                SELECTED
                            </span>
                        )}
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2D2D2D', marginBottom: '6px' }}>
                        Course Code
                    </h3>
                    <p style={{ fontSize: '13px', color: '#595959', lineHeight: '20px', flex: 1 }}>
                        A unique 7-character code is generated automatically. Share it in class, on your syllabus, or via email — students enter the code to join instantly.
                    </p>
                    <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <span className="px-2 py-0.5 rounded" style={{ fontSize: '11px', fontWeight: 600, backgroundColor: '#E8F0FF', color: '#1A4D7A' }}>
                            Recommended
                        </span>
                        <span style={{ fontSize: '11px', color: '#8A8A8A' }}>Self-service enrollment</span>
                    </div>
                </label>

                {/* Manual Option */}
                <label
                    className="flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
                    style={{
                        borderColor: enrollmentMethod === 'manual' ? '#6B0000' : 'var(--color-border)',
                        backgroundColor: enrollmentMethod === 'manual' ? '#FBF5F5' : '#fff',
                    }}
                >
                    <input
                        type="radio"
                        name="enrollmentMethod"
                        checked={enrollmentMethod === 'manual'}
                        onChange={() => setEnrollmentMethod('manual')}
                        className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{
                                backgroundColor: enrollmentMethod === 'manual' ? '#6B0000' : '#F1F1F1',
                                color: enrollmentMethod === 'manual' ? '#fff' : '#8A8A8A',
                            }}
                        >
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        {enrollmentMethod === 'manual' && (
                            <span className="px-3 py-1 rounded-full" style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#6B0000', color: '#fff' }}>
                                SELECTED
                            </span>
                        )}
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2D2D2D', marginBottom: '6px' }}>
                        Manual Enrollment
                    </h3>
                    <p style={{ fontSize: '13px', color: '#595959', lineHeight: '20px', flex: 1 }}>
                        You control who joins by adding students individually, uploading a CSV roster, or importing from your LMS (Canvas, Blackboard, etc.).
                    </p>
                    <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <span className="px-2 py-0.5 rounded" style={{ fontSize: '11px', fontWeight: 600, backgroundColor: '#FFF3E0', color: '#8A5700' }}>
                            Instructor-controlled
                        </span>
                        <span style={{ fontSize: '11px', color: '#8A8A8A' }}>Manual management</span>
                    </div>
                </label>
            </div>

            {/* Context Info */}
            {enrollmentMethod === 'code' ? (
                <div className="flex items-start gap-4 p-5 rounded-xl" style={{ backgroundColor: '#E8F0FF', border: '1px solid #B3D0F0' }}>
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#1A4D7A' }} />
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A4D7A', marginBottom: '4px' }}>
                            How course codes work
                        </p>
                        <ul className="space-y-1" style={{ fontSize: '13px', color: '#1A4D7A', lineHeight: '20px' }}>
                            <li>• A unique 7-character alphanumeric code is generated when you create the course</li>
                            <li>• Students enter the code in their AutoGrade dashboard to join instantly</li>
                            <li>• You can disable, regenerate, or share the code anytime from Course Settings</li>
                            <li>• You can still manually add students even with code enrollment enabled</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-4 p-5 rounded-xl" style={{ backgroundColor: '#FFF3E0', border: '1px solid #F0D8A8' }}>
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#8A5700' }} />
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#8A5700', marginBottom: '4px' }}>
                            Manual enrollment only
                        </p>
                        <ul className="space-y-1" style={{ fontSize: '13px', color: '#8A5700', lineHeight: '20px' }}>
                            <li>• Students cannot self-enroll — you must add each student</li>
                            <li>• Upload a CSV file or add students one by one</li>
                            <li>• You can always enable course codes later from Settings</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );

    /* ═══════════════════════════════════════════
       STEP 3: Review & Create
       ═══════════════════════════════════════════ */
    const Step3 = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ backgroundColor: '#F5EDED' }}>
                    <ClipboardList className="w-7 h-7" style={{ color: '#6B0000' }} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#2D2D2D' }}>Review & Create</h2>
                <p style={{ fontSize: '14px', color: '#595959', marginTop: '4px' }}>
                    Double-check everything before creating your course
                </p>
            </div>

            {/* Summary Card */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
                {/* Maroon header */}
                <div className="px-6 py-4" style={{ backgroundColor: '#6B0000' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                                {courseCode.trim().toUpperCase()}
                            </span>
                            <h3 className="mt-2" style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                                {courseName.trim() || 'Untitled Course'}
                            </h3>
                        </div>
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                        >
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Details grid */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-y-5 gap-x-8">
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Semester</p>
                            <p style={{ fontSize: '15px', fontWeight: 500, color: '#2D2D2D' }}>{semester}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Section</p>
                            <p style={{ fontSize: '15px', fontWeight: 500, color: '#2D2D2D' }}>{section.trim() || '—'}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Enrollment Method</p>
                            <div className="flex items-center gap-2">
                                <p style={{ fontSize: '15px', fontWeight: 500, color: '#2D2D2D' }}>
                                    {enrollmentMethod === 'code' ? 'Course Code (Self-Enrollment)' : 'Manual Only'}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Max Students</p>
                            <p style={{ fontSize: '15px', fontWeight: 500, color: '#2D2D2D' }}>{maxStudents || 'No limit'}</p>
                        </div>
                    </div>

                    {description.trim() && (
                        <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Description</p>
                            <p style={{ fontSize: '14px', color: '#595959', lineHeight: '22px' }}>{description.trim()}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* What happens next */}
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#F9FAFB', border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D', marginBottom: '10px' }}>What happens next?</p>
                <div className="space-y-3">
                    {[
                        { text: 'Your course will be created and set to Active status', color: '#2D6A2D' },
                        enrollmentMethod === 'code'
                            ? { text: 'A unique 7-character enrollment code will be generated for students', color: '#1A4D7A' }
                            : { text: 'You can add students manually from the Students page', color: '#8A5700' },
                        { text: 'You can start creating assignments right away', color: '#6B0000' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color, color: '#fff' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700 }}>{i + 1}</span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#595959' }}>{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    /* ═══════════════════════════════════════════
       STEP 4: Success (post-creation)
       ═══════════════════════════════════════════ */
    const SuccessStep = () => {
        if (!createdCourse) return null;

        return (
            <div className="space-y-8">
                {/* Success banner */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5" style={{ backgroundColor: '#F0FDF4' }}>
                        <Check className="w-10 h-10" style={{ color: '#2D6A2D' }} />
                    </div>
                    <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#2D2D2D' }}>Course Created Successfully!</h2>
                    <p className="mt-2" style={{ fontSize: '16px', color: '#595959' }}>
                        <span style={{ fontWeight: 600 }}>{createdCourse.code}</span> — {createdCourse.title}
                    </p>
                    <p style={{ fontSize: '14px', color: '#8A8A8A', marginTop: '2px' }}>
                        {createdCourse.semester}{createdCourse.section ? ` · Section ${createdCourse.section}` : ''}
                    </p>
                </div>

                {/* Enrollment Code Display */}
                {createdCourse.enrollmentCode && (
                    <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid #6B0000' }}>
                        <div className="px-6 py-4 text-center" style={{ backgroundColor: '#6B0000' }}>
                            <p style={{ fontSize: '13px', fontWeight: 500, color: '#E8CCCC', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                Your Course Enrollment Code
                            </p>
                        </div>
                        <div className="py-10 px-6 text-center" style={{ backgroundColor: '#FBF5F5' }}>
                            <p style={{
                                fontSize: '56px',
                                fontWeight: 700,
                                color: '#6B0000',
                                letterSpacing: '12px',
                                fontFamily: 'monospace',
                                lineHeight: 1,
                            }}>
                                {createdCourse.enrollmentCode}
                            </p>
                            <p className="mt-4" style={{ fontSize: '14px', color: '#595959' }}>
                                Share this code with your students so they can join the course
                            </p>
                        </div>
                        <div className="flex border-t" style={{ borderColor: '#E8CCCC' }}>
                            <button
                                onClick={() => copyCode(createdCourse.enrollmentCode!)}
                                className="flex-1 flex items-center justify-center gap-2 py-4 transition-colors hover:bg-[#F5EDED]"
                                style={{ fontSize: '14px', fontWeight: 500, color: '#6B0000', borderRight: '1px solid #E8CCCC' }}
                            >
                                {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {codeCopied ? 'Copied!' : 'Copy Code'}
                            </button>
                            <button
                                onClick={() => {
                                    const subject = encodeURIComponent(`Join ${createdCourse.title} on AutoGrade`);
                                    const body = encodeURIComponent(
                                        `Hello,\n\nYou are invited to join ${createdCourse.title} (${createdCourse.code}) for ${createdCourse.semester} on AutoGrade.\n\nTo join:\n1. Log in to AutoGrade\n2. Click 'Join Course' in your dashboard\n3. Enter this course code: ${createdCourse.enrollmentCode}\n\nBest regards`
                                    );
                                    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-4 transition-colors hover:bg-[#F5EDED]"
                                style={{ fontSize: '14px', fontWeight: 500, color: '#6B0000', borderRight: '1px solid #E8CCCC' }}
                            >
                                <Mail className="w-4 h-4" /> Email Students
                            </button>
                            <button
                                onClick={() => {
                                    const printWin = window.open('', '_blank');
                                    if (printWin) {
                                        printWin.document.write(`
                      <html><head><title>Course Code</title>
                      <style>body{font-family:Inter,system-ui,sans-serif;text-align:center;padding:60px}
                      h1{color:#6B0000;font-size:28px;margin-bottom:4px}
                      .sub{color:#595959;font-size:16px;margin-bottom:48px}
                      .code{font-size:80px;font-weight:700;color:#6B0000;letter-spacing:16px;font-family:monospace;margin:48px 0;padding:32px 48px;border:3px solid #6B0000;border-radius:20px;display:inline-block}
                      .help{color:#595959;font-size:15px;margin-top:48px;line-height:1.6}</style></head>
                      <body>
                      <h1>${createdCourse.code} — ${createdCourse.title}</h1>
                      <p class="sub">${createdCourse.semester}${createdCourse.section ? ` · Section ${createdCourse.section}` : ''}</p>
                      <div class="code">${createdCourse.enrollmentCode}</div>
                      <p class="help">To join this course on AutoGrade:<br>
                      1. Go to autograde.app and log in<br>
                      2. Click "Join Course" in your dashboard<br>
                      3. Enter the code above</p>
                      </body></html>`);
                                        printWin.document.close();
                                        printWin.print();
                                    }
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-4 transition-colors hover:bg-[#F5EDED]"
                                style={{ fontSize: '14px', fontWeight: 500, color: '#6B0000' }}
                            >
                                <Printer className="w-4 h-4" /> Print for Syllabus
                            </button>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D', marginBottom: '12px' }}>Quick Actions</p>
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => router.push(`/courses/${createdCourse.id}`)}
                            className="p-5 rounded-xl border text-left transition-all hover:shadow-md hover:border-[#6B0000]"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff' }}
                        >
                            <BookOpen className="w-6 h-6 mb-3" style={{ color: '#6B0000' }} />
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>Open Course</p>
                            <p style={{ fontSize: '12px', color: '#8A8A8A', marginTop: '2px' }}>View your new course dashboard</p>
                        </button>
                        <button
                            onClick={() => router.push(`/courses/${createdCourse.id}/assignment/new`)}
                            className="p-5 rounded-xl border text-left transition-all hover:shadow-md hover:border-[#6B0000]"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff' }}
                        >
                            <FileText className="w-6 h-6 mb-3" style={{ color: '#6B0000' }} />
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>Create Assignment</p>
                            <p style={{ fontSize: '12px', color: '#8A8A8A', marginTop: '2px' }}>Start building your first assignment</p>
                        </button>
                        <button
                            onClick={() => router.push(`/courses/${createdCourse.id}/settings`)}
                            className="p-5 rounded-xl border text-left transition-all hover:shadow-md hover:border-[#6B0000]"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff' }}
                        >
                            <Users className="w-6 h-6 mb-3" style={{ color: '#6B0000' }} />
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>Course Settings</p>
                            <p style={{ fontSize: '12px', color: '#8A8A8A', marginTop: '2px' }}>Manage enrollment & preferences</p>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    /* ═══════════════════════════════════════════
       Render
       ═══════════════════════════════════════════ */
    return (
        <PageLayout>
            <TopNav
                breadcrumbs={[
                    { label: 'Courses', href: '/courses' },
                    { label: 'Create New Course' },
                ]}
            />

            <main className="flex-1 overflow-auto" style={{ backgroundColor: '#FAFAFA' }}>
                <div className="max-w-3xl mx-auto py-10 px-6">

                    {/* Step Progress (hide on success) */}
                    {currentStep <= 3 && StepIndicator()}

                    {/* Step Content */}
                    <div
                        className="rounded-2xl p-8"
                        style={{
                            backgroundColor: '#fff',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        {currentStep === 1 && Step1()}
                        {currentStep === 2 && Step2()}
                        {currentStep === 3 && Step3()}
                        {currentStep === 4 && SuccessStep()}
                    </div>

                    {/* Navigation Footer (hide on success) */}
                    {currentStep <= 3 && (
                        <div className="flex items-center justify-between mt-8">
                            <div>
                                {currentStep === 1 ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push('/courses')}
                                        className="border-[var(--color-border)]"
                                        style={{ height: '44px', padding: '0 24px' }}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Back to Courses
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={goBack}
                                        className="border-[var(--color-border)]"
                                        style={{ height: '44px', padding: '0 24px' }}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Previous
                                    </Button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <span style={{ fontSize: '13px', color: '#8A8A8A' }}>
                                    Step {currentStep} of 3
                                </span>
                            </div>

                            <div>
                                {currentStep < 3 ? (
                                    <Button
                                        onClick={goNext}
                                        className="text-white"
                                        style={{ backgroundColor: '#6B0000', height: '44px', padding: '0 28px' }}
                                    >
                                        Continue
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleCreate}
                                        disabled={isCreating}
                                        className="text-white"
                                        style={{ backgroundColor: '#6B0000', height: '44px', padding: '0 28px' }}
                                    >
                                        {isCreating ? (
                                            <>
                                                <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                                                Creating Course…
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                Create Course
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Back to courses on success */}
                    {currentStep === 4 && (
                        <div className="flex justify-center mt-8">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/courses')}
                                className="border-[var(--color-border)]"
                                style={{ height: '44px', padding: '0 28px' }}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back to My Courses
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </PageLayout>
    );
}
