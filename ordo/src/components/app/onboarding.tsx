"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Languages, Sparkles, Star } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOCALES, type Locale } from "@/lib/i18n";
import { useUser } from "@/providers/user-provider";
import { cn } from "@/lib/utils";

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { ready, onboarded, user, locale, t, completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(user?.name || "");
  const [lang, setLang] = useState<Locale>(locale);
  const [priority, setPriority] = useState("");

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-sm text-text-tertiary">
        {t("common.loading")}
      </div>
    );
  }

  if (onboarded) return <>{children}</>;

  function finish() {
    completeOnboarding({
      name: name || "Operator",
      locale: lang,
      firstPriority: priority,
    });
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-bg px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(59,130,246,0.2), transparent 40%), radial-gradient(circle at 80% 100%, rgba(139,92,246,0.14), transparent 40%)",
        }}
        aria-hidden="true"
      />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-surface-elevated shadow-xl md:grid-cols-[1.05fr_.95fr]">
        <div className="p-6 sm:p-8 md:p-10">
          <Logo href="/" size="sm" />
          <div className="mt-7 flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              {step === 0 ? <Sparkles className="size-5" /> : step === 1 ? <Languages className="size-5" /> : <Star className="size-5" />}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-primary">{step + 1} / 3</p>
              <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t("onboard.title")}</h1>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">{t("onboard.sub")}</p>

          <div className="mt-6 flex gap-1.5" aria-label={`Step ${step + 1} of 3`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", i <= step ? "bg-gradient-brand" : "bg-surface-3")} />
            ))}
          </div>

        <div className="mt-8">
          {step === 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary">
                {t("onboard.step1")}
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("onboard.namePh")}
                autoFocus
              />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-text-primary">
                {t("onboard.step2")}
              </p>
              <div className="grid gap-2">
                {LOCALES.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLang(l.id)}
                    className={cn(
                      "flex items-center justify-between rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm transition-colors",
                      lang === l.id
                        ? "border-primary bg-primary-subtle text-primary"
                        : "border-border bg-surface-2 text-text-secondary hover:border-border-strong"
                    )}
                  >
                    <span className="font-medium">{l.native}</span>
                    <span className="text-xs opacity-70">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary">
                {t("onboard.step3")}
              </label>
              <Input
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder={t("onboard.priorityPh")}
                autoFocus
              />
            </div>
          )}
        </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? <Button type="button" variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)} leftIcon={<ArrowLeft className="size-4" />}>{t("common.back")}</Button> : <Button type="button" variant="ghost" onClick={finish}>{t("onboard.skip")}</Button>}
            {step < 2 ? <Button type="button" variant="gradient" onClick={() => setStep((s) => s + 1)}>{t("onboard.next")}</Button> : <Button type="button" variant="gradient" onClick={finish} rightIcon={<CheckCircle2 className="size-4" />}>{t("onboard.finish")}</Button>}
          </div>
        </div>
        <aside className="relative hidden overflow-hidden border-l border-border bg-[radial-gradient(circle_at_50%_35%,rgba(168,85,247,.22),transparent_32%),linear-gradient(145deg,rgba(99,102,241,.13),rgba(34,211,238,.05))] p-10 md:flex md:flex-col md:justify-between">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
          <div className="relative"><p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[var(--tracking-widest)] text-primary">ORDO / START</p><h2 className="mt-4 max-w-xs font-[family-name:var(--font-display)] text-3xl font-bold leading-tight text-text-primary">Bir kunda muhim narsalarga joy oching.</h2></div>
          <div className="relative space-y-3 rounded-[var(--radius-xl)] border border-white/10 bg-surface-1/60 p-5 shadow-lg backdrop-blur"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-success-subtle text-success"><CheckCircle2 className="size-5" /></span><div><p className="text-sm font-semibold text-text-primary">Bugun uchun tayyor</p><p className="text-xs text-text-tertiary">Priority · Focus · Review</p></div></div><div className="h-1.5 overflow-hidden rounded-full bg-surface-3"><span className="block h-full w-2/3 rounded-full bg-gradient-brand" /></div></div>
        </aside>
      </div>
    </div>
  );
}
