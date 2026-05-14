"use client";

import { useMemo, useState } from "react";
import { glossary } from "@/content/glossary-data";

export default function GlossaryPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = needle
      ? glossary.filter((e) => {
          if (e.term.toLowerCase().includes(needle)) return true;
          if (e.aliases?.some((a) => a.toLowerCase().includes(needle))) return true;
          if (e.definition.toLowerCase().includes(needle)) return true;
          return false;
        })
      : glossary;
    return [...list].sort((a, b) => a.term.localeCompare(b.term));
  }, [q]);

  return (
    <div className="space-y-6">
      <header>
        <div className="marker mb-2">tool · glossary</div>
        <h1 className="text-3xl font-semibold text-ink">
          Every term, defined once.
        </h1>
        <p className="text-ink-dim mt-2 max-w-2xl">
          {glossary.length} entries. Every term in the curriculum gets defined
          the first time it appears in a lesson, then lives here for fast lookup.
        </p>
      </header>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="search…"
        className="w-full bg-bg-inset border border-edge rounded-sm px-4 py-3 font-mono text-[14px] text-ink focus:outline-none focus:border-accent"
      />

      <div className="text-[12px] font-mono text-ink-mute">
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
      </div>

      <ul className="space-y-2">
        {filtered.map((e) => (
          <li key={e.term} className="panel rounded-sm p-4">
            <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
              <h3 className="text-[15px] font-semibold text-accent">{e.term}</h3>
              {e.aliases && (
                <span className="text-[12px] font-mono text-ink-mute">
                  also: {e.aliases.join(", ")}
                </span>
              )}
              {e.taughtIn && (
                <span className="text-[11px] font-mono text-ink-faint ml-auto">
                  {e.taughtIn}
                </span>
              )}
            </div>
            <p className="text-[14px] text-ink-dim leading-relaxed">{e.definition}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
