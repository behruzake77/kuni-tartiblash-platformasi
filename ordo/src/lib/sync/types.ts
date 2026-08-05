import type { DayState } from "@/lib/types";
import type { OrdoPrefs, OrdoUser } from "@/lib/user-storage";

export type SyncPayload = {
  version: 1;
  updatedAt: string;
  user: OrdoUser | null;
  prefs: OrdoPrefs;
  day: DayState;
  deviceId: string;
};

export type SyncStatus =
  | "idle"
  | "offline"
  | "syncing"
  | "synced"
  | "error"
  | "local-only";

export type SyncProvider = {
  id: "local" | "http" | "builtin" | "supabase";
  label: string;
  /** true when remote endpoint is configured */
  isRemote: boolean;
  pull: () => Promise<SyncPayload | null>;
  push: (payload: SyncPayload) => Promise<{ ok: boolean; error?: string }>;
};

export type SyncMeta = {
  lastPulledAt: string | null;
  lastPushedAt: string | null;
  lastError: string | null;
  status: SyncStatus;
  providerId: string;
  deviceId: string;
};
