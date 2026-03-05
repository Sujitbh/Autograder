import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodePreviewProps {
  content: string;
  language: string;
  filename: string;
  showLineNumbers?: boolean;
}

export function CodePreview({
  content,
  language,
  filename,
  showLineNumbers = true,
}: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className="code-preview-container rounded-lg border"
      style={{ 
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        className="code-preview-header flex items-center justify-between px-4 py-2 border-b"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: '#1E1E1E',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="language-badge px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: 'rgba(29, 78, 216, 0.2)',
              color: '#60A5FA',
            }}
          >
            {language || 'text'}
          </span>
          <span className="text-xs text-gray-400">{filename}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors hover:bg-gray-700"
          style={{ color: copied ? '#10B981' : '#D1D5DB' }}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="code-preview-content" style={{ maxHeight: '500px', overflow: 'auto' }}>
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '13px',
            lineHeight: '1.5',
            padding: '16px',
          }}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#6B7280',
            userSelect: 'none',
          }}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
