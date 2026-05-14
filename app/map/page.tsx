"use client";

import Link from "next/link";
import { curriculum } from "@/content/curriculum";
import { useProgress } from "@/lib/useProgress";
import { cn } from "@/lib/cn";

export default function MapPage() {
  const progress = useProgress();

  return (
    <div className="space-y-6">
      <header>
        <div className="marker mb-2">curriculum map</div>
        <h1 className="text-3xl font-semibold text-ink">All 264 lessons.</h1>
        <p className="text-ink-dim mt-2 max-w-2xl">
          The full curriculum tree. Every lesson is listed with its global
          number. Hover state shows mastery. Click any authored lesson to begin.
        </p>
      </header>

      <div className="space-y-4">
        {curriculum.map((phase) => {
          const all = phase.modules.flatMap((m) => m.lessons);
          const passed = all.filter((l) => (progress.mastery[l.n]?.score ?? 0) >= 0.9).length;
          return (
            <section key={phase.id} className="panel rounded-sm">
              <header className="px-5 py-4 border-b border-edge flex items-baseline gap-4 flex-wrap">
                <div className="font-mono text-[12px] text-accent">PHASE {phase.id.padStart(2, "0")}</div>
                <h2 className="text-lg font-semibold text-ink">{phase.title}</h2>
                <span className="text-ink-mute text-[13px] italic">{phase.tagline}</span>
                <span className="ml-auto font-mono text-[12px] text-ink-mute">
                  {passed}/{all.length}
                </span>
              </header>
              <div className="p-5 space-y-5">
                <div className="text-[13px] text-ink-dim border-l-2 border-edge pl-3">
                  <span className="marker mr-2">gate →</span>
                  {phase.gate}
                </div>
                {phase.modules.map((mod) => (
                  <div key={mod.id}>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-mono text-[11px] text-ink-mute">{mod.id}</span>
                      <h3 className="text-[15px] font-semibold text-ink">{mod.title}</h3>
                      <span className="text-[12.5px] text-ink-mute italic">{mod.summary}</span>
                    </div>
                    <ul className="grid md:grid-cols-2 gap-1.5">
                      {mod.lessons.map((lesson) => {
                        const m = progress.mastery[lesson.n];
                        const score = m?.score ?? 0;
                        const passed = score >= 0.9;
                        const inProgress = m && !passed;
                        return (
                          <li key={lesson.n}>
                            <Link
                              href={`/learn/${phase.id}/${mod.id}/${lesson.slug}`}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-sm border transition-colors group",
                                lesson.authored
                                  ? "border-edge hover:border-accent/60"
                                  : "border-edge/50 text-ink-mute cursor-not-allowed hover:border-edge/50",
                                passed && "border-signal-ok/40 bg-signal-ok/5",
                                inProgress && "border-signal-warn/40 bg-signal-warn/5",
                              )}
                            >
                              <span className="font-mono text-[11px] text-ink-mute w-8">
                                {String(lesson.n).padStart(3, "0")}
                              </span>
                              <span
                                className={cn(
                                  "w-2 h-2 rounded-full shrink-0",
                                  passed ? "bg-signal-ok" :
                                  inProgress ? "bg-signal-warn" :
                                  lesson.authored ? "bg-edge-strong" : "bg-edge",
                                )}
                              />
                              <span
                                className={cn(
                                  "text-[13.5px] truncate flex-1",
                                  lesson.authored ? "text-ink" : "text-ink-faint",
                                )}
                              >
                                {lesson.title}
                              </span>
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
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
