import { describe, expect, it } from "vitest";
import { createDefaultDay } from "@/lib/day-defaults";
import { buildScheduleIcs } from "@/lib/export/ics";
import { buildDayMarkdown, buildWeeklyMarkdown } from "@/lib/export/markdown";

describe("buildScheduleIcs", () => {
  it("emits VCALENDAR with events", () => {
    const ics = buildScheduleIcs({
      blocks: [{ id: "s_test", time: "09:00", endTime: "10:00", label: "Test focus", kind: "focus" }],
      date: new Date("2026-08-03T12:00:00"),
      calName: "Ordo Test",
    });
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("Ordo Test");
  });
});

describe("buildDayMarkdown", () => {
  it("includes snapshot and sections", () => {
    const day = createDefaultDay("2026-08-03");
    const md = buildDayMarkdown(day);
    expect(md).toContain("# Ordo — 2026-08-03");
    expect(md).toContain("## Priorities");
    expect(md).toContain("## Schedule");
    expect(md).toContain("## Habits");
  });
});

describe("buildWeeklyMarkdown", () => {
  it("renders a table", () => {
    const md = buildWeeklyMarkdown({
      days: [
        { date: "2026-08-01", completion: 50, focusSec: 3600, habits: 50 },
        { date: "2026-08-02", completion: 80, focusSec: 1800, habits: 75 },
      ],
      notes: ["Solid week"],
    });
    expect(md).toContain("| Date |");
    expect(md).toContain("2026-08-01");
    expect(md).toContain("Solid week");
  });
});
