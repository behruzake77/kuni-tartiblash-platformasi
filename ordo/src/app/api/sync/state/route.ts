import { NextRequest, NextResponse } from "next/server";
import {
  deleteWorkspace,
  readWorkspaceState,
  writeWorkspaceState,
} from "@/lib/sync/server-store";
import type { SyncPayload } from "@/lib/sync/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function workspaceFrom(req: NextRequest, body?: { workspace?: string }) {
  const q = req.nextUrl.searchParams.get("workspace");
  const header = req.headers.get("x-ordo-workspace");
  return (body?.workspace || q || header || "default").trim() || "default";
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkToken(req: NextRequest) {
  const expected =
    process.env.ORDO_SYNC_TOKEN || process.env.NEXT_PUBLIC_ORDO_SYNC_TOKEN;
  if (!expected) return true;
  const auth = req.headers.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const header = req.headers.get("x-ordo-token") || "";
  return bearer === expected || header === expected;
}

/** Simple in-memory rate limit: 60 req / min / IP */
const hits = globalThis as typeof globalThis & {
  __ordoRate?: Map<string, { n: number; t: number }>;
};

function rateLimit(req: NextRequest): boolean {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  if (!hits.__ordoRate) hits.__ordoRate = new Map();
  const now = Date.now();
  const cur = hits.__ordoRate.get(ip);
  if (!cur || now - cur.t > 60_000) {
    hits.__ordoRate.set(ip, { n: 1, t: now });
    return true;
  }
  cur.n += 1;
  return cur.n <= 60;
}

export async function GET(req: NextRequest) {
  if (!checkToken(req)) return unauthorized();
  if (!rateLimit(req)) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  const workspace = workspaceFrom(req);
  const state = await readWorkspaceState(workspace);
  if (!state) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(state, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(req: NextRequest) {
  if (!checkToken(req)) return unauthorized();
  if (!rateLimit(req)) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  let body: SyncPayload & { workspace?: string };
  try {
    body = (await req.json()) as SyncPayload & { workspace?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || body.version !== 1 || !body.day) {
    return NextResponse.json(
      { error: "Invalid SyncPayload" },
      { status: 400 }
    );
  }

  const workspace = workspaceFrom(req, body);
  const existing = await readWorkspaceState(workspace);

  if (existing?.updatedAt && body.updatedAt) {
    const remoteT = Date.parse(existing.updatedAt) || 0;
    const incomingT = Date.parse(body.updatedAt) || 0;
    if (remoteT > incomingT) {
      return NextResponse.json(
        {
          ok: false,
          conflict: true,
          server: existing,
          error: "Server has newer state",
        },
        { status: 409 }
      );
    }
  }

  const payload: SyncPayload = {
    version: 1,
    updatedAt: body.updatedAt || new Date().toISOString(),
    user: body.user ?? null,
    prefs: body.prefs,
    day: body.day,
    deviceId: body.deviceId || "unknown",
  };

  const backend = await writeWorkspaceState(workspace, payload);

  return NextResponse.json({ ok: true, workspace, backend });
}

export async function DELETE(req: NextRequest) {
  if (!checkToken(req)) return unauthorized();
  const workspace = workspaceFrom(req);
  await deleteWorkspace(workspace);
  return NextResponse.json({ ok: true });
}
