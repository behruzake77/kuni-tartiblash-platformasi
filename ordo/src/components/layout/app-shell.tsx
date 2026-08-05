"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, Focus, Moon, Plus, Sun, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { CommandPalette } from "@/components/layout/command-palette";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDay } from "@/providers/day-provider";
import { useToast } from "@/components/ui/toast";
import { useUser } from "@/providers/user-provider";
import { useReminders } from "@/hooks/use-reminders";
import { useKeyboardNav } from "@/hooks/use-keyboard-nav";
import { useWeeklySnapshot } from "@/hooks/use-weekly-snapshot";
import { addPlannedTask } from "@/lib/planned-tasks";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
};

export function AppShell({ children, title }: AppShellProps) {
  const pathname = usePathname();
  const { t, prefs } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [taskTag, setTaskTag] = useState("Shaxsiy");
  const [taskTime, setTaskTime] = useState("");
  const [asPriority, setAsPriority] = useState(false);
  const { addTask, toggleTask, stats, state } = useDay();
  const { toast } = useToast();

  useKeyboardNav(true);
  useWeeklySnapshot();

  useReminders({
    schedule: state.schedule,
    prefs,
    enabled: true,
    labels: {
      upcoming: t("reminders.upcoming"),
      starting: t("reminders.starting"),
    },
    onInApp: (msg) => {
      toast({ title: msg.title, description: msg.body, kind: "info" });
    },
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.date]);

  useEffect(() => {
    const onToggle = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (id) toggleTask(id);
    };
    window.addEventListener("ordo:toggle-task", onToggle as EventListener);
    return () =>
      window.removeEventListener("ordo:toggle-task", onToggle as EventListener);
  }, [toggleTask]);

  useEffect(() => {
    const onAdd = () => {
      setAsPriority(false);
      setTaskTitle("");
      setTargetDate(state.date);
      setAddOpen(true);
    };
    window.addEventListener("ordo:add-task", onAdd);
    return () => window.removeEventListener("ordo:add-task", onAdd);
  }, [state.date]);

  useEffect(() => {
    const celebrate = () => {
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 1000);
    };
    window.addEventListener("ordo:all-tasks-complete", celebrate);
    return () => window.removeEventListener("ordo:all-tasks-complete", celebrate);
  }, []);

  // Register service worker once
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  async function submitTask(e?: React.FormEvent) {
    e?.preventDefault();
    if (!taskTitle.trim()) return;
    const title = taskTitle.trim();
    try {
      if (targetDate && targetDate !== state.date) {
        await addPlannedTask({ date: targetDate, title, priority: asPriority, tag: taskTag, time: taskTime });
        toast({ title: "Vazifa rejalashtirildi", description: `${targetDate} · ${title}`, kind: "success" });
      } else {
        addTask(title, { priority: asPriority, tag: taskTag || "Shaxsiy", time: taskTime });
        toast({ title: asPriority ? t("task.priorityAdded") : t("task.added"), description: title, kind: "success" });
      }
      setTaskTitle("");
      setTaskTag("Shaxsiy");
      setTaskTime("");
      setAsPriority(false);
      setAddOpen(false);
    } catch {
      toast({ title: "Vazifa saqlanmadi", description: "Internet va sinxronlash sozlamalarini tekshiring.", kind: "default" });
    }
  }

  const mobile = [
    { href: "/app", label: t("mobile.today"), icon: Sun, match: (p: string) => p === "/app" },
    { href: "/app/focus", label: t("mobile.focus"), icon: Focus, match: (p: string) => p.startsWith("/app/focus") },
    { href: "/app/habits", label: t("mobile.habits"), icon: CheckSquare, match: (p: string) => p.startsWith("/app/habits") },
    { href: "/app/review", label: t("mobile.close"), icon: Moon, match: (p: string) => p.startsWith("/app/review") },
  ];

  return (
    <div className="min-h-dvh bg-bg">
      {celebrating && <div className="ordo-confetti pointer-events-none fixed inset-x-0 bottom-20 z-[var(--z-toast)] mx-auto h-28 w-64" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ left: `${8 + index * 5}%`, '--x': `${(index % 2 ? 1 : -1) * (20 + (index % 5) * 12)}px`, '--c': ['#7C5CFF','#4FD1FF','#22C55E','#F59E0B'][index % 4], animationDelay: `${index * 18}ms` } as React.CSSProperties} />)}</div>}
      <div className="hidden md:block">
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          dayPct={stats.dayPct}
          onOpenCommand={() => setCmdOpen(true)}
        />
      </div>
      <AppHeader
        title={title}
        sidebarCollapsed={collapsed}
        onOpenCommand={() => setCmdOpen(true)}
      />
      <main
        id="main"
        className={cn(
          "min-h-dvh pt-14 pb-20 transition-[padding] duration-[var(--duration-base)] ease-[var(--ease-soft)] md:pb-0",
          collapsed ? "md:pl-14" : "md:pl-60"
        )}
      >
        <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] flex min-h-[4.25rem] items-end border-t border-border bg-surface-1/95 px-1 pt-1.5 backdrop-blur md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        aria-label="Mobile navigation"
      >
        {mobile.slice(0, 2).map((l) => {
          const Icon = l.icon;
          return <Link key={l.href} href={l.href} className={cn("flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium", l.match(pathname) ? "text-primary" : "text-text-tertiary")}><Icon className="size-[19px]" aria-hidden="true" /><span className="max-w-full truncate px-1">{l.label}</span></Link>;
        })}
        <button type="button" onClick={() => { setAsPriority(false); setTaskTitle(""); setTargetDate(state.date); setAddOpen(true); }} className="-mt-7 flex size-14 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-gradient-brand text-white shadow-lg shadow-primary/30" aria-label={t("today.addTask")}><Plus className="size-6" /></button>
        {mobile.slice(2).map((l) => {
          const Icon = l.icon;
          return <Link key={l.href} href={l.href} className={cn("flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium", l.match(pathname) ? "text-primary" : "text-text-tertiary")}><Icon className="size-[19px]" aria-hidden="true" /><span className="max-w-full truncate px-1">{l.label}</span></Link>;
        })}
      </nav>
      <button type="button" onClick={() => setCmdOpen(true)} className="fixed bottom-[5.25rem] right-4 z-[var(--z-sticky)] grid size-11 place-items-center rounded-full border border-border bg-surface-elevated text-primary shadow-lg md:hidden" aria-label={t("nav.command")}><Zap className="size-4" /></button>

      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        onAddTask={() => {
          setCmdOpen(false);
          setAsPriority(false);
          setTaskTitle("");
          setTargetDate(state.date);
          setAddOpen(true);
        }}
      />

      <Dialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title={t("task.addTitle")}
        description={t("task.addDesc")}
      >
        <form onSubmit={submitTask} className="space-y-4">
          <Input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder={t("task.placeholder")}
            autoComplete="off"
          />
          <div>
            <label htmlFor="task-date" className="mb-1.5 block text-sm font-medium text-text-primary">Qaysi kun uchun?</label>
            <Input id="task-date" type="date" value={targetDate || state.date} min={state.date} onChange={(e) => setTargetDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label htmlFor="task-tag" className="mb-1.5 block text-sm font-medium text-text-primary">Kategoriya</label><select id="task-tag" value={taskTag} onChange={(e) => setTaskTag(e.target.value)} className="h-10 w-full rounded-[var(--radius-sm)] border border-border bg-surface-3 px-3 text-sm text-text-primary"><option>Shaxsiy</option><option>Ish</option><option>O‘qish</option><option>Sog‘liq</option><option>Boshqa</option></select></div>
            <div><label htmlFor="task-time" className="mb-1.5 block text-sm font-medium text-text-primary">Vaqt (ixtiyoriy)</label><Input id="task-time" type="text" inputMode="numeric" pattern="^([01]\d|2[0-3]):[0-5]\d$" value={taskTime} onChange={(e) => setTaskTime(e.target.value)} placeholder="14:30" /></div>
          </div>
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={asPriority}
              onChange={(e) => setAsPriority(e.target.checked)}
              className="size-4 rounded border-border accent-[var(--color-primary)]"
            />
            {t("task.markPriority")}
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" variant="gradient">
              {t("today.addTask")}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
