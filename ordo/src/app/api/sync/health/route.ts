import { NextResponse } from "next/server";
import {
  activeStoreBackend,
  listWorkspaces,
} from "@/lib/sync/server-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const workspaces = await listWorkspaces();
  const backend = activeStoreBackend();
  return NextResponse.json({
    ok: true,
    service: "ordo-sync",
    backend,
    workspaces: workspaces.length,
    builtIn: true,
    durable:
      backend === "upstash" ||
      backend === "filesystem",
    time: new Date().toISOString(),
  });
}
