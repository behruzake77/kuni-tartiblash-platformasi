"use client";

import { useState } from "react";
import { Bot, Check, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { supabase } from "@/lib/auth/supabase";
import { useDay } from "@/providers/day-provider";
import { useToast } from "@/components/ui/toast";
import { useUser } from "@/providers/user-provider";

type Suggestion = { title: string; priority?: boolean; estimateMinutes?: number };

export function AiPlanner() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [tasks, setTasks] = useState<Suggestion[]>([]);
  const { state, addTask } = useDay();
  const { locale } = useUser();
  const { toast } = useToast();

  async function generate() {
    if (!prompt.trim() || !supabase) return;
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("AUTH_REQUIRED");
      const response = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt, locale, existingTasks: state.tasks.map((task) => task.title) }),
      });
      const result = await response.json() as { summary?: string; tasks?: Suggestion[]; error?: string };
      if (!response.ok) {
        if (result.error === "AI_RATE_LIMITED") throw new Error("AI_LIMIT");
        if (result.error === "AI_NOT_CONFIGURED") throw new Error("AI_NOT_CONFIGURED");
        throw new Error(result.error || "AI_REQUEST_FAILED");
      }
      setSummary(result.summary || "");
      setTasks(Array.isArray(result.tasks) ? result.tasks : []);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      toast({ title: code === "AI_LIMIT" ? "AI limiti tugadi" : "AI reja yarata olmadi", description: code === "AI_LIMIT" ? "Bir soat ichida 20 ta AI so‘roviga ruxsat beriladi." : code === "AI_NOT_CONFIGURED" ? "AI hali admin tomonidan sozlanmagan." : "Admin sozlamalari va internet ulanishini tekshiring.", kind: "default" });
    } finally { setLoading(false); }
  }

  function addOne(task: Suggestion) {
    addTask(task.title, { priority: Boolean(task.priority), tag: task.estimateMinutes ? `${task.estimateMinutes} min` : "AI reja" });
    setTasks((current) => current.filter((item) => item !== task));
    toast({ title: "Vazifa qo‘shildi", description: task.title, kind: "success" });
  }

  return <>
    <Button variant="shine" size="sm" leftIcon={<Sparkles className="size-4" />} onClick={() => setOpen(true)}>AI reja</Button>
    <Dialog open={open} onOpenChange={setOpen} title="AI bilan kunni rejalash" description="Maqsadingizni yozing. AI faqat taklif beradi — vazifalarni o‘zingiz tasdiqlab qo‘shasiz.">
      <div className="space-y-4"><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={4} placeholder="Masalan: Bugun product dizayni va marketing uchun samarali reja tuzib ber." className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-surface-3 px-3 py-3 text-sm text-text-primary placeholder:text-text-placeholder focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/15" />
      <Button variant="gradient" className="w-full" loading={loading} leftIcon={<Bot className="size-4" />} onClick={generate}>AI takliflarini yaratish</Button>
      {summary && <p className="rounded-[var(--radius-md)] border border-primary/20 bg-primary-subtle/40 px-3 py-3 text-sm text-text-secondary">{summary}</p>}
      {tasks.length > 0 && <div className="space-y-2">{tasks.map((task) => <div key={task.title} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface-2 p-3"><span className="grid size-8 place-items-center rounded-lg bg-primary-subtle text-primary"><Check className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium text-text-primary">{task.title}</p><p className="text-xs text-text-tertiary">{task.priority ? "Muhim" : "Oddiy"}{task.estimateMinutes ? ` · ${task.estimateMinutes} min` : ""}</p></div><Button variant="secondary" size="sm" leftIcon={<Plus className="size-3.5" />} onClick={() => addOne(task)}>Qo‘shish</Button></div>)}</div>}</div>
    </Dialog>
  </>;
}
