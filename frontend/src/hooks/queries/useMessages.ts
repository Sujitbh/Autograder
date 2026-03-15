import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService, SendMessageDto } from '@/services/api';

export function useConversations() {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: messageService.getConversations,
    });
}

export function useThread(otherUserId: number) {
    return useQuery({
        queryKey: ['thread', otherUserId],
        queryFn: () => messageService.getThread(otherUserId),
        enabled: Boolean(otherUserId)
    });
}

export function useUnreadMessageCount() {
    return useQuery({
        queryKey: ['unread-messages'],
        queryFn: messageService.getUnreadCount,
        refetchInterval: 30000 // Poll every 30s
    });
}

export function useContacts() {
    return useQuery({
        queryKey: ['contacts'],
        queryFn: messageService.getContacts,
    });
}

export function useSendMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: SendMessageDto) => messageService.sendMessage(dto),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            queryClient.invalidateQueries({ queryKey: ['thread', data.receiver_id] });
        }
    });
}

export function useMarkThreadRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ otherUserId }: { otherUserId: number }) =>
            messageService.markThreadRead(otherUserId),
        onSuccess: (_, { otherUserId }) => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
            queryClient.invalidateQueries({ queryKey: ['thread', otherUserId] });
        }
    });
}

export function useDeleteThread() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ otherUserId }: { otherUserId: number }) =>
            messageService.deleteThread(otherUserId),
        onSuccess: (_, { otherUserId }) => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            queryClient.invalidateQueries({ queryKey: ['thread', otherUserId] });
            queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
        }
    });
}
