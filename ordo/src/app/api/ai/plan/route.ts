import { NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { getServerUser } from "@/lib/server-auth";

export const runtime = "nodejs";

type PlanRequest = { prompt?: string; existingTasks?: string[]; locale?: string };

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

const usage = new Map<string, { startedAt: number; count: number }>();
function withinAiLimit(userId: string) {
  const now = Date.now();
  const current = usage.get(userId);
  if (!current || now - current.startedAt > 60 * 60 * 1000) {
    usage.set(userId, { startedAt: now, count: 1 });
    return true;
  }
  if (current.count >= 20) return false;
  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  const user = await getServerUser(request);
  if (!user) return jsonError("UNAUTHORIZED", 401);
  if (!withinAiLimit(user.id)) return jsonError("AI_RATE_LIMITED", 429);
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return jsonError("AI_NOT_CONFIGURED", 503);
  }

  let body: PlanRequest;
  try { body = await request.json() as PlanRequest; } catch { return jsonError("INVALID_REQUEST", 400); }
  const prompt = body.prompt?.trim();
  if (!prompt || prompt.length > 1200) return jsonError("PROMPT_REQUIRED", 400);

  const context = (body.existingTasks || []).slice(0, 12).map((task) => `- ${task.slice(0, 160)}`).join("\n");
  const language = body.locale === "ru" ? "Russian" : body.locale === "en" ? "English" : "Uzbek (Latin)";
  const system = `You are Ordo AI, a concise daily-planning assistant. Reply in ${language}. Create practical task suggestions only; never claim actions were saved. Return valid JSON exactly in this shape: {"summary":"short sentence","tasks":[{"title":"task","priority":true|false,"estimateMinutes":25}]}. Return 3 to 6 tasks. Keep titles under 90 characters.`;

  try {
    const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });
    const command = new InvokeModelCommand({
      modelId: process.env.AWS_BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 700,
        temperature: 0.4,
        system,
        messages: [{ role: "user", content: `User request: ${prompt}\n\nExisting tasks:\n${context || "None"}` }],
      }),
    });
    const response = await client.send(command);
    const raw = JSON.parse(new TextDecoder().decode(response.body)) as { content?: Array<{ text?: string }> };
    const text = raw.content?.map((part) => part.text || "").join("").trim() || "";
    const cleaned = text.replace(/^```json\s*|\s*```$/g, "");
    const plan = JSON.parse(cleaned) as { summary?: string; tasks?: unknown[] };
    if (!Array.isArray(plan.tasks)) throw new Error("Invalid model response");
    return NextResponse.json({ summary: String(plan.summary || ""), tasks: plan.tasks.slice(0, 6) });
  } catch (error) {
    console.error("[ordo-ai] Bedrock request failed", error instanceof Error ? error.message : "unknown");
    return jsonError("AI_REQUEST_FAILED", 502);
  }
}
