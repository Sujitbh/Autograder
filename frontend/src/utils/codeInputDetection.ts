const JAVA_BLOCK_COMMENT_RE = /\/\*[\s\S]*?\*\//g;
const JAVA_LINE_COMMENT_RE = /\/\/.*$/gm;
const PYTHON_LINE_COMMENT_RE = /^\s*#.*$/gm;

function stripJavaComments(code: string): string {
  return code.replace(JAVA_BLOCK_COMMENT_RE, '').replace(JAVA_LINE_COMMENT_RE, '');
}

function stripPythonComments(code: string): string {
  return code.replace(PYTHON_LINE_COMMENT_RE, '');
}

export function codeRequiresStdin(code: string, language: string): boolean {
  const lang = language.trim().toLowerCase();
  if (!code.trim()) return false;

  if (lang === 'python' || lang === 'py') {
    const cleaned = stripPythonComments(code);
    return /\binput\s*\(/.test(cleaned);
  }

  if (lang === 'java') {
    const cleaned = stripJavaComments(code);

    if (/\bSystem\.in\b/.test(cleaned)) return true;
    if (/\bnew\s+Scanner\s*\(\s*System\.in\s*\)/.test(cleaned)) return true;

    const scannerVariables = new Set<string>();
    const scannerDeclRe = /\bScanner\s+([A-Za-z_]\w*)\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)/g;
    let match: RegExpExecArray | null = scannerDeclRe.exec(cleaned);
    while (match) {
      scannerVariables.add(match[1]);
      match = scannerDeclRe.exec(cleaned);
    }

    for (const variable of scannerVariables) {
      const scannerReadRe = new RegExp(
        `\\b${variable}\\s*\\.\\s*next(?:Line|Int|Double|Float|Long|Short|Byte|Boolean)?\\s*\\(`,
      );
      if (scannerReadRe.test(cleaned)) return true;
    }

    if (/\bScanner\b/.test(cleaned) && /\bnext(?:Line|Int|Double|Float|Long|Short|Byte|Boolean)?\s*\(/.test(cleaned)) {
      return true;
    }

    return false;
  }

  return false;
}

