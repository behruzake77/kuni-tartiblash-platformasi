"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Clock,
  Focus,
  MoreHorizontal,
  Plus,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AiPlanner } from "@/components/app/ai-planner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDay } from "@/providers/day-provider";
import { useToast } from "@/components/ui/toast";
import { useUser } from "@/providers/user-provider";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return "greet.morning";
  if (h < 18) return "greet.afternoon";
  return "greet.evening";
}

function formatToday(locale: string) {
  const loc = locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US";
  return new Intl.DateTimeFormat(loc, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export default function TodayPage() {
  const { t, locale } = useUser();
  const {
    state,
    stats,
    toggleTask,
    removeTask,
    setTaskPriority,
    toggleHabit,
  } = useDay();
  const { toast } = useToast();

  const priorities = state.tasks.filter((x) => x.priority);
  const rest = state.tasks.filter((x) => !x.priority);

  function openAdd() {
    window.dispatchEvent(new Event("ordo:add-task"));
  }

  function planDay() {
    const open = state.tasks.filter((x) => !x.done);
    const tops = open.filter((x) => x.priority);
    const list = (tops.length ? tops : open).slice(0, 3);
    toast({
      title: t("today.planReady"),
      description: list.length
        ? list.map((x, i) => `P${i + 1}: ${x.title}`).join(" · ")
        : t("today.planEmpty"),
      kind: "info",
    });
  }

  return (
    <AppShell title={t("nav.today")}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-text-tertiary">
            {t(greetingKey())} · {formatToday(locale)}
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            {t("today.title")}
          </h2>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Sparkles className="size-4 text-secondary" />}
            onClick={planDay}
          >
            {t("today.plan")}
          </Button>
          <AiPlanner />
          <Button
            variant="gradient"
            size="sm"
            leftIcon={<Focus className="size-4" />}
            onClick={() => {
              window.location.href = "/app/focus";
            }}
          >
            {t("today.startFocus")}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: t("today.tasksDone"),
            value: `${stats.tasksDone}/${stats.tasksTotal}`,
            sub: `${stats.tasksPct}% ${t("today.complete")}`,
          },
          {
            label: t("today.priorities"),
            value: `${stats.prioritiesDone}/${stats.prioritiesTotal}`,
            sub: t("today.mustFinish"),
          },
          {
            label: t("today.focusProtected"),
            value: stats.focusLabel,
            sub: t("today.loggedToday"),
          },
          {
            label: t("today.habits"),
            value: `${stats.habitsDone}/${stats.habitsTotal}`,
            sub: t("today.checkedIn"),
          },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-text-tertiary">
                {m.label}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-text-primary">
                {m.value}
              </p>
              <p className="mt-1 text-xs text-text-tertiary">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-3">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 p-6 pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{t("today.topPriorities")}</CardTitle>
                <Badge variant="primary">{t("today.max3")}</Badge>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t("today.addTask")}
                onClick={openAdd}
              >
                <Plus className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {priorities.length === 0 ? (
                <p className="px-2 py-4 text-sm text-text-tertiary">
                  {t("today.noPriorities")}
                </p>
              ) : (
                priorities.map((task, i) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    index={i + 1}
                    onToggle={() => toggleTask(task.id)}
                    onRemove={() => {
                      removeTask(task.id);
                      toast({ title: t("task.removed"), kind: "default" });
                    }}
                    onStar={() => setTaskPriority(task.id, false)}
                  />
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 p-6 pb-3">
              <CardTitle className="text-base">{t("today.rest")}</CardTitle>
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-tertiary">
                {rest.filter((x) => !x.done).length} {t("today.open")}
              </span>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {rest.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onRemove={() => {
                    removeTask(task.id);
                    toast({ title: t("task.removed"), kind: "default" });
                  }}
                  onStar={() => {
                    setTaskPriority(task.id, true);
                    toast({
                      title: t("task.promoted"),
                      description: task.title,
                      kind: "success",
                    });
                  }}
                />
              ))}
              <button
                type="button"
                onClick={openAdd}
                className="mt-2 flex w-full items-center gap-2 rounded-[var(--radius-sm)] border border-dashed border-border px-3 py-2.5 text-sm text-text-tertiary transition-colors hover:border-border-strong hover:text-text-secondary"
              >
                <Plus className="size-4" aria-hidden="true" />
                {t("today.addTask")}
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 p-6 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="size-4 text-primary" aria-hidden="true" />
                {t("today.schedule")}
              </CardTitle>
              <Link href="/app/schedule">
                <Button variant="ghost" size="icon-sm" aria-label="Schedule">
                  <MoreHorizontal className="size-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {state.schedule.map((b) => (
                <div
                  key={b.id}
                  className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-border bg-surface-3/40 px-3 py-2.5"
                >
                  <span className="w-[4.5rem] shrink-0 font-[family-name:var(--font-mono)] text-[11px] text-text-tertiary">
                    {b.endTime ? `${b.time}–${b.endTime}` : b.time}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text-primary">{b.label}</p>
                    <Badge
                      variant={
                        b.kind === "focus"
                          ? "primary"
                          : b.kind === "meet"
                            ? "secondary"
                            : b.kind === "review"
                              ? "accent"
                              : "default"
                      }
                      className="mt-1"
                    >
                      {b.kind}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 p-6 pb-3">
              <CardTitle className="text-base">{t("today.habits")}</CardTitle>
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-tertiary">
                {stats.habitsDone}/{stats.habitsTotal}
              </span>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {state.habits.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => toggleHabit(h.id)}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-2 py-2.5 text-left transition-colors hover:bg-surface-3/60"
                >
                  {h.doneToday ? (
                    <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <Circle className="size-4 shrink-0 text-text-tertiary" aria-hidden="true" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      h.doneToday
                        ? "text-text-tertiary line-through"
                        : "text-text-primary"
                    )}
                  >
                    {h.name}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-brand-subtle">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-primary">
                {t("today.dayClose")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {state.review.closedAt
                  ? t("today.dayCloseDone")
                  : t("today.dayCloseBody")}
              </p>
              <Link href="/app/review">
                <Button variant="secondary" size="sm" className="mt-4">
                  {t("today.openDayClose")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function TaskRow({
  task,
  index,
  onToggle,
  onRemove,
  onStar,
}: {
  task: Task;
  index?: number;
  onToggle: () => void;
  onRemove: () => void;
  onStar: () => void;
}) {
  return (
    <div className="group flex items-start gap-1 rounded-[var(--radius-sm)] hover:bg-surface-3/60">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-w-0 flex-1 items-start gap-3 px-2 py-2.5 text-left"
      >
        {task.done ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
        ) : (
          <Circle className="mt-0.5 size-4 shrink-0 text-text-tertiary" aria-hidden="true" />
        )}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm",
              task.done ? "text-text-tertiary line-through" : "text-text-primary"
            )}
          >
            {typeof index === "number" && (
              <span className="mr-2 font-[family-name:var(--font-mono)] text-xs text-primary">
                P{index}
              </span>
            )}
            {task.title}
          </p>
          <p className="text-xs text-text-tertiary">{task.tag}</p>
        </div>
      </button>
      <div className="flex items-center gap-0.5 pr-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
        <button
          type="button"
          onClick={onStar}
          className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary hover:bg-surface-2 hover:text-warning"
          aria-label="Priority"
        >
          <Star
            className={cn("size-3.5", task.priority && "fill-warning text-warning")}
          />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary hover:bg-surface-2 hover:text-danger"
          aria-label="Delete"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
