"use client";

import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Clock,
  Focus,
  MoreHorizontal,
  Search,
  Sparkles,
} from "lucide-react";
import { useUser } from "@/providers/user-provider";
import { mt } from "@/lib/marketing-i18n";

const PRIORITIES = [
  { title: "Ship onboarding polish", done: false, tag: "Deep work" },
  { title: "Review Q3 hiring plan", done: true, tag: "Meeting prep" },
  { title: "Write weekly update", done: false, tag: "Communication" },
];

const BLOCKS = [
  { time: "09:00", label: "Deep work — Onboarding", tone: "focus" as const },
  { time: "11:30", label: "Standup", tone: "meet" as const },
  { time: "13:00", label: "Focus — Hiring plan", tone: "focus" as const },
  { time: "15:30", label: "Buffer / admin", tone: "admin" as const },
  { time: "17:00", label: "Day close review", tone: "review" as const },
];

const HABITS = [
  { name: "Morning pages", done: true },
  { name: "Workout", done: true },
  { name: "No phone first hour", done: false },
  { name: "Evening shutdown", done: false },
];

export function ProductPreview() {
  const { locale } = useUser();
  return (
    <section id="product" className="scroll-mt-24 py-12 md:py-20">
      <div className="container-ordo">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <Badge variant="secondary" className="mb-4">
            {mt(locale, "product.label")}
          </Badge>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-[var(--tracking-tight)] text-text-primary sm:text-4xl">
            {mt(locale, "product.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            {mt(locale, "product.sub")}
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div
            className="pointer-events-none absolute -inset-4 rounded-[var(--radius-3xl)] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18),transparent_65%)] blur-2xl md:-inset-8"
            aria-hidden="true"
          />

          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border-strong bg-surface-1 shadow-xl dark:shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-[#FF5F57]" />
                <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="size-2.5 rounded-full bg-[#28C840]" />
              </div>
              <div className="mx-auto flex h-7 w-full max-w-md items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface-3 px-3">
                <Search className="size-3.5 text-text-tertiary" aria-hidden="true" />
                <span className="truncate font-[family-name:var(--font-mono)] text-xs text-text-tertiary">
                  Add task, start focus, jump to habit…
                </span>
                <kbd className="ml-auto hidden rounded border border-border px-1 font-[family-name:var(--font-mono)] text-[10px] text-text-tertiary sm:inline">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="grid md:grid-cols-[200px_1fr]">
              <aside className="hidden border-r border-border bg-surface-1 p-3 md:block">
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[var(--tracking-widest)] text-text-tertiary">
                  Day
                </p>
                {["Today", "Schedule", "Focus", "Habits", "Insights"].map(
                  (item, i) => (
                    <div
                      key={item}
                      className={
                        i === 0
                          ? "mb-0.5 flex items-center gap-2 rounded-[var(--radius-sm)] border-l-2 border-primary bg-primary-subtle px-2.5 py-2 text-xs font-medium text-primary"
                          : "mb-0.5 flex items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-xs font-medium text-text-secondary"
                      }
                    >
                      <span className="size-1.5 rounded-full bg-current opacity-60" />
                      {item}
                    </div>
                  )
                )}
              </aside>

              <div className="space-y-4 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text-primary">
                      Today
                    </h3>
                    <p className="mt-0.5 text-xs text-text-tertiary">
                      Monday · 3 priorities · Focus 1h 20m
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border bg-surface-3 px-2.5 py-1.5 text-xs font-medium text-text-secondary"
                  >
                    <Sparkles className="size-3.5 text-secondary" aria-hidden="true" />
                    Plan my day
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { label: "Done", value: "5/11", delta: "tasks" },
                    { label: "Focus", value: "1h 20m", delta: "protected" },
                    { label: "Habits", value: "2/4", delta: "today" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-3"
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                        {m.label}
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-text-primary">
                        {m.value}
                      </p>
                      <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] text-text-tertiary">
                        {m.delta}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-3.5">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-text-primary">
                        Top 3 priorities
                      </h4>
                      <MoreHorizontal
                        className="size-4 text-text-tertiary"
                        aria-hidden="true"
                      />
                    </div>
                    <ul className="space-y-2">
                      {PRIORITIES.map((t) => (
                        <li
                          key={t.title}
                          className="flex items-start gap-2 rounded-[var(--radius-sm)] px-1 py-1"
                        >
                          {t.done ? (
                            <CheckCircle2
                              className="mt-0.5 size-3.5 shrink-0 text-success"
                              aria-hidden="true"
                            />
                          ) : (
                            <Circle
                              className="mt-0.5 size-3.5 shrink-0 text-text-tertiary"
                              aria-hidden="true"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p
                              className={
                                t.done
                                  ? "truncate text-xs text-text-tertiary line-through"
                                  : "truncate text-xs text-text-secondary"
                              }
                            >
                              {t.title}
                            </p>
                            <span className="text-[10px] text-text-tertiary">
                              {t.tag}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-3.5">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                        <Clock className="size-3.5" aria-hidden="true" />
                        Schedule
                      </h4>
                      <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-[10px] text-primary">
                        <Focus className="size-3" aria-hidden="true" />
                        Live
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {BLOCKS.map((b) => (
                        <li
                          key={b.time + b.label}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="w-10 shrink-0 font-[family-name:var(--font-mono)] text-text-tertiary">
                            {b.time}
                          </span>
                          <span
                            className={
                              b.tone === "focus"
                                ? "h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                                : b.tone === "meet"
                                  ? "h-1.5 w-1.5 shrink-0 rounded-full bg-secondary"
                                  : b.tone === "review"
                                    ? "h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                                    : "h-1.5 w-1.5 shrink-0 rounded-full bg-text-tertiary"
                            }
                          />
                          <span className="truncate text-text-secondary">
                            {b.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-3.5">
                  <h4 className="mb-3 text-xs font-semibold text-text-primary">
                    Habits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {HABITS.map((h) => (
                      <span
                        key={h.name}
                        className={
                          h.done
                            ? "inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success-subtle px-2.5 py-1 text-[11px] font-medium text-success"
                            : "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-3 px-2.5 py-1 text-[11px] font-medium text-text-tertiary"
                        }
                      >
                        {h.done ? (
                          <CheckCircle2 className="size-3" aria-hidden="true" />
                        ) : (
                          <Circle className="size-3" aria-hidden="true" />
                        )}
                        {h.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
