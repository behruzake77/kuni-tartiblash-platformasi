"use client";

import { useEffect } from "react";
import type { DayState } from "@/lib/types";
import { upsertTodaySnapshot } from "@/lib/weekly-stats";

/** Keeps weekly snapshot store fresh whenever day is saved */
export function useWeeklySnapshot() {
  useEffect(() => {
    const onSave = (e: Event) => {
      const state = (e as CustomEvent<{ state: DayState }>).detail?.state;
      if (state) upsertTodaySnapshot(state);
    };
    window.addEventListener("ordo:day-saved", onSave as EventListener);
    return () =>
      window.removeEventListener("ordo:day-saved", onSave as EventListener);
  }, []);
}
