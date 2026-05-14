"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface ConceptCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  label?: string;
}

/**
 * The mental-model flashcard. Front shows the cue (question / metaphor).
 * Back shows the model. Click to flip. Used in the Mental Model layer
 * AND in the Review Queue.
 */
export function ConceptCard({ front, back, label = "mental model" }: ConceptCardProps) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="my-6">
      <div className="marker mb-2 px-1">{label}</div>
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className={cn(
          "w-full text-left panel rounded-sm panel-bracketed p-8 min-h-[200px]",
          "transition-all hover:shadow-glow flex flex-col items-center justify-center",
        )}
      >
        {!flipped ? (
          <div className="text-center max-w-prose">
            <div className="text-[11px] font-mono text-ink-mute uppercase tracking-widest mb-3">
              the cue
            </div>
            <div className="text-lg text-ink">{front}</div>
            <div className="mt-6 text-[11px] font-mono text-ink-mute">
              click to reveal model →
            </div>
          </div>
        ) : (
          <div className="w-full max-w-prose">
            <div className="text-[11px] font-mono text-accent uppercase tracking-widest mb-3 text-center">
              the model
            </div>
            <div className="text-ink">{back}</div>
            <div className="mt-6 text-[11px] font-mono text-ink-mute text-center">
              click to flip back
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
