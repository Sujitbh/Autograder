import { useState, useMemo } from 'react';
import {
    Plus, Users, Search, Edit, Trash2, UserPlus, UserMinus,
    ChevronDown, ChevronUp, Shuffle, AlertTriangle, Check,
    ArrowDownAZ, Dices, X, UserCheck,
} from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Sidebar } from './Sidebar';
import { useParams } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from './ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { getStudentsForCourse } from '../utils/studentData';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface Student {
    id: string;
    name: string;
    studentId: string;
    email: string;
}

interface Group {
    id: string;
    name: string;
    members: Student[];
    maxSize: number;
    createdAt: string;
}

/* ═══════════════════════════════════════════
   Constants & helpers
   ═══════════════════════════════════════════ */

const GROUP_NAMES = [
    'Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon',
    'Team Zeta', 'Team Eta', 'Team Theta', 'Team Iota', 'Team Kappa',
    'Team Lambda', 'Team Mu', 'Team Nu', 'Team Xi', 'Team Omicron',
    'Team Pi', 'Team Rho', 'Team Sigma', 'Team Tau', 'Team Upsilon',
    'Team Phi', 'Team Chi', 'Team Psi', 'Team Omega',
];

function getGroupStudents(courseId: string): Student[] {
    const shared = getStudentsForCourse(courseId);
    return shared.map(s => ({
        id: s.id,
        name: s.name,
        studentId: s.studentId,
        email: s.email,
    }));
}

function buildMockGroups(students: Student[]): Group[] {
    const groups: Group[] = [];
    const groupSize = 4;
    const numGroups = Math.min(Math.ceil(students.length / groupSize), GROUP_NAMES.length);
    for (let i = 0; i < numGroups; i++) {
        const members = students.slice(i * groupSize, (i + 1) * groupSize);
        if (members.length === 0) break;
        groups.push({
            id: `g${i + 1}`,
            name: GROUP_NAMES[i],
            members,
            maxSize: groupSize,
            createdAt: '2026-02-10',
        });
    }
    return groups;
}

function lookupCourseCode(id: string) {
    try { const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]'); const f = s.find((c: any) => c.id === id); if (f) return f.code; } catch { } return id;
}

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function nextGroupId(groups: Group[]): string {
    const nums = groups.map(g => parseInt(g.id.replace('g', ''), 10)).filter(n => !isNaN(n));
    return `g${Math.max(0, ...nums) + 1}`;
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export function GroupsPage() {
    const { courseId } = useParams() as { courseId: string };
    const courseCode = lookupCourseCode(courseId ?? '');
    const allStudents = useMemo(() => getGroupStudents(courseId ?? 'cs-1001'), [courseId]);
    const [groups, setGroups] = useState<Group[]>(() => buildMockGroups(allStudents));
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedGroup, setExpandedGroup] = useState<string | null>('g1');
    const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

    /* ── Modals ── */
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<Group | null>(null);
    const [showAddMember, setShowAddMember] = useState<Group | null>(null);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);

    /* ── Create Group form ── */
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupMaxSize, setNewGroupMaxSize] = useState(4);
    const [newGroupSelectedStudents, setNewGroupSelectedStudents] = useState<Set<string>>(new Set());
    const [createSearch, setCreateSearch] = useState('');

    /* ── Edit Group form ── */
    const [editGroupName, setEditGroupName] = useState('');
    const [editGroupMaxSize, setEditGroupMaxSize] = useState(4);

    /* ── Auto-assign form ── */
    const [autoGroupSize, setAutoGroupSize] = useState(4);
    const [autoStrategy, setAutoStrategy] = useState<'random' | 'alphabetical'>('random');
    const [autoNaming, setAutoNaming] = useState<'greek' | 'numbered'>('greek');

    /* ── Computed ── */
    const assignedIds = useMemo(() => {
        const ids = new Set<string>();
        groups.forEach(g => g.members.forEach(m => ids.add(m.id)));
        return ids;
    }, [groups]);

    const unassignedStudents = useMemo(
        () => allStudents.filter(s => !assignedIds.has(s.id)),
        [allStudents, assignedIds]
    );

    const totalStudents = allStudents.length;
    const assignedCount = assignedIds.size;
    const unassignedCount = totalStudents - assignedCount;

    const filteredGroups = groups.filter(g => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return g.name.toLowerCase().includes(q) ||
            g.members.some(m => m.name.toLowerCase().includes(q) || m.studentId.toLowerCase().includes(q));
    });

    /* ── Actions ── */
    const handleDeleteGroup = (group: Group) => {
        setGroups(prev => prev.filter(g => g.id !== group.id));
        setShowDeleteConfirm(null);
        if (expandedGroup === group.id) setExpandedGroup(null);
    };

    const handleRemoveMember = (groupId: string, memberId: string) => {
        setGroups(prev => prev.map(g =>
            g.id === groupId ? { ...g, members: g.members.filter(m => m.id !== memberId) } : g
        ));
    };

    const handleAddMembers = (group: Group, studentIds: string[]) => {
        const studentsToAdd = allStudents.filter(s => studentIds.includes(s.id));
        setGroups(prev => prev.map(g =>
            g.id === group.id ? { ...g, members: [...g.members, ...studentsToAdd] } : g
        ));
        setShowAddMember(null);
    };

    const handleCreateGroup = () => {
        if (!newGroupName.trim()) return;
        const selectedStudents = allStudents.filter(s => newGroupSelectedStudents.has(s.id));
        const newGroup: Group = {
            id: nextGroupId(groups),
            name: newGroupName.trim(),
            members: selectedStudents,
            maxSize: newGroupMaxSize,
            createdAt: new Date().toISOString().slice(0, 10),
        };
        setGroups(prev => [...prev, newGroup]);
        setShowCreateModal(false);
        setNewGroupName('');
        setNewGroupMaxSize(4);
        setNewGroupSelectedStudents(new Set());
        setCreateSearch('');
        setExpandedGroup(newGroup.id);
    };

    const handleEditGroup = () => {
        if (!editingGroup || !editGroupName.trim()) return;
        setGroups(prev => prev.map(g =>
            g.id === editingGroup.id ? { ...g, name: editGroupName.trim(), maxSize: editGroupMaxSize } : g
        ));
        setEditingGroup(null);
    };

    const openEditModal = (group: Group) => {
        setEditGroupName(group.name);
        setEditGroupMaxSize(group.maxSize);
        setEditingGroup(group);
    };

    const handleAutoAssign = () => {
        let sorted = [...allStudents];

        if (autoStrategy === 'alphabetical') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            // Fisher-Yates shuffle
            for (let i = sorted.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            }
        }

        const size = autoGroupSize;
        const numFullGroups = Math.floor(sorted.length / size);
        const remainder = sorted.length % size;

        const newGroups: Group[] = [];
        for (let i = 0; i < numFullGroups; i++) {
            const members = sorted.slice(i * size, (i + 1) * size);
            const name = autoNaming === 'greek'
                ? GROUP_NAMES[i % GROUP_NAMES.length]
                : `Group ${i + 1}`;
            newGroups.push({
                id: `g${i + 1}`,
                name,
                members,
                maxSize: size,
                createdAt: new Date().toISOString().slice(0, 10),
            });
        }

        // Distribute remainder
        if (remainder > 0 && newGroups.length > 0) {
            const extras = sorted.slice(numFullGroups * size);
            extras.forEach((student, idx) => {
                newGroups[idx % newGroups.length].members.push(student);
            });
        } else if (remainder > 0 && newGroups.length === 0) {
            const name = autoNaming === 'greek' ? GROUP_NAMES[0] : 'Group 1';
            newGroups.push({
                id: 'g1',
                name,
                members: sorted,
                maxSize: size,
                createdAt: new Date().toISOString().slice(0, 10),
            });
        }

        setGroups(newGroups);
        setShowAutoAssignModal(false);
        setExpandedGroup(newGroups[0]?.id ?? null);
    };

    const autoPreviewGroupCount = Math.ceil(totalStudents / autoGroupSize);
    const autoPreviewRemainder = totalStudents % autoGroupSize;

    /* ═══════════════════════════════════════════
       Render
       ═══════════════════════════════════════════ */

    return (
        <PageLayout>
            <TopNav breadcrumbs={[
                { label: 'Courses', href: '/courses' },
                { label: courseCode },
                { label: 'Groups' }
            ]} />

            <div className="flex h-[calc(100vh-64px)]">
                <Sidebar activeItem="groups" />

                <main className="flex-1 overflow-auto p-8">
                    {/* Page Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                                Groups
                            </h1>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                                Manage student groups for collaborative assignments
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="border-[var(--color-border)] text-[var(--color-text-mid)]"
                                onClick={() => setShowAutoAssignModal(true)}
                            >
                                <Shuffle className="w-4 h-4 mr-2" />
                                Auto-Assign
                            </Button>
                            <Button
                                onClick={() => {
                                    setNewGroupName('');
                                    setNewGroupMaxSize(4);
                                    setNewGroupSelectedStudents(new Set());
                                    setCreateSearch('');
                                    setShowCreateModal(true);
                                }}
                                className="text-white hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Group
                            </Button>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div
                        className="flex items-center gap-6 mb-6 px-5 py-3 rounded-lg"
                        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                    >
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                            <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                <strong style={{ color: 'var(--color-text-dark)', fontWeight: 600 }}>{groups.length}</strong> groups
                            </span>
                        </div>
                        <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)' }} />
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                            <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                <strong style={{ color: 'var(--color-text-dark)', fontWeight: 600 }}>{assignedCount}</strong>/{totalStudents} assigned
                            </span>
                        </div>
                        {unassignedCount > 0 && (
                            <>
                                <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)' }} />
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" style={{ color: '#B45309' }} />
                                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#B45309' }}>
                                        {unassignedCount} unassigned
                                    </span>
                                </div>
                            </>
                        )}
                        {unassignedCount === 0 && totalStudents > 0 && (
                            <>
                                <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)' }} />
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4" style={{ color: '#2D6A2D' }} />
                                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#2D6A2D' }}>
                                        All students assigned
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Search & View Toggle */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                            <Input
                                placeholder="Search groups or students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-[var(--color-border)]"
                            />
                        </div>
                        <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                            <button
                                onClick={() => setViewMode('cards')}
                                className="px-3 py-1.5 rounded-md text-sm transition-colors"
                                style={{
                                    backgroundColor: viewMode === 'cards' ? 'var(--color-surface)' : 'transparent',
                                    color: viewMode === 'cards' ? 'var(--color-primary)' : 'var(--color-text-mid)',
                                    fontWeight: viewMode === 'cards' ? 500 : 400,
                                    boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                }}
                            >
                                Cards
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className="px-3 py-1.5 rounded-md text-sm transition-colors"
                                style={{
                                    backgroundColor: viewMode === 'list' ? 'var(--color-surface)' : 'transparent',
                                    color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-text-mid)',
                                    fontWeight: viewMode === 'list' ? 500 : 400,
                                    boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                }}
                            >
                                List
                            </button>
                        </div>
                    </div>

                    {/* ──────── Cards View ──────── */}
                    {viewMode === 'cards' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {filteredGroups.map((group) => {
                                const isExpanded = expandedGroup === group.id;
                                const isFull = group.members.length >= group.maxSize;
                                const fillPct = Math.min((group.members.length / group.maxSize) * 100, 100);

                                return (
                                    <div
                                        key={group.id}
                                        className="bg-white rounded-xl overflow-hidden transition-shadow hover:shadow-md"
                                        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid var(--color-border)' }}
                                    >
                                        {/* Header */}
                                        <div
                                            className="px-5 py-4 flex items-center justify-between cursor-pointer select-none"
                                            onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{ backgroundColor: 'var(--color-primary-bg)' }}
                                                >
                                                    <Users className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="truncate" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                                        {group.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span
                                                            className="px-1.5 py-0.5 rounded text-xs font-semibold"
                                                            style={{
                                                                backgroundColor: isFull ? '#E8F5E8' : 'var(--color-primary-bg)',
                                                                color: isFull ? '#2D6A2D' : 'var(--color-primary)',
                                                                fontSize: '11px',
                                                            }}
                                                        >
                                                            {group.members.length}/{group.maxSize}
                                                        </span>
                                                        <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                            {isFull ? 'Full' : `${group.maxSize - group.members.length} spot${group.maxSize - group.members.length !== 1 ? 's' : ''} open`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button
                                                    className="p-1.5 hover:bg-[var(--color-primary-bg)] rounded transition-colors"
                                                    aria-label="Edit group"
                                                    onClick={(e) => { e.stopPropagation(); openEditModal(group); }}
                                                >
                                                    <Edit className="w-4 h-4 text-[var(--color-text-mid)]" />
                                                </button>
                                                <button
                                                    className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                                    aria-label="Delete group"
                                                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(group); }}
                                                >
                                                    <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                                                </button>
                                                {isExpanded
                                                    ? <ChevronUp className="w-5 h-5 text-[var(--color-text-light)]" />
                                                    : <ChevronDown className="w-5 h-5 text-[var(--color-text-light)]" />
                                                }
                                            </div>
                                        </div>

                                        {/* Collapsed: avatar stack */}
                                        {!isExpanded && (
                                            <div className="px-5 pb-4 flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {group.members.slice(0, 5).map(m => (
                                                        <div
                                                            key={m.id}
                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-white border-2 border-white"
                                                            style={{ backgroundColor: 'var(--color-primary)', fontSize: '10px', fontWeight: 600 }}
                                                            title={m.name}
                                                        >
                                                            {getInitials(m.name)}
                                                        </div>
                                                    ))}
                                                    {group.members.length > 5 && (
                                                        <div
                                                            className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-white"
                                                            style={{ backgroundColor: 'var(--color-border)', fontSize: '10px', fontWeight: 600, color: 'var(--color-text-mid)' }}
                                                        >
                                                            +{group.members.length - 5}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Expanded: member list */}
                                        {isExpanded && (
                                            <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--color-border)' }}>
                                                {/* Capacity bar */}
                                                <div className="pt-4 mb-4">
                                                    <div className="flex justify-between mb-1.5">
                                                        <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Capacity</span>
                                                        <span style={{ fontSize: '12px', fontWeight: 600, color: isFull ? '#2D6A2D' : 'var(--color-text-mid)' }}>
                                                            {group.members.length}/{group.maxSize}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                                                        <div
                                                            className="h-full rounded-full transition-all duration-300"
                                                            style={{
                                                                width: `${fillPct}%`,
                                                                backgroundColor: isFull ? '#2D6A2D' : 'var(--color-primary)',
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Members */}
                                                <div className="space-y-1">
                                                    {group.members.map(member => (
                                                        <div
                                                            key={member.id}
                                                            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--color-primary-bg)] transition-colors group/member"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                                                    style={{ backgroundColor: 'var(--color-primary)', fontSize: '11px', fontWeight: 600 }}
                                                                >
                                                                    {getInitials(member.name)}
                                                                </div>
                                                                <div>
                                                                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                                        {member.name}
                                                                    </p>
                                                                    <p style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                                                                        {member.studentId}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                className="p-1 rounded opacity-0 group-hover/member:opacity-100 hover:bg-red-100 transition-all"
                                                                aria-label="Remove from group"
                                                                onClick={() => handleRemoveMember(group.id, member.id)}
                                                            >
                                                                <X className="w-3.5 h-3.5 text-red-500" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Add member button */}
                                                {!isFull && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-3 border-dashed border-[var(--color-border)] text-[var(--color-text-mid)] w-full hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                                                        onClick={() => setShowAddMember(group)}
                                                    >
                                                        <UserPlus className="w-4 h-4 mr-2" />
                                                        Add Member
                                                    </Button>
                                                )}

                                                {group.members.length === 0 && (
                                                    <p className="text-center py-4" style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                                                        No members yet
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* ──────── List View ──────── */
                        <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}>
                            <table className="w-full">
                                <thead style={{ backgroundColor: 'var(--color-primary-bg)', borderBottom: '1px solid var(--color-border)' }}>
                                    <tr>
                                        <th className="text-left px-6 py-3" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mid)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Group</th>
                                        <th className="text-left px-6 py-3" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mid)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Members</th>
                                        <th className="text-left px-6 py-3" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mid)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capacity</th>
                                        <th className="text-left px-6 py-3" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mid)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Created</th>
                                        <th className="text-right px-6 py-3" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mid)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredGroups.map(group => (
                                        <tr
                                            key={group.id}
                                            className="border-b hover:bg-[var(--color-primary-bg)]/40 transition-colors"
                                            style={{ borderColor: 'var(--color-border)' }}
                                        >
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                                                        <Users className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                                                    </div>
                                                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>{group.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex -space-x-2">
                                                    {group.members.slice(0, 4).map(m => (
                                                        <div
                                                            key={m.id}
                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-white border-2 border-white"
                                                            style={{ backgroundColor: 'var(--color-primary)', fontSize: '10px', fontWeight: 600 }}
                                                            title={m.name}
                                                        >
                                                            {getInitials(m.name)}
                                                        </div>
                                                    ))}
                                                    {group.members.length > 4 && (
                                                        <div
                                                            className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-white"
                                                            style={{ backgroundColor: 'var(--color-border)', fontSize: '10px', fontWeight: 600, color: 'var(--color-text-mid)' }}
                                                        >
                                                            +{group.members.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span
                                                    className="px-2 py-1 rounded text-xs font-semibold"
                                                    style={{
                                                        backgroundColor: group.members.length >= group.maxSize ? '#E8F5E8' : 'var(--color-primary-bg)',
                                                        color: group.members.length >= group.maxSize ? '#2D6A2D' : 'var(--color-primary)',
                                                    }}
                                                >
                                                    {group.members.length}/{group.maxSize}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5" style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                {new Date(group.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        className="p-1.5 hover:bg-[var(--color-primary-bg)] rounded transition-colors"
                                                        onClick={() => openEditModal(group)}
                                                        aria-label="Edit group"
                                                    >
                                                        <Edit className="w-4 h-4 text-[var(--color-text-mid)]" />
                                                    </button>
                                                    <button
                                                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                                        onClick={() => setShowDeleteConfirm(group)}
                                                        aria-label="Delete group"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {filteredGroups.length === 0 && (
                        <div className="text-center py-16">
                            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
                            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '4px' }}>
                                No groups found
                            </p>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                                Create a group or use Auto-Assign to get started.
                            </p>
                        </div>
                    )}
                </main>
            </div>

            {/* ═══════ Create Group Modal ═══════ */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-lg" style={{ boxShadow: '0 8px 24px rgba(107, 0, 0, 0.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                            Create New Group
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                            Name your group, set a size, and optionally add members now.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-2">
                        <div>
                            <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                Group Name *
                            </label>
                            <Input
                                placeholder="e.g., Team Epsilon"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                className="border-[var(--color-border)]"
                            />
                        </div>

                        <div>
                            <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                Max Group Size
                            </label>
                            <Select value={String(newGroupMaxSize)} onValueChange={(v) => setNewGroupMaxSize(Number(v))}>
                                <SelectTrigger className="w-full border-[var(--color-border)]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[2, 3, 4, 5, 6, 8].map(n => (
                                        <SelectItem key={n} value={String(n)}>{n} members</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                Add Members <span style={{ color: 'var(--color-text-light)', fontWeight: 400 }}>({newGroupSelectedStudents.size} selected)</span>
                            </label>
                            <Input
                                placeholder="Search students..."
                                value={createSearch}
                                onChange={(e) => setCreateSearch(e.target.value)}
                                className="mb-2 border-[var(--color-border)]"
                            />
                            <div className="border rounded-lg max-h-52 overflow-y-auto" style={{ borderColor: 'var(--color-border)' }}>
                                {unassignedStudents
                                    .filter(s => !createSearch || s.name.toLowerCase().includes(createSearch.toLowerCase()) || s.studentId.includes(createSearch))
                                    .slice(0, 30)
                                    .map(student => {
                                        const selected = newGroupSelectedStudents.has(student.id);
                                        return (
                                            <label
                                                key={student.id}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--color-primary-bg)] cursor-pointer transition-colors"
                                                style={{ borderBottom: '1px solid var(--color-border)' }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={() => {
                                                        const next = new Set(newGroupSelectedStudents);
                                                        selected ? next.delete(student.id) : next.add(student.id);
                                                        setNewGroupSelectedStudents(next);
                                                    }}
                                                    disabled={!selected && newGroupSelectedStudents.size >= newGroupMaxSize}
                                                    style={{ accentColor: 'var(--color-primary)' }}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                                        style={{ backgroundColor: 'var(--color-primary)', fontSize: '10px', fontWeight: 600 }}
                                                    >
                                                        {getInitials(student.name)}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>{student.name}</p>
                                                        <p style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>{student.studentId}</p>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                {unassignedStudents.length === 0 && (
                                    <p className="p-4 text-center" style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>All students are already assigned to groups</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateModal(false)} className="border-[var(--color-border)] text-[var(--color-text-mid)]">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateGroup}
                            disabled={!newGroupName.trim()}
                            className="text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Group
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ═══════ Edit Group Modal ═══════ */}
            <Dialog open={!!editingGroup} onOpenChange={(open) => !open && setEditingGroup(null)}>
                <DialogContent className="sm:max-w-md" style={{ boxShadow: '0 8px 24px rgba(107, 0, 0, 0.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                            Edit Group
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-2">
                        <div>
                            <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Group Name</label>
                            <Input
                                value={editGroupName}
                                onChange={(e) => setEditGroupName(e.target.value)}
                                className="border-[var(--color-border)]"
                            />
                        </div>
                        <div>
                            <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Max Group Size</label>
                            <Select value={String(editGroupMaxSize)} onValueChange={(v) => setEditGroupMaxSize(Number(v))}>
                                <SelectTrigger className="w-full border-[var(--color-border)]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[2, 3, 4, 5, 6, 8].map(n => (
                                        <SelectItem key={n} value={String(n)}>{n} members</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingGroup(null)} className="border-[var(--color-border)] text-[var(--color-text-mid)]">Cancel</Button>
                        <Button
                            onClick={handleEditGroup}
                            disabled={!editGroupName.trim()}
                            className="text-white hover:opacity-90"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ═══════ Delete Confirmation ═══════ */}
            <Dialog open={!!showDeleteConfirm} onOpenChange={(open) => !open && setShowDeleteConfirm(null)}>
                <DialogContent style={{ maxWidth: '420px' }}>
                    <DialogHeader>
                        <DialogTitle style={{ color: 'var(--color-text-dark)', fontSize: '18px', fontWeight: 700 }}>
                            Delete Group
                        </DialogTitle>
                        <DialogDescription style={{ color: 'var(--color-text-mid)', fontSize: '14px', marginTop: '8px' }}>
                            Are you sure you want to delete <strong style={{ color: 'var(--color-text-dark)' }}>{showDeleteConfirm?.name}</strong>?
                            Its {showDeleteConfirm?.members.length} member{showDeleteConfirm?.members.length !== 1 ? 's' : ''} will become unassigned.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
                        <Button
                            onClick={() => showDeleteConfirm && handleDeleteGroup(showDeleteConfirm)}
                            className="text-white"
                            style={{ backgroundColor: '#dc2626' }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Group
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ═══════ Add Member Modal ═══════ */}
            <Dialog open={!!showAddMember} onOpenChange={(open) => !open && setShowAddMember(null)}>
                <DialogContent className="sm:max-w-md" style={{ boxShadow: '0 8px 24px rgba(107, 0, 0, 0.15)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                            Add Members to {showAddMember?.name}
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                            {showAddMember && `${showAddMember.maxSize - showAddMember.members.length} spot${showAddMember.maxSize - showAddMember.members.length !== 1 ? 's' : ''} remaining`}
                        </DialogDescription>
                    </DialogHeader>
                    <AddMemberList
                        students={unassignedStudents}
                        maxAdd={showAddMember ? showAddMember.maxSize - showAddMember.members.length : 0}
                        onAdd={(ids) => showAddMember && handleAddMembers(showAddMember, ids)}
                        onCancel={() => setShowAddMember(null)}
                    />
                </DialogContent>
            </Dialog>

            {/* ═══════ Auto-Assign Modal ═══════ */}
            <Dialog open={showAutoAssignModal} onOpenChange={setShowAutoAssignModal}>
                <DialogContent className="sm:max-w-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
                    <DialogHeader>
                        <DialogTitle style={{ color: 'var(--color-text-dark)' }}>
                            <div className="flex items-center gap-2">
                                <Shuffle className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                                Auto-Assign Students
                            </div>
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                            Automatically distribute <strong style={{ color: 'var(--color-text-dark)' }}>{totalStudents} students</strong> into groups. This replaces all existing groups.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-2">
                        {/* Strategy */}
                        <div>
                            <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                Assignment Strategy
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: 'random' as const, icon: Dices, label: 'Random Shuffle', desc: 'Randomly distribute students' },
                                    { value: 'alphabetical' as const, icon: ArrowDownAZ, label: 'Alphabetical', desc: 'Sort by name, then assign' },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setAutoStrategy(opt.value)}
                                        className="p-3 rounded-lg text-left transition-all"
                                        style={{
                                            border: `2px solid ${autoStrategy === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                            backgroundColor: autoStrategy === opt.value ? 'var(--color-primary-bg)' : 'var(--color-surface)',
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <opt.icon className="w-4 h-4" style={{ color: autoStrategy === opt.value ? 'var(--color-primary)' : 'var(--color-text-light)' }} />
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: autoStrategy === opt.value ? 'var(--color-primary)' : 'var(--color-text-dark)' }}>
                                                {opt.label}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Group size */}
                        <div>
                            <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                Students per Group
                            </label>
                            <div className="flex gap-2">
                                {[2, 3, 4, 5, 6].map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setAutoGroupSize(n)}
                                        className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                                        style={{
                                            border: `2px solid ${autoGroupSize === n ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                            backgroundColor: autoGroupSize === n ? 'var(--color-primary)' : 'var(--color-surface)',
                                            color: autoGroupSize === n ? 'white' : 'var(--color-text-mid)',
                                        }}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Naming */}
                        <div>
                            <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                Group Naming
                            </label>
                            <Select value={autoNaming} onValueChange={(v: 'greek' | 'numbered') => setAutoNaming(v)}>
                                <SelectTrigger className="border-[var(--color-border)]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="greek">Greek Letters (Alpha, Beta, …)</SelectItem>
                                    <SelectItem value="numbered">Numbered (Group 1, Group 2, …)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Preview */}
                        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '10px' }}>Preview</p>
                            <div className="grid grid-cols-2 gap-3" style={{ fontSize: '13px' }}>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: 'var(--color-text-mid)' }}>Groups</span>
                                    <strong style={{ color: 'var(--color-text-dark)' }}>{autoPreviewGroupCount}</strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: 'var(--color-text-mid)' }}>Per group</span>
                                    <strong style={{ color: 'var(--color-text-dark)' }}>{autoGroupSize}</strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: 'var(--color-text-mid)' }}>Total students</span>
                                    <strong style={{ color: 'var(--color-text-dark)' }}>{totalStudents}</strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: 'var(--color-text-mid)' }}>Naming</span>
                                    <strong style={{ color: 'var(--color-text-dark)' }}>{autoNaming === 'greek' ? 'Greek' : 'Numbered'}</strong>
                                </div>
                            </div>
                            {autoPreviewRemainder > 0 && (
                                <div className="flex items-start gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#B45309' }} />
                                    <p style={{ fontSize: '12px', color: '#B45309' }}>
                                        {autoPreviewRemainder} extra student{autoPreviewRemainder > 1 ? 's' : ''} will be distributed across the first {autoPreviewRemainder > 1 ? `${autoPreviewRemainder} groups` : 'group'} (resulting in groups of {autoGroupSize + 1})
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAutoAssignModal(false)} className="border-[var(--color-border)] text-[var(--color-text-mid)]">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAutoAssign}
                            className="text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            <Shuffle className="w-4 h-4 mr-2" />
                            Auto-Assign {totalStudents} Students
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}

/* ═══════════════════════════════════════════
   Add Member sub-component (keeps state local)
   ═══════════════════════════════════════════ */

function AddMemberList({ students, maxAdd, onAdd, onCancel }: {
    students: Student[];
    maxAdd: number;
    onAdd: (ids: string[]) => void;
    onCancel: () => void;
}) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState('');

    const filtered = students.filter(s =>
        !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search)
    );

    return (
        <>
            <div className="py-2">
                <Input
                    placeholder="Search unassigned students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2 border-[var(--color-border)]"
                />
                <div className="border rounded-lg max-h-64 overflow-y-auto" style={{ borderColor: 'var(--color-border)' }}>
                    {filtered.length === 0 && (
                        <p className="p-4 text-center" style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                            {students.length === 0 ? 'All students are already in groups' : 'No matching students'}
                        </p>
                    )}
                    {filtered.slice(0, 40).map(student => {
                        const isSelected = selected.has(student.id);
                        return (
                            <label
                                key={student.id}
                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--color-primary-bg)] cursor-pointer transition-colors"
                                style={{ borderBottom: '1px solid var(--color-border)' }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                        const next = new Set(selected);
                                        isSelected ? next.delete(student.id) : next.add(student.id);
                                        setSelected(next);
                                    }}
                                    disabled={!isSelected && selected.size >= maxAdd}
                                    style={{ accentColor: 'var(--color-primary)' }}
                                />
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                        style={{ backgroundColor: 'var(--color-primary)', fontSize: '10px', fontWeight: 600 }}
                                    >
                                        {getInitials(student.name)}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>{student.name}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>{student.studentId}</p>
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel} className="border-[var(--color-border)] text-[var(--color-text-mid)]">Cancel</Button>
                <Button
                    onClick={() => onAdd(Array.from(selected))}
                    disabled={selected.size === 0}
                    className="text-white hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add {selected.size} Member{selected.size !== 1 ? 's' : ''}
                </Button>
            </DialogFooter>
        </>
    );
}
