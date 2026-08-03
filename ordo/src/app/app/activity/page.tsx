"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/providers/activity-provider";
import { useUser } from "@/providers/user-provider";
import {
  CheckCircle2,
  Circle,
  Clock,
  Cloud,
  Flame,
  Focus,
  Moon,
  Plus,
  Trash2,
} from "lucide-react";
import type { ActivityKind } from "@/lib/activity";

function iconFor(kind: ActivityKind) {
  switch (kind) {
    case "task_add":
      return Plus;
    case "task_done":
      return CheckCircle2;
    case "task_undone":
      return Circle;
    case "task_remove":
      return Trash2;
    case "habit_done":
    case "habit_undone":
    case "habit_add":
      return Flame;
    case "focus":
      return Focus;
    case "block_add":
    case "block_remove":
      return Clock;
    case "day_close":
      return Moon;
    case "sync":
      return Cloud;
    default:
      return Circle;
  }
}

export default function ActivityPage() {
  const { t, locale } = useUser();
  const { items, clear } = useActivity();

  const fmt = (iso: string) => {
    const loc =
      locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US";
    return new Intl.DateTimeFormat(loc, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  };

  return (
    <AppShell title={t("nav.activity")}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">
            {t("activity.title")}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">{t("activity.sub")}</p>
        </div>
        {items.length > 0 && (
          <Button variant="secondary" size="sm" onClick={() => clear()}>
            {t("activity.clear")}
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <p className="px-6 py-16 text-center text-sm text-text-tertiary">
              {t("activity.empty")}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => {
                const Icon = iconFor(item.kind);
                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 px-4 py-3.5 sm:px-6"
                  >
                    <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface-3 text-primary">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        {item.title}
                      </p>
                      {item.detail && (
                        <p className="mt-0.5 text-xs text-text-secondary">
                          {item.detail}
                        </p>
                      )}
                      <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] text-text-tertiary">
                        {fmt(item.at)} · {item.kind}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
