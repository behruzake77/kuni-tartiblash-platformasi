"use client";

import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationCenter } from "@/components/layout/notification-center";
import { SyncIndicator } from "@/components/layout/sync-indicator";
import { useUser } from "@/providers/user-provider";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  title: string;
  sidebarCollapsed: boolean;
  onOpenCommand?: () => void;
};

export function AppHeader({
  title,
  sidebarCollapsed,
  onOpenCommand,
}: AppHeaderProps) {
  const { t, user } = useUser();
  const initials = (user?.name || "AO")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-[var(--z-sticky)] flex h-14 items-center justify-between gap-4 border-b border-border bg-bg/80 px-4 backdrop-blur-[var(--blur-md)] md:px-6",
        "transition-[left] duration-[var(--duration-base)] ease-[var(--ease-soft)]",
        sidebarCollapsed ? "left-0 md:left-14" : "left-0 md:left-60"
      )}
    >
      <div className="min-w-0">
        <h1 className="truncate font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-text-primary md:text-lg">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onOpenCommand}
          className="hidden h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface-3 px-3 text-sm text-text-tertiary transition-colors hover:border-border-strong hover:text-text-secondary sm:inline-flex"
        >
          <Search className="size-3.5" aria-hidden="true" />
          <span className="hidden md:inline">{t("common.search")}</span>
          <kbd className="ml-4 rounded border border-border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px]">
            ⌘K
          </kbd>
        </button>

        <SyncIndicator compact />
        <ThemeToggle />
        <NotificationCenter />

        <a
          href="/app/settings"
          className="ml-1 inline-flex size-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-semibold text-white"
          aria-label="Account"
        >
          {initials}
        </a>
      </div>
    </header>
  );
}
