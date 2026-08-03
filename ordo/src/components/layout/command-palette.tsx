"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarClock,
  CheckSquare,
  Flame,
  Focus,
  Moon,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";
import { useDay } from "@/providers/day-provider";
import { useToast } from "@/components/ui/toast";
import { useUser } from "@/providers/user-provider";
import { cn } from "@/lib/utils";
import type { CommandAction } from "@/lib/types";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: () => void;
};

export function CommandPalette({
  open,
  onOpenChange,
  onAddTask,
}: CommandPaletteProps) {
  const router = useRouter();
  const { addTask, state } = useDay();
  const { toast } = useToast();
  const { t } = useUser();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const setQueryAndReset = (value: string) => {
    setQuery(value);
    setActive(0);
  };

  const actions = useMemo<CommandAction[]>(() => {
    const nav: CommandAction[] = [
      {
        id: "nav-today",
        label: t("cmd.goToday"),
        group: t("cmd.navigate"),
        keywords: ["home", "board", "bugun"],
        shortcut: "G T",
        run: () => router.push("/app"),
      },
      {
        id: "nav-schedule",
        label: t("cmd.goSchedule"),
        group: t("cmd.navigate"),
        keywords: ["calendar", "blocks", "time", "jadval"],
        run: () => router.push("/app/schedule"),
      },
      {
        id: "nav-focus",
        label: t("cmd.goFocus"),
        group: t("cmd.navigate"),
        keywords: ["timer", "pomodoro", "fokus"],
        shortcut: "G F",
        run: () => router.push("/app/focus"),
      },
      {
        id: "nav-habits",
        label: t("cmd.goHabits"),
        group: t("cmd.navigate"),
        keywords: ["streak", "odat"],
        run: () => router.push("/app/habits"),
      },
      {
        id: "nav-review",
        label: t("cmd.goReview"),
        group: t("cmd.navigate"),
        keywords: ["review", "evening", "yakun"],
        run: () => router.push("/app/review"),
      },
      {
        id: "nav-insights",
        label: t("cmd.goInsights"),
        group: t("cmd.navigate"),
        keywords: ["analytics", "stats", "tahlil"],
        run: () => router.push("/app/insights"),
      },
      {
        id: "nav-settings",
        label: t("cmd.goSettings"),
        group: t("cmd.navigate"),
        run: () => router.push("/app/settings"),
      },
    ];

    const create: CommandAction[] = [
      {
        id: "add-task",
        label: t("cmd.addTask"),
        group: t("cmd.create"),
        keywords: ["new", "todo"],
        shortcut: "N",
        run: () => onAddTask(),
      },
      {
        id: "add-priority",
        label: t("cmd.addPriority"),
        group: t("cmd.create"),
        keywords: ["p1", "important"],
        run: () => onAddTask(),
      },
      {
        id: "start-focus",
        label: t("cmd.startFocus"),
        group: t("cmd.create"),
        keywords: ["timer"],
        run: () => router.push("/app/focus"),
      },
      {
        id: "plan-day",
        label: t("cmd.planDay"),
        group: t("cmd.create"),
        keywords: ["ai", "assist", "reja"],
        run: () => {
          const openTasks = state.tasks.filter((x) => !x.done).slice(0, 3);
          if (openTasks.length) {
            toast({
              title: t("cmd.dayPlan"),
              description: openTasks.map((x) => x.title).join(" · "),
              kind: "info",
            });
          } else {
            addTask("Define today's top outcome", {
              priority: true,
              tag: "Plan",
            });
            toast({
              title: t("cmd.startedPlan"),
              description: t("cmd.starterPriority"),
              kind: "success",
            });
          }
        },
      },
    ];

    const taskActions: CommandAction[] = state.tasks
      .filter((task) => !task.done)
      .slice(0, 8)
      .map((task) => ({
        id: `task-${task.id}`,
        label: task.title,
        hint: task.priority ? "P" : task.tag,
        group: t("cmd.openTasks"),
        keywords: [task.tag, "complete", "done"],
        run: () => {
          window.dispatchEvent(
            new CustomEvent("ordo:toggle-task", { detail: { id: task.id } })
          );
          toast({
            title: t("cmd.markedDone"),
            description: task.title,
            kind: "success",
          });
        },
      }));

    return [...create, ...nav, ...taskActions];
  }, [router, onAddTask, state.tasks, addTask, toast, t]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => {
      const hay = [a.label, a.hint, a.group, ...(a.keywords || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [actions, query]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Reset search when palette closes via parent
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current && !open) {
      // closed — clear on next open via key handler / open change from parent
    }
    if (!prevOpen.current && open) {
      setQueryAndReset("");
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[active];
        if (item) {
          item.run();
          onOpenChange(false);
        } else if (query.trim()) {
          addTask(query.trim());
          toast({
            title: t("task.added"),
            description: query.trim(),
            kind: "success",
          });
          onOpenChange(false);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, onOpenChange, query, addTask, toast, t]);

  if (!open) return null;

  const groups = filtered.reduce<Record<string, CommandAction[]>>((acc, a) => {
    (acc[a.group] ||= []).push(a);
    return acc;
  }, {});

  let runningIndex = -1;

  const iconFor = (id: string) => {
    if (id.startsWith("nav-today")) return Sun;
    if (id.startsWith("nav-schedule")) return CalendarClock;
    if (id.startsWith("nav-focus") || id === "start-focus") return Focus;
    if (id.startsWith("nav-habits")) return Flame;
    if (id.startsWith("nav-review")) return Moon;
    if (id.startsWith("nav-insights")) return BarChart3;
    if (id.startsWith("nav-settings")) return Settings;
    if (id === "plan-day") return Sparkles;
    if (id.startsWith("add") || id.startsWith("task")) return CheckSquare;
    return Plus;
  };

  return (
    <div className="fixed inset-0 z-[var(--z-command)] flex items-start justify-center px-4 pt-[min(20vh,8rem)]">
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        aria-label="Close command palette"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-[640px] overflow-hidden rounded-[var(--radius-xl)] border border-border-strong bg-surface-elevated shadow-xl shadow-glow"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 text-text-tertiary" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQueryAndReset(e.target.value)}
            placeholder={t("cmd.placeholder")}
            className="h-14 w-full bg-transparent text-[17px] text-text-primary outline-none placeholder:text-text-placeholder"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-text-tertiary sm:inline">
            ESC
          </kbd>
        </div>

        <div className="max-h-[min(420px,50vh)] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-text-tertiary">
              {t("cmd.empty")}
            </div>
          ) : (
            Object.entries(groups).map(([group, items]) => (
              <div key={group} className="mb-2">
                <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-text-tertiary">
                  {group}
                </p>
                <ul>
                  {items.map((item) => {
                    runningIndex += 1;
                    const idx = runningIndex;
                    const Icon = iconFor(item.id);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => {
                            item.run();
                            onOpenChange(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-[var(--radius-md)] px-2.5 py-2.5 text-left text-sm transition-colors",
                            idx === active
                              ? "bg-primary-subtle text-primary"
                              : "text-text-secondary hover:bg-surface-3"
                          )}
                        >
                          <Icon
                            className="size-4 shrink-0 opacity-80"
                            strokeWidth={1.75}
                          />
                          <span className="min-w-0 flex-1 truncate font-medium">
                            {item.label}
                          </span>
                          {item.hint && (
                            <span className="hidden text-xs text-text-tertiary sm:inline">
                              {item.hint}
                            </span>
                          )}
                          {item.shortcut && (
                            <kbd className="rounded border border-border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-text-tertiary">
                              {item.shortcut}
                            </kbd>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-text-tertiary">
          <span>{t("cmd.footer")}</span>
          <span className="font-[family-name:var(--font-mono)]">Ordo</span>
        </div>
      </div>
    </div>
  );
}
