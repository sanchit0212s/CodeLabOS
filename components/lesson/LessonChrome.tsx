"use client";

import Link from "next/link";
import { useEffect } from "react";
import { setCurrent } from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";
import { useMode } from "@/lib/mode";
import { mvpLessonSet } from "@/content/mvp-path";
import type { FlatLesson } from "@/content/curriculum";
import { cn } from "@/lib/cn";

interface LessonChromeProps {
  lesson: FlatLesson;
  prev?: FlatLesson;
  next?: FlatLesson;
  estMin?: number;
  children: React.ReactNode;
}

export function LessonChrome({ lesson, prev, next, estMin, children }: LessonChromeProps) {
  const progress = useProgress();
  const [mode] = useMode();
  const mastery = progress.mastery[lesson.n];
  const onMvp = mvpLessonSet.has(lesson.n);

  useEffect(() => {
    // setCurrent is a no-op in freeplay mode (the mode check lives inside it).
    setCurrent(lesson.n);
  }, [lesson.n]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      <article>
        {mode === "freeplay" && (
          <div className="mb-4 panel rounded-sm border-signal-warn/40 bg-signal-warn/5 px-4 py-2.5 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-warn animate-pulse" />
            <span className="text-[12.5px] text-ink-dim">
              <strong className="text-signal-warn">Freeplay mode.</strong>{" "}
              Read freely. Mastery scores will not save. Your story-mode
              progress is untouched.
            </span>
          </div>
        )}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-[11px] font-mono text-ink-mute uppercase tracking-widest mb-3 flex-wrap">
            <span>phase {lesson.phaseId}</span>
            <span className="text-ink-faint">·</span>
            <span>{lesson.moduleTitle}</span>
            <span className="text-ink-faint">·</span>
            <span>lesson {lesson.n} / 264</span>
            {estMin && (
              <>
                <span className="text-ink-faint">·</span>
                <span>~{estMin} min</span>
              </>
            )}
            {onMvp && (
              <>
                <span className="text-ink-faint">·</span>
                <span className="text-accent">on the MVP path</span>
              </>
            )}
          </div>
          <h1 className="text-[28px] font-semibold text-ink leading-tight">
            {lesson.title}
          </h1>
        </header>

        {children}

        <nav className="mt-12 pt-6 border-t border-edge grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/learn/${prev.phaseId}/${prev.moduleId}/${prev.slug}`}
              className="panel rounded-sm p-3 hover:border-accent/60 transition-colors"
            >
              <div className="marker mb-1">← previous · lesson {prev.n}</div>
              <div className="text-[14px] text-ink truncate">{prev.title}</div>
            </Link>
          ) : <div />}
          {next ? (
            <Link
              href={`/learn/${next.phaseId}/${next.moduleId}/${next.slug}`}
              className="panel rounded-sm p-3 hover:border-accent/60 transition-colors text-right"
            >
              <div className="marker mb-1">next · lesson {next.n} →</div>
              <div className="text-[14px] text-ink truncate">{next.title}</div>
            </Link>
          ) : <div />}
        </nav>
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-4">
          <div className="panel rounded-sm">
            <div className="px-4 py-2 border-b border-edge marker">status</div>
            <dl className="p-4 space-y-3 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-ink-mute">Lesson</dt>
                <dd className="font-mono text-ink">{lesson.n} / 264</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-mute">Phase</dt>
                <dd className="font-mono text-ink">{lesson.phaseId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-mute">Module</dt>
                <dd className="font-mono text-ink">{lesson.moduleId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-mute">Mastery</dt>
                <dd
                  className={cn(
                    "font-mono",
                    mastery
                      ? mastery.score >= 0.9
                        ? "text-signal-ok"
                        : "text-signal-warn"
                      : "text-ink-faint",
                  )}
                >
                  {mastery ? `${Math.round(mastery.score * 100)}%` : "not yet"}
                </dd>
              </div>
            </dl>
          </div>
          <div className="panel rounded-sm">
            <div className="px-4 py-2 border-b border-edge marker">five layers</div>
            <ol className="p-4 space-y-2 text-[12.5px]">
              {[
                ["01", "Why this matters", "text-signal-info"],
                ["02", "Mental model", "text-signal-phase"],
                ["03", "The concept", "text-accent"],
                ["04", "In context", "text-signal-warn"],
                ["05", "Mastery gate", "text-signal-ok"],
              ].map(([n, label, tone]) => (
                <li key={n} className="flex items-center gap-2">
                  <span className={cn("font-mono", tone)}>{n}</span>
                  <span className="text-ink-dim">{label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </aside>
    </div>
  );
}
