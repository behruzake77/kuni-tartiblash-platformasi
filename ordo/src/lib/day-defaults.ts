import type { DayState, Habit, ScheduleBlock, Task } from "@/lib/types";

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

export function defaultTasks(): Task[] {
  const now = new Date().toISOString();
  return [
    {
      id: id("t"),
      title: "Ship onboarding polish",
      tag: "Deep work",
      done: false,
      priority: true,
      createdAt: now,
    },
    {
      id: id("t"),
      title: "Review Q3 hiring plan",
      tag: "Meeting prep",
      done: true,
      priority: true,
      createdAt: now,
    },
    {
      id: id("t"),
      title: "Write weekly update",
      tag: "Communication",
      done: false,
      priority: true,
      createdAt: now,
    },
    {
      id: id("t"),
      title: "Reply to design feedback",
      tag: "Admin",
      done: false,
      priority: false,
      createdAt: now,
    },
    {
      id: id("t"),
      title: "Book dentist",
      tag: "Personal",
      done: true,
      priority: false,
      createdAt: now,
    },
    {
      id: id("t"),
      title: "Prep demo script",
      tag: "Deep work",
      done: false,
      priority: false,
      createdAt: now,
    },
    {
      id: id("t"),
      title: "Clear inbox to zero",
      tag: "Admin",
      done: true,
      priority: false,
      createdAt: now,
    },
    {
      id: id("t"),
      title: "Outline blog draft",
      tag: "Creative",
      done: false,
      priority: false,
      createdAt: now,
    },
  ];
}

export function defaultHabits(): Habit[] {
  return [
    {
      id: id("h"),
      name: "Morning pages",
      cadence: "Daily · morning",
      streak: 12,
      doneToday: true,
      week: [true, true, true, true, true, false, true],
    },
    {
      id: id("h"),
      name: "Workout",
      cadence: "5× / week",
      streak: 6,
      doneToday: true,
      week: [true, false, true, true, true, true, true],
    },
    {
      id: id("h"),
      name: "No phone first hour",
      cadence: "Daily · morning",
      streak: 4,
      doneToday: false,
      week: [true, true, false, true, true, false, false],
    },
    {
      id: id("h"),
      name: "Evening shutdown",
      cadence: "Daily · evening",
      streak: 9,
      doneToday: false,
      week: [true, true, true, true, true, true, false],
    },
  ];
}

export function defaultSchedule(): ScheduleBlock[] {
  return [
    {
      id: id("s"),
      time: "09:00",
      endTime: "11:00",
      label: "Deep work — Onboarding",
      kind: "focus",
    },
    {
      id: id("s"),
      time: "11:30",
      endTime: "12:00",
      label: "Standup",
      kind: "meet",
    },
    {
      id: id("s"),
      time: "13:00",
      endTime: "14:30",
      label: "Focus — Hiring plan",
      kind: "focus",
    },
    {
      id: id("s"),
      time: "15:00",
      endTime: "15:45",
      label: "1:1 with Sam",
      kind: "meet",
    },
    {
      id: id("s"),
      time: "16:00",
      endTime: "16:30",
      label: "Admin buffer",
      kind: "admin",
    },
    {
      id: id("s"),
      time: "17:00",
      endTime: "17:15",
      label: "Day close review",
      kind: "review",
    },
  ];
}

export function createDefaultDay(date = todayKey()): DayState {
  return {
    version: 1,
    date,
    tasks: defaultTasks(),
    habits: defaultHabits(),
    schedule: defaultSchedule(),
    focusSessions: [],
    focusSecondsToday: 80 * 60, // demo: 1h 20m already logged
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
