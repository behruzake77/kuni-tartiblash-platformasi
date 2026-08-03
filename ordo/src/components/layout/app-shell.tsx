"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const [addOpen, setAddOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
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
  }, []);

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
      setAddOpen(true);
    };
    window.addEventListener("ordo:add-task", onAdd);
    return () => window.removeEventListener("ordo:add-task", onAdd);
  }, []);

  // Register service worker once
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  function submitTask(e?: React.FormEvent) {
    e?.preventDefault();
    if (!taskTitle.trim()) return;
    addTask(taskTitle, {
      priority: asPriority,
      tag: asPriority ? "Priority" : "Inbox",
    });
    toast({
      title: asPriority ? t("task.priorityAdded") : t("task.added"),
      description: taskTitle.trim(),
      kind: "success",
    });
    setTaskTitle("");
    setAsPriority(false);
    setAddOpen(false);
  }

  const mobile = [
    { href: "/app", label: t("mobile.today"), match: (p: string) => p === "/app" },
    {
      href: "/app/focus",
      label: t("mobile.focus"),
      match: (p: string) => p.startsWith("/app/focus"),
    },
    {
      href: "/app/habits",
      label: t("mobile.habits"),
      match: (p: string) => p.startsWith("/app/habits"),
    },
    {
      href: "/app/review",
      label: t("mobile.close"),
      match: (p: string) => p.startsWith("/app/review"),
    },
  ];

  return (
    <div className="min-h-dvh bg-bg">
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
        className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] flex border-t border-border bg-surface-1/95 px-1 py-2 backdrop-blur md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        aria-label="Mobile"
      >
        {mobile.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium",
              l.match(pathname) ? "text-primary" : "text-text-tertiary"
            )}
          >
            {l.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setCmdOpen(true)}
          className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium text-primary"
        >
          ⌘K
        </button>
      </nav>

      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        onAddTask={() => {
          setCmdOpen(false);
          setAsPriority(false);
          setTaskTitle("");
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
