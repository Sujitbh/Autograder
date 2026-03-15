export function normalizeOutputLines(text: string): string[] {
  return (text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function lineCandidates(line: string): string[] {
  const cleaned = (line || '').trim();
  const candidates = [cleaned];

  // Prompt-aware fallback: "Enter n: 3" should match expected "3".
  if (cleaned.includes(':')) {
    const tail = cleaned.split(':').pop()?.trim() ?? '';
    if (tail) {
      candidates.push(tail);
    }
  }

  return candidates;
}

export function outputsMatch(actualOutput: string, expectedOutput: string): boolean {
  const actualLines = normalizeOutputLines(actualOutput);
  const expectedLines = normalizeOutputLines(expectedOutput);

  if (expectedLines.length === 0) {
    return actualLines.length === 0;
  }

  // Rule 1: exact normalized line-by-line match.
  if (actualLines.length === expectedLines.length && actualLines.every((line, idx) => line === expectedLines[idx])) {
    return true;
  }

  // Rule 2: expected output can match trailing lines of actual output.
  if (actualLines.length >= expectedLines.length) {
    const suffix = actualLines.slice(actualLines.length - expectedLines.length);
    if (suffix.length === expectedLines.length && suffix.every((line, idx) => line === expectedLines[idx])) {
      return true;
    }
  }

  // Rule 3: for single-line expected output, allow prompt-prefixed final value.
  if (expectedLines.length === 1 && actualLines.length > 0) {
    const expectedLast = expectedLines[0];
    const actualLast = actualLines[actualLines.length - 1];
    return lineCandidates(actualLast).some((candidate) => candidate === expectedLast);
  }

  return false;
}