import { ExecuteCodeResponse } from '@/services/api/codeExecutionApiService';

// Pyodide types
declare global {
    interface Window {
        loadPyodide: (config: { indexURL: string }) => Promise<any>;
    }
}

let pyodideInstance: any = null;
let pyodideLoading = false;

/**
 * Loads the Pyodide WebAssembly runtime from CDN.
 */
async function initPyodide(): Promise<any> {
    if (pyodideInstance) return pyodideInstance;

    if (pyodideLoading) {
        // Wait for the existing loading process to finish
        let waited = 0;
        while (pyodideLoading && waited < 30000) {
            await new Promise((r) => setTimeout(r, 200));
            waited += 200;
        }
        if (pyodideInstance) return pyodideInstance;
        throw new Error('Pyodide loading timed out');
    }

    pyodideLoading = true;

    try {
        if (typeof window.loadPyodide === 'undefined') {
            await new Promise<void>((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Python runtime from CDN'));
                document.head.appendChild(script);
            });
        }

        pyodideInstance = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
        });
    } catch (err) {
        pyodideLoading = false;
        throw err;
    }

    pyodideLoading = false;
    return pyodideInstance;
}

/**
 * Executes Python code using Pyodide in the browser.
 */
export async function runClientPython(
    code: string,
    stdinContent: string = ''
): Promise<ExecuteCodeResponse> {
    const startTime = performance.now();
    let stdoutData = '';
    let stderrData = '';
    let status = 'success';

    try {
        const py = await initPyodide();

        // Prepare inputs as an array of strings
        const inputLines = stdinContent.length > 0 ? stdinContent.split('\n') : [];

        // Redirect standard output and standard error
        py.runPython(`
import sys, io, builtins
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

        // Provide the input queue
        py.globals.set('_input_queue', inputLines);

        // Setup the mock input function
        py.runPython(`
import builtins
import sys
_iq = list(_input_queue)
_iq_idx = 0
def _queued_input(prompt=""):
    global _iq_idx
    if prompt:
        sys.stdout.write(prompt)
    if _iq_idx >= len(_iq):
        raise EOFError("EOFError: EOF when reading a line")
    val = _iq[_iq_idx]
    _iq_idx += 1
    return val
builtins.input = _queued_input
`);

        // Execute the user code
        try {
            py.runPython(code);
        } catch (pyErr: any) {
            status = 'runtime_error';

            // Capture whatever was successfully printed *before* the crash
            stdoutData = py.runPython('sys.stdout.getvalue()');

            const errMsg = pyErr.message || String(pyErr);

            // Filter out internal pyodide runtime trash
            const filteredStderr = errMsg
                .split('\n')
                .filter((l: string) => {
                    const t = l.trim();
                    if (!t) return false;
                    if (t.includes('_pyodide/') || t.includes('pyodide.asm')) return false;
                    if (t.includes('.run(globals, locals)')) return false;
                    if (t.includes('coroutine = eval(self.code')) return false;
                    if (t.startsWith('~~~')) return false;
                    return true;
                })
                .join('\n');

            stderrData = filteredStderr;

            return {
                status,
                stdout: stdoutData,
                stderr: stderrData,
                exit_code: 1,
                execution_time_ms: performance.now() - startTime,
            };
        }

        // Capture standard traces on success
        stdoutData = py.runPython('sys.stdout.getvalue()');
        stderrData = py.runPython('sys.stderr.getvalue()');

        if (stderrData.trim() !== '') {
            status = 'runtime_error'; // Minor issue if stderr has content
        }

        return {
            status,
            stdout: stdoutData,
            stderr: stderrData,
            exit_code: status === 'success' ? 0 : 1,
            execution_time_ms: performance.now() - startTime,
        };
    } catch (err: any) {
        return {
            status: 'runtime_error',
            stdout: stdoutData,
            stderr: `Runtime error: ${err.message}`,
            exit_code: 1,
            execution_time_ms: performance.now() - startTime,
        };
    }
}

/**
 * Executes JavaScript code using new Function() in the browser safely.
 */
export async function runClientJavaScript(
    code: string,
    stdinContent: string = '' // Standard input unsupported in this simple JS exec context
): Promise<ExecuteCodeResponse> {
    const startTime = performance.now();
    const logs: string[] = [];
    const origLog = console.log;

    try {
        // Intercept console.log
        console.log = (...args: any[]) => {
            logs.push(
                args
                    .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
                    .join(' ')
            );
        };

        // Execute block
        const execFn = new Function(code);
        execFn();

        // Restore
        console.log = origLog;

        return {
            status: 'success',
            stdout: logs.join('\n'),
            stderr: '',
            exit_code: 0,
            execution_time_ms: performance.now() - startTime,
        };
    } catch (err: any) {
        console.log = origLog;
        return {
            status: 'runtime_error',
            stdout: logs.join('\n'), // Anything logged before throw
            stderr: `${err.name}: ${err.message}`,
            exit_code: 1,
            execution_time_ms: performance.now() - startTime,
        };
    }
}
