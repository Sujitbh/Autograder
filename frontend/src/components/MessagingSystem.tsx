import { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Send, Plus, Users, BookOpen, AlertCircle, MessageSquare, Loader2, Link as LinkIcon, Trash2 } from 'lucide-react';
import {
    useConversations,
    useThread,
    useSendMessage,
    useMarkThreadRead,
    useDeleteThread,
    useContacts
} from '@/hooks/queries/useMessages';
import { useAuth } from '@/utils/AuthContext';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { courseService } from '@/services/api/courseService';
import { assignmentService } from '@/services/api/assignmentService';
import { Course, Assignment } from '@/types';

interface MessagingSystemProps {
    currentUserRole: 'student' | 'faculty' | 'admin' | 'ta';
}

function getInitials(name: string) {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

function getUserName(user: any): string {
    if (!user) return 'Unknown User';
    if (user.name) return user.name;
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
}

export function MessagingSystem({ currentUserRole }: MessagingSystemProps) {
    const { user: currentUser } = useAuth();
    const { data: conversations = [], isLoading: loadingConvos } = useConversations();

    const [selectedThread, setSelectedThread] = useState<number | null>(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // New Message Modal State
    const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

    // Global Contacts for New Message Dialog
    const { data: contactsData = [], isLoading: loadingContacts } = useContacts();

    const allContacts = useMemo(() => {
        return contactsData.map(c => ({
            ...c,
            role: (c as { role?: 'student' | 'faculty' | 'admin' | 'ta' }).role ?? 'student',
            initials: getInitials(c.name)
        }));
    }, [contactsData]);

    const { data: threadMessages = [], isLoading: loadingThread } = useThread(
        selectedThread || 0
    );

    const { mutate: sendMessage, isPending: isSending } = useSendMessage();
    const { mutate: markRead } = useMarkThreadRead();
    const { mutate: deleteThread, isPending: isDeleting } = useDeleteThread();

    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mark thread as read when selected
    useEffect(() => {
        if (selectedThread) {
            markRead({ otherUserId: selectedThread });
        }
    }, [selectedThread, threadMessages.length, markRead]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [threadMessages]);

    const filteredConversations = useMemo(() => {
        if (!searchQuery) return conversations;
        const q = searchQuery.toLowerCase();
        return conversations.filter(c =>
            getUserName(c.interlocutor).toLowerCase().includes(q) ||
            c.course?.code?.toLowerCase().includes(q) ||
            c.course?.name?.toLowerCase().includes(q)
        );
    }, [conversations, searchQuery]);

    const activeInterlocutor = useMemo(() => {
        if (!selectedThread) return null;
        const c = conversations.find(c => Number(c.interlocutor.id) === selectedThread);
        if (c) return c.interlocutor;

        const contact = allContacts.find(c => c.id === selectedThread);
        if (contact) {
            const role = (contact as { role?: 'student' | 'faculty' | 'admin' | 'ta' }).role ?? 'student';
            return { id: contact.id, name: contact.name, email: '', role };
        }

        return null;
    }, [selectedThread, conversations, allContacts]);

    const activeCourse = useMemo(() => {
        if (!selectedThread) return null;
        const c = conversations.find(c => Number(c.interlocutor.id) === selectedThread)?.course;
        return c || null;
    }, [selectedThread, conversations]);

    const handleSend = () => {
        if (!newMessageText.trim() || !selectedThread) return;

        sendMessage({
            content: newMessageText,
            receiver_id: selectedThread,
        }, {
            onSuccess: () => {
                setNewMessageText('');
            }
        });
    };

    return (
        <div className="flex h-[calc(100vh-120px)] border rounded-xl overflow-hidden" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>

            {/* Sidebar */}
            <div className="w-80 flex flex-col border-r" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-subtle)' }}>
                <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>Messages</h2>
                        <Button
                            size="sm"
                            className="rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-sm hover:shadow-md transition-all group border-0"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                            onClick={() => setIsNewMessageOpen(true)}
                            title="New Message"
                        >
                            <Plus className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search names or courses..."
                            className="pl-9 h-9"
                            style={{ backgroundColor: 'var(--color-surface)' }}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingConvos ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 text-sm">
                            {searchQuery ? "No conversations match your search." : "No active conversations."}
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredConversations.map((convo) => {
                                const isSelected = selectedThread === Number(convo.interlocutor.id);

                                return (
                                    <button
                                        key={convo.interlocutor.id}
                                        onClick={() => setSelectedThread(Number(convo.interlocutor.id))}
                                        className="group text-left p-4 border-b transition-colors flex items-start gap-3 w-full"
                                        style={{
                                            borderColor: 'var(--color-border)',
                                            backgroundColor: isSelected ? 'var(--color-surface)' : 'transparent',
                                            borderLeft: isSelected ? '3px solid var(--color-primary)' : '3px solid transparent'
                                        }}
                                    >
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                                style={{ backgroundColor: 'var(--color-gold-accent)' }}>
                                                {getInitials(getUserName(convo.interlocutor))}
                                            </div>
                                            {convo.unread_count > 0 && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                                                    {convo.unread_count}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text-dark)' }}>
                                                    {getUserName(convo.interlocutor)}
                                                </p>
                                                <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(Number(convo.interlocutor.id)); }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50"
                                                        title="Delete conversation"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" style={{ color: '#B91C1C' }} />
                                                    </button>
                                                    <p className="text-[11px]" style={{ color: 'var(--color-text-light)' }}>
                                                        {format(new Date(convo.last_message.created_at), 'MMM d, h:mm a')}
                                                    </p>
                                                </div>
                                            </div>
                                            {convo.course && (
                                                <p className="text-xs truncate mb-1" style={{ color: 'var(--color-text-mid)' }}>
                                                    <BookOpen className="inline w-3 h-3 mr-1 opacity-70" />
                                                    {convo.course.code || convo.course.name}
                                                </p>
                                            )}
                                            <p className={`text-sm truncate ${convo.unread_count > 0 ? 'font-medium' : ''}`} style={{ color: convo.unread_count > 0 ? 'var(--color-text-dark)' : 'var(--color-text-light)' }}>
                                                {String(convo.last_message.sender_id) === String(currentUser?.id) ? 'You: ' : ''}{convo.last_message.content}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col relative" style={{ backgroundColor: 'var(--color-surface)' }}>
                {selectedThread ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center gap-3 z-10 bg-white" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                style={{ backgroundColor: 'var(--color-gold-accent)' }}>
                                {getInitials(getUserName(activeInterlocutor))}
                            </div>
                            <div>
                                <h3 className="font-semibold" style={{ color: 'var(--color-text-dark)' }}>{getUserName(activeInterlocutor)}</h3>
                                <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-mid)' }}>
                                    {activeInterlocutor?.role === 'faculty' && <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">Instructor</span>}
                                    {activeInterlocutor?.role === 'ta' && <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">TA</span>}
                                    {activeCourse?.name}{activeCourse?.code ? ` (${activeCourse.code})` : ''}
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loadingThread ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : threadMessages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                    <MessageSquare className="w-12 h-12 mb-4 text-gray-400" />
                                    <p>Send a message to start the conversation.</p>
                                </div>
                            ) : (
                                threadMessages.map((msg, i) => {
                                    const isMe = String(msg.sender_id) === String(currentUser?.id);
                                    const showTime = i === 0 || new Date(msg.created_at).getTime() - new Date(threadMessages[i - 1].created_at).getTime() > 1000 * 60 * 15; // 15 min gap

                                    return (
                                        <div key={msg.id} className="flex flex-col">
                                            {showTime && (
                                                <div className="text-center my-4">
                                                    <span className="text-[11px] px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--color-surface-subtle)', color: 'var(--color-text-light)' }}>
                                                        {format(new Date(msg.created_at), 'MMMM d, h:mm a')}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`flex max-w-[75%] ${isMe ? 'self-end' : 'self-start'}`}>
                                                {!isMe && (
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mr-2 self-end mb-4"
                                                        style={{ backgroundColor: 'var(--color-gold-accent)' }}>
                                                        {getInitials(getUserName(msg.sender))}
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-1 items-start">
                                                    {msg.assignment_id && (
                                                        <div className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md mb-1 w-full"
                                                            style={{
                                                                backgroundColor: isMe ? 'rgba(255,255,255,0.2)' : 'var(--color-surface-subtle)',
                                                                color: isMe ? 'white' : 'var(--color-text-mid)',
                                                                border: isMe ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--color-border)'
                                                            }}>
                                                            <LinkIcon className="w-3 h-3" />
                                                            <span className="truncate">Regarding Assignment #{msg.assignment_id}</span>
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`px-4 py-2.5 rounded-2xl ${isMe ? 'rounded-tr-sm text-white' : 'rounded-tl-sm'
                                                            }`}
                                                        style={{
                                                            backgroundColor: isMe ? 'var(--color-primary)' : 'var(--color-surface-subtle)',
                                                            color: isMe ? '#FFFFFF' : 'var(--color-text-dark)',
                                                            border: isMe ? 'none' : '1px solid var(--color-border)'
                                                        }}
                                                    >
                                                        <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed">{msg.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t bg-white" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="flex gap-2 items-end relative">
                                <textarea
                                    className="flex-1 border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2"
                                    style={{
                                        borderColor: 'var(--color-border)',
                                        backgroundColor: 'var(--color-surface-subtle)',
                                        color: 'var(--color-text-dark)',
                                        minHeight: '44px',
                                        maxHeight: '120px'
                                    }}
                                    rows={1}
                                    placeholder="Type a message..."
                                    value={newMessageText}
                                    onChange={(e) => {
                                        setNewMessageText(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = (e.target.scrollHeight) + 'px';
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!newMessageText.trim() || isSending}
                                    className="rounded-full w-11 h-11 p-0 flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95 shadow-md border-0"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Send className="w-5 h-5 text-white ml-1" />}
                                </Button>
                            </div>
                            <div className="mt-2 text-[11px] text-right" style={{ color: 'var(--color-text-light)' }}>
                                Press Enter to send, Shift + Enter for new line
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--color-surface-subtle)' }}>
                            <MessageSquare style={{ width: '32px', height: '32px', color: 'var(--color-primary)' }} />
                        </div>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>Your Messages</h2>
                        <p className="max-w-md" style={{ color: 'var(--color-text-mid)' }}>
                            Select a conversation from the sidebar to view history, or start a new message to a classmate or instructor.
                        </p>
                        <Button
                            className="mt-6 px-6 shadow-md hover:shadow-lg transition-all border-0 text-white"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                            onClick={() => setIsNewMessageOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            <span className="font-medium">Start New Message</span>
                        </Button>
                    </div>
                )}
            </div>

            {/* New Message Dialog */}
            <NewMessageDialog
                open={isNewMessageOpen}
                onOpenChange={setIsNewMessageOpen}
                allContacts={allContacts}
                onSelectUser={(userId) => {
                    setSelectedThread(userId);
                    setIsNewMessageOpen(false);
                }}
            />

            {/* Delete Conversation Confirmation Dialog */}
            <Dialog open={deleteConfirmId !== null} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
                <DialogContent className="max-w-[400px] p-6" style={{ borderRadius: '16px' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '18px', fontWeight: 700, color: '#B91C1C' }}>
                            Delete Conversation?
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '14px', color: '#595959', marginTop: '8px' }}>
                            This will permanently delete all messages in this conversation. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6 flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 border-0 text-white"
                            style={{ backgroundColor: '#B91C1C' }}
                            disabled={isDeleting}
                            onClick={() => {
                                if (deleteConfirmId === null) return;
                                deleteThread({ otherUserId: deleteConfirmId }, {
                                    onSuccess: () => {
                                        if (selectedThread === deleteConfirmId) setSelectedThread(null);
                                        setDeleteConfirmId(null);
                                    }
                                });
                            }}
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// -------------------------------------------------------------
// New Message Dialog Component
// -------------------------------------------------------------
function NewMessageDialog({ open, onOpenChange, allContacts, onSelectUser }: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    allContacts: { id: number, name: string, role: string }[],
    onSelectUser: (userId: number) => void
}) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);

    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [selectedCourseId, setSelectedCourseId] = useState<string>('none');
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('none');

    const [loadingCourses, setLoadingCourses] = useState(false);

    const { mutate: sendMessage, isPending: isSending } = useSendMessage();
    const [msgText, setMsgText] = useState('');

    useEffect(() => {
        if (open) {
            setLoadingCourses(true);
            courseService.getCourses().then(res => {
                setCourses(res);
                setLoadingCourses(false);
            }).catch(() => setLoadingCourses(false));

            // Reset state
            setSelectedUserId('');
            setSelectedCourseId('none');
            setSelectedAssignmentId('none');
            setMsgText('');
        }
    }, [open]);

    useEffect(() => {
        if (selectedCourseId && selectedCourseId !== 'none') {
            assignmentService.getCourseAssignments(selectedCourseId).then(res => {
                setAssignments(res);
            }).catch(console.error);
        } else {
            setAssignments([]);
            setSelectedAssignmentId('none');
        }
    }, [selectedCourseId]);

    const handleSend = () => {
        if (!selectedUserId || !msgText.trim()) return;

        const cId = selectedCourseId !== 'none' ? Number(selectedCourseId) : undefined;
        const aId = selectedAssignmentId !== 'none' ? Number(selectedAssignmentId) : undefined;

        sendMessage({
            content: msgText,
            receiver_id: Number(selectedUserId),
            course_id: cId,
            assignment_id: aId
        }, {
            onSuccess: () => {
                setMsgText('');
                // Switch to that thread
                onSelectUser(Number(selectedUserId));
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                    <DialogDescription>Start a conversation with a classmate or instructor.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Recipient <span className="text-red-500">*</span></label>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a person" />
                            </SelectTrigger>
                            <SelectContent>
                                {allContacts.map(u => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {u.name}
                                    </SelectItem>
                                ))}
                                {allContacts.length === 0 && (
                                    <SelectItem value="none" disabled>No contacts found via enrollments</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium">Message <span className="text-red-500">*</span></label>
                        <textarea
                            className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1"
                            style={{ borderColor: 'var(--color-border)' }}
                            rows={4}
                            placeholder="Type your message..."
                            value={msgText}
                            onChange={e => setMsgText(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        className="shadow-sm hover:shadow-md transition-all border-0 text-white"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                        onClick={handleSend}
                        disabled={!selectedUserId || !msgText.trim() || isSending}
                    >
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        Send Message
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
