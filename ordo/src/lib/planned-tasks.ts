import { createDefaultDay, newId } from "@/lib/day-defaults";
import { supabase } from "@/lib/auth/supabase";
import type { DayState, Task } from "@/lib/types";

async function loadPlannedDay(date: string): Promise<{ userId: string; state: DayState }> {
  if (!supabase) throw new Error("SUPABASE_NOT_CONFIGURED");
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("AUTH_REQUIRED");
  const { data, error } = await supabase.from("ordo_day_history").select("payload").eq("user_id", auth.user.id).eq("day_date", date).maybeSingle();
  if (error) throw error;
  return { userId: auth.user.id, state: (data?.payload as DayState | undefined) || createDefaultDay(date) };
}

async function savePlannedDay(userId: string, state: DayState) {
  if (!supabase) throw new Error("SUPABASE_NOT_CONFIGURED");
  const next = { ...state, updatedAt: new Date().toISOString() };
  const { error } = await supabase.from("ordo_day_history").upsert({ user_id: userId, day_date: next.date, payload: next, updated_at: next.updatedAt }, { onConflict: "user_id,day_date" });
  if (error) throw error;
  return next;
}

/** Create a task directly inside a future day's RLS-protected history snapshot. */
export async function addPlannedTask(input: { date: string; title: string; priority?: boolean; tag?: string; time?: string }): Promise<void> {
  const { userId, state } = await loadPlannedDay(input.date);
  const priorityCount = state.tasks.filter((task) => task.priority).length;
  const task: Task = { id: newId("t"), title: input.title.trim(), tag: input.tag?.trim() || "Rejalashtirilgan", done: false, priority: Boolean(input.priority) && priorityCount < 3, time: input.time || undefined, createdAt: new Date().toISOString() };
  await savePlannedDay(userId, { ...state, date: input.date, tasks: [task, ...state.tasks] });
}

export async function updatePlannedTask(date: string, id: string, patch: Partial<Pick<Task, "title" | "done" | "priority">>) {
  const { userId, state } = await loadPlannedDay(date);
  const nextTasks = state.tasks.map((task) => task.id === id ? { ...task, ...patch } : task);
  // Never allow more than three priority tasks.
  let priorityCount = 0;
  const capped = nextTasks.map((task) => {
    if (!task.priority) return task;
    priorityCount += 1;
    return priorityCount <= 3 ? task : { ...task, priority: false };
  });
  return savePlannedDay(userId, { ...state, tasks: capped });
}

export async function removePlannedTask(date: string, id: string) {
  const { userId, state } = await loadPlannedDay(date);
  return savePlannedDay(userId, { ...state, tasks: state.tasks.filter((task) => task.id !== id) });
}
