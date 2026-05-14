"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface TerminalLine {
  /** command, output, or comment */
  kind: "cmd" | "out" | "err" | "note";
  text: string;
  /** Optional annotation rendered to the right */
  annotate?: string;
}

interface TerminalSimProps {
  prompt?: string;
  lines: TerminalLine[];
  title?: string;
  /** If true, lines reveal one at a time as user clicks "next" */
  stepped?: boolean;
}

export function TerminalSim({
  prompt = "you@codelab",
  lines,
  title = "terminal",
  stepped = false,
}: TerminalSimProps) {
  const [step, setStep] = useState(stepped ? 1 : lines.length);
  const visible = lines.slice(0, step);
  const done = step >= lines.length;

  return (
    <div className="panel rounded-sm overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-edge bg-bg-raised">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-signal-err/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-signal-warn/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-signal-ok/70" />
        </div>
        <span className="ml-2 marker">{title}</span>
      </div>
      <div className="font-mono text-[13px] leading-relaxed p-4 bg-bg-inset">
        {visible.map((line, i) => (
          <div key={i} className="flex items-baseline gap-3">
            <div className="min-w-0 flex-1">
              {line.kind === "cmd" && (
                <span>
                  <span className="text-accent">{prompt}</span>
                  <span className="text-ink-mute"> $ </span>
                  <span className="text-ink">{line.text}</span>
                </span>
              )}
              {line.kind === "out" && <span className="text-ink-dim whitespace-pre-wrap">{line.text}</span>}
              {line.kind === "err" && <span className="text-signal-err whitespace-pre-wrap">{line.text}</span>}
              {line.kind === "note" && <span className="text-ink-mute italic"># {line.text}</span>}
            </div>
            {line.annotate && (
              <span className="hidden md:inline text-[12px] text-signal-info italic shrink-0">
                ← {line.annotate}
              </span>
            )}
          </div>
        ))}
        {!done && (
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-accent">{prompt}</span>
            <span className="text-ink-mute"> $ </span>
            <span className="text-ink caret"></span>
          </div>
        )}
        {stepped && (
          <button
            type="button"
            onClick={() => setStep(done ? 1 : step + 1)}
            className={cn(
              "mt-3 px-3 py-1 text-[12px] font-mono rounded-sm border border-edge",
              "hover:border-accent/60 hover:text-accent transition-colors",
            )}
          >
            {done ? "↻ replay" : "▶ next"}
          </button>
        )}
      </div>
    </div>
  );
}
