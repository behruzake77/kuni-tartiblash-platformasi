"use client";

import { useMemo, useState } from "react";
import { GripVertical, Plus, Trash2, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker";
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

const kindEmoji: Record<string, string> = {
  focus: "🎯",
  meet: "🤝",
  admin: "📋",
  review: "🌙",
  break: "☕",
};

/* Duration presets to auto-fill end time */
const DURATION_PRESETS = [
  { label: "30m", min: 30 },
  { label: "1s", min: 60 },
  { label: "1.5s", min: 90 },
  { label: "2s", min: 120 },
];

function addMinutes(time: string, minutes: number): string {
  const [hs, ms] = time.split(":").map(Number);
  const total = hs * 60 + ms + minutes;
  const h = Math.floor(total / 60) % 24;
  const m = ((total % 60) + 60) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function SchedulePage() {
  const { t } = useUser();
  const { state, addBlock, removeBlock, reorderSchedule } = useDay();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("10:00");
  const [endTime, setEndTime] = useState("");
  const [useEndTime, setUseEndTime] = useState(false);
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<"focus" | "meet" | "admin" | "review" | "break">(
    "focus"
  );
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // 2-step wizard

  const sorted = useMemo(
    () => [...state.schedule].sort((a, b) => a.time.localeCompare(b.time)),
    [state.schedule]
  );

  function applyDuration(min: number) {
    setEndTime(addMinutes(time, min));
    setUseEndTime(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim() || !time) return;
    const block: { time: string; endTime?: string; label: string; kind: typeof kind } = {
      time,
      label: label.trim(),
      kind,
    };
    if (useEndTime && endTime) {
      block.endTime = endTime;
    }
    addBlock(block);
    toast({
      title: t("schedule.added"),
      description: `${time}${useEndTime && endTime ? "–" + endTime : ""} · ${label.trim()}`,
      kind: "success",
    });
    // Reset
    setLabel("");
    setEndTime("");
    setUseEndTime(false);
    setStep(1);
    setOpen(false);
  }

  function handleOpen() {
    // Default to nearest next half-hour
    const now = new Date();
    const mins = now.getMinutes();
    const rounded = mins < 30 ? 30 : 0;
    const h = mins < 30 ? now.getHours() : (now.getHours() + 1) % 24;
    setTime(
      `${String(rounded === 0 && mins >= 30 ? h : h).padStart(2, "0")}:${String(rounded).padStart(2, "0")}`
    );
    setStep(1);
    setOpen(true);
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
          onClick={handleOpen}
        >
          {t("schedule.add")}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-2 p-3 sm:p-4">
          {sorted.length === 0 ? (
            <button
              type="button"
              onClick={handleOpen}
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
                  <p className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                    <span aria-hidden="true">{kindEmoji[event.kind]}</span>
                    {event.label}
                  </p>
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

      {/* ===================== ADD BLOCK DIALOG ===================== */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setStep(1);
        }}
        title={step === 1 ? "⏰ Vaqt tanlang" : t("schedule.addTitle")}
        description={
          step === 1
            ? "Soat va daqiqani aylantirib yoki tugmalardan tanlang"
            : t("schedule.addDesc")
        }
      >
        <form onSubmit={submit} className="space-y-5">
          {/* ─── STEP 1: Time selection ─── */}
          {step === 1 && (
            <>
              <TimePicker value={time} onChange={setTime} />

              {/* End time toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUseEndTime(!useEndTime)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-medium transition-all",
                    useEndTime
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-surface-3 text-text-tertiary border border-transparent hover:text-text-secondary"
                  )}
                >
                  <Clock className="size-3" />
                  Tugash vaqti
                </button>
                {useEndTime && (
                  <div className="flex flex-wrap gap-1">
                    {DURATION_PRESETS.map((d) => (
                      <button
                        type="button"
                        key={d.label}
                        onClick={() => applyDuration(d.min)}
                        className="rounded-[var(--radius-full)] bg-surface-3 px-2 py-0.5 text-[11px] text-text-tertiary transition-colors hover:bg-primary-subtle hover:text-primary"
                      >
                        +{d.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {useEndTime && (
                <TimePicker value={endTime || addMinutes(time, 60)} onChange={setEndTime} />
              )}

              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="button" variant="gradient" onClick={() => setStep(2)}>
                  Davom etish →
                </Button>
              </div>
            </>
          )}

          {/* ─── STEP 2: Label & type ─── */}
          {step === 2 && (
            <>
              <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm text-text-secondary">
                <span className="font-[family-name:var(--font-mono)] font-semibold text-text-primary">
                  {time}
                </span>
                {useEndTime && endTime && (
                  <span className="text-text-tertiary"> – {endTime}</span>
                )}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="ml-2 text-xs text-primary underline-offset-2 hover:underline"
                >
                  o‘zgartirish
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="kind">
                  {t("schedule.type")}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(Object.keys(kindLabel) as Array<keyof typeof kindLabel>).map((k) => (
                    <button
                      type="button"
                      key={k}
                      onClick={() => setKind(k)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-[var(--radius-md)] border px-1 py-2 text-[11px] font-medium transition-all",
                        kind === k
                          ? "border-primary bg-primary-subtle text-primary"
                          : "border-border bg-surface-3 text-text-tertiary hover:border-primary/40"
                      )}
                    >
                      <span className="text-base">{kindEmoji[k]}</span>
                      {kindLabel[k]}
                    </button>
                  ))}
                </div>
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
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                  ← Orqaga
                </Button>
                <Button type="submit" variant="gradient">
                  {t("schedule.add")}
                </Button>
              </div>
            </>
          )}
        </form>
      </Dialog>
    </AppShell>
  );
}
