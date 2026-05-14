"use client";

/**
 * Pyodide loader + minimal API.
 *
 * Pyodide is Python compiled to WebAssembly — runs real CPython 3 in the
 * browser. ~10MB compressed, loads on first Python lesson, then cached.
 *
 * We load it via a script tag from the official CDN to keep the Next.js
 * bundle small. Only Python-lesson pages pull it in.
 */

const PYODIDE_VERSION = "0.26.4";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`;

declare global {
  interface Window {
    loadPyodide?: (opts?: { indexURL?: string }) => Promise<PyodideInstance>;
    __codelabos_pyodide?: Promise<PyodideInstance>;
  }
}

export interface PyodideInstance {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  globals: {
    get: (name: string) => unknown;
    has: (name: string) => boolean;
    set: (name: string, value: unknown) => void;
  };
}

export type LoadState =
  | { status: "idle" }
  | { status: "loading"; message: string }
  | { status: "ready" }
  | { status: "error"; error: string };

function injectPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector("script[data-pyodide]")) {
      // Already injected; wait for it to finish loading.
      if (window.loadPyodide) return resolve();
      const i = setInterval(() => {
        if (window.loadPyodide) {
          clearInterval(i);
          resolve();
        }
      }, 50);
      return;
    }
    const s = document.createElement("script");
    s.src = `${PYODIDE_CDN}/pyodide.js`;
    s.async = true;
    s.dataset.pyodide = "true";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("failed to load Pyodide script"));
    document.head.appendChild(s);
  });
}

/**
 * Ensures Pyodide is loaded; returns the same instance across all callers.
 * Tracks progress via the onProgress callback.
 */
export function ensurePyodide(
  onProgress?: (msg: string) => void,
): Promise<PyodideInstance> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("pyodide can only load in the browser"));
  }
  if (window.__codelabos_pyodide) return window.__codelabos_pyodide;

  window.__codelabos_pyodide = (async () => {
    onProgress?.("downloading Python runtime…");
    await injectPyodideScript();
    onProgress?.("starting the Python interpreter…");
    const pyodide = await window.loadPyodide!({ indexURL: `${PYODIDE_CDN}/` });
    onProgress?.("ready");
    return pyodide as PyodideInstance;
  })();

  return window.__codelabos_pyodide;
}

/**
 * Run user code and capture stdout, stderr, and any thrown error.
 * Returns a Result the playground can render.
 */
export interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  error?: string;
}

export async function runPython(
  pyodide: PyodideInstance,
  code: string,
): Promise<RunResult> {
  let stdout = "";
  let stderr = "";
  pyodide.setStdout({ batched: (s) => { stdout += s; } });
  pyodide.setStderr({ batched: (s) => { stderr += s; } });
  try {
    await pyodide.runPythonAsync(code);
    return { ok: true, stdout, stderr };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, stdout, stderr, error: msg };
  }
}
