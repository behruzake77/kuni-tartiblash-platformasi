"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useUser } from "@/providers/user-provider";
import { mt } from "@/lib/marketing-i18n";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  const { locale } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const NAV = [
    { label: mt(locale, "nav.product"), href: "#product" },
    { label: mt(locale, "nav.features"), href: "#features" },
    { label: mt(locale, "nav.how"), href: "#how-it-works" },
    { label: mt(locale, "nav.pricing"), href: "#pricing" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--z-sticky)] transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-base)] ease-[var(--ease-soft)]",
        scrolled || open
          ? "border-b border-border/80 bg-[color-mix(in_srgb,var(--color-bg)_78%,transparent)] backdrop-blur-[var(--blur-lg)]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-ordo flex h-14 items-center justify-between gap-4 md:h-16">
        <Logo size="md" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-[var(--duration-fast)] hover:bg-surface-2 hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary sm:inline-flex"
          >
            {mt(locale, "nav.signIn")}
          </Link>
          <Link
            href="/signup"
            className={cn(
              "hidden sm:inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] px-3.5",
              "bg-gradient-brand text-sm font-medium text-white shadow-sm",
              "transition-[filter,box-shadow] duration-[var(--duration-fast)]",
              "hover:brightness-110 hover:shadow-md hover:shadow-glow",
              "active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            )}
          >
            {mt(locale, "nav.getStarted")}
          </Link>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-text-secondary hover:bg-surface-2 hover:text-text-primary lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border bg-bg lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav
          className="container-ordo flex flex-col gap-1 py-4"
          aria-label="Mobile"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-[var(--radius-sm)] px-3 py-3 text-base font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-[var(--radius-sm)] px-3 py-3 text-base font-medium text-text-secondary hover:bg-surface-2"
            >
              {mt(locale, "nav.signIn")}
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-gradient-brand px-5 text-[15px] font-medium text-white"
            >
              {mt(locale, "nav.getStarted")}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
