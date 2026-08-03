"use client";

import { useMemo, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

export default function SchedulePage() {
  const { t } = useUser();
  const { state, addBlock, removeBlock, reorderSchedule } = useDay();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("10:00");
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
    addBlock({ time, label: label.trim(), kind });
    toast({
      title: t("schedule.added"),
      description: `${time} · ${label.trim()}`,
      kind: "success",
    });
    setLabel("");
    setOpen(false);
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
          size="sm"
          leftIcon={<Plus className="size-4" />}
          onClick={() => setOpen(true)}
        >
          {t("schedule.add")}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-2 p-3 sm:p-4">
          {sorted.length === 0 ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full rounded-[var(--radius-md)] border border-dashed border-border px-3 py-8 text-sm text-text-tertiary hover:border-border-strong"
            >
              {t("schedule.free")}
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
                  "flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border bg-surface-2 px-3 py-3 transition-colors",
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
                <Badge variant={kindVariant[event.kind]}>{event.kind}</Badge>
                <button
                  type="button"
                  onClick={() => {
                    removeBlock(event.id);
                    toast({ title: t("schedule.removed"), kind: "default" });
                  }}
                  className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary hover:bg-surface-3 hover:text-danger"
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="time">
                {t("schedule.start")}
              </label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
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
                <option value="focus">Focus</option>
                <option value="meet">Meet</option>
                <option value="admin">Admin</option>
                <option value="break">Break</option>
                <option value="review">Review</option>
              </select>
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
