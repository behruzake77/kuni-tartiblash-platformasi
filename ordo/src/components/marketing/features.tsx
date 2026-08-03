"use client";

import {
  CalendarClock,
  CheckSquare,
  Flame,
  Focus,
  Moon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/providers/user-provider";
import { mt } from "@/lib/marketing-i18n";

const ICONS: LucideIcon[] = [
  CheckSquare,
  CalendarClock,
  Focus,
  Flame,
  Moon,
  Sparkles,
];

export function Features() {
  const { locale } = useUser();

  const items = [1, 2, 3, 4, 5, 6].map((n, i) => ({
    icon: ICONS[i],
    title: mt(locale, `features.f${n}.t`),
    description: mt(locale, `features.f${n}.d`),
  }));

  return (
    <section id="features" className="scroll-mt-24 py-20 md:py-28 lg:py-32">
      <div className="container-ordo">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            {mt(locale, "features.label")}
          </Badge>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-[var(--tracking-tight)] text-text-primary sm:text-4xl">
            {mt(locale, "features.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            {mt(locale, "features.sub")}
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {items.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} interactive className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="inline-flex size-10 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-3 text-primary">
                    <Icon
                      className="size-5"
                      aria-hidden="true"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[var(--tracking-slight)] text-text-primary">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
