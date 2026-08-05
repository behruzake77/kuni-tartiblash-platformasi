import { describe, expect, it } from "vitest";
import {
  createDefaultDay,
  formatFocus,
  todayKey,
} from "@/lib/day-defaults";

describe("todayKey", () => {
  it("returns YYYY-MM-DD", () => {
    expect(todayKey(new Date("2026-08-03T12:00:00.000Z"))).toMatch(
      /^\d{4}-\d{2}-\d{2}$/
    );
  });
});

describe("formatFocus", () => {
  it("formats minutes only", () => {
    expect(formatFocus(45 * 60)).toBe("45m");
  });

  it("formats hours and minutes", () => {
    expect(formatFocus(80 * 60)).toBe("1h 20m");
  });
});

describe("createDefaultDay", () => {
  it("creates versioned day state", () => {
    const day = createDefaultDay("2026-08-03");
    expect(day.version).toBe(1);
    expect(day.date).toBe("2026-08-03");
    expect(day.tasks).toEqual([]);
    expect(day.habits).toEqual([]);
    expect(day.schedule).toEqual([]);
    expect(day.updatedAt).toBeTruthy();
  });

  it("starts with at most 3 default priorities", () => {
    const day = createDefaultDay();
    const pri = day.tasks.filter((t) => t.priority);
    expect(pri.length).toBeLessThanOrEqual(3);
  });
});
