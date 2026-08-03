import { NextResponse } from "next/server";
import { getAuthProviderId } from "@/lib/auth";
import { activeStoreBackend, listWorkspaces } from "@/lib/sync/server-store";
import { getAppVersion, getSiteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let syncWorkspaces = 0;
  try {
    syncWorkspaces = (await listWorkspaces()).length;
  } catch {
    syncWorkspaces = -1;
  }

  const backend = activeStoreBackend();

  return NextResponse.json(
    {
      ok: true,
      service: "ordo",
      version: getAppVersion(),
      time: new Date().toISOString(),
      auth: getAuthProviderId(),
      sync: {
        builtIn: true,
        backend,
        durable: backend === "upstash" || backend === "filesystem",
        workspaces: syncWorkspaces,
        externalUrl: Boolean(process.env.NEXT_PUBLIC_ORDO_SYNC_URL),
      },
      siteUrl: getSiteUrl(),
      node: process.version,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
