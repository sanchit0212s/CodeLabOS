"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { allLessons, curriculum, findLessonByN, TOTAL_LESSONS } from "@/content/curriculum";
import { cn } from "@/lib/cn";
import { masteryPct, reviewQueueDue } from "@/lib/progress";

export function MissionControl() {
  const progress = useProgress();
  const current = findLessonByN(progress.current) ?? allLessons[0];
  const totalPassed = Object.values(progress.mastery).filter((m) => m.score >= 0.9).length;
  const overall = Math.round((totalPassed / TOTAL_LESSONS) * 100);
  const mastery = masteryPct();
  const dueCount = reviewQueueDue().length;

  return (
    <div className="space-y-6">
      <IdentityBanner />

      <div className="grid lg:grid-cols-3 gap-6">
        <CurrentPosition
          current={current}
          totalPassed={totalPassed}
          mastery={mastery}
          streak={progress.streakDays}
        />
        <TodaysBriefing current={current} />
        <ReviewQueueCard dueCount={dueCount} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ToolsCard />
        <PhaseProgressCard
          currentPhaseId={current.phaseId}
          progress={progress.mastery}
          overall={overall}
        />
        <StandardsCard />
      </div>
    </div>
  );
}

function IdentityBanner() {
  return (
    <div className="panel rounded-sm p-6 panel-bracketed relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-signal-phase/5" />
      </div>
      <div className="relative flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="marker mb-2">codelabos · v0.1.0</div>
          <h1 className="text-3xl font-semibold text-ink leading-tight">
            Become the senior engineer in the loop.<span className="caret"></span>
          </h1>
          <p className="mt-2 text-ink-dim max-w-2xl">
            264 lessons. 10 phases. 8 languages. Built so an AI agent can never
            again build something you can't audit.
          </p>
        </div>
        <div className="flex items-center gap-4 font-mono text-[12px] text-ink-mute">
          <Stat label="lessons" value="264" />
          <Stat label="phases" value="10" />
          <Stat label="languages" value="8" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-semibold text-accent">{value}</div>
      <div className="marker">{label}</div>
    </div>
  );
}

function CurrentPosition({
  current,
  totalPassed,
  mastery,
  streak,
}: {
  current: { n: number; phaseId: string; moduleId: string };
  totalPassed: number;
  mastery: number;
  streak: number;
}) {
  return (
    <div className="panel rounded-sm">
      <div className="px-4 py-2 border-b border-edge flex items-center justify-between">
        <span className="marker">current position</span>
        <span className="marker text-accent">live</span>
      </div>
      <div className="p-5 space-y-3 font-mono text-[13px]">
        <Row label="Phase" value={current.phaseId} />
        <Row label="Module" value={current.moduleId} />
        <Row label="Lesson" value={`${current.n} / 264`} />
        <Row label="Passed" value={`${totalPassed}`} tone="ok" />
        <Row label="Mastery" value={mastery > 0 ? `${mastery}%` : "—"} tone={mastery >= 90 ? "ok" : "warn"} />
        <Row label="Streak" value={`${streak} day${streak === 1 ? "" : "s"}`} />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "ok" | "warn";
}) {
  const cls =
    tone === "ok" ? "text-signal-ok" : tone === "warn" ? "text-signal-warn" : "text-ink";
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-mute">{label}</span>
      <span className={cls}>{value}</span>
    </div>
  );
}

function TodaysBriefing({
  current,
}: {
  current: { n: number; slug: string; title: string; phaseId: string; moduleId: string };
}) {
  return (
    <div className="panel rounded-sm panel-bracketed lg:col-span-2">
      <div className="px-4 py-2 border-b border-edge flex items-center justify-between">
        <span className="marker">today's briefing</span>
        <span className="marker text-ink-mute">est. 12 min</span>
      </div>
      <div className="p-6">
        <div className="text-[12px] font-mono text-ink-mute mb-2">lesson {current.n}</div>
        <h3 className="text-xl font-semibold text-ink mb-3">{current.title}</h3>
        <p className="text-ink-dim mb-6 leading-relaxed">
          Your next lesson. Five layers: why this matters, the mental model,
          the concept taught explicitly, where it appears in real projects,
          and the mastery gate.
        </p>
        <Link
          href={`/learn/${current.phaseId}/${current.moduleId}/${current.slug}`}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-sm",
            "border border-accent text-accent font-mono text-[13px]",
            "hover:bg-accent hover:text-bg transition-colors shadow-glow",
          )}
        >
          ▶ begin lesson
        </Link>
      </div>
    </div>
  );
}

function ReviewQueueCard({ dueCount }: { dueCount: number }) {
  return (
    <div className="panel rounded-sm lg:col-span-3">
      <div className="px-4 py-2 border-b border-edge flex items-center justify-between">
        <span className="marker">review queue</span>
        <span className="marker text-accent">{dueCount} due</span>
      </div>
      <div className="p-5 flex items-center justify-between gap-4">
        <p className="text-ink-dim text-[14px]">
          {dueCount === 0
            ? "Nothing due yet. Pass a few mastery gates and the spaced-review queue will start filling here."
            : `${dueCount} mental model${dueCount === 1 ? "" : "s"} due for review today. The spaced schedule is 1d → 3d → 7d → 21d → 60d.`}
        </p>
        <Link
          href="/review"
          className="px-4 py-2 text-[13px] font-mono rounded-sm border border-edge hover:border-accent hover:text-accent transition-colors"
        >
          open queue →
        </Link>
      </div>
    </div>
  );
}

function ToolsCard() {
  const tools = [
    { href: "/tools/file-anatomy", title: "File Anatomy Inspector", sub: "Paste any project. Get the map." },
    { href: "/tools/glossary",     title: "Glossary",               sub: "Every term, defined once." },
    { href: "/map",                title: "Curriculum Map",         sub: "All 264 lessons, navigable." },
    { href: "/tools/bestiary",     title: "Anti-Pattern Bestiary",  sub: "What AI agents tend to get wrong." },
  ];
  return (
    <div className="panel rounded-sm">
      <div className="px-4 py-2 border-b border-edge marker">tools</div>
      <ul className="p-2">
        {tools.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="block px-3 py-2.5 rounded-sm hover:bg-bg-raised transition-colors group"
            >
              <div className="text-[14px] text-ink group-hover:text-accent">▸ {t.title}</div>
              <div className="text-[12px] text-ink-mute mt-0.5 pl-3.5">{t.sub}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhaseProgressCard({
  currentPhaseId,
  progress,
  overall,
}: {
  currentPhaseId: string;
  progress: Record<number, { score: number }>;
  overall: number;
}) {
  return (
    <div className="panel rounded-sm">
      <div className="px-4 py-2 border-b border-edge flex items-center justify-between">
        <span className="marker">phase progress</span>
        <span className="marker text-accent">{overall}%</span>
      </div>
      <ul className="p-4 space-y-2.5">
        {curriculum.map((p) => {
          const lessons = p.modules.flatMap((m) => m.lessons);
          const passed = lessons.filter((l) => (progress[l.n]?.score ?? 0) >= 0.9).length;
          const pct = (passed / lessons.length) * 100;
          const isCurrent = p.id === currentPhaseId;
          return (
            <li key={p.id} className="flex items-center gap-3 text-[12.5px]">
              <span
                className={cn(
                  "w-6 font-mono",
                  isCurrent ? "text-accent" : "text-ink-mute",
                )}
              >
                {p.id.padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className={cn("truncate", isCurrent ? "text-ink" : "text-ink-dim")}>
                  {p.title}
                </div>
                <div className="h-1 mt-1 bg-bg-inset rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="text-ink-mute font-mono w-12 text-right">
                {passed}/{lessons.length}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StandardsCard() {
  return (
    <div className="panel rounded-sm">
      <div className="px-4 py-2 border-b border-edge marker">the standards · non-negotiable</div>
      <ol className="p-4 space-y-2 text-[12.5px] text-ink-dim">
        <li className="flex gap-3"><span className="text-accent font-mono">01</span> No forward references.</li>
        <li className="flex gap-3"><span className="text-accent font-mono">02</span> Every file shown is real.</li>
        <li className="flex gap-3"><span className="text-accent font-mono">03</span> Every concept has a "where you'll see this."</li>
        <li className="flex gap-3"><span className="text-accent font-mono">04</span> Every lesson has an anti-pattern.</li>
        <li className="flex gap-3"><span className="text-accent font-mono">05</span> No "you'll understand this later."</li>
        <li className="flex gap-3"><span className="text-accent font-mono">06</span> The mental model survives 6 months.</li>
        <li className="flex gap-3"><span className="text-accent font-mono">07</span> The gate is honest. 90% means 90%.</li>
      </ol>
    </div>
  );
}
