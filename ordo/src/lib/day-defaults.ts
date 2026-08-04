import type { DayState, Habit, ScheduleBlock, Task } from "@/lib/types";

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

/** New accounts start with a clean, user-owned day — no demo tasks. */
export function defaultTasks(): Task[] {
  return [];
}

export function defaultHabits(): Habit[] {
  return [];
}

export function defaultSchedule(): ScheduleBlock[] {
  return [];
}

export function createDefaultDay(date = todayKey()): DayState {
  return {
    version: 1,
    date,
    tasks: defaultTasks(),
    habits: defaultHabits(),
    schedule: defaultSchedule(),
    focusSessions: [],
    focusSecondsToday: 0,
    review: {
      date,
      wins: "",
      slipped: "",
      tomorrow: "",
      energy: null,
      closedAt: null,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function newId(prefix: string) {
  return id(prefix);
}

export function formatFocus(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h <= 0) return `${m}m`;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}
