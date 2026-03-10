import api, { withRetry } from './client';
import type { User, Course } from '@/types';

export interface Message {
    id: number;
    content: string;
    sender_id: number;
    receiver_id: number;
    course_id?: number | null;
    assignment_id?: number | null;
    is_read: boolean;
    created_at: string;
    updated_at: string;
    sender?: User;
    receiver?: User;
}

export interface ConversationThread {
    interlocutor: User;
    course?: Course;
    last_message: Message;
    unread_count: number;
}

export interface SendMessageDto {
    content: string;
    receiver_id: number;
    course_id?: number;
    assignment_id?: number;
}

export const messageService = {
    /** Send a new message */
    async sendMessage(dto: SendMessageDto): Promise<Message> {
        const { data } = await api.post<Message>('/messages/send', dto);
        return data;
    },

    /** Get all active conversation threads */
    async getConversations(): Promise<ConversationThread[]> {
        const { data } = await withRetry(() =>
            api.get<ConversationThread[]>('/messages/conversations')
        );
        return data;
    },

    /** Get full thread history with a specific user */
    async getThread(otherUserId: number): Promise<Message[]> {
        const { data } = await withRetry(() =>
            api.get<Message[]>(`/messages/thread/${otherUserId}`)
        );
        return data;
    },

    /** Mark a thread as read */
    async markThreadRead(otherUserId: number): Promise<void> {
        await api.post(`/messages/mark-read`, null, {
            params: {
                other_user_id: otherUserId
            }
        });
    },

    /** Get unread message count for badge */
    async getUnreadCount(): Promise<number> {
        const { data } = await api.get<{ count: number }>('/messages/unread-count');
        return data.count;
    },

    /** Get messageable contacts */
    async getContacts(): Promise<{ id: number; name: string; email: string }[]> {
        const { data } = await withRetry(() =>
            api.get<{ id: number; name: string; email: string }[]>('/messages/contacts')
        );
        return data;
    },

    /** Delete all messages in a thread with another user */
    async deleteThread(otherUserId: number): Promise<void> {
        await api.delete(`/messages/thread/${otherUserId}`);
    }
};
