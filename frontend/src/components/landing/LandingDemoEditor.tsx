'use client';

import Editor from '@monaco-editor/react';

const DEMO = `def binary_search(arr: list[int], x: int) -> int:
    """Faculty-defined tests run automatically; you review edge cases."""
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == x:
            return mid
        if arr[mid] < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`;

export default function LandingDemoEditor() {
  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ borderColor: 'var(--landing-border)' }}
    >
      <Editor
        height="240px"
        defaultLanguage="python"
        defaultValue={DEMO}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          folding: false,
          padding: { top: 12, bottom: 12 },
          scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
        }}
      />
    </div>
  );
}
