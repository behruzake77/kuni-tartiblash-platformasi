"use client";

import { useMemo, useState } from "react";
import { GripVertical, Plus, Trash2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TimeInput } from "@/components/ui/time-input";
import { useDay } from "@/providers/day-provider";
import { useToast } from "@/components/ui/toast";
import { useUser } from "@/providers/user-provider";
import { cn } from "@/lib/utils";

const kindVariant = {
  focus: "primary",
  meet: "secondary",
  admin: "default",
  review: "accent",
  break: "outline",
} as const;

const kindLabel = {
  focus: "Fokus",
  meet: "Uchrashuv",
  admin: "Boshqa ish",
  review: "Kun yakuni",
  break: "Tanaffus",
} as const;

const QUICK_BLOCK_PRESETS = [
  {
    time: "09:00",
    endTime: "11:00",
    label: "Chuqur ish — Fokus",
    kind: "focus" as const,
  },
  {
    time: "11:00",
    endTime: "12:00",
    label: "Jamoa uchrashuvi",
    kind: "meet" as const,
  },
  {
    time: "13:00",
    endTime: "14:00",
    label: "Tushlik va tanaffus",
    kind: "break" as const,
  },
  {
    time: "14:00",
    endTime: "16:00",
    label: "Loyiha ishi — Fokus",
    kind: "focus" as const,
  },
  {
    time: "16:00",
    endTime: "17:00",
    label: "Email, xabarlar va admin",
    kind: "admin" as const,
  },
  {
    time: "17:30",
    endTime: "18:00",
    label: "Kun yakuni — Review",
    kind: "review" as const,
  },
];

export default function SchedulePage() {
  const { t } = useUser();
  const { state, addBlock, removeBlock, reorderSchedule } = useDay();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("10:00");
  const [endTime, setEndTime] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<"focus" | "meet" | "admin" | "review" | "break">(
    "focus"
  );
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...state.schedule].sort((a, b) => a.time.localeCompare(b.time)),
    [state.schedule]
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim() || !time) return;
    addBlock({
      time,
      endTime: endTime || undefined,
      label: label.trim(),
      kind,
    });
    toast({
      title: t("schedule.added"),
      description: `${time}${endTime ? ` - ${endTime}` : ""} · ${label.trim()}`,
      kind: "success",
    });
    setLabel("");
    setEndTime("");
    setOpen(false);
  }

  function addPresetWorkday() {
    [
      { time: "09:00", endTime: "11:00", label: "Chuqur ish — Fokus", kind: "focus" as const },
      { time: "11:00", endTime: "12:00", label: "Jamoa uchrashuvi", kind: "meet" as const },
      { time: "13:00", endTime: "14:00", label: "Tushlik va tanaffus", kind: "break" as const },
      { time: "14:00", endTime: "17:00", label: "Loyiha ishi — Fokus", kind: "focus" as const },
      { time: "17:30", endTime: "18:00", label: "Kun yakuni — Review", kind: "review" as const },
    ].forEach((b) => addBlock(b));
    toast({
      title: t("schedule.added"),
      description: t("schedule.presetWorkday"),
      kind: "success",
    });
  }

  function addPresetFocusDay() {
    [
      { time: "08:00", endTime: "11:00", label: "Uzluksiz chuqur fokus bloki 1", kind: "focus" as const },
      { time: "11:30", endTime: "12:30", label: "Tanaffus va tushlik", kind: "break" as const },
      { time: "13:00", endTime: "16:00", label: "Chuqur fokus bloki 2", kind: "focus" as const },
      { time: "16:30", endTime: "17:00", label: "Ertangi reja va kun yakuni", kind: "review" as const },
    ].forEach((b) => addBlock(b));
    toast({
      title: t("schedule.added"),
      description: t("schedule.presetFocusDay"),
      kind: "success",
    });
  }

  return (
    <AppShell title={t("nav.schedule")}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">
            {t("schedule.title")}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {t("schedule.sub")}{" "}
            <span className="text-text-tertiary">· {t("schedule.dragHint")}</span>
          </p>
        </div>
        <Button
          variant="gradient"
          size="md"
          className="w-full sm:w-auto"
          leftIcon={<Plus className="size-4" />}
          onClick={() => setOpen(true)}
        >
          {t("schedule.add")}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-2 p-3 sm:p-4">
          {sorted.length === 0 ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex w-full flex-col items-center rounded-[var(--radius-md)] border border-dashed border-border px-4 py-10 text-center text-sm text-text-tertiary transition-colors hover:border-primary hover:bg-primary-subtle/30 hover:text-text-secondary"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-primary-subtle text-primary">
                  <Plus className="size-5" />
                </span>
                <span className="mt-3 font-medium text-text-secondary">
                  {t("schedule.free")}
                </span>
                <span className="mt-1 text-xs">{t("schedule.add")}</span>
              </button>

              <div className="border-t border-border pt-3">
                <p className="mb-2 text-xs font-medium text-text-tertiary">
                  {t("schedule.presetDayTitle")}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={addPresetWorkday}
                    className="flex flex-col items-start rounded-[var(--radius-md)] border border-border bg-surface-2 p-3 text-left transition-colors hover:border-primary hover:bg-primary-subtle/30"
                  >
                    <span className="text-sm font-semibold text-text-primary">
                      {t("schedule.presetWorkday")}
                    </span>
                    <span className="mt-1 text-xs text-text-secondary">
                      {t("schedule.presetWorkdayDesc")}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={addPresetFocusDay}
                    className="flex flex-col items-start rounded-[var(--radius-md)] border border-border bg-surface-2 p-3 text-left transition-colors hover:border-primary hover:bg-primary-subtle/30"
                  >
                    <span className="text-sm font-semibold text-text-primary">
                      {t("schedule.presetFocusDay")}
                    </span>
                    <span className="mt-1 text-xs text-text-secondary">
                      {t("schedule.presetFocusDayDesc")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            sorted.map((event) => (
              <div
                key={event.id}
                draggable
                onDragStart={() => setDragId(event.id)}
                onDragEnd={() => {
                  setDragId(null);
                  setOverId(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverId(event.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId && dragId !== event.id) {
                    reorderSchedule(dragId, event.id);
                  }
                  setDragId(null);
                  setOverId(null);
                }}
                className={cn(
                  "flex flex-wrap items-center gap-2 rounded-[var(--radius-md)] border bg-surface-2 px-3 py-3 transition-colors sm:gap-3",
                  dragId === event.id && "opacity-50",
                  overId === event.id && dragId && dragId !== event.id
                    ? "border-primary bg-primary-subtle/40"
                    : "border-border"
                )}
              >
                <span
                  className="cursor-grab text-text-tertiary active:cursor-grabbing"
                  aria-hidden="true"
                  title={t("schedule.dragHint")}
                >
                  <GripVertical className="size-4" />
                </span>
                <span className="w-14 shrink-0 font-[family-name:var(--font-mono)] text-xs text-text-tertiary">
                  {event.time}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">{event.label}</p>
                  {event.endTime && (
                    <p className="font-[family-name:var(--font-mono)] text-[11px] text-text-tertiary">
                      {t("schedule.until")} {event.endTime}
                    </p>
                  )}
                </div>
                <Badge variant={kindVariant[event.kind]}>{kindLabel[event.kind]}</Badge>
                <button
                  type="button"
                  onClick={() => {
                    removeBlock(event.id);
                    toast({ title: t("schedule.removed"), kind: "default" });
                  }}
                  className="ml-auto inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary hover:bg-surface-3 hover:text-danger sm:ml-0"
                  aria-label={t("common.delete")}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={t("schedule.addTitle")}
        description={t("schedule.addDesc")}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="rounded-[var(--radius-sm)] border border-border bg-surface-2 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <Sparkles className="size-3.5 text-primary" />
              {t("schedule.blockPresetsHint")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_BLOCK_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setTime(preset.time);
                    setEndTime(preset.endTime);
                    setLabel(preset.label);
                    setKind(preset.kind);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-3 px-2.5 py-1 text-xs font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary-subtle/40"
                >
                  <span className="font-[family-name:var(--font-mono)] text-text-tertiary">
                    {preset.time}
                  </span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="time">
                {t("schedule.start")}
              </label>
              <TimeInput
                id="time"
                value={time}
                onChange={setTime}
                required
                presets={["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "16:00"]}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="end-time">
                {t("schedule.end")}
              </label>
              <TimeInput
                id="end-time"
                value={endTime}
                onChange={setEndTime}
                presets={["09:00", "10:00", "11:00", "12:00", "14:00", "17:00", "18:00"]}
                placeholder="11:00"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="kind">
              {t("schedule.type")}
            </label>
            <select
              id="kind"
              value={kind}
              onChange={(e) => setKind(e.target.value as typeof kind)}
              className="flex h-10 w-full rounded-[var(--radius-sm)] border border-border bg-surface-3 px-3 text-sm text-text-primary outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15"
            >
              <option value="focus">Fokus</option>
              <option value="meet">Uchrashuv</option>
              <option value="admin">Boshqa ish</option>
              <option value="break">Tanaffus</option>
              <option value="review">Kun yakuni</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="label">
              {t("schedule.label")}
            </label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t("schedule.placeholder")}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" variant="gradient">
              {t("schedule.add")}
            </Button>
          </div>
        </form>
      </Dialog>
    </AppShell>
  );
}
