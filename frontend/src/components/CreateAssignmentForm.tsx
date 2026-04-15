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
import { toast } from 'sonner';


// ── Rubric Template types ───────────────────────────────────────────

interface RubricCriterion {
    name: string;
    description: string;
    maxPoints: number;
    weight?: number;
    gradingMethod: 'auto' | 'manual' | 'hybrid';
}

interface RubricSection {
    name: string;
    description?: string;
    weight?: number;
    criteria: RubricCriterion[];
}

interface RubricTemplate {
    id: string;
    name: string;
    isBuiltIn: boolean;
    sections: RubricSection[];
}

// Backward-compatible normalization: legacy values used 1.0 as 100%.
function toSectionWeightPercent(weight?: number | null): number {
    if (weight == null || Number.isNaN(weight)) return 100;
    if (weight <= 1.5) return weight * 100;
    return weight;
}

const NO_RUBRIC_TEMPLATE_ID = 'none';

const BUILTIN_RUBRIC_TEMPLATES: RubricTemplate[] = [
    {
        id: 'tpl-standard',
        name: 'Standard Coding Assignment',
        isBuiltIn: true,
        sections: [
            {
                name: 'Correctness',
                weight: 50,
                criteria: [
                    { name: 'Code Correctness', description: 'Produces correct output for all test cases', maxPoints: 50, gradingMethod: 'auto' },
                ],
            },
            {
                name: 'Code Quality',
                weight: 50,
                criteria: [
                    { name: 'Code Style', description: 'Follows language style guidelines (PEP8, etc.)', maxPoints: 20, gradingMethod: 'manual' },
                    { name: 'Documentation', description: 'Includes comments, docstrings, and file header', maxPoints: 30, gradingMethod: 'manual' },
                ],
            },
        ],
    },
    {
        id: 'tpl-algorithm',
        name: 'Algorithm Analysis',
        isBuiltIn: true,
        sections: [
            {
                name: 'Correctness & Complexity',
                weight: 80,
                criteria: [
                    { name: 'Correctness', description: 'Algorithm produces expected output', maxPoints: 40, gradingMethod: 'auto' },
                    { name: 'Time Complexity', description: 'Meets expected time complexity', maxPoints: 25, gradingMethod: 'hybrid' },
                    { name: 'Space Complexity', description: 'Meets expected space complexity', maxPoints: 15, gradingMethod: 'hybrid' },
                ],
            },
            {
                name: 'Code Quality',
                weight: 20,
                criteria: [
                    { name: 'Code Quality', description: 'Clean, readable, well-structured code', maxPoints: 20, gradingMethod: 'manual' },
                ],
            },
        ],
    },
    {
        id: 'tpl-project',
        name: 'Project-Based',
        isBuiltIn: true,
        sections: [
            {
                name: 'Functionality & Architecture',
                weight: 60,
                criteria: [
                    { name: 'Functionality', description: 'All required features work correctly', maxPoints: 40, gradingMethod: 'hybrid' },
                    { name: 'Code Architecture', description: 'Proper use of classes, modules, and design patterns', maxPoints: 20, gradingMethod: 'manual' },
                ],
            },
            {
                name: 'Testing & Documentation',
                weight: 30,
                criteria: [
                    { name: 'Testing', description: 'Includes unit tests with good coverage', maxPoints: 15, gradingMethod: 'auto' },
                    { name: 'Documentation', description: 'README, docstrings, and inline comments', maxPoints: 15, gradingMethod: 'manual' },
                ],
            },
            {
                name: 'User Experience',
                weight: 10,
                criteria: [
                    { name: 'UI/UX', description: 'Clean interface and user experience (if applicable)', maxPoints: 10, gradingMethod: 'manual' },
                ],
            },
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
    inputType: z.enum(['text', 'number', 'numbers']),
    input: z.string(),
    expectedOutput: z.string().min(1, 'Expected output is required'),
    points: z.number().min(0),
});

const rubricCriterionSchema = z.object({
    name: z.string().min(1, 'Criterion name is required'),
    description: z.string(),
    maxPoints: z.number().min(-1000, 'Value out of range').max(1000, 'Value out of range'),
    weight: z.number().min(0, 'Weight must be 0 or higher').max(1000, 'Weight too large'),
    gradingMethod: z.enum(['auto', 'manual', 'hybrid']),
});

const rubricSectionSchema = z.object({
    name: z.string().min(1, 'Section name is required'),
    description: z.string(),
    weight: z.number().min(0, 'Weight must be 0 or higher').max(100, 'Section weight cannot exceed 100%'),
    criteria: z.array(rubricCriterionSchema),
});

const formSchema = z.object({
    // Basic Info
    name: z.string().min(1, 'Assignment name is required'),
    shortName: z.string().min(1, 'Short name is required').max(10),
    language: z.enum(['python', 'java']),
    category: z.enum(['Homework', 'Quiz', 'Exam', 'Lab', 'Project']),
    dueDate: z.string(),  // Optional for drafts; validated on publish
    maxPoints: z.number().min(1).max(1000),
    isGroup: z.boolean(),
    description: z.string(),
    starterCode: z.string(),
    // Tests & Rubric
    publicTests: z.array(testCaseSchema),
    privateTests: z.array(testCaseSchema),
    rubricMode: z.enum(['weighted', 'unweighted']),
    rubric: z.array(rubricSectionSchema),
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
export interface AssignmentSubmitOptions {
    descriptionPdfFile?: File | null;
}

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
    onSaveDraft: (data: AssignmentFormData, options?: AssignmentSubmitOptions) => void;
    onPublish: (data: AssignmentFormData, options?: AssignmentSubmitOptions) => void;
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
    const [selectedRubricTemplateId, setSelectedRubricTemplateId] = useState(NO_RUBRIC_TEMPLATE_ID);
    const [draggedRubricIndex, setDraggedRubricIndex] = useState<number | null>(null);

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
            description: '',
            starterCode: '',
            publicTests: [],
            privateTests: [],
            rubricMode: 'unweighted' as const,
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
        setValue,
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
        move: moveRubric,
        replace: replaceRubric,
    } = useFieldArray({ control, name: 'rubric' });

    const watchPlagiarism = watch('plagiarismEnabled');
    const watchAiDetection = watch('aiDetectionEnabled');
    const watchAutoFlag = watch('autoFlagEnabled');
    const watchLanguage = watch('language');
    const watchRubricMode = watch('rubricMode');

    useEffect(() => {
        if (watchRubricMode === 'unweighted') {
            const current = getValues('rubric');
            current.forEach((_, idx) => setValue(`rubric.${idx}.weight`, 100));
        }
    }, [watchRubricMode, getValues, setValue]);

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
        ['name', 'shortName', 'language', 'category', 'dueDate'],
        ['description'],
        ['starterCode'],
        ['publicTests'],
        ['privateTests'],
        ['rubric'],
        ['maxAttempts', 'allowedFileTypes', 'maxFileSizeMB', 'gradingStrategy'],
        ['plagiarismSensitivity', 'aiDetectionSensitivity'],
        [], // review step — no fields
    ];

    const focusFirstValidationStep = useCallback(() => {
        const values = getValues();
        if (!values.name || !values.shortName || !values.language || !values.category || !values.dueDate) {
            setCurrentStep(0);
            return;
        }
        if (!values.starterCode) {
            setCurrentStep(2);
            return;
        }
        const hasInvalidPublic = (values.publicTests ?? []).some((t) => !t.name || !t.expectedOutput);
        if (hasInvalidPublic) {
            setCurrentStep(3);
            return;
        }
        const hasInvalidPrivate = (values.privateTests ?? []).some((t) => !t.name || !t.expectedOutput);
        if (hasInvalidPrivate) {
            setCurrentStep(4);
            return;
        }
        const hasInvalidRubric = (values.rubric ?? []).some((r) => !r.name);
        if (hasInvalidRubric) {
            setCurrentStep(5);
            return;
        }
    }, [getValues]);

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
        setSelectedRubricTemplateId(templateId);
        if (templateId === NO_RUBRIC_TEMPLATE_ID) {
            replaceRubric([]);
            return;
        }
        const template = allTemplates.find((t) => t.id === templateId);
        if (template) {
            replaceRubric(
                template.sections.map((section) => ({
                    name: section.name,
                    description: section.description ?? '',
                    weight: toSectionWeightPercent(section.weight),
                    criteria: (section.criteria || []).map((c) => ({
                        name: c.name,
                        description: c.description ?? '',
                        maxPoints: c.maxPoints,
                        weight: c.weight ?? 1,
                        gradingMethod: c.gradingMethod,
                    })),
                }))
            );
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
            sections: currentRubric.map((s) => ({ ...s })),
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

    // ── PDF / Image rubric upload & parse ──────────────────────────

    const pdfInputRef = useRef<HTMLInputElement>(null);
    const [pdfParsing, setPdfParsing] = useState(false);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [rubricUploadName, setRubricUploadName] = useState<string | null>(null);
    const [rubricPreviewImages, setRubricPreviewImages] = useState<string[]>([]);

    async function readFileAsDataUrl(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result ?? ''));
            reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    /** Scale + enhance image before OCR for better word boundary detection. */
    async function scaleImageForOCR(file: File): Promise<Blob> {
        const img = await createImageBitmap(file);
        const scale = Math.max(2, Math.min(4, 2400 / Math.max(img.width, img.height)));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return file;
        ctx.filter = 'grayscale(1) contrast(1.8)';
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b ?? file), 'image/png', 1.0));
    }

    /**
     * Word-position parser: groups Tesseract word detections by row (Y position),
     * then splits each row into left (name) and right (points) columns.
     * This avoids text-based pattern matching and handles run-together words correctly.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function parseRubricFromWordPositions(words: any[], totalMaxPoints: number): Array<{ name: string; description: string; maxPoints: number; weight: number; gradingMethod: 'auto' | 'manual' | 'hybrid' }> {
        if (!words?.length) return [];

        // Filter noise words (empty, single punctuation marks)
        const clean = words.filter((w) => w?.text?.trim()?.length > 0 && w?.bbox);
        if (!clean.length) return [];

        // Find the rightmost X to estimate column boundary
        const maxX = Math.max(...clean.map((w) => w.bbox.x1 as number));
        // Left column: < 65% of width, right column: > 65%
        const colBoundary = maxX * 0.65;

        // Group words into rows by Y centre (within 20px = same row)
        const grouped: (typeof clean)[] = [];
        const rowSorted = [...clean].sort((a, b) =>
            (a.bbox.y0 + a.bbox.y1) / 2 - (b.bbox.y0 + b.bbox.y1) / 2
        );
        for (const word of rowSorted) {
            const cy = (word.bbox.y0 + word.bbox.y1) / 2;
            const existing = grouped.find((row) => {
                const rowCY = (row[0].bbox.y0 + row[0].bbox.y1) / 2;
                return Math.abs(cy - rowCY) < 20;
            });
            if (existing) existing.push(word);
            else grouped.push([word]);
        }

        type Criterion = { name: string; description: string; maxPoints: number; weight: number; gradingMethod: 'auto' | 'manual' | 'hybrid' };
        const results: Criterion[] = [];
        const seen = new Set<string>();

        for (const row of grouped) {
            const rowSortedX = [...row].sort((a, b) => a.bbox.x0 - b.bbox.x0);
            const leftWords = rowSortedX.filter((w) => w.bbox.x0 < colBoundary);
            const rightWords = rowSortedX.filter((w) => w.bbox.x0 >= colBoundary);

            if (!leftWords.length) continue;

            // Find a signed integer in the right column, or at end of all words
            let pts: number | null = null;
            for (const w of rightWords) {
                const m = (w.text as string).match(/^-?\d+$/);
                if (m) { pts = parseInt(w.text, 10); break; }
                // e.g. "[2points" or "-1point"
                const m2 = (w.text as string).match(/^\[?(-?\d+)/);
                if (m2) { pts = parseInt(m2[1], 10); break; }
            }
            // Also scan whole row text as fallback
            if (pts === null) {
                const rowText = rowSortedX.map((w) => w.text).join(' ');
                const m = rowText.match(/(-?\d+)\s*(?:pts?|points?|pont|marks?)?\s*$/i);
                if (m) pts = parseInt(m[1], 10);
            }

            if (pts === null || pts === 0 || Math.abs(pts) > 1000) continue;

            const name = leftWords
                .map((w) => w.text as string)
                .join(' ')
                .replace(/\s+/g, ' ')
                .replace(/[.\s]+$/, '')
                .trim();

            // Skip header/junk rows
            if (/^total\s+points?/i.test(name) || /^grading/i.test(name) || name.length < 3) continue;

            const key = name.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);

            results.push({ name, description: pts < 0 ? 'Penalty' : '', maxPoints: pts, weight: 1, gradingMethod: 'manual' });
        }

        // Scale positive criteria to match totalMaxPoints if needed
        const pos = results.filter((r) => r.maxPoints > 0);
        const posTotal = pos.reduce((s, c) => s + c.maxPoints, 0);
        if (pos.length > 0 && posTotal > 0 && Math.abs(posTotal - totalMaxPoints) / totalMaxPoints > 0.1) {
            const scale = totalMaxPoints / posTotal;
            let running = 0;
            for (let i = 0; i < pos.length; i++) {
                if (i < pos.length - 1) { pos[i].maxPoints = Math.round(pos[i].maxPoints * scale); running += pos[i].maxPoints; }
                else pos[i].maxPoints = totalMaxPoints - running;
            }
        }

        return results;
    }

    const handleImageRubricUpload = async (file: File) => {
        setPdfParsing(true);
        setPdfError(null);
        try {
            setRubricUploadName(file.name);
            setRubricPreviewImages([await readFileAsDataUrl(file)]);
            // Scale up image for better OCR word boundary detection
            const enhanced = await scaleImageForOCR(file);
            const Tesseract = (await import('tesseract.js'));
            const { data } = await Tesseract.recognize(enhanced, 'eng', { logger: () => { } });
            console.log('[Rubric OCR raw text]\n', data.text);

            const currentSections = getValues('rubric');
            const maxPts = currentSections.reduce((s: number, section: any) => 
                s + (section.criteria || []).reduce((ss: number, c: any) => ss + (c.maxPoints || 0), 0), 0) || 100;

            // Primary: word-position based (handles tables robustly)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let criteria = parseRubricFromWordPositions((data as any).words ?? [], maxPts);
            // Fallback: text-pattern based
            if (criteria.length === 0) criteria = parseRubricText(data.text, maxPts);

            if (criteria.length === 0) {
                setPdfError(`Could not detect rubric criteria. Raw OCR (see console): ${data.text.slice(0, 300)}`);
            } else {
                setSelectedRubricTemplateId(NO_RUBRIC_TEMPLATE_ID);
                // Wrap criteria in a default section, converting multiplier weights to percentages
                const section: AssignmentFormData['rubric'][number] = {
                    name: 'Rubric Criteria',
                    description: `Criteria extracted from ${file.name}`,
                    weight: 100,
                    criteria: criteria.map((c) => ({
                        ...c,
                        weight: (c.weight ?? 1) * 100,
                        gradingMethod: 'manual' as const,
                    })),
                };
                replaceRubric([section]);
                toast.success(`Rubric uploaded from ${file.name}`);
            }
        } catch (err) {
            console.error('Image OCR error', err);
            setPdfError('Failed to read image. Please try a clearer screenshot.');
        } finally {
            setPdfParsing(false);
            if (pdfInputRef.current) pdfInputRef.current.value = '';
        }
    };

    // ── Description file upload ────────────────────────────────────

    const descFileInputRef = useRef<HTMLInputElement>(null);
    const [descFileLoading, setDescFileLoading] = useState(false);
    const [descriptionPdfFile, setDescriptionPdfFile] = useState<File | null>(null);
    const [descriptionPdfName, setDescriptionPdfName] = useState<string | null>(null);

    const handleDescriptionFileUpload = async (file: File) => {
        setDescFileLoading(true);
        try {
            if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
                setDescriptionPdfFile(file);
                setDescriptionPdfName(file.name);
            } else {
                const text = await file.text();
                setValue('description', text, { shouldDirty: true });
                setDescriptionPdfFile(null);
                setDescriptionPdfName(null);
            }
        } catch (err) {
            console.error('Description file read error', err);
            setDescriptionPdfFile(null);
            setDescriptionPdfName(null);
        } finally {
            setDescFileLoading(false);
            if (descFileInputRef.current) descFileInputRef.current.value = '';
        }
    };

    const handlePdfRubricUpload = async (file: File) => {
        setPdfParsing(true);
        setPdfError(null);
        try {
            setRubricUploadName(file.name);
            const arrayBuffer = await file.arrayBuffer();
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const pageImages: string[] = [];
            let fullText = '';
            const positionedWords: Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }> = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    await page.render({ canvasContext: ctx, viewport }).promise;
                    pageImages.push(canvas.toDataURL('image/png'));
                }
                const content = await page.getTextContent();
                const strings = content.items
                    .filter((item) => 'str' in item && typeof (item as Record<string, unknown>).str === 'string')
                    .map((item) => (item as { str: string }).str);
                fullText += strings.join(' ') + '\n';

                // Build OCR-like positioned words from PDF text items for robust table parsing.
                for (const item of content.items) {
                    if (!('str' in item)) continue;
                    const txt = String((item as { str: string }).str ?? '').trim();
                    if (!txt) continue;

                    const rec = item as unknown as {
                        str: string;
                        transform?: number[];
                        width?: number;
                        height?: number;
                    };
                    const t = rec.transform ?? [1, 0, 0, 1, 0, 0];
                    const x0 = Number(t[4] ?? 0);
                    const baselineY = Number(t[5] ?? 0);
                    const h = Math.max(6, Number(rec.height ?? Math.abs(t[3] ?? 10)));
                    const w = Math.max(4, Number(rec.width ?? txt.length * 6));
                    const pageYOffset = i * 10000;

                    positionedWords.push({
                        text: txt,
                        bbox: {
                            x0,
                            y0: baselineY - h + pageYOffset,
                            x1: x0 + w,
                            y1: baselineY + pageYOffset,
                        },
                    });
                }
            }
            setRubricPreviewImages(pageImages);

            const currentSections = getValues('rubric');
            const maxPts = currentSections.reduce((s: number, section: any) => 
                s + (section.criteria || []).reduce((ss: number, c: any) => ss + (c.maxPoints || 0), 0), 0) || 100;
            let criteria = parseRubricFromWordPositions(positionedWords, maxPts);
            if (criteria.length === 0) {
                criteria = parseRubricText(fullText, maxPts);
            }

            if (criteria.length === 0) {
                setPdfError('Could not detect rubric criteria in this PDF. Make sure it contains criterion names with point values (e.g. "Correctness – 40 pts").');
            } else {
                setSelectedRubricTemplateId(NO_RUBRIC_TEMPLATE_ID);
                // Wrap criteria in a default section, converting multiplier weights to percentages
                const section: AssignmentFormData['rubric'][number] = {
                    name: 'Rubric Criteria',
                    description: `Criteria extracted from ${file.name}`,
                    weight: 100,
                    criteria: criteria.map((c) => ({
                        ...c,
                        weight: (c.weight ?? 1) * 100,
                        gradingMethod: 'manual' as const,
                    })),
                };
                replaceRubric([section]);
                toast.success(`Rubric uploaded from ${file.name}`);
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
     * Heuristic parser: extracts rubric criteria from raw OCR / PDF text.
     * Handles the table format:
     *   "Get song name correctly.   2 points"
     *   "Not enough comments/whitespace.   -1 point"
     * Also handles:
     *   "Criterion – 40 pts" / "Criterion: 40" / "Criterion (40 points)"
     */
    function parseRubricText(
        text: string,
        totalMaxPoints: number,
    ): Array<{ name: string; description: string; maxPoints: number; weight: number; gradingMethod: 'auto' | 'manual' | 'hybrid' }> {
        type Criterion = { name: string; description: string; maxPoints: number; weight: number; gradingMethod: 'auto' | 'manual' | 'hybrid' };
        const results: Criterion[] = [];
        const seen = new Set<string>();

        // Normalize
        const norm = text
            .replace(/[\u2013\u2014]/g, '-')
            .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n');

        const shouldSkip = (name: string) =>
            /^total\s+points?/i.test(name) ||
            /^grading\s*:?\s*$/i.test(name) ||
            /^tomas\s*$/i.test(name) ||
            /^topos\s*$/i.test(name) ||
            /^\d+\s*(?:pts?|points?|pont)?$/i.test(name) ||
            name.length < 3 ||
            name.length > 250;

        // Insert spaces into CamelCase / runTogether words produced by OCR (e.g. "Getsongnamecorrectly")
        const fixCamel = (s: string) =>
            s.replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2');

        const addResult = (rawName: string, pts: number, weight = 1) => {
            let name = rawName.trim().replace(/\s+/g, ' ').replace(/[.\s]+$/, '').trim();
            name = fixCamel(name);
            if (shouldSkip(name) || pts === 0 || Math.abs(pts) > 1000) return;
            const key = name.toLowerCase();
            if (seen.has(key)) return;
            seen.add(key);
            results.push({ name, description: pts < 0 ? 'Penalty' : '', maxPoints: pts, weight: Math.max(0, weight), gradingMethod: 'manual' });
        };

        // ── Strategy 0: Table rows with Criterion + Weight + Max Points ─────
        // Handles rows like: "Palindromes   50   10   Instructor comments..."
        const tableLines = norm.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
        let tableMatched = 0;
        for (const line of tableLines) {
            if (/criteria|weight|max\s*points?|comments|notes|section/i.test(line)) continue;

            const weightedRow = line.match(/^(.+?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\b(?:\s+.*)?$/i);
            if (weightedRow) {
                const name = weightedRow[1];
                const weightVal = Number.parseFloat(weightedRow[2]);
                const ptsVal = Number.parseFloat(weightedRow[3]);
                if (Number.isFinite(ptsVal) && Math.abs(ptsVal) <= 1000) {
                    addResult(name, Math.round(ptsVal), Number.isFinite(weightVal) ? weightVal : 1);
                    tableMatched++;
                    continue;
                }
            }

            const unweightedRow = line.match(/^(.+?)\s+(-?\d+(?:\.\d+)?)\b(?:\s+.*)?$/i);
            if (unweightedRow && !/\b\d{1,2}\/\d{1,2}\b/.test(line)) {
                const maybeName = unweightedRow[1];
                const maybePts = Number.parseFloat(unweightedRow[2]);
                if (Number.isFinite(maybePts) && maybePts !== 0 && Math.abs(maybePts) <= 1000 && maybeName.length >= 3) {
                    addResult(maybeName, Math.round(maybePts), 1);
                    tableMatched++;
                }
            }
        }
        if (tableMatched >= 2) {
            return finalize(results, positiveScale(results, totalMaxPoints));
        }

        // ── Strategy 1: Pipe-delimited OCR table format ───────────────
        // Tesseract reads table columns as pipe-separated tokens.
        // Each entry looks like: "Name text ~~ [Npoints"  or  "Name text ~~ -1point"
        // Split the whole text on | and process each token.
        const pipeTokens = norm.split('|').map((t) => t.trim()).filter((t) => t.length > 0);
        const tildeSepPts = /~~\s*\[?(-?\d+)\s*(?:pts?|points?|pont)?\.?\s*$/i;
        let pipeMatched = 0;
        for (const token of pipeTokens) {
            const m = token.match(tildeSepPts);
            if (m) {
                const namePart = token.slice(0, token.lastIndexOf('~~')).trim();
                addResult(namePart, parseInt(m[1], 10));
                pipeMatched++;
            }
        }
        if (pipeMatched > 0) {
            // Successfully parsed pipe format — skip line-by-line strategies
            return finalize(results, positiveScale(results, totalMaxPoints));
        }

        // ── Strategy 2: Line-by-line ──────────────────────────────────
        const lines = norm.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

        const ptsOnly = /^(-?\d+)\s*(?:pts?|points?|pont|marks?)\.?\s*$/i;
        const inlinePts = /^(.+?)\s+(-?\d+)\s+(?:pts?|points?|pont|marks?)\.?\s*$/i;
        const inlineSpaced = /^(.+?)\s{2,}(-?\d{1,4})\s*$/;
        const dashStyle = /^(.+?)\s*[-:]+\s*(-?\d+)\s*(?:pts?|points?|marks?)?\s*$/i;
        const parenStyle = /^(.+?)\s*\((-?\d+)\s*(?:pts?|points?|marks?)?\)\s*$/i;
        // Tilde separator on same line: "Name ~~ [2points"
        const tildeInline = /^(.+?)\s*~~\s*\[?(-?\d+)\s*(?:pts?|points?|pont)?\.?\s*$/i;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (ptsOnly.test(line)) continue;

            const m0 = line.match(tildeInline);
            if (m0) { addResult(m0[1], parseInt(m0[2], 10)); continue; }

            const m1 = line.match(inlinePts);
            if (m1) { addResult(m1[1], parseInt(m1[2], 10)); continue; }

            const m2 = line.match(inlineSpaced);
            if (m2) { addResult(m2[1], parseInt(m2[2], 10)); continue; }

            const m3 = line.match(dashStyle);
            if (m3) { addResult(m3[1], parseInt(m3[2], 10)); continue; }

            const m4 = line.match(parenStyle);
            if (m4) { addResult(m4[1], parseInt(m4[2], 10)); continue; }

            if (i + 1 < lines.length) {
                const nextPts = lines[i + 1].match(ptsOnly);
                if (nextPts) { addResult(line, parseInt(nextPts[1], 10)); i++; continue; }
            }
            if (i + 1 < lines.length) {
                const nextNum = lines[i + 1].match(/^(-?\d{1,4})\s*$/);
                if (nextNum && !shouldSkip(line)) { addResult(line, parseInt(nextNum[1], 10)); i++; continue; }
            }
        }

        return finalize(results, positiveScale(results, totalMaxPoints));

        function positiveScale(arr: Criterion[], target: number): Criterion[] {
            const pos = arr.filter((r) => r.maxPoints > 0);
            const posTotal = pos.reduce((s, c) => s + c.maxPoints, 0);
            if (pos.length > 0 && posTotal !== target && posTotal > 0) {
                const ratio = Math.abs(posTotal - target) / target;
                if (ratio > 0.1) {
                    const scale = target / posTotal;
                    let running = 0;
                    for (let i = 0; i < pos.length; i++) {
                        if (i < pos.length - 1) {
                            pos[i].maxPoints = Math.round(pos[i].maxPoints * scale);
                            running += pos[i].maxPoints;
                        } else {
                            pos[i].maxPoints = target - running;
                        }
                    }
                }
            }
            return arr;
        }

        function finalize(arr: Criterion[], _: Criterion[]): Criterion[] { return arr; }
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
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                                        : isCompleted
                                            ? 'border-green-500 bg-[var(--color-success-bg)] text-[var(--color-success)] cursor-pointer'
                                            : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-light)] dark:border-gray-700 dark:bg-gray-800'
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
                                    className={`hidden text-xs font-medium xl:inline ${isActive ? 'text-[var(--color-primary)]' : isCompleted ? 'text-[var(--color-success)]' : 'text-[var(--color-text-light)]'
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
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-dark)] dark:text-gray-100">
                        <FileText className="h-5 w-5 text-[var(--color-primary)]" /> Basic Information
                    </h2>
                    <p className="text-xs text-[var(--color-text-mid)] mt-1">Configure the assignment&apos;s core details.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <Label htmlFor="name">Assignment Name *</Label>
                        <Input id="name" {...register('name')} placeholder="e.g. Homework 3 — Binary Trees" />
                        {errors.name && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="shortName">Short Name *</Label>
                        <Input id="shortName" {...register('shortName')} placeholder="HW3" maxLength={10} />
                        {errors.shortName && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.shortName.message}</p>}
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
                        <Label htmlFor="dueDate">Due Date <span className="text-xs text-[var(--color-text-light)]">(required to publish)</span></Label>
                        <Input id="dueDate" type="datetime-local" {...register('dueDate')} />
                        {errors.dueDate && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.dueDate.message}</p>}
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
                                <Users className="h-4 w-4 text-[var(--color-text-light)]" /> Group Assignment
                            </span>
                        </Label>
                    </div>


                </div>
            </div>
        );
    }

    // ── Step 1: Description ───────────────────────────────────────

    function renderDescription() {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-dark)] dark:text-gray-100">
                        <FileText className="h-5 w-5 text-[var(--color-primary)]" /> Assignment Description
                    </h2>
                    <p className="text-xs text-[var(--color-text-mid)] mt-1">Provide detailed instructions and requirements.</p>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <Label htmlFor="description">Description</Label>
                        <div className="flex items-center gap-2">
                            {descFileLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-text-light)]" />}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs gap-1.5"
                                disabled={descFileLoading}
                                onClick={() => descFileInputRef.current?.click()}
                            >
                                <FileUp className="h-3.5 w-3.5" /> Upload File
                            </Button>
                            <input
                                ref={descFileInputRef}
                                type="file"
                                accept=".txt,.md,.pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleDescriptionFileUpload(file);
                                }}
                            />
                        </div>
                    </div>
                    <Textarea
                        id="description"
                        {...register('description')}
                        rows={14}
                        placeholder="Provide detailed assignment instructions, requirements, and examples..."
                        className="font-mono text-sm"
                    />
                    {descriptionPdfName && (
                        <div className="mt-2 flex items-center justify-between rounded-md border px-3 py-2 text-xs text-[var(--color-text-mid)] dark:border-gray-700">
                            <span>Attached PDF: {descriptionPdfName}</span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                    setDescriptionPdfFile(null);
                                    setDescriptionPdfName(null);
                                }}
                            >
                                Remove PDF
                            </Button>
                        </div>
                    )}
                    <p className="mt-1 text-xs text-[var(--color-text-light)]">
                        {descriptionPdfName
                            ? 'Students will see an Open Original PDF button in the Description tab.'
                            : 'Supports Markdown formatting. Upload .txt/.md to auto-fill text, or .pdf to attach the original document.'}
                    </p>
                </div>
            </div>
        );
    }

    // ── Step 2: Starter Code ──────────────────────────────────────

    function renderStarterCode() {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-dark)] dark:text-gray-100">
                        <Code2 className="h-5 w-5 text-[var(--color-primary)]" /> Starter Code
                    </h2>
                    <p className="text-xs text-[var(--color-text-mid)] mt-1">Optional template code that students will start with.</p>
                </div>
                <div>
                    <Label htmlFor="starterCode">Code Template</Label>
                    <div className="rounded-lg overflow-hidden border dark:border-gray-700">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1E1E2E] border-b border-gray-700">
                            <span className="text-xs text-[var(--color-text-light)]">
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
                            style={{ backgroundColor: '#1E1E2E', color: 'var(--color-border)' }}
                        />
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-text-light)]">
                        Students will see this code pre-filled when they start the assignment.
                    </p>
                </div>
            </div>
        );
    }

    // ── Step 3 & 4: Test Cases (shared renderer) ──────────────────

    function renderTestCases(
        fields: Array<Record<string, unknown> & { id: string }>,
        append: (value: { name: string; inputType: 'text' | 'number' | 'numbers'; input: string; expectedOutput: string; points: number }) => void,
        remove: (index: number) => void,
        prefix: 'publicTests' | 'privateTests',
        isPrivate: boolean
    ) {
        const INPUT_TYPES = [
            { value: 'text', label: 'Text', hint: 'Any text (stdin)' },
            { value: 'number', label: 'Number', hint: 'Single numeric value' },
            { value: 'numbers', label: 'Numbers', hint: 'Multiple values (space or newline separated)' },
        ] as const;

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-dark)] dark:text-gray-100">
                            {isPrivate ? <Lock className="h-5 w-5 text-[var(--color-primary)]" /> : <TestTube className="h-5 w-5 text-[var(--color-primary)]" />}
                            {isPrivate ? 'Private' : 'Public'} Test Cases
                        </h2>
                        <p className="text-xs text-[var(--color-text-mid)] mt-1">
                            {isPrivate
                                ? 'Hidden from students — used for final grading.'
                                : 'Visible to students — they can run these before submitting.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                            backgroundColor: isPrivate ? 'var(--color-warning-bg)' : 'var(--color-info-bg)',
                            color: isPrivate ? 'var(--color-warning)' : 'var(--color-info)',
                        }}>
                            {fields.length} test{fields.length !== 1 ? 's' : ''}
                        </span>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                append({ name: `${isPrivate ? 'Private' : 'Public'} Test ${fields.length + 1}`, inputType: 'text', input: '', expectedOutput: '', points: 10 })
                            }
                        >
                            <Plus className="mr-1 h-3.5 w-3.5" /> Add Test
                        </Button>
                    </div>
                </div>

                {fields.length === 0 && (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-[var(--color-text-light)]">
                        No test cases yet. Click &quot;Add Test&quot; to get started.
                    </div>
                )}

                {fields.map((field, idx) => (
                    <div
                        key={field.id}
                        className="relative rounded-lg border bg-[var(--color-surface)] p-4 dark:bg-gray-900 dark:border-gray-700"
                        style={{ backgroundColor: isPrivate ? 'var(--color-warning-bg)' : undefined }}
                    >
                        <div className="absolute right-2 top-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-[var(--color-text-light)] hover:text-red-500"
                                onClick={() => remove(idx)}
                                aria-label={`Remove test case ${idx + 1}`}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            {/* Header row: label, name, points */}
                            <div className="md:col-span-2 flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-gray-300" />
                                <span className="text-xs font-semibold text-[var(--color-text-mid)]">
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

                            {/* Input type selector */}
                            <div className="md:col-span-2">
                                <Label className="text-xs mb-1.5 block">Input Type</Label>
                                <Controller
                                    control={control}
                                    name={`${prefix}.${idx}.inputType`}
                                    render={({ field: typeField }) => (
                                        <div className="flex gap-1.5">
                                            {INPUT_TYPES.map((t) => (
                                                <button
                                                    key={t.value}
                                                    type="button"
                                                    title={t.hint}
                                                    onClick={() => typeField.onChange(t.value)}
                                                    className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${(typeField.value ?? 'text') === t.value
                                                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                                                        : 'bg-[var(--color-surface)] text-[var(--color-text-mid)] border-[var(--color-border)] hover:border-[var(--color-primary)] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                                                        }`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                            <span className="ml-2 text-xs text-[var(--color-text-light)] flex items-center">
                                                {INPUT_TYPES.find((t) => t.value === (typeField.value ?? 'text'))?.hint}
                                            </span>
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Input field */}
                            <div>
                                <Label className="text-xs">Input (stdin)</Label>
                                <Controller
                                    control={control}
                                    name={`${prefix}.${idx}.inputType`}
                                    render={({ field: typeField }) => {
                                        const t = typeField.value ?? 'text';
                                        if (t === 'number') {
                                            return (
                                                <Input
                                                    type="number"
                                                    {...register(`${prefix}.${idx}.input`)}
                                                    className="font-mono text-xs"
                                                    placeholder="e.g. 42"
                                                />
                                            );
                                        }
                                        return (
                                            <Textarea
                                                {...register(`${prefix}.${idx}.input`)}
                                                rows={3}
                                                className="font-mono text-xs"
                                                placeholder={
                                                    t === 'numbers'
                                                        ? 'e.g. 1 2 3\n  or each on its own line'
                                                        : 'Enter text input...'
                                                }
                                            />
                                        );
                                    }}
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
                    <div className="rounded-lg p-3 text-center text-sm" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                        <span className="text-[var(--color-text-mid)]">Total test points: </span>
                        <span className="font-bold text-[var(--color-primary)]">
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
        const totalRubricPoints = rubricValues.reduce((sum, section) => {
            const sectionPoints = (section.criteria || []).reduce((s, c) => s + (c.maxPoints || 0), 0);
            return sum + sectionPoints;
        }, 0);
        const totalCriteria = rubricValues.reduce((sum, section) => sum + (section.criteria?.length || 0), 0);
        const sectionWeightTotal = rubricValues.reduce((sum, section) => sum + toSectionWeightPercent(section.weight), 0);

        return (
            <div className="space-y-5">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-dark)] dark:text-gray-100">
                        <ClipboardList className="h-5 w-5 text-[#C9A84C]" /> Rubric Design
                    </h2>
                    <p className="text-xs text-[var(--color-text-mid)] mt-1">Configure sections with grading criteria. Add as many sections and criteria as needed.</p>
                </div>

                <div className="rounded-lg border p-4 bg-[var(--color-surface-elevated)] dark:bg-gray-900 dark:border-gray-700">
                    <Label className="text-xs">Rubric Mode</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant={watchRubricMode === 'unweighted' ? 'default' : 'outline'}
                            className="h-8"
                            onClick={() => setValue('rubricMode', 'unweighted')}
                        >
                            Unweighted (equal weights)
                        </Button>
                        <Button
                            type="button"
                            variant={watchRubricMode === 'weighted' ? 'default' : 'outline'}
                            className="h-8"
                            onClick={() => setValue('rubricMode', 'weighted')}
                        >
                            Weighted (custom weights)
                        </Button>
                    </div>
                    <p className="text-xs text-[var(--color-text-mid)] mt-2">
                        Weighted mode lets you set a weight multiplier for each section and criterion.
                    </p>
                </div>

                {/* Template controls */}
                <div className="flex flex-wrap items-center gap-2 rounded-lg border p-4 bg-[var(--color-surface-elevated)] dark:bg-gray-900 dark:border-gray-700">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FolderOpen className="h-4 w-4 flex-shrink-0 text-[var(--color-primary)]" />
                        <Select value={selectedRubricTemplateId} onValueChange={handleLoadTemplate}>
                            <SelectTrigger className="h-9 max-w-xs">
                                <SelectValue placeholder="Load saved rubric..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={NO_RUBRIC_TEMPLATE_ID}>None</SelectItem>
                                <div className="px-2 py-1.5 text-xs font-semibold text-[var(--color-text-light)]">Built-in Templates</div>
                                {BUILTIN_RUBRIC_TEMPLATES.map((t) => {
                                    const critCount = t.sections.reduce((sum, s) => sum + (s.criteria?.length || 0), 0);
                                    return (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name} ({critCount} criteria)
                                        </SelectItem>
                                    );
                                })}
                                {savedTemplates.length > 0 && (
                                    <>
                                        <div className="px-2 py-1.5 text-xs font-semibold text-[var(--color-text-light)] border-t mt-1 pt-1">Your Templates</div>
                                        {savedTemplates.map((t) => {
                                            const critCount = t.sections.reduce((sum, s) => sum + (s.criteria?.length || 0), 0);
                                            return (
                                                <SelectItem key={t.id} value={t.id}>
                                                    {t.name} ({critCount} criteria)
                                                </SelectItem>
                                            );
                                        })}
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            ref={pdfInputRef}
                            type="file"
                            accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,image/gif"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                                    handlePdfRubricUpload(file);
                                } else {
                                    handleImageRubricUpload(file);
                                }
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
                                <><FileUp className="h-4 w-4 mr-1.5 text-[var(--color-primary)]" /> Upload Rubric (PDF or Image)</>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => { setRubricTemplateName(''); setShowSaveRubricDialog(true); }}
                            className="h-9"
                            disabled={totalCriteria === 0}
                        >
                            <BookmarkPlus className="h-4 w-4 mr-1.5 text-[var(--color-primary)]" /> Save Rubric
                        </Button>
                        {rubricSaveSuccess && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-success-bg)] text-[var(--color-success)]">
                                <Check className="h-3.5 w-3.5" /> Saved!
                            </span>
                        )}
                    </div>
                </div>

                {pdfError && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-[var(--color-error-bg)] p-3 text-sm text-[var(--color-error)] dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                            <p className="font-medium">Parsing Issue</p>
                            <p className="text-xs mt-0.5">{pdfError}</p>
                        </div>
                        <button type="button" className="ml-auto text-red-400 hover:text-red-600" onClick={() => setPdfError(null)} aria-label="Dismiss">✕</button>
                    </div>
                )}

                {rubricUploadName && (
                    <div className="rounded-lg border p-3 bg-[var(--color-surface)] dark:bg-gray-900 dark:border-gray-700">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div>
                                <p className="text-sm font-medium text-[var(--color-text-dark)] dark:text-gray-100">Uploaded rubric file</p>
                                <p className="text-xs text-[var(--color-text-mid)]">{rubricUploadName}</p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setRubricUploadName(null);
                                    setRubricPreviewImages([]);
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                        {rubricPreviewImages.length > 0 ? (
                            <div className="rounded-lg border overflow-auto max-h-[420px] bg-[var(--color-surface-elevated)] dark:bg-gray-950 p-3 space-y-3">
                                {rubricPreviewImages.map((src, i) => (
                                    <img
                                        key={`${rubricUploadName}-${i}`}
                                        src={src}
                                        alt={`Rubric preview page ${i + 1}`}
                                        className="w-full rounded shadow-sm border dark:border-gray-700"
                                        style={{ imageRendering: 'auto' }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-[var(--color-text-mid)]">File selected. Preview is not available for this upload.</p>
                        )}
                    </div>
                )}

                {savedTemplates.length > 0 && (
                    <div className="rounded-lg border p-3 dark:border-gray-700">
                        <p className="text-xs font-medium text-[var(--color-text-mid)] mb-2">Your Saved Templates:</p>
                        <div className="flex flex-wrap gap-2">
                            {savedTemplates.map((t) => (
                                <div key={t.id} className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs bg-[var(--color-surface)] dark:bg-gray-900 dark:border-gray-700">
                                    <button
                                        type="button"
                                        className="font-medium text-[var(--color-primary)] hover:underline"
                                        onClick={() => handleLoadTemplate(t.id)}
                                    >
                                        {t.name}
                                    </button>
                                    <button
                                        type="button"
                                        className="text-[var(--color-text-light)] hover:text-red-500"
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

                {/* Add section button */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-mid)]">{rubricValues.length} sections, {totalCriteria} criteria defined</span>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            appendRubric({
                                name: `Section ${rubricValues.length + 1}`,
                                description: '',
                                weight: 100,
                                criteria: [],
                            })
                        }
                    >
                        <Plus className="mr-1 h-3.5 w-3.5" /> Add Section
                    </Button>
                </div>

                {rubricValues.length === 0 && (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-[var(--color-text-light)]">
                        No rubric sections yet. Use a template, upload a PDF, or add sections manually.
                    </div>
                )}

                {/* Rubric sections */}
                {rubricValues.map((section, sectionIdx) => (
                    <RubricSectionEditor
                        key={`section-${sectionIdx}`}
                        sectionIdx={sectionIdx}
                        watchRubricMode={watchRubricMode}
                        errors={errors}
                        register={register}
                        control={control}
                        onRemoveSection={() => removeRubric(sectionIdx)}
                        rubricMode={watchRubricMode}
                    />
                ))}

                {/* Total points summary */}
                {totalCriteria > 0 && (
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-[var(--color-text-mid)]">Total Rubric Points:</span>
                            <span className="text-xl font-bold text-[var(--color-primary)]">{totalRubricPoints}</span>
                        </div>
                        {watchRubricMode === 'weighted' && (
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm font-semibold text-[var(--color-text-mid)]">Section Weights Total:</span>
                                <span className="text-sm font-bold" style={{ color: Math.abs(sectionWeightTotal - 100) < 0.001 ? 'var(--color-success)' : 'var(--color-error)' }}>
                                    {sectionWeightTotal.toFixed(1)}%
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm font-semibold text-[var(--color-text-mid)]">Rubric Mode:</span>
                            <span className="text-sm font-bold text-[var(--color-primary)]">
                                {watchRubricMode === 'weighted' ? 'Weighted' : 'Unweighted'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Rubric Section Editor Component ──────────────────────────

    interface RubricSectionEditorProps {
        sectionIdx: number;
        watchRubricMode: 'weighted' | 'unweighted';
        errors: any;
        register: any;
        control: any;
        onRemoveSection: () => void;
        rubricMode: 'weighted' | 'unweighted';
    }

    function RubricSectionEditor({
        sectionIdx,
        watchRubricMode,
        errors,
        register,
        control,
        onRemoveSection,
        rubricMode,
    }: RubricSectionEditorProps) {
        const section = getValues(`rubric.${sectionIdx}`);
        const {
            fields: criteriaFields,
            append: appendCriterion,
            remove: removeCriterion,
        } = useFieldArray({ control, name: `rubric.${sectionIdx}.criteria` });

        return (
            <div className="rounded-lg border bg-[var(--color-surface)] p-4 dark:bg-gray-900 dark:border-gray-700 space-y-4">
                {/* Section header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 grid gap-3 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <Label className="text-xs">Section Name *</Label>
                            <Input
                                {...register(`rubric.${sectionIdx}.name`)}
                                placeholder="e.g. Correctness"
                            />
                            {errors.rubric?.[sectionIdx]?.name && (
                                <p className="mt-1 text-xs text-[var(--color-error)]">{errors.rubric[sectionIdx]?.name?.message}</p>
                            )}
                        </div>
                        {watchRubricMode === 'weighted' && (
                            <div>
                                <Label className="text-xs">Section Weight (%)</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        step="0.1"
                                        min={0}
                                        max={100}
                                        {...register(`rubric.${sectionIdx}.weight`, { valueAsNumber: true })}
                                    />
                                    <span className="text-xs text-[var(--color-text-mid)]">%</span>
                                </div>
                                {errors.rubric?.[sectionIdx]?.weight && (
                                    <p className="mt-1 text-xs text-[var(--color-error)]">{errors.rubric[sectionIdx]?.weight?.message}</p>
                                )}
                            </div>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-[var(--color-text-light)] hover:text-red-500 mt-6"
                        onClick={onRemoveSection}
                        aria-label={`Remove section ${sectionIdx + 1}`}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {/* Section description */}
                <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea
                        {...register(`rubric.${sectionIdx}.description`)}
                        rows={2}
                        placeholder="What this section evaluates..."
                        className="text-sm"
                    />
                </div>

                {/* Criteria table header */}
                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-[var(--color-text-mid)] dark:text-gray-300 mb-3">Criteria</h4>

                    {/* Criteria items */}
                    <div className="space-y-3 mb-4">
                        {criteriaFields.map((criterionField, critIdx) => (
                            <div
                                key={criterionField.id}
                                className="rounded-lg border bg-[var(--color-surface-elevated)] dark:bg-gray-800 p-3 dark:border-gray-700"
                            >
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div>
                                        <Label className="text-xs">Name *</Label>
                                        <Input
                                            {...register(`rubric.${sectionIdx}.criteria.${critIdx}.name`)}
                                            placeholder="e.g. Correctness"
                                            size={30}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Max Points *</Label>
                                        <div className="flex gap-1">
                                            <Input
                                                type="number"
                                                {...register(`rubric.${sectionIdx}.criteria.${critIdx}.maxPoints`, { valueAsNumber: true })}
                                                className="h-8 text-sm"
                                            />
                                            {watchRubricMode === 'weighted' && (
                                                <Input
                                                    type="number"
                                                    step="1"
                                                    min={0}
                                                    max={100}
                                                    {...register(`rubric.${sectionIdx}.criteria.${critIdx}.weight`, { valueAsNumber: true })}
                                                    placeholder="Weight %"
                                                    className="h-8 text-sm w-24"
                                                />
                                            )}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-[var(--color-text-light)] hover:text-red-500"
                                                onClick={() => removeCriterion(critIdx)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs">Grading Method</Label>
                                        <Controller
                                            control={control}
                                            name={`rubric.${sectionIdx}.criteria.${critIdx}.gradingMethod`}
                                            render={({ field }) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="auto">Auto</SelectItem>
                                                        <SelectItem value="manual">Manual</SelectItem>
                                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="text-xs">Description</Label>
                                        <Textarea
                                            {...register(`rubric.${sectionIdx}.criteria.${critIdx}.description`)}
                                            rows={2}
                                            placeholder="Describe what this criterion evaluates..."
                                            className="text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add criterion button */}
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            appendCriterion({
                                name: '',
                                description: '',
                                maxPoints: 10,
                                weight: 100,
                                gradingMethod: 'manual',
                            })
                        }
                        className="h-8 text-sm"
                    >
                        <Plus className="mr-1 h-3.5 w-3.5" /> Add Criterion
                    </Button>

                    {criteriaFields.length === 0 && (
                        <p className="text-xs text-[var(--color-text-light)] italic mt-2">No criteria yet. Click "Add Criterion" to get started.</p>
                    )}
                </div>
            </div>
        );
    }

    // ── Step 6: Submission Settings ───────────────────────────────

    function renderSubmissionSettings() {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-dark)] dark:text-gray-100">
                        <Settings2 className="h-5 w-5 text-[var(--color-primary)]" /> Submission Settings
                    </h2>
                    <p className="text-xs text-[var(--color-text-mid)] mt-1">Configure how students submit their work.</p>
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
                            <span className="text-xs text-[var(--color-text-mid)]">attempts per student</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-lg border dark:border-gray-700">
                        <Label>Allowed File Types</Label>
                        <Input
                            {...register('allowedFileTypes')}
                            placeholder=".py, .java"
                            className="mt-2"
                        />
                        <p className="text-xs text-[var(--color-text-light)] mt-1">Comma-separated extensions</p>
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
                            <span className="text-xs text-[var(--color-text-mid)]">MB per file</span>
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
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-dark)] dark:text-gray-100">
                        <ShieldAlert className="h-5 w-5 text-[var(--color-primary)]" /> AI-Assisted Detection
                    </h2>
                    <p className="text-xs text-[var(--color-text-mid)] mt-1">Configure plagiarism and AI-generated code detection.</p>
                </div>

                {/* Warning banner */}
                <div className="rounded-lg p-4 flex gap-3" style={{ backgroundColor: 'var(--color-warning-bg)', borderLeft: '4px solid #FF9800' }}>
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
                            <p className="text-sm font-semibold text-[var(--color-text-dark)] dark:text-gray-100">Plagiarism Detection</p>
                            <p className="text-xs text-[var(--color-text-mid)] mt-0.5">Compare submissions to detect code similarity between students.</p>
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
                        <div className="mt-4 pl-4 border-l-2 border-[var(--color-primary)] space-y-2">
                            <div className="flex justify-between">
                                <span className="text-xs font-medium text-[var(--color-text-mid)] dark:text-gray-300">
                                    Sensitivity: <strong>{getSensitivityLabel(watch('plagiarismSensitivity'))}</strong>
                                </span>
                                <span className="text-xs text-[var(--color-text-mid)]">{watch('plagiarismSensitivity')}%</span>
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
                                <span className="text-[10px] text-[var(--color-text-light)]">Low (Fewer flags)</span>
                                <span className="text-[10px] text-[var(--color-text-light)]">High (More flags)</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Code Detection */}
                <div className="p-5 rounded-lg border dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm font-semibold text-[var(--color-text-dark)] dark:text-gray-100">AI-Generated Code Detection</p>
                            <p className="text-xs text-[var(--color-text-mid)] mt-0.5">Flag submissions that may contain AI-generated code (ChatGPT, Copilot, etc.).</p>
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
                        <div className="mt-4 pl-4 border-l-2 border-[var(--color-primary)] space-y-2">
                            <div className="flex justify-between">
                                <span className="text-xs font-medium text-[var(--color-text-mid)] dark:text-gray-300">
                                    Sensitivity: <strong>{getSensitivityLabel(watch('aiDetectionSensitivity'))}</strong>
                                </span>
                                <span className="text-xs text-[var(--color-text-mid)]">{watch('aiDetectionSensitivity')}%</span>
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
                                <span className="text-[10px] text-[var(--color-text-light)]">Low (Fewer flags)</span>
                                <span className="text-[10px] text-[var(--color-text-light)]">High (More flags)</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Auto-Flag for Manual Review */}
                <div className="p-5 rounded-lg border dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm font-semibold text-[var(--color-text-dark)] dark:text-gray-100">Auto-Flag for Manual Review</p>
                            <p className="text-xs text-[var(--color-text-mid)] mt-0.5">Submissions with similarity above threshold are flagged for instructor review.</p>
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
                            <span className="text-xs text-[var(--color-text-mid)]">% similarity triggers review</span>
                        </div>
                    )}
                </div>

                {/* Similarity Report Settings */}
                <div className="p-5 rounded-lg border dark:border-gray-700">
                    <p className="text-sm font-semibold text-[var(--color-text-dark)] dark:text-gray-100 mb-3">Similarity Report Settings</p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Checkbox id="show-matches" defaultChecked />
                            <label htmlFor="show-matches" className="text-xs text-[var(--color-text-mid)] dark:text-gray-300 cursor-pointer">
                                Show similarity percentages and source matches
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="highlight-code" defaultChecked />
                            <label htmlFor="highlight-code" className="text-xs text-[var(--color-text-mid)] dark:text-gray-300 cursor-pointer">
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
                            <label htmlFor="cross-section" className="text-xs text-[var(--color-text-mid)] dark:text-gray-300 cursor-pointer">
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
        const rubricCriteria = values.rubric.flatMap((section) => section.criteria ?? []);
        const totalRubricPoints = rubricCriteria.reduce((sum, criterion) => sum + criterion.maxPoints, 0);
        const rubricGradingMethods = [...new Set(rubricCriteria.map((criterion) => criterion.gradingMethod))];

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
                    { label: 'Group', value: values.isGroup ? 'Yes' : 'No' },
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
                    { label: 'Criteria', value: `${rubricCriteria.length} criterion/criteria` },
                    { label: 'Total Rubric Points', value: String(totalRubricPoints) },
                    { label: 'Rubric Mode', value: values.rubricMode === 'weighted' ? 'Weighted' : 'Unweighted' },
                    { label: 'Grading Methods', value: rubricGradingMethods.join(', ') || '—' },
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
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-dark)] dark:text-gray-100">
                        <Eye className="h-5 w-5 text-[var(--color-primary)]" /> Review Assignment
                    </h2>
                    <p className="text-xs text-[var(--color-text-mid)] mt-1">Review all settings before publishing. Click any section to edit.</p>
                </div>

                {sections.map((section) => (
                    <button
                        key={section.step}
                        type="button"
                        onClick={() => setCurrentStep(section.step)}
                        className="w-full text-left p-5 rounded-lg border transition-colors hover:border-[var(--color-primary)] bg-[var(--color-surface)] dark:bg-gray-900 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <section.icon className="h-4 w-4 text-[var(--color-primary)]" />
                                <h3 className="text-sm font-semibold text-[var(--color-text-dark)] dark:text-gray-100">{section.title}</h3>
                            </div>
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--color-success-bg)] text-[var(--color-success)]">
                                <Check className="h-3 w-3" /> Complete
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                            {section.items.map((item, i) => (
                                <div key={i}>
                                    <p className="text-[11px] text-[var(--color-text-light)]">{item.label}</p>
                                    <p className="text-xs font-medium text-[var(--color-text-mid)] dark:text-gray-300">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </button>
                ))}

                {/* Description preview */}
                {values.description && (
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                        <Label className="text-xs text-[var(--color-text-light)]">Description Preview</Label>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--color-text-mid)] dark:text-gray-300">
                            {values.description.slice(0, 400)}
                            {values.description.length > 400 ? '…' : ''}
                        </p>
                    </div>
                )}

                {/* Rubric details */}
                {values.rubric.length > 0 && (
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                        <Label className="text-xs text-[var(--color-text-light)] mb-2 block">Rubric Breakdown</Label>
                        <div className="space-y-2">
                            {rubricCriteria.map((criterion, i) => (
                                <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0 dark:border-gray-700">
                                    <div>
                                        <span className="text-sm font-medium text-[var(--color-text-mid)] dark:text-gray-300">{criterion.name}</span>
                                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-text-mid)] dark:bg-gray-800">
                                            {criterion.gradingMethod}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-[var(--color-primary)]">{criterion.maxPoints} pts</span>
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
                        onClick={() => onSaveDraft(getValues(), { descriptionPdfFile })}
                        className="flex-1 h-11"
                    >
                        <Save className="h-4 w-4 mr-2" /> Save as Draft
                    </Button>
                    <Button
                        type="button"
                        className="flex-1 h-11 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
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
                onSubmit={handleSubmit((data) => onPublish(data, { descriptionPdfFile }))}
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
                            <span className="text-xs text-[var(--color-text-light)]">
                                Step {currentStep + 1} of {STEPS.length}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onSaveDraft(getValues(), { descriptionPdfFile })}
                            >
                                <Save className="mr-1 h-4 w-4" /> Save Draft
                            </Button>

                            <Button
                                type="button"
                                className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
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
                        <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                            <p className="text-xs text-[var(--color-text-mid)] mb-2">This template will include:</p>
                            <ul className="space-y-1">
                                <li className="flex items-center gap-2 text-xs text-[var(--color-text-mid)]">
                                    <Check className="h-3.5 w-3.5 text-[var(--color-success)]" /> {rubricFields.length} rubric criteria
                                </li>
                                <li className="flex items-center gap-2 text-xs text-[var(--color-text-mid)]">
                                    <Check className="h-3.5 w-3.5 text-[var(--color-success)]" /> Grading methods: {[
                                        ...new Set(getValues('rubric').flatMap((section) => section.criteria.map((criterion) => criterion.gradingMethod))),
                                    ].join(', ') || '—'}
                                </li>
                                <li className="flex items-center gap-2 text-xs text-[var(--color-text-mid)]">
                                    <Check className="h-3.5 w-3.5 text-[var(--color-success)]" /> Total: {
                                        getValues('rubric').reduce(
                                            (sectionSum, section) =>
                                                sectionSum + section.criteria.reduce((criterionSum, criterion) => criterionSum + criterion.maxPoints, 0),
                                            0
                                        )
                                    } points
                                </li>
                            </ul>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowSaveRubricDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleSaveRubricTemplate}
                            disabled={!rubricTemplateName.trim()}
                            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
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
                            <strong className="text-[var(--color-text-dark)] dark:text-gray-100">{getValues('name') || 'This assignment'}</strong> will be visible to all students immediately. They can begin submitting right away.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 rounded-lg p-4" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[11px] text-[var(--color-text-light)]">Language</p>
                                <p className="text-xs font-medium text-[var(--color-text-mid)]">{getValues('language') === 'python' ? 'Python' : 'Java'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-[var(--color-text-light)]">Due Date</p>
                                <p className="text-xs font-medium text-[var(--color-text-mid)]">{getValues('dueDate') ? new Date(getValues('dueDate')).toLocaleDateString() : '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-[var(--color-text-light)]">Test Cases</p>
                                <p className="text-xs font-medium text-[var(--color-text-mid)]">{getValues('publicTests').length + getValues('privateTests').length}</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowPublishDialog(false)}>Cancel</Button>
                        <Button
                            onClick={() => {
                                // Validate due date is set before publishing
                                if (!getValues('dueDate')) {
                                    setShowPublishDialog(false);
                                    setCurrentStep(0); // Go back to Basic Info step
                                    toast.error('Due date is required to publish an assignment.');
                                    return;
                                }
                                setShowPublishDialog(false);
                                handleSubmit(
                                    (data) => onPublish(data, { descriptionPdfFile }),
                                    () => {
                                        focusFirstValidationStep();
                                        toast.error('Please fix validation errors before publishing.');
                                    }
                                )();
                            }}
                            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
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
                <p className="text-sm font-semibold text-[var(--color-text-dark)] dark:text-gray-100">{label}</p>
                <p className="text-xs text-[var(--color-text-mid)] mt-0.5">{description}</p>
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
