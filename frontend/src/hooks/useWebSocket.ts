'use client';

/* ═══════════════════════════════════════════════════════════════════
   useWebSocket — React hook wrapping the WebSocketService singleton.
   Manages connection lifecycle, event subscriptions, and optionally
   invalidates React Query caches on incoming events.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    wsService,
    type WsEventName,
    type WsEventMap,
} from '@/services/websocket/WebSocketService';

interface UseWebSocketOptions {
    /** Auto-connect on mount (default true). */
    autoConnect?: boolean;
    /** JWT token — if omitted, pulled from localStorage. */
    token?: string;
    /** Rooms (e.g. course channels) to join on connect. */
    rooms?: string[];
}

/** Map an incoming WS event to React Query cache invalidation. */
const defaultInvalidationMap: Partial<Record<WsEventName, string[][]>> = {
    'submission:new': [['submissions'], ['courses']],
    'grade:updated': [['grades'], ['submissions']],
    'assignment:created': [['assignments'], ['courses']],
};

export function useWebSocket(options: UseWebSocketOptions = {}) {
    const { autoConnect = true, token, rooms } = options;
    const queryClient = useQueryClient();
    const [connected, setConnected] = useState(wsService.connected);
    const cleanupRef = useRef<(() => void)[]>([]);

    // Connect / disconnect lifecycle
    useEffect(() => {
        if (autoConnect) {
            wsService.connect(token);
        }

        // Join rooms
        rooms?.forEach((r) => wsService.joinRoom(r));

        // Track connection state
        const unsubConnect = wsService.on('user:connected', () => setConnected(true));
        const unsubDisconnect = wsService.on('user:disconnected', () => setConnected(false));
        cleanupRef.current.push(unsubConnect, unsubDisconnect);

        return () => {
            rooms?.forEach((r) => wsService.leaveRoom(r));
            cleanupRef.current.forEach((fn) => fn());
            cleanupRef.current = [];
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoConnect, token]);

    // Default cache invalidation listeners
    useEffect(() => {
        const unsubs: (() => void)[] = [];

        (Object.entries(defaultInvalidationMap) as [WsEventName, string[][]][]).forEach(
            ([event, queryKeys]) => {
                const unsub = wsService.on(event, () => {
                    queryKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
                });
                unsubs.push(unsub);
            }
        );

        return () => unsubs.forEach((fn) => fn());
    }, [queryClient]);

    /** Subscribe to a typed event. Automatically cleaned up on unmount. */
    const subscribe = useCallback(
        <E extends WsEventName>(event: E, handler: (data: WsEventMap[E]) => void) => {
            const unsub = wsService.on(event, handler);
            cleanupRef.current.push(unsub);
            return unsub;
        },
        []
    );

    /** Emit an event to the server. */
    const emit = useCallback(
        <E extends WsEventName>(event: E, data: WsEventMap[E]) => {
            wsService.emit(event, data);
        },
        []
    );

    return { connected, subscribe, emit, wsService };
}
