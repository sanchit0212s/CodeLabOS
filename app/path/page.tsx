"use client";

import Link from "next/link";
import { mvpPath, mvpTotalLessons } from "@/content/mvp-path";
import { allLessons, findLessonByN, TOTAL_LESSONS } from "@/content/curriculum";
import { useProgress } from "@/lib/useProgress";
import { useMode } from "@/lib/mode";
import { cn } from "@/lib/cn";

export default function PathPage() {
  const progress = useProgress();
  const [mode] = useMode();

  const mvpPassed = mvpPath.reduce(
    (sum, tier) =>
      sum +
      tier.lessons.filter((n) => (progress.mastery[n]?.score ?? 0) >= 0.9)
        .length,
    0,
  );
  const overall = Math.round((mvpPassed / mvpTotalLessons) * 100);

  return (
    <div className="space-y-8">
      <header>
        <div className="marker mb-2">the minimum viable path</div>
        <h1 className="text-3xl font-semibold text-ink leading-tight">
          The sharpest route to expert-in-the-loop.<span className="caret"></span>
        </h1>
        <p className="text-ink-dim mt-3 max-w-3xl leading-relaxed">
          Not the whole curriculum — the <em>narrowed-down</em> path. Five
          tiers, ~{mvpTotalLessons} lessons (out of {TOTAL_LESSONS} total),
          aimed at one outcome: <strong>direct AI coding agents, audit
          their output at senior-engineer level, and take over coding when
          required.</strong> Everything off this path is reference material
          — still available via the Curriculum Map and Freeplay mode.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-3">
        <Stat label="MVP lessons" value={`${mvpTotalLessons}`} />
        <Stat label="Total in curriculum" value={`${TOTAL_LESSONS}`} />
        <Stat
          label={mode === "freeplay" ? "freeplay — no tracking" : "MVP progress"}
          value={mode === "freeplay" ? "—" : `${overall}%`}
          tone={mode === "freeplay" ? "warn" : "accent"}
        />
      </div>

      <div className="space-y-6">
        {mvpPath.map((tier, idx) => {
          const tierPassed = tier.lessons.filter(
            (n) => (progress.mastery[n]?.score ?? 0) >= 0.9,
          ).length;
          const pct = Math.round((tierPassed / tier.lessons.length) * 100);
          return (
            <section key={tier.id} className="panel rounded-sm panel-bracketed">
              <header className="px-5 py-4 border-b border-edge">
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <span className="font-mono text-[11px] text-accent">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl font-semibold text-ink">{tier.title}</h2>
                  <span className="text-[12.5px] text-ink-mute italic">
                    {tier.subtitle}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 flex-wrap text-[12px] font-mono text-ink-mute">
                  <span>{tier.lessons.length} lessons</span>
                  <span>·</span>
                  <span>{tier.estimatedWeeks}</span>
                  {mode === "story" && (
                    <>
                      <span>·</span>
                      <span
                        className={cn(
                          pct === 100
                            ? "text-signal-ok"
                            : pct > 0
                            ? "text-signal-warn"
                            : "text-ink-mute",
                        )}
                      >
                        {tierPassed}/{tier.lessons.length} passed
                      </span>
                    </>
                  )}
                </div>
              </header>
              <div className="p-5 space-y-4">
                <div className="text-[13.5px] text-ink-dim leading-relaxed border-l-2 border-accent/40 pl-3">
                  <span className="marker text-accent mr-2">outcome →</span>
                  {tier.outcome}
                </div>
                <div className="grid sm:grid-cols-2 gap-1.5">
                  {tier.lessons.map((n) => {
                    const lesson = findLessonByN(n);
                    if (!lesson) return null;
                    const m = progress.mastery[n];
                    const passed = (m?.score ?? 0) >= 0.9;
                    const inProgress = m && !passed;
                    return (
                      <Link
                        key={n}
                        href={`/learn/${lesson.phaseId}/${lesson.moduleId}/${lesson.slug}`}
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm border transition-colors text-[12.5px]",
                          lesson.authored
                            ? "border-edge hover:border-accent/60"
                            : "border-edge/50 text-ink-mute hover:border-edge",
                          passed && mode === "story" && "border-signal-ok/40 bg-signal-ok/5",
                          inProgress && mode === "story" && "border-signal-warn/40 bg-signal-warn/5",
                        )}
                      >
                        <span className="font-mono text-[10.5px] text-ink-mute w-7 shrink-0">
                          L{n}
                        </span>
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
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
                        <span className="truncate flex-1">{lesson.title}</span>
                        {!lesson.authored && (
                          <span className="text-[9.5px] font-mono text-ink-faint">
                            pending
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="panel rounded-sm p-5 text-[13.5px] text-ink-dim leading-relaxed">
        <div className="marker mb-2">the rest of the forest</div>
        <p>
          The full curriculum has {TOTAL_LESSONS - mvpTotalLessons} more
          lessons not on this MVP path — deep dives into Python OOP, advanced
          TypeScript types, Postgres internals, the full auth zoo, Kubernetes,
          data engineering, and more. They're all reachable from the{" "}
          <Link href="/map" className="text-accent underline">
            Curriculum Map
          </Link>
          . Switch on <strong className="text-signal-warn">Freeplay mode</strong>{" "}
          to browse any of them without affecting your Story-mode progress.
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "warn";
}) {
  const cls =
    tone === "accent"
      ? "text-accent"
      : tone === "warn"
      ? "text-signal-warn"
      : "text-ink";
  return (
    <div className="panel rounded-sm p-4">
      <div className="marker mb-1">{label}</div>
      <div className={cn("text-2xl font-semibold font-mono", cls)}>{value}</div>
    </div>
  );
}
