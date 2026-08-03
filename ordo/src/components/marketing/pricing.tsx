"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/providers/user-provider";
import { mt } from "@/lib/marketing-i18n";
import { cn } from "@/lib/utils";

export function Pricing() {
  const { locale } = useUser();

  const PLANS = [
    {
      name: mt(locale, "pricing.free"),
      price: "$0",
      period: mt(locale, "pricing.forever"),
      description: mt(locale, "pricing.freeDesc"),
      cta: mt(locale, "pricing.ctaFree"),
      href: "/signup",
      featured: false,
      features:
        locale === "uz"
          ? [
              "Bugun doskasi va prioritetlar",
              "Vaqt bloklari",
              "Fokus taymer",
              "Asosiy odatlar",
              "7 kunlik tarix",
            ]
          : locale === "ru"
            ? [
                "Доска Сегодня и приоритеты",
                "Тайм-блоки",
                "Фокус-таймер",
                "Базовые привычки",
                "История 7 дней",
              ]
            : [
                "Today board & priorities",
                "Time blocks",
                "Focus timer",
                "Basic habits",
                "7-day history",
              ],
    },
    {
      name: mt(locale, "pricing.pro"),
      price: "$12",
      period: mt(locale, "pricing.month"),
      description: mt(locale, "pricing.proDesc"),
      cta: mt(locale, "pricing.ctaPro"),
      href: "/signup",
      featured: true,
      features:
        locale === "uz"
          ? [
              "Free dagi hammasi",
              "Kun yakuni sharhlari",
              "Kengaytirilgan odat seriyalari",
              "Haftalik tahlil",
              "AI kun yordamchisi",
              "Cheksiz tarix",
            ]
          : locale === "ru"
            ? [
                "Всё из Free",
                "Итоги дня",
                "Продвинутые серии привычек",
                "Недельная аналитика",
                "AI-ассистент дня",
                "Безлимитная история",
              ]
            : [
                "Everything in Free",
                "Day close reviews",
                "Advanced habit streaks",
                "Weekly insights",
                "AI day assist",
                "Unlimited history",
              ],
    },
    {
      name: mt(locale, "pricing.team"),
      price: "$10",
      period: mt(locale, "pricing.seat"),
      description: mt(locale, "pricing.teamDesc"),
      cta: mt(locale, "pricing.ctaTeam"),
      href: "#",
      featured: false,
      features:
        locale === "uz"
          ? [
              "Pro dagi hammasi",
              "Jamoa ritualari",
              "Admin nazorati",
              "Ustuvor qo‘llab-quvvatlash",
            ]
          : locale === "ru"
            ? [
                "Всё из Pro",
                "Общие ритуалы команды",
                "Админ-контроль",
                "Приоритетная поддержка",
              ]
            : [
                "Everything in Pro",
                "Shared team rituals",
                "Admin controls",
                "Priority support",
              ],
    },
  ];

  return (
    <section id="pricing" className="scroll-mt-24 py-20 md:py-28 lg:py-32">
      <div className="container-ordo">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            {mt(locale, "pricing.label")}
          </Badge>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-[var(--tracking-tight)] text-text-primary sm:text-4xl">
            {mt(locale, "pricing.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            {mt(locale, "pricing.sub")}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3 md:gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-[var(--radius-xl)] border p-6 md:p-8",
                plan.featured
                  ? "border-primary/40 bg-surface-2 shadow-lg shadow-glow"
                  : "border-border bg-surface-2"
              )}
            >
              {plan.featured && (
                <Badge variant="gradient" className="absolute -top-2.5 left-6">
                  {mt(locale, "pricing.popular")}
                </Badge>
              )}
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text-primary">
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-text-primary">
                  {plan.price}
                </span>
                <span className="text-sm text-text-tertiary">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {plan.description}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                      strokeWidth={2}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={cn(
                  "mt-8 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] px-5 text-sm font-semibold transition-[filter,background-color,border-color,transform] duration-[var(--duration-fast)] active:scale-[0.98]",
                  plan.featured
                    ? "bg-gradient-brand text-white shadow-sm hover:brightness-110"
                    : "border border-border bg-surface-elevated text-text-primary hover:border-border-strong hover:bg-surface-3"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
