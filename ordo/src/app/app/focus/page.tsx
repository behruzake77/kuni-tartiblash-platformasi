"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play, RotateCcw, Focus } from "lucide-react";
import { useDay } from "@/providers/day-provider";
import { useToast } from "@/components/ui/toast";
import { useUser } from "@/providers/user-provider";
import { cn } from "@/lib/utils";
import { formatFocus } from "@/lib/day-defaults";

const PRESETS = [
  { label: "25m", seconds: 25 * 60 },
  { label: "45m", seconds: 45 * 60 },
  { label: "60m", seconds: 60 * 60 },
  { label: "90m", seconds: 90 * 60 },
];

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FocusPage() {
  const { logFocusSeconds, state, stats } = useDay();
  const { toast } = useToast();
  const { t, prefs } = useUser();
  const defaultSec = Math.max(5, prefs.focusMinutes || 25) * 60;
  const [duration, setDuration] = useState(defaultSec);
  const [remaining, setRemaining] = useState(defaultSec);
  const [running, setRunning] = useState(false);
  const sessionStartRemaining = useRef(defaultSec);
  const finishedRef = useRef(false);

  // Single tick effect — completion handled inside interval (no cascading setState effects)
  useEffect(() => {
    if (!running) return;
    finishedRef.current = false;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          if (!finishedRef.current) {
            finishedRef.current = true;
            const done = sessionStartRemaining.current;
            // Defer side effects out of render/setState updater
            queueMicrotask(() => {
              setRunning(false);
              if (done > 0) {
                logFocusSeconds(done, "Focus session");
                toast({
                  title: t("focus.sessionComplete"),
                  description: t("focus.logged", { time: formatFocus(done) }),
                  kind: "success",
                });
              }
              sessionStartRemaining.current = duration;
            });
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, duration, logFocusSeconds, toast, t]);

  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;

  const selectPreset = useCallback(
    (seconds: number) => {
      if (running) {
        const spent = sessionStartRemaining.current - remaining;
        if (spent > 0) {
          logFocusSeconds(spent, "Partial focus");
          toast({
            title: t("focus.progressSaved"),
            description: formatFocus(spent),
            kind: "info",
          });
        }
      }
      setRunning(false);
      setDuration(seconds);
      setRemaining(seconds);
      sessionStartRemaining.current = seconds;
      finishedRef.current = false;
    },
    [running, remaining, logFocusSeconds, toast, t]
  );

  const reset = useCallback(() => {
    if (running) {
      const spent = sessionStartRemaining.current - remaining;
      if (spent > 0) {
        logFocusSeconds(spent, "Partial focus");
        toast({
          title: t("focus.progressSaved"),
          description: formatFocus(spent),
          kind: "info",
        });
      }
    }
    setRunning(false);
    setRemaining(duration);
    sessionStartRemaining.current = duration;
    finishedRef.current = false;
  }, [running, remaining, duration, logFocusSeconds, toast, t]);

  const toggle = () => {
    if (running) {
      const spent = sessionStartRemaining.current - remaining;
      setRunning(false);
      if (spent > 0) {
        logFocusSeconds(spent, "Focus block");
        toast({
          title: t("focus.paused"),
          description: formatFocus(spent),
          kind: "info",
        });
      }
      sessionStartRemaining.current = remaining;
    } else {
      finishedRef.current = false;
      if (remaining === 0) {
        setRemaining(duration);
        sessionStartRemaining.current = duration;
      } else {
        sessionStartRemaining.current = remaining;
      }
      setRunning(true);
    }
  };

  return (
    <AppShell title={t("nav.focus")}>
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">
          {t("focus.title")}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{t("focus.sub")}</p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-4">
        <Card className="overflow-hidden">
          <CardContent className="relative flex flex-col items-center px-6 py-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.16), transparent 55%)",
              }}
              aria-hidden="true"
            />

            <Badge variant="primary" className="relative mb-8">
              <Focus className="size-3" aria-hidden="true" />
              {running
                ? t("focus.inSession")
                : remaining === 0
                  ? t("focus.complete")
                  : t("focus.ready")}
            </Badge>

            <div className="relative mb-3 grid aspect-square w-[min(72vw,19rem)] place-items-center rounded-full p-[3px] shadow-[0_0_45px_rgba(124,92,255,.18)]" style={{ background: `conic-gradient(var(--color-primary) ${progress}%, rgba(255,255,255,.08) 0)` }}>
              <div className="grid size-full place-items-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_28%,rgba(79,209,255,.13),transparent_38%),rgba(9,9,11,.82)] backdrop-blur">
                <div className="text-center">
                  <div className="font-[family-name:var(--font-mono)] text-[clamp(3.25rem,14vw,4.5rem)] font-medium tracking-tight text-text-primary" aria-live="polite" aria-atomic="true">{formatTime(remaining)}</div>
                  <p className="mt-1 text-sm text-text-tertiary">{running ? t("focus.hintRun") : remaining === 0 ? t("focus.hintDone") : t("focus.hintReady")}</p>
                </div>
              </div>
            </div>

            <div className="relative mt-8 h-2 w-full max-w-sm overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-gradient-brand transition-[width] duration-1000 linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="relative mt-8 grid w-full max-w-sm grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-center">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => selectPreset(p.seconds)}
                  className={cn(
                    "h-11 rounded-full border px-4 text-sm font-medium transition-colors sm:h-9",
                    duration === p.seconds
                      ? "border-primary bg-primary-subtle text-primary"
                      : "border-border bg-surface-2 text-text-secondary hover:border-border-strong"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="relative mt-8 grid w-full max-w-sm grid-cols-2 gap-3">
              <Button
                variant="gradient"
                size="lg"
                leftIcon={
                  running ? (
                    <Pause className="size-4" />
                  ) : (
                    <Play className="size-4" />
                  )
                }
                onClick={toggle}
              >
                {running
                  ? t("focus.pause")
                  : remaining === 0
                    ? t("focus.restart")
                    : t("focus.start")}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<RotateCcw className="size-4" />}
                onClick={reset}
              >
                {t("focus.reset")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-text-tertiary">
                {t("focus.today")}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">
                {stats.focusLabel}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-text-tertiary">
                {t("focus.sessions")}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">
                {state.focusSessions.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-text-tertiary">
                {t("focus.last")}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">
                {state.focusSessions[0]
                  ? formatFocus(state.focusSessions[0].completedSec)
                  : "—"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
