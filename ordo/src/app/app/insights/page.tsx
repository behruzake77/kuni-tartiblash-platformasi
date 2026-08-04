"use client";

import { useEffect, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDay } from "@/providers/day-provider";
import { useUser } from "@/providers/user-provider";
import { formatFocus, todayKey } from "@/lib/day-defaults";
import {
  buildWeekSeries,
  upsertTodaySnapshot,
  weekSummary,
} from "@/lib/weekly-stats";
import { buildWeeklyMarkdown } from "@/lib/export/markdown";
import { downloadTextFile } from "@/lib/export/ics";
import { useToast } from "@/components/ui/toast";

export default function InsightsPage() {
  const { state, stats } = useDay();
  const { t } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    upsertTodaySnapshot(state);
  }, [state]);

  // Rebuild after snapshot write; state.date / focus / tasks drive the series
  const series = useMemo(
    () => buildWeekSeries(7),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional refresh when day mutates
    [state.date, state.focusSecondsToday, state.tasks, state.habits, state.review.closedAt]
  );
  const summary = weekSummary(series);
  const maxFocus = Math.max(...series.map((s) => s.focusSec), 1);
  const dayLabels = series.map((s) => s.date.slice(5)); // MM-DD

  function exportWeek() {
    const md = buildWeeklyMarkdown({
      title: `Ordo weekly · ${series[0]?.date} → ${series[series.length - 1]?.date}`,
      days: series.map((s) => ({
        date: s.date,
        completion: s.completion,
        focusSec: s.focusSec,
        habits: s.habitsPct,
      })),
      notes: [
        `Avg completion ${summary.avgCompletion}%`,
        `Total focus ${formatFocus(summary.totalFocusSec)}`,
        `Closed days ${summary.closedDays}/7`,
        summary.bestDate
          ? `Best day ${summary.bestDate} (${summary.bestCompletion}%)`
          : "No best day yet",
      ],
    });
    downloadTextFile(
      `ordo-week-${todayKey()}.md`,
      md,
      "text/markdown;charset=utf-8"
    );
    toast({ title: t("export.done"), kind: "success" });
  }

  return (
    <AppShell title={t("nav.insights")}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">
            {t("insights.title")}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">{t("insights.sub")}</p>
        </div>
        <Button variant="secondary" size="md" className="w-full sm:w-auto" onClick={exportWeek}>
          {t("export.weekMd")}
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: t("insights.todayCompletion"),
            value: `${stats.tasksPct}%`,
            note: `${stats.tasksDone}/${stats.tasksTotal}`,
          },
          {
            label: t("insights.focusToday"),
            value: stats.focusLabel,
            note: `${state.focusSessions.length} ${t("insights.sessions")}`,
          },
          {
            label: t("insights.habitRate"),
            value:
              stats.habitsTotal > 0
                ? `${Math.round((stats.habitsDone / stats.habitsTotal) * 100)}%`
                : "—",
            note: `${stats.habitsDone}/${stats.habitsTotal} ${t("insights.checked")}`,
          },
          {
            label: t("insights.dayProgress"),
            value: `${stats.dayPct}%`,
            note: state.review.closedAt
              ? t("insights.dayClosed")
              : t("insights.stillOpen"),
          },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-text-tertiary">
                {m.label}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-text-primary">
                {m.value}
              </p>
              <p className="mt-1 text-xs text-text-tertiary">{m.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">{t("insights.weekReport")}</CardTitle>
          <Badge variant="secondary">{summary.activeDays}/7</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: t("insights.avgCompletion"),
                value: `${summary.avgCompletion}%`,
              },
              {
                label: t("insights.totalFocus"),
                value: formatFocus(summary.totalFocusSec),
              },
              {
                label: t("insights.closedDays"),
                value: `${summary.closedDays}`,
              },
              {
                label: t("insights.bestDay"),
                value: summary.bestDate
                  ? `${summary.bestDate.slice(5)} · ${summary.bestCompletion}%`
                  : "—",
              },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-text-tertiary">
                  {m.label}
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-text-primary">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("insights.focusMinutes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-44 items-end gap-2 sm:gap-3">
              {series.map((s, i) => (
                <div
                  key={s.date}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-[var(--radius-xs)] bg-gradient-brand opacity-90"
                    style={{
                      height: `${Math.max(4, (s.focusSec / maxFocus) * 100)}%`,
                    }}
                    title={formatFocus(s.focusSec)}
                  />
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-tertiary">
                    {dayLabels[i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("insights.completion")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-44 items-end gap-2 sm:gap-3">
              {series.map((s, i) => (
                <div
                  key={s.date}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-[var(--radius-xs)] bg-secondary/80"
                    style={{
                      height: `${Math.max(4, Math.min(100, s.completion))}%`,
                    }}
                    title={`${s.completion}%`}
                  />
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-tertiary">
                    {dayLabels[i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">{t("insights.observations")}</CardTitle>
          <Badge variant="primary">{t("insights.live")}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            stats.focusSeconds > 45 * 60
              ? `Strong focus day — ${formatFocus(stats.focusSeconds)} protected.`
              : "Focus is light so far. A single 45-minute block can change the day.",
            stats.prioritiesDone === stats.prioritiesTotal &&
            stats.prioritiesTotal > 0
              ? "All priorities cleared. Rare and worth noticing."
              : `${Math.max(0, stats.prioritiesTotal - stats.prioritiesDone)} priority item(s) still open.`,
            summary.avgCompletion >= 70
              ? `Solid week average: ${summary.avgCompletion}% completion across ${summary.activeDays} active days.`
              : summary.activeDays
                ? `Week average is ${summary.avgCompletion}%. Protect one deep block tomorrow.`
                : "Start logging today — your weekly chart fills automatically.",
            stats.habitsDone < stats.habitsTotal
              ? "A habit is still open. Small close beats perfect streak anxiety."
              : "Habits fully checked. Consistency compounds.",
          ].map((line) => (
            <p
              key={line}
              className="rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-3 text-sm leading-relaxed text-text-secondary"
            >
              {line}
            </p>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
