"use client";

import { Check, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

const tasks = [
  { title: "Ertalab reja", time: "08:30", x: "8%", y: "26%", delay: "0s" },
  { title: "Jamoa uchrashuvi", time: "10:00", x: "59%", y: "16%", delay: "-2s" },
  { title: "Sport", time: "18:30", x: "67%", y: "60%", delay: "-4s" },
  { title: "O‘qish", time: "20:00", x: "3%", y: "65%", delay: "-6s" },
];

function useClock() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setTime(new Date());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return time;
}

function ClockScene() {
  const time = useClock();
  const hours = time ? time.getHours() % 12 : 10;
  const minutes = time ? time.getMinutes() : 10;
  const seconds = time ? time.getSeconds() : 30;
  const hourRotation = hours * 30 + minutes / 2;
  const minuteRotation = minutes * 6 + seconds / 10;
  const secondRotation = seconds * 6;

  return (
    <div className="hero-clock-float absolute inset-[16%] z-20">
      <div className="hero-clock-glow absolute inset-[-24%] rounded-full" />
      <div className="hero-clock relative aspect-square rounded-full border border-white/25 bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,.42),transparent_16%),radial-gradient(circle_at_72%_78%,rgba(34,211,238,.3),transparent_40%),linear-gradient(145deg,#28215a,#100f2b_58%,#080d21)] shadow-[inset_0_2px_2px_rgba(255,255,255,.3),inset_0_-20px_35px_rgba(0,0,0,.45),0_30px_60px_rgba(0,0,0,.5),0_0_40px_rgba(168,85,247,.42)]">
        <div className="absolute inset-[8%] rounded-full border border-cyan-200/25" />
        {[0, 30, 60, 90, 120, 150].map((rotation) => (
          <i key={rotation} className="absolute left-1/2 top-[7%] h-[7%] w-px origin-[50%_620%] bg-cyan-100/70" style={{ transform: `rotate(${rotation}deg)` }} />
        ))}
        <div className="hero-hand hour" style={{ transform: `rotate(${hourRotation}deg)` }} />
        <div className="hero-hand minute" style={{ transform: `rotate(${minuteRotation}deg)` }} />
        <div className="hero-hand second" style={{ transform: `rotate(${secondRotation}deg)` }} />
        <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-cyan-300 shadow-[0_0_16px_#22d3ee]" />
      </div>
    </div>
  );
}

function Calendar() {
  const [hovered, setHovered] = useState(false);
  const now = useClock();
  const shown = now ? new Date(now) : null;
  if (shown && hovered) shown.setDate(shown.getDate() + 1);
  const month = shown ? new Intl.DateTimeFormat("en-US", { month: "short" }).format(shown).toUpperCase() : "…";
  const weekday = shown ? new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(shown) : "";
  return (
    <button onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="hero-calendar absolute left-1/2 top-[2%] z-30 h-28 w-28 -translate-x-1/2 cursor-pointer rounded-2xl text-left sm:h-32 sm:w-32" aria-label="Bugungi sana kartasi">
      <span className="hero-paper hero-paper-back" />
      <span className="hero-paper hero-paper-mid" />
      <span className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/25 bg-[#eeefff] shadow-[0_18px_35px_rgba(0,0,0,.4)]">
        <span className="flex h-8 items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-500 text-[9px] font-bold tracking-[.16em] text-white">{month}</span>
        <strong className="mt-1 text-center text-5xl leading-none tracking-tighter text-[#151331] sm:text-6xl">{shown?.getDate() || "—"}</strong>
        <small className="mt-1 text-center text-[9px] font-bold uppercase tracking-widest text-indigo-500">{weekday}</small>
      </span>
    </button>
  );
}

function Sidebar() {
  const now = useClock();
  const date = now || new Date(0);
  const monthLabel = now ? new Intl.DateTimeFormat("uz-UZ", { month: "long", year: "numeric" }).format(date) : "Kalendar";
  const daysInMonth = now ? new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() : 31;
  const activeDay = now ? date.getDate() : 1;
  return (
    <aside className="hero-sidebar w-full max-w-[285px] self-center rounded-3xl border border-white/10 bg-[#11162a]/80 p-4 shadow-2xl backdrop-blur-xl lg:justify-self-end">
      <div className="mb-4 flex items-center justify-between"><span className="text-sm font-semibold capitalize text-white">{monthLabel}</span><span className="flex gap-1 text-slate-400"><ChevronLeft className="size-4" /><ChevronRight className="size-4" /></span></div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-500">{"D S C P J S Y".split(" ").map((d) => <span key={d}>{d}</span>)}{Array.from({ length: daysInMonth }, (_, i) => <span key={i} className={i + 1 === activeDay ? "rounded-md bg-violet-500 py-1 font-bold text-white shadow-[0_0_14px_#a855f7]" : "py-1 text-slate-300"}>{i + 1}</span>)}</div>
      <div className="my-5 h-px bg-white/10" />
      <div className="flex items-end justify-between"><div><p className="text-xs text-slate-400">Bugungi progress</p><p className="mt-1 text-2xl font-bold text-white">78%</p></div><div className="hero-progress-ring"><span>4/5</span></div></div>
      <div className="hero-progress-track mt-3"><span /></div>
      <div className="mt-5 space-y-3">{["Dizayn maketi", "Mijozga xat", "Kunlik review"].map((task, index) => <div key={task} className="hero-side-task group flex items-center gap-2 rounded-xl p-1.5"><span className={cn("grid size-5 place-items-center rounded-md border transition-all", index < 2 ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-slate-600")}><Check className="size-3" /></span><span className={cn("text-xs", index < 2 ? "text-slate-400 line-through" : "text-slate-100")}>{task}</span></div>)}</div>
    </aside>
  );
}

export function HeroOrb({ className }: { className?: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = sceneRef.current;
    if (!node || window.matchMedia("(max-width: 767px)").matches) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--parallax-x", `${x * 12}px`);
    node.style.setProperty("--parallax-y", `${y * 12}px`);
    node.style.setProperty("--scene-rotate-x", `${y * -4}deg`);
    node.style.setProperty("--scene-rotate-y", `${x * 5}deg`);
  };
  const resetMove = () => {
    const node = sceneRef.current;
    if (!node) return;
    node.style.setProperty("--parallax-x", "0px");
    node.style.setProperty("--parallax-y", "0px");
    node.style.setProperty("--scene-rotate-x", "0deg");
    node.style.setProperty("--scene-rotate-y", "0deg");
  };
  return (
    <div ref={sceneRef} onMouseMove={handleMove} onMouseLeave={resetMove} className={cn("hero-scene hero-cinematic relative mx-auto aspect-square w-full max-w-[540px]", className)} aria-label="Ordo kunlik rejalashtirish sahnasi">
      <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
      <div className="hero-stars" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" />
      <Calendar />
      {tasks.map((task) => <div key={task.title} className="hero-task-card absolute z-30" style={{ left: task.x, top: task.y, animationDelay: task.delay } as CSSProperties}><span className="grid size-7 place-items-center rounded-lg bg-violet-500/20 text-violet-300"><Clock3 className="size-3.5" /></span><span><b>{task.title}</b><small>{task.time}</small></span></div>)}
      <ClockScene />
      <div className="hero-particles" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ left: `${12 + i * 8}%`, animationDelay: `${i * -0.8}s` }} />)}</div>
      <div className="hero-podium absolute bottom-[10%] left-1/2 z-10 h-[18%] w-[62%] -translate-x-1/2 rounded-[50%] border border-violet-300/25 bg-[radial-gradient(ellipse,rgba(168,85,247,.45),rgba(34,211,238,.12)_42%,transparent_70%)] shadow-[0_18px_35px_rgba(0,0,0,.65),0_0_36px_rgba(168,85,247,.48)]" />
    </div>
  );
}

export function HeroSidebar() { return <Sidebar />; }
