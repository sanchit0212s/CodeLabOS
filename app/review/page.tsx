"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { findLessonByN } from "@/content/curriculum";
import { reviewQueueDue } from "@/lib/progress";

export default function ReviewPage() {
  useProgress(); // subscribe
  const due = reviewQueueDue();

  return (
    <div className="space-y-6">
      <header>
        <div className="marker mb-2">review queue</div>
        <h1 className="text-3xl font-semibold text-ink">Spaced review.</h1>
        <p className="text-ink-dim mt-2 max-w-2xl">
          Every mental model you mastered becomes a flashcard. The schedule is
          1 day → 3 days → 7 days → 21 days → 60 days. Today's queue is below.
        </p>
      </header>

      {due.length === 0 ? (
        <div className="panel rounded-sm p-8 text-center">
          <p className="text-ink-dim">
            Nothing due. Pass mastery gates to start filling the queue.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {due.map((n) => {
            const lesson = findLessonByN(n);
            if (!lesson) return null;
            return (
              <li key={n} className="panel rounded-sm">
                <Link
                  href={`/learn/${lesson.phaseId}/${lesson.moduleId}/${lesson.slug}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-bg-raised transition-colors"
                >
                  <span className="font-mono text-[12px] text-accent">L{n}</span>
                  <span className="text-[14px] text-ink flex-1">{lesson.title}</span>
                  <span className="text-[11px] font-mono text-ink-mute">review →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
