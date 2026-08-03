import { promises as fs } from "fs";
import path from "path";
import type { SyncPayload } from "@/lib/sync/types";

/**
 * Multi-backend store for built-in Ordo sync API.
 *
 * Priority:
 * 1. Upstash Redis REST (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
 * 2. Filesystem under .data/sync/ (Docker / VPS)
 * 3. In-process memory (serverless fallback — not multi-instance durable)
 */

const ROOT = path.join(process.cwd(), ".data", "sync");
const mem = globalThis as typeof globalThis & {
  __ordoSyncMem?: Map<string, SyncPayload>;
};

function memoryMap() {
  if (!mem.__ordoSyncMem) mem.__ordoSyncMem = new Map();
  return mem.__ordoSyncMem;
}

function safeKey(workspace: string) {
  return (
    workspace
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9@._-]+/g, "_")
      .slice(0, 120) || "default"
  );
}

function fileFor(workspace: string) {
  return path.join(ROOT, `${safeKey(workspace)}.json`);
}

function redisConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function redisFetch(command: unknown[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Redis ${res.status}`);
  }
  return res.json() as Promise<{ result: unknown }>;
}

async function ensureDir() {
  await fs.mkdir(ROOT, { recursive: true });
}

export type StoreBackend = "upstash" | "filesystem" | "memory";

export function activeStoreBackend(): StoreBackend {
  if (redisConfigured()) return "upstash";
  // Prefer filesystem when writable; detect lazily at runtime
  return "filesystem";
}

export async function readWorkspaceState(
  workspace: string
): Promise<SyncPayload | null> {
  const key = safeKey(workspace);

  if (redisConfigured()) {
    try {
      const { result } = await redisFetch(["GET", `ordo:sync:${key}`]);
      if (!result || typeof result !== "string") return null;
      const data = JSON.parse(result) as SyncPayload;
      if (!data || data.version !== 1 || !data.day) return null;
      return data;
    } catch {
      return null;
    }
  }

  try {
    const file = fileFor(workspace);
    const raw = await fs.readFile(file, "utf8");
    const data = JSON.parse(raw) as SyncPayload;
    if (!data || data.version !== 1 || !data.day) return null;
    return data;
  } catch {
    // filesystem unavailable (serverless) → memory
    return memoryMap().get(key) ?? null;
  }
}

export async function writeWorkspaceState(
  workspace: string,
  payload: SyncPayload
): Promise<StoreBackend> {
  const key = safeKey(workspace);

  if (redisConfigured()) {
    await redisFetch([
      "SET",
      `ordo:sync:${key}`,
      JSON.stringify(payload),
    ]);
    return "upstash";
  }

  try {
    await ensureDir();
    const file = fileFor(workspace);
    const tmp = `${file}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(payload, null, 2), "utf8");
    await fs.rename(tmp, file);
    return "filesystem";
  } catch {
    memoryMap().set(key, payload);
    return "memory";
  }
}

export async function listWorkspaces(): Promise<string[]> {
  if (redisConfigured()) {
    try {
      const { result } = await redisFetch(["KEYS", "ordo:sync:*"]);
      if (!Array.isArray(result)) return [];
      return result.map((k) =>
        String(k).replace(/^ordo:sync:/, "")
      );
    } catch {
      return [];
    }
  }

  try {
    await ensureDir();
    const files = await fs.readdir(ROOT);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [...memoryMap().keys()];
  }
}

export async function deleteWorkspace(workspace: string): Promise<void> {
  const key = safeKey(workspace);
  if (redisConfigured()) {
    await redisFetch(["DEL", `ordo:sync:${key}`]);
    return;
  }
  try {
    await fs.unlink(fileFor(workspace));
  } catch {
    memoryMap().delete(key);
  }
}
