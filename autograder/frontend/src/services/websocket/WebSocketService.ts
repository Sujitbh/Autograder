/* ═══════════════════════════════════════════════════════════════════
   WebSocketService — Socket.IO client wrapper with auto-reconnect,
   JWT auth, and typed event handling.
   ═══════════════════════════════════════════════════════════════════ */

import { io, Socket } from 'socket.io-client';
import { config } from '@/config/env';

// ── Event types ─────────────────────────────────────────────────────

export interface SubmissionEvent {
    submissionId: string;
    assignmentId: string;
    studentId: string;
    studentName: string;
    courseId: string;
    submittedAt: string;
}

export interface GradeUpdatedEvent {
    submissionId: string;
    assignmentId: string;
    studentId: string;
    courseId: string;
    score: number;
    maxScore: number;
    gradedBy: string;
}

export interface AssignmentCreatedEvent {
    assignmentId: string;
    courseId: string;
    title: string;
    dueDate: string;
}

export type WsEventMap = {
    'submission:new': SubmissionEvent;
    'grade:updated': GradeUpdatedEvent;
    'assignment:created': AssignmentCreatedEvent;
    'user:connected': { userId: string };
    'user:disconnected': { userId: string };
    'error': { message: string; code?: string };
};

export type WsEventName = keyof WsEventMap;

// ── Listener type helper ────────────────────────────────────────────

type Listener<T> = (data: T) => void;

// ── WebSocket Service ───────────────────────────────────────────────

class WebSocketService {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 10;
    private readonly baseDelay = 1000; // ms
    private listeners = new Map<string, Set<Listener<unknown>>>();

    /** True when the underlying socket is connected. */
    get connected(): boolean {
        return this.socket?.connected ?? false;
    }

    /** Connect to the server. Idempotent — does nothing if already connected. */
    connect(token?: string): void {
        if (this.socket?.connected) return;

        const authToken = token ?? (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

        this.socket = io(config.wsUrl, {
            auth: authToken ? { token: authToken } : undefined,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.baseDelay,
            reconnectionDelayMax: 30_000,
        });

        this.setupInternalListeners();
    }

    /** Disconnect and clean up. */
    disconnect(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
        this.reconnectAttempts = 0;
    }

    /** Subscribe to a typed event. Returns an unsubscribe function. */
    on<E extends WsEventName>(event: E, callback: Listener<WsEventMap[E]>): () => void {
        if (!this.listeners.has(event)) this.listeners.set(event, new Set());
        const bag = this.listeners.get(event)!;
        bag.add(callback as Listener<unknown>);

        // Also attach to the live socket if connected
        this.socket?.on(event, callback as never);

        return () => {
            bag.delete(callback as Listener<unknown>);
            this.socket?.off(event, callback as never);
        };
    }

    /** Emit an event to the server. */
    emit<E extends WsEventName>(event: E, data: WsEventMap[E]): void {
        this.socket?.emit(event, data);
    }

    /** Join a room (e.g. a course channel). */
    joinRoom(room: string): void {
        this.socket?.emit('room:join', { room });
    }

    /** Leave a room. */
    leaveRoom(room: string): void {
        this.socket?.emit('room:leave', { room });
    }

    // ── Internal event wiring ──────────────────────────────────−

    private setupInternalListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            this.reconnectAttempts = 0;
            console.info('[WS] connected', this.socket?.id);

            // Re-attach user listeners that were registered before connection
            this.listeners.forEach((callbacks, event) => {
                callbacks.forEach((cb) => {
                    this.socket?.on(event, cb as never);
                });
            });
        });

        this.socket.on('disconnect', (reason) => {
            console.warn('[WS] disconnected:', reason);
        });

        this.socket.on('connect_error', (err) => {
            this.reconnectAttempts += 1;
            const delay = Math.min(this.baseDelay * 2 ** this.reconnectAttempts, 30_000);
            console.warn(
                `[WS] connect error (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}):`,
                err.message,
                `— retrying in ${delay}ms`
            );
        });
    }
}

// Singleton export
export const wsService = new WebSocketService();
