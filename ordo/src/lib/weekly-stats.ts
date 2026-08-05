import type { DayState } from "@/lib/types";
import { todayKey } from "@/lib/day-defaults";

export type DaySnapshot = {
  date: string;
  completion: number;
  focusSec: number;
  habitsPct: number;
  prioritiesDone: number;
  prioritiesTotal: number;
  closed: boolean;
};

const SNAP_KEY = "ordo.weekly.snaps.v1";

function canStore() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function snapshotFromDay(state: DayState): DaySnapshot {
  const done = state.tasks.filter((t) => t.done).length;
  const total = state.tasks.length || 1;
  const habitsDone = state.habits.filter((h) => h.doneToday).length;
  const habitsTotal = state.habits.length || 1;
  const pri = state.tasks.filter((t) => t.priority);
  return {
    date: state.date || todayKey(),
    completion: Math.round((done / total) * 100),
    focusSec: state.focusSecondsToday || 0,
    habitsPct: Math.round((habitsDone / habitsTotal) * 100),
    prioritiesDone: pri.filter((p) => p.done).length,
    prioritiesTotal: pri.length,
    closed: Boolean(state.review?.closedAt),
  };
}

export function loadSnapshots(): DaySnapshot[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(SNAP_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DaySnapshot[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSnapshots(list: DaySnapshot[]) {
  if (!canStore()) return;
  // keep last 56 days
  const sorted = [...list]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-56);
  localStorage.setItem(SNAP_KEY, JSON.stringify(sorted));
}

/** Upsert today's snapshot from live day state */
export function upsertTodaySnapshot(state: DayState) {
  const snap = snapshotFromDay(state);
  const prev = loadSnapshots().filter((s) => s.date !== snap.date);
  saveSnapshots([...prev, snap]);
  return snap;
}

export function lastNDays(n: number, from = new Date()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(from);
    d.setDate(d.getDate() - i);
    out.push(todayKey(d));
  }
  return out;
}

export function buildWeekSeries(n = 7): DaySnapshot[] {
  const map = new Map(loadSnapshots().map((s) => [s.date, s]));
  return lastNDays(n).map((date) => {
    return (
      map.get(date) || {
        date,
        completion: 0,
        focusSec: 0,
        habitsPct: 0,
        prioritiesDone: 0,
        prioritiesTotal: 0,
        closed: false,
      }
    );
  });
}

export function weekSummary(series: DaySnapshot[]) {
  const active = series.filter(
    (s) => s.completion > 0 || s.focusSec > 0 || s.habitsPct > 0
  );
  const avg = (key: keyof DaySnapshot) => {
    if (!active.length) return 0;
    const sum = active.reduce((a, s) => a + (Number(s[key]) || 0), 0);
    return Math.round(sum / active.length);
  };
  const totalFocus = series.reduce((a, s) => a + s.focusSec, 0);
  const best = [...series].sort((a, b) => b.completion - a.completion)[0];
  const closedDays = series.filter((s) => s.closed).length;
  return {
    avgCompletion: avg("completion"),
    avgHabits: avg("habitsPct"),
    totalFocusSec: totalFocus,
    bestDate: best?.date,
    bestCompletion: best?.completion || 0,
    closedDays,
    activeDays: active.length,
  };
}
