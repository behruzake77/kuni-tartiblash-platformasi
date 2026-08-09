import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx + tailwind-merge.
 * Prevents conflicting utility classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with compact notation (1.2k, 3.4M).
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Delay helper for demos / simulated async.
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const DEFAULT_TIME_PRESETS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "20:00",
];

export const ALL_TIME_SLOTS = Array.from({ length: 36 }, (_, i) => {
  const totalMins = 6 * 60 + i * 30;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

/**
 * Normalize a user-typed time string into a valid HH:MM format (24-hour).
 * Handles partial inputs like "9", "930", "9:00", "14", "8:5".
 */
export function normalizeTime(input: string, fallback = "09:00"): string {
  if (!input) return fallback;
  const s = input.trim();
  if (s.includes(":")) {
    const [rawH = "", rawM = "00"] = s.split(":");
    const hNum = parseInt(rawH.replace(/\D/g, ""), 10);
    const mNum = parseInt(rawM.replace(/\D/g, ""), 10);
    const h = Number.isNaN(hNum) ? 0 : Math.min(Math.max(hNum, 0), 23);
    const m = Number.isNaN(mNum) ? 0 : Math.min(Math.max(mNum, 0), 59);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const digits = s.replace(/\D/g, "");
  if (digits.length === 0) return fallback;
  if (digits.length <= 2) {
    const hNum = parseInt(digits, 10);
    const h = Number.isNaN(hNum) ? 0 : Math.min(Math.max(hNum, 0), 23);
    return `${String(h).padStart(2, "0")}:00`;
  }
  if (digits.length === 3) {
    const hNum = parseInt(digits.slice(0, 1), 10);
    const mNum = parseInt(digits.slice(1, 3), 10);
    const h = Math.min(Math.max(hNum, 0), 23);
    const m = Math.min(Math.max(mNum, 0), 59);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const hNum = parseInt(digits.slice(0, 2), 10);
  const mNum = parseInt(digits.slice(2, 4), 10);
  const h = Math.min(Math.max(hNum, 0), 23);
  const m = Math.min(Math.max(mNum, 0), 59);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

