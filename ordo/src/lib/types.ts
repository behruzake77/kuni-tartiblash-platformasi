/** Ordo day-control domain types */

export type Task = {
  id: string;
  title: string;
  tag: string;
  done: boolean;
  priority: boolean;
  /** Optional time assigned within the planned day. */
  time?: string;
  createdAt: string;
};

export type Habit = {
  id: string;
  name: string;
  cadence: string;
  streak: number;
  doneToday: boolean;
  /** Mon–Sun completion flags for current week */
  week: boolean[];
};

export type ScheduleBlock = {
  id: string;
  time: string;
  endTime?: string;
  label: string;
  kind: "focus" | "meet" | "admin" | "review" | "break";
};

export type FocusSession = {
  id: string;
  startedAt: string;
  durationSec: number;
  completedSec: number;
  label?: string;
};

export type DayReview = {
  date: string;
  wins: string;
  slipped: string;
  tomorrow: string;
  energy: number | null;
  closedAt: string | null;
};

export type DayState = {
  version: 1;
  date: string;
  tasks: Task[];
  habits: Habit[];
  schedule: ScheduleBlock[];
  focusSessions: FocusSession[];
  focusSecondsToday: number;
  review: DayReview;
  /** ISO timestamp for multi-device last-write-wins sync */
  updatedAt?: string;
};

export type CommandAction = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  keywords?: string[];
  shortcut?: string;
  run: () => void;
};
