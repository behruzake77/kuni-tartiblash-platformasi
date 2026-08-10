"use client";

import { useMemo, useCallback } from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type TimePickerProps = {
  value: string; // "HH:MM"
  onChange: (time: string) => void;
  /** Quick-preset time slots shown as tappable chips */
  presets?: string[];
  className?: string;
};

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06..23
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function parseTime(v: string): { h: number; m: number } {
  const [hs, ms] = v.split(":");
  return { h: Number(hs) || 0, m: Number(ms) || 0 };
}

function fmtTime(h: number, m: number): string {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Default presets: top-of-hour and half-hour from 06 to 22 */
const DEFAULT_PRESETS = [
  "06:00", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00",
];

export function TimePicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  className,
}: TimePickerProps) {
  const { h, m } = parseTime(value);

  const setHour = useCallback(
    (next: number) => {
      const clamped = ((next % 24) + 24) % 24;
      onChange(fmtTime(clamped, m));
    },
    [m, onChange]
  );

  const setMinute = useCallback(
    (next: number) => {
      // wrap around
      let newH = h;
      let newM = next;
      if (newM >= 60) { newM = 0; newH = (newH + 1) % 24; }
      if (newM < 0) { newM = 55; newH = (newH - 1 + 24) % 24; }
      onChange(fmtTime(newH, newM));
    },
    [h, onChange]
  );

  const selected = value;

  return (
    <div className={cn("space-y-3", className)}>
      {/* --- Hour : Minute spinners --- */}
      <div className="flex items-center justify-center gap-4">
        {/* Hour column */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setHour(h + 1)}
            className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary transition-colors hover:bg-surface-3 hover:text-text-primary active:scale-95"
            aria-label="Increase hour"
          >
            <ChevronUp className="size-4" />
          </button>
          <div className="grid size-14 place-items-center rounded-[var(--radius-md)] border border-border bg-surface-3 font-[family-name:var(--font-mono)] text-2xl font-bold text-text-primary tabular-nums">
            {String(h).padStart(2, "0")}
          </div>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setHour(h - 1)}
            className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary transition-colors hover:bg-surface-3 hover:text-text-primary active:scale-95"
            aria-label="Decrease hour"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>

        <span className="text-2xl font-bold text-text-tertiary select-none">:</span>

        {/* Minute column */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setMinute(m + 5)}
            className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary transition-colors hover:bg-surface-3 hover:text-text-primary active:scale-95"
            aria-label="Increase minutes"
          >
            <ChevronUp className="size-4" />
          </button>
          <div className="grid size-14 place-items-center rounded-[var(--radius-md)] border border-border bg-surface-3 font-[family-name:var(--font-mono)] text-2xl font-bold text-text-primary tabular-nums">
            {String(m).padStart(2, "0")}
          </div>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setMinute(m - 5)}
            className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary transition-colors hover:bg-surface-3 hover:text-text-primary active:scale-95"
            aria-label="Decrease minutes"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>

        <Clock className="ml-2 size-5 text-text-tertiary" />
      </div>

      {/* --- Quick-preset chips --- */}
      <div>
        <p className="mb-2 text-xs font-medium text-text-tertiary">
          Tezkor tanlash
        </p>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => onChange(t)}
              className={cn(
                "rounded-[var(--radius-full)] px-2.5 py-1 font-[family-name:var(--font-mono)] text-xs transition-all active:scale-95",
                t === selected
                  ? "bg-primary text-text-inverse font-semibold shadow-sm"
                  : "bg-surface-3 text-text-secondary hover:bg-primary-subtle hover:text-primary"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
