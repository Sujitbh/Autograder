import { ClassPerformancePage } from '@/components/ClassPerformancePage';

interface PerformancePageProps {
  params: Promise<{ courseId: string; assignmentId: string }>;
}

export default async function PerformancePage({ params }: Readonly<PerformancePageProps>) {
  const resolved = await params;

  return (
    <ClassPerformancePage
      courseId={resolved.courseId}
      assignmentId={resolved.assignmentId}
    />
  );
}
