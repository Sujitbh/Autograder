"use client";

import {
  BookOpen,
  ClipboardList,
  Clock,
  CheckCircle2,
  GraduationCap,
  LogOut,
  ChevronRight,
  CalendarDays,
  Settings,
  Upload,
  Star,
  Users,
  FileCode2,
  Hash,
  AlertCircle,
  Bell,
  Shield,
  PlayCircle,
  ListChecks,
  ChevronDown,
  TrendingUp,
  BookMarked,
} from "lucide-react";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";
import { useStudentDashboardStats } from "@/hooks/queries/useStudentDashboardStats";
import { useQuery } from "@tanstack/react-query";
import { assignmentService } from "@/services/api/assignmentService";
import { useState } from "react";

/* ══════════════════════════════════════════════════════════
   Sidebar — student-specific nav only
   ══════════════════════════════════════════════════════════ */
type NavId = "courses" | "submissions" | "grades" | "calendar" | "groups" | "account";

const NAV: { id: NavId; icon: React.ElementType; label: string; badge?: string }[] = [
  { id: "courses",     icon: BookOpen,      label: "My Courses"     },
  { id: "submissions", icon: Upload,        label: "Submissions"    },
  { id: "grades",      icon: Star,          label: "My Grades"      },
  { id: "calendar",    icon: CalendarDays,  label: "Calendar"       },
  { id: "groups",      icon: Users,         label: "Group Work"     },
  { id: "account",     icon: Settings,      label: "Account"        },
];

function Sidebar({ active, onNav, onLogout, userName, userEmail }: {
  active: NavId; onNav: (id: NavId) => void;
  onLogout: () => void; userName: string; userEmail: string;
}) {
  return (
    <aside className="flex flex-col h-screen sticky top-0"
      style={{ width: "228px", minWidth: "228px", backgroundColor: "#6B0000" }}>

      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-[18px]" style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
          <GraduationCap style={{ width: "17px", height: "17px", color: "white" }} />
        </div>
        <div>
          <p style={{ color: "white", fontWeight: 700, fontSize: "13px", lineHeight: 1.2 }}>AutoGrade ULM</p>
          <p style={{ color: "rgba(255,255,255,0.50)", fontSize: "11px", lineHeight: 1.2 }}>Student Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", padding: "8px 20px 4px", textTransform: "uppercase" }}>
          Navigation
        </p>
        {NAV.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => onNav(id)}
              className="w-full flex items-center gap-3 px-5 py-[11px] relative transition-all"
              style={{ background: isActive ? "rgba(255,255,255,0.14)" : "transparent", color: isActive ? "white" : "rgba(255,255,255,0.62)" }}>
              {isActive && <div className="absolute left-0 top-0 bottom-0 rounded-r" style={{ width: "3px", backgroundColor: "#C9A84C" }} />}
              <Icon style={{ width: "17px", height: "17px", flexShrink: 0 }} />
              <span style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400 }}>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", padding: "14px 18px" }}>
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ backgroundColor: "#C9A84C", color: "#6B0000" }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ color: "white", fontWeight: 600, fontSize: "12px" }} className="truncate">{userName}</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px" }} className="truncate">{userEmail}</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 py-1.5 px-3 rounded-lg"
          style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.70)", fontSize: "12px" }}>
          <LogOut style={{ width: "13px", height: "13px" }} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════════════════
   Small stat tile
   ══════════════════════════════════════════════════════════ */
function Tile({ icon, label, value, accent, bg }: {
  icon: React.ReactNode; label: string; value: string | number; accent: string; bg: string;
}) {
  return (
    <div className="rounded-xl flex items-center gap-3 p-4"
      style={{ backgroundColor: "white", border: "1px solid var(--color-border)" }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bg, color: accent }}>{icon}</div>
      <div>
        <p className="font-bold text-xl leading-tight" style={{ color: "var(--color-text-dark)" }}>{value}</p>
        <p style={{ fontSize: "11px", color: "var(--color-text-mid)" }}>{label}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Course card
   ══════════════════════════════════════════════════════════ */
const COLORS = ["#6B0000", "#1E40AF", "#15803D", "#B45309", "#7C3AED", "#0F766E"];

function CourseCard({ course, idx, onNavigate }: { course: any; idx: number; onNavigate: (tab: string) => void }) {
  const color = COLORS[idx % COLORS.length];
  const initials = (course.name || "C").split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
  return (
    <div onClick={() => onNavigate("submit")}
      className="group text-left rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      style={{ backgroundColor: "white", border: "1px solid var(--color-border)" }}>
      {/* colored strip */}
      <div style={{ backgroundColor: color, height: "72px", display: "flex", alignItems: "flex-end", padding: "0 16px 12px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "13px" }}>
          {initials}
        </div>
      </div>
      <div className="p-4 pb-3">
        <p className="font-semibold text-sm truncate" style={{ color: "var(--color-text-dark)" }}>{course.name}</p>
        {course.code && (
          <p className="flex items-center gap-1 mt-0.5" style={{ fontSize: "11px", color: "var(--color-text-light)" }}>
            <Hash style={{ width: "11px", height: "11px" }} />{course.code}
          </p>
        )}

        {/* Student action buttons */}
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <ActionChip color={color} icon={Upload} label="Submit" onClick={(e) => { e.stopPropagation(); onNavigate("submit"); }} />
          <ActionChip color={color} icon={Star} label="Grades" onClick={(e) => { e.stopPropagation(); onNavigate("grades"); }} />
          <ActionChip color={color} icon={ListChecks} label="Rubric" onClick={(e) => { e.stopPropagation(); onNavigate("rubric"); }} />
          <ActionChip color={color} icon={PlayCircle} label="Test" onClick={(e) => { e.stopPropagation(); onNavigate("tests"); }} />
        </div>
      </div>
    </div>
  );
}

function ActionChip({ color, icon: Icon, label, onClick }: {
  color: string; icon: React.ElementType; label: string; onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md py-1.5 px-2 transition-colors"
      style={{ backgroundColor: color + "12", color, fontSize: "11px", fontWeight: 500, border: `1px solid ${color}22` }}>
      <Icon style={{ width: "11px", height: "11px" }} />
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   Recent submissions row
   ══════════════════════════════════════════════════════════ */
const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  graded:    { bg: "#F0FDF4", color: "#15803D", label: "Graded"    },
  submitted: { bg: "#EFF6FF", color: "#1E40AF", label: "Submitted" },
  pending:   { bg: "#FFFBEB", color: "#B45309", label: "Pending"   },
  error:     { bg: "#FEF2F2", color: "#991B1B", label: "Error"     },
};

/* ══════════════════════════════════════════════════════════
   Password change mini-form
   ══════════════════════════════════════════════════════════ */
function PasswordPanel() {
  const [cur, setCur] = useState(""); const [next, setNext] = useState(""); const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) { setMsg({ ok: false, text: "Passwords do not match." }); return; }
    if (next.length < 8)  { setMsg({ ok: false, text: "Password must be at least 8 characters." }); return; }
    // In a real app call API here
    setMsg({ ok: true, text: "Password updated successfully." });
    setCur(""); setNext(""); setConfirm("");
  };

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: "white", border: "1px solid var(--color-border)" }}>
      <div className="flex items-center gap-2 mb-4">
        <Shield style={{ width: "16px", height: "16px", color: "#6B0000" }} />
        <h3 className="font-bold text-sm" style={{ color: "var(--color-text-dark)" }}>Change Password</h3>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {(["Current password", "New password", "Confirm new password"] as const).map((placeholder, i) => (
          <input key={i} type="password" placeholder={placeholder} required
            value={[cur, next, confirm][i]}
            onChange={(e) => [setCur, setNext, setConfirm][i](e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-text-dark)", fontSize: "13px" }} />
        ))}
        {msg && (
          <p style={{ fontSize: "12px", color: msg.ok ? "#15803D" : "#991B1B", padding: "6px 10px", borderRadius: "6px", backgroundColor: msg.ok ? "#F0FDF4" : "#FEF2F2" }}>{msg.text}</p>
        )}
        <button type="submit"
          className="w-full py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: "#6B0000", color: "white" }}>
          Update Password
        </button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main
   ══════════════════════════════════════════════════════════ */
function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavId>("courses");
  const [showAll, setShowAll] = useState(false);

  const { data: stats, isLoading } = useStudentDashboardStats();
  const { data: allAssignments = [] } = useQuery({
    queryKey: ["student-assignments-all"],
    queryFn: () => assignmentService.getAssignments(),
    staleTime: 60_000,
  });

  const firstName = (user as any)?.firstName ?? user?.email?.split("@")[0] ?? "Student";
  const fullName  = (user as any)?.firstName ? `${(user as any).firstName} ${(user as any).lastName ?? ""}`.trim() : firstName;
  const userEmail = user?.email ?? "";
  const now = new Date(); now.setHours(0, 0, 0, 0);

  const courses: any[] = Array.isArray(stats?.courses) ? stats!.courses : [];
  const visibleCourses = showAll ? courses : courses.slice(0, 6);

  const upcomingDeadlines = allAssignments
    .filter(a => a.dueDate && new Date(a.dueDate) >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 6);

  const handleNav = (id: NavId) => {
    setActiveNav(id);
    if (id === "calendar") router.push("/calendar");
  };

  /* Section titles / descriptions per nav */
  const sectionMeta: Record<NavId, { title: string; sub: string }> = {
    courses:     { title: `My Courses`,      sub: "Select a course to submit code, view rubrics, and check grades." },
    submissions: { title: "My Submissions",  sub: "Track every program you have submitted and its test results." },
    grades:      { title: "My Grades",       sub: "View scores, feedback, and grading rubrics for all assignments." },
    calendar:    { title: "Calendar",        sub: "All assignment deadlines in one place." },
    groups:      { title: "Group Work",      sub: "Collaborate on and submit group assignments." },
    account:     { title: "Account",         sub: "Manage your profile and update your password." },
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F5EDED" }}>
      <Sidebar active={activeNav} onNav={handleNav}
        onLogout={() => { logout(); router.push("/login"); }}
        userName={fullName} userEmail={userEmail} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* ── Top bar ── */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-7 py-3.5"
          style={{ backgroundColor: "white", borderBottom: "1px solid var(--color-border)" }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: "16px", color: "#6B0000" }}>
              {sectionMeta[activeNav].title}
            </h1>
            <p style={{ fontSize: "12px", color: "var(--color-text-light)", marginTop: "1px" }}>
              {sectionMeta[activeNav].sub}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ border: "1px solid var(--color-border)" }}>
              <Bell style={{ width: "16px", height: "16px", color: "var(--color-text-mid)" }} />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: "#6B0000", color: "white" }}>
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* ══════════ COURSES view ══════════ */}
        {activeNav === "courses" && (
          <div className="flex gap-6 p-7">
            {/* Centre */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* Stat strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Tile icon={<BookOpen style={{ width: "18px", height: "18px" }} />}    label="Enrolled Courses"   value={courses.length}                       accent="#6B0000" bg="#FCEAEA" />
                <Tile icon={<ClipboardList style={{ width: "18px", height: "18px" }} />} label="Total Assignments" value={stats?.total_assignments ?? 0}         accent="#1E40AF" bg="#EFF6FF" />
                <Tile icon={<Clock style={{ width: "18px", height: "18px" }} />}       label="Pending"            value={stats?.pending_assignments ?? 0}       accent="#B45309" bg="#FFFBEB" />
                <Tile icon={<CheckCircle2 style={{ width: "18px", height: "18px" }} />} label="Submitted"         value={stats?.completed_assignments ?? 0}     accent="#15803D" bg="#F0FDF4" />
              </div>

              {/* Course cards */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 style={{ fontWeight: 700, fontSize: "14px", color: "var(--color-text-dark)" }}>
                    Select a Course
                  </h2>
                  <span style={{ fontSize: "12px", color: "var(--color-text-light)" }}>
                    {courses.length} course{courses.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1,2,3].map(i => <div key={i} className="rounded-xl animate-pulse" style={{ height: "200px", backgroundColor: "var(--color-border)" }} />)}
                  </div>
                ) : courses.length === 0 ? (
                  <div className="rounded-xl flex flex-col items-center py-14"
                    style={{ backgroundColor: "white", border: "1px dashed var(--color-border)" }}>
                    <BookMarked className="w-10 h-10 mb-3" style={{ color: "var(--color-text-light)" }} />
                    <p className="font-medium text-sm" style={{ color: "var(--color-text-dark)" }}>Not enrolled in any course yet</p>
                    <p style={{ fontSize: "12px", color: "var(--color-text-mid)", marginTop: "4px" }}>Your instructor will add you once enrollment opens.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {visibleCourses.map((c, i) => (
                        <CourseCard key={c.id} course={c} idx={i} onNavigate={(tab) => router.push(`/student/courses/${c.id}/assignments?tab=${tab}`)} />
                      ))}
                    </div>
                    {courses.length > 6 && (
                      <button onClick={() => setShowAll(p => !p)}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold"
                        style={{ backgroundColor: "white", border: "1px solid var(--color-border)", color: "var(--color-text-mid)" }}>
                        <ChevronDown style={{ width: "14px", height: "14px", transform: showAll ? "rotate(180deg)" : undefined }} />
                        {showAll ? "Show less" : `Show ${courses.length - 6} more courses`}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-4" style={{ width: "264px", minWidth: "264px" }}>

              {/* Upcoming deadlines */}
              <div className="rounded-xl overflow-hidden"
                style={{ backgroundColor: "white", border: "1px solid var(--color-border)" }}>
                <div className="flex items-center gap-2 px-4 py-3.5" style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <CalendarDays style={{ width: "15px", height: "15px", color: "#6B0000" }} />
                  <h3 style={{ fontWeight: 700, fontSize: "13px", color: "var(--color-text-dark)" }}>Upcoming Deadlines</h3>
                </div>
                <div className="px-3 py-2 space-y-0.5">
                  {upcomingDeadlines.length === 0 ? (
                    <p className="text-center py-4" style={{ fontSize: "12px", color: "var(--color-text-light)" }}>No upcoming deadlines 🎉</p>
                  ) : upcomingDeadlines.map(a => {
                    const due      = new Date(a.dueDate);
                    const daysLeft = Math.ceil((due.getTime() - now.getTime()) / 86400000);
                    const urgent   = daysLeft <= 2;
                    return (
                      <button key={a.id} onClick={() => router.push(`/student/courses/${a.courseId}`)}
                        className="w-full text-left flex items-start gap-2.5 rounded-lg px-2.5 py-2 hover:bg-[#FEF9F9] transition-colors"
                        style={{ border: "none", background: "transparent" }}>
                        <div className="w-7 h-7 rounded-md flex flex-col items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: urgent ? "#FEF2F2" : "#F5EDED", color: urgent ? "#991B1B" : "#6B0000" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, lineHeight: 1 }}>{due.getDate()}</span>
                          <span style={{ fontSize: "8px", fontWeight: 500, textTransform: "uppercase", lineHeight: 1 }}>
                            {due.toLocaleDateString("en-US", { month: "short" })}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate" style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-text-dark)" }}>{a.name}</p>
                          <p style={{ fontSize: "11px", color: urgent ? "#DC2626" : "var(--color-text-light)" }}>
                            {daysLeft === 0 ? "Due today" : daysLeft === 1 ? "Due tomorrow" : `${daysLeft}d left`}
                          </p>
                        </div>
                        {urgent && <AlertCircle style={{ width: "13px", height: "13px", color: "#DC2626", flexShrink: 0, marginTop: "2px" }} />}
                      </button>
                    );
                  })}
                </div>
                <div style={{ borderTop: "1px solid var(--color-border)", padding: "8px 12px" }}>
                  <button onClick={() => router.push("/calendar")}
                    className="w-full text-center rounded-lg py-1.5 hover:bg-[#FEF9F9]"
                    style={{ fontSize: "12px", fontWeight: 600, color: "#6B0000", background: "none", border: "none" }}>
                    Full Calendar →
                  </button>
                </div>
              </div>

              {/* What you can do — student-specific feature summary */}
              <div className="rounded-xl overflow-hidden"
                style={{ backgroundColor: "white", border: "1px solid var(--color-border)" }}>
                <div className="px-4 py-3.5" style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "13px", color: "var(--color-text-dark)" }}>Inside each course</h3>
                </div>
                <div className="p-3 space-y-1">
                  {[
                    { icon: Upload,      text: "Submit & re-submit code files"        },
                    { icon: PlayCircle,  text: "Run against public test cases"        },
                    { icon: FileCode2,   text: "Download starter code"                },
                    { icon: ListChecks,  text: "View rubric & grading criteria"       },
                    { icon: TrendingUp,  text: "See your score and feedback"          },
                    { icon: Users,       text: "Submit group assignments"             },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FCEAEA" }}>
                        <Icon style={{ width: "12px", height: "12px", color: "#6B0000" }} />
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--color-text-mid)" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ ACCOUNT view ══════════ */}
        {activeNav === "account" && (
          <div className="p-7 max-w-lg">
            <PasswordPanel />
          </div>
        )}

        {/* ══════════ GRADES view ══════════ */}
        {activeNav === "grades" && (
          <div className="p-7">
            <div className="rounded-xl overflow-hidden"
              style={{ backgroundColor: "white", border: "1px solid var(--color-border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#F5EDED", borderBottom: "1px solid var(--color-border)" }}>
                    {["Assignment","Course","Score","Status","Feedback"].map(h => (
                      <th key={h} className="px-5 py-3 text-left" style={{ fontSize: "11px", fontWeight: 700, color: "#6B0000", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allAssignments.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12" style={{ color: "var(--color-text-light)", fontSize: "13px" }}>No graded submissions yet.</td></tr>
                  ) : allAssignments.map((a, i) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                      <td className="px-5 py-3 font-medium" style={{ color: "var(--color-text-dark)", fontSize: "13px" }}>{a.name}</td>
                      <td className="px-5 py-3" style={{ color: "var(--color-text-mid)", fontSize: "12px" }}>{a.courseId}</td>
                      <td className="px-5 py-3 font-bold" style={{ color: "#6B0000", fontSize: "13px" }}>—</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#FFFBEB", color: "#B45309" }}>Pending</span>
                      </td>
                      <td className="px-5 py-3" style={{ color: "var(--color-text-light)", fontSize: "12px" }}>—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════ SUBMISSIONS view ══════════ */}
        {activeNav === "submissions" && (
          <div className="p-7">
            <div className="rounded-xl flex flex-col items-center py-16"
              style={{ backgroundColor: "white", border: "1px dashed var(--color-border)" }}>
              <Upload className="w-10 h-10 mb-3" style={{ color: "var(--color-text-light)" }} />
              <p className="font-medium text-sm" style={{ color: "var(--color-text-dark)" }}>Go to a course to submit code</p>
              <p style={{ fontSize: "12px", color: "var(--color-text-mid)", marginTop: "4px", marginBottom: "16px" }}>
                Select any course from "My Courses" to upload and test your program.
              </p>
              <button onClick={() => setActiveNav("courses")}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: "#6B0000", color: "white" }}>
                Go to My Courses
              </button>
            </div>
          </div>
        )}

        {/* ══════════ GROUPS view ══════════ */}
        {activeNav === "groups" && (
          <div className="p-7">
            <div className="rounded-xl flex flex-col items-center py-16"
              style={{ backgroundColor: "white", border: "1px dashed var(--color-border)" }}>
              <Users className="w-10 h-10 mb-3" style={{ color: "var(--color-text-light)" }} />
              <p className="font-medium text-sm" style={{ color: "var(--color-text-dark)" }}>Group assignments</p>
              <p style={{ fontSize: "12px", color: "var(--color-text-mid)", marginTop: "4px", marginBottom: "16px" }}>
                Open a course and navigate to its Groups tab to join or submit a group assignment.
              </p>
              <button onClick={() => setActiveNav("courses")}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: "#6B0000", color: "white" }}>
                Browse Courses
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default StudentDashboard;
