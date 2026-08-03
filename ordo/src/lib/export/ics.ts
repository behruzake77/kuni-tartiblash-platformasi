import type { ScheduleBlock } from "@/lib/types";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Local wall time → ICS floating local format YYYYMMDDTHHMMSS */
function toIcsLocal(date: Date) {
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function parseTimeOnDay(hhmm: string, day: Date) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const d = new Date(day);
  d.setHours(Number(m[1]), Number(m[2]), 0, 0);
  return d;
}

function addMinutes(d: Date, mins: number) {
  return new Date(d.getTime() + mins * 60_000);
}

function escapeText(s: string) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * Build a simple ICS calendar for today's schedule blocks.
 */
export function buildScheduleIcs(opts: {
  blocks: ScheduleBlock[];
  date?: Date;
  calName?: string;
  prodId?: string;
}): string {
  const day = opts.date || new Date();
  const stamp = toIcsLocal(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${opts.prodId || "-//Ordo//Day Control//EN"}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(opts.calName || "Ordo Schedule")}`,
  ];

  for (const b of opts.blocks) {
    const start = parseTimeOnDay(b.time, day);
    if (!start) continue;
    let end: Date;
    if (b.endTime) {
      end = parseTimeOnDay(b.endTime, day) || addMinutes(start, 30);
    } else {
      end = addMinutes(start, 30);
    }
    if (end <= start) end = addMinutes(start, 30);

    const uid = `${b.id || b.time}@ordo.local`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toIcsLocal(start)}`,
      `DTEND:${toIcsLocal(end)}`,
      `SUMMARY:${escapeText(b.label)}`,
      `DESCRIPTION:${escapeText(`Ordo · ${b.kind}`)}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
