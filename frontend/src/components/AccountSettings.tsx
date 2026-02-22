import { useState, useEffect, useRef, useCallback } from 'react';
import {
    User, Shield, Bell, Palette, Link2, Eye, Monitor, AlertTriangle,
    Camera, Trash2, Phone, MapPin, Building2, Briefcase, CheckCircle2,
    Info, EyeOff, Copy, ExternalLink, Smartphone, Laptop, X,
    ChevronDown, Clock, Download, FileText, Globe, Sun, Moon, Type,
    ToggleLeft, ToggleRight,
} from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from './ui/dialog';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

type SectionId = 'profile' | 'security' | 'notifications' | 'preferences' | 'connected' | 'privacy' | 'sessions' | 'danger';

interface ProfileData {
    firstName: string;
    lastName: string;
    preferredName: string;
    title: string;
    department: string;
    officeLocation: string;
    officePhone: string;
    bio: string;
}

interface NotificationSetting {
    id: string;
    label: string;
    description: string;
    email: boolean;
    inApp: boolean;
    locked?: boolean;
}

interface Session {
    id: string;
    device: string;
    browser: string;
    os: string;
    location: string;
    ip: string;
    lastActive: string;
    current: boolean;
    icon: 'desktop' | 'mobile' | 'laptop';
}

/* ═══════════════════════════════════════════
   Sidebar navigation items
   ═══════════════════════════════════════════ */

const sections: { id: SectionId; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'connected', label: 'Connected Accounts', icon: Link2 },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'sessions', label: 'Sessions', icon: Monitor },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

/* ═══════════════════════════════════════════
   Default data
   ═══════════════════════════════════════════ */

const defaultProfile: ProfileData = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    preferredName: 'Dr. Johnson',
    title: 'Assistant Professor',
    department: 'Computer Science',
    officeLocation: 'Brown Hall 305',
    officePhone: '(318) 555-0123',
    bio: 'Computer Science educator specializing in software engineering, programming languages, and automated grading systems. Research interests include AI-assisted education and plagiarism detection.',
};

const defaultNotifications: NotificationSetting[] = [
    { id: 'newSubmission', label: 'New Submission Received', description: 'When a student submits an assignment', email: true, inApp: true },
    { id: 'lateSubmission', label: 'Late Submission Received', description: 'When a student submits after the due date', email: true, inApp: true },
    { id: 'resubmission', label: 'Resubmission Received', description: 'When a student resubmits an assignment', email: true, inApp: true },
    { id: 'pendingGrades', label: 'Pending Grades Reminder', description: 'Daily reminder if you have ungraded submissions', email: true, inApp: false },
    { id: 'gradingDeadline', label: 'Grading Deadline Approaching', description: 'When grading deadline is within 3 days', email: true, inApp: true },
    { id: 'newEnrollment', label: 'New Student Enrollment', description: 'When a student joins your course', email: false, inApp: true },
    { id: 'studentDropped', label: 'Student Dropped Course', description: 'When a student drops your course', email: false, inApp: true },
    { id: 'assignmentDue', label: 'Assignment Due Soon', description: '2 days before an assignment is due', email: true, inApp: true },
    { id: 'newFeatures', label: 'New Feature Announcements', description: 'When new features are added to AutoGrade', email: true, inApp: true },
    { id: 'maintenance', label: 'System Maintenance', description: 'Scheduled maintenance and downtime alerts', email: true, inApp: true },
    { id: 'securityAlerts', label: 'Security Alerts', description: 'Login from new device, password changes, suspicious activity', email: true, inApp: true, locked: true },
    { id: 'weeklySummary', label: 'Weekly Course Summary', description: 'Sunday summary of submissions, grades, and activity', email: true, inApp: false },
];

const mockSessions: Session[] = [
    { id: 's1', device: 'Desktop', browser: 'Chrome 120', os: 'macOS Sonoma', location: 'Monroe, Louisiana, US', ip: '192.168.1.100', lastActive: 'Active now', current: true, icon: 'desktop' },
    { id: 's2', device: 'Mobile', browser: 'Safari', os: 'iPhone iOS 17', location: 'Monroe, Louisiana, US', ip: '192.168.1.51', lastActive: '2 hours ago', current: false, icon: 'mobile' },
    { id: 's3', device: 'Laptop', browser: 'Firefox 122', os: 'Windows 11', location: 'Baton Rouge, Louisiana, US', ip: '10.0.0.45', lastActive: '3 days ago', current: false, icon: 'laptop' },
];

const mockActivities = [
    { action: 'Login from new device', date: 'Feb 19, 2026 at 10:30 AM' },
    { action: 'Password changed', date: 'Feb 1, 2026 at 3:15 PM' },
    { action: 'Created course "CS-1001"', date: 'Jan 15, 2026 at 9:00 AM' },
    { action: 'Canvas integration connected', date: 'Jan 15, 2026 at 9:05 AM' },
    { action: 'Profile photo updated', date: 'Jan 10, 2026 at 11:20 AM' },
    { action: 'Account created', date: 'Jan 5, 2025 at 2:00 PM' },
];

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

function loadProfile(): ProfileData {
    try {
        const stored = localStorage.getItem('autograde_profile');
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return defaultProfile;
}

function saveProfile(data: ProfileData) {
    localStorage.setItem('autograde_profile', JSON.stringify(data));
}

function getInitials(first: string, last: string) {
    return `${(first || 'S')[0]}${(last || 'J')[0]}`.toUpperCase();
}

/* password strength helpers */
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
    if (!pw) return { score: 0, label: '', color: '#D9D9D9' };
    let score = 0;
    if (pw.length >= 8) score += 2;
    if (pw.length >= 12) score += 1;
    if (pw.length >= 16) score += 1;
    if (pw.length >= 20) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[a-z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) score += 1;
    if (pw.length >= 14 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[!@#$%^&*]/.test(pw)) score += 1;

    if (score <= 3) return { score: Math.min(score, 3), label: 'Weak — Try adding more characters or symbols', color: '#8B0000' };
    if (score <= 6) return { score: Math.min(score, 6), label: 'Medium — Good, but could be stronger', color: '#8A5700' };
    if (score <= 8) return { score: Math.min(score, 9), label: 'Strong — Great password', color: '#6B0000' };
    return { score: 10, label: 'Very Strong — Excellent password', color: '#2D6A2D' };
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export function AccountSettings() {
    const [activeSection, setActiveSection] = useState<SectionId>('profile');
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    /* ── Profile state ── */
    const [profile, setProfile] = useState<ProfileData>(loadProfile);
    const originalProfile = useRef<ProfileData>(loadProfile());

    /* ── Security state ── */
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [signOutOthers, setSignOutOthers] = useState(false);
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState(false);

    /* ── Notifications state ── */
    const [notifications, setNotifications] = useState<NotificationSetting[]>(defaultNotifications);
    const [emailDigest, setEmailDigest] = useState('individual');
    const [dndEnabled, setDndEnabled] = useState(false);
    const [dndStart, setDndStart] = useState('22:00');
    const [dndEnd, setDndEnd] = useState('07:00');
    const [dndDays, setDndDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

    /* ── Preferences state ── */
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en-US');
    const [timezone, setTimezone] = useState('America/Chicago');
    const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
    const [timeFormat, setTimeFormat] = useState('12h');
    const [density, setDensity] = useState('comfortable');
    const [highContrast, setHighContrast] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [keyboardHints, setKeyboardHints] = useState(false);
    const [fontSize, setFontSize] = useState('14');

    /* ── Connected Accounts state ── */
    const [canvasConnected, setCanvasConnected] = useState(false);
    const [canvasSyncing, setCanvasSyncing] = useState(false);

    /* ── Privacy state ── */
    const [showPhoto, setShowPhoto] = useState(true);
    const [showOffice, setShowOffice] = useState(true);
    const [showPhone, setShowPhone] = useState(true);
    const [showBio, setShowBio] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [dataRetention, setDataRetention] = useState('90');

    /* ── Sessions state ── */
    const [sessions, setSessions] = useState<Session[]>(mockSessions);
    const [loginAlertDevice, setLoginAlertDevice] = useState(true);
    const [loginAlertLocation, setLoginAlertLocation] = useState(true);

    /* ── Modals ── */
    const [disconnectCanvas, setDisconnectCanvas] = useState(false);
    const [deactivateOpen, setDeactivateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deactivateText, setDeactivateText] = useState('');
    const [deleteEmail, setDeleteEmail] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [signOutAllOpen, setSignOutAllOpen] = useState(false);
    const [disableAllEmail, setDisableAllEmail] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);

    /* ── Toast auto-dismiss ── */
    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    /* ── Track unsaved changes for profile ── */
    useEffect(() => {
        const changed = JSON.stringify(profile) !== JSON.stringify(originalProfile.current);
        setHasChanges(changed);
    }, [profile]);

    /* ── Save handler ── */
    const handleSave = useCallback(() => {
        setSaving(true);
        setTimeout(() => {
            saveProfile(profile);
            originalProfile.current = { ...profile };
            setSaving(false);
            setHasChanges(false);
            setToast('Profile updated successfully');
        }, 600);
    }, [profile]);

    const handleDiscard = () => {
        setProfile({ ...originalProfile.current });
        setHasChanges(false);
    };

    const updateProfile = (field: keyof ProfileData, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    /* ── Password submit ── */
    const handlePasswordUpdate = () => {
        setPwError('');
        if (!currentPw) { setPwError('Please enter your current password'); return; }
        const reqs = [newPw.length >= 8, /[A-Z]/.test(newPw), /[0-9]/.test(newPw), /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPw)];
        if (reqs.some(r => !r)) { setPwError('New password does not meet all requirements'); return; }
        if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
        if (newPw === currentPw) { setPwError('New password cannot be the same as current password'); return; }
        setPwSuccess(true);
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
        setToast('Password updated successfully');
        setTimeout(() => setPwSuccess(false), 3000);
    };

    /* ── Notification helpers ── */
    const toggleNotif = (id: string, channel: 'email' | 'inApp') => {
        setNotifications(prev => prev.map(n => n.id === id && !n.locked ? { ...n, [channel]: !n[channel] } : n));
    };
    const enableAllEmail = () => setNotifications(prev => prev.map(n => ({ ...n, email: true })));
    const disableAllEmailConfirmed = () => {
        setNotifications(prev => prev.map(n => n.locked ? n : { ...n, email: false }));
        setDisableAllEmail(false);
        setToast('All email notifications disabled');
    };
    const resetNotifDefaults = () => {
        setNotifications(defaultNotifications);
        setToast('Notifications reset to defaults');
    };
    const toggleDndDay = (day: string) => {
        setDndDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    /* ── Session helpers ── */
    const signOutSession = (id: string) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        setToast('Device signed out');
    };
    const signOutAllOthers = () => {
        setSessions(prev => prev.filter(s => s.current));
        setSignOutAllOpen(false);
        setToast('All other devices signed out');
    };

    /* ═══════════════════════════════════════════
       Card wrapper
       ═══════════════════════════════════════════ */

    const Card = ({ children, title, subtitle, danger }: { children: React.ReactNode; title?: string; subtitle?: string; danger?: boolean }) => (
        <div
            style={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid ${danger ? '#dc2626' : 'var(--color-border)'}`,
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '20px',
                borderLeft: danger ? '4px solid #8B0000' : undefined,
            }}
        >
            {title && (
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: danger ? '#8B0000' : 'var(--color-text-dark)', marginBottom: subtitle ? '4px' : '16px' }}>{title}</h3>
            )}
            {subtitle && (
                <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginBottom: '16px' }}>{subtitle}</p>
            )}
            {children}
        </div>
    );

    /* ═══════════════════════════════════════════
       SECTION RENDERERS
       ═══════════════════════════════════════════ */

    /* ── Profile ── */
    const renderProfile = () => (
        <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>Profile Settings</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '28px' }}>Manage your personal information and how it appears to students</p>

            {/* Avatar Section */}
            <Card title="Profile Photo">
                <div className="flex items-center gap-6">
                    <div
                        className="rounded-full flex items-center justify-center text-white flex-shrink-0"
                        style={{ width: '120px', height: '120px', backgroundColor: 'var(--color-primary)', fontSize: '36px', fontWeight: 700, border: '2px solid #D9D9D9' }}
                    >
                        {getInitials(profile.firstName, profile.lastName)}
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginBottom: '12px' }}>Your photo helps students recognize you</p>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm" onClick={() => setToast('Photo upload coming soon')}>
                                <Camera className="w-4 h-4 mr-2" />Change Photo
                            </Button>
                            <button
                                onClick={() => setToast('Photo removed')}
                                style={{ fontSize: '13px', color: '#8B0000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                            >
                                Remove Photo
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Personal Information */}
            <Card title="Personal Information">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label style={labelStyle}>First Name <span style={{ color: '#dc2626' }}>*</span></label>
                        <Input value={profile.firstName} onChange={e => updateProfile('firstName', e.target.value)} maxLength={50} />
                    </div>
                    <div>
                        <label style={labelStyle}>Last Name <span style={{ color: '#dc2626' }}>*</span></label>
                        <Input value={profile.lastName} onChange={e => updateProfile('lastName', e.target.value)} maxLength={50} />
                    </div>
                    <div>
                        <label style={labelStyle}>Preferred Name</label>
                        <Input value={profile.preferredName} onChange={e => updateProfile('preferredName', e.target.value)} maxLength={50} placeholder="e.g., Dr. Smith" />
                        <p style={helpStyle}>How you'd like to be addressed by students</p>
                    </div>
                    <div>
                        <label style={labelStyle}>
                            <Briefcase className="inline w-3.5 h-3.5 mr-1" style={{ verticalAlign: 'text-bottom' }} />
                            Title / Position
                        </label>
                        <Input value={profile.title} onChange={e => updateProfile('title', e.target.value)} maxLength={100} placeholder="e.g., Assistant Professor" />
                    </div>
                    <div>
                        <label style={labelStyle}>
                            <Building2 className="inline w-3.5 h-3.5 mr-1" style={{ verticalAlign: 'text-bottom' }} />
                            Department
                        </label>
                        <Input value={profile.department} onChange={e => updateProfile('department', e.target.value)} maxLength={100} />
                    </div>
                    <div>
                        <label style={labelStyle}>
                            <MapPin className="inline w-3.5 h-3.5 mr-1" style={{ verticalAlign: 'text-bottom' }} />
                            Office Location
                        </label>
                        <Input value={profile.officeLocation} onChange={e => updateProfile('officeLocation', e.target.value)} maxLength={100} placeholder="e.g., Brown Hall Room 305" />
                    </div>
                    <div className="col-span-2 max-w-[50%]">
                        <label style={labelStyle}>
                            <Phone className="inline w-3.5 h-3.5 mr-1" style={{ verticalAlign: 'text-bottom' }} />
                            Office Phone
                        </label>
                        <Input value={profile.officePhone} onChange={e => updateProfile('officePhone', e.target.value)} maxLength={20} placeholder="(XXX) XXX-XXXX" />
                    </div>
                </div>
                <div className="mt-4">
                    <label style={labelStyle}>Bio</label>
                    <Textarea
                        value={profile.bio}
                        onChange={e => { if (e.target.value.length <= 500) updateProfile('bio', e.target.value); }}
                        rows={4}
                        placeholder="Brief bio visible to students in your courses..."
                    />
                    <div className="flex justify-between mt-1">
                        <p style={helpStyle}>Tell students about your background, research interests, office hours</p>
                        <span style={{ fontSize: '12px', color: profile.bio.length >= 480 ? '#dc2626' : 'var(--color-text-light)' }}>{profile.bio.length} / 500</span>
                    </div>
                </div>
            </Card>

            {/* Institutional Information (read-only) */}
            <Card title="Institutional Information" subtitle="This information is managed by your institution and cannot be edited here.">
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <span style={readOnlyLabel}>Email</span>
                        <div className="flex items-center gap-2">
                            <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>sjohnson@ulm.edu</span>
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', fontSize: '11px', fontWeight: 600, color: '#166534' }}>
                                <CheckCircle2 className="w-3 h-3" />Verified
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <span style={readOnlyLabel}>Faculty ID</span>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>987654</span>
                    </div>
                    <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <span style={readOnlyLabel}>Institution</span>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>University of Louisiana Monroe</span>
                    </div>
                    <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <span style={readOnlyLabel}>Account Created</span>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>January 5, 2025</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span style={readOnlyLabel}>Last Login</span>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>February 19, 2026 at 10:30 AM CST</span>
                    </div>
                </div>
                <div className="mt-4 flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-text-light)' }} />
                    <p style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>
                        To update your email or institutional information, contact IT Support at{' '}
                        <a href="mailto:support@ulm.edu" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>support@ulm.edu</a>
                    </p>
                </div>
            </Card>
        </div>
    );

    /* ── Security ── */
    const renderSecurity = () => {
        const strength = getPasswordStrength(newPw);
        const reqs = [
            { label: 'At least 8 characters', met: newPw.length >= 8 },
            { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(newPw) },
            { label: 'One number (0-9)', met: /[0-9]/.test(newPw) },
            { label: 'One special character (!@#$%^&*)', met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPw) },
        ];
        const allReqsMet = reqs.every(r => r.met);
        const passwordsMatch = newPw === confirmPw && confirmPw.length > 0;
        const canSubmit = allReqsMet && passwordsMatch && currentPw.length > 0;

        return (
            <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>Security Settings</h2>
                <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '28px' }}>Manage your password and account security</p>

                <Card title="Change Password">
                    <div style={{ maxWidth: '480px' }} className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label style={labelStyle}>Current Password</label>
                            <div className="relative">
                                <Input
                                    type={showCurrentPw ? 'text' : 'password'}
                                    value={currentPw}
                                    onChange={e => { setCurrentPw(e.target.value); setPwError(''); }}
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    {showCurrentPw ? <EyeOff className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label style={labelStyle}>New Password</label>
                            <div className="relative">
                                <Input
                                    type={showNewPw ? 'text' : 'password'}
                                    value={newPw}
                                    onChange={e => { setNewPw(e.target.value); setPwError(''); }}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowNewPw(!showNewPw)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    {showNewPw ? <EyeOff className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        {newPw && (
                            <div className="space-y-1.5 pl-1">
                                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '6px' }}>Password Requirements:</p>
                                {reqs.map(r => (
                                    <div key={r.label} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" style={{ color: r.met ? '#2D6A2D' : '#8A8A8A' }} />
                                        <span style={{ fontSize: '13px', color: r.met ? '#2D6A2D' : '#8A8A8A' }}>{r.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div>
                            <label style={labelStyle}>Confirm New Password</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPw ? 'text' : 'password'}
                                    value={confirmPw}
                                    onChange={e => { setConfirmPw(e.target.value); setPwError(''); }}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    {showConfirmPw ? <EyeOff className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />}
                                </button>
                            </div>
                            {confirmPw && !passwordsMatch && (
                                <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>Passwords do not match</p>
                            )}
                        </div>

                        {/* Strength Meter */}
                        {newPw && (
                            <div>
                                <div className="flex gap-1" style={{ marginBottom: '6px' }}>
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                flex: 1, height: '6px', borderRadius: '3px',
                                                backgroundColor: i < strength.score ? strength.color : '#E5E7EB',
                                                transition: 'background-color 0.2s',
                                            }}
                                        />
                                    ))}
                                </div>
                                <p style={{ fontSize: '12px', color: strength.color, fontWeight: 500 }}>{strength.label}</p>
                            </div>
                        )}

                        {/* Sign out checkbox */}
                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="signOutOthers" checked={signOutOthers} onChange={e => setSignOutOthers(e.target.checked)} className="rounded" style={{ accentColor: 'var(--color-primary)' }} />
                            <label htmlFor="signOutOthers" style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>Sign out of all other devices after password change</label>
                        </div>
                        <p style={helpStyle}>Recommended if you suspect unauthorized access</p>

                        {pwError && <p style={{ fontSize: '13px', color: '#dc2626', fontWeight: 500 }}>{pwError}</p>}
                        {pwSuccess && <p style={{ fontSize: '13px', color: '#2D6A2D', fontWeight: 500 }}>Password updated successfully!</p>}

                        <Button
                            onClick={handlePasswordUpdate}
                            disabled={!canSubmit}
                            className="text-white"
                            style={{ backgroundColor: canSubmit ? 'var(--color-primary)' : undefined }}
                        >
                            Update Password
                        </Button>
                    </div>
                </Card>

                {/* 2FA Placeholder */}
                <Card title="Two-Factor Authentication" subtitle="Coming Soon">
                    <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                        <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-text-light)' }} />
                        <div>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>Add an extra layer of security to your account. Two-factor authentication will be available in a future update.</p>
                            <button style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500, marginTop: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>Learn More</button>
                        </div>
                    </div>
                </Card>

                {/* Password History */}
                <div className="flex items-center gap-2" style={{ padding: '0 4px' }}>
                    <Clock className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>Last password change: February 1, 2026</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>· Passwords should be changed every 90 days</span>
                </div>
            </div>
        );
    };

    /* ── Notifications ── */
    const renderNotifications = () => {
        const categories = [
            { name: 'Student Submissions', ids: ['newSubmission', 'lateSubmission', 'resubmission'] },
            { name: 'Grading Reminders', ids: ['pendingGrades', 'gradingDeadline'] },
            { name: 'Course Activity', ids: ['newEnrollment', 'studentDropped', 'assignmentDue'] },
            { name: 'System Updates', ids: ['newFeatures', 'maintenance', 'securityAlerts'] },
            { name: 'Weekly Summaries', ids: ['weeklySummary'] },
        ];

        return (
            <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>Notification Preferences</h2>
                <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '20px' }}>Choose what updates you receive via email and in-app notifications</p>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <Button variant="outline" size="sm" onClick={enableAllEmail}>
                        <ToggleRight className="w-4 h-4 mr-1" />Enable All Email
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDisableAllEmail(true)}>
                        <ToggleLeft className="w-4 h-4 mr-1" />Disable All Email
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetNotifDefaults}>Reset to Defaults</Button>
                </div>

                {/* Notification Categories */}
                {categories.map(cat => (
                    <Card key={cat.name} title={cat.name}>
                        <div className="space-y-0">
                            {cat.ids.map((id, i) => {
                                const n = notifications.find(x => x.id === id)!;
                                return (
                                    <div
                                        key={id}
                                        className="flex items-center justify-between py-3"
                                        style={i < cat.ids.length - 1 ? { borderBottom: '1px solid var(--color-border)' } : undefined}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>{n.label}</p>
                                            <p style={{ fontSize: '12px', color: 'var(--color-text-mid)', marginTop: '2px' }}>{n.description}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-light)', width: '40px' }}>Email</span>
                                                <Switch
                                                    checked={n.email}
                                                    onCheckedChange={() => toggleNotif(id, 'email')}
                                                    disabled={n.locked}
                                                    style={n.email ? { backgroundColor: 'var(--color-primary)' } : undefined}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-light)', width: '40px' }}>In-App</span>
                                                <Switch
                                                    checked={n.inApp}
                                                    onCheckedChange={() => toggleNotif(id, 'inApp')}
                                                    disabled={n.locked}
                                                    style={n.inApp ? { backgroundColor: 'var(--color-primary)' } : undefined}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                ))}

                {/* Email Digest */}
                <Card title="Email Digest Settings" subtitle="Instead of individual emails, receive a summary digest">
                    <div className="space-y-3">
                        {[
                            { value: 'individual', label: 'Send individual emails for each notification', desc: 'default' },
                            { value: 'daily', label: 'Daily digest', desc: 'once per day at 6 PM' },
                            { value: 'weekly', label: 'Weekly digest', desc: 'every Sunday at 6 PM' },
                        ].map(opt => (
                            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio" name="emailDigest" value={opt.value}
                                    checked={emailDigest === opt.value}
                                    onChange={() => setEmailDigest(opt.value)}
                                    style={{ accentColor: 'var(--color-primary)' }}
                                />
                                <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                                    {opt.label} <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>({opt.desc})</span>
                                </span>
                            </label>
                        ))}
                    </div>
                    <div className="mt-3 flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-text-light)' }} />
                        <p style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>Security alerts always send immediately and are not included in digests.</p>
                    </div>
                </Card>

                {/* Do Not Disturb */}
                <Card title="Do Not Disturb" subtitle="Pause non-urgent notifications during specific hours">
                    <div className="flex items-center gap-3 mb-4">
                        <Switch
                            checked={dndEnabled}
                            onCheckedChange={setDndEnabled}
                            style={dndEnabled ? { backgroundColor: 'var(--color-primary)' } : undefined}
                        />
                        <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>Enable Do Not Disturb</span>
                    </div>
                    {dndEnabled && (
                        <div className="space-y-4 pl-1">
                            <div className="flex items-center gap-3">
                                <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>Quiet hours:</span>
                                <Input value={dndStart} onChange={e => setDndStart(e.target.value)} style={{ width: '100px' }} placeholder="22:00" />
                                <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>to</span>
                                <Input value={dndEnd} onChange={e => setDndEnd(e.target.value)} style={{ width: '100px' }} placeholder="07:00" />
                            </div>
                            <div className="flex gap-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <button
                                        key={day}
                                        onClick={() => toggleDndDay(day)}
                                        className="rounded-full transition-colors"
                                        style={{
                                            padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none',
                                            backgroundColor: dndDays.includes(day) ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
                                            color: dndDays.includes(day) ? 'white' : 'var(--color-text-mid)',
                                        }}
                                    >{day}</button>
                                ))}
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Urgent notifications (security alerts) will still be delivered.</p>
                        </div>
                    )}
                </Card>
            </div>
        );
    };

    /* ── Preferences ── */
    const renderPreferences = () => (
        <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>Display Preferences</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '28px' }}>Customize your AutoGrade experience</p>

            {/* Appearance */}
            <Card title="Appearance">
                <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginBottom: '12px' }}>Theme</p>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { value: 'light', label: 'Light', icon: Sun, desc: 'White backgrounds, dark text' },
                        { value: 'dark', label: 'Dark', icon: Moon, desc: 'Dark backgrounds, light text' },
                        { value: 'system', label: 'System', icon: Monitor, desc: 'Match device settings' },
                    ].map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setTheme(opt.value)}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all"
                            style={{
                                cursor: 'pointer', background: 'var(--color-surface)',
                                borderColor: theme === opt.value ? 'var(--color-primary)' : 'var(--color-border)',
                                boxShadow: theme === opt.value ? '0 0 0 1px var(--color-primary)' : 'none',
                            }}
                        >
                            <opt.icon className="w-6 h-6" style={{ color: theme === opt.value ? 'var(--color-primary)' : 'var(--color-text-mid)' }} />
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-dark)' }}>{opt.label}</span>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-light)', textAlign: 'center' }}>{opt.desc}</span>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Language */}
            <Card title="Language">
                <div style={{ maxWidth: '320px' }}>
                    <label style={labelStyle}>Interface Language</label>
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="en-GB">English (UK)</SelectItem>
                            <SelectItem value="es">Spanish (Español)</SelectItem>
                            <SelectItem value="fr">French (Français)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p style={{ ...helpStyle, marginTop: '6px' }}>
                        <Info className="inline w-3 h-3 mr-1" style={{ verticalAlign: 'text-bottom' }} />
                        Language changes require page refresh
                    </p>
                </div>
            </Card>

            {/* Timezone */}
            <Card title="Timezone">
                <div style={{ maxWidth: '400px' }}>
                    <label style={labelStyle}>Timezone</label>
                    <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                            <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                        <Clock className="inline w-3.5 h-3.5 mr-1" style={{ verticalAlign: 'text-bottom' }} />
                        Current time: {new Date().toLocaleString('en-US', { timeZone: timezone, dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                    <p style={{ ...helpStyle, marginTop: '4px' }}>All dates and times will display in this timezone</p>
                </div>
            </Card>

            {/* Date & Time */}
            <Card title="Date & Time Format">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '10px' }}>Date Format</p>
                        {[
                            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '02/19/2026', desc: 'US format' },
                            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '19/02/2026', desc: 'International' },
                            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2026-02-19', desc: 'ISO format' },
                        ].map(opt => (
                            <label key={opt.value} className="flex items-center gap-3 py-1.5 cursor-pointer">
                                <input type="radio" name="dateFormat" value={opt.value} checked={dateFormat === opt.value} onChange={() => setDateFormat(opt.value)} style={{ accentColor: 'var(--color-primary)' }} />
                                <span style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>{opt.label} <span style={{ color: 'var(--color-text-light)' }}>({opt.example}) — {opt.desc}</span></span>
                            </label>
                        ))}
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '10px' }}>Time Format</p>
                        {[
                            { value: '12h', label: '12-hour', example: '2:30 PM' },
                            { value: '24h', label: '24-hour', example: '14:30' },
                        ].map(opt => (
                            <label key={opt.value} className="flex items-center gap-3 py-1.5 cursor-pointer">
                                <input type="radio" name="timeFormat" value={opt.value} checked={timeFormat === opt.value} onChange={() => setTimeFormat(opt.value)} style={{ accentColor: 'var(--color-primary)' }} />
                                <span style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>{opt.label} <span style={{ color: 'var(--color-text-light)' }}>({opt.example})</span></span>
                            </label>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Display Density */}
            <Card title="Display Density" subtitle="Adjust spacing and sizing of interface elements">
                <div className="space-y-2">
                    {[
                        { value: 'compact', label: 'Compact', desc: 'Tighter spacing, more content on screen' },
                        { value: 'comfortable', label: 'Comfortable', desc: 'Standard spacing (default)' },
                        { value: 'spacious', label: 'Spacious', desc: 'Larger elements, easier to read' },
                    ].map(opt => (
                        <label key={opt.value} className="flex items-center gap-3 py-1.5 cursor-pointer">
                            <input type="radio" name="density" value={opt.value} checked={density === opt.value} onChange={() => setDensity(opt.value)} style={{ accentColor: 'var(--color-primary)' }} />
                            <span style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>{opt.label} <span style={{ color: 'var(--color-text-light)' }}>— {opt.desc}</span></span>
                        </label>
                    ))}
                </div>
            </Card>

            {/* Accessibility */}
            <Card title="Accessibility">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Enable high contrast mode</p>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-mid)', marginTop: '2px' }}>Increases contrast for better readability</p>
                        </div>
                        <Switch checked={highContrast} onCheckedChange={setHighContrast} style={highContrast ? { backgroundColor: 'var(--color-primary)' } : undefined} />
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />
                    <div className="flex items-center justify-between">
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Reduce motion and animations</p>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-mid)', marginTop: '2px' }}>Minimizes transitions and effects</p>
                        </div>
                        <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} style={reduceMotion ? { backgroundColor: 'var(--color-primary)' } : undefined} />
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />
                    <div className="flex items-center justify-between">
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Enable keyboard navigation hints</p>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-mid)', marginTop: '2px' }}>Shows keyboard shortcuts and focus indicators</p>
                        </div>
                        <Switch checked={keyboardHints} onCheckedChange={setKeyboardHints} style={keyboardHints ? { backgroundColor: 'var(--color-primary)' } : undefined} />
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                <Type className="inline w-4 h-4 mr-1" style={{ verticalAlign: 'text-bottom' }} />
                                Font Size
                            </p>
                        </div>
                        <Select value={fontSize} onValueChange={setFontSize}>
                            <SelectTrigger style={{ width: '100px' }}><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12">12px</SelectItem>
                                <SelectItem value="14">14px</SelectItem>
                                <SelectItem value="16">16px</SelectItem>
                                <SelectItem value="18">18px</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>
        </div>
    );

    /* ── Connected Accounts ── */
    const renderConnected = () => (
        <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>Connected Accounts</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '28px' }}>Link external services to streamline your workflow</p>

            {/* Canvas LMS */}
            <Card>
                <div className="flex items-start gap-5">
                    <div
                        className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ width: '56px', height: '56px', backgroundColor: '#E74C3C', color: 'white', fontSize: '11px', fontWeight: 700, textAlign: 'center', lineHeight: '1.2' }}
                    >
                        Canvas<br />LMS
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-dark)' }}>Canvas LMS</h4>
                            {canvasConnected && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', fontSize: '11px', fontWeight: 600, color: '#166534' }}>
                                    <CheckCircle2 className="w-3 h-3" />Connected
                                </span>
                            )}
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginBottom: '12px' }}>
                            {canvasConnected ? 'Import course rosters and sync grades' : 'Connect Canvas to import rosters and sync grades automatically'}
                        </p>
                        {canvasConnected ? (
                            <div>
                                <div className="space-y-1 mb-3" style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                    <p>Connected to: <span style={{ color: 'var(--color-text-dark)', fontWeight: 500 }}>canvas.ulm.edu</span></p>
                                    <p>Account: <span style={{ color: 'var(--color-text-dark)', fontWeight: 500 }}>sjohnson@ulm.edu</span></p>
                                    <p>Last synced: <span style={{ color: 'var(--color-text-dark)', fontWeight: 500 }}>February 19, 2026 at 10:30 AM</span></p>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline" size="sm"
                                        disabled={canvasSyncing}
                                        onClick={() => {
                                            setCanvasSyncing(true);
                                            setTimeout(() => { setCanvasSyncing(false); setToast('Canvas sync completed. 142 students imported, 85 grades uploaded'); }, 1500);
                                        }}
                                    >
                                        {canvasSyncing ? 'Syncing...' : 'Sync Now'}
                                    </Button>
                                    <button
                                        onClick={() => setDisconnectCanvas(true)}
                                        style={{ fontSize: '13px', color: '#8B0000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Button onClick={() => { setCanvasConnected(true); setToast('Canvas connected successfully'); }} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                                <Link2 className="w-4 h-4 mr-2" />Connect Canvas
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Google Drive (Coming Soon) */}
            <Card>
                <div className="flex items-start gap-5">
                    <div
                        className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ width: '56px', height: '56px', backgroundColor: '#4285F4', color: 'white', fontSize: '11px', fontWeight: 700, textAlign: 'center', lineHeight: '1.2' }}
                    >
                        Google<br />Drive
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-dark)' }}>Google Drive</h4>
                            <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-surface-elevated)', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-light)' }}>
                                Coming Soon
                            </span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginBottom: '12px' }}>Backup assignment files and student submissions to Google Drive</p>
                        <button style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Learn More</button>
                    </div>
                </div>
            </Card>
        </div>
    );

    /* ── Privacy ── */
    const renderPrivacy = () => (
        <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>Privacy & Data</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '28px' }}>Control your data and privacy settings</p>

            {/* Profile Visibility */}
            <Card title="Profile Visibility" subtitle="Control what information is visible to students">
                <div className="space-y-3">
                    {[
                        { label: 'Show profile photo to students', checked: showPhoto, onChange: setShowPhoto },
                        { label: 'Show office location to students', checked: showOffice, onChange: setShowOffice },
                        { label: 'Show office phone to students', checked: showPhone, onChange: setShowPhone },
                        { label: 'Show bio to students', checked: showBio, onChange: setShowBio },
                        { label: 'Show email address to students (institutional email only)', checked: showEmail, onChange: setShowEmail },
                    ].map(item => (
                        <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={item.checked} onChange={e => item.onChange(e.target.checked)} style={{ accentColor: 'var(--color-primary)' }} className="rounded" />
                            <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>{item.label}</span>
                        </label>
                    ))}
                </div>
                <div className="mt-4 flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-text-light)' }} />
                    <p style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>Your name is always visible to enrolled students.</p>
                </div>
            </Card>

            {/* Data Export */}
            <Card title="Export Your Data" subtitle="Download a copy of your AutoGrade data">
                <div className="space-y-2 mb-4" style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                    <p>Includes:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Profile information</li>
                        <li>Course data (assignments, rubrics, settings)</li>
                        <li>Student submissions and grades</li>
                        <li>Activity logs</li>
                    </ul>
                    <p style={{ marginTop: '8px', fontWeight: 500 }}>Format: ZIP file containing JSON and CSV files</p>
                </div>
                <Button variant="outline" onClick={() => setExportOpen(true)}>
                    <Download className="w-4 h-4 mr-2" />Request Data Export
                </Button>
                <p style={{ ...helpStyle, marginTop: '8px' }}>
                    <Info className="inline w-3 h-3 mr-1" style={{ verticalAlign: 'text-bottom' }} />
                    Exports can take up to 24 hours for large accounts
                </p>
            </Card>

            {/* Activity Log */}
            <Card title="Recent Activity" subtitle="View your recent AutoGrade activity">
                <div className="space-y-0">
                    {mockActivities.map((a, i) => (
                        <div key={i} className="flex items-center justify-between py-2.5" style={i < mockActivities.length - 1 ? { borderBottom: '1px solid var(--color-border)' } : undefined}>
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-text-light)' }} />
                                <span style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>{a.action}</span>
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-light)', whiteSpace: 'nowrap' }}>{a.date}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Data Retention */}
            <Card title="Data Retention">
                <div className="flex items-center gap-3">
                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>Student submission data retention:</span>
                    <Select value={dataRetention} onValueChange={setDataRetention}>
                        <SelectTrigger style={{ width: '160px' }}><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                            <SelectItem value="forever">Indefinitely</SelectItem>
                        </SelectContent>
                    </Select>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>after course ends</span>
                </div>
                <div className="mt-3 flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-text-light)' }} />
                    <p style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>
                        Grades and course records are retained indefinitely per institutional policy, regardless of this setting.
                    </p>
                </div>
            </Card>
        </div>
    );

    /* ── Sessions ── */
    const renderSessions = () => {
        const getDeviceIcon = (icon: Session['icon']) => {
            if (icon === 'mobile') return <Smartphone className="w-5 h-5" style={{ color: 'var(--color-text-mid)' }} />;
            if (icon === 'laptop') return <Laptop className="w-5 h-5" style={{ color: 'var(--color-text-mid)' }} />;
            return <Monitor className="w-5 h-5" style={{ color: 'var(--color-text-mid)' }} />;
        };

        const currentSession = sessions.find(s => s.current);
        const otherSessions = sessions.filter(s => !s.current);

        return (
            <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>Active Sessions</h2>
                <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '28px' }}>Manage devices where you're signed in</p>

                {/* Current Session */}
                {currentSession && (
                    <Card>
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center rounded-lg" style={{ width: '48px', height: '48px', backgroundColor: '#dcfce7' }}>
                                {getDeviceIcon(currentSession.icon)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                        {currentSession.device} — {currentSession.browser} on {currentSession.os}
                                    </h4>
                                    <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', fontSize: '11px', fontWeight: 600, color: '#166534' }}>
                                        Current Session
                                    </span>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>{currentSession.location}</p>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '2px' }}>IP: {currentSession.ip} · {currentSession.lastActive}</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Other Sessions */}
                {otherSessions.length > 0 && (
                    <Card title="Other Sessions">
                        <div className="space-y-0">
                            {otherSessions.map((s, i) => (
                                <div key={s.id} className="flex items-start gap-4 py-4" style={i < otherSessions.length - 1 ? { borderBottom: '1px solid var(--color-border)' } : undefined}>
                                    <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-surface-elevated)' }}>
                                        {getDeviceIcon(s.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '2px' }}>
                                            {s.device} — {s.browser} on {s.os}
                                        </h4>
                                        <p style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>{s.location}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '2px' }}>Last active: {s.lastActive}</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => signOutSession(s.id)} className="flex-shrink-0 mt-1">
                                        Sign Out
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                            <Button variant="outline" onClick={() => setSignOutAllOpen(true)} style={{ color: '#8B0000', borderColor: '#8B0000' }}>
                                Sign Out All Other Devices
                            </Button>
                        </div>
                    </Card>
                )}

                {otherSessions.length === 0 && (
                    <Card>
                        <div className="text-center py-6">
                            <Monitor className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-text-light)' }} />
                            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>No other active sessions</p>
                        </div>
                    </Card>
                )}

                {/* Login Alerts */}
                <Card title="Login Alerts">
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={loginAlertDevice} onChange={e => setLoginAlertDevice(e.target.checked)} style={{ accentColor: 'var(--color-primary)' }} className="rounded" />
                            <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>Email me when there's a login from a new device</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={loginAlertLocation} onChange={e => setLoginAlertLocation(e.target.checked)} style={{ accentColor: 'var(--color-primary)' }} className="rounded" />
                            <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>Email me when there's a login from a new location</span>
                        </label>
                    </div>
                    <div className="mt-4 flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-text-light)' }} />
                        <p style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>We always alert you for suspicious activity regardless of this setting (e.g., impossible travel, unusual access patterns).</p>
                    </div>
                </Card>
            </div>
        );
    };

    /* ── Danger Zone ── */
    const renderDangerZone = () => (
        <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#8B0000', marginBottom: '4px' }}>Danger Zone</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '28px' }}>Irreversible actions that affect your account</p>

            <Card title="Deactivate Account" danger>
                <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginBottom: '12px' }}>Temporarily disable your account. You can reactivate later.</p>
                <div className="space-y-1.5 mb-4" style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                    <p>When deactivated:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You won't be able to log in</li>
                        <li>Your courses will remain visible to students</li>
                        <li>Your profile will be hidden</li>
                        <li>All data is preserved</li>
                    </ul>
                </div>
                <Button onClick={() => setDeactivateOpen(true)} style={{ backgroundColor: '#8B0000', color: 'white' }}>
                    Deactivate Account
                </Button>
            </Card>

            <Card title="Delete Account" danger>
                <div className="flex items-start gap-2 p-3 rounded-lg mb-4" style={{ backgroundColor: '#fef2f2' }}>
                    <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>PERMANENT — This action cannot be undone</p>
                </div>
                <div className="space-y-1.5 mb-4" style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                    <p>When deleted:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Your account and profile are permanently removed</li>
                        <li>Your courses are archived (visible to admin only)</li>
                        <li>Student grades are preserved per institutional policy</li>
                        <li>All other data is deleted after 30-day grace period</li>
                    </ul>
                </div>
                <Button onClick={() => setDeleteOpen(true)} style={{ backgroundColor: '#dc2626', color: 'white' }}>
                    <Trash2 className="w-4 h-4 mr-2" />Delete Account
                </Button>
            </Card>
        </div>
    );

    /* ═══════════════════════════════════════════
       Section router
       ═══════════════════════════════════════════ */

    const renderSection = () => {
        switch (activeSection) {
            case 'profile': return renderProfile();
            case 'security': return renderSecurity();
            case 'notifications': return renderNotifications();
            case 'preferences': return renderPreferences();
            case 'connected': return renderConnected();
            case 'privacy': return renderPrivacy();
            case 'sessions': return renderSessions();
            case 'danger': return renderDangerZone();
        }
    };

    /* ═══════════════════════════════════════════
       MAIN RENDER
       ═══════════════════════════════════════════ */

    return (
        <PageLayout>
            <TopNav breadcrumbs={[{ label: 'My Courses', href: '/courses' }, { label: 'Account Settings' }]} />

            <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
                {/* ── LEFT SIDEBAR ── */}
                <aside
                    className="flex-shrink-0"
                    style={{
                        width: '260px',
                        backgroundColor: 'var(--color-surface)',
                        borderRight: '1px solid var(--color-border)',
                        padding: '24px 0',
                    }}
                >
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-dark)', padding: '0 20px', marginBottom: '16px' }}>
                        Account Settings
                    </h2>
                    <nav className="space-y-1">
                        {sections.map(s => {
                            const isActive = activeSection === s.id;
                            const Icon = s.icon;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSection(s.id)}
                                    className="w-full flex items-center gap-3 transition-colors"
                                    style={{
                                        padding: '10px 20px',
                                        fontSize: '14px',
                                        fontWeight: isActive ? 600 : 400,
                                        color: s.id === 'danger'
                                            ? (isActive ? '#8B0000' : '#991b1b')
                                            : (isActive ? 'var(--color-primary)' : 'var(--color-text-mid)'),
                                        backgroundColor: isActive
                                            ? (s.id === 'danger' ? '#fef2f2' : 'rgba(107, 0, 0, 0.06)')
                                            : 'transparent',
                                        borderLeft: isActive ? `3px solid ${s.id === 'danger' ? '#8B0000' : 'var(--color-primary)'}` : '3px solid transparent',
                                        cursor: 'pointer',
                                        border: 'none',
                                        borderLeftWidth: '3px',
                                        borderLeftStyle: 'solid',
                                        borderLeftColor: isActive ? (s.id === 'danger' ? '#8B0000' : 'var(--color-primary)') : 'transparent',
                                        textAlign: 'left',
                                    }}
                                >
                                    <Icon className="w-[20px] h-[20px]" />
                                    {s.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* ── RIGHT CONTENT ── */}
                <main className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: hasChanges ? '80px' : '24px' }}>
                        {renderSection()}
                    </div>
                </main>
            </div>

            {/* ── STICKY SAVE BAR ── */}
            {hasChanges && (
                <div
                    className="fixed bottom-0 left-0 right-0 flex items-center justify-center"
                    style={{
                        height: '64px',
                        backgroundColor: 'var(--color-surface)',
                        borderTop: '2px solid var(--color-primary)',
                        boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
                        zIndex: 1001,
                    }}
                >
                    <div className="flex items-center justify-between w-full" style={{ maxWidth: '800px', padding: '0 24px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#595959' }}>You have unsaved changes</span>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleDiscard}>Discard Changes</Button>
                            <Button onClick={handleSave} disabled={saving} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── TOAST ── */}
            {toast && (
                <div
                    className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg"
                    style={{ backgroundColor: 'var(--color-text-dark)', color: 'white', zIndex: 1100, fontSize: '14px', fontWeight: 500 }}
                >
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#4ade80' }} />
                    {toast}
                    <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', marginLeft: '8px' }}>
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* ═══ MODALS ═══ */}

            {/* Disconnect Canvas */}
            <Dialog open={disconnectCanvas} onOpenChange={setDisconnectCanvas}>
                <DialogContent style={{ maxWidth: '460px' }}>
                    <DialogHeader>
                        <DialogTitle>Disconnect Canvas?</DialogTitle>
                        <DialogDescription className="space-y-3 pt-2">
                            <span>Disconnecting Canvas will:</span>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Stop automatic roster imports</li>
                                <li>Stop grade syncing to Canvas gradebook</li>
                                <li>Remove stored Canvas access tokens</li>
                            </ul>
                            <span className="block">Your existing AutoGrade courses and data will not be affected. You can reconnect Canvas at any time.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setDisconnectCanvas(false)}>Cancel</Button>
                        <Button onClick={() => { setCanvasConnected(false); setDisconnectCanvas(false); setToast('Canvas disconnected'); }} style={{ backgroundColor: '#dc2626', color: 'white' }}>
                            Disconnect Canvas
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Sign Out All */}
            <Dialog open={signOutAllOpen} onOpenChange={setSignOutAllOpen}>
                <DialogContent style={{ maxWidth: '420px' }}>
                    <DialogHeader>
                        <DialogTitle>Sign out of all devices?</DialogTitle>
                        <DialogDescription>
                            This will sign you out of all devices except this one. You'll need to log in again on those devices.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setSignOutAllOpen(false)}>Cancel</Button>
                        <Button onClick={signOutAllOthers} style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                            Sign Out All
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Disable All Email */}
            <Dialog open={disableAllEmail} onOpenChange={setDisableAllEmail}>
                <DialogContent style={{ maxWidth: '440px' }}>
                    <DialogHeader>
                        <DialogTitle>Disable all email notifications?</DialogTitle>
                        <DialogDescription>
                            You may miss important updates about submissions and course activity. Security alerts will remain enabled.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setDisableAllEmail(false)}>Cancel</Button>
                        <Button onClick={disableAllEmailConfirmed} style={{ backgroundColor: '#dc2626', color: 'white' }}>Disable All</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Data Export */}
            <Dialog open={exportOpen} onOpenChange={setExportOpen}>
                <DialogContent style={{ maxWidth: '440px' }}>
                    <DialogHeader>
                        <DialogTitle>Request data export?</DialogTitle>
                        <DialogDescription>
                            We'll email you a download link when your export is ready (typically within 24 hours). The link will expire after 7 days.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setExportOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setExportOpen(false); setToast('Data export requested. You\'ll receive an email when it\'s ready.'); }} className="text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                            <Download className="w-4 h-4 mr-2" />Request Export
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Deactivate Account */}
            <Dialog open={deactivateOpen} onOpenChange={(open) => { setDeactivateOpen(open); if (!open) setDeactivateText(''); }}>
                <DialogContent style={{ maxWidth: '480px' }}>
                    <DialogHeader>
                        <DialogTitle>Deactivate Your Account?</DialogTitle>
                        <DialogDescription asChild>
                            <div className="space-y-3 pt-2">
                                <p>Are you sure you want to deactivate your account?</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>You won't be able to log in until you reactivate</li>
                                    <li>Your courses and student data will remain intact</li>
                                    <li>Students will see "Instructor temporarily unavailable"</li>
                                    <li>You can reactivate by contacting IT Support</li>
                                </ul>
                                <p className="font-medium pt-2">To confirm, type <span className="font-mono font-bold">DEACTIVATE</span> below:</p>
                                <Input value={deactivateText} onChange={e => setDeactivateText(e.target.value)} placeholder="Type DEACTIVATE" />
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => { setDeactivateOpen(false); setDeactivateText(''); }}>Cancel</Button>
                        <Button
                            disabled={deactivateText !== 'DEACTIVATE'}
                            onClick={() => { setDeactivateOpen(false); setDeactivateText(''); setToast('Account deactivated. Contact support@ulm.edu to reactivate.'); }}
                            style={{ backgroundColor: deactivateText === 'DEACTIVATE' ? '#8B0000' : undefined, color: deactivateText === 'DEACTIVATE' ? 'white' : undefined }}
                        >
                            Deactivate Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Account */}
            <Dialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) { setDeleteEmail(''); setDeleteConfirm(false); } }}>
                <DialogContent style={{ maxWidth: '520px' }}>
                    <DialogHeader>
                        <DialogTitle style={{ color: '#dc2626' }}>Delete Your Account?</DialogTitle>
                        <DialogDescription asChild>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: '#fef2f2' }}>
                                    <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />
                                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#991b1b' }}>THIS ACTION IS PERMANENT AND CANNOT BE UNDONE</p>
                                </div>
                                <p>Deleting your account will:</p>
                                <ol className="list-decimal pl-5 space-y-1">
                                    <li>Permanently delete your profile and personal data</li>
                                    <li>Archive all your courses (admin access only)</li>
                                    <li>Preserve student grades per institutional requirements</li>
                                    <li>Delete all assignments, rubrics, and test data after 30 days</li>
                                </ol>
                                <p className="font-medium">Before deleting, consider:</p>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>Deactivating your account instead (reversible)</li>
                                    <li>Exporting your data for records</li>
                                    <li>Transferring course ownership to another faculty member</li>
                                </ul>
                                <p className="font-medium pt-2">To proceed, type your email address below:</p>
                                <Input value={deleteEmail} onChange={e => setDeleteEmail(e.target.value)} placeholder="sjohnson@ulm.edu" />
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={deleteConfirm} onChange={e => setDeleteConfirm(e.target.checked)} style={{ accentColor: '#dc2626' }} />
                                    <span style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>I understand this action is permanent and cannot be undone</span>
                                </label>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => { setDeleteOpen(false); setDeleteEmail(''); setDeleteConfirm(false); }}>Cancel</Button>
                        <Button
                            disabled={deleteEmail !== 'sjohnson@ulm.edu' || !deleteConfirm}
                            onClick={() => { setDeleteOpen(false); setDeleteEmail(''); setDeleteConfirm(false); setToast('Account deletion scheduled. You have 30 days to cancel via email.'); }}
                            style={{
                                backgroundColor: (deleteEmail === 'sjohnson@ulm.edu' && deleteConfirm) ? '#dc2626' : undefined,
                                color: (deleteEmail === 'sjohnson@ulm.edu' && deleteConfirm) ? 'white' : undefined,
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />Delete My Account Forever
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}

/* ═══════════════════════════════════════════
   Shared styles
   ═══════════════════════════════════════════ */

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text-dark)',
    marginBottom: '6px',
};

const helpStyle: React.CSSProperties = {
    fontSize: '12px',
    color: 'var(--color-text-light)',
    marginTop: '4px',
};

const readOnlyLabel: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--color-text-mid)',
};
