"use client";

import { Badge } from "@/components/ui/badge";
import { useUser } from "@/providers/user-provider";
import { mt } from "@/lib/marketing-i18n";

export function HowItWorks() {
  const { locale } = useUser();
  const STEPS = [
    {
      step: "01",
      title: mt(locale, "how.s1.t"),
      description: mt(locale, "how.s1.d"),
    },
    {
      step: "02",
      title: mt(locale, "how.s2.t"),
      description: mt(locale, "how.s2.d"),
    },
    {
      step: "03",
      title: mt(locale, "how.s3.t"),
      description: mt(locale, "how.s3.d"),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-border bg-surface-1 py-20 md:py-28"
    >
      <div className="container-ordo">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            {mt(locale, "how.label")}
          </Badge>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-[var(--tracking-tight)] text-text-primary sm:text-4xl">
            {mt(locale, "how.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            {mt(locale, "how.sub")}
          </p>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {STEPS.map((s, i) => (
            <li
              key={s.step}
              className="relative rounded-[var(--radius-lg)] border border-border bg-surface-2 p-6 md:p-8"
            >
              <span className="font-[family-name:var(--font-mono)] text-sm font-medium text-primary">
                {s.step}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold tracking-[var(--tracking-slight)] text-text-primary">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {s.description}
              </p>
              {i < STEPS.length - 1 && (
                <div
                  className="pointer-events-none absolute -right-4 top-1/2 hidden h-px w-8 bg-border-strong md:block"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
