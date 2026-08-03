"use client";

import Link from "next/link";
import { Command } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroOrb } from "@/components/marketing/hero-orb";
import { useUser } from "@/providers/user-provider";
import { mt } from "@/lib/marketing-i18n";

export function Hero() {
  const { locale } = useUser();

  return (
    <section className="relative overflow-hidden bg-gradient-hero noise-overlay">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 120%, rgba(6,182,212,0.08), transparent 40%)",
        }}
      />

      <div className="container-ordo relative z-10 grid min-h-[calc(100dvh-4rem)] items-center gap-12 pb-20 pt-28 lg:grid-cols-2 lg:gap-16 lg:pb-28 lg:pt-32">
        <div className="flex max-w-xl flex-col items-start text-left">
          <Badge variant="primary" className="mb-6">
            <Command className="size-3" aria-hidden="true" />
            {mt(locale, "hero.badge")}
          </Badge>

          <h1 className="font-[family-name:var(--font-display)] text-[2.5rem] font-bold leading-[1.05] tracking-[var(--tracking-tighter)] text-text-primary sm:text-5xl lg:text-6xl">
            {mt(locale, "hero.title1")}{" "}
            <span className="text-gradient-brand">
              {mt(locale, "hero.title2")}
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg sm:leading-relaxed">
            {mt(locale, "hero.lead")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Uiverse arrow CTA — satyamchaudharydev, Ordo tokens */}
            <Button variant="cta" size="lg" asChild>
              <Link href="/signup">{mt(locale, "hero.cta")}</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="#how-it-works">{mt(locale, "hero.secondary")}</Link>
            </Button>
          </div>

          <p className="mt-6 font-[family-name:var(--font-mono)] text-xs tracking-wide text-text-tertiary">
            <kbd className="rounded border border-border bg-surface-3 px-1.5 py-0.5 text-[10px] font-medium text-text-secondary">
              ⌘K
            </kbd>
            <span className="ml-2">{mt(locale, "hero.kbd")}</span>
          </p>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <HeroOrb className="w-full max-w-[380px] lg:max-w-[440px]" />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-bg)] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
