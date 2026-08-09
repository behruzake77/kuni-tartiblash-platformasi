"use client";

import * as React from "react";
import { Clock, X } from "lucide-react";
import {
  cn,
  normalizeTime,
  DEFAULT_TIME_PRESETS,
  ALL_TIME_SLOTS,
} from "@/lib/utils";
import { useUser } from "@/providers/user-provider";

export interface TimeInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  presets?: string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  showPresets?: boolean;
  label?: string;
}

export function TimeInput({
  id,
  value,
  onChange,
  presets = DEFAULT_TIME_PRESETS,
  placeholder = "14:30",
  required = false,
  className,
  showPresets = true,
  label,
}: TimeInputProps) {
  const { t } = useUser();

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw.trim()) {
      if (required && !value) {
        onChange("09:00");
      }
      return;
    }
    const normalized = normalizeTime(raw, raw || "09:00");
    if (normalized !== value) {
      onChange(normalized);
    }
  };

  const hasCustomSlot =
    Boolean(value) && !ALL_TIME_SLOTS.includes(value);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="^([01]\d|2[0-3]):[0-5]\d$"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          required={required}
          aria-label={label || t("time.select")}
          className={cn(
            "flex h-10 w-full rounded-[var(--radius-sm)] border border-border bg-surface-3 pl-3 py-2.5",
            "pr-20 font-[family-name:var(--font-mono)] text-sm text-text-primary placeholder:text-text-placeholder",
            "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15"
          )}
        />
        <div className="absolute right-1.5 flex items-center gap-1">
          {!required && value && (
            <button
              type="button"
              onClick={() => onChange("")}
              title={t("time.clear")}
              aria-label={t("time.clear")}
              className="inline-flex size-6 items-center justify-center rounded-[var(--radius-xs)] text-text-tertiary hover:bg-surface-2 hover:text-text-primary"
            >
              <X className="size-3.5" />
            </button>
          )}
          <div className="relative inline-flex items-center">
            <select
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              aria-label={t("time.select")}
              title={t("time.select")}
              className={cn(
                "h-7 cursor-pointer appearance-none rounded-[var(--radius-xs)] border border-border bg-surface-2 pl-2 pr-6 text-xs font-medium text-text-secondary outline-none",
                "hover:bg-surface-3 hover:text-text-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
                "font-[family-name:var(--font-mono)]"
              )}
            >
              {!value && (
                <option value="" disabled>
                  --:--
                </option>
              )}
              {hasCustomSlot && <option value={value}>{value}</option>}
              {ALL_TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <Clock
              className="pointer-events-none absolute right-1.5 size-3 text-text-tertiary"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {showPresets && presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="mr-0.5 text-[11px] font-medium text-text-tertiary">
            {t("time.presets")}:
          </span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={cn(
                "inline-flex h-6 items-center justify-center rounded-full border px-2.5 font-[family-name:var(--font-mono)] text-[11px] font-medium transition-colors",
                value === preset
                  ? "border-primary bg-primary-subtle text-primary shadow-sm"
                  : "border-border bg-surface-2 text-text-secondary hover:border-border-strong hover:bg-surface-3 hover:text-text-primary"
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
