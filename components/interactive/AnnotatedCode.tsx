import { cn } from "@/lib/cn";

export interface AnnotatedLine {
  /** The code on this line */
  code: string;
  /** Annotation rendered to the right or below */
  note?: string;
  /** Highlight this line */
  highlight?: boolean;
}

interface AnnotatedCodeProps {
  language?: string;
  filename?: string;
  lines: AnnotatedLine[];
  /** Where to put the annotations */
  notes?: "right" | "below";
}

export function AnnotatedCode({
  language,
  filename,
  lines,
  notes = "right",
}: AnnotatedCodeProps) {
  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="marker">{filename ?? language ?? "code"}</span>
        {language && <span className="marker text-accent">{language}</span>}
      </div>
      <div className="panel rounded-sm overflow-hidden">
        <div className="grid grid-cols-[auto_1fr] font-mono text-[13px] leading-[1.7]">
          {lines.map((line, i) => (
            <div key={i} className="contents">
              <div className="px-3 py-1 text-right text-ink-faint bg-bg-inset border-r border-edge select-none">
                {i + 1}
              </div>
              <div
                className={cn(
                  "px-4 py-1 flex items-baseline gap-6 bg-bg-inset",
                  line.highlight && "bg-accent/5",
                )}
              >
                <pre className="whitespace-pre text-ink flex-1">{line.code}</pre>
                {notes === "right" && line.note && (
                  <span className="hidden lg:block text-[12px] text-signal-info italic shrink-0 max-w-[40%]">
                    ← {line.note}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        {notes === "below" && lines.some((l) => l.note) && (
          <div className="border-t border-edge p-4 space-y-1 bg-bg-panel">
            {lines.map((l, i) =>
              l.note ? (
                <div key={i} className="text-[12.5px] text-ink-dim flex gap-3">
                  <span className="text-ink-faint font-mono w-6 text-right">{i + 1}</span>
                  <span>{l.note}</span>
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
}
