import { cn } from "@/lib/cn";

interface AntiPatternProps {
  /** What an AI agent (or beginner) might do. */
  bad: { title: string; body: React.ReactNode };
  /** What you should push for as an orchestrator. */
  good: { title: string; body: React.ReactNode };
  /** Optional explanation of why one beats the other. */
  why?: React.ReactNode;
}

/**
 * Side-by-side comparison of an anti-pattern vs. the correct pattern.
 * Used at least once in every lesson — non-negotiable per design standards.
 */
export function AntiPattern({ bad, good, why }: AntiPatternProps) {
  return (
    <div className="my-6">
      <div className="marker mb-2 px-1">anti-pattern watch</div>
      <div className="grid md:grid-cols-2 gap-3">
        <Card
          tone="err"
          icon="✕"
          chip="what an AI agent might do"
          title={bad.title}
          body={bad.body}
        />
        <Card
          tone="ok"
          icon="✓"
          chip="what you should push for"
          title={good.title}
          body={good.body}
        />
      </div>
      {why && (
        <div className="mt-3 panel rounded-sm p-4 text-[13.5px] text-ink-dim leading-relaxed">
          <span className="marker mr-2">why →</span>
          {why}
        </div>
      )}
    </div>
  );
}

function Card({
  tone,
  icon,
  chip,
  title,
  body,
}: {
  tone: "err" | "ok";
  icon: string;
  chip: string;
  title: string;
  body: React.ReactNode;
}) {
  const ring = tone === "err" ? "border-signal-err/40" : "border-signal-ok/40";
  const text = tone === "err" ? "text-signal-err" : "text-signal-ok";
  return (
    <div className={cn("panel rounded-sm p-4 border-l-2", ring)}>
      <div className="flex items-center gap-2 mb-2">
        <span className={cn("text-base", text)}>{icon}</span>
        <span className="text-[11px] font-mono text-ink-mute uppercase tracking-widest">
          {chip}
        </span>
      </div>
      <div className={cn("text-sm font-semibold mb-2", tone === "err" ? "text-ink" : "text-ink")}>
        {title}
      </div>
      <div className="text-[14px] text-ink-dim leading-relaxed">{body}</div>
    </div>
  );
}
