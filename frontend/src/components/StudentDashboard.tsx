"use client";

import {
  BookOpen,
  ClipboardList,
  Clock,
  CheckCircle2,
  GraduationCap,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { PageLayout } from "./PageLayout";
import { Button } from "./ui/button";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";
import { useStudentDashboardStats } from "@/hooks/queries/useStudentDashboardStats";

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color, color: "white" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: "var(--color-text-dark)" }}>
          {value}
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-mid)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data: stats, isLoading } = useStudentDashboardStats();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const firstName = (user as any)?.firstName ?? user?.email?.split("@")[0] ?? "Student";

  return (
    <PageLayout>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-dark)" }}>
              Welcome back, {firstName}!
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-mid)" }}>
              Here's an overview of your courses and assignments.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<BookOpen className="w-6 h-6" />} label="Enrolled Courses" value={stats?.courses?.length ?? 0} color="#6B0000" />
          <StatCard icon={<ClipboardList className="w-6 h-6" />} label="Total Assignments" value={stats?.total_assignments ?? 0} color="#2563EB" />
          <StatCard icon={<Clock className="w-6 h-6" />} label="Pending" value={stats?.pending_assignments ?? 0} color="#D97706" />
          <StatCard icon={<CheckCircle2 className="w-6 h-6" />} label="Completed" value={stats?.completed_assignments ?? 0} color="#16A34A" />
        </div>
        {/* Courses List */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text-dark)" }}>
            Your Courses
          </h2>
          {isLoading ? (
            <div className="text-center py-16 text-sm" style={{ color: "var(--color-text-mid)" }}>
              Loading courses…
            </div>
          ) : stats?.courses?.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-white" style={{ borderColor: "var(--color-border)" }}>
              <GraduationCap className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--color-text-light)" }} />
              <p className="font-medium" style={{ color: "var(--color-text-dark)" }}>
                No courses yet
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-mid)" }}>
                You haven't been enrolled in any courses.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats && Array.isArray(stats.courses)
                ? stats.courses.map((course: any) => (
                    <button
                      key={course.id}
                      onClick={() => router.push(`/student/courses/${course.id}`)}
                      className="text-left bg-white rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)] transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate" style={{ color: "var(--color-text-dark)" }}>
                            {course.name}
                          </p>
                          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-mid)" }}>
                            {course.code}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-primary)" }} />
                      </div>
                    </button>
                  ))
                : null}
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}

export default StudentDashboard;