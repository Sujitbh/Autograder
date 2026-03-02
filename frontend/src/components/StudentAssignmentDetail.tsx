'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from './PageLayout';
import { Button } from './ui/button';
import { useAssignment } from '@/hooks/queries/useAssignments';
import { useSubmissions } from '@/hooks/queries/useSubmissions';
import { useCourses } from '@/hooks/queries/useCourses';
import { submissionService } from '@/services/api';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Upload, 
  CheckCircle2,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';

interface StudentAssignmentDetailProps {
  courseId: string;
  assignmentId: string;
}

export function StudentAssignmentDetail({ courseId, assignmentId }: StudentAssignmentDetailProps) {
  const router = useRouter();
  const { data: courses } = useCourses();
  const { data: assignment, isLoading: assignmentLoading } = useAssignment(courseId, assignmentId);
  const { data: submissions, isLoading: submissionsLoading, refetch: refetchSubmissions } = useSubmissions(assignmentId);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const course = courses?.find((c) => c.id === courseId);
  const latestSubmission = submissions && submissions.length > 0 ? submissions[0] : null;

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      setUploadError(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      setUploadError(null);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one file to submit');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      await submissionService.uploadFiles(assignmentId, selectedFiles);
      setUploadSuccess(true);
      setSelectedFiles([]);
      refetchSubmissions();
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  if (assignmentLoading) {
    return (
      <PageLayout>
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center py-16 text-sm" style={{ color: 'var(--color-text-mid)' }}>
            Loading assignment…
          </div>
        </main>
      </PageLayout>
    );
  }

  if (!assignment) {
    return (
      <PageLayout>
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-error)' }} />
            <p className="font-medium" style={{ color: 'var(--color-text-dark)' }}>
              Assignment not found
            </p>
          </div>
        </main>
      </PageLayout>
    );
  }

  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date();

  return (
    <PageLayout>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/student/courses/${courseId}`)}
            className="mb-6 gap-2 hover:bg-gray-100 rounded-lg px-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {course?.name ?? 'Course'}
          </Button>

          <div className="relative bg-gradient-to-br from-[#6B0000] to-[#8B0000] rounded-3xl p-8 text-white shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4">
                {assignment.name}
              </h1>
              
              <div className="flex items-center gap-6 flex-wrap">
                {dueDate && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <p className="text-xs opacity-80">Due Date</p>
                      <p className="font-semibold">
                        {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {isOverdue && (
                      <span className="ml-2 px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">Overdue</span>
                    )}
                  </div>
                )}
                {assignment.maxPoints && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                    <FileText className="w-5 h-5" />
                    <div>
                      <p className="text-xs opacity-80">Total Points</p>
                      <p className="font-semibold text-xl">{assignment.maxPoints}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border-2 border-[var(--color-border)] p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-dark)' }}>
                📝 Assignment Description
              </h2>
              <div className="prose prose-sm max-w-none" style={{ color: 'var(--color-text-mid)' }}>
                {assignment.description ? (
                  <p className="whitespace-pre-wrap leading-relaxed text-base">{assignment.description}</p>
                ) : (
                  <p className="text-sm italic">No description provided.</p>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-2xl border-2 border-[var(--color-border)] p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-dark)' }}>
                📤 Submit Your Work
              </h2>

              {uploadSuccess && (
                <div className="mb-4 p-4 rounded-xl bg-green-50 border-2 border-green-200 flex items-center gap-3 text-sm text-green-800 shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Files uploaded successfully!</span>
                </div>
              )}

              {uploadError && (
                <div className="mb-4 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-center gap-3 text-sm text-red-800 shadow-sm">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{uploadError}</span>
                </div>
              )}

              {/* Drag & Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-bg)] hover:shadow-md"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
                </div>
                <p className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-dark)' }}>
                  Drag & drop files here
                </p>
                <p className="text-sm mb-5" style={{ color: 'var(--color-text-mid)' }}>
                  or click the button below to browse from your computer
                </p>
                <label htmlFor="file-input">
                  <Button size="lg" className="cursor-pointer px-8" onClick={() => document.getElementById('file-input')?.click()}>
                    Browse Files
                  </Button>
                </label>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text-dark)' }}>
                    <FileText className="w-4 h-4" />
                    Selected Files ({selectedFiles.length})
                  </p>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl border-2 shadow-sm hover:shadow-md transition-shadow"
                      style={{ borderColor: 'var(--color-border)', backgroundColor: '#F9FAFB' }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="bg-white rounded-lg p-2">
                          <FileText className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium block truncate" style={{ color: 'var(--color-text-dark)' }}>
                            {file.name}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-5 h-5" style={{ color: '#DC2626' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isUploading || selectedFiles.length === 0}
                  className="flex-1 gap-2 h-12 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Submit Assignment
                    </>
                  )}
                </Button>
                {selectedFiles.length > 0 && !isUploading && (
                  <Button variant="outline" onClick={() => setSelectedFiles([])}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submission Status */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-dark)' }}>
                Submission Status
              </h3>
              {submissionsLoading ? (
                <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>Loading...</p>
              ) : latestSubmission ? (
                <div className="space-y-3">
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ 
                      backgroundColor: latestSubmission.status === 'graded' ? '#DCFCE7' : '#FEF3C7',
                      color: latestSubmission.status === 'graded' ? '#16A34A' : '#D97706'
                    }}
                  >
                    {latestSubmission.status === 'graded' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {latestSubmission.status}
                    </span>
                  </div>
                  
                  {latestSubmission.grade && (
                    <div>
                      <p className="text-2xl font-bold" style={{ color: 'var(--color-text-dark)' }}>
                        {latestSubmission.grade.totalScore} / {latestSubmission.grade.maxScore}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-mid)' }}>
                        {latestSubmission.grade.percentage}%
                      </p>
                    </div>
                  )}

                  {latestSubmission.submittedAt && (
                    <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>
                      Submitted: {new Date(latestSubmission.submittedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>
                  No submissions yet
                </p>
              )}
            </div>

            {/* Previous Submissions */}
            {submissions && submissions.length > 1 && (
              <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-dark)' }}>
                  Previous Submissions ({submissions.length})
                </h3>
                <div className="space-y-2">
                  {submissions.slice(0, 5).map((sub, idx) => (
                    <div 
                      key={sub.id}
                      className="p-2 rounded border text-xs"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium" style={{ color: 'var(--color-text-dark)' }}>
                          #{submissions.length - idx}
                        </span>
                        <span className="capitalize" style={{ color: 'var(--color-text-mid)' }}>
                          {sub.status}
                        </span>
                      </div>
                      {sub.grade && (
                        <p style={{ color: 'var(--color-text-mid)' }}>
                          Score: {sub.grade.totalScore}/{sub.grade.maxScore}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
