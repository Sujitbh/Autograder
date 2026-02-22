'use client';

/* ═══════════════════════════════════════════════════════════════════
   CreateAssignmentForm — Multi-step wizard (9 steps)
   Features:
   - Rubric templates (save / load / preloaded)
   - PDF rubric upload & parsing
   - AI & Plagiarism detection settings
   - Submission settings
   - Full review page with edit navigation
   - Persists to localStorage on save/publish
   ═══════════════════════════════════════════════════════════════════ */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    ChevronLeft,
    ChevronRight,
    Save,
    Send,
    Plus,
    Trash2,
    GripVertical,
    Check,
    Code2,
    FileText,
    TestTube,
    Lock,
    ClipboardList,
    Eye,
    Settings2,
    ShieldAlert,
    BookmarkPlus,
    FolderOpen,
    AlertCircle,
    FileUp,
    Loader2,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { COURSE_STUDENT_COUNTS } from '@/utils/studentData';

// ── Rubric Template types ───────────────────────────────────────────

interface RubricTemplate {
    id: string;
    name: string;
    isBuiltIn: boolean;
    criteria: Array<{
        name: string;
        description: string;
        maxPoints: number;
        gradingMethod: 'auto' | 'manual' | 'hybrid';
    }>;
}

const BUILTIN_RUBRIC_TEMPLATES: RubricTemplate[] = [
    {
        id: 'tpl-standard',
        name: 'Standard Coding Assignment',
        isBuiltIn: true,
        criteria: [
            { name: 'Code Correctness', description: 'Produces correct output for all test cases', maxPoints: 50, gradingMethod: 'auto' },
            { name: 'Code Style', description: 'Follows language style guidelines (PEP8, etc.)', maxPoints: 20, gradingMethod: 'manual' },
            { name: 'Documentation', description: 'Includes comments, docstrings, and file header', maxPoints: 30, gradingMethod: 'manual' },
        ],
    },
    {
        id: 'tpl-algorithm',
        name: 'Algorithm Analysis',
        isBuiltIn: true,
        criteria: [
            { name: 'Correctness', description: 'Algorithm produces expected output', maxPoints: 40, gradingMethod: 'auto' },
            { name: 'Time Complexity', description: 'Meets expected time complexity', maxPoints: 25, gradingMethod: 'hybrid' },
            { name: 'Space Complexity', description: 'Meets expected space complexity', maxPoints: 15, gradingMethod: 'hybrid' },
            { name: 'Code Quality', description: 'Clean, readable, well-structured code', maxPoints: 20, gradingMethod: 'manual' },
        ],
    },
    {
        id: 'tpl-project',
        name: 'Project-Based',
        isBuiltIn: true,
        criteria: [
            { name: 'Functionality', description: 'All required features work correctly', maxPoints: 40, gradingMethod: 'hybrid' },
            { name: 'Code Architecture', description: 'Proper use of classes, modules, and design patterns', maxPoints: 20, gradingMethod: 'manual' },
            { name: 'Testing', description: 'Includes unit tests with good coverage', maxPoints: 15, gradingMethod: 'auto' },
            { name: 'Documentation', description: 'README, docstrings, and inline comments', maxPoints: 15, gradingMethod: 'manual' },
            { name: 'UI/UX', description: 'Clean interface and user experience (if applicable)', maxPoints: 10, gradingMethod: 'manual' },
        ],
    },
];

function loadSavedRubricTemplates(): RubricTemplate[] {
    try {
        const stored = localStorage.getItem('autograde_rubric_templates');
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [];
}

function saveSavedRubricTemplates(templates: RubricTemplate[]) {
    localStorage.setItem('autograde_rubric_templates', JSON.stringify(templates));
}

// ── Zod schema ──────────────────────────────────────────────────────

const testCaseSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    input: z.string(),
    expectedOutput: z.string().min(1, 'Expected output is required'),
    points: z.number().min(0),
});

const rubricSchema = z.object({
    name: z.string().min(1, 'Criterion name is required'),
    description: z.string(),
    maxPoints: z.number().min(1, 'Must be at least 1 point'),
    gradingMethod: z.enum(['auto', 'manual', 'hybrid']),
});

const formSchema = z.object({
    // Basic Info
    name: z.string().min(1, 'Assignment name is required'),
    shortName: z.string().min(1, 'Short name is required').max(10),
    language: z.enum(['python', 'java']),
    category: z.enum(['Homework', 'Quiz', 'Exam', 'Lab', 'Project']),
    dueDate: z.string().min(1, 'Due date is required'),
    maxPoints: z.number().min(1, 'Must be at least 1 point'),
    isGroup: z.boolean(),
    allowLateSubmissions: z.boolean(),
    latePenaltyType: z.enum(['percentage', 'fixed']).optional(),
    latePenaltyAmount: z.number().min(0).optional(),
    description: z.string(),
    starterCode: z.string(),
    // Tests & Rubric
    publicTests: z.array(testCaseSchema),
    privateTests: z.array(testCaseSchema),
    rubric: z.array(rubricSchema),
    // Submission Settings
    maxAttempts: z.number().min(1).max(100),
    allowedFileTypes: z.string(),
    maxFileSizeMB: z.number().min(1).max(50),
    gradingStrategy: z.enum(['latest', 'best']),
    allowResubmission: z.boolean(),
    showResultsToStudents: z.boolean(),
    enableGitSubmission: z.boolean(),
    // AI & Plagiarism
    plagiarismEnabled: z.boolean(),
    plagiarismSensitivity: z.number().min(0).max(100),
    aiDetectionEnabled: z.boolean(),
    aiDetectionSensitivity: z.number().min(0).max(100),
    autoFlagEnabled: z.boolean(),
    autoFlagThreshold: z.number().min(10).max(100),
    crossSectionComparison: z.boolean(),
});

export type AssignmentFormData = z.infer<typeof formSchema>;

// ── Step definitions ────────────────────────────────────────────────

const STEPS = [
    { label: 'Basic Info', icon: FileText },
    { label: 'Description', icon: FileText },
    { label: 'Starter Code', icon: Code2 },
    { label: 'Public Tests', icon: TestTube },
    { label: 'Private Tests', icon: Lock },
    { label: 'Rubric', icon: ClipboardList },
    { label: 'Submission', icon: Settings2 },
    { label: 'AI Detection', icon: ShieldAlert },
    { label: 'Review', icon: Eye },
] as const;

// ── Props ───────────────────────────────────────────────────────────

interface CreateAssignmentFormProps {
    courseId: string;
    onSaveDraft: (data: AssignmentFormData) => void;
    onPublish: (data: AssignmentFormData) => void;
    onCancel: () => void;
    initialData?: Partial<AssignmentFormData>;
}

// ── Helper ──────────────────────────────────────────────────────────

function getSensitivityLabel(v: number) {
    if (v < 33) return 'Low';
    if (v < 67) return 'Medium';
    return 'High';
}

// ── Component ───────────────────────────────────────────────────────

export function CreateAssignmentForm({
    courseId,
    onSaveDraft,
    onPublish,
    onCancel,
    initialData,
}: CreateAssignmentFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showSaveRubricDialog, setShowSaveRubricDialog] = useState(false);
    const [rubricTemplateName, setRubricTemplateName] = useState('');
    const [rubricSaveSuccess, setRubricSaveSuccess] = useState(false);
    const [savedTemplates, setSavedTemplates] = useState<RubricTemplate[]>([]);
    const [showPublishDialog, setShowPublishDialog] = useState(false);

    // Load saved rubric templates on mount
    useEffect(() => {
        setSavedTemplates(loadSavedRubricTemplates());
    }, []);

    const allTemplates = useMemo(
        () => [...BUILTIN_RUBRIC_TEMPLATES, ...savedTemplates],
        [savedTemplates]
    );

    const defaultValues: AssignmentFormData = useMemo(
        () => ({
            name: '',
            shortName: '',
            language: 'python' as const,
            category: 'Homework' as const,
            dueDate: '',
            maxPoints: 100,
            isGroup: false,
            allowLateSubmissions: false,
            latePenaltyType: 'percentage' as const,
            latePenaltyAmount: 10,
            description: '',
            starterCode: '',
            publicTests: [],
            privateTests: [],
            rubric: [],
            // Submission settings
            maxAttempts: 5,
            allowedFileTypes: '.py',
            maxFileSizeMB: 5,
            gradingStrategy: 'latest' as const,
            allowResubmission: true,
            showResultsToStudents: true,
            enableGitSubmission: false,
            // AI / Plagiarism
            plagiarismEnabled: true,
            plagiarismSensitivity: 50,
            aiDetectionEnabled: true,
            aiDetectionSensitivity: 50,
            autoFlagEnabled: true,
            autoFlagThreshold: 70,
            crossSectionComparison: false,
            ...initialData,
        }),
        [initialData]
    );

    const {
        register,
        control,
        handleSubmit,
        watch,
        trigger,
        getValues,
        formState: { errors, isDirty },
    } = useForm<AssignmentFormData>({
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: 'onChange',
    });

    const {
        fields: publicTestFields,
        append: appendPublicTest,
        remove: removePublicTest,
    } = useFieldArray({ control, name: 'publicTests' });

    const {
        fields: privateTestFields,
        append: appendPrivateTest,
        remove: removePrivateTest,
    } = useFieldArray({ control, name: 'privateTests' });

    const {
        fields: rubricFields,
        append: appendRubric,
        remove: removeRubric,
        replace: replaceRubric,
    } = useFieldArray({ control, name: 'rubric' });

    const watchAllowLate = watch('allowLateSubmissions');
    const watchPlagiarism = watch('plagiarismEnabled');
    const watchAiDetection = watch('aiDetectionEnabled');
    const watchAutoFlag = watch('autoFlagEnabled');
    const watchLanguage = watch('language');

    // ── Auto-save to localStorage every 30 seconds ────────────────

    useEffect(() => {
        const key = `autograde_assignment_draft_${courseId}`;
        const interval = setInterval(() => {
            if (isDirty) {
                localStorage.setItem(key, JSON.stringify(getValues()));
            }
        }, 30_000);
        return () => clearInterval(interval);
    }, [courseId, getValues, isDirty]);

    // ── Warn on unsaved changes ───────────────────────────────────

    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [isDirty]);

    // ── Step validation map ───────────────────────────────────────

    const stepFields: (keyof AssignmentFormData)[][] = [
        ['name', 'shortName', 'language', 'category', 'dueDate', 'maxPoints'],
        ['description'],
        ['starterCode'],
        ['publicTests'],
        ['privateTests'],
        ['rubric'],
        ['maxAttempts', 'allowedFileTypes', 'maxFileSizeMB', 'gradingStrategy'],
        ['plagiarismSensitivity', 'aiDetectionSensitivity'],
        [], // review step — no fields
    ];

    const handleNext = useCallback(async () => {
        const fields = stepFields[currentStep];
        const valid = fields.length === 0 || (await trigger(fields));
        if (valid && currentStep < STEPS.length - 1) {
            setCurrentStep((s) => s + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep, trigger]);

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep((s) => s - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ── Rubric template functions ─────────────────────────────────

    const handleLoadTemplate = (templateId: string) => {
        const template = allTemplates.find((t) => t.id === templateId);
        if (template) {
            replaceRubric(template.criteria);
        }
    };

    const handleSaveRubricTemplate = () => {
        if (!rubricTemplateName.trim()) return;
        const currentRubric = getValues('rubric');
        if (currentRubric.length === 0) return;

        const newTemplate: RubricTemplate = {
            id: `tpl-user-${Date.now()}`,
            name: rubricTemplateName.trim(),
            isBuiltIn: false,
            criteria: currentRubric.map((c) => ({ ...c })),
        };
        const updated = [...savedTemplates, newTemplate];
        setSavedTemplates(updated);
        saveSavedRubricTemplates(updated);
        setRubricTemplateName('');
        setShowSaveRubricDialog(false);
        setRubricSaveSuccess(true);
        setTimeout(() => setRubricSaveSuccess(false), 3000);
    };

    const handleDeleteTemplate = (templateId: string) => {
        const updated = savedTemplates.filter((t) => t.id !== templateId);
        setSavedTemplates(updated);
        saveSavedRubricTemplates(updated);
    };

    // ── PDF rubric upload & parse ─────────────────────────────────

    const pdfInputRef = useRef<HTMLInputElement>(null);
    const [pdfParsing, setPdfParsing] = useState(false);
    const [pdfError, setPdfError] = useState<string | null>(null);

    const handlePdfRubricUpload = async (file: File) => {
        setPdfParsing(true);
        setPdfError(null);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const strings = content.items
                    .filter((item) => 'str' in item && typeof (item as Record<string, unknown>).str === 'string')
                    .map((item) => (item as { str: string }).str);
                fullText += strings.join(' ') + '\n';
            }

            const maxPts = getValues('maxPoints');
            const criteria = parseRubricText(fullText, maxPts);

            if (criteria.length === 0) {
                setPdfError('Could not detect rubric criteria in this PDF. Make sure it contains criterion names with point values (e.g. "Correctness – 40 pts").');
            } else {
                replaceRubric(criteria);
            }
        } catch (err) {
            console.error('PDF parse error', err);
            setPdfError('Failed to read PDF. Please ensure it is a valid, non-encrypted PDF file.');
        } finally {
            setPdfParsing(false);
            if (pdfInputRef.current) pdfInputRef.current.value = '';
        }
    };

    /**
     * Heuristic parser: extracts rubric criteria from raw PDF text.
     * Handles common formats:
     *  - "Criterion Name ... 40 pts"  or  "Criterion Name (40 points)"
     *  - "Criterion Name – 40"  or  "Criterion Name: 40"
     *  - Bullet / numbered lists with point values
     *  - Table-style: columns of Name | Description | Points
     */
    function parseRubricText(
        text: string,
        totalMaxPoints: number,
    ): Array<{ name: string; description: string; maxPoints: number; gradingMethod: 'auto' | 'manual' | 'hybrid' }> {
        const results: Array<{ name: string; description: string; maxPoints: number; gradingMethod: 'auto' | 'manual' | 'hybrid' }> = [];
        const seen = new Set<string>();

        // Pattern 1: "Name ... <number> pt(s)/point(s)/%"
        // Pattern 2: "Name (number pts)"
        // Pattern 3: "Name – number" or "Name: number"
        const patterns = [
            /^[\s•\-\d.]*(.+?)\s*[–—:\-]+\s*(\d+)\s*(?:pts?|points?|marks?|%)?\s*$/gim,
            /^[\s•\-\d.]*(.+?)\s*\((\d+)\s*(?:pts?|points?|marks?|%)?\)\s*$/gim,
            /^[\s•\-\d.]*(.+?)\s+(\d+)\s*(?:pts?|points?|marks?)\s*$/gim,
        ];

        for (const pattern of patterns) {
            let match: RegExpExecArray | null;
            while ((match = pattern.exec(text)) !== null) {
                const rawName = match[1].trim().replace(/[\s]+/g, ' ');
                const pts = parseInt(match[2], 10);
                // Skip junk lines
                if (!rawName || rawName.length < 2 || rawName.length > 120 || pts <= 0 || pts > 1000) continue;
                // Skip duplicates (case-insensitive)
                const key = rawName.toLowerCase();
                if (seen.has(key)) continue;
                seen.add(key);

                results.push({
                    name: rawName,
                    description: '',
                    maxPoints: pts,
                    gradingMethod: 'manual',
                });
            }
        }

        // If nothing matched with specific patterns, try line-by-line for "Category  Number" pairs
        if (results.length === 0) {
            const lines = text.split(/\n/);
            for (const line of lines) {
                const m = line.match(/^[\s•\-\d.)]*([A-Z][A-Za-z &/,]+?)\s+(\d{1,3})\s*$/);
                if (m) {
                    const rawName = m[1].trim();
                    const pts = parseInt(m[2], 10);
                    if (rawName.length >= 3 && pts > 0 && pts <= 500) {
                        const key = rawName.toLowerCase();
                        if (!seen.has(key)) {
                            seen.add(key);
                            results.push({ name: rawName, description: '', maxPoints: pts, gradingMethod: 'manual' });
                        }
                    }
                }
            }
        }

        // If we found criteria but their total doesn't match maxPoints, scale them
        if (results.length > 0) {
            const parsedTotal = results.reduce((s, c) => s + c.maxPoints, 0);
            if (parsedTotal !== totalMaxPoints && parsedTotal > 0) {
                const scale = totalMaxPoints / parsedTotal;
                let running = 0;
                for (let i = 0; i < results.length; i++) {
                    if (i < results.length - 1) {
                        results[i].maxPoints = Math.round(results[i].maxPoints * scale);
                        running += results[i].maxPoints;
                    } else {
                        // last criterion gets the remainder to ensure exact total
                        results[i].maxPoints = totalMaxPoints - running;
                    }
                }
            }
        }

        return results;
    }

    // ── Render helpers ────────────────────────────────────────────

    function renderStepIndicator() {
        return (
            <nav className="mb-8 overflow-x-auto" aria-label="Form steps">
                <ol className="flex items-center gap-1 min-w-max">
                    {STEPS.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isActive = idx === currentStep;
                        const isCompleted = idx < currentStep;
                        return (
                            <li key={idx} className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => idx <= currentStep && setCurrentStep(idx)}
                                    disabled={idx > currentStep}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${isActive
                                            ? 'border-[#6B0000] bg-[#6B0000] text-white'
                                            : isCompleted
                                                ? 'border-green-500 bg-green-50 text-green-600 cursor-pointer'
                                                : 'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800'
                                        }`}
                                    aria-label={`Step ${idx + 1}: ${step.label}`}
                                    aria-current={isActive ? 'step' : undefined}
                                >
                                    {isCompleted ? (
                                        <Check className="h-3.5 w-3.5" />
                                    ) : (
                                        <StepIcon className="h-3.5 w-3.5" />
                                    )}
                                </button>
                                <span
                                    className={`hidden text-xs font-medium xl:inline ${isActive ? 'text-[#6B0000]' : isCompleted ? 'text-green-600' : 'text-gray-400'
                                        }`}
                                >
                                    {step.label}
                                </span>
                                {idx < STEPS.length - 1 && (
                                    <div
                                        className={`h-px w-4 xl:w-6 ${isCompleted ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'
                                            }`}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        );
    }

    // ── Step 0: Basic Info ────────────────────────────────────────

    function renderBasicInfo() {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <FileText className="h-5 w-5 text-[#6B0000]" /> Basic Information
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Configure the assignment&apos;s core details.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <Label htmlFor="name">Assignment Name *</Label>
                        <Input id="name" {...register('name')} placeholder="e.g. Homework 3 — Binary Trees" />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="shortName">Short Name *</Label>
                        <Input id="shortName" {...register('shortName')} placeholder="HW3" maxLength={10} />
                        {errors.shortName && <p className="mt-1 text-xs text-red-600">{errors.shortName.message}</p>}
                    </div>

                    <div>
                        <Label>Language *</Label>
                        <Controller
                            control={control}
                            name="language"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="python">Python 3.10</SelectItem>
                                        <SelectItem value="java">Java 17</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div>
                        <Label>Category *</Label>
                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {['Homework', 'Quiz', 'Exam', 'Lab', 'Project'].map((c) => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div>
                        <Label htmlFor="dueDate">Due Date *</Label>
                        <Input id="dueDate" type="datetime-local" {...register('dueDate')} />
                        {errors.dueDate && <p className="mt-1 text-xs text-red-600">{errors.dueDate.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="maxPoints">Max Points *</Label>
                        <Input id="maxPoints" type="number" {...register('maxPoints', { valueAsNumber: true })} />
                        {errors.maxPoints && <p className="mt-1 text-xs text-red-600">{errors.maxPoints.message}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                        <Controller
                            control={control}
                            name="isGroup"
                            render={({ field }) => (
                                <Checkbox
                                    id="isGroup"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Label htmlFor="isGroup" className="mb-0 cursor-pointer">
                            <span className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-gray-400" /> Group Assignment
                            </span>
                        </Label>
                    </div>

                    <div className="flex items-center gap-3">
                        <Controller
                            control={control}
                            name="allowLateSubmissions"
                            render={({ field }) => (
                                <Checkbox
                                    id="allowLate"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Label htmlFor="allowLate" className="mb-0 cursor-pointer">Allow Late Submissions</Label>
                    </div>

                    {watchAllowLate && (
                        <div className="md:col-span-2 grid gap-4 md:grid-cols-2 rounded-lg border p-4 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                            <div>
                                <Label>Penalty Type</Label>
                                <Controller
                                    control={control}
                                    name="latePenaltyType"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage per day</SelectItem>
                                                <SelectItem value="fixed">Fixed points per day</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div>
                                <Label htmlFor="latePenaltyAmount">Penalty Amount</Label>
                                <Input
                                    id="latePenaltyAmount"
                                    type="number"
                                    {...register('latePenaltyAmount', { valueAsNumber: true })}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── Step 1: Description ───────────────────────────────────────

    function renderDescription() {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <FileText className="h-5 w-5 text-[#6B0000]" /> Assignment Description
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Provide detailed instructions and requirements.</p>
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        {...register('description')}
                        rows={14}
                        placeholder="Provide detailed assignment instructions, requirements, and examples..."
                        className="font-mono text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-400">Supports Markdown formatting.</p>
                </div>
            </div>
        );
    }

    // ── Step 2: Starter Code ──────────────────────────────────────

    function renderStarterCode() {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <Code2 className="h-5 w-5 text-[#6B0000]" /> Starter Code
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Optional template code that students will start with.</p>
                </div>
                <div>
                    <Label htmlFor="starterCode">Code Template</Label>
                    <div className="rounded-lg overflow-hidden border dark:border-gray-700">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1E1E2E] border-b border-gray-700">
                            <span className="text-xs text-gray-400">
                                {watchLanguage === 'python' ? 'main.py' : 'Main.java'}
                            </span>
                        </div>
                        <Textarea
                            id="starterCode"
                            {...register('starterCode')}
                            rows={16}
                            placeholder={watchLanguage === 'python'
                                ? '# Write your starter code here...\n\ndef solution():\n    pass'
                                : '// Write your starter code here...\n\npublic class Main {\n    public static void main(String[] args) {\n    }\n}'}
                            className="font-mono text-sm border-0 rounded-none focus-visible:ring-0"
                            style={{ backgroundColor: '#1E1E2E', color: '#E0E0E0' }}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                        Students will see this code pre-filled when they start the assignment.
                    </p>
                </div>
            </div>
        );
    }

    // ── Step 3 & 4: Test Cases (shared renderer) ──────────────────

    function renderTestCases(
        fields: Array<Record<string, unknown> & { id: string }>,
        append: (value: { name: string; input: string; expectedOutput: string; points: number }) => void,
        remove: (index: number) => void,
        prefix: 'publicTests' | 'privateTests',
        isPrivate: boolean
    ) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {isPrivate ? <Lock className="h-5 w-5 text-[#6B0000]" /> : <TestTube className="h-5 w-5 text-[#6B0000]" />}
                            {isPrivate ? 'Private' : 'Public'} Test Cases
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            {isPrivate
                                ? 'Hidden from students — used for final grading.'
                                : 'Visible to students — they can run these before submitting.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                            backgroundColor: isPrivate ? '#FFF8E1' : '#EFF6FF',
                            color: isPrivate ? '#8A5700' : '#1976D2',
                        }}>
                            {fields.length} test{fields.length !== 1 ? 's' : ''}
                        </span>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                append({ name: `Test ${fields.length + 1}`, input: '', expectedOutput: '', points: 10 })
                            }
                        >
                            <Plus className="mr-1 h-3.5 w-3.5" /> Add Test
                        </Button>
                    </div>
                </div>

                {fields.length === 0 && (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-400">
                        No test cases yet. Click &quot;Add Test&quot; to get started.
                    </div>
                )}

                {fields.map((field, idx) => (
                    <div
                        key={field.id}
                        className="relative rounded-lg border bg-white p-4 dark:bg-gray-900 dark:border-gray-700"
                        style={{ backgroundColor: isPrivate ? '#FFFDF5' : undefined }}
                    >
                        <div className="absolute right-2 top-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-red-500"
                                onClick={() => remove(idx)}
                                aria-label={`Remove test case ${idx + 1}`}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="md:col-span-2 flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-gray-300" />
                                <span className="text-xs font-semibold text-gray-500">
                                    {isPrivate ? 'Private' : 'Public'} Test {idx + 1}
                                </span>
                                <Input
                                    {...register(`${prefix}.${idx}.name`)}
                                    placeholder="Test name"
                                    className="max-w-xs text-sm"
                                />
                                <Input
                                    type="number"
                                    {...register(`${prefix}.${idx}.points`, { valueAsNumber: true })}
                                    className="w-20 text-sm"
                                    placeholder="pts"
                                />
                            </div>
                            <div>
                                <Label className="text-xs">Input (stdin)</Label>
                                <Textarea
                                    {...register(`${prefix}.${idx}.input`)}
                                    rows={3}
                                    className="font-mono text-xs"
                                    placeholder="Input data..."
                                />
                            </div>
                            <div>
                                <Label className="text-xs">Expected Output</Label>
                                <Textarea
                                    {...register(`${prefix}.${idx}.expectedOutput`)}
                                    rows={3}
                                    className="font-mono text-xs"
                                    placeholder="Expected output..."
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {fields.length > 0 && (
                    <div className="rounded-lg p-3 text-center text-sm" style={{ backgroundColor: '#F5EDED' }}>
                        <span className="text-gray-600">Total test points: </span>
                        <span className="font-bold text-[#6B0000]">
                            {fields.reduce((sum, _, idx) => {
                                const val = getValues(`${prefix}.${idx}.points`);
                                return sum + (typeof val === 'number' ? val : 0);
                            }, 0)}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    // ── Step 5: Rubric ────────────────────────────────────────────

    function renderRubric() {
        const rubricValues = getValues('rubric');
        const totalRubricPoints = rubricValues.reduce((s, c) => s + (c.maxPoints || 0), 0);

        return (
            <div className="space-y-5">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <ClipboardList className="h-5 w-5 text-[#C9A84C]" /> Rubric Design
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Configure grading criteria and point allocation.</p>
                </div>

                {/* Template controls */}
                <div className="flex flex-wrap items-center gap-2 rounded-lg border p-4 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FolderOpen className="h-4 w-4 flex-shrink-0 text-[#6B0000]" />
                        <Select onValueChange={handleLoadTemplate}>
                            <SelectTrigger className="h-9 max-w-xs">
                                <SelectValue placeholder="Load saved rubric..." />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-400">Built-in Templates</div>
                                {BUILTIN_RUBRIC_TEMPLATES.map((t) => (
                                    <SelectItem key={t.id} value={t.id}>
                                        {t.name} ({t.criteria.length} criteria)
                                    </SelectItem>
                                ))}
                                {savedTemplates.length > 0 && (
                                    <>
                                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 border-t mt-1 pt-1">Your Templates</div>
                                        {savedTemplates.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.name} ({t.criteria.length} criteria)
                                            </SelectItem>
                                        ))}
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Hidden file input for PDF upload */}
                        <input
                            ref={pdfInputRef}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePdfRubricUpload(file);
                            }}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => pdfInputRef.current?.click()}
                            className="h-9"
                            disabled={pdfParsing}
                        >
                            {pdfParsing ? (
                                <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Parsing…</>
                            ) : (
                                <><FileUp className="h-4 w-4 mr-1.5 text-[#6B0000]" /> Upload Rubric PDF</>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => { setRubricTemplateName(''); setShowSaveRubricDialog(true); }}
                            className="h-9"
                            disabled={rubricFields.length === 0}
                        >
                            <BookmarkPlus className="h-4 w-4 mr-1.5 text-[#6B0000]" /> Save Rubric
                        </Button>
                        {rubricSaveSuccess && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                                <Check className="h-3.5 w-3.5" /> Saved!
                            </span>
                        )}
                    </div>
                </div>

                {/* PDF parse error banner */}
                {pdfError && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                            <p className="font-medium">PDF Parsing Issue</p>
                            <p className="text-xs mt-0.5">{pdfError}</p>
                        </div>
                        <button type="button" className="ml-auto text-red-400 hover:text-red-600" onClick={() => setPdfError(null)} aria-label="Dismiss">✕</button>
                    </div>
                )}

                {/* Saved templates management */}
                {savedTemplates.length > 0 && (
                    <div className="rounded-lg border p-3 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 mb-2">Your Saved Templates:</p>
                        <div className="flex flex-wrap gap-2">
                            {savedTemplates.map((t) => (
                                <div key={t.id} className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs bg-white dark:bg-gray-900 dark:border-gray-700">
                                    <button
                                        type="button"
                                        className="font-medium text-[#6B0000] hover:underline"
                                        onClick={() => handleLoadTemplate(t.id)}
                                    >
                                        {t.name}
                                    </button>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={() => handleDeleteTemplate(t.id)}
                                        aria-label={`Delete template ${t.name}`}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add criterion button */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{rubricFields.length} criteria defined</span>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            appendRubric({
                                name: '',
                                description: '',
                                maxPoints: 10,
                                gradingMethod: 'manual',
                            })
                        }
                    >
                        <Plus className="mr-1 h-3.5 w-3.5" /> Add Criterion
                    </Button>
                </div>

                {rubricFields.length === 0 && (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-400">
                        No rubric criteria yet. Use a template, upload a PDF, or add criteria manually.
                    </div>
                )}

                {rubricFields.map((field, idx) => (
                    <div
                        key={field.id}
                        className="relative rounded-lg border bg-white p-4 dark:bg-gray-900 dark:border-gray-700"
                    >
                        <div className="absolute right-2 top-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-red-500"
                                onClick={() => removeRubric(idx)}
                                aria-label={`Remove criterion ${idx + 1}`}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <Label className="text-xs">Criterion Name *</Label>
                                <Input
                                    {...register(`rubric.${idx}.name`)}
                                    placeholder="e.g. Code Correctness"
                                />
                                {errors.rubric?.[idx]?.name && (
                                    <p className="mt-1 text-xs text-red-600">{errors.rubric[idx]?.name?.message}</p>
                                )}
                            </div>
                            <div>
                                <Label className="text-xs">Max Points *</Label>
                                <Input
                                    type="number"
                                    {...register(`rubric.${idx}.maxPoints`, { valueAsNumber: true })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label className="text-xs">Description</Label>
                                <Textarea
                                    {...register(`rubric.${idx}.description`)}
                                    rows={2}
                                    placeholder="What this criterion evaluates..."
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <Label className="text-xs">Grading Method</Label>
                                <Controller
                                    control={control}
                                    name={`rubric.${idx}.gradingMethod`}
                                    render={({ field: f }) => (
                                        <Select value={f.value} onValueChange={f.onChange}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="auto">Auto (Test-Based)</SelectItem>
                                                <SelectItem value="manual">Manual</SelectItem>
                                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Total points summary */}
                {rubricFields.length > 0 && (
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#F5EDED' }}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-700">Total Rubric Points:</span>
                            <span className="text-xl font-bold text-[#6B0000]">{totalRubricPoints}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Step 6: Submission Settings ───────────────────────────────

    function renderSubmissionSettings() {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <Settings2 className="h-5 w-5 text-[#6B0000]" /> Submission Settings
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Configure how students submit their work.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-5 rounded-lg border dark:border-gray-700">
                        <Label>Maximum Attempts</Label>
                        <div className="flex items-center gap-3 mt-2">
                            <Input
                                type="number"
                                {...register('maxAttempts', { valueAsNumber: true })}
                                className="w-24"
                                min={1}
                                max={100}
                            />
                            <span className="text-xs text-gray-500">attempts per student</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-lg border dark:border-gray-700">
                        <Label>Allowed File Types</Label>
                        <Input
                            {...register('allowedFileTypes')}
                            placeholder=".py, .java"
                            className="mt-2"
                        />
                        <p className="text-xs text-gray-400 mt-1">Comma-separated extensions</p>
                    </div>

                    <div className="p-5 rounded-lg border dark:border-gray-700">
                        <Label>Maximum File Size</Label>
                        <div className="flex items-center gap-3 mt-2">
                            <Input
                                type="number"
                                {...register('maxFileSizeMB', { valueAsNumber: true })}
                                className="w-24"
                                min={1}
                                max={50}
                            />
                            <span className="text-xs text-gray-500">MB per file</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-lg border dark:border-gray-700">
                        <Label>Grading Strategy</Label>
                        <Controller
                            control={control}
                            name="gradingStrategy"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">Grade Latest Submission</SelectItem>
                                        <SelectItem value="best">Grade Best Submission</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <ToggleSettingRow
                        label="Allow Resubmission"
                        description="Students can submit again before the deadline"
                        fieldName="allowResubmission"
                        control={control}
                    />
                    <ToggleSettingRow
                        label="Show Results to Students"
                        description="Students can see public test results after submitting"
                        fieldName="showResultsToStudents"
                        control={control}
                    />
                    <ToggleSettingRow
                        label="Enable Git Repository Submission"
                        description="Students can submit via linked Git repository"
                        fieldName="enableGitSubmission"
                        control={control}
                    />
                </div>
            </div>
        );
    }

    // ── Step 7: AI & Plagiarism Detection ─────────────────────────

    function renderAiDetection() {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <ShieldAlert className="h-5 w-5 text-[#6B0000]" /> AI-Assisted Detection
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Configure plagiarism and AI-generated code detection.</p>
                </div>

                {/* Warning banner */}
                <div className="rounded-lg p-4 flex gap-3" style={{ backgroundColor: '#FFF8E1', borderLeft: '4px solid #FF9800' }}>
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-700" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800">CRITICAL: AI detection results are ADVISORY ONLY</p>
                        <p className="text-xs text-amber-700 mt-1">
                            They will never automatically deduct points or fail submissions. Instructors review flagged submissions and make final decisions.
                        </p>
                    </div>
                </div>

                {/* Plagiarism Detection */}
                <div className="p-5 rounded-lg border dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Plagiarism Detection</p>
                            <p className="text-xs text-gray-500 mt-0.5">Compare submissions to detect code similarity between students.</p>
                        </div>
                        <Controller
                            control={control}
                            name="plagiarismEnabled"
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </div>
                    {watchPlagiarism && (
                        <div className="mt-4 pl-4 border-l-2 border-[#6B0000] space-y-2">
                            <div className="flex justify-between">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Sensitivity: <strong>{getSensitivityLabel(watch('plagiarismSensitivity'))}</strong>
                                </span>
                                <span className="text-xs text-gray-500">{watch('plagiarismSensitivity')}%</span>
                            </div>
                            <Controller
                                control={control}
                                name="plagiarismSensitivity"
                                render={({ field }) => (
                                    <Slider
                                        value={[field.value]}
                                        onValueChange={(v) => field.onChange(v[0])}
                                        max={100}
                                        step={1}
                                    />
                                )}
                            />
                            <div className="flex justify-between">
                                <span className="text-[10px] text-gray-400">Low (Fewer flags)</span>
                                <span className="text-[10px] text-gray-400">High (More flags)</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Code Detection */}
                <div className="p-5 rounded-lg border dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI-Generated Code Detection</p>
                            <p className="text-xs text-gray-500 mt-0.5">Flag submissions that may contain AI-generated code (ChatGPT, Copilot, etc.).</p>
                        </div>
                        <Controller
                            control={control}
                            name="aiDetectionEnabled"
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </div>
                    {watchAiDetection && (
                        <div className="mt-4 pl-4 border-l-2 border-[#6B0000] space-y-2">
                            <div className="flex justify-between">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Sensitivity: <strong>{getSensitivityLabel(watch('aiDetectionSensitivity'))}</strong>
                                </span>
                                <span className="text-xs text-gray-500">{watch('aiDetectionSensitivity')}%</span>
                            </div>
                            <Controller
                                control={control}
                                name="aiDetectionSensitivity"
                                render={({ field }) => (
                                    <Slider
                                        value={[field.value]}
                                        onValueChange={(v) => field.onChange(v[0])}
                                        max={100}
                                        step={1}
                                    />
                                )}
                            />
                            <div className="flex justify-between">
                                <span className="text-[10px] text-gray-400">Low (Fewer flags)</span>
                                <span className="text-[10px] text-gray-400">High (More flags)</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Auto-Flag for Manual Review */}
                <div className="p-5 rounded-lg border dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Auto-Flag for Manual Review</p>
                            <p className="text-xs text-gray-500 mt-0.5">Submissions with similarity above threshold are flagged for instructor review.</p>
                        </div>
                        <Controller
                            control={control}
                            name="autoFlagEnabled"
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </div>
                    {watchAutoFlag && (
                        <div className="mt-3 flex items-center gap-3">
                            <Label className="text-xs whitespace-nowrap">Flag Threshold:</Label>
                            <Input
                                type="number"
                                {...register('autoFlagThreshold', { valueAsNumber: true })}
                                className="w-20"
                                min={10}
                                max={100}
                            />
                            <span className="text-xs text-gray-500">% similarity triggers review</span>
                        </div>
                    )}
                </div>

                {/* Similarity Report Settings */}
                <div className="p-5 rounded-lg border dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Similarity Report Settings</p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Checkbox id="show-matches" defaultChecked />
                            <label htmlFor="show-matches" className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                                Show similarity percentages and source matches
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="highlight-code" defaultChecked />
                            <label htmlFor="highlight-code" className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                                Highlight suspicious code sections
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Controller
                                control={control}
                                name="crossSectionComparison"
                                render={({ field }) => (
                                    <Checkbox
                                        id="cross-section"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <label htmlFor="cross-section" className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                                Compare across course sections
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Step 8: Review ────────────────────────────────────────────

    function renderReview() {
        const values = getValues();
        const totalTestPoints =
            values.publicTests.reduce((s, t) => s + t.points, 0) +
            values.privateTests.reduce((s, t) => s + t.points, 0);
        const totalRubricPoints = values.rubric.reduce((s, c) => s + c.maxPoints, 0);

        const sections = [
            {
                title: 'Basic Information',
                step: 0,
                icon: FileText,
                items: [
                    { label: 'Name', value: values.name || '—' },
                    { label: 'Short Name', value: values.shortName || '—' },
                    { label: 'Language', value: values.language === 'python' ? 'Python 3.10' : 'Java 17' },
                    { label: 'Category', value: values.category },
                    { label: 'Due Date', value: values.dueDate ? new Date(values.dueDate).toLocaleString() : '—' },
                    { label: 'Max Points', value: String(values.maxPoints) },
                    { label: 'Group', value: values.isGroup ? 'Yes' : 'No' },
                    { label: 'Late Submissions', value: values.allowLateSubmissions ? `Allowed (${values.latePenaltyAmount ?? 0}${values.latePenaltyType === 'fixed' ? ' pts' : '%'}/day)` : 'Not allowed' },
                ],
            },
            {
                title: 'Description',
                step: 1,
                icon: FileText,
                items: [
                    { label: 'Length', value: values.description ? `${values.description.length} characters` : 'None provided' },
                ],
            },
            {
                title: 'Starter Code',
                step: 2,
                icon: Code2,
                items: [
                    { label: 'Code', value: values.starterCode ? `${values.starterCode.split('\n').length} lines` : 'None provided' },
                ],
            },
            {
                title: 'Test Cases',
                step: 3,
                icon: TestTube,
                items: [
                    { label: 'Public Tests', value: `${values.publicTests.length} test(s)` },
                    { label: 'Private Tests', value: `${values.privateTests.length} test(s)` },
                    { label: 'Total Test Points', value: String(totalTestPoints) },
                ],
            },
            {
                title: 'Rubric',
                step: 5,
                icon: ClipboardList,
                items: [
                    { label: 'Criteria', value: `${values.rubric.length} criterion/criteria` },
                    { label: 'Total Rubric Points', value: String(totalRubricPoints) },
                    { label: 'Grading Methods', value: [...new Set(values.rubric.map((c) => c.gradingMethod))].join(', ') || '—' },
                ],
            },
            {
                title: 'Submission Settings',
                step: 6,
                icon: Settings2,
                items: [
                    { label: 'Max Attempts', value: String(values.maxAttempts) },
                    { label: 'File Types', value: values.allowedFileTypes || '—' },
                    { label: 'Max File Size', value: `${values.maxFileSizeMB} MB` },
                    { label: 'Grading', value: values.gradingStrategy === 'latest' ? 'Latest Submission' : 'Best Submission' },
                    { label: 'Resubmission', value: values.allowResubmission ? 'Allowed' : 'Not allowed' },
                    { label: 'Git Submission', value: values.enableGitSubmission ? 'Enabled' : 'Disabled' },
                ],
            },
            {
                title: 'AI Detection',
                step: 7,
                icon: ShieldAlert,
                items: [
                    { label: 'Plagiarism', value: values.plagiarismEnabled ? `Enabled (${getSensitivityLabel(values.plagiarismSensitivity)})` : 'Disabled' },
                    { label: 'AI Code Detection', value: values.aiDetectionEnabled ? `Enabled (${getSensitivityLabel(values.aiDetectionSensitivity)})` : 'Disabled' },
                    { label: 'Auto-Flag', value: values.autoFlagEnabled ? `Above ${values.autoFlagThreshold}%` : 'Disabled' },
                    { label: 'Cross-Section', value: values.crossSectionComparison ? 'Enabled' : 'Disabled' },
                ],
            },
        ];

        return (
            <div className="space-y-6">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <Eye className="h-5 w-5 text-[#6B0000]" /> Review Assignment
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Review all settings before publishing. Click any section to edit.</p>
                </div>

                {sections.map((section) => (
                    <button
                        key={section.step}
                        type="button"
                        onClick={() => setCurrentStep(section.step)}
                        className="w-full text-left p-5 rounded-lg border transition-colors hover:border-[#6B0000] bg-white dark:bg-gray-900 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <section.icon className="h-4 w-4 text-[#6B0000]" />
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{section.title}</h3>
                            </div>
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700">
                                <Check className="h-3 w-3" /> Complete
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                            {section.items.map((item, i) => (
                                <div key={i}>
                                    <p className="text-[11px] text-gray-400">{item.label}</p>
                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </button>
                ))}

                {/* Description preview */}
                {values.description && (
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                        <Label className="text-xs text-gray-400">Description Preview</Label>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                            {values.description.slice(0, 400)}
                            {values.description.length > 400 ? '…' : ''}
                        </p>
                    </div>
                )}

                {/* Rubric details */}
                {values.rubric.length > 0 && (
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                        <Label className="text-xs text-gray-400 mb-2 block">Rubric Breakdown</Label>
                        <div className="space-y-2">
                            {values.rubric.map((c, i) => (
                                <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0 dark:border-gray-700">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c.name}</span>
                                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800">
                                            {c.gradingMethod}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-[#6B0000]">{c.maxPoints} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Publish / Save buttons */}
                <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onSaveDraft(getValues())}
                        className="flex-1 h-11"
                    >
                        <Save className="h-4 w-4 mr-2" /> Save as Draft
                    </Button>
                    <Button
                        type="button"
                        className="flex-1 h-11 bg-[#6B0000] text-white hover:bg-[#8B1A1A]"
                        onClick={() => setShowPublishDialog(true)}
                    >
                        <Send className="h-4 w-4 mr-2" /> Publish Assignment
                    </Button>
                </div>
            </div>
        );
    }

    // ── Main render ───────────────────────────────────────────────

    const stepRenderers = [
        renderBasicInfo,
        renderDescription,
        renderStarterCode,
        () => renderTestCases(publicTestFields, appendPublicTest, removePublicTest, 'publicTests', false),
        () => renderTestCases(privateTestFields, appendPrivateTest, removePrivateTest, 'privateTests', true),
        renderRubric,
        renderSubmissionSettings,
        renderAiDetection,
        renderReview,
    ];

    const isReviewStep = currentStep === STEPS.length - 1;

    return (
        <>
            <form
                onSubmit={handleSubmit(onPublish)}
                className="mx-auto max-w-4xl space-y-6"
            >
                {renderStepIndicator()}

                {/* Step content */}
                <div className="min-h-[400px]">{stepRenderers[currentStep]()}</div>

                {/* Navigation footer (hidden on review step — review has its own buttons) */}
                {!isReviewStep && (
                    <div className="flex items-center justify-between border-t pt-6 dark:border-gray-700">
                        <div className="flex gap-2">
                            {currentStep > 0 && (
                                <Button type="button" variant="outline" onClick={handlePrev}>
                                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onCancel()}
                            >
                                Cancel
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">
                                Step {currentStep + 1} of {STEPS.length}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onSaveDraft(getValues())}
                            >
                                <Save className="mr-1 h-4 w-4" /> Save Draft
                            </Button>

                            <Button
                                type="button"
                                className="bg-[#6B0000] text-white hover:bg-[#8B1A1A]"
                                onClick={handleNext}
                            >
                                Next <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </form>

            {/* Save Rubric Template Dialog */}
            <Dialog open={showSaveRubricDialog} onOpenChange={setShowSaveRubricDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Save Rubric Template</DialogTitle>
                        <DialogDescription>
                            Save the current rubric configuration as a reusable template for future assignments.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 space-y-4">
                        <div>
                            <Label>Template Name</Label>
                            <Input
                                value={rubricTemplateName}
                                onChange={(e) => setRubricTemplateName(e.target.value)}
                                placeholder="e.g., Standard Coding Rubric"
                                maxLength={60}
                            />
                        </div>
                        <div className="rounded-lg p-3" style={{ backgroundColor: '#F5EDED' }}>
                            <p className="text-xs text-gray-600 mb-2">This template will include:</p>
                            <ul className="space-y-1">
                                <li className="flex items-center gap-2 text-xs text-gray-700">
                                    <Check className="h-3.5 w-3.5 text-green-600" /> {rubricFields.length} rubric criteria
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-700">
                                    <Check className="h-3.5 w-3.5 text-green-600" /> Grading methods: {[...new Set(getValues('rubric').map((c) => c.gradingMethod))].join(', ') || '—'}
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-700">
                                    <Check className="h-3.5 w-3.5 text-green-600" /> Total: {getValues('rubric').reduce((s, c) => s + c.maxPoints, 0)} points
                                </li>
                            </ul>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowSaveRubricDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleSaveRubricTemplate}
                            disabled={!rubricTemplateName.trim()}
                            className="bg-[#6B0000] text-white hover:bg-[#8B1A1A]"
                        >
                            <BookmarkPlus className="h-4 w-4 mr-2" /> Save Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Publish Confirmation Dialog */}
            <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Publish Assignment?</DialogTitle>
                        <DialogDescription>
                            <strong className="text-gray-900 dark:text-gray-100">{getValues('name') || 'This assignment'}</strong> will be visible to all students immediately. They can begin submitting right away.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 rounded-lg p-4" style={{ backgroundColor: '#F5EDED' }}>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[11px] text-gray-400">Language</p>
                                <p className="text-xs font-medium text-gray-700">{getValues('language') === 'python' ? 'Python' : 'Java'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400">Due Date</p>
                                <p className="text-xs font-medium text-gray-700">{getValues('dueDate') ? new Date(getValues('dueDate')).toLocaleDateString() : '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400">Points</p>
                                <p className="text-xs font-medium text-gray-700">{getValues('maxPoints')}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400">Test Cases</p>
                                <p className="text-xs font-medium text-gray-700">{getValues('publicTests').length + getValues('privateTests').length}</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowPublishDialog(false)}>Cancel</Button>
                        <Button
                            onClick={() => {
                                setShowPublishDialog(false);
                                handleSubmit(onPublish)();
                            }}
                            className="bg-[#6B0000] text-white hover:bg-[#8B1A1A]"
                        >
                            <Check className="h-4 w-4 mr-2" /> Publish Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ── Toggle Setting Row ──────────────────────────────────────────────

function ToggleSettingRow({
    label,
    description,
    fieldName,
    control,
}: {
    label: string;
    description: string;
    fieldName: 'allowResubmission' | 'showResultsToStudents' | 'enableGitSubmission';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: any;
}) {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700">
            <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </div>
            <Controller
                control={control}
                name={fieldName}
                render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
            />
        </div>
    );
}
