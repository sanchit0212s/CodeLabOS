"use client";

import { useEffect, useState } from "react";

/**
 * The two modes of CodeLabOS.
 *
 * STORY MODE — your real progress. Mastery scores save. Streak counts.
 * Review queue updates. Current-position pointer advances. This is the
 * official progression.
 *
 * FREEPLAY MODE — read anything, anytime. Nothing saves. No mastery,
 * no streak, no current-position changes. Use this to browse ahead,
 * refresh older lessons without polluting your mastery numbers, or
 * just explore.
 *
 * The mode is a global toggle persisted to localStorage and surfaced
 * via the TopBar. Components that mutate progress check the mode first
 * and no-op in Freeplay.
 */

export type Mode = "story" | "freeplay";

const KEY = "codelabos.mode.v1";

export function getMode(): Mode {
  if (typeof window === "undefined") return "story";
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw === "freeplay" ? "freeplay" : "story";
  } catch {
    return "story";
  }
}

export function setMode(mode: Mode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, mode);
    window.dispatchEvent(new CustomEvent("codelabos:mode"));
  } catch {
    /* ignore */
  }
}

export function useMode(): [Mode, (m: Mode) => void] {
  const [mode, setLocalMode] = useState<Mode>(() => getMode());

  useEffect(() => {
    const refresh = () => setLocalMode(getMode());
    window.addEventListener("codelabos:mode", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("codelabos:mode", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const update = (m: Mode) => {
    setMode(m);
    setLocalMode(m);
  };

  return [mode, update];
}
