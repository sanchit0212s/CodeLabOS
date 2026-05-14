export type PhaseId =
  | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

export interface LessonRef {
  /** Global lesson number, e.g. 1..264 */
  n: number;
  /** Slug used in the URL */
  slug: string;
  /** Display title */
  title: string;
  /** Whether MDX content exists for this lesson yet */
  authored?: boolean;
}

export interface ModuleRef {
  id: string;
  title: string;
  /** Module-level summary shown in the curriculum map */
  summary: string;
  lessons: LessonRef[];
}

export interface PhaseRef {
  id: PhaseId;
  title: string;
  /** One-line essence */
  tagline: string;
  /** What you can do at the end of this phase */
  gate: string;
  /** Accent color name for the UI */
  accent: "ok" | "warn" | "err" | "info" | "phase" | "default";
  modules: ModuleRef[];
}

export type LessonStatus = "locked" | "available" | "in-progress" | "passed";

export interface MasteryRecord {
  /** Mastery score 0..1 from latest gate attempt */
  score: number;
  /** Last attempted at, ISO */
  lastAt: string;
  /** Number of attempts so far */
  attempts: number;
}

export interface ProgressState {
  /** Global lesson number user is currently on */
  current: number;
  /** Per-lesson mastery */
  mastery: Record<number, MasteryRecord>;
  /** Streak day count */
  streakDays: number;
  /** Last active day, ISO */
  lastActiveDay: string;
  /** Review queue: lesson n → due-date ISO */
  review: Record<number, string>;
}
