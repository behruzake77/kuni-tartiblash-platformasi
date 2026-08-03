/** Browser notification helpers for Ordo reminders */

export type NotificationPermissionState =
  | "unsupported"
  | "default"
  | "granted"
  | "denied";

export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    const result = await Notification.requestPermission();
    return result as NotificationPermissionState;
  } catch {
    return getNotificationPermission();
  }
}

export function showOrdoNotification(opts: {
  title: string;
  body?: string;
  tag?: string;
  onClickUrl?: string;
}) {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;

  try {
    const n = new Notification(opts.title, {
      body: opts.body,
      tag: opts.tag || "ordo",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      silent: false,
    });
    n.onclick = () => {
      window.focus();
      if (opts.onClickUrl) {
        window.location.href = opts.onClickUrl;
      }
      n.close();
    };
    return true;
  } catch {
    return false;
  }
}

/** Parse "HH:MM" into today's Date, or null */
export function timeToTodayDate(hhmm: string, now = new Date()): Date | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  const d = new Date(now);
  d.setHours(h, min, 0, 0);
  return d;
}

export function minutesUntil(target: Date, now = new Date()) {
  return Math.round((target.getTime() - now.getTime()) / 60000);
}
