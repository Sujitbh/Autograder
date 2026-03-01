'use client';

import { use } from 'react';
import { AuthGuard } from '@/app/AuthGuard';
import { StudentAssignmentDetail } from '@/components/StudentAssignmentDetail';

export default function StudentAssignmentPage({ 
  params 
}: { 
  params: Promise<{ id: string; assignmentId: string }> 
}) {
  const { id, assignmentId } = use(params);
  
  return (
    <AuthGuard>
      <StudentAssignmentDetail 
        courseId={id} 
        assignmentId={assignmentId} 
      />
    </AuthGuard>
  );
}
