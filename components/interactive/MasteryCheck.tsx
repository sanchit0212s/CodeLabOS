"use client";

import { useMemo, useState } from "react";
import { recordMastery } from "@/lib/progress";
import { useMode } from "@/lib/mode";
import { cn } from "@/lib/cn";

export type MasteryQuestion =
  | {
      kind: "mcq";
      prompt: string;
      options: string[];
      /** index of the correct option */
      answer: number;
      explanation?: string;
    }
  | {
      kind: "multi";
      prompt: string;
      options: string[];
      answer: number[];
      explanation?: string;
    }
  | {
      kind: "fill";
      prompt: string;
      /** Accept any of these (case-insensitive, trimmed) */
      answers: string[];
      placeholder?: string;
      explanation?: string;
    };

interface MasteryCheckProps {
  lessonN: number;
  questions: MasteryQuestion[];
  /** Score required to pass, default 0.9 */
  passAt?: number;
}

type Response =
  | { kind: "mcq"; choice: number | null }
  | { kind: "multi"; choices: number[] }
  | { kind: "fill"; value: string };

export function MasteryCheck({ lessonN, questions, passAt = 0.9 }: MasteryCheckProps) {
  const [mode] = useMode();
  const initial = useMemo<Response[]>(
    () =>
      questions.map((q) =>
        q.kind === "mcq"
          ? { kind: "mcq", choice: null }
          : q.kind === "multi"
          ? { kind: "multi", choices: [] }
          : { kind: "fill", value: "" },
      ),
    [questions],
  );
  const [responses, setResponses] = useState<Response[]>(initial);
  const [submitted, setSubmitted] = useState(false);

  const correctness = questions.map((q, i) => isCorrect(q, responses[i]));
  const score = correctness.filter(Boolean).length / questions.length;
  const passed = score >= passAt;

  function submit() {
    setSubmitted(true);
    recordMastery(lessonN, score);
  }

  function retry() {
    setResponses(initial);
    setSubmitted(false);
  }

  return (
    <div className="my-8">
      <div className="marker mb-2 px-1">mastery gate</div>
      <div className="panel panel-bracketed rounded-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-ink">
            Prove you can use this. {Math.round(passAt * 100)}% to unlock the next lesson.
          </h3>
          <span className="text-[12px] font-mono text-ink-mute">{questions.length} questions</span>
        </div>
        {mode === "freeplay" && (
          <div className="mb-4 px-3 py-2 rounded-sm border border-signal-warn/40 bg-signal-warn/5 text-[12.5px] text-ink-dim">
            <strong className="text-signal-warn">Freeplay:</strong> you can
            take this gate to test yourself, but the score will NOT be saved
            to your mastery record.
          </div>
        )}

        <ol className="space-y-6">
          {questions.map((q, i) => (
            <li key={i} className="border-l-2 border-edge pl-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-[12px] font-mono text-ink-mute">Q{i + 1}.</span>
                <p className="text-[15px] text-ink">{q.prompt}</p>
              </div>
              {q.kind === "mcq" && (
                <MCQ
                  q={q}
                  resp={responses[i] as { kind: "mcq"; choice: number | null }}
                  set={(r) => updateResponse(setResponses, i, r)}
                  submitted={submitted}
                />
              )}
              {q.kind === "multi" && (
                <Multi
                  q={q}
                  resp={responses[i] as { kind: "multi"; choices: number[] }}
                  set={(r) => updateResponse(setResponses, i, r)}
                  submitted={submitted}
                />
              )}
              {q.kind === "fill" && (
                <Fill
                  q={q}
                  resp={responses[i] as { kind: "fill"; value: string }}
                  set={(r) => updateResponse(setResponses, i, r)}
                  submitted={submitted}
                />
              )}
              {submitted && q.explanation && (
                <div
                  className={cn(
                    "mt-3 text-[13.5px] p-3 rounded-sm border",
                    correctness[i]
                      ? "border-signal-ok/30 bg-signal-ok/5 text-ink-dim"
                      : "border-signal-warn/30 bg-signal-warn/5 text-ink-dim",
                  )}
                >
                  <span className="marker mr-2">{correctness[i] ? "correct →" : "look again →"}</span>
                  {q.explanation}
                </div>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-6 pt-4 border-t border-edge flex items-center justify-between gap-4">
          {!submitted ? (
            <>
              <span className="text-[13px] text-ink-mute">
                Answer all questions, then submit.
              </span>
              <button
                type="button"
                onClick={submit}
                disabled={!allAnswered(questions, responses)}
                className={cn(
                  "px-4 py-2 text-[13px] font-mono rounded-sm border transition-colors",
                  allAnswered(questions, responses)
                    ? "border-accent text-accent hover:bg-accent hover:text-bg"
                    : "border-edge text-ink-mute cursor-not-allowed",
                )}
              >
                ▶ submit
              </button>
            </>
          ) : (
            <>
              <span
                className={cn(
                  "text-[14px] font-mono",
                  passed ? "text-signal-ok" : "text-signal-warn",
                )}
              >
                {passed
                  ? `✓ passed — ${Math.round(score * 100)}%`
                  : `score ${Math.round(score * 100)}% — needs ${Math.round(passAt * 100)}%. review and retry.`}
              </span>
              <button
                type="button"
                onClick={retry}
                className="px-4 py-2 text-[13px] font-mono rounded-sm border border-edge hover:border-accent hover:text-accent transition-colors"
              >
                ↻ retry
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function updateResponse(
  setter: React.Dispatch<React.SetStateAction<Response[]>>,
  index: number,
  r: Response,
) {
  setter((prev) => {
    const next = prev.slice();
    next[index] = r;
    return next;
  });
}

function isCorrect(q: MasteryQuestion, r: Response | undefined): boolean {
  if (!r) return false;
  if (q.kind === "mcq" && r.kind === "mcq") return r.choice === q.answer;
  if (q.kind === "multi" && r.kind === "multi") {
    const a = [...q.answer].sort().join(",");
    const b = [...r.choices].sort().join(",");
    return a === b && a.length > 0;
  }
  if (q.kind === "fill" && r.kind === "fill") {
    const norm = r.value.trim().toLowerCase();
    return q.answers.some((a) => a.toLowerCase().trim() === norm) && norm.length > 0;
  }
  return false;
}

function allAnswered(qs: MasteryQuestion[], rs: Response[]) {
  return qs.every((q, i) => {
    const r = rs[i];
    if (!r) return false;
    if (q.kind === "mcq" && r.kind === "mcq") return r.choice !== null;
    if (q.kind === "multi" && r.kind === "multi") return r.choices.length > 0;
    if (q.kind === "fill" && r.kind === "fill") return r.value.trim().length > 0;
    return false;
  });
}

function MCQ({
  q,
  resp,
  set,
  submitted,
}: {
  q: Extract<MasteryQuestion, { kind: "mcq" }>;
  resp: { kind: "mcq"; choice: number | null };
  set: (r: Response) => void;
  submitted: boolean;
}) {
  return (
    <div className="space-y-1.5 mt-2">
      {q.options.map((opt, i) => {
        const selected = resp.choice === i;
        const correct = submitted && i === q.answer;
        const wrong = submitted && selected && i !== q.answer;
        return (
          <label
            key={i}
            className={cn(
              "flex items-start gap-3 px-3 py-2 rounded-sm border cursor-pointer",
              "border-edge hover:border-edge-strong",
              selected && !submitted && "border-accent bg-accent/5",
              correct && "border-signal-ok bg-signal-ok/10",
              wrong && "border-signal-err bg-signal-err/10",
              submitted && "cursor-default",
            )}
          >
            <input
              type="radio"
              name={`q-${q.prompt}`}
              checked={selected}
              disabled={submitted}
              onChange={() => set({ kind: "mcq", choice: i })}
              className="accent-accent mt-1"
            />
            <span className="text-[14px] text-ink">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function Multi({
  q,
  resp,
  set,
  submitted,
}: {
  q: Extract<MasteryQuestion, { kind: "multi" }>;
  resp: { kind: "multi"; choices: number[] };
  set: (r: Response) => void;
  submitted: boolean;
}) {
  return (
    <div className="space-y-1.5 mt-2">
      <div className="text-[11px] font-mono text-ink-mute mb-1">
        select all that apply
      </div>
      {q.options.map((opt, i) => {
        const selected = resp.choices.includes(i);
        const shouldBe = q.answer.includes(i);
        const correct = submitted && shouldBe;
        const wrong = submitted && selected && !shouldBe;
        return (
          <label
            key={i}
            className={cn(
              "flex items-start gap-3 px-3 py-2 rounded-sm border cursor-pointer",
              "border-edge hover:border-edge-strong",
              selected && !submitted && "border-accent bg-accent/5",
              correct && "border-signal-ok bg-signal-ok/10",
              wrong && "border-signal-err bg-signal-err/10",
              submitted && "cursor-default",
            )}
          >
            <input
              type="checkbox"
              checked={selected}
              disabled={submitted}
              onChange={() => {
                const next = selected
                  ? resp.choices.filter((x) => x !== i)
                  : [...resp.choices, i];
                set({ kind: "multi", choices: next });
              }}
              className="accent-accent mt-1"
            />
            <span className="text-[14px] text-ink">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function Fill({
  q,
  resp,
  set,
  submitted,
}: {
  q: Extract<MasteryQuestion, { kind: "fill" }>;
  resp: { kind: "fill"; value: string };
  set: (r: Response) => void;
  submitted: boolean;
}) {
  const correct = submitted && isCorrect(q, resp);
  const wrong = submitted && !correct;
  return (
    <input
      type="text"
      value={resp.value}
      disabled={submitted}
      placeholder={q.placeholder ?? "your answer"}
      onChange={(e) => set({ kind: "fill", value: e.target.value })}
      className={cn(
        "mt-2 w-full bg-bg-inset border rounded-sm px-3 py-2 font-mono text-[14px] text-ink",
        "focus:outline-none focus:border-accent",
        "border-edge",
        correct && "border-signal-ok bg-signal-ok/10",
        wrong && "border-signal-err bg-signal-err/10",
      )}
    />
  );
}
