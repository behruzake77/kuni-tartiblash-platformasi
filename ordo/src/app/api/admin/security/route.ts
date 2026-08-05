import { NextResponse } from "next/server";
import { getServerUser, isServerAdmin } from "@/lib/server-auth";

export const runtime = "nodejs";

/** Minimal server-protected admin status endpoint. It intentionally exposes no secrets. */
export async function GET(request: Request) {
  const user = await getServerUser(request);
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!isServerAdmin(user.email)) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  return NextResponse.json({
    admin: true,
    aiConfigured: Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_BEDROCK_MODEL_ID),
    authConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    rateLimit: "20 AI requests per hour per active server instance",
  });
}
