import { describe, expect, it } from "vitest";
import { createDefaultDay } from "@/lib/day-defaults";
import {
  lastNDays,
  snapshotFromDay,
  weekSummary,
} from "@/lib/weekly-stats";

describe("snapshotFromDay", () => {
  it("computes completion percentage", () => {
    const day = createDefaultDay("2026-08-03");
    day.tasks = [
      {
        id: "1",
        title: "A",
        tag: "t",
        done: true,
        priority: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "B",
        tag: "t",
        done: false,
        priority: false,
        createdAt: new Date().toISOString(),
      },
    ];
    const snap = snapshotFromDay(day);
    expect(snap.completion).toBe(50);
    expect(snap.date).toBe("2026-08-03");
  });
});

describe("lastNDays", () => {
  it("returns n dates ending today", () => {
    const days = lastNDays(7, new Date("2026-08-03T15:00:00Z"));
    expect(days).toHaveLength(7);
    expect(days[days.length - 1]).toBe("2026-08-03");
  });
});

describe("weekSummary", () => {
  it("averages active days", () => {
    const sum = weekSummary([
      {
        date: "2026-08-01",
        completion: 100,
        focusSec: 3600,
        habitsPct: 50,
        prioritiesDone: 1,
        prioritiesTotal: 1,
        closed: true,
      },
      {
        date: "2026-08-02",
        completion: 0,
        focusSec: 0,
        habitsPct: 0,
        prioritiesDone: 0,
        prioritiesTotal: 0,
        closed: false,
      },
    ]);
    expect(sum.activeDays).toBe(1);
    expect(sum.avgCompletion).toBe(100);
    expect(sum.closedDays).toBe(1);
    expect(sum.totalFocusSec).toBe(3600);
  });
});
