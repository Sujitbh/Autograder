import { useState } from 'react';
import { Save, Shield, Bell, Clock, Globe, Palette, Users, FileText, AlertTriangle, Check, Eye, EyeOff, Upload, Edit, Plus, Copy, RefreshCw, Info, Link2 } from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Sidebar } from './Sidebar';
import { useParams } from 'next/navigation';
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';

/* ── Course code generator (same as CoursesLanding) ── */
const CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateCourseCode(): string {
    let code = '';
    for (let i = 0; i < 7; i++) {
        code += CODE_CHARSET[Math.floor(Math.random() * CODE_CHARSET.length)];
    }
    return code;
}

function lookupCourseCode(id: string) {
    try { const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]'); const f = s.find((c: any) => c.id === id); if (f) return f.code; } catch { } return id;
}

function lookupCourseData(id: string) {
    try {
        const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]');
        const f = s.find((c: any) => c.id === id);
        if (f) return f;
    } catch { }
    return null;
}

export function SettingsPage() {
    const { courseId } = useParams() as { courseId: string };
    const courseData = lookupCourseData(courseId ?? '');
    const courseCode = courseData?.code ?? courseId ?? '';
    const [activeSection, setActiveSection] = useState('general');
    const [saved, setSaved] = useState(false);
    const [latePolicy, setLatePolicy] = useState(true);
    const [notifications, setNotifications] = useState({
        newSubmission: true,
        lateSubmission: true,
        gradePublished: false,
        aiDetection: true,
        courseUpdates: true,
    });

    /* ── Enrollment code state ── */
    const [enrollmentCode, setEnrollmentCode] = useState(courseData?.enrollmentCode || generateCourseCode());
    const [codeActive, setCodeActive] = useState(courseData?.enrollmentCodeActive ?? true);
    const [codeCopied, setCodeCopied] = useState(false);
    const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const sections = [
        { id: 'general', icon: FileText, label: 'General' },
        { id: 'grading', icon: Shield, label: 'Grading Policy' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'deadlines', icon: Clock, label: 'Deadlines & Extensions' },
        { id: 'enrollment', icon: Link2, label: 'Enrollment' },
        { id: 'access', icon: Users, label: 'Access & Permissions' },
    ];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const copyEnrollmentCode = () => {
        navigator.clipboard.writeText(enrollmentCode).then(() => {
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), 3000);
        });
    };

    const handleRegenerateCode = () => {
        setIsRegenerating(true);
        setTimeout(() => {
            setEnrollmentCode(generateCourseCode());
            setIsRegenerating(false);
            setShowRegenerateDialog(false);
        }, 600);
    };

    return (
        <PageLayout>
            <TopNav breadcrumbs={[
                { label: 'Courses', href: '/courses' },
                { label: courseCode },
                { label: 'Settings' }
            ]} />

            <div className="flex h-[calc(100vh-64px)]">
                <Sidebar activeItem="settings" />

                <main className="flex-1 overflow-auto p-8">
                    {/* Page Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                                Settings
                            </h1>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                                Configure course preferences and policies
                            </p>
                        </div>
                        <Button
                            onClick={handleSave}
                            className="text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            {saved ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="flex gap-8">
                        {/* Settings Navigation */}
                        <nav className="w-56 flex-shrink-0">
                            <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                                            style={{
                                                backgroundColor: activeSection === section.id ? 'var(--color-primary-bg)' : 'transparent',
                                                color: activeSection === section.id ? 'var(--color-primary)' : 'var(--color-text-mid)',
                                                borderLeft: activeSection === section.id ? '3px solid var(--color-primary)' : '3px solid transparent',
                                            }}
                                        >
                                            <Icon className="w-4 h-4 flex-shrink-0" />
                                            <span style={{ fontSize: '14px', fontWeight: activeSection === section.id ? 500 : 400 }}>
                                                {section.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* Settings Content */}
                        <div className="flex-1 max-w-3xl">
                            {/* General Settings */}
                            {activeSection === 'general' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            Course Information
                                        </h2>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    Course Name
                                                </label>
                                                <Input
                                                    defaultValue={courseData?.title || 'Introduction to Computer Science'}
                                                    className="border-[var(--color-border)]"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Course Code
                                                    </label>
                                                    <Input
                                                        defaultValue={courseData?.code || 'CS-1001'}
                                                        className="border-[var(--color-border)]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Section
                                                    </label>
                                                    <Input
                                                        defaultValue={courseData?.section || '001'}
                                                        className="border-[var(--color-border)]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Semester
                                                    </label>
                                                    <Select defaultValue={courseData?.semester ? courseData.semester.toLowerCase().replace(' ', '-') : 'spring-2026'}>
                                                        <SelectTrigger className="w-full border-[var(--color-border)]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="spring-2026">Spring 2026</SelectItem>
                                                            <SelectItem value="fall-2025">Fall 2025</SelectItem>
                                                            <SelectItem value="summer-2025">Summer 2025</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Programming Language
                                                    </label>
                                                    <Select defaultValue="python">
                                                        <SelectTrigger className="w-full border-[var(--color-border)]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="python">Python</SelectItem>
                                                            <SelectItem value="java">Java</SelectItem>
                                                            <SelectItem value="cpp">C++</SelectItem>
                                                            <SelectItem value="javascript">JavaScript</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    Course Description
                                                </label>
                                                <Textarea
                                                    defaultValue={courseData?.description || 'An introductory course covering fundamental programming concepts using Python. Topics include variables, control flow, functions, object-oriented programming, and basic data structures.'}
                                                    rows={4}
                                                    className="border-[var(--color-border)]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            Course Schedule
                                        </h2>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    Start Date
                                                </label>
                                                <Input
                                                    type="date"
                                                    defaultValue="2026-01-12"
                                                    className="border-[var(--color-border)]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    End Date
                                                </label>
                                                <Input
                                                    type="date"
                                                    defaultValue="2026-05-08"
                                                    className="border-[var(--color-border)]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Grading Policy */}
                            {activeSection === 'grading' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            Grading Scale
                                        </h2>

                                        <div className="space-y-3">
                                            {[
                                                { grade: 'A', min: 90, max: 100 },
                                                { grade: 'B', min: 80, max: 89 },
                                                { grade: 'C', min: 70, max: 79 },
                                                { grade: 'D', min: 60, max: 69 },
                                                { grade: 'F', min: 0, max: 59 },
                                            ].map((scale) => (
                                                <div key={scale.grade} className="flex items-center gap-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                                                    <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', width: '32px' }}>
                                                        {scale.grade}
                                                    </span>
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <Input
                                                            type="number"
                                                            defaultValue={scale.min}
                                                            className="w-20 border-[var(--color-border)]"
                                                            min={0}
                                                            max={100}
                                                        />
                                                        <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>to</span>
                                                        <Input
                                                            type="number"
                                                            defaultValue={scale.max}
                                                            className="w-20 border-[var(--color-border)]"
                                                            min={0}
                                                            max={100}
                                                        />
                                                        <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            AI Detection Settings
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                                                <div>
                                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Enable AI-Generated Code Detection
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                        Flag submissions with patterns matching AI-generated code
                                                    </p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                                                <div>
                                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Enable Plagiarism Detection
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                        Cross-reference submissions for code similarity
                                                    </p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>

                                            <div>
                                                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    Similarity Threshold (%)
                                                </label>
                                                <Input
                                                    type="number"
                                                    defaultValue={70}
                                                    className="w-32 border-[var(--color-border)]"
                                                    min={0}
                                                    max={100}
                                                />
                                                <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                    Submissions above this threshold will be flagged for review
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            Auto-Grading
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                                                <div>
                                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Run Test Cases Automatically
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                        Execute test cases upon submission
                                                    </p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                                                <div>
                                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Auto-Publish Grades
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                        Automatically publish grades when all test cases pass
                                                    </p>
                                                </div>
                                                <Switch />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications */}
                            {activeSection === 'notifications' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            Email Notifications
                                        </h2>

                                        <div className="space-y-1">
                                            {[
                                                { key: 'newSubmission', label: 'New Submission', desc: 'Receive an email when a student submits an assignment' },
                                                { key: 'lateSubmission', label: 'Late Submission', desc: 'Get notified when a student submits past the deadline' },
                                                { key: 'gradePublished', label: 'Grade Published', desc: 'Confirmation when grades are published to students' },
                                                { key: 'aiDetection', label: 'AI Detection Alert', desc: 'Get alerted when AI-generated code is detected' },
                                                { key: 'courseUpdates', label: 'Course Updates', desc: 'Receive updates about course enrollment changes' },
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg hover:bg-[var(--color-primary-bg)] transition-colors">
                                                    <div>
                                                        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                            {item.label}
                                                        </p>
                                                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '2px' }}>
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        defaultChecked={notifications[item.key as keyof typeof notifications]}
                                                        onCheckedChange={(checked) =>
                                                            setNotifications(prev => ({ ...prev, [item.key]: checked }))
                                                        }
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            Notification Preferences
                                        </h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    Email Digest Frequency
                                                </label>
                                                <Select defaultValue="realtime">
                                                    <SelectTrigger className="w-full md:w-64 border-[var(--color-border)]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="realtime">Real-time</SelectItem>
                                                        <SelectItem value="daily">Daily Digest</SelectItem>
                                                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                                                        <SelectItem value="none">None</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    Quiet Hours
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <Input type="time" defaultValue="22:00" className="w-36 border-[var(--color-border)]" />
                                                    <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>to</span>
                                                    <Input type="time" defaultValue="08:00" className="w-36 border-[var(--color-border)]" />
                                                </div>
                                                <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                    No notifications will be sent during quiet hours
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Deadlines & Extensions */}
                            {activeSection === 'deadlines' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            Late Submission Policy
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                                                <div>
                                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Accept Late Submissions
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                        Allow students to submit after the deadline
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={latePolicy}
                                                    onCheckedChange={setLatePolicy}
                                                />
                                            </div>

                                            {latePolicy && (
                                                <div className="space-y-4 ml-2 pl-4" style={{ borderLeft: '2px solid var(--color-border)' }}>
                                                    <div>
                                                        <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                            Penalty per Day (%)
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            defaultValue={10}
                                                            className="w-32 border-[var(--color-border)]"
                                                            min={0}
                                                            max={100}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                            Maximum Late Days
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            defaultValue={3}
                                                            className="w-32 border-[var(--color-border)]"
                                                            min={0}
                                                            max={30}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                            Grace Period (hours)
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            defaultValue={1}
                                                            className="w-32 border-[var(--color-border)]"
                                                            min={0}
                                                            max={48}
                                                        />
                                                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                            Submissions within the grace period won't incur a penalty
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            Default Assignment Duration
                                        </h2>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    Default Duration
                                                </label>
                                                <Select defaultValue="7">
                                                    <SelectTrigger className="w-full border-[var(--color-border)]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="3">3 days</SelectItem>
                                                        <SelectItem value="5">5 days</SelectItem>
                                                        <SelectItem value="7">7 days (1 week)</SelectItem>
                                                        <SelectItem value="14">14 days (2 weeks)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    Default Due Time
                                                </label>
                                                <Input
                                                    type="time"
                                                    defaultValue="23:59"
                                                    className="border-[var(--color-border)]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            Submission Limits
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                                                <div>
                                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Allow Multiple Submissions
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                        Students can resubmit assignments before deadline
                                                    </p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>

                                            <div>
                                                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    Max Attempts per Assignment
                                                </label>
                                                <Select defaultValue="unlimited">
                                                    <SelectTrigger className="w-full md:w-48 border-[var(--color-border)]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">1 attempt</SelectItem>
                                                        <SelectItem value="3">3 attempts</SelectItem>
                                                        <SelectItem value="5">5 attempts</SelectItem>
                                                        <SelectItem value="10">10 attempts</SelectItem>
                                                        <SelectItem value="unlimited">Unlimited</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ═══════════ Enrollment ═══════════ */}
                            {activeSection === 'enrollment' && (
                                <div className="space-y-6">
                                    {/* Course Code Card */}
                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                                    Course Enrollment Code
                                                </h2>
                                                <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
                                                    Students use this code to join your course on AutoGrade
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span style={{ fontSize: '12px', fontWeight: 500, color: codeActive ? '#2D6A2D' : '#B91C1C' }}>
                                                    {codeActive ? 'Active' : 'Disabled'}
                                                </span>
                                                <Switch
                                                    checked={codeActive}
                                                    onCheckedChange={setCodeActive}
                                                />
                                            </div>
                                        </div>

                                        {/* Large Code Display */}
                                        <div
                                            className="relative rounded-xl text-center p-8 mb-6"
                                            style={{
                                                backgroundColor: codeActive ? '#F5EDED' : '#F5F5F5',
                                                border: `2px solid ${codeActive ? '#6B0000' : '#D1D5DB'}`,
                                                opacity: codeActive ? 1 : 0.6,
                                            }}
                                        >
                                            {!codeActive && (
                                                <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
                                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#B91C1C' }}>Code is currently disabled — students cannot use it to join</p>
                                                </div>
                                            )}
                                            <p style={{ fontSize: '12px', fontWeight: 500, color: '#6B0000', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                Course Code
                                            </p>
                                            <p style={{
                                                fontSize: '48px',
                                                fontWeight: 700,
                                                color: '#6B0000',
                                                letterSpacing: '8px',
                                                fontFamily: 'monospace',
                                            }}>
                                                {enrollmentCode}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={copyEnrollmentCode}
                                                className="flex-1"
                                                style={{ borderColor: '#6B0000', color: '#6B0000' }}
                                            >
                                                {codeCopied ? (
                                                    <><Check className="w-4 h-4 mr-2" /> Copied!</>
                                                ) : (
                                                    <><Copy className="w-4 h-4 mr-2" /> Copy Code</>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowRegenerateDialog(true)}
                                                className="flex-1 border-[var(--color-border)]"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" /> Regenerate Code
                                            </Button>
                                        </div>

                                        {/* Warning */}
                                        <div className="flex items-start gap-3 mt-4 p-3 rounded-lg" style={{ backgroundColor: '#FFF3E0' }}>
                                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#8A5700' }} />
                                            <p style={{ fontSize: '12px', color: '#8A5700' }}>
                                                Regenerating the code will invalidate the previous one. Students who haven't joined yet will need the new code.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Enrollment Statistics */}
                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '20px' }}>
                                            Enrollment Statistics
                                        </h2>

                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            {[
                                                { label: 'Total Enrolled', value: 32, color: '#6B0000' },
                                                { label: 'Joined via Code', value: 28, color: '#2D6A2D' },
                                                { label: 'Manually Added', value: 4, color: '#1A4D7A' },
                                            ].map((stat) => (
                                                <div
                                                    key={stat.label}
                                                    className="text-center p-4 rounded-lg"
                                                    style={{ backgroundColor: 'var(--color-primary-bg)' }}
                                                >
                                                    <p style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>
                                                        {stat.value}
                                                    </p>
                                                    <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)', marginTop: '4px' }}>
                                                        {stat.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Recent Enrollments */}
                                        <div>
                                            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '12px' }}>
                                                Recent Enrollments
                                            </h3>
                                            <div className="space-y-2">
                                                {[
                                                    { name: 'Sarah Chen', method: 'Code', time: '2 hours ago' },
                                                    { name: 'Marcus Johnson', method: 'Code', time: '5 hours ago' },
                                                    { name: 'Emily Rodriguez', method: 'Manual', time: '1 day ago' },
                                                    { name: 'David Kim', method: 'Code', time: '1 day ago' },
                                                ].map((enrollment, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center justify-between p-3 rounded-lg"
                                                        style={{ backgroundColor: 'var(--color-primary-bg)' }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                                                style={{ backgroundColor: 'var(--color-primary)', fontSize: '11px', fontWeight: 600 }}
                                                            >
                                                                {enrollment.name.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                                {enrollment.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span
                                                                className="px-2 py-0.5 rounded"
                                                                style={{
                                                                    fontSize: '11px',
                                                                    fontWeight: 600,
                                                                    backgroundColor: enrollment.method === 'Code' ? '#E8F0FF' : '#FFF3E0',
                                                                    color: enrollment.method === 'Code' ? '#1A4D7A' : '#8A5700',
                                                                }}
                                                            >
                                                                {enrollment.method}
                                                            </span>
                                                            <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                                {enrollment.time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Share Instructions */}
                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '16px' }}>
                                            How to Share
                                        </h2>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#E8F0FF' }}>
                                                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#1A4D7A' }} />
                                                <div>
                                                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#1A4D7A' }}>
                                                        Students join your course by:
                                                    </p>
                                                    <ol className="mt-2 space-y-1" style={{ fontSize: '12px', color: '#1A4D7A', paddingLeft: '16px', listStyle: 'decimal' }}>
                                                        <li>Logging in to AutoGrade</li>
                                                        <li>Clicking "Join Course" in their dashboard</li>
                                                        <li>Entering the 7-character code: <strong style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{enrollmentCode}</strong></li>
                                                    </ol>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                Tip: Include the course code on your syllabus or announce it during the first class.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Access & Permissions */}
                            {activeSection === 'access' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            Course Access
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                                                <div>
                                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Course Enrollment
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                        Control how students can join this course
                                                    </p>
                                                </div>
                                                <Select defaultValue="invite">
                                                    <SelectTrigger className="w-48 border-[var(--color-border)]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="open">Open enrollment</SelectItem>
                                                        <SelectItem value="invite">Invite only</SelectItem>
                                                        <SelectItem value="code">Access code</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="block mb-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    Course Access Code
                                                </label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        defaultValue="CS1001-SPR26"
                                                        className="border-[var(--color-border)] font-mono"
                                                        readOnly
                                                    />
                                                    <Button variant="outline" className="border-[var(--color-border)]">
                                                        Regenerate
                                                    </Button>
                                                </div>
                                                <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                                                    Share this code with students to allow them to join the course
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '24px' }}>
                                            Teaching Assistants
                                        </h2>

                                        <div className="space-y-3 mb-4">
                                            {[
                                                { name: 'Alice Johnson', email: 'ajohnson@ulm.edu', role: 'Full Access' },
                                                { name: 'Bob Martinez', email: 'bmartinez@ulm.edu', role: 'Grading Only' },
                                            ].map((ta, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 rounded-lg"
                                                    style={{ backgroundColor: 'var(--color-primary-bg)' }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                                            style={{ backgroundColor: 'var(--color-primary)', fontSize: '13px', fontWeight: 600 }}
                                                        >
                                                            {ta.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                                {ta.name}
                                                            </p>
                                                            <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                                {ta.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className="px-2 py-1 rounded"
                                                            style={{
                                                                backgroundColor: ta.role === 'Full Access' ? 'var(--color-success)' : 'var(--color-info)',
                                                                color: 'white',
                                                                fontSize: '11px',
                                                                fontWeight: 600,
                                                                textTransform: 'uppercase',
                                                            }}
                                                        >
                                                            {ta.role}
                                                        </span>
                                                        <button className="p-1.5 hover:bg-white rounded transition-colors" aria-label="Edit TA">
                                                            <Edit className="w-4 h-4 text-[var(--color-text-mid)]" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <Button variant="outline" className="border-dashed border-[var(--color-border)] text-[var(--color-text-mid)]">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Teaching Assistant
                                        </Button>
                                    </div>

                                    <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid var(--color-error)' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-error)', marginBottom: '16px' }}>
                                            Danger Zone
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Archive Course
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                        Archive this course and hide it from active courses
                                                    </p>
                                                </div>
                                                <Button variant="outline" className="border-[var(--color-error)] text-[var(--color-error)]">
                                                    Archive
                                                </Button>
                                            </div>
                                            <div className="border-t" style={{ borderColor: 'var(--color-border)' }} />
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                        Delete Course
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                        Permanently delete this course and all associated data
                                                    </p>
                                                </div>
                                                <Button variant="outline" className="border-[var(--color-error)] text-[var(--color-error)]">
                                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* ═══ Regenerate Code Confirmation Dialog ═══ */}
            <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
                <DialogContent className="max-w-[440px] p-6" style={{ borderRadius: '16px' }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontSize: '18px', fontWeight: 700, color: '#6B0000' }}>
                            Regenerate Course Code?
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: '14px', color: '#595959', marginTop: '8px' }}>
                            This will create a new 7-character code and <strong>permanently invalidate</strong> the current code ({enrollmentCode}).
                            Students who haven't joined yet will need the new code.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-start gap-3 mt-4 p-3 rounded-lg" style={{ backgroundColor: '#FFF3E0' }}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#8A5700' }} />
                        <p style={{ fontSize: '12px', color: '#8A5700' }}>
                            Any links or materials with the old code will no longer work.
                        </p>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setShowRegenerateDialog(false)} className="border-[var(--color-border)]">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRegenerateCode}
                            disabled={isRegenerating}
                            className="text-white"
                            style={{ backgroundColor: '#6B0000' }}
                        >
                            {isRegenerating ? (
                                <>
                                    <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                                    Regenerating…
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Regenerate Code
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}
