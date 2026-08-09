"use client";

import { useEffect, useRef } from "react";
import {
  getNotificationPermission,
  minutesUntil,
  showOrdoNotification,
  timeToTodayDate,
} from "@/lib/notifications";
import { pushInbox } from "@/lib/inbox";
import { todayKey } from "@/lib/day-defaults";
import type { ScheduleBlock, Task } from "@/lib/types";
import type { OrdoPrefs } from "@/lib/user-storage";

type UseRemindersOpts = {
  schedule: ScheduleBlock[];
  tasks?: Task[];
  prefs: OrdoPrefs;
  enabled: boolean;
  onInApp?: (msg: { title: string; body: string }) => void;
  labels?: {
    upcoming: string;
    starting: string;
  };
};

/**
 * Polls every 20s and fires one reminder per block or task per day
 * (lead window + at-start window).
 */
export function useReminders({
  schedule,
  tasks,
  prefs,
  enabled,
  onInApp,
  labels,
}: UseRemindersOpts) {
  const fired = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || !prefs.remindersEnabled) return;
    if (typeof window === "undefined") return;

    const tick = () => {
      const now = new Date();
      const dayKey = todayKey(now);
      const lead = Math.max(0, prefs.reminderLeadMinutes || 0);
      const perm = getNotificationPermission();

      for (const block of schedule) {
        const start = timeToTodayDate(block.time, now);
        if (!start) continue;
        const mins = minutesUntil(start, now);

        // Lead reminder
        if (lead > 0 && mins <= lead && mins > 0) {
          const key = `${dayKey}:${block.id}:lead`;
          if (!fired.current.has(key)) {
            fired.current.add(key);
            const title = labels?.upcoming || "Upcoming block";
            const body = `${block.time} · ${block.label}`;
            let shown = false;
            if (perm === "granted") {
              shown = showOrdoNotification({
                title,
                body,
                tag: key,
                onClickUrl: "/app/schedule",
              });
            }
            pushInbox({
              kind: "reminder",
              title,
              body,
              href: "/app/schedule",
            });
            if (!shown && prefs.inAppReminders) {
              onInApp?.({ title, body });
            }
          }
        }

        // Starting now (0..1 min window)
        if (mins <= 0 && mins > -1) {
          const key = `${dayKey}:${block.id}:start`;
          if (!fired.current.has(key)) {
            fired.current.add(key);
            const title = labels?.starting || "Block starting";
            const body = `${block.label} · ${block.kind}`;
            let shown = false;
            if (perm === "granted") {
              shown = showOrdoNotification({
                title,
                body,
                tag: key,
                onClickUrl: "/app/schedule",
              });
            }
            pushInbox({
              kind: "reminder",
              title,
              body,
              href: "/app/schedule",
            });
            if (!shown && prefs.inAppReminders) {
              onInApp?.({ title, body });
            }
          }
        }
      }

      if (tasks) {
        for (const task of tasks) {
          if (!task.time || task.done) continue;
          const start = timeToTodayDate(task.time, now);
          if (!start) continue;
          const mins = minutesUntil(start, now);

          // Lead reminder
          if (lead > 0 && mins <= lead && mins > 0) {
            const key = `${dayKey}:task-${task.id}:lead`;
            if (!fired.current.has(key)) {
              fired.current.add(key);
              const title = labels?.upcoming || "Upcoming task";
              const body = `${task.time} · ${task.title}`;
              let shown = false;
              if (perm === "granted") {
                shown = showOrdoNotification({
                  title,
                  body,
                  tag: key,
                  onClickUrl: "/app",
                });
              }
              pushInbox({
                kind: "reminder",
                title,
                body,
                href: "/app",
              });
              if (!shown && prefs.inAppReminders) {
                onInApp?.({ title, body });
              }
            }
          }

          // Starting now (0..1 min window)
          if (mins <= 0 && mins > -1) {
            const key = `${dayKey}:task-${task.id}:start`;
            if (!fired.current.has(key)) {
              fired.current.add(key);
              const title = labels?.starting || "Task starting";
              const body = `${task.time} · ${task.title}`;
              let shown = false;
              if (perm === "granted") {
                shown = showOrdoNotification({
                  title,
                  body,
                  tag: key,
                  onClickUrl: "/app",
                });
              }
              pushInbox({
                kind: "reminder",
                title,
                body,
                href: "/app",
              });
              if (!shown && prefs.inAppReminders) {
                onInApp?.({ title, body });
              }
            }
          }
        }
      }

      // prune old keys occasionally
      if (fired.current.size > 200) {
        fired.current = new Set(
          [...fired.current].filter((k) => k.startsWith(dayKey))
        );
      }
    };

    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, [
    schedule,
    tasks,
    prefs.remindersEnabled,
    prefs.reminderLeadMinutes,
    prefs.inAppReminders,
    enabled,
    onInApp,
    labels?.upcoming,
    labels?.starting,
  ]);
}
