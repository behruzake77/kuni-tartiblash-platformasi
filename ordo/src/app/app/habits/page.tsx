"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, Flame, Plus, Snowflake } from "lucide-react";
import { useDay } from "@/providers/day-provider";
import { useToast } from "@/components/ui/toast";
import { useUser } from "@/providers/user-provider";
import { cn } from "@/lib/utils";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function HabitsPage() {
  const { state, stats, toggleHabit, addHabit } = useDay();
  const { toast } = useToast();
  const { t, prefs } = useUser();
  const isWinter = prefs.themePreset === "winter";
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(name);
    toast({ title: t("habits.added"), description: name.trim(), kind: "success" });
    setName("");
    setOpen(false);
  }

  return (
    <AppShell title={t("nav.habits")}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">
            {t("habits.title")}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {t("habits.sub")}{" "}
            <span className="font-[family-name:var(--font-mono)] text-text-tertiary">
              {stats.habitsDone}/{stats.habitsTotal} {t("habits.today")}
            </span>
          </p>
        </div>
        <Button
          variant="gradient"
          size="md"
          className="w-full sm:w-auto"
          leftIcon={<Plus className="size-4" />}
          onClick={() => setOpen(true)}
        >
          {t("habits.new")}
        </Button>
      </div>

      {state.habits.length > 0 && (
        <Card className="mb-5 overflow-hidden border-success/20 bg-[radial-gradient(circle_at_85%_20%,rgba(34,197,94,.14),transparent_30%),linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.01))]">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div><p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-success">Bugungi odatlar</p><p className="mt-2 text-lg font-semibold text-text-primary">Har kichik belgi katta natija beradi.</p><p className="mt-1 text-sm text-text-secondary">{stats.habitsDone} ta bajarildi · {Math.max(0, stats.habitsTotal - stats.habitsDone)} ta qoldi</p></div>
            <div className="grid size-20 shrink-0 place-items-center rounded-full p-[4px]" style={{ background: `conic-gradient(var(--color-success) ${(stats.habitsTotal ? stats.habitsDone / stats.habitsTotal * 100 : 0)}%, rgba(255,255,255,.1) 0)` }}><div className="grid size-full place-items-center rounded-full bg-surface-1 text-center"><b className="text-lg text-text-primary">{stats.habitsTotal ? Math.round(stats.habitsDone / stats.habitsTotal * 100) : 0}%</b><span className="text-[9px] text-text-tertiary">BUGUN</span></div></div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {state.habits.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center px-6 py-12 text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary-subtle text-primary"><Flame className="size-6" /></span>
              <p className="mt-4 font-semibold text-text-primary">{t("habits.title")}</p>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-text-secondary">{t("habits.sub")}</p>
              <Button variant="shine" className="mt-5" leftIcon={<Plus className="size-4" />} onClick={() => setOpen(true)}>{t("habits.new")}</Button>
            </CardContent>
          </Card>
        )}
        {state.habits.map((h) => (
          <Card key={h.id} className="habit-row">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => toggleHabit(h.id)}
                className="habit-toggle flex min-w-0 items-start gap-3 text-left"
              >
                {h.doneToday ? (
                  isWinter ? (
                    <Snowflake
                      className="habit-crystal mt-0.5 size-5 shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-success"
                      aria-hidden="true"
                    />
                  )
                ) : (
                  <Circle
                    className="mt-0.5 size-5 shrink-0 text-text-tertiary"
                    aria-hidden="true"
                  />
                )}
                <div className="min-w-0">
                  <p
                    className={cn(
                      "font-medium",
                      h.doneToday
                        ? "text-text-tertiary line-through"
                        : "text-text-primary"
                    )}
                  >
                    {h.name}
                  </p>
                  <p className="mt-0.5 text-xs text-text-tertiary">{h.cadence}</p>
                </div>
              </button>

              <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                <div className="flex items-center gap-1" aria-label="This week">
                  {h.week.map((d, i) => (
                    <span
                      key={`${h.id}-${i}`}
                      title={DAYS[i]}
                      className={cn(
                        "flex size-6 items-center justify-center rounded-[var(--radius-xs)] text-[10px] font-medium",
                        d
                          ? "bg-primary-subtle text-primary"
                          : "bg-surface-3 text-text-tertiary"
                      )}
                    >
                      {DAYS[i]}
                    </span>
                  ))}
                </div>
                <Badge variant="secondary" className="normal-case tracking-normal">
                  <Flame className="size-3" aria-hidden="true" />
                  {h.streak} {t("habits.streak")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={t("habits.newTitle")}
        description={t("habits.newDesc")}
      >
        <form onSubmit={submit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("habits.placeholder")}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" variant="gradient">
              {t("habits.add")}
            </Button>
          </div>
        </form>
      </Dialog>
    </AppShell>
  );
}
