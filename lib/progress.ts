"use client";

import type { ProgressState, MasteryRecord } from "./types";
import { getMode } from "./mode";

const STORAGE_KEY = "codelabos.progress.v1";

const defaultState: ProgressState = {
  current: 1,
  mastery: {},
  streakDays: 0,
  lastActiveDay: "",
  review: {},
};

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadRaw(): ProgressState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function save(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("codelabos:progress"));
  } catch {
    /* ignore quota errors */
  }
}

export function getProgress(): ProgressState {
  return loadRaw();
}

export function setCurrent(n: number) {
  // In Freeplay mode, navigating to lessons does not advance the official
  // current-position pointer. Story-mode progression stays untouched.
  if (getMode() === "freeplay") return;
  const s = loadRaw();
  s.current = n;
  bumpStreak(s);
  save(s);
}

export function recordMastery(n: number, score: number) {
  // In Freeplay mode, taking the mastery gate does not save the score.
  // The gate still tells the user how they did, but the official record
  // stays untouched.
  if (getMode() === "freeplay") return;
  const s = loadRaw();
  const prev: MasteryRecord = s.mastery[n] ?? { score: 0, lastAt: "", attempts: 0 };
  s.mastery[n] = {
    score: Math.max(prev.score, score),
    lastAt: new Date().toISOString(),
    attempts: prev.attempts + 1,
  };
  if (score >= 0.9) {
    // Schedule into the spaced review queue (1 day out)
    const due = new Date();
    due.setDate(due.getDate() + 1);
    s.review[n] = due.toISOString();
    // Advance current if we just passed the current lesson
    if (n === s.current) s.current = n + 1;
  }
  bumpStreak(s);
  save(s);
}

export function getMastery(n: number): MasteryRecord | undefined {
  return loadRaw().mastery[n];
}

export function resetProgress() {
  save(defaultState);
}

export function isPassed(n: number) {
  const m = loadRaw().mastery[n];
  return !!m && m.score >= 0.9;
}

export function isUnlocked(n: number) {
  if (n === 1) return true;
  return isPassed(n - 1) || loadRaw().current >= n;
}

export function masteryPct(): number {
  const s = loadRaw();
  const scores = Object.values(s.mastery).map((m) => m.score);
  if (scores.length === 0) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
}

export function reviewQueueDue(): number[] {
  const s = loadRaw();
  const now = new Date();
  return Object.entries(s.review)
    .filter(([, iso]) => new Date(iso) <= now)
    .map(([n]) => parseInt(n, 10))
    .sort((a, b) => a - b);
}

function bumpStreak(s: ProgressState) {
  const today = todayISO();
  if (s.lastActiveDay === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const ytdISO = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
  s.streakDays = s.lastActiveDay === ytdISO ? s.streakDays + 1 : 1;
  s.lastActiveDay = today;
}
