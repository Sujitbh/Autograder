'use client';

const SNIPPETS: {
  code: string;
  top: string;
  left?: string;
  right?: string;
  anim: 'axiom-float-1' | 'axiom-float-2' | 'axiom-float-3';
  delay: string;
}[] = [
  { code: 'assert solution(42) == expected', top: '12%', left: '8%', anim: 'axiom-float-1', delay: '0s' },
  {
    code: 'for tc in test_cases:\n    run_hidden(tc)',
    top: '55%',
    left: '4%',
    anim: 'axiom-float-2',
    delay: '1.2s',
  },
  {
    code: 'rubric.apply(criteria, submission)',
    top: '22%',
    right: '6%',
    anim: 'axiom-float-3',
    delay: '0.6s',
  },
  {
    code: 'await grade_queue.flush()',
    top: '68%',
    right: '10%',
    anim: 'axiom-float-1',
    delay: '2s',
  },
  {
    code: 'integrity.check_similarity(a, b)',
    top: '40%',
    left: '42%',
    anim: 'axiom-float-2',
    delay: '1.8s',
  },
];

export function FloatingCodeBackground() {
  return (
    <>
      {SNIPPETS.map((s, i) => (
        <pre
          key={i}
          className="absolute max-w-[min(100%,280px)] whitespace-pre-wrap break-all rounded-lg border px-3 py-2 text-[10px] leading-snug shadow-sm sm:text-[11px]"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            color: 'var(--landing-primary)',
            borderColor: 'var(--landing-border)',
            backgroundColor: 'rgba(255,255,255,0.72)',
            animation: `${s.anim} 14s ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        >
          {s.code}
        </pre>
      ))}
    </>
  );
}
