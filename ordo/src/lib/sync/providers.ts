import type { SyncPayload, SyncProvider } from "@/lib/sync/types";
import { loadPrefs } from "@/lib/user-storage";

/** Always available — no network */
export const localProvider: SyncProvider = {
  id: "local",
  label: "This device only",
  isRemote: false,
  async pull() {
    return null;
  },
  async push() {
    return { ok: true };
  },
};

function authHeaders(token?: string): Record<string, string> {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

/**
 * Optional external HTTP sync endpoint.
 * NEXT_PUBLIC_ORDO_SYNC_URL — REST base
 */
export function createHttpProvider(
  baseUrl: string,
  opts?: { token?: string; workspace?: string }
): SyncProvider {
  const url = baseUrl.replace(/\/$/, "");
  const workspace = opts?.workspace || "default";

  return {
    id: "http",
    label: "Cloud sync",
    isRemote: true,
    async pull() {
      const qs = new URLSearchParams({ workspace });
      const res = await fetch(`${url}/state?${qs}`, {
        method: "GET",
        headers: {
          ...authHeaders(opts?.token),
          "x-ordo-workspace": workspace,
        },
        cache: "no-store",
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Pull failed (${res.status})`);
      const data = (await res.json()) as SyncPayload;
      if (!data || data.version !== 1 || !data.day) return null;
      return data;
    },
    async push(payload: SyncPayload) {
      const res = await fetch(`${url}/state`, {
        method: "PUT",
        headers: {
          ...authHeaders(opts?.token),
          "x-ordo-workspace": workspace,
        },
        body: JSON.stringify({ ...payload, workspace }),
      });
      if (res.status === 409) {
        return { ok: false, error: "Server has newer state (409)" };
      }
      if (!res.ok) return { ok: false, error: `Push failed (${res.status})` };
      return { ok: true };
    },
  };
}

/**
 * Built-in Next.js route handlers under /api/sync
 * Multi-device when app is deployed and devices share workspaceKey.
 */
export function createBuiltInProvider(
  workspace: string,
  token?: string
): SyncProvider {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const base = `${origin}/api/sync`;
  const inner = createHttpProvider(base, { token, workspace });
  return {
    ...inner,
    id: "builtin",
    label: "Built-in server sync",
  };
}

export function resolveProvider(): SyncProvider {
  const prefs =
    typeof window !== "undefined"
      ? loadPrefs()
      : { workspaceKey: "", useBuiltInSync: true };

  const external =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_ORDO_SYNC_URL
      : undefined;
  const token =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_ORDO_SYNC_TOKEN || process.env.ORDO_SYNC_TOKEN
      : undefined;

  const workspace =
    (prefs as { workspaceKey?: string }).workspaceKey?.trim() || "default";

  if (external && external.startsWith("http")) {
    return createHttpProvider(external, { token, workspace });
  }

  // Built-in API (same deployment) — only in browser when workspace set
  if (
    typeof window !== "undefined" &&
    (prefs as { useBuiltInSync?: boolean }).useBuiltInSync !== false
  ) {
    if (workspace && workspace !== "default") {
      return createBuiltInProvider(workspace, token);
    }
  }

  return localProvider;
}
