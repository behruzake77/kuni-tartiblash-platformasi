"use client";

import Link from "next/link";
import { Command, Gauge, Sparkles, Target, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroOrb, HeroSidebar } from "@/components/marketing/hero-orb";
import { useUser } from "@/providers/user-provider";
import { mt } from "@/lib/marketing-i18n";

const stats = [
  { value: 2.5, suffix: "x", label: "tezroq rejalash", icon: Gauge },
  { value: 95, suffix: "%", label: "fokus aniqligi", icon: Target },
  { value: 4.8, suffix: "h", label: "deep work", icon: Timer },
  { value: 10, suffix: "K+", label: "faol foydalanuvchi", icon: Sparkles },
];

function StatValue({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const started = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - started) / 900, 1);
        setShown(value * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <strong ref={ref} className="block text-xl font-bold tracking-tight text-white">{Number.isInteger(value) ? Math.round(shown) : shown.toFixed(1)}{suffix}</strong>;
}

export function Hero() {
  const { locale } = useUser();
  return (
    <section className="hero-live relative overflow-hidden bg-[#0A0E1A] noise-overlay">
      <div className="hero-gradient-shift pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-ordo relative z-10 grid min-h-[calc(100dvh-4rem)] items-center gap-8 pb-10 pt-24 lg:grid-cols-[.9fr_1.25fr_.7fr] lg:gap-5 lg:pb-24 lg:pt-28">
        <div className="relative z-30 flex max-w-xl flex-col items-start text-left">
          <Badge variant="primary" className="mb-6 border-violet-400/30 bg-violet-500/10 text-violet-200"><Command className="size-3" aria-hidden="true" />{mt(locale, "hero.badge")}</Badge>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.7rem,5vw,4.6rem)] font-bold leading-[.98] tracking-[-.055em] text-white">{mt(locale, "hero.title1")} <span className="bg-gradient-to-r from-[#A855F7] via-[#6366F1] to-[#22D3EE] bg-clip-text text-transparent">{mt(locale, "hero.title2")}</span></h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">{mt(locale, "hero.lead")}</p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"><Button variant="cta" size="lg" asChild><Link href="/signup">{mt(locale, "hero.cta")}</Link></Button><Button variant="secondary" size="lg" asChild><Link href="#how-it-works">{mt(locale, "hero.secondary")}</Link></Button></div>
          <p className="mt-6 font-[family-name:var(--font-mono)] text-xs tracking-wide text-slate-400"><kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-200">⌘K</kbd><span className="ml-2">{mt(locale, "hero.kbd")}</span></p>
        </div>
        <div className="relative flex min-h-[330px] items-center justify-center sm:min-h-[470px]"><HeroOrb className="w-full" /></div>
        <div className="relative z-30 mx-auto w-full max-w-[285px] lg:mx-0"><HeroSidebar /></div>
      </div>
      <div className="container-ordo relative z-20 pb-8 lg:pb-12"><div className="hero-stats grid grid-cols-2 divide-x-0 divide-white/10 rounded-2xl border border-white/10 bg-white/[.035] p-2 backdrop-blur md:grid-cols-4 md:divide-x">{stats.map(({ value, suffix, label, icon: Icon }) => <div className="group flex items-center gap-3 px-3 py-3 sm:px-5" key={label}><Icon className="hero-stat-icon size-5 text-cyan-300" /><div><StatValue value={value} suffix={suffix} /><span className="text-[11px] text-slate-400">{label}</span></div></div>)}</div></div>
    </section>
  );
}
