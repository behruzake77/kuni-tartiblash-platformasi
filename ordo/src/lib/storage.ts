import { createDefaultDay, todayKey } from "@/lib/day-defaults";
import type { DayState } from "@/lib/types";

export const DAY_STORAGE_KEY = "ordo.day.v1";
const KEY = DAY_STORAGE_KEY;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadDayState(): DayState {
  if (!canUseStorage()) return createDefaultDay();

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const fresh = createDefaultDay();
      window.localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }

    const parsed = JSON.parse(raw) as DayState;
    const today = todayKey();

    // New calendar day → roll forward lightly
    if (!parsed?.date || parsed.date !== today) {
      const next = createDefaultDay(today);
      // Keep habit definitions & streaks; reset doneToday
      if (Array.isArray(parsed.habits) && parsed.habits.length) {
        next.habits = parsed.habits.map((h) => ({
          ...h,
          doneToday: false,
          week: Array.isArray(h.week) ? [...h.week.slice(1), false] : h.week,
        }));
      }
      // Carry unfinished tasks forward
      if (Array.isArray(parsed.tasks)) {
        const open = parsed.tasks
          .filter((t) => !t.done)
          .map((t) => ({ ...t, createdAt: new Date().toISOString() }));
        if (open.length) {
          // Keep defaults but prepend carried tasks (dedupe by title)
          const titles = new Set(open.map((t) => t.title.toLowerCase()));
          next.tasks = [
            ...open,
            ...next.tasks.filter((t) => !titles.has(t.title.toLowerCase())),
          ];
        }
      }
      // Seed tomorrow priority from last review
      if (parsed.review?.tomorrow?.trim()) {
        next.tasks = [
          {
            id: `t_carry_${Date.now().toString(36)}`,
            title: parsed.review.tomorrow.trim(),
            tag: "Carried",
            done: false,
            priority: true,
            createdAt: new Date().toISOString(),
          },
          ...next.tasks.filter((t) => t.priority).slice(0, 2),
          ...next.tasks.filter((t) => !t.priority),
        ];
        // ensure max 3 priorities
        let p = 0;
        next.tasks = next.tasks.map((t) => {
          if (!t.priority) return t;
          p += 1;
          return p <= 3 ? t : { ...t, priority: false };
        });
      }

      window.localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    }

    return parsed;
  } catch {
    return createDefaultDay();
  }
}

export function saveDayState(state: DayState) {
  if (!canUseStorage()) return;
  try {
    const withStamp: DayState = {
      ...state,
      updatedAt: state.updatedAt || new Date().toISOString(),
    };
    window.localStorage.setItem(KEY, JSON.stringify(withStamp));
  } catch {
    // quota / private mode — ignore
  }
}

/** Touch updatedAt without changing domain data (used before push). */
export function touchDayState(state: DayState): DayState {
  return { ...state, updatedAt: new Date().toISOString() };
}

export function clearDayState() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(KEY);
}
