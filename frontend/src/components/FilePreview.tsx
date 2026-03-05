import { useState, useEffect } from 'react';
import { X, FileText, Loader2, AlertCircle } from 'lucide-react';
import { CodePreview } from './CodePreview';
import { submissionService } from '@/services/api';

interface FilePreviewProps {
  fileId: number;
  filename: string;
  onClose: () => void;
}

interface PreviewData {
  filename: string;
  content: string;
  file_type: string;
  size_bytes: number;
  encoding: string;
  line_count: number;
  can_preview: boolean;
}

export function FilePreview({ fileId, filename, onClose }: FilePreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreview();
  }, [fileId]);

  const loadPreview = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await submissionService.previewFile(fileId);
      setPreviewData(data);
    } catch (err: any) {
      console.error('Failed to load preview:', err);
      setError(err.response?.data?.detail || 'Failed to load file preview');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className="file-preview-modal rounded-lg border"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <div>
            <h3
              className="font-semibold"
              style={{ fontSize: '16px', color: 'var(--color-text-dark)' }}
            >
              File Preview
            </h3>
            {previewData && (
              <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>
                {previewData.filename} • {formatFileSize(previewData.size_bytes)} • {previewData.line_count} lines
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          style={{ color: 'var(--color-text-mid)' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
              <p style={{ color: 'var(--color-text-mid)' }}>Loading preview...</p>
            </div>
          </div>
        )}

        {error && (
          <div
            className="flex items-start gap-3 p-4 rounded-lg"
            style={{ backgroundColor: '#FEF2F2' }}
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Preview Error</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {previewData && !error && (
          <CodePreview
            content={previewData.content}
            language={previewData.file_type || 'text'}
            filename={previewData.filename}
            showLineNumbers={true}
          />
        )}
      </div>
    </div>
  );
}
