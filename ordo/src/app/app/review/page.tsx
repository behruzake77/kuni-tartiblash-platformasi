"use client";

import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Moon, Sparkles } from "lucide-react";
import { useDay } from "@/providers/day-provider";
import { useToast } from "@/components/ui/toast";
import { useUser } from "@/providers/user-provider";

export default function ReviewPage() {
  const { state, stats, updateReview, closeDay, addTask } = useDay();
  const { toast } = useToast();
  const { t } = useUser();
  const { review } = state;
  const closed = Boolean(review.closedAt);

  function save() {
    closeDay();
    if (review.tomorrow.trim()) {
      const exists = state.tasks.some(
        (task) =>
          task.title.toLowerCase() === review.tomorrow.trim().toLowerCase() &&
          task.priority
      );
      if (!exists) {
        addTask(review.tomorrow.trim(), { priority: true, tag: "Tomorrow" });
      }
    }
    toast({
      title: t("review.closed"),
      description: t("review.closedBody"),
      kind: "success",
    });
  }

  function draftAi() {
    const open = state.tasks.filter((task) => !task.done).map((task) => task.title);
    const done = state.tasks.filter((task) => task.done).map((task) => task.title);
    updateReview({
      wins:
        review.wins.trim() ||
        (done.length
          ? done.slice(0, 4).join("\n")
          : "Protected focus time\nMoved key priorities forward"),
      slipped:
        review.slipped.trim() ||
        (open.length ? open.slice(0, 4).join("\n") : "Nothing major slipped"),
      tomorrow:
        review.tomorrow.trim() ||
        open[0] ||
        "Define the single most important outcome",
      energy: review.energy ?? 3,
    });
    toast({
      title: t("review.draftFilled"),
      description: t("review.draftEdit"),
      kind: "info",
    });
  }

  const fieldClass =
    "w-full rounded-[var(--radius-sm)] border border-border bg-surface-3 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/15";

  return (
    <AppShell title={t("nav.review")}>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Moon className="size-5 text-secondary" aria-hidden="true" />
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">
            {t("review.title")}
          </h2>
        </div>
        <p className="mt-1 text-sm text-text-secondary">{t("review.sub")}</p>
      </div>

      <div className="mx-auto grid max-w-2xl gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("review.glance")}</CardTitle>
            <CardDescription>{t("review.live")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="success">
              {stats.tasksDone}/{stats.tasksTotal} {t("review.tasks")}
            </Badge>
            <Badge variant="primary">
              {stats.focusLabel} {t("review.focus")}
            </Badge>
            <Badge variant="secondary">
              {stats.habitsDone}/{stats.habitsTotal} {t("review.habits")}
            </Badge>
            <Badge variant="outline">
              {stats.prioritiesTotal - stats.prioritiesDone}{" "}
              {t("review.prioritiesOpen")}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("review.wins")}</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={review.wins}
              onChange={(e) => updateReview({ wins: e.target.value })}
              rows={4}
              className={`${fieldClass} resize-y`}
              placeholder={t("review.winsPh")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("review.slipped")}</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={review.slipped}
              onChange={(e) => updateReview({ slipped: e.target.value })}
              rows={3}
              className={`${fieldClass} resize-y`}
              placeholder={t("review.slippedPh")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("review.tomorrow")}</CardTitle>
            <CardDescription>{t("review.tomorrowDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              value={review.tomorrow}
              onChange={(e) => updateReview({ tomorrow: e.target.value })}
              className={fieldClass}
              placeholder={t("review.tomorrowPh")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("review.energy")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => updateReview({ energy: n })}
                  className={
                    review.energy === n
                      ? "flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-primary text-sm font-semibold text-white"
                      : "flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface-2 text-sm font-medium text-text-secondary hover:border-border-strong"
                  }
                  aria-label={`Energy ${n} of 5`}
                  aria-pressed={review.energy === n}
                >
                  {n}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            variant="gradient"
            size="lg"
            leftIcon={
              closed ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Moon className="size-4" />
              )
            }
            onClick={save}
          >
            {closed ? t("review.update") : t("review.save")}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            leftIcon={<Sparkles className="size-4 text-secondary" />}
            onClick={draftAi}
          >
            {t("review.draft")}
          </Button>
        </div>

        {closed && (
          <p className="text-sm text-success" role="status">
            {t("review.closed")}
            {review.closedAt
              ? ` · ${new Date(review.closedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : ""}
            . {t("review.closedBody")}
          </p>
        )}
      </div>
    </AppShell>
  );
}
