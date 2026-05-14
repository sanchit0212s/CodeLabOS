"use client";

import { useEffect, useState } from "react";
import { getProgress } from "./progress";
import type { ProgressState } from "./types";

/**
 * Subscribe to progress updates. Re-renders on any progress change
 * (including changes from other tabs via the `storage` event).
 */
export function useProgress(): ProgressState {
  const [state, setState] = useState<ProgressState>(() => getProgress());

  useEffect(() => {
    const onChange = () => setState(getProgress());
    window.addEventListener("codelabos:progress", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("codelabos:progress", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return state;
}
