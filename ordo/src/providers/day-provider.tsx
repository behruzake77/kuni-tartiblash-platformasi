"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatFocus, newId } from "@/lib/day-defaults";
import { DAY_STORAGE_KEY, loadDayState, saveDayState, touchDayState } from "@/lib/storage";
import { pushActivity } from "@/lib/activity";
import type {
  DayReview,
  DayState,
  Habit,
  ScheduleBlock,
  Task,
} from "@/lib/types";

type DayContextValue = {
  ready: boolean;
  state: DayState;
  stats: {
    tasksDone: number;
    tasksTotal: number;
    tasksPct: number;
    prioritiesDone: number;
    prioritiesTotal: number;
    habitsDone: number;
    habitsTotal: number;
    focusLabel: string;
    focusSeconds: number;
    dayPct: number;
  };
  // tasks
  addTask: (title: string, opts?: { priority?: boolean; tag?: string; time?: string }) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  setTaskPriority: (id: string, priority: boolean) => void;
  updateTaskTitle: (id: string, title: string) => void;
  // habits
  toggleHabit: (id: string) => void;
  addHabit: (name: string) => void;
  // schedule
  addBlock: (block: Omit<ScheduleBlock, "id">) => void;
  removeBlock: (id: string) => void;
  reorderSchedule: (activeId: string, overId: string) => void;
  // focus
  logFocusSeconds: (seconds: number, label?: string) => void;
  // review
  updateReview: (patch: Partial<DayReview>) => void;
  closeDay: () => void;
  // bulk
  replaceState: (next: DayState) => void;
};

const DayContext = createContext<DayContextValue | null>(null);

export function DayProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<DayState | null>(null);

  useEffect(() => {
    setState(loadDayState());
    setReady(true);
  }, []);

  // Onboarding first priority
  useEffect(() => {
    const onPriority = (e: Event) => {
      const title = (e as CustomEvent<{ title: string }>).detail?.title;
      if (!title) return;
      setState((prev) => {
        if (!prev) return prev;
        const task = {
          id: newId("t"),
          title,
          tag: "Muhim",
          done: false,
          priority: true,
          createdAt: new Date().toISOString(),
        };
        // keep max 3 priorities
        let p = 1;
        const rest = prev.tasks.map((t) => {
          if (!t.priority) return t;
          p += 1;
          return p <= 3 ? t : { ...t, priority: false };
        });
        return { ...prev, tasks: [task, ...rest] };
      });
    };
    window.addEventListener("ordo:onboard-priority", onPriority as EventListener);
    return () =>
      window.removeEventListener(
        "ordo:onboard-priority",
        onPriority as EventListener
      );
  }, []);

  useEffect(() => {
    if (!ready || !state) return;
    saveDayState(state);
    // Persist lightweight weekly snapshot for reports
    try {
      // dynamic import path avoided — call via event for loose coupling
      window.dispatchEvent(
        new CustomEvent("ordo:day-saved", { detail: { state } })
      );
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  // Multi-tab sync — pick up changes from other windows
  useEffect(() => {
    if (!ready) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== DAY_STORAGE_KEY || !e.newValue) return;
      try {
        const next = JSON.parse(e.newValue) as DayState;
        if (next?.version === 1) {
          setState(next);
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [ready]);

  const update = useCallback((fn: (prev: DayState) => DayState) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = fn(prev);
      return touchDayState(next);
    });
  }, []);

  const addTask = useCallback(
    (title: string, opts?: { priority?: boolean; tag?: string; time?: string }) => {
      const clean = title.trim();
      if (!clean) return;
      update((prev) => {
        const priorityCount = prev.tasks.filter((t) => t.priority).length;
        const wantPriority = Boolean(opts?.priority) && priorityCount < 3;
        const task: Task = {
          id: newId("t"),
          title: clean,
          tag: opts?.tag?.trim() || "Inbox",
          done: false,
          priority: wantPriority,
          time: opts?.time || undefined,
          createdAt: new Date().toISOString(),
        };
        pushActivity({
          kind: "task_add",
          title: clean,
          detail: wantPriority ? "priority" : task.tag,
        });
        return { ...prev, tasks: [task, ...prev.tasks] };
      });
    },
    [update]
  );

  const toggleTask = useCallback(
    (id: string) => {
      update((prev) => {
        const target = prev.tasks.find((t) => t.id === id);
        if (target) {
          pushActivity({
            kind: target.done ? "task_undone" : "task_done",
            title: target.title,
          });
        }
        return {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t
          ),
        };
      });
    },
    [update]
  );

  const removeTask = useCallback(
    (id: string) => {
      update((prev) => {
        const target = prev.tasks.find((t) => t.id === id);
        if (target) {
          pushActivity({ kind: "task_remove", title: target.title });
        }
        return {
          ...prev,
          tasks: prev.tasks.filter((t) => t.id !== id),
        };
      });
    },
    [update]
  );

  const setTaskPriority = useCallback(
    (id: string, priority: boolean) => {
      update((prev) => {
        if (priority) {
          const count = prev.tasks.filter((t) => t.priority && t.id !== id).length;
          if (count >= 3) return prev;
        }
        return {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === id ? { ...t, priority } : t
          ),
        };
      });
    },
    [update]
  );

  const updateTaskTitle = useCallback(
    (id: string, title: string) => {
      const clean = title.trim();
      if (!clean) return;
      update((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id ? { ...t, title: clean } : t
        ),
      }));
    },
    [update]
  );

  const toggleHabit = useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        habits: prev.habits.map((h) => {
          if (h.id !== id) return h;
          const doneToday = !h.doneToday;
          const week = [...h.week];
          week[6] = doneToday;
          pushActivity({
            kind: doneToday ? "habit_done" : "habit_undone",
            title: h.name,
          });
          return {
            ...h,
            doneToday,
            week,
            streak: doneToday
              ? h.doneToday
                ? h.streak
                : h.streak + 1
              : Math.max(0, h.streak - 1),
          };
        }),
      }));
    },
    [update]
  );

  const addHabit = useCallback(
    (name: string) => {
      const clean = name.trim();
      if (!clean) return;
      const habit: Habit = {
        id: newId("h"),
        name: clean,
        cadence: "Daily",
        streak: 0,
        doneToday: false,
        week: [false, false, false, false, false, false, false],
      };
      pushActivity({ kind: "habit_add", title: clean });
      update((prev) => ({ ...prev, habits: [...prev.habits, habit] }));
    },
    [update]
  );

  const addBlock = useCallback(
    (block: Omit<ScheduleBlock, "id">) => {
      pushActivity({
        kind: "block_add",
        title: block.label,
        detail: block.time,
      });
      update((prev) => ({
        ...prev,
        schedule: [
          ...prev.schedule,
          { ...block, id: newId("s") },
        ].sort((a, b) => a.time.localeCompare(b.time)),
      }));
    },
    [update]
  );

  const removeBlock = useCallback(
    (id: string) => {
      update((prev) => {
        const target = prev.schedule.find((b) => b.id === id);
        if (target) {
          pushActivity({
            kind: "block_remove",
            title: target.label,
            detail: target.time,
          });
        }
        return {
          ...prev,
          schedule: prev.schedule.filter((b) => b.id !== id),
        };
      });
    },
    [update]
  );

  const reorderSchedule = useCallback(
    (activeId: string, overId: string) => {
      if (activeId === overId) return;
      update((prev) => {
        const a = prev.schedule.find((b) => b.id === activeId);
        const b = prev.schedule.find((block) => block.id === overId);
        if (!a || !b) return prev;
        return {
          ...prev,
          schedule: prev.schedule
            .map((block) => {
              if (block.id === activeId)
                return { ...block, time: b.time, endTime: b.endTime };
              if (block.id === overId)
                return { ...block, time: a.time, endTime: a.endTime };
              return block;
            })
            .sort((x, y) => x.time.localeCompare(y.time)),
        };
      });
    },
    [update]
  );

  const logFocusSeconds = useCallback(
    (seconds: number, label?: string) => {
      if (seconds <= 0) return;
      pushActivity({
        kind: "focus",
        title: label || "Focus session",
        detail: formatFocus(seconds),
      });
      update((prev) => ({
        ...prev,
        focusSecondsToday: prev.focusSecondsToday + seconds,
        focusSessions: [
          {
            id: newId("f"),
            startedAt: new Date().toISOString(),
            durationSec: seconds,
            completedSec: seconds,
            label,
          },
          ...prev.focusSessions,
        ],
      }));
    },
    [update]
  );

  const updateReview = useCallback(
    (patch: Partial<DayReview>) => {
      update((prev) => ({
        ...prev,
        review: { ...prev.review, ...patch },
      }));
    },
    [update]
  );

  const closeDay = useCallback(() => {
    pushActivity({ kind: "day_close", title: "Day closed" });
    update((prev) => ({
      ...prev,
      review: {
        ...prev.review,
        closedAt: new Date().toISOString(),
      },
    }));
  }, [update]);

  const replaceState = useCallback((next: DayState) => {
    setState(touchDayState(next));
  }, []);

  const value = useMemo<DayContextValue | null>(() => {
    if (!state) return null;

    const tasksDone = state.tasks.filter((t) => t.done).length;
    const tasksTotal = state.tasks.length;
    const priorities = state.tasks.filter((t) => t.priority);
    const prioritiesDone = priorities.filter((t) => t.done).length;
    const habitsDone = state.habits.filter((h) => h.doneToday).length;
    const habitsTotal = state.habits.length;

    const taskScore = tasksTotal ? tasksDone / tasksTotal : 0;
    const priScore = priorities.length ? prioritiesDone / priorities.length : 0;
    const habScore = habitsTotal ? habitsDone / habitsTotal : 0;
    const dayPct = Math.round((taskScore * 0.45 + priScore * 0.35 + habScore * 0.2) * 100);

    return {
      ready,
      state,
      stats: {
        tasksDone,
        tasksTotal,
        tasksPct: tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0,
        prioritiesDone,
        prioritiesTotal: priorities.length,
        habitsDone,
        habitsTotal,
        focusLabel: formatFocus(state.focusSecondsToday),
        focusSeconds: state.focusSecondsToday,
        dayPct,
      },
      addTask,
      toggleTask,
      removeTask,
      setTaskPriority,
      updateTaskTitle,
      toggleHabit,
      addHabit,
      addBlock,
      removeBlock,
      reorderSchedule,
      logFocusSeconds,
      updateReview,
      closeDay,
      replaceState,
    };
  }, [
    state,
    ready,
    addTask,
    toggleTask,
    removeTask,
    setTaskPriority,
    updateTaskTitle,
    toggleHabit,
    addHabit,
    addBlock,
    removeBlock,
    reorderSchedule,
    logFocusSeconds,
    updateReview,
    closeDay,
    replaceState,
  ]);

  if (!value) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-sm text-text-tertiary">
        Loading your day…
      </div>
    );
  }

  return <DayContext.Provider value={value}>{children}</DayContext.Provider>;
}

export function useDay() {
  const ctx = useContext(DayContext);
  if (!ctx) {
    throw new Error("useDay must be used within DayProvider");
  }
  return ctx;
}
