"use client";

import { useState } from "react";
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
      <div className="relative w-full max-w-md rounded-[var(--radius-2xl)] border border-border bg-surface-elevated p-6 shadow-xl sm:p-8">
        <Logo href="/" size="sm" />
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">
          {t("onboard.title")}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">{t("onboard.sub")}</p>

        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full",
                i <= step ? "bg-gradient-brand" : "bg-surface-3"
              )}
            />
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
          <Button type="button" variant="ghost" onClick={finish}>
            {t("onboard.skip")}
          </Button>
          {step < 2 ? (
            <Button
              type="button"
              variant="gradient"
              onClick={() => setStep((s) => s + 1)}
            >
              {t("onboard.next")}
            </Button>
          ) : (
            <Button type="button" variant="gradient" onClick={finish}>
              {t("onboard.finish")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
