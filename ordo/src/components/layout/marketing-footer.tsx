"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { useUser } from "@/providers/user-provider";
import { mt } from "@/lib/marketing-i18n";
import { LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MarketingFooter() {
  const { locale, updatePrefs } = useUser();

  return (
    <footer className="border-t border-border bg-surface-1">
      <div className="container-ordo py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo size="sm" href="/" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              {mt(locale, "footer.tagline")}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {LOCALES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => updatePrefs({ locale: l.id as Locale })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    locale === l.id
                      ? "border-primary bg-primary-subtle text-primary"
                      : "border-border text-text-tertiary hover:border-border-strong hover:text-text-secondary"
                  )}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-text-tertiary">
              {mt(locale, "nav.product")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {[
                { label: mt(locale, "nav.features"), href: "#features" },
                { label: mt(locale, "nav.how"), href: "#how-it-works" },
                { label: mt(locale, "nav.pricing"), href: "#pricing" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-text-tertiary">
              App
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <Link
                  href="/app"
                  className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  {mt(locale, "nav.openApp")}
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  {mt(locale, "nav.signIn")}
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  {mt(locale, "nav.getStarted")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} Ordo. {mt(locale, "footer.rights")}
            {" · "}
            <Link href="/privacy" className="hover:text-text-secondary">
              Privacy
            </Link>
            {" · "}
            <Link href="/terms" className="hover:text-text-secondary">
              Terms
            </Link>
          </p>
          <p className="font-[family-name:var(--font-mono)] text-xs text-text-tertiary">
            {mt(locale, "footer.loop")}
          </p>
        </div>
      </div>
    </footer>
  );
}
