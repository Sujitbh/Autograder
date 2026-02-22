import { useState, useEffect, useRef } from 'react';
import {
    StickyNote, Plus, Trash2, Check, X, GripVertical,
    ChevronDown, ChevronRight, Pencil, Clock, Pin, PinOff,
    CheckSquare, Square, ListTodo, FileText,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
}

interface NoteItem {
    id: string;
    title: string;
    content: string;
    pinned: boolean;
    color: string;
    createdAt: string;
    updatedAt: string;
}

type TabId = 'notes' | 'todos';

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

const NOTE_COLORS = [
    { value: 'default', bg: 'var(--color-surface)', label: 'Default' },
    { value: 'yellow', bg: '#FEF9C3', label: 'Yellow' },
    { value: 'green', bg: '#DCFCE7', label: 'Green' },
    { value: 'blue', bg: '#DBEAFE', label: 'Blue' },
    { value: 'pink', bg: '#FCE7F3', label: 'Pink' },
    { value: 'purple', bg: '#F3E8FF', label: 'Purple' },
];

function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadTodos(): TodoItem[] {
    try {
        const stored = localStorage.getItem('autograde_faculty_todos');
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [
        { id: 'demo-1', text: 'Grade CS-1001 Assignment 3 submissions', completed: false, createdAt: '2026-02-19T10:00:00' },
        { id: 'demo-2', text: 'Prepare midterm exam questions', completed: false, createdAt: '2026-02-18T14:00:00' },
        { id: 'demo-3', text: 'Review late submissions for CS-2050', completed: true, createdAt: '2026-02-17T09:00:00' },
        { id: 'demo-4', text: 'Update rubric for Functions assignment', completed: false, createdAt: '2026-02-16T11:00:00' },
    ];
}

function saveTodos(todos: TodoItem[]) {
    localStorage.setItem('autograde_faculty_todos', JSON.stringify(todos));
}

function loadNotes(): NoteItem[] {
    try {
        const stored = localStorage.getItem('autograde_faculty_notes');
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [
        {
            id: 'demo-n1', title: 'Office Hours Reminder',
            content: 'Move Wednesday office hours to 3-5 PM starting next week. Email students about the change.',
            pinned: true, color: 'yellow',
            createdAt: '2026-02-18T10:00:00', updatedAt: '2026-02-18T10:00:00',
        },
        {
            id: 'demo-n2', title: 'CS-3100 Project Ideas',
            content: '- REST API with authentication\n- Real-time chat app\n- Task management dashboard\n- E-commerce prototype',
            pinned: false, color: 'blue',
            createdAt: '2026-02-15T14:00:00', updatedAt: '2026-02-17T09:00:00',
        },
        {
            id: 'demo-n3', title: 'Grading Criteria Updates',
            content: 'Consider adding code style/formatting as 10% of grade for all future assignments. Discuss with department.',
            pinned: false, color: 'default',
            createdAt: '2026-02-14T11:00:00', updatedAt: '2026-02-14T11:00:00',
        },
    ];
}

function saveNotes(notes: NoteItem[]) {
    localStorage.setItem('autograde_faculty_notes', JSON.stringify(notes));
}

function formatRelativeDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getColorBg(color: string) {
    return NOTE_COLORS.find(c => c.value === color)?.bg ?? 'var(--color-surface)';
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

interface NotesPanelProps {
    open: boolean;
    onClose: () => void;
}

export function NotesPanel({ open, onClose }: NotesPanelProps) {
    const [activeTab, setActiveTab] = useState<TabId>('todos');

    /* ── Todos state ── */
    const [todos, setTodos] = useState<TodoItem[]>(loadTodos);
    const [newTodoText, setNewTodoText] = useState('');
    const [showCompleted, setShowCompleted] = useState(true);
    const todoInputRef = useRef<HTMLInputElement>(null);

    /* ── Notes state ── */
    const [notes, setNotes] = useState<NoteItem[]>(loadNotes);
    const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [noteColor, setNoteColor] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');

    /* ── Persist ── */
    useEffect(() => { saveTodos(todos); }, [todos]);
    useEffect(() => { saveNotes(notes); }, [notes]);

    /* ── Focus input on tab switch ── */
    useEffect(() => {
        if (open && activeTab === 'todos') {
            setTimeout(() => todoInputRef.current?.focus(), 100);
        }
    }, [open, activeTab]);

    /* ═══════════════════════════════════════════
       TODO HANDLERS
       ═══════════════════════════════════════════ */

    const addTodo = () => {
        const text = newTodoText.trim();
        if (!text) return;
        setTodos(prev => [{
            id: generateId(), text, completed: false, createdAt: new Date().toISOString(),
        }, ...prev]);
        setNewTodoText('');
        todoInputRef.current?.focus();
    };

    const toggleTodo = (id: string) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id: string) => {
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    const clearCompleted = () => {
        setTodos(prev => prev.filter(t => !t.completed));
    };

    const activeTodos = todos.filter(t => !t.completed);
    const completedTodos = todos.filter(t => t.completed);

    /* ═══════════════════════════════════════════
       NOTE HANDLERS
       ═══════════════════════════════════════════ */

    const startNewNote = () => {
        setEditingNote({ id: '', title: '', content: '', pinned: false, color: 'default', createdAt: '', updatedAt: '' });
        setNoteTitle('');
        setNoteContent('');
        setNoteColor('default');
    };

    const startEditNote = (note: NoteItem) => {
        setEditingNote(note);
        setNoteTitle(note.title);
        setNoteContent(note.content);
        setNoteColor(note.color);
    };

    const saveNote = () => {
        if (!noteTitle.trim() && !noteContent.trim()) { cancelEdit(); return; }
        const now = new Date().toISOString();
        if (editingNote && editingNote.id) {
            // Update existing
            setNotes(prev => prev.map(n => n.id === editingNote.id ? {
                ...n, title: noteTitle.trim(), content: noteContent.trim(), color: noteColor, updatedAt: now,
            } : n));
        } else {
            // New note
            setNotes(prev => [{
                id: generateId(), title: noteTitle.trim(), content: noteContent.trim(),
                pinned: false, color: noteColor, createdAt: now, updatedAt: now,
            }, ...prev]);
        }
        cancelEdit();
    };

    const cancelEdit = () => {
        setEditingNote(null);
        setNoteTitle('');
        setNoteContent('');
        setNoteColor('default');
    };

    const deleteNote = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (editingNote?.id === id) cancelEdit();
    };

    const togglePin = (id: string) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const pinnedNotes = filteredNotes.filter(n => n.pinned);
    const unpinnedNotes = filteredNotes.filter(n => !n.pinned);

    /* ═══════════════════════════════════════════
       RENDER
       ═══════════════════════════════════════════ */

    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 transition-opacity"
                    style={{ backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 1050 }}
                    onClick={onClose}
                />
            )}

            {/* Panel */}
            <div
                className="fixed top-0 right-0 h-full flex flex-col transition-transform duration-300 ease-in-out"
                style={{
                    width: '380px',
                    backgroundColor: 'var(--color-surface)',
                    borderLeft: '1px solid var(--color-border)',
                    boxShadow: open ? '-8px 0 24px rgba(0,0,0,0.12)' : 'none',
                    zIndex: 1060,
                    transform: open ? 'translateX(0)' : 'translateX(100%)',
                }}
            >
                {/* ── Header ── */}
                <div
                    className="flex items-center justify-between flex-shrink-0"
                    style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-primary)',
                    }}
                >
                    <div className="flex items-center gap-2">
                        <StickyNote className="w-5 h-5 text-white" />
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>My Notes & Todos</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:opacity-80 transition-opacity"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
                        aria-label="Close notes panel"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Tabs ── */}
                <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {([
                        { id: 'todos' as TabId, label: 'Todos', icon: ListTodo, count: activeTodos.length },
                        { id: 'notes' as TabId, label: 'Notes', icon: FileText, count: notes.length },
                    ]).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex-1 flex items-center justify-center gap-2 transition-colors"
                            style={{
                                padding: '12px 0',
                                fontSize: '13px',
                                fontWeight: activeTab === tab.id ? 700 : 500,
                                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-mid)',
                                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                borderBottomWidth: '2px',
                                borderBottomStyle: 'solid',
                                borderBottomColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                            }}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            <span
                                className="rounded-full"
                                style={{
                                    fontSize: '11px', fontWeight: 700,
                                    padding: '1px 7px',
                                    backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
                                    color: activeTab === tab.id ? 'white' : 'var(--color-text-mid)',
                                }}
                            >{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* ── Content ── */}
                <div className="flex-1 overflow-y-auto" style={{ padding: '16px' }}>
                    {activeTab === 'todos' ? renderTodosTab() : renderNotesTab()}
                </div>
            </div>
        </>
    );

    /* ═══════════════════════════════════════════
       TODOS TAB
       ═══════════════════════════════════════════ */

    function renderTodosTab() {
        return (
            <div>
                {/* Add Todo Input */}
                <div className="flex gap-2 mb-4">
                    <Input
                        ref={todoInputRef}
                        value={newTodoText}
                        onChange={e => setNewTodoText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTodo()}
                        placeholder="Add a new task..."
                        style={{ fontSize: '13px' }}
                    />
                    <Button
                        onClick={addTodo}
                        disabled={!newTodoText.trim()}
                        size="sm"
                        className="flex-shrink-0 text-white"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Active Todos */}
                {activeTodos.length === 0 && completedTodos.length === 0 && (
                    <div className="text-center py-8">
                        <ListTodo className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-text-light)', opacity: 0.5 }} />
                        <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', fontWeight: 500 }}>No tasks yet</p>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>Add your first task above</p>
                    </div>
                )}

                <div className="space-y-1">
                    {activeTodos.map(todo => (
                        <div
                            key={todo.id}
                            className="group flex items-start gap-2.5 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                            style={{ padding: '8px 10px' }}
                        >
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0 0 0', flexShrink: 0 }}
                            >
                                <Square className="w-[18px] h-[18px]" style={{ color: 'var(--color-primary)' }} />
                            </button>
                            <div className="flex-1 min-w-0">
                                <p style={{ fontSize: '13px', color: 'var(--color-text-dark)', lineHeight: '1.4', wordBreak: 'break-word' }}>{todo.text}</p>
                                <p style={{ fontSize: '11px', color: 'var(--color-text-light)', marginTop: '2px' }}>
                                    <Clock className="inline w-3 h-3 mr-1" style={{ verticalAlign: 'text-bottom' }} />
                                    {formatRelativeDate(todo.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                                aria-label="Delete todo"
                            >
                                <Trash2 className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Completed Section */}
                {completedTodos.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                        <button
                            onClick={() => setShowCompleted(!showCompleted)}
                            className="flex items-center gap-2 w-full mb-2"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
                        >
                            {showCompleted ? <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} /> : <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />}
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Completed ({completedTodos.length})
                            </span>
                        </button>

                        {showCompleted && (
                            <div className="space-y-1">
                                {completedTodos.map(todo => (
                                    <div
                                        key={todo.id}
                                        className="group flex items-start gap-2.5 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                                        style={{ padding: '8px 10px', opacity: 0.6 }}
                                    >
                                        <button
                                            onClick={() => toggleTodo(todo.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0 0 0', flexShrink: 0 }}
                                        >
                                            <CheckSquare className="w-[18px] h-[18px]" style={{ color: '#2D6A2D' }} />
                                        </button>
                                        <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', lineHeight: '1.4', textDecoration: 'line-through', flex: 1, wordBreak: 'break-word' }}>{todo.text}</p>
                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                                            aria-label="Delete todo"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={clearCompleted}
                                    style={{ fontSize: '12px', color: '#8B0000', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', marginTop: '4px' }}
                                >
                                    Clear completed
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Progress */}
                {todos.length > 0 && (
                    <div style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-elevated)' }}>
                        <div className="flex items-center justify-between mb-2">
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mid)' }}>Progress</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                                {completedTodos.length}/{todos.length}
                            </span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--color-border)' }}>
                            <div
                                style={{
                                    height: '100%', borderRadius: '3px',
                                    backgroundColor: 'var(--color-primary)',
                                    width: `${todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0}%`,
                                    transition: 'width 0.3s ease',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    /* ═══════════════════════════════════════════
       NOTES TAB
       ═══════════════════════════════════════════ */

    function renderNotesTab() {
        // Edit / New note view
        if (editingNote) {
            return (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                            {editingNote.id ? 'Edit Note' : 'New Note'}
                        </h3>
                        <button onClick={cancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        <Input
                            value={noteTitle}
                            onChange={e => setNoteTitle(e.target.value)}
                            placeholder="Note title..."
                            style={{ fontSize: '14px', fontWeight: 600 }}
                            autoFocus
                        />
                        <Textarea
                            value={noteContent}
                            onChange={e => setNoteContent(e.target.value)}
                            placeholder="Write your note..."
                            rows={8}
                            style={{ fontSize: '13px', resize: 'vertical' }}
                        />
                        {/* Color picker */}
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '8px' }}>Color</p>
                            <div className="flex gap-2">
                                {NOTE_COLORS.map(c => (
                                    <button
                                        key={c.value}
                                        onClick={() => setNoteColor(c.value)}
                                        className="rounded-full transition-all"
                                        style={{
                                            width: '28px', height: '28px',
                                            backgroundColor: c.bg,
                                            border: noteColor === c.value ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                                            cursor: 'pointer',
                                            boxShadow: noteColor === c.value ? '0 0 0 2px rgba(107,0,0,0.2)' : 'none',
                                        }}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                            <Button onClick={saveNote} className="flex-1 text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                                <Check className="w-4 h-4 mr-1" />Save Note
                            </Button>
                            <Button onClick={cancelEdit} variant="outline" className="flex-1">Cancel</Button>
                        </div>
                    </div>
                </div>
            );
        }

        // Notes list view
        return (
            <div>
                {/* Search + Add */}
                <div className="flex gap-2 mb-4">
                    <Input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search notes..."
                        style={{ fontSize: '13px' }}
                    />
                    <Button
                        onClick={startNewNote}
                        size="sm"
                        className="flex-shrink-0 text-white"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {filteredNotes.length === 0 && (
                    <div className="text-center py-8">
                        <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-text-light)', opacity: 0.5 }} />
                        <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', fontWeight: 500 }}>
                            {searchQuery ? 'No notes match your search' : 'No notes yet'}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                            {searchQuery ? 'Try a different search term' : 'Create your first note above'}
                        </p>
                    </div>
                )}

                {/* Pinned Notes */}
                {pinnedNotes.length > 0 && (
                    <div className="mb-4">
                        <p className="flex items-center gap-1.5 mb-2" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <Pin className="w-3 h-3" />Pinned
                        </p>
                        <div className="space-y-2">
                            {pinnedNotes.map(note => renderNoteCard(note))}
                        </div>
                    </div>
                )}

                {/* Other Notes */}
                {unpinnedNotes.length > 0 && (
                    <div>
                        {pinnedNotes.length > 0 && (
                            <p className="mb-2" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Others
                            </p>
                        )}
                        <div className="space-y-2">
                            {unpinnedNotes.map(note => renderNoteCard(note))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    function renderNoteCard(note: NoteItem) {
        return (
            <div
                key={note.id}
                className="group rounded-lg cursor-pointer transition-shadow hover:shadow-md"
                style={{
                    padding: '12px 14px',
                    backgroundColor: getColorBg(note.color),
                    border: '1px solid var(--color-border)',
                }}
                onClick={() => startEditNote(note)}
            >
                <div className="flex items-start justify-between mb-1">
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-dark)', flex: 1, lineHeight: '1.3' }}>
                        {note.title || 'Untitled Note'}
                    </h4>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={e => { e.stopPropagation(); togglePin(note.id); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                            title={note.pinned ? 'Unpin' : 'Pin'}
                        >
                            {note.pinned ? <PinOff className="w-3.5 h-3.5" style={{ color: 'var(--color-text-mid)' }} /> : <Pin className="w-3.5 h-3.5" style={{ color: 'var(--color-text-mid)' }} />}
                        </button>
                        <button
                            onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                            title="Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
                        </button>
                    </div>
                </div>
                {note.content && (
                    <p style={{
                        fontSize: '12px', color: 'var(--color-text-mid)', lineHeight: '1.5',
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'pre-wrap',
                    }}>
                        {note.content}
                    </p>
                )}
                <p style={{ fontSize: '11px', color: 'var(--color-text-light)', marginTop: '6px' }}>
                    {formatRelativeDate(note.updatedAt)}
                </p>
            </div>
        );
    }
}
