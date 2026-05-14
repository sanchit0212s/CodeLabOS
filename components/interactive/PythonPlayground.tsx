"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ensurePyodide, runPython, type PyodideInstance } from "@/lib/pyodide";
import { cn } from "@/lib/cn";

export interface PythonTest {
  /** Display name of the test. */
  name: string;
  /**
   * Python expression that must evaluate to True after the user's code runs.
   * The expression has access to all globals defined by the user's code.
   * Example: 'x == 5', 'greet("World") == "Hello, World"', etc.
   */
  expr: string;
  /** Optional: a hint shown when this test fails. */
  hint?: string;
}

export interface PythonPlaygroundProps {
  /** Title of the exercise / prompt for the user. */
  title?: string;
  /** A short instruction (1-3 sentences). */
  prompt?: React.ReactNode;
  /** Starter code shown in the editor. */
  initialCode: string;
  /**
   * Hidden "setup" Python that runs before the user's code on each Run.
   * Use for fixtures, helper functions, etc. The user never sees this.
   */
  setupCode?: string;
  /** Optional list of tests to verify the user's code. */
  tests?: PythonTest[];
  /**
   * Progressive hints. hints[0] is the gentlest nudge; hints[n-1] is the
   * full answer or near-answer. Revealed one at a time when the user
   * clicks "Need a hint?"
   */
  hints?: string[];
  /** Compact mode: shorter editor, no header. Default false. */
  compact?: boolean;
}

type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
  hint?: string;
};

export function PythonPlayground({
  title,
  prompt,
  initialCode,
  setupCode,
  tests,
  hints = [],
  compact = false,
}: PythonPlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<{ stdout: string; stderr: string; error?: string }>({
    stdout: "",
    stderr: "",
  });
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [loadState, setLoadState] = useState<
    | { status: "idle" }
    | { status: "loading"; msg: string }
    | { status: "ready" }
    | { status: "error"; msg: string }
  >({ status: "idle" });
  const pyodideRef = useRef<PyodideInstance | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  // Lazy-load Pyodide on first interaction (run / test / focus).
  const initPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoadState({ status: "loading", msg: "loading Python…" });
    try {
      const py = await ensurePyodide((msg) =>
        setLoadState({ status: "loading", msg }),
      );
      pyodideRef.current = py;
      setLoadState({ status: "ready" });
      return py;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setLoadState({ status: "error", msg });
      return null;
    }
  }, []);

  const onRun = useCallback(async () => {
    setRunning(true);
    setResults(null);
    const py = await initPyodide();
    if (!py) {
      setRunning(false);
      return;
    }
    // Reset globals between runs by re-importing a fresh namespace.
    const fullCode = setupCode ? `${setupCode}\n${code}` : code;
    const result = await runPython(py, fullCode);
    setOutput({
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error,
    });
    setRunning(false);
  }, [code, setupCode, initPyodide]);

  const onRunTests = useCallback(async () => {
    if (!tests || tests.length === 0) return;
    setRunning(true);
    const py = await initPyodide();
    if (!py) {
      setRunning(false);
      return;
    }

    // Run user code (capturing output as usual) so we can show it AND check tests.
    const fullCode = setupCode ? `${setupCode}\n${code}` : code;
    const result = await runPython(py, fullCode);
    setOutput({
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error,
    });

    const out: TestResult[] = [];
    for (const t of tests) {
      if (!result.ok) {
        out.push({
          name: t.name,
          passed: false,
          error: "code raised an error — fix that first",
          hint: t.hint,
        });
        continue;
      }
      try {
        const v = await py.runPythonAsync(`bool(${t.expr})`);
        out.push({ name: t.name, passed: v === true, hint: t.hint });
      } catch (e) {
        out.push({
          name: t.name,
          passed: false,
          error: e instanceof Error ? e.message : String(e),
          hint: t.hint,
        });
      }
    }
    setResults(out);
    setRunning(false);
  }, [code, setupCode, tests, initPyodide]);

  const onReset = () => {
    setCode(initialCode);
    setOutput({ stdout: "", stderr: "" });
    setResults(null);
    setHintsShown(0);
  };

  // Tab key inserts spaces instead of changing focus
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = code.slice(0, start) + "    " + code.slice(end);
      setCode(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (tests && tests.length > 0) onRunTests();
      else onRun();
    }
  };

  const passedCount = results?.filter((r) => r.passed).length ?? 0;
  const allPassed = !!results && results.length > 0 && results.every((r) => r.passed);

  return (
    <div className="my-6">
      {!compact && (
        <div className="marker mb-2 px-1">python · playground</div>
      )}
      <div className="panel rounded-sm overflow-hidden">
        {!compact && title && (
          <div className="px-4 py-3 border-b border-edge">
            <h4 className="text-[15px] font-semibold text-ink">{title}</h4>
            {prompt && (
              <div className="mt-1 text-[13.5px] text-ink-dim leading-relaxed">
                {prompt}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-edge">
          {/* Editor */}
          <div className="flex flex-col bg-bg-inset">
            <div className="flex items-center justify-between px-3 py-2 border-b border-edge bg-bg-raised">
              <span className="marker">editor</span>
              <span className="text-[10.5px] font-mono text-ink-mute">
                python 3
              </span>
            </div>
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => initPyodide()}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className={cn(
                "w-full font-mono text-[13px] leading-[1.55] text-ink bg-bg-inset",
                "px-4 py-3 resize-y focus:outline-none border-0",
                compact ? "min-h-[140px]" : "min-h-[200px]",
              )}
            />
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-t border-edge bg-bg-raised">
              <button
                type="button"
                onClick={onRun}
                disabled={running}
                className={cn(
                  "px-3 py-1.5 text-[12.5px] font-mono rounded-sm border transition-colors",
                  "border-accent text-accent hover:bg-accent hover:text-bg disabled:opacity-40",
                )}
              >
                ▶ run
              </button>
              {tests && tests.length > 0 && (
                <button
                  type="button"
                  onClick={onRunTests}
                  disabled={running}
                  className={cn(
                    "px-3 py-1.5 text-[12.5px] font-mono rounded-sm border transition-colors",
                    "border-signal-info text-signal-info hover:bg-signal-info hover:text-bg disabled:opacity-40",
                  )}
                >
                  ✓ run tests
                </button>
              )}
              <button
                type="button"
                onClick={onReset}
                disabled={running}
                className="px-3 py-1.5 text-[12.5px] font-mono rounded-sm border border-edge text-ink-dim hover:text-ink"
              >
                ↺ reset
              </button>
              {hints.length > 0 && hintsShown < hints.length && (
                <button
                  type="button"
                  onClick={() => setHintsShown(hintsShown + 1)}
                  className="ml-auto px-3 py-1.5 text-[12.5px] font-mono rounded-sm border border-signal-warn/60 text-signal-warn hover:bg-signal-warn/10"
                >
                  ? hint {hintsShown + 1}/{hints.length}
                </button>
              )}
              <span className="text-[10.5px] font-mono text-ink-mute ml-auto">
                {loadState.status === "loading" && `… ${loadState.msg}`}
                {loadState.status === "error" && `error: ${loadState.msg}`}
                {loadState.status === "ready" && !running && "ready · ⌘/ctrl+enter to run"}
                {running && "running…"}
              </span>
            </div>
          </div>

          {/* Output + tests */}
          <div className="flex flex-col bg-bg-inset min-h-[200px]">
            <div className="flex items-center justify-between px-3 py-2 border-b border-edge bg-bg-raised">
              <span className="marker">output</span>
              {results && (
                <span
                  className={cn(
                    "text-[11px] font-mono",
                    allPassed ? "text-signal-ok" : "text-signal-warn",
                  )}
                >
                  {passedCount} / {results.length} tests
                </span>
              )}
            </div>
            <div className="flex-1 p-3 font-mono text-[12.5px] overflow-y-auto">
              {output.stdout && (
                <pre className="whitespace-pre-wrap text-ink mb-2">
                  {output.stdout}
                </pre>
              )}
              {output.stderr && (
                <pre className="whitespace-pre-wrap text-signal-warn mb-2">
                  {output.stderr}
                </pre>
              )}
              {output.error && (
                <pre className="whitespace-pre-wrap text-signal-err mb-2">
                  {output.error}
                </pre>
              )}
              {!output.stdout && !output.stderr && !output.error && !results && (
                <span className="text-ink-faint italic">
                  {`# output will appear here after you click "run"`}
                </span>
              )}
              {results && (
                <div className="mt-2 space-y-1.5">
                  {results.map((r, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-2 px-2 py-1.5 rounded-sm border text-[12.5px]",
                        r.passed
                          ? "border-signal-ok/40 bg-signal-ok/5"
                          : "border-signal-warn/40 bg-signal-warn/5",
                      )}
                    >
                      <span className={r.passed ? "text-signal-ok" : "text-signal-warn"}>
                        {r.passed ? "✓" : "✕"}
                      </span>
                      <div className="flex-1">
                        <div className="text-ink">{r.name}</div>
                        {!r.passed && r.hint && (
                          <div className="mt-1 text-[12px] text-ink-dim italic">
                            hint: {r.hint}
                          </div>
                        )}
                        {!r.passed && r.error && !r.hint && (
                          <div className="mt-1 text-[12px] text-signal-err">
                            {r.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progressive hints panel */}
        {hints.length > 0 && hintsShown > 0 && (
          <div className="border-t border-edge p-4 bg-bg-panel space-y-2">
            <div className="marker">hints revealed</div>
            {hints.slice(0, hintsShown).map((h, i) => (
              <div
                key={i}
                className="text-[13px] text-ink-dim leading-relaxed border-l-2 border-signal-warn/40 pl-3"
              >
                <span className="text-signal-warn font-mono text-[11px] mr-2">
                  hint {i + 1}:
                </span>
                {h}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
