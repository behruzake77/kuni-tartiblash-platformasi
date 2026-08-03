import type { DayState } from "@/lib/types";
import { formatFocus } from "@/lib/day-defaults";

export function buildDayMarkdown(state: DayState, opts?: { title?: string }) {
  const title = opts?.title || `Ordo — ${state.date}`;
  const done = state.tasks.filter((t) => t.done);
  const open = state.tasks.filter((t) => !t.done);
  const pri = state.tasks.filter((t) => t.priority);
  const habitsDone = state.habits.filter((h) => h.doneToday);

  const lines: string[] = [
    `# ${title}`,
    "",
    `> Generated ${new Date().toISOString()}`,
    "",
    "## Snapshot",
    "",
    `- **Date:** ${state.date}`,
    `- **Tasks:** ${done.length}/${state.tasks.length} done`,
    `- **Priorities:** ${pri.filter((p) => p.done).length}/${pri.length}`,
    `- **Focus:** ${formatFocus(state.focusSecondsToday)}`,
    `- **Habits:** ${habitsDone.length}/${state.habits.length}`,
    state.review.closedAt
      ? `- **Day closed:** ${state.review.closedAt}`
      : "- **Day closed:** no",
    "",
    "## Priorities",
    "",
  ];

  if (!pri.length) lines.push("_None_", "");
  else {
    for (const t of pri) {
      lines.push(`- [${t.done ? "x" : " "}] **${t.title}** (${t.tag})`);
    }
    lines.push("");
  }

  lines.push("## Tasks", "");
  if (!state.tasks.length) lines.push("_None_", "");
  else {
    for (const t of open) {
      lines.push(`- [ ] ${t.title} — _${t.tag}_`);
    }
    for (const t of done) {
      lines.push(`- [x] ${t.title} — _${t.tag}_`);
    }
    lines.push("");
  }

  lines.push("## Schedule", "");
  if (!state.schedule.length) lines.push("_Empty_", "");
  else {
    const sorted = [...state.schedule].sort((a, b) =>
      a.time.localeCompare(b.time)
    );
    for (const b of sorted) {
      const range = b.endTime ? `${b.time}–${b.endTime}` : b.time;
      lines.push(`- **${range}** · ${b.label} \`${b.kind}\``);
    }
    lines.push("");
  }

  lines.push("## Habits", "");
  for (const h of state.habits) {
    lines.push(
      `- [${h.doneToday ? "x" : " "}] ${h.name} — streak ${h.streak}`
    );
  }
  lines.push("");

  lines.push("## Focus sessions", "");
  if (!state.focusSessions.length) lines.push("_None_", "");
  else {
    for (const s of state.focusSessions.slice(0, 20)) {
      lines.push(
        `- ${formatFocus(s.completedSec)} · ${s.label || "Focus"} · ${s.startedAt}`
      );
    }
    lines.push("");
  }

  if (
    state.review.wins ||
    state.review.slipped ||
    state.review.tomorrow ||
    state.review.energy
  ) {
    lines.push("## Day close", "");
    if (state.review.wins) {
      lines.push("### Wins", "", state.review.wins, "");
    }
    if (state.review.slipped) {
      lines.push("### Slipped", "", state.review.slipped, "");
    }
    if (state.review.tomorrow) {
      lines.push("### Tomorrow", "", state.review.tomorrow, "");
    }
    if (state.review.energy != null) {
      lines.push(`**Energy:** ${state.review.energy}/5`, "");
    }
  }

  lines.push("---", "_Exported from Ordo_", "");
  return lines.join("\n");
}

export function buildWeeklyMarkdown(opts: {
  days: { date: string; completion: number; focusSec: number; habits: number }[];
  title?: string;
  notes?: string[];
}) {
  const lines = [
    `# ${opts.title || "Ordo weekly report"}`,
    "",
    `> Generated ${new Date().toISOString()}`,
    "",
    "## Days",
    "",
    "| Date | Completion | Focus | Habits |",
    "|---|---:|---:|---:|",
  ];
  for (const d of opts.days) {
    const h = Math.floor(d.focusSec / 3600);
    const m = Math.floor((d.focusSec % 3600) / 60);
    const focus = h > 0 ? `${h}h ${m}m` : `${m}m`;
    lines.push(
      `| ${d.date} | ${d.completion}% | ${focus} | ${d.habits}% |`
    );
  }
  lines.push("");
  if (opts.notes?.length) {
    lines.push("## Notes", "");
    for (const n of opts.notes) lines.push(`- ${n}`);
    lines.push("");
  }
  lines.push("---", "_Ordo weekly export_", "");
  return lines.join("\n");
}
