import { cn } from "@/lib/cn";

export type LayerKey = "why" | "model" | "concept" | "context" | "gate";

const LAYER_META: Record<LayerKey, { num: string; label: string; tone: string }> = {
  why:     { num: "01", label: "WHY THIS MATTERS",        tone: "text-signal-info" },
  model:   { num: "02", label: "MENTAL MODEL",            tone: "text-signal-phase" },
  concept: { num: "03", label: "THE CONCEPT",             tone: "text-accent" },
  context: { num: "04", label: "IN CONTEXT",              tone: "text-signal-warn" },
  gate:    { num: "05", label: "MASTERY GATE",            tone: "text-signal-ok" },
};

interface LayerSectionProps {
  layer: LayerKey;
  children: React.ReactNode;
}

export function LayerSection({ layer, children }: LayerSectionProps) {
  const meta = LAYER_META[layer];
  return (
    <section className="my-10 first:mt-0">
      <div className="flex items-center gap-3 mb-4">
        <span className={cn("font-mono text-[11px]", meta.tone)}>LAYER {meta.num}</span>
        <span className="h-px flex-1 bg-edge" />
        <span className={cn("font-mono text-[11px] tracking-widest", meta.tone)}>
          {meta.label}
        </span>
      </div>
      <div className="prose-lesson">{children}</div>
    </section>
  );
}
