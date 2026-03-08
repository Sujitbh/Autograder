/* ═══════════════════════════════════════════════════════════════════
   Assignment Service — CRUD + test-case management
   ═══════════════════════════════════════════════════════════════════ */

import api, { withRetry } from './client';
import type {
    Assignment,
    CreateAssignmentDto,
    UpdateAssignmentDto,
} from '@/types';

/** Shape returned by the FastAPI backend for an assignment */
interface BackendAssignment {
    id: number;
    title: string;
    description: string | null;
    course_id: number | null;
    created_by: number | null;
    due_date: string | null;
    max_submissions: number | null;
    max_points: number | null;
    allowed_languages: string | null;
    starter_code: string | null;
    status: string;
    is_active: boolean;
    created_at: string;
    updated_at?: string | null;
    rubrics?: Array<{
        id: number;
        name: string;
        description: string | null;
        max_points: number | null;
    }>;
}

/** Map a backend assignment to the frontend Assignment type */
function mapAssignment(a: BackendAssignment): Assignment {
    return {
        id: String(a.id),
        courseId: String(a.course_id ?? ''),
        name: a.title,
        shortName: a.title.slice(0, 20),
        description: a.description ?? '',
        language: (a.allowed_languages?.split(',')[0] as 'python' | 'java') ?? 'python',
        category: 'Homework',
        dueDate: a.due_date ?? '',
        starterCode: a.starter_code ?? undefined,
        maxPoints: a.max_points ?? 100,
        status: (a.status as 'draft' | 'published' | 'closed') ?? (a.is_active ? 'published' : 'draft'),
        isGroup: false,
        allowLateSubmissions: false,
        publicTests: [],
        privateTests: [],
        rubric: (a.rubrics ?? []).map((r) => ({
            id: String(r.id),
            name: r.name,
            description: r.description ?? '',
            maxPoints: r.max_points ?? 0,
            gradingMethod: 'manual' as const,
        })),
        createdAt: a.created_at ?? '',
        updatedAt: a.updated_at ?? '',
    };
}

export const assignmentService = {
    /** List all assignments (optionally filtered by course). */
    async getAssignments(courseId?: string): Promise<Assignment[]> {
        // Backend uses /assignments/ with optional course filtering
        const url = courseId
            ? `/assignments/?course_id=${courseId}`
            : '/assignments/';

        const { data } = await withRetry(() =>
            api.get<BackendAssignment[]>(url)
        );
        return data.map(mapAssignment);
    },

    /** Get all assignments for a course (alias for getAssignments for convenience). */
    async getCourseAssignments(courseId: string): Promise<Assignment[]> {
        return this.getAssignments(courseId);
    },

    /** Get a single assignment by ID. */
    async getAssignment(_courseId: string, assignmentId: string): Promise<Assignment> {
        const { data } = await withRetry(() =>
            api.get<BackendAssignment>(`/assignments/${assignmentId}`)
        );
        return mapAssignment(data);
    },

    /** Create a new assignment (draft or published). */
    async createAssignment(dto: CreateAssignmentDto & { status?: string }): Promise<Assignment> {
        const payload: Record<string, unknown> = {
            title: dto.name ?? (dto as any).title ?? 'Untitled',
            description: dto.description ?? '',
            course_id: Number(dto.courseId) || null,
            allowed_languages: dto.language ?? 'python',
            max_points: dto.maxPoints ?? 100,
            max_submissions: (dto as any).maxSubmissions ?? null,
            status: dto.status ?? 'published',
        };
        // Include starter code when provided
        if (dto.starterCode) {
            payload.starter_code = dto.starterCode;
        }
        // Convert dueDate string to ISO datetime for the backend
        if (dto.dueDate) {
            payload.due_date = new Date(dto.dueDate).toISOString();
        }

        // Send test cases when provided
        if (dto.publicTests && dto.publicTests.length > 0) {
            payload.public_tests = dto.publicTests.map(t => ({
                name: t.name,
                input: t.input,
                expectedOutput: t.expectedOutput,
                isPublic: true,
                points: t.points,
            }));
        }
        if (dto.privateTests && dto.privateTests.length > 0) {
            payload.private_tests = dto.privateTests.map(t => ({
                name: t.name,
                input: t.input,
                expectedOutput: t.expectedOutput,
                isPublic: false,
                points: t.points,
            }));
        }

        // Send rubric when provided
        if (dto.rubric && dto.rubric.length > 0) {
            payload.rubric = dto.rubric.map(r => ({
                name: r.name,
                description: r.description,
                maxPoints: r.maxPoints,
                gradingMethod: r.gradingMethod,
            }));
        }

        const { data } = await api.post<BackendAssignment>('/assignments/', payload);
        return mapAssignment(data);
    },

    /** Update an existing assignment. */
    async updateAssignment(
        _courseId: string,
        assignmentId: string,
        dto: UpdateAssignmentDto
    ): Promise<Assignment> {
        const { data } = await api.put<BackendAssignment>(
            `/assignments/${assignmentId}`,
            dto
        );
        return mapAssignment(data);
    },

    /** Delete an assignment. */
    async deleteAssignment(_courseId: string, assignmentId: string): Promise<void> {
        await api.delete(`/assignments/${assignmentId}`);
    },

    /** Publish a draft assignment (toggle is_active). */
    async publishAssignment(
        _courseId: string,
        assignmentId: string
    ): Promise<Assignment> {
        const { data } = await api.put<BackendAssignment>(
            `/assignments/${assignmentId}`,
            { is_active: true }
        );
        return mapAssignment(data);
    },
};
