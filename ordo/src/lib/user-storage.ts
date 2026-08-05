import type { Locale } from "@/lib/i18n";

const USER_KEY = "ordo.user.v1";
const PREFS_KEY = "ordo.prefs.v1";
const ONBOARD_KEY = "ordo.onboarded.v1";

export type OrdoUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
};

export type OrdoPrefs = {
  locale: Locale;
  dayStart: string;
  focusMinutes: number;
  maxPriorities: number;
  /** Minutes before a schedule block to fire a reminder */
  reminderLeadMinutes: number;
  /** Enable browser notifications for upcoming blocks */
  remindersEnabled: boolean;
  /** Soft chime / toast even if OS notifications denied */
  inAppReminders: boolean;
  /**
   * Workspace key for built-in / cloud sync (usually email or shared code).
   * Devices with the same key share state.
   */
  workspaceKey: string;
  /** Prefer built-in /api/sync when no external URL is set */
  useBuiltInSync: boolean;
  /** Auto-push after local changes (debounced by sync provider) */
  autoSync: boolean;
  /** Visual preset selected by the user. */
  themePreset: "default" | "ocean" | "forest" | "sunset" | "winter" | "spring" | "comic";
};

const defaultPrefs: OrdoPrefs = {
  locale: "en",
  dayStart: "08:00",
  focusMinutes: 45,
  maxPriorities: 3,
  reminderLeadMinutes: 5,
  remindersEnabled: true,
  inAppReminders: true,
  workspaceKey: "",
  useBuiltInSync: true,
  autoSync: true,
  themePreset: "default",
};

function canStore() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadUser(): OrdoUser | null {
  if (!canStore()) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as OrdoUser) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: OrdoUser) {
  if (!canStore()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
  if (!canStore()) return;
  localStorage.removeItem(USER_KEY);
}

export function loadPrefs(): OrdoPrefs {
  if (!canStore()) return { ...defaultPrefs };
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...defaultPrefs };
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {
    return { ...defaultPrefs };
  }
}

export function savePrefs(prefs: OrdoPrefs) {
  if (!canStore()) return;
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  localStorage.setItem("ordo.locale", prefs.locale);
}

export function isOnboarded(): boolean {
  if (!canStore()) return true;
  return localStorage.getItem(ONBOARD_KEY) === "1";
}

export function setOnboarded(v = true) {
  if (!canStore()) return;
  if (v) localStorage.setItem(ONBOARD_KEY, "1");
  else localStorage.removeItem(ONBOARD_KEY);
}

export function wipeAllOrdoData() {
  if (!canStore()) return;
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("ordo."));
  keys.forEach((k) => localStorage.removeItem(k));
  // also clear any legacy non-prefixed if present
}
