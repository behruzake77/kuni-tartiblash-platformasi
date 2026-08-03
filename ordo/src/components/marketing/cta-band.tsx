"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/user-provider";
import { mt } from "@/lib/marketing-i18n";

export function CtaBand() {
  const { locale } = useUser();

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-brand-subtle" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.2), transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="container-ordo relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-[var(--tracking-tight)] text-text-primary sm:text-4xl md:text-5xl">
          {mt(locale, "cta.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          {mt(locale, "cta.sub")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="lift" size="lg" asChild>
            <Link href="/signup">{mt(locale, "cta.primary")}</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/login">{mt(locale, "cta.secondary")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
