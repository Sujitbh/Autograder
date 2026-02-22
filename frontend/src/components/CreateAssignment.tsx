import { useState, useRef, useCallback } from 'react';
import {
    ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Plus, Trash2, GripVertical,
    Save, X, Upload, FileText, AlertCircle, Check, Eye, Clock, Settings2,
    BookOpen, Code, Star, ShieldAlert, Zap, Copy, RotateCcw, BookmarkPlus, FolderOpen, Users,
} from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { useRouter, useParams } from 'next/navigation';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogFooter, DialogDescription,
} from './ui/dialog';
import { COURSE_STUDENT_COUNTS } from '../utils/studentData';

function lookupCourseCode(id: string) {
    try { const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]'); const f = s.find((c: any) => c.id === id); if (f) return f.code; } catch { } return id;
}

/* ════════════════════════════════════════════════════════
   Types
   ════════════════════════════════════════════════════════ */

interface TestCase {
    id: string;
    input: string;
    expectedOutput: string;
    inputType: 'text' | 'file' | 'command';
    points: number;
    timeout: number;
    description: string;
}

interface RubricCriterion {
    id: string;
    name: string;
    description: string;
    points: number;
    weight: number;
}

/* ════════════════════════════════════════════════════════
   Step progress indicator
   ════════════════════════════════════════════════════════ */

const STEPS = [
    { id: 1, label: 'Basic Info', icon: FileText },
    { id: 2, label: 'Starter Code', icon: Code },
    { id: 3, label: 'Test Cases', icon: Zap },
    { id: 4, label: 'Rubric', icon: Star },
    { id: 5, label: 'Submission', icon: Settings2 },
    { id: 6, label: 'AI Settings', icon: ShieldAlert },
    { id: 7, label: 'Review', icon: Eye },
];

function StepIndicator({ currentStep, onStepClick, completedSteps }: {
    currentStep: number;
    onStepClick: (step: number) => void;
    completedSteps: Set<number>;
}) {
    return (
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {STEPS.map((step, i) => {
                const isActive = currentStep === step.id;
                const isCompleted = completedSteps.has(step.id);
                const isPast = step.id < currentStep;
                return (
                    <div key={step.id} className="flex items-center">
                        <button
                            onClick={() => onStepClick(step.id)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap"
                            style={{
                                backgroundColor: isActive ? '#6B0000' : isCompleted ? '#F0FDF4' : 'transparent',
                                color: isActive ? '#fff' : isCompleted ? '#2D6A2D' : isPast ? '#595959' : '#8A8A8A',
                                fontSize: '13px',
                                fontWeight: isActive ? 600 : 400,
                                border: isActive ? 'none' : isCompleted ? '1px solid #BBF7D0' : '1px solid transparent',
                            }}
                        >
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{
                                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : isCompleted ? '#2D6A2D' : '#E0E0E0',
                                    color: isActive || isCompleted ? '#fff' : '#8A8A8A',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                }}
                            >
                                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                            </div>
                            <span className="hidden sm:inline">{step.label}</span>
                        </button>
                        {i < STEPS.length - 1 && (
                            <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" style={{ color: '#D0D0D0' }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ════════════════════════════════════════════════════════
   Field validation helper
   ════════════════════════════════════════════════════════ */

interface ValidationErrors {
    [key: string]: string;
}

function FieldError({ error }: { error?: string }) {
    if (!error) return null;
    return (
        <p className="flex items-center gap-1 mt-1.5" style={{ fontSize: '12px', color: '#B91C1C' }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
        </p>
    );
}

/* ════════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════════ */

export function CreateAssignment() {
    const router = useRouter();
    const { courseId } = useParams() as { courseId: string };
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── Step wizard state ── */
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    /* ── Step 1: Basic Info ── */
    const [assignmentName, setAssignmentName] = useState('');
    const [language, setLanguage] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('23:59');
    const [description, setDescription] = useState('');
    const [totalPoints, setTotalPoints] = useState(100);
    const [latePolicy, setLatePolicy] = useState('10percent');
    const [maxLateDays, setMaxLateDays] = useState(3);
    const [isDraft, setIsDraft] = useState(false);

    /* ── Step 2: Starter Code ── */
    const [starterCode, setStarterCode] = useState('');
    const [starterFileName, setStarterFileName] = useState('');

    /* ── Step 3: Test Cases ── */
    const [publicTests, setPublicTests] = useState<TestCase[]>([
        { id: '1', input: '', expectedOutput: '', inputType: 'text', points: 10, timeout: 5, description: '' },
    ]);
    const [privateTests, setPrivateTests] = useState<TestCase[]>([
        { id: '1', input: '', expectedOutput: '', inputType: 'text', points: 10, timeout: 5, description: '' },
    ]);

    /* ── Step 4: Rubric ── */
    const [isWeightedRubric, setIsWeightedRubric] = useState(false);
    const [rubricType, setRubricType] = useState<'auto' | 'manual' | 'hybrid'>('hybrid');
    const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([
        { id: '1', name: 'Code Correctness', description: 'Code produces correct output for all test cases', points: 50, weight: 50 },
        { id: '2', name: 'Code Style', description: 'Follows PEP8/language style guidelines', points: 20, weight: 20 },
        { id: '3', name: 'Documentation', description: 'Includes comments, docstrings, and file header', points: 30, weight: 30 },
    ]);
    const [showSaveRubricDialog, setShowSaveRubricDialog] = useState(false);
    const [rubricTemplateName, setRubricTemplateName] = useState('');
    const [rubricSaveSuccess, setRubricSaveSuccess] = useState(false);

    interface SavedRubricTemplate {
        name: string;
        isWeighted: boolean;
        type: 'auto' | 'manual' | 'hybrid';
        criteria: RubricCriterion[];
    }

    const [savedRubricTemplates, setSavedRubricTemplates] = useState<SavedRubricTemplate[]>([
        {
            name: 'Standard Coding Assignment',
            isWeighted: false,
            type: 'hybrid',
            criteria: [
                { id: '1', name: 'Code Correctness', description: 'Produces correct output for all test cases', points: 50, weight: 50 },
                { id: '2', name: 'Code Style', description: 'Follows language style guidelines', points: 20, weight: 20 },
                { id: '3', name: 'Documentation', description: 'Includes comments and docstrings', points: 30, weight: 30 },
            ],
        },
        {
            name: 'Algorithm Analysis',
            isWeighted: true,
            type: 'hybrid',
            criteria: [
                { id: '1', name: 'Correctness', description: 'Algorithm produces expected output', points: 40, weight: 40 },
                { id: '2', name: 'Time Complexity', description: 'Meets expected time complexity', points: 25, weight: 25 },
                { id: '3', name: 'Space Complexity', description: 'Meets expected space complexity', points: 15, weight: 15 },
                { id: '4', name: 'Code Quality', description: 'Clean, readable, well-structured code', points: 20, weight: 20 },
            ],
        },
        {
            name: 'Project-Based',
            isWeighted: true,
            type: 'manual',
            criteria: [
                { id: '1', name: 'Functionality', description: 'All required features work correctly', points: 40, weight: 40 },
                { id: '2', name: 'Code Architecture', description: 'Proper use of classes, modules, and design patterns', points: 20, weight: 20 },
                { id: '3', name: 'Testing', description: 'Includes unit tests with good coverage', points: 15, weight: 15 },
                { id: '4', name: 'Documentation', description: 'README, docstrings, and inline comments', points: 15, weight: 15 },
                { id: '5', name: 'UI/UX (if applicable)', description: 'Clean interface and user experience', points: 10, weight: 10 },
            ],
        },
    ]);

    const handleSaveRubricTemplate = () => {
        if (!rubricTemplateName.trim()) return;
        const newTemplate: SavedRubricTemplate = {
            name: rubricTemplateName.trim(),
            isWeighted: isWeightedRubric,
            type: rubricType,
            criteria: rubricCriteria.map(c => ({ ...c, id: Date.now().toString() + c.id })),
        };
        setSavedRubricTemplates(prev => [...prev, newTemplate]);
        setRubricTemplateName('');
        setShowSaveRubricDialog(false);
        setRubricSaveSuccess(true);
        setTimeout(() => setRubricSaveSuccess(false), 3000);
    };

    const handleLoadRubricTemplate = (templateName: string) => {
        const template = savedRubricTemplates.find(t => t.name === templateName);
        if (template) {
            setIsWeightedRubric(template.isWeighted);
            setRubricType(template.type);
            setRubricCriteria(template.criteria.map((c, i) => ({ ...c, id: Date.now().toString() + i })));
        }
    };

    /* ── Step 5: Submission Settings ── */
    const [isGroupAssignment, setIsGroupAssignment] = useState(false);
    const [maxAttempts, setMaxAttempts] = useState(5);
    const [allowedFileTypes, setAllowedFileTypes] = useState('.py');
    const [maxFileSize, setMaxFileSize] = useState(5);
    const [enableGitSubmission, setEnableGitSubmission] = useState(false);
    const [showSubmissionToStudents, setShowSubmissionToStudents] = useState(true);
    const [allowResubmission, setAllowResubmission] = useState(true);
    const [gradingStrategy, setGradingStrategy] = useState<'latest' | 'best'>('latest');

    /* ── Step 6: AI Settings ── */
    const [plagiarismEnabled, setPlagiarismEnabled] = useState(true);
    const [plagiarismSensitivity, setPlagiarismSensitivity] = useState(50);
    const [aiCodeDetectionEnabled, setAiCodeDetectionEnabled] = useState(true);
    const [aiDetectionSensitivity, setAiDetectionSensitivity] = useState(50);
    const [manualReviewThreshold, setManualReviewThreshold] = useState(true);
    const [flagThresholdPercent, setFlagThresholdPercent] = useState(70);

    /* ════════════════════════════════════════════════════════
       Validation
       ════════════════════════════════════════════════════════ */

    const validateStep = useCallback((step: number): boolean => {
        const newErrors: ValidationErrors = {};

        if (step === 1) {
            if (!assignmentName.trim()) newErrors.assignmentName = 'Assignment name is required';
            else if (assignmentName.length > 100) newErrors.assignmentName = 'Name must be under 100 characters';
            if (!language) newErrors.language = 'Please select a programming language';
            if (!dueDate) newErrors.dueDate = 'Due date is required';
            if (description.length > 5000) newErrors.description = 'Description must be under 5000 characters';
            if (totalPoints < 1 || totalPoints > 1000) newErrors.totalPoints = 'Points must be between 1 and 1000';
        }

        if (step === 3) {
            if (publicTests.length === 0 && privateTests.length === 0) {
                newErrors.tests = 'At least one test case (public or private) is required';
            }
        }

        if (step === 4) {
            if (rubricCriteria.length === 0) newErrors.rubric = 'At least one rubric criterion is required';
            rubricCriteria.forEach((c, i) => {
                if (!c.name.trim()) newErrors[`rubric_name_${i}`] = `Criterion ${i + 1} needs a name`;
                if (c.points < 0) newErrors[`rubric_points_${i}`] = 'Points cannot be negative';
            });
            if (isWeightedRubric) {
                const totalWeight = rubricCriteria.reduce((s, c) => s + c.weight, 0);
                if (totalWeight !== 100) newErrors.rubricWeight = `Weights must total 100% (currently ${totalWeight}%)`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [assignmentName, language, dueDate, description, totalPoints, publicTests, privateTests, rubricCriteria, isWeightedRubric]);

    /* ════════════════════════════════════════════════════════
       Navigation
       ════════════════════════════════════════════════════════ */

    const goToStep = (step: number) => {
        if (validateStep(currentStep)) {
            setCompletedSteps(prev => new Set([...prev, currentStep]));
        }
        setCurrentStep(step);
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            setCurrentStep(prev => Math.min(prev + 1, 7));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    /* ════════════════════════════════════════════════════════
       Test case helpers
       ════════════════════════════════════════════════════════ */

    const addTestCase = (type: 'public' | 'private') => {
        const setter = type === 'public' ? setPublicTests : setPrivateTests;
        const tests = type === 'public' ? publicTests : privateTests;
        setter([...tests, { id: Date.now().toString(), input: '', expectedOutput: '', inputType: 'text', points: 10, timeout: 5, description: '' }]);
    };

    const removeTestCase = (type: 'public' | 'private', id: string) => {
        const setter = type === 'public' ? setPublicTests : setPrivateTests;
        const tests = type === 'public' ? publicTests : privateTests;
        if (tests.length > 1) setter(tests.filter(t => t.id !== id));
    };

    const updateTestCase = (type: 'public' | 'private', id: string, field: keyof TestCase, value: string | number) => {
        const setter = type === 'public' ? setPublicTests : setPrivateTests;
        const tests = type === 'public' ? publicTests : privateTests;
        setter(tests.map(t => (t.id === id ? { ...t, [field]: value } : t)));
    };

    const duplicateTestCase = (type: 'public' | 'private', id: string) => {
        const setter = type === 'public' ? setPublicTests : setPrivateTests;
        const tests = type === 'public' ? publicTests : privateTests;
        const src = tests.find(t => t.id === id);
        if (src) setter([...tests, { ...src, id: Date.now().toString() }]);
    };

    /* ════════════════════════════════════════════════════════
       Rubric helpers
       ════════════════════════════════════════════════════════ */

    const addRubricCriterion = () => {
        setRubricCriteria([...rubricCriteria, { id: Date.now().toString(), name: '', description: '', points: 10, weight: 10 }]);
    };

    const removeRubricCriterion = (id: string) => {
        if (rubricCriteria.length > 1) setRubricCriteria(rubricCriteria.filter(c => c.id !== id));
    };

    const updateRubricCriterion = (id: string, field: keyof RubricCriterion, value: string | number) => {
        setRubricCriteria(rubricCriteria.map(c => (c.id === id ? { ...c, [field]: value } : c)));
    };

    const getTotalPoints = () => rubricCriteria.reduce((s, c) => s + c.points, 0);
    const getTotalWeight = () => rubricCriteria.reduce((s, c) => s + c.weight, 0);

    const getSensitivityLabel = (v: number) => {
        if (v < 33) return 'Low';
        if (v < 67) return 'Medium';
        return 'High';
    };

    /* ════════════════════════════════════════════════════════
       Save / Publish
       ════════════════════════════════════════════════════════ */

    const cid = courseId ?? 'cs-1001';

    const latePolicyLabel = (val: string) => {
        const map: Record<string, string> = { none: 'No late submissions', '10percent': '10% deduction per day, max 3 days late', '20percent': '20% deduction per day, max 2 days late', custom: 'Custom policy' };
        return map[val] || val;
    };

    const buildAssignmentPayload = (published: boolean) => ({
        id: `a-${Date.now()}`,
        name: assignmentName.trim() || 'Untitled Assignment',
        language: language ? (langLabel(language)) : 'Python',
        dueDate: dueDate || new Date().toISOString().slice(0, 10),
        submissions: 0,
        totalStudents: COURSE_STUDENT_COUNTS[cid] ?? 42,
        gradedCount: 0,
        published,
        courseId: cid,
        /* extended metadata for grading page */
        createdDate: new Date().toISOString().slice(0, 10),
        totalPoints,
        description: description || '',
        instructions: '',
        allowedAttempts: 3,
        latePolicy: latePolicyLabel(latePolicy),
        aiDetection: true,
        rubric: rubricCriteria.map(c => ({ name: c.name, description: c.description, maxPoints: c.points })),
        isGroupAssignment,
    });

    const saveAssignmentToStorage = (published: boolean) => {
        const payload = buildAssignmentPayload(published);
        try {
            const existing = JSON.parse(localStorage.getItem('createdAssignments') || '[]');
            existing.push(payload);
            localStorage.setItem('createdAssignments', JSON.stringify(existing));
        } catch { /* ignore */ }
    };

    const handleSaveDraft = () => {
        setIsSaving(true);
        saveAssignmentToStorage(false);
        setTimeout(() => { setIsSaving(false); router.push(`/courses/${cid}`); }, 800);
    };

    const handlePublish = () => {
        let allValid = true;
        for (let s = 1; s <= 6; s++) {
            if (!validateStep(s)) { allValid = false; setCurrentStep(s); break; }
        }
        if (allValid) setShowPublishDialog(true);
    };

    const confirmPublish = () => {
        setShowPublishDialog(false);
        setIsSaving(true);
        saveAssignmentToStorage(true);
        setTimeout(() => { setIsSaving(false); router.push(`/courses/${cid}`); }, 800);
    };

    /* ════════════════════════════════════════════════════════
       Render test case block (reused for public & private)
       ════════════════════════════════════════════════════════ */

    const renderTestCases = (type: 'public' | 'private', tests: TestCase[]) => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2D2D2D' }}>
                        {type === 'public' ? 'Public Test Cases' : 'Private Test Cases (Hidden)'}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#595959', marginTop: '4px' }}>
                        {type === 'public'
                            ? 'Visible to students for self-testing before submission.'
                            : 'Used for grading but hidden from students. These determine the auto-score.'}
                    </p>
                </div>
                <span className="px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600, backgroundColor: type === 'public' ? '#EFF6FF' : '#FFF8E1', color: type === 'public' ? '#1976D2' : '#8A5700' }}>
                    {tests.length} test{tests.length !== 1 ? 's' : ''}
                </span>
            </div>

            {tests.map((test, index) => (
                <div
                    key={test.id}
                    className="p-5 border rounded-lg"
                    style={{
                        borderColor: 'var(--color-border)',
                        backgroundColor: type === 'private' ? '#FFFDF5' : '#fff',
                    }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-[var(--color-text-light)] cursor-move" />
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>
                                {type === 'public' ? 'Public' : 'Private'} Test {index + 1}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button type="button" variant="ghost" size="sm" onClick={() => duplicateTestCase(type, test.id)} title="Duplicate">
                                <Copy className="w-4 h-4" style={{ color: '#595959' }} />
                            </Button>
                            {tests.length > 1 && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeTestCase(type, test.id)} title="Delete">
                                    <Trash2 className="w-4 h-4" style={{ color: '#B91C1C' }} />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-1">
                                <label className="block mb-1" style={{ fontSize: '12px', fontWeight: 500, color: '#595959' }}>Input Type</label>
                                <Select value={test.inputType} onValueChange={(v) => updateTestCase(type, test.id, 'inputType', v)}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">Text (stdin)</SelectItem>
                                        <SelectItem value="file">File Input</SelectItem>
                                        <SelectItem value="command">Command-line Args</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block mb-1" style={{ fontSize: '12px', fontWeight: 500, color: '#595959' }}>Points</label>
                                <Input type="number" value={test.points} onChange={e => updateTestCase(type, test.id, 'points', parseInt(e.target.value) || 0)} className="h-9 border-[var(--color-border)]" />
                            </div>
                            <div>
                                <label className="block mb-1" style={{ fontSize: '12px', fontWeight: 500, color: '#595959' }}>Timeout (sec)</label>
                                <Input type="number" value={test.timeout} onChange={e => updateTestCase(type, test.id, 'timeout', parseInt(e.target.value) || 5)} className="h-9 border-[var(--color-border)]" />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1" style={{ fontSize: '12px', fontWeight: 500, color: '#595959' }}>Description (optional)</label>
                            <Input value={test.description} onChange={e => updateTestCase(type, test.id, 'description', e.target.value)} placeholder="e.g., Test with empty input" className="h-9 border-[var(--color-border)]" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block mb-1" style={{ fontSize: '12px', fontWeight: 500, color: '#595959' }}>Input</label>
                                <Textarea value={test.input} onChange={e => updateTestCase(type, test.id, 'input', e.target.value)} placeholder="Enter test input..." rows={3} className="border-[var(--color-border)] font-mono text-sm" />
                            </div>
                            <div>
                                <label className="block mb-1" style={{ fontSize: '12px', fontWeight: 500, color: '#595959' }}>Expected Output</label>
                                <Textarea value={test.expectedOutput} onChange={e => updateTestCase(type, test.id, 'expectedOutput', e.target.value)} placeholder="Enter expected output..." rows={3} className="border-[var(--color-border)] font-mono text-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <Button type="button" variant="outline" onClick={() => addTestCase(type)} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add {type === 'public' ? 'Public' : 'Private'} Test Case
            </Button>
        </div>
    );

    /* ════════════════════════════════════════════════════════
       JSX
       ════════════════════════════════════════════════════════ */

    const langLabel = (l: string) => {
        const map: Record<string, string> = {
            python: 'Python', java: 'Java',
        };
        return map[l] ?? l;
    };

    return (
        <PageLayout>
            <TopNav breadcrumbs={[
                { label: 'Courses', href: '/courses' },
                { label: lookupCourseCode(cid), href: `/courses/${cid}` },
                { label: 'Create Assignment' },
            ]} />

            <div className="flex h-[calc(100vh-64px)]">
                <Sidebar activeItem="assignments" />

                <main className="flex-1 overflow-auto">
                    {/* ── Sticky header ── */}
                    <div className="sticky top-0 z-10 border-b px-8 py-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowDiscardDialog(true)} className="flex items-center gap-1 hover:underline" style={{ fontSize: '13px', color: '#6B0000' }}>
                                    <ChevronLeft className="w-4 h-4" /> Cancel
                                </button>
                                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#6B0000' }}>Create New Assignment</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" className="border-[var(--color-border)] h-9" onClick={handleSaveDraft} disabled={isSaving}>
                                    <Save className="w-4 h-4 mr-2" />{isSaving ? 'Saving...' : 'Save Draft'}
                                </Button>
                                <Button type="button" className="text-white h-9" style={{ backgroundColor: '#6B0000' }} onClick={handlePublish} disabled={isSaving}>
                                    <Check className="w-4 h-4 mr-2" /> Publish
                                </Button>
                            </div>
                        </div>
                        <StepIndicator currentStep={currentStep} onStepClick={goToStep} completedSteps={completedSteps} />
                    </div>

                    {/* ── Step Content ── */}
                    <div className="p-8 max-w-4xl">

                        {/* ────────────── STEP 1: BASIC INFO ────────────── */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="flex items-center gap-2 mb-1" style={{ fontSize: '18px', fontWeight: 600, color: '#2D2D2D' }}>
                                        <FileText className="w-5 h-5" style={{ color: '#6B0000' }} /> Basic Information
                                    </h2>
                                    <p style={{ fontSize: '13px', color: '#595959' }}>Configure the assignment's core details.</p>
                                </div>

                                <div>
                                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>
                                        Assignment Name <span style={{ color: '#B91C1C' }}>*</span>
                                    </label>
                                    <Input value={assignmentName} onChange={e => setAssignmentName(e.target.value)} placeholder="e.g., Hello World Program" className="border-[var(--color-border)]" maxLength={100} />
                                    <div className="flex items-center justify-between mt-1">
                                        <FieldError error={errors.assignmentName} />
                                        <span style={{ fontSize: '11px', color: '#8A8A8A' }}>{assignmentName.length}/100</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>
                                            Programming Language <span style={{ color: '#B91C1C' }}>*</span>
                                        </label>
                                        <Select value={language} onValueChange={setLanguage}>
                                            <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="python">Python</SelectItem>
                                                <SelectItem value="java">Java</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FieldError error={errors.language} />
                                    </div>
                                    <div>
                                        <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>
                                            Due Date <span style={{ color: '#B91C1C' }}>*</span>
                                        </label>
                                        <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="border-[var(--color-border)]" />
                                        <FieldError error={errors.dueDate} />
                                    </div>
                                    <div>
                                        <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Due Time</label>
                                        <Input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} className="border-[var(--color-border)]" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Description</label>
                                    <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide detailed instructions for students. Include examples, expected behavior, constraints, etc." rows={8} className="border-[var(--color-border)]" maxLength={5000} />
                                    <div className="flex items-center justify-between mt-1">
                                        <FieldError error={errors.description} />
                                        <span style={{ fontSize: '11px', color: '#8A8A8A' }}>{description.length}/5000</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Total Points</label>
                                        <Input type="number" value={totalPoints} onChange={e => setTotalPoints(parseInt(e.target.value) || 0)} className="border-[var(--color-border)]" min={1} max={1000} />
                                        <FieldError error={errors.totalPoints} />
                                    </div>
                                    <div>
                                        <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Late Submission Policy</label>
                                        <Select value={latePolicy} onValueChange={setLatePolicy}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No Late Submissions</SelectItem>
                                                <SelectItem value="10percent">10% Penalty per Day</SelectItem>
                                                <SelectItem value="25percent">25% Penalty per Day</SelectItem>
                                                <SelectItem value="50percent">50% Flat Penalty</SelectItem>
                                                <SelectItem value="allowed">Allow Without Penalty</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {latePolicy !== 'none' && latePolicy !== 'allowed' && (
                                        <div>
                                            <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Max Late Days</label>
                                            <Input type="number" value={maxLateDays} onChange={e => setMaxLateDays(parseInt(e.target.value) || 0)} className="border-[var(--color-border)]" min={1} max={14} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#F5EDED' }}>
                                    <Checkbox id="draft" checked={isDraft} onCheckedChange={v => setIsDraft(!!v)} />
                                    <div>
                                        <label htmlFor="draft" className="cursor-pointer" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Save as Draft</label>
                                        <p style={{ fontSize: '12px', color: '#595959', marginTop: '4px' }}>Assignment will not be visible to students until published.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ────────────── STEP 2: STARTER CODE ────────────── */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="flex items-center gap-2 mb-1" style={{ fontSize: '18px', fontWeight: 600, color: '#2D2D2D' }}>
                                        <Code className="w-5 h-5" style={{ color: '#6B0000' }} /> Starter Code
                                    </h2>
                                    <p style={{ fontSize: '13px', color: '#595959' }}>Provide template code that students will start with (optional).</p>
                                </div>

                                <div>
                                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>File Name</label>
                                    <Input value={starterFileName} onChange={e => setStarterFileName(e.target.value)} placeholder={language === 'python' ? 'main.py' : language === 'java' ? 'Main.java' : 'main.txt'} className="border-[var(--color-border)] max-w-xs" />
                                </div>

                                <div>
                                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Code Template</label>
                                    <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
                                        <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: '#1E1E2E', borderBottom: '1px solid #333' }}>
                                            <span style={{ fontSize: '12px', color: '#8A8A8A' }}>{starterFileName || 'untitled'}</span>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setStarterCode('')} title="Clear">
                                                <RotateCcw className="w-3.5 h-3.5" style={{ color: '#8A8A8A' }} />
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={starterCode}
                                            onChange={e => setStarterCode(e.target.value)}
                                            placeholder={language === 'python' ? '# Write your code here\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()' : '// Write your code here'}
                                            rows={16}
                                            className="border-0 rounded-none font-mono text-sm focus-visible:ring-0"
                                            style={{ backgroundColor: '#1E1E2E', color: '#E0E0E0', fontFamily: 'JetBrains Mono, monospace', resize: 'vertical' }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept=".py,.java"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setStarterFileName(file.name);
                                                const reader = new FileReader();
                                                reader.onload = () => setStarterCode(reader.result as string);
                                                reader.readAsText(file);
                                            }
                                        }}
                                    />
                                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="w-4 h-4 mr-2" /> Upload File
                                    </Button>
                                    <span style={{ fontSize: '12px', color: '#595959' }}>or type/paste code directly in the editor above</span>
                                </div>
                            </div>
                        )}

                        {/* ────────────── STEP 3: TEST CASES ────────────── */}
                        {currentStep === 3 && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="flex items-center gap-2 mb-1" style={{ fontSize: '18px', fontWeight: 600, color: '#2D2D2D' }}>
                                        <Zap className="w-5 h-5" style={{ color: '#6B0000' }} /> Test Cases
                                    </h2>
                                    <p style={{ fontSize: '13px', color: '#595959' }}>Define input/output pairs used for automated testing and grading.</p>
                                    <FieldError error={errors.tests} />
                                </div>

                                {renderTestCases('public', publicTests)}

                                <div style={{ borderTop: '2px dashed var(--color-border)', margin: '16px 0' }} />

                                {renderTestCases('private', privateTests)}

                                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5EDED' }}>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p style={{ fontSize: '20px', fontWeight: 700, color: '#6B0000' }}>{publicTests.length}</p>
                                            <p style={{ fontSize: '12px', color: '#595959' }}>Public Tests</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '20px', fontWeight: 700, color: '#6B0000' }}>{privateTests.length}</p>
                                            <p style={{ fontSize: '12px', color: '#595959' }}>Private Tests</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '20px', fontWeight: 700, color: '#6B0000' }}>
                                                {publicTests.reduce((s, t) => s + t.points, 0) + privateTests.reduce((s, t) => s + t.points, 0)}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#595959' }}>Total Test Points</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ────────────── STEP 4: RUBRIC ────────────── */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="flex items-center gap-2 mb-1" style={{ fontSize: '18px', fontWeight: 600, color: '#2D2D2D' }}>
                                        <Star className="w-5 h-5" style={{ color: '#C9A84C' }} /> Rubric Design
                                    </h2>
                                    <p style={{ fontSize: '13px', color: '#595959' }}>Configure grading criteria and point allocation.</p>
                                    <FieldError error={errors.rubric} />
                                </div>

                                {/* Save / Load rubric templates */}
                                <div className="flex flex-wrap items-center gap-2 p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: '#FAFAFA' }}>
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <FolderOpen className="w-4 h-4 flex-shrink-0" style={{ color: '#6B0000' }} />
                                        <Select onValueChange={handleLoadRubricTemplate}>
                                            <SelectTrigger className="h-9 max-w-xs">
                                                <SelectValue placeholder="Load saved rubric..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {savedRubricTemplates.map((t) => (
                                                    <SelectItem key={t.name} value={t.name}>
                                                        {t.name} ({t.criteria.length} criteria)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={() => { setRubricTemplateName(''); setShowSaveRubricDialog(true); }} className="h-9">
                                        <BookmarkPlus className="w-4 h-4 mr-2" style={{ color: '#6B0000' }} /> Save Current Rubric
                                    </Button>
                                    {rubricSaveSuccess && (
                                        <span className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600, backgroundColor: '#F0FDF4', color: '#2D6A2D' }}>
                                            <Check className="w-3.5 h-3.5" /> Saved!
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Weighted Rubric</label>
                                                <p style={{ fontSize: '12px', color: '#595959', marginTop: '2px' }}>Criteria weights must total 100%</p>
                                            </div>
                                            <Switch checked={isWeightedRubric} onCheckedChange={setIsWeightedRubric} />
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                        <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Grading Mode</label>
                                        <Select value={rubricType} onValueChange={(v: any) => setRubricType(v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="auto">Auto (Test-Based Only)</SelectItem>
                                                <SelectItem value="manual">Manual (Instructor Only)</SelectItem>
                                                <SelectItem value="hybrid">Hybrid (Auto + Manual)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {rubricCriteria.map((criterion, index) => (
                                        <div key={criterion.id} className="p-4 border rounded-lg" style={{ borderColor: 'var(--color-border)' }}>
                                            <div className="flex items-start gap-3">
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#F5EDED', color: '#6B0000', fontSize: '12px', fontWeight: 700 }}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <div className="md:col-span-1">
                                                            <Input value={criterion.name} onChange={e => updateRubricCriterion(criterion.id, 'name', e.target.value)} placeholder="Criterion name" className="border-[var(--color-border)]" />
                                                            <FieldError error={errors[`rubric_name_${index}`]} />
                                                        </div>
                                                        <div>
                                                            <Input type="number" value={criterion.points} onChange={e => updateRubricCriterion(criterion.id, 'points', parseInt(e.target.value) || 0)} placeholder="Points" className="border-[var(--color-border)]" />
                                                            <FieldError error={errors[`rubric_points_${index}`]} />
                                                        </div>
                                                        {isWeightedRubric && (
                                                            <div className="flex items-center gap-2">
                                                                <Input type="number" value={criterion.weight} onChange={e => updateRubricCriterion(criterion.id, 'weight', parseInt(e.target.value) || 0)} placeholder="Weight %" className="border-[var(--color-border)]" />
                                                                <span style={{ fontSize: '13px', color: '#595959' }}>%</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Input value={criterion.description} onChange={e => updateRubricCriterion(criterion.id, 'description', e.target.value)} placeholder="Description (optional)" className="border-[var(--color-border)]" />
                                                </div>
                                                {rubricCriteria.length > 1 && (
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeRubricCriterion(criterion.id)}>
                                                        <Trash2 className="w-4 h-4" style={{ color: '#B91C1C' }} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button type="button" variant="outline" onClick={addRubricCriterion} className="w-full">
                                    <Plus className="w-4 h-4 mr-2" /> Add Criterion
                                </Button>

                                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5EDED' }}>
                                    <div className="flex justify-between items-center">
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>Total Points:</span>
                                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#6B0000' }}>{getTotalPoints()}</span>
                                    </div>
                                    {isWeightedRubric && (
                                        <div className="flex justify-between items-center mt-2">
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>Total Weight:</span>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: getTotalWeight() === 100 ? '#2D6A2D' : '#B91C1C' }}>{getTotalWeight()}%</span>
                                        </div>
                                    )}
                                    <FieldError error={errors.rubricWeight} />
                                </div>
                            </div>
                        )}

                        {/* ────────────── STEP 5: SUBMISSION SETTINGS ────────────── */}
                        {currentStep === 5 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="flex items-center gap-2 mb-1" style={{ fontSize: '18px', fontWeight: 600, color: '#2D2D2D' }}>
                                        <Settings2 className="w-5 h-5" style={{ color: '#6B0000' }} /> Submission Settings
                                    </h2>
                                    <p style={{ fontSize: '13px', color: '#595959' }}>Configure how students submit their work.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                        <label className="block mb-3" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Maximum Attempts</label>
                                        <div className="flex items-center gap-4">
                                            <Input type="number" value={maxAttempts} onChange={e => setMaxAttempts(parseInt(e.target.value) || 1)} className="border-[var(--color-border)] w-24" min={1} max={100} />
                                            <span style={{ fontSize: '12px', color: '#595959' }}>attempts per student</span>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                        <label className="block mb-3" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Allowed File Types</label>
                                        <Input value={allowedFileTypes} onChange={e => setAllowedFileTypes(e.target.value)} placeholder=".py, .java, .cpp" className="border-[var(--color-border)]" />
                                        <p style={{ fontSize: '11px', color: '#8A8A8A', marginTop: '4px' }}>Comma-separated extensions</p>
                                    </div>

                                    <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                        <label className="block mb-3" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Maximum File Size</label>
                                        <div className="flex items-center gap-4">
                                            <Input type="number" value={maxFileSize} onChange={e => setMaxFileSize(parseInt(e.target.value) || 1)} className="border-[var(--color-border)] w-24" min={1} max={50} />
                                            <span style={{ fontSize: '12px', color: '#595959' }}>MB per file</span>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                        <label className="block mb-3" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Grading Strategy</label>
                                        <Select value={gradingStrategy} onValueChange={(v: any) => setGradingStrategy(v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="latest">Grade Latest Submission</SelectItem>
                                                <SelectItem value="best">Grade Best Submission</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Group Assignment Toggle */}
                                    <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: isGroupAssignment ? '#6B0000' : 'var(--color-border)', backgroundColor: isGroupAssignment ? '#F5EDED' : undefined }}>
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5" style={{ color: isGroupAssignment ? '#6B0000' : '#8A8A8A' }} />
                                            <div>
                                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Group Assignment</label>
                                                <p style={{ fontSize: '12px', color: '#595959', marginTop: '2px' }}>Students submit as a group. Grading one member gives the option to apply the same grade to all group members.</p>
                                            </div>
                                        </div>
                                        <Switch checked={isGroupAssignment} onCheckedChange={setIsGroupAssignment} />
                                    </div>

                                    {[
                                        { label: 'Allow Resubmission', desc: 'Students can submit again before the deadline', checked: allowResubmission, onChange: setAllowResubmission },
                                        { label: 'Show Submission Results to Students', desc: 'Students can see public test results after submitting', checked: showSubmissionToStudents, onChange: setShowSubmissionToStudents },
                                        { label: 'Enable Git Repository Submission', desc: 'Students can submit via linked Git repository', checked: enableGitSubmission, onChange: setEnableGitSubmission },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                            <div>
                                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>{item.label}</label>
                                                <p style={{ fontSize: '12px', color: '#595959', marginTop: '2px' }}>{item.desc}</p>
                                            </div>
                                            <Switch checked={item.checked} onCheckedChange={item.onChange} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ────────────── STEP 6: AI SETTINGS ────────────── */}
                        {currentStep === 6 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="flex items-center gap-2 mb-1" style={{ fontSize: '18px', fontWeight: 600, color: '#2D2D2D' }}>
                                        <ShieldAlert className="w-5 h-5" style={{ color: '#6B0000' }} /> AI-Assisted Detection
                                    </h2>
                                    <p style={{ fontSize: '13px', color: '#595959' }}>Configure plagiarism and AI-generated code detection.</p>
                                </div>

                                <div className="p-4 rounded-lg flex gap-3" style={{ backgroundColor: '#FFF8E1', borderLeft: '4px solid #FF9800' }}>
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#8A5700' }} />
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#8A5700' }}>CRITICAL: AI detection results are ADVISORY ONLY</p>
                                        <p style={{ fontSize: '12px', color: '#8A5700', marginTop: '4px' }}>
                                            They will never automatically deduct points or fail submissions. Instructors review flagged submissions and make final decisions.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <label style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>Plagiarism Detection</label>
                                            <p style={{ fontSize: '12px', color: '#595959', marginTop: '2px' }}>Compare submissions to detect code similarity between students.</p>
                                        </div>
                                        <Switch checked={plagiarismEnabled} onCheckedChange={setPlagiarismEnabled} />
                                    </div>
                                    {plagiarismEnabled && (
                                        <div className="mt-4 pl-4 border-l-2" style={{ borderColor: '#6B0000' }}>
                                            <div className="flex justify-between mb-2">
                                                <label style={{ fontSize: '12px', fontWeight: 500, color: '#2D2D2D' }}>Sensitivity: <strong>{getSensitivityLabel(plagiarismSensitivity)}</strong></label>
                                                <span style={{ fontSize: '12px', color: '#595959' }}>{plagiarismSensitivity}%</span>
                                            </div>
                                            <Slider value={[plagiarismSensitivity]} onValueChange={v => setPlagiarismSensitivity(v[0])} max={100} step={1} />
                                            <div className="flex justify-between mt-1">
                                                <span style={{ fontSize: '10px', color: '#8A8A8A' }}>Low (Fewer flags)</span>
                                                <span style={{ fontSize: '10px', color: '#8A8A8A' }}>High (More flags)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <label style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>AI-Generated Code Detection</label>
                                            <p style={{ fontSize: '12px', color: '#595959', marginTop: '2px' }}>Flag submissions that may contain AI-generated code (ChatGPT, Copilot, etc.).</p>
                                        </div>
                                        <Switch checked={aiCodeDetectionEnabled} onCheckedChange={setAiCodeDetectionEnabled} />
                                    </div>
                                    {aiCodeDetectionEnabled && (
                                        <div className="mt-4 pl-4 border-l-2" style={{ borderColor: '#6B0000' }}>
                                            <div className="flex justify-between mb-2">
                                                <label style={{ fontSize: '12px', fontWeight: 500, color: '#2D2D2D' }}>Sensitivity: <strong>{getSensitivityLabel(aiDetectionSensitivity)}</strong></label>
                                                <span style={{ fontSize: '12px', color: '#595959' }}>{aiDetectionSensitivity}%</span>
                                            </div>
                                            <Slider value={[aiDetectionSensitivity]} onValueChange={v => setAiDetectionSensitivity(v[0])} max={100} step={1} />
                                            <div className="flex justify-between mt-1">
                                                <span style={{ fontSize: '10px', color: '#8A8A8A' }}>Low (Fewer flags)</span>
                                                <span style={{ fontSize: '10px', color: '#8A8A8A' }}>High (More flags)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>Auto-Flag for Manual Review</label>
                                            <p style={{ fontSize: '12px', color: '#595959', marginTop: '2px' }}>Submissions with similarity above threshold are flagged for instructor review.</p>
                                        </div>
                                        <Switch checked={manualReviewThreshold} onCheckedChange={setManualReviewThreshold} />
                                    </div>
                                    {manualReviewThreshold && (
                                        <div className="mt-4">
                                            <label className="block mb-2" style={{ fontSize: '12px', fontWeight: 500, color: '#2D2D2D' }}>Flag Threshold</label>
                                            <div className="flex items-center gap-3">
                                                <Input type="number" value={flagThresholdPercent} onChange={e => setFlagThresholdPercent(parseInt(e.target.value) || 0)} className="border-[var(--color-border)] w-24" min={10} max={100} />
                                                <span style={{ fontSize: '12px', color: '#595959' }}>% similarity triggers review</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                                    <h4 className="mb-3" style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>Similarity Report Settings</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Checkbox id="show-matches" defaultChecked />
                                            <label htmlFor="show-matches" style={{ fontSize: '12px', color: '#2D2D2D' }}>Show similarity percentages and source matches</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Checkbox id="highlight-code" defaultChecked />
                                            <label htmlFor="highlight-code" style={{ fontSize: '12px', color: '#2D2D2D' }}>Highlight suspicious code sections</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Checkbox id="cross-section" />
                                            <label htmlFor="cross-section" style={{ fontSize: '12px', color: '#2D2D2D' }}>Compare across course sections</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ────────────── STEP 7: REVIEW ────────────── */}
                        {currentStep === 7 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="flex items-center gap-2 mb-1" style={{ fontSize: '18px', fontWeight: 600, color: '#2D2D2D' }}>
                                        <Eye className="w-5 h-5" style={{ color: '#6B0000' }} /> Review Assignment
                                    </h2>
                                    <p style={{ fontSize: '13px', color: '#595959' }}>Review all settings before publishing. Click any section to edit.</p>
                                </div>

                                {([
                                    {
                                        title: 'Basic Information', step: 1, icon: FileText,
                                        items: [
                                            { label: 'Name', value: assignmentName || '—' },
                                            { label: 'Language', value: language ? langLabel(language) : '—' },
                                            { label: 'Due Date', value: dueDate ? `${new Date(dueDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at ${dueTime}` : '—' },
                                            { label: 'Total Points', value: `${totalPoints}` },
                                            { label: 'Late Policy', value: latePolicyLabel(latePolicy) },
                                            { label: 'Status', value: isDraft ? 'Draft' : 'Will Publish' },
                                        ],
                                    },
                                    {
                                        title: 'Starter Code', step: 2, icon: Code,
                                        items: [
                                            { label: 'File', value: starterFileName || 'None provided' },
                                            { label: 'Code', value: starterCode ? `${starterCode.split('\n').length} lines` : 'None' },
                                        ],
                                    },
                                    {
                                        title: 'Test Cases', step: 3, icon: Zap,
                                        items: [
                                            { label: 'Public Tests', value: `${publicTests.length} test(s)` },
                                            { label: 'Private Tests', value: `${privateTests.length} test(s)` },
                                            { label: 'Total Test Points', value: `${publicTests.reduce((s, t) => s + t.points, 0) + privateTests.reduce((s, t) => s + t.points, 0)}` },
                                        ],
                                    },
                                    {
                                        title: 'Rubric', step: 4, icon: Star,
                                        items: [
                                            { label: 'Mode', value: rubricType === 'auto' ? 'Auto (Test-Based)' : rubricType === 'manual' ? 'Manual' : 'Hybrid' },
                                            { label: 'Criteria', value: `${rubricCriteria.length} criterion/criteria` },
                                            { label: 'Total Points', value: `${getTotalPoints()}` },
                                            ...(isWeightedRubric ? [{ label: 'Total Weight', value: `${getTotalWeight()}%` }] : []),
                                        ],
                                    },
                                    {
                                        title: 'Submission Settings', step: 5, icon: Settings2,
                                        items: [
                                            { label: 'Group Assignment', value: isGroupAssignment ? 'Yes' : 'No' },
                                            { label: 'Max Attempts', value: `${maxAttempts}` },
                                            { label: 'File Types', value: allowedFileTypes },
                                            { label: 'Max File Size', value: `${maxFileSize} MB` },
                                            { label: 'Grading', value: gradingStrategy === 'latest' ? 'Latest Submission' : 'Best Submission' },
                                            { label: 'Resubmission', value: allowResubmission ? 'Allowed' : 'Not Allowed' },
                                            { label: 'Git Submission', value: enableGitSubmission ? 'Enabled' : 'Disabled' },
                                        ],
                                    },
                                    {
                                        title: 'AI Detection', step: 6, icon: ShieldAlert,
                                        items: [
                                            { label: 'Plagiarism', value: plagiarismEnabled ? `Enabled (${getSensitivityLabel(plagiarismSensitivity)})` : 'Disabled' },
                                            { label: 'AI Code Detection', value: aiCodeDetectionEnabled ? `Enabled (${getSensitivityLabel(aiDetectionSensitivity)})` : 'Disabled' },
                                            { label: 'Auto-Flag', value: manualReviewThreshold ? `Above ${flagThresholdPercent}%` : 'Disabled' },
                                        ],
                                    },
                                ] as const).map(section => (
                                    <button
                                        key={section.step}
                                        onClick={() => setCurrentStep(section.step)}
                                        className="w-full text-left p-5 rounded-lg border transition-colors hover:border-[#6B0000]"
                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <section.icon className="w-4 h-4" style={{ color: '#6B0000' }} />
                                                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2D2D2D' }}>{section.title}</h3>
                                            </div>
                                            {completedSteps.has(section.step) ? (
                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ fontSize: '11px', fontWeight: 600, backgroundColor: '#F0FDF4', color: '#2D6A2D' }}>
                                                    <Check className="w-3 h-3" /> Complete
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '11px', color: '#8A8A8A' }}>Click to edit</span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                                            {section.items.map((item, i) => (
                                                <div key={i}>
                                                    <p style={{ fontSize: '11px', color: '#8A8A8A' }}>{item.label}</p>
                                                    <p style={{ fontSize: '13px', color: '#2D2D2D', fontWeight: 500 }}>{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </button>
                                ))}

                                <div className="flex gap-3 pt-4" style={{ borderTop: '2px solid var(--color-border)' }}>
                                    <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSaving} className="flex-1 h-11">
                                        <Save className="w-4 h-4 mr-2" /> Save as Draft
                                    </Button>
                                    <Button type="button" onClick={handlePublish} disabled={isSaving} className="flex-1 h-11 text-white" style={{ backgroundColor: '#6B0000' }}>
                                        <Check className="w-4 h-4 mr-2" /> Publish Assignment
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ── Navigation Buttons ── */}
                        {currentStep < 7 && (
                            <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                                <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1} className="h-10">
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                                </Button>
                                <span style={{ fontSize: '13px', color: '#8A8A8A' }}>Step {currentStep} of {STEPS.length}</span>
                                <Button type="button" onClick={nextStep} className="h-10 text-white" style={{ backgroundColor: '#6B0000' }}>
                                    Next <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Discard Changes Dialog */}
            <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
                <DialogContent className="max-w-md" style={{ boxShadow: '0 8px 24px rgba(107,0,0,.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#2D2D2D' }}>Discard Changes?</DialogTitle>
                        <DialogDescription style={{ fontSize: '14px', color: '#595959', marginTop: '8px' }}>
                            You have unsaved changes. Are you sure you want to leave? All progress will be lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowDiscardDialog(false)} className="border-[var(--color-border)]">Keep Editing</Button>
                        <Button onClick={() => router.push(`/courses/${cid}`)} className="text-white" style={{ backgroundColor: '#B91C1C' }}>
                            <X className="w-4 h-4 mr-2" /> Discard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Save Rubric Template Dialog */}
            <Dialog open={showSaveRubricDialog} onOpenChange={setShowSaveRubricDialog}>
                <DialogContent className="max-w-md" style={{ boxShadow: '0 8px 24px rgba(107,0,0,.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#2D2D2D' }}>Save Rubric Template</DialogTitle>
                        <DialogDescription style={{ fontSize: '14px', color: '#595959', marginTop: '8px' }}>
                            Save the current rubric configuration as a reusable template for future assignments.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 space-y-4">
                        <div>
                            <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D' }}>Template Name</label>
                            <Input value={rubricTemplateName} onChange={e => setRubricTemplateName(e.target.value)} placeholder="e.g., Standard Coding Rubric" className="border-[var(--color-border)]" maxLength={60} />
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F5EDED' }}>
                            <p style={{ fontSize: '12px', color: '#595959', marginBottom: '8px' }}>This template will include:</p>
                            <ul className="space-y-1">
                                <li className="flex items-center gap-2" style={{ fontSize: '12px', color: '#2D2D2D' }}>
                                    <Check className="w-3.5 h-3.5" style={{ color: '#2D6A2D' }} /> {rubricCriteria.length} rubric criteria
                                </li>
                                <li className="flex items-center gap-2" style={{ fontSize: '12px', color: '#2D2D2D' }}>
                                    <Check className="w-3.5 h-3.5" style={{ color: '#2D6A2D' }} /> Grading mode: {rubricType === 'auto' ? 'Auto' : rubricType === 'manual' ? 'Manual' : 'Hybrid'}
                                </li>
                                <li className="flex items-center gap-2" style={{ fontSize: '12px', color: '#2D2D2D' }}>
                                    <Check className="w-3.5 h-3.5" style={{ color: '#2D6A2D' }} /> {isWeightedRubric ? 'Weighted' : 'Unweighted'} rubric
                                </li>
                                <li className="flex items-center gap-2" style={{ fontSize: '12px', color: '#2D2D2D' }}>
                                    <Check className="w-3.5 h-3.5" style={{ color: '#2D6A2D' }} /> Total: {getTotalPoints()} points
                                </li>
                            </ul>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowSaveRubricDialog(false)} className="border-[var(--color-border)]">Cancel</Button>
                        <Button onClick={handleSaveRubricTemplate} disabled={!rubricTemplateName.trim()} className="text-white" style={{ backgroundColor: '#6B0000' }}>
                            <BookmarkPlus className="w-4 h-4 mr-2" /> Save Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Publish Confirmation Dialog */}
            <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <DialogContent className="max-w-md" style={{ boxShadow: '0 8px 24px rgba(107,0,0,.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#2D2D2D' }}>Publish Assignment?</DialogTitle>
                        <DialogDescription style={{ fontSize: '14px', color: '#595959', marginTop: '8px' }}>
                            <strong style={{ color: '#2D2D2D' }}>{assignmentName}</strong> will be visible to all students immediately. They can begin submitting right away.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 p-4 rounded-lg" style={{ backgroundColor: '#F5EDED' }}>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p style={{ fontSize: '11px', color: '#8A8A8A' }}>Language</p>
                                <p style={{ fontSize: '13px', fontWeight: 500, color: '#2D2D2D' }}>{language ? langLabel(language) : '—'}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '11px', color: '#8A8A8A' }}>Due Date</p>
                                <p style={{ fontSize: '13px', fontWeight: 500, color: '#2D2D2D' }}>{dueDate ? new Date(dueDate + 'T00:00:00').toLocaleDateString() : '—'}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '11px', color: '#8A8A8A' }}>Points</p>
                                <p style={{ fontSize: '13px', fontWeight: 500, color: '#2D2D2D' }}>{totalPoints}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '11px', color: '#8A8A8A' }}>Test Cases</p>
                                <p style={{ fontSize: '13px', fontWeight: 500, color: '#2D2D2D' }}>{publicTests.length + privateTests.length}</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowPublishDialog(false)} className="border-[var(--color-border)]">Cancel</Button>
                        <Button onClick={confirmPublish} className="text-white" style={{ backgroundColor: '#6B0000' }}>
                            <Check className="w-4 h-4 mr-2" /> Publish Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}
