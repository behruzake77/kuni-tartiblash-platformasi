"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock3, ListTodo, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { supabase } from "@/lib/auth/supabase";
import { addPlannedTask, removePlannedTask, updatePlannedTask } from "@/lib/planned-tasks";
import { todayKey } from "@/lib/day-defaults";
import { useDay } from "@/providers/day-provider";
import { useUser } from "@/providers/user-provider";
import type { DayState } from "@/lib/types";

const monthFormatter = new Intl.DateTimeFormat("uz-UZ", { month: "long", year: "numeric" });
const weekdayLabels = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

type StoredDay = Pick<DayState, "date" | "tasks" | "habits" | "focusSecondsToday" | "review">;

function dateKey(date: Date) { return todayKey(date); }
function shiftMonth(date: Date, delta: number) { return new Date(date.getFullYear(), date.getMonth() + delta, 1); }

export default function CalendarPage() {
  const { state, addTask, toggleTask, removeTask, setTaskPriority, updateTaskTitle } = useDay();
  const { prefs } = useUser();
  const isWinter = prefs.themePreset === "winter";
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [history, setHistory] = useState<Record<string, StoredDay>>({});
  const [selected, setSelected] = useState(state.date);
  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Shaxsiy");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const today = dateKey(new Date());

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) return;
      const start = dateKey(new Date(month.getFullYear(), month.getMonth(), 1));
      const end = dateKey(new Date(month.getFullYear(), month.getMonth() + 1, 0));
      const { data } = await supabase.from("ordo_day_history").select("day_date,payload").gte("day_date", start).lte("day_date", end);
      if (!active || !data) return;
      const next: Record<string, StoredDay> = {};
      data.forEach((row) => { if (row.payload && typeof row.payload === "object") next[String(row.day_date)] = row.payload as StoredDay; });
      setHistory(next);
    }
    void load();
    return () => { active = false; };
  }, [month]);

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return Array.from({ length: offset + count }, (_, index) => index < offset ? null : new Date(month.getFullYear(), month.getMonth(), index - offset + 1));
  }, [month]);

  const selectedDay: StoredDay | undefined = selected === state.date ? state : history[selected];
  const done = selectedDay?.tasks.filter((task) => task.done).length || 0;
  const total = selectedDay?.tasks.length || 0;
  const habitsDone = selectedDay?.habits.filter((habit) => habit.doneToday).length || 0;

  async function addForSelectedDay(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      if (selected === state.date) {
        addTask(title.trim(), { tag: category, time, priority });
      } else {
        await addPlannedTask({ date: selected, title: title.trim(), tag: category, time, priority });
        setHistory((current) => {
          const day = current[selected] || { ...state, date: selected, tasks: [], focusSessions: [], focusSecondsToday: 0, review: { ...state.review, date: selected, closedAt: null, wins: "", slipped: "", tomorrow: "" } };
          return { ...current, [selected]: { ...day, tasks: [{ id: `preview_${Date.now()}`, title: title.trim(), tag: category, time: time || undefined, done: false, priority, createdAt: new Date().toISOString() }, ...day.tasks] } };
        });
      }
      setTitle(""); setTime(""); setCategory("Shaxsiy"); setPriority(false); setAddOpen(false);
      toast({ title: "Vazifa saqlandi", description: `${selected} uchun reja yangilandi.`, kind: "success" });
    } catch {
      toast({ title: "Vazifa saqlanmadi", description: "Supabase calendar migrationi va internet ulanishini tekshiring.", kind: "default" });
    } finally { setSaving(false); }
  }

  async function mutateTask(id: string, action: "toggle" | "priority" | "remove" | "edit", value?: boolean | string) {
    if (selected === state.date) {
      if (action === "toggle") toggleTask(id);
      if (action === "priority") setTaskPriority(id, Boolean(value));
      if (action === "remove") removeTask(id);
      if (action === "edit" && typeof value === "string") updateTaskTitle(id, value);
      return;
    }
    try {
      if (action === "remove") await removePlannedTask(selected, id);
      else await updatePlannedTask(selected, id, action === "toggle" ? { done: Boolean(value) } : action === "edit" ? { title: String(value) } : { priority: Boolean(value) });
      setHistory((current) => {
        const day = current[selected];
        if (!day) return current;
        return { ...current, [selected]: { ...day, tasks: action === "remove" ? day.tasks.filter((task) => task.id !== id) : day.tasks.map((task) => task.id === id ? { ...task, ...(action === "toggle" ? { done: Boolean(value) } : action === "edit" ? { title: String(value) } : { priority: Boolean(value) }) } : task) } };
      });
    } catch { /* keep current view if cloud mutation fails */ }
  }

  return <AppShell title="Kalendar">
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><CalendarDays className="size-5 text-primary" /><h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">Kalendar</h2></div><p className="mt-1 text-sm text-text-secondary">Rejalaringiz, bajarilgan ishlar va kunlar tarixi.</p></div><div className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-1 sm:justify-start"><button type="button" className="grid size-10 place-items-center rounded-lg text-text-secondary hover:bg-surface-3" onClick={() => setMonth((value) => shiftMonth(value, -1))} aria-label="Oldingi oy"><ChevronLeft className="size-4" /></button><span className="min-w-36 text-center text-sm font-semibold capitalize text-text-primary">{monthFormatter.format(month)}</span><button type="button" className="grid size-10 place-items-center rounded-lg text-text-secondary hover:bg-surface-3" onClick={() => setMonth((value) => shiftMonth(value, 1))} aria-label="Keyingi oy"><ChevronRight className="size-4" /></button></div></div>
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]"><Card><CardContent className="p-3 sm:p-5">{isWinter && <div className="winter-landscape" aria-hidden="true"><svg viewBox="0 0 800 120" preserveAspectRatio="none"><path d="M0,70 L90,28 L180,70 L270,16 L360,70 L450,40 L540,70 L630,22 L720,70 L800,46 L800,120 L0,120 Z" fill="#0d1f3c" opacity="0.55"/><path d="M0,92 L110,60 L220,92 L330,70 L440,92 L550,74 L660,92 L770,66 L800,80 L800,120 L0,120 Z" fill="#0a1a33" opacity="0.5"/><g fill="#0d2140" opacity="0.6"><path d="M60,120 L70,92 L80,120 Z M96,120 L104,98 L112,120 Z M132,120 L139,102 L146,120 Z M300,120 L308,100 L316,120 Z M340,120 L346,104 L352,120 Z M520,120 L528,96 L536,120 Z M560,120 L566,100 L572,120 Z M700,120 L708,94 L716,120 Z M740,120 L746,102 L752,120 Z"/></g></svg></div>}<div key={`${month.getFullYear()}-${month.getMonth()}`} className="calendar-month-enter relative grid grid-cols-7 gap-1 text-center">{weekdayLabels.map((label) => <span key={label} className="py-2 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">{label}</span>)}{days.map((date, index) => { if (!date) return <span key={`blank-${index}`} />; const key = dateKey(date); const item = key === state.date ? state : history[key]; const dayDone = item?.tasks.filter((task) => task.done).length || 0; const dayTotal = item?.tasks.length || 0; return <button key={key} type="button" onClick={() => setSelected(key)} className={`min-h-16 rounded-xl border p-1.5 text-left transition sm:min-h-24 sm:p-2 ${selected === key ? "ordo-cal-day-selected border-primary bg-primary-subtle/60 shadow-sm" : key === today ? "border-secondary/50 bg-secondary/10" : "border-transparent hover:border-border hover:bg-surface-2"}`}><span className="grid size-6 place-items-center rounded-full text-xs font-semibold text-text-primary">{date.getDate()}</span>{item && <span className="mt-1 block space-y-1"><span className="block h-1 overflow-hidden rounded-full bg-surface-3"><span className="ordo-ice-bar block h-full rounded-full bg-gradient-brand" style={{ width: `${dayTotal ? Math.round(dayDone / dayTotal * 100) : 0}%` }} /></span><span className="hidden text-[10px] text-text-tertiary sm:block">{dayDone}/{dayTotal} vazifa</span></span>}</button>; })}</div></CardContent></Card>
    <Card><CardHeader className="flex-row items-center justify-between space-y-0"><CardTitle className="text-base">{selected === today ? "Bugun" : selected}</CardTitle><Button variant="ghost" size="icon-sm" onClick={() => setAddOpen(true)} aria-label="Vazifa qo‘shish"><Plus className="size-4" /></Button></CardHeader><CardContent className="space-y-4">{selectedDay ? <><div className="grid grid-cols-3 gap-2"><div className="rounded-xl bg-surface-2 p-2 text-center"><ListTodo className="mx-auto size-4 text-primary" /><b className="mt-1 block text-sm">{done}/{total}</b><span className="text-[10px] text-text-tertiary">vazifa</span></div><div className="rounded-xl bg-surface-2 p-2 text-center"><CheckCircle2 className="mx-auto size-4 text-success" /><b className="mt-1 block text-sm">{habitsDone}/{selectedDay.habits.length}</b><span className="text-[10px] text-text-tertiary">odat</span></div><div className="rounded-xl bg-surface-2 p-2 text-center"><Clock3 className="mx-auto size-4 text-accent" /><b className="mt-1 block text-sm">{Math.round(selectedDay.focusSecondsToday / 60)}m</b><span className="text-[10px] text-text-tertiary">fokus</span></div></div><div className="space-y-1">{selectedDay.tasks.slice(0, 6).map((task) => <div key={task.id} className="group flex items-center gap-2 rounded-lg px-1 py-1.5 text-sm hover:bg-surface-2"><button type="button" className="shrink-0 text-text-tertiary" onClick={() => void mutateTask(task.id, "toggle", !task.done)} aria-label="Bajarildi deb belgilash">{task.done ? <CheckCircle2 className="size-4 text-success" /> : <Circle className="size-4" />}</button><span className="min-w-0 flex-1"><span className={`block truncate ${task.done ? "text-text-tertiary line-through" : "text-text-primary"}`}>{task.title}</span><small className="block text-[10px] text-text-tertiary">{task.time ? `${task.time} · ` : ""}{task.tag}</small></span><button type="button" className="grid size-8 place-items-center rounded-md text-text-tertiary hover:bg-surface-3 hover:text-primary" onClick={() => { const next = window.prompt("Vazifa nomini tahrirlang", task.title); if (next?.trim()) void mutateTask(task.id, "edit", next.trim()); }} aria-label="Tahrirlash"><Pencil className="size-3.5" /></button><button type="button" className="grid size-8 place-items-center rounded-md text-text-tertiary hover:bg-surface-3 hover:text-warning" onClick={() => void mutateTask(task.id, "priority", !task.priority)} aria-label="Muhim qilish"><Star className={`size-3.5 ${task.priority ? "fill-warning text-warning" : ""}`} /></button><button type="button" className="grid size-8 place-items-center rounded-md text-text-tertiary hover:bg-surface-3 hover:text-danger" onClick={() => void mutateTask(task.id, "remove")} aria-label="O‘chirish"><Trash2 className="size-3.5" /></button></div>)}</div>{selectedDay.review?.closedAt && <Badge variant="success">Kun yakunlangan</Badge>}</> : <p className="py-8 text-center text-sm text-text-tertiary">Bu kunga hali reja yoki tarix yo‘q.</p>}</CardContent></Card></div>
    <Dialog open={addOpen} onOpenChange={setAddOpen} title="Rejaga vazifa qo‘shish" description={`${selected} kuni uchun yangi vazifa yarating.`}>
      <form onSubmit={addForSelectedDay} className="space-y-4">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Masalan: Mijoz bilan uchrashuvga tayyorlanish" autoFocus />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="mb-1.5 block text-sm font-medium text-text-primary" htmlFor="calendar-category">Kategoriya</label><select id="calendar-category" value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 w-full rounded-[var(--radius-sm)] border border-border bg-surface-3 px-3 text-sm text-text-primary"><option>Shaxsiy</option><option>Ish</option><option>O‘qish</option><option>Sog‘liq</option><option>Boshqa</option></select></div>
          <div><label className="mb-1.5 block text-sm font-medium text-text-primary" htmlFor="calendar-time">Vaqt</label><Input id="calendar-time" type="text" inputMode="numeric" pattern="^([01]\d|2[0-3]):[0-5]\d$" value={time} onChange={(event) => setTime(event.target.value)} placeholder="14:30" /></div>
        </div>
        <label className="flex min-h-11 items-center gap-2 text-sm text-text-secondary"><input type="checkbox" checked={priority} onChange={(event) => setPriority(event.target.checked)} className="size-4 accent-[var(--color-primary)]" />Bu kunning muhim vazifasi</label>
        <div className="grid grid-cols-2 gap-2"><Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>Bekor qilish</Button><Button type="submit" variant="gradient" loading={saving}>Vazifa qo‘shish</Button></div>
      </form>
    </Dialog>
  </AppShell>;
}
