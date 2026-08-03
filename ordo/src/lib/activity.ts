export type ActivityKind =
  | "task_add"
  | "task_done"
  | "task_undone"
  | "task_remove"
  | "habit_done"
  | "habit_undone"
  | "habit_add"
  | "focus"
  | "block_add"
  | "block_remove"
  | "day_close"
  | "sync"
  | "system";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  title: string;
  detail?: string;
  at: string; // ISO
};

const KEY = "ordo.activity.v1";
const MAX = 200;

function canStore() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadActivity(): ActivityItem[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ActivityItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveActivity(items: ActivityItem[]) {
  if (!canStore()) return;
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
}

export function pushActivity(
  item: Omit<ActivityItem, "id" | "at"> & { at?: string }
): ActivityItem {
  const full: ActivityItem = {
    id: `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    at: item.at || new Date().toISOString(),
    kind: item.kind,
    title: item.title,
    detail: item.detail,
  };
  const prev = loadActivity();
  const next = [full, ...prev].slice(0, MAX);
  saveActivity(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("ordo:activity", { detail: { item: full, list: next } })
    );
  }
  return full;
}

export function clearActivity() {
  if (!canStore()) return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(
    new CustomEvent("ordo:activity", { detail: { item: null, list: [] } })
  );
}
