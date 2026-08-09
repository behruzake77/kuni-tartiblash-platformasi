import { describe, expect, it } from "vitest";
import {
  cn,
  formatCompact,
  normalizeTime,
  DEFAULT_TIME_PRESETS,
  ALL_TIME_SLOTS,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toContain("px-2");
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditionals", () => {
    expect(cn("base", false && "hidden", "ok")).toBe("base ok");
  });
});

describe("formatCompact", () => {
  it("formats thousands", () => {
    const s = formatCompact(1200);
    expect(s.toLowerCase()).toMatch(/1(\.|,)?2k|1\.2k|1200/);
  });
});

describe("normalizeTime", () => {
  it("normalizes single and double digits to HH:00", () => {
    expect(normalizeTime("9")).toBe("09:00");
    expect(normalizeTime("14")).toBe("14:00");
  });

  it("normalizes partial and full time strings without colons", () => {
    expect(normalizeTime("930")).toBe("09:30");
    expect(normalizeTime("1430")).toBe("14:30");
  });

  it("normalizes times with colons and partial digits", () => {
    expect(normalizeTime("9:00")).toBe("09:00");
    expect(normalizeTime("8:5")).toBe("08:05");
    expect(normalizeTime("14:30")).toBe("14:30");
  });

  it("falls back when invalid or empty", () => {
    expect(normalizeTime("")).toBe("09:00");
    expect(normalizeTime("", "08:00")).toBe("08:00");
  });

  it("provides time presets and slots", () => {
    expect(DEFAULT_TIME_PRESETS).toContain("09:00");
    expect(ALL_TIME_SLOTS).toContain("06:00");
    expect(ALL_TIME_SLOTS).toContain("23:30");
  });
});

