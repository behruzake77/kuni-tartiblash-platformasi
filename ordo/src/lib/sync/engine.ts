import { loadDayState, saveDayState } from "@/lib/storage";
import {
  loadPrefs,
  loadUser,
  savePrefs,
  saveUser,
  type OrdoPrefs,
  type OrdoUser,
} from "@/lib/user-storage";
import { getDeviceId } from "@/lib/sync/device";
import { resolveProvider } from "@/lib/sync/providers";
import type { SyncMeta, SyncPayload, SyncProvider, SyncStatus } from "@/lib/sync/types";
import type { DayState } from "@/lib/types";
import { pushActivity } from "@/lib/activity";
import { pushInbox } from "@/lib/inbox";

const META_KEY = "ordo.sync.meta.v1";

function canStore() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadSyncMeta(): SyncMeta {
  const deviceId = getDeviceId();
  const provider = resolveProvider();
  const base: SyncMeta = {
    lastPulledAt: null,
    lastPushedAt: null,
    lastError: null,
    status: provider.isRemote ? "idle" : "local-only",
    providerId: provider.id,
    deviceId,
  };
  if (!canStore()) return base;
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return base;
    return { ...base, ...JSON.parse(raw), deviceId, providerId: provider.id };
  } catch {
    return base;
  }
}

export function saveSyncMeta(meta: SyncMeta) {
  if (!canStore()) return;
  localStorage.setItem(META_KEY, JSON.stringify(meta));
  window.dispatchEvent(
    new CustomEvent("ordo:sync-meta", { detail: { meta } })
  );
}

export function buildPayload(
  day: DayState,
  user: OrdoUser | null,
  prefs: OrdoPrefs
): SyncPayload {
  return {
    version: 1,
    updatedAt: day.updatedAt || new Date().toISOString(),
    user,
    prefs,
    day: {
      ...day,
      updatedAt: day.updatedAt || new Date().toISOString(),
    },
    deviceId: getDeviceId(),
  };
}

/** Last-write-wins by updatedAt */
export function mergePayloads(
  local: SyncPayload,
  remote: SyncPayload
): { winner: SyncPayload; source: "local" | "remote" | "equal" } {
  const lt = Date.parse(local.updatedAt || 0 as unknown as string) || 0;
  const rt = Date.parse(remote.updatedAt || 0 as unknown as string) || 0;
  if (rt > lt) return { winner: remote, source: "remote" };
  if (lt > rt) return { winner: local, source: "local" };
  return { winner: local, source: "equal" };
}

export function applyPayload(payload: SyncPayload) {
  saveDayState(payload.day);
  savePrefs(payload.prefs);
  if (payload.user) saveUser(payload.user);
  window.dispatchEvent(
    new CustomEvent("ordo:sync-apply", { detail: { payload } })
  );
}

export async function runSync(opts?: {
  direction?: "pull" | "push" | "both";
  silent?: boolean;
}): Promise<SyncMeta> {
  const direction = opts?.direction || "both";
  const provider = resolveProvider();
  let meta = loadSyncMeta();

  if (!provider.isRemote) {
    meta = { ...meta, status: "local-only", lastError: null };
    saveSyncMeta(meta);
    return meta;
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    meta = { ...meta, status: "offline" };
    saveSyncMeta(meta);
    return meta;
  }

  meta = { ...meta, status: "syncing", lastError: null };
  saveSyncMeta(meta);

  try {
    const localDay = loadDayState();
    const localUser = loadUser();
    const localPrefs = loadPrefs();
    const localPayload = buildPayload(localDay, localUser, localPrefs);

    if (direction === "pull" || direction === "both") {
      const remote = await provider.pull();
      if (remote) {
        const { winner, source } = mergePayloads(localPayload, remote);
        if (source === "remote") {
          applyPayload(winner);
          if (!opts?.silent) {
            pushActivity({
              kind: "sync",
              title: "Synced from cloud",
              detail: "Remote changes applied",
            });
            pushInbox({
              kind: "sync",
              title: "Cloud sync",
              body: "Newer data pulled from cloud",
              href: "/app",
            });
          }
        }
        meta = {
          ...meta,
          lastPulledAt: new Date().toISOString(),
        };
      }
    }

    if (direction === "push" || direction === "both") {
      // rebuild after possible pull apply
      const day = loadDayState();
      const payload = buildPayload(day, loadUser(), loadPrefs());
      const res = await provider.push(payload);
      if (!res.ok) throw new Error(res.error || "Push failed");
      meta = {
        ...meta,
        lastPushedAt: new Date().toISOString(),
      };
      if (!opts?.silent) {
        pushActivity({
          kind: "sync",
          title: "Pushed to cloud",
          detail: provider.label,
        });
      }
    }

    meta = { ...meta, status: "synced", lastError: null };
    saveSyncMeta(meta);
    return meta;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync error";
    meta = { ...meta, status: "error", lastError: message };
    saveSyncMeta(meta);
    if (!opts?.silent) {
      pushInbox({
        kind: "sync",
        title: "Sync failed",
        body: message,
        href: "/app/settings",
      });
    }
    return meta;
  }
}

export function getActiveProvider(): SyncProvider {
  return resolveProvider();
}

export function setStatus(status: SyncStatus) {
  const meta = { ...loadSyncMeta(), status };
  saveSyncMeta(meta);
  return meta;
}
