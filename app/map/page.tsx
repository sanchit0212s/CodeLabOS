"use client";

import Link from "next/link";
import { useState } from "react";
import { curriculum } from "@/content/curriculum";
import { mvpLessonSet } from "@/content/mvp-path";
import { useProgress } from "@/lib/useProgress";
import { useMode } from "@/lib/mode";
import { cn } from "@/lib/cn";

type Filter = "all" | "mvp" | "authored";

export default function MapPage() {
  const progress = useProgress();
  const [mode] = useMode();
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <div className="space-y-6">
      <header>
        <div className="marker mb-2">curriculum map</div>
        <h1 className="text-3xl font-semibold text-ink">The whole forest.</h1>
        <p className="text-ink-dim mt-2 max-w-2xl">
          All 264 lessons. Use the MVP filter to see only the narrowed-down
          orchestrator path; use Freeplay mode in the top bar to read any
          lesson without affecting progress.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <span className="marker mr-2">filter →</span>
        {([
          { id: "all", label: "Everything" },
          { id: "mvp", label: "MVP path only" },
          { id: "authored", label: "Authored only" },
        ] as { id: Filter; label: string }[]).map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={cn(
              "px-3 py-1.5 text-[12px] font-mono rounded-sm border transition-colors",
              filter === opt.id
                ? "border-accent text-accent bg-accent/10"
                : "border-edge text-ink-mute hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {curriculum.map((phase) => {
          const all = phase.modules.flatMap((m) => m.lessons);
          const passed = all.filter(
            (l) => (progress.mastery[l.n]?.score ?? 0) >= 0.9,
          ).length;
          const mvpCount = all.filter((l) => mvpLessonSet.has(l.n)).length;
          return (
            <section key={phase.id} className="panel rounded-sm">
              <header className="px-5 py-4 border-b border-edge flex items-baseline gap-4 flex-wrap">
                <div className="font-mono text-[12px] text-accent">
                  PHASE {phase.id.padStart(2, "0")}
                </div>
                <h2 className="text-lg font-semibold text-ink">{phase.title}</h2>
                <span className="text-ink-mute text-[13px] italic">
                  {phase.tagline}
                </span>
                <span className="ml-auto font-mono text-[12px] text-ink-mute flex items-center gap-3">
                  <span>{passed}/{all.length} passed</span>
                  <span className="text-ink-faint">·</span>
                  <span className="text-accent">{mvpCount} on MVP</span>
                </span>
              </header>
              <div className="p-5 space-y-5">
                <div className="text-[13px] text-ink-dim border-l-2 border-edge pl-3">
                  <span className="marker mr-2">gate →</span>
                  {phase.gate}
                </div>
                {phase.modules.map((mod) => {
                  const visibleLessons = mod.lessons.filter((l) => {
                    if (filter === "mvp") return mvpLessonSet.has(l.n);
                    if (filter === "authored") return l.authored;
                    return true;
                  });
                  if (visibleLessons.length === 0) return null;
                  return (
                    <div key={mod.id}>
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="font-mono text-[11px] text-ink-mute">
                          {mod.id}
                        </span>
                        <h3 className="text-[15px] font-semibold text-ink">
                          {mod.title}
                        </h3>
                        <span className="text-[12.5px] text-ink-mute italic">
                          {mod.summary}
                        </span>
                      </div>
                      <ul className="grid md:grid-cols-2 gap-1.5">
                        {visibleLessons.map((lesson) => {
                          const m = progress.mastery[lesson.n];
                          const score = m?.score ?? 0;
                          const passed = score >= 0.9;
                          const inProgress = m && !passed;
                          const onMvp = mvpLessonSet.has(lesson.n);
                          return (
                            <li key={lesson.n}>
                              <Link
                                href={`/learn/${phase.id}/${mod.id}/${lesson.slug}`}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-sm border transition-colors group",
                                  lesson.authored
                                    ? "border-edge hover:border-accent/60"
                                    : "border-edge/50 text-ink-mute hover:border-edge/50",
                                  passed && mode === "story" && "border-signal-ok/40 bg-signal-ok/5",
                                  inProgress && mode === "story" && "border-signal-warn/40 bg-signal-warn/5",
                                )}
                              >
                                <span className="font-mono text-[11px] text-ink-mute w-8">
                                  {String(lesson.n).padStart(3, "0")}
                                </span>
                                <span
                                  className={cn(
                                    "w-2 h-2 rounded-full shrink-0",
                                    mode === "story"
                                      ? passed
                                        ? "bg-signal-ok"
                                        : inProgress
                                        ? "bg-signal-warn"
                                        : lesson.authored
                                        ? "bg-edge-strong"
                                        : "bg-edge"
                                      : "bg-edge-strong",
                                  )}
                                />
                                <span
                                  className={cn(
                                    "text-[13.5px] truncate flex-1",
                                    lesson.authored
                                      ? "text-ink"
                                      : "text-ink-faint",
                                  )}
                                >
                                  {lesson.title}
                                </span>
                                {onMvp && (
                                  <span
                                    className="text-[9.5px] font-mono px-1 py-0.5 rounded-sm border border-accent/40 text-accent"
                                    title="On the Minimum Viable Path"
                                  >
                                    MVP
                                  </span>
                                )}
                                {!lesson.authored && (
                                  <span className="text-[10px] font-mono text-ink-faint">
                                    pending
                                  </span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
