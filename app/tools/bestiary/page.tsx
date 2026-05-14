"use client";

import { useMemo, useState } from "react";
import { bestiary } from "@/content/bestiary-data";

export default function BestiaryPage() {
  const [phase, setPhase] = useState<string>("all");

  const phases = useMemo(() => ["all", ...Array.from(new Set(bestiary.map((b) => b.phase)))], []);
  const filtered = phase === "all" ? bestiary : bestiary.filter((b) => b.phase === phase);

  return (
    <div className="space-y-6">
      <header>
        <div className="marker mb-2">tool · anti-pattern bestiary</div>
        <h1 className="text-3xl font-semibold text-ink">
          What AI agents tend to get wrong.
        </h1>
        <p className="text-ink-dim mt-2 max-w-2xl">
          {bestiary.length} patterns and counting. These are the bad decisions
          you need to spot in AI-generated code. Each one: symptom, why it's
          bad, how to fix it.
        </p>
      </header>

      <div className="flex gap-1.5 flex-wrap">
        {phases.map((p) => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={`px-3 py-1.5 text-[12px] font-mono rounded-sm border transition-colors ${
              phase === p
                ? "border-accent text-accent bg-accent/10"
                : "border-edge text-ink-mute hover:text-ink"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {filtered.map((b) => (
          <li key={b.name} className="panel rounded-sm">
            <header className="px-5 py-3 border-b border-edge flex items-baseline gap-3 flex-wrap">
              <span className="text-signal-err text-base">✕</span>
              <h3 className="text-[16px] font-semibold text-ink">{b.name}</h3>
              <span className="ml-auto text-[11px] font-mono text-ink-mute uppercase tracking-widest">
                {b.phase}
              </span>
            </header>
            <div className="p-5 space-y-3 text-[14px]">
              <Field label="symptom">{b.symptom}</Field>
              <Field label="why it's bad">{b.whyBad}</Field>
              <Field label="how to push back">{b.fix}</Field>
              {b.example && (
                <div>
                  <div className="marker mb-1.5">example</div>
                  <pre className="font-mono text-[12.5px] bg-bg-inset border border-edge rounded-sm p-3 overflow-x-auto text-signal-err">
                    {b.example}
                  </pre>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-mono text-ink-mute uppercase tracking-widest mb-0.5">
        {label}
      </div>
      <div className="text-ink-dim leading-relaxed">{children}</div>
    </div>
  );
}
