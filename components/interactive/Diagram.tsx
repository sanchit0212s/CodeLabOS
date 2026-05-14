import { cn } from "@/lib/cn";

interface DiagramProps {
  caption?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wrapper for SVG / illustrated diagrams.
 * Provides the panel chrome and the "DIAGRAM" marker.
 */
export function Diagram({ caption, className, children }: DiagramProps) {
  return (
    <div className="my-6">
      <div className="marker mb-2 px-1">diagram</div>
      <div className={cn("panel rounded-sm p-6 flex flex-col items-center", className)}>
        {children}
        {caption && (
          <p className="mt-4 text-[12.5px] text-ink-mute italic text-center max-w-prose">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * A simple labeled box, useful inside diagrams.
 */
export function DBox({
  label,
  sub,
  tone = "default",
  className,
}: {
  label: string;
  sub?: string;
  tone?: "default" | "accent" | "info" | "warn" | "err" | "phase" | "muted";
  className?: string;
}) {
  const toneCls = {
    default: "border-edge-strong text-ink",
    accent: "border-accent/60 text-accent",
    info: "border-signal-info/50 text-signal-info",
    warn: "border-signal-warn/50 text-signal-warn",
    err: "border-signal-err/50 text-signal-err",
    phase: "border-signal-phase/50 text-signal-phase",
    muted: "border-edge text-ink-dim",
  }[tone];
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-sm bg-bg-inset border text-center font-mono text-[12.5px]",
        toneCls,
        className,
      )}
    >
      <div>{label}</div>
      {sub && <div className="text-[11px] text-ink-mute mt-0.5">{sub}</div>}
    </div>
  );
}

/** A vertical or horizontal arrow with an optional label. */
export function DArrow({
  direction = "right",
  label,
  className,
}: {
  direction?: "right" | "down" | "left" | "up";
  label?: string;
  className?: string;
}) {
  const symbol = { right: "→", down: "↓", left: "←", up: "↑" }[direction];
  return (
    <div className={cn("flex items-center justify-center text-ink-mute font-mono text-[12px]", className)}>
      {label && <span className="mr-2 italic">{label}</span>}
      <span className="text-accent text-lg">{symbol}</span>
    </div>
  );
}
