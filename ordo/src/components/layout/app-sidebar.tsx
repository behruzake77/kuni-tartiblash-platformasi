"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Command,
  Flame,
  Focus,
  Moon,
  Settings,
  ShieldCheck,
  Snowflake,
  Sun,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/shared/logo";
import { useUser } from "@/providers/user-provider";
import { isAdminEmail } from "@/lib/admin";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  dayPct?: number;
  onOpenCommand?: () => void;
};

export function AppSidebar({
  collapsed,
  onToggle,
  dayPct = 0,
  onOpenCommand,
}: AppSidebarProps) {
  const pathname = usePathname();
  const { t, user, prefs } = useUser();
  const isWinter = prefs.themePreset === "winter";
  const isAdmin = isAdminEmail(user?.email);

  const NAV = [
    { label: t("nav.today"), href: "/app", icon: Sun },
    { label: "Kalendar", href: "/app/calendar", icon: CalendarDays },
    { label: t("nav.schedule"), href: "/app/schedule", icon: CalendarClock },
    { label: t("nav.focus"), href: "/app/focus", icon: Focus },
    { label: t("nav.habits"), href: "/app/habits", icon: Flame },
    { label: t("nav.review"), href: "/app/review", icon: Moon },
    { label: t("nav.insights"), href: "/app/insights", icon: BarChart3 },
    { label: t("nav.activity"), href: "/app/activity", icon: Activity },
  ];

  return (
    <aside
      className={cn(
        "ordo-sidebar fixed inset-y-0 left-0 z-[var(--z-sticky)] flex flex-col border-r border-border bg-surface-1",
        "transition-[width] duration-[var(--duration-base)] ease-[var(--ease-soft)]",
        collapsed ? "w-14" : "w-60"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-border",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        {collapsed ? (
          <Link href="/app" aria-label="Ordo home">
            <LogoMark size={24} />
          </Link>
        ) : (
          <>
            <Logo href="/app" size="sm" />
            {isWinter && (
              <Snowflake
                className="ordo-sidebar-snow size-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="App">
        {!collapsed && (
          <p className="mb-1 px-2.5 pt-2 text-[11px] font-semibold uppercase tracking-[var(--tracking-widest)] text-text-tertiary">
            {t("nav.yourDay")}
          </p>
        )}
        {NAV.map((item) => {
          const active =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex h-9 items-center gap-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-[var(--duration-fast)]",
                collapsed ? "justify-center px-0" : "px-2.5",
                active
                  ? "ordo-nav-active bg-primary-subtle text-primary"
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
              )}
            >
              {active && (
                <span
                  className="ordo-nav-bar absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary animate-[sidebar-active-glow_2.8s_ease-in-out_infinite]"
                  aria-hidden="true"
                />
              )}
              <Icon
                className="size-[18px] shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {!collapsed && (
          <div className="mt-4 rounded-[var(--radius-md)] border border-border bg-surface-2 p-3">
            <div className="flex items-center justify-between text-xs font-medium text-text-primary">
              <span>{t("nav.dayProgress")}</span>
              <span className="font-[family-name:var(--font-mono)] text-text-tertiary">
                {dayPct}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
              <div
                className="ordo-ice-bar h-full rounded-full bg-gradient-brand transition-[width] duration-500"
                style={{ width: `${Math.min(100, dayPct)}%` }}
              />
            </div>
          </div>
        )}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-border p-2">
        <button
          type="button"
          onClick={onOpenCommand}
          className={cn(
            "flex h-9 items-center gap-2 rounded-[var(--radius-sm)] text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary",
            collapsed ? "justify-center" : "px-2.5"
          )}
          title={t("nav.command")}
        >
          <Command className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{t("nav.command")}</span>
              <kbd className="rounded border border-border bg-surface-3 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-text-tertiary">
                ⌘K
              </kbd>
            </>
          )}
        </button>

        {isAdmin && (
          <Link
            href="/app/admin"
            title={collapsed ? "Admin panel" : undefined}
            className={cn(
              "flex h-9 items-center gap-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors",
              collapsed ? "justify-center" : "px-2.5",
              pathname.startsWith("/app/admin") ? "bg-primary-subtle text-primary" : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
            )}
          >
            <ShieldCheck className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
            {!collapsed && "Admin panel"}
          </Link>
        )}

        <Link
          href="/app/settings"
          title={collapsed ? t("nav.settings") : undefined}
          className={cn(
            "flex h-9 items-center gap-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors",
            collapsed ? "justify-center" : "px-2.5",
            pathname.startsWith("/app/settings")
              ? "bg-primary-subtle text-primary"
              : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
          )}
        >
          <Settings className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
          {!collapsed && t("nav.settings")}
        </Link>

        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "mt-1 flex h-9 items-center gap-2 rounded-[var(--radius-sm)] text-sm font-medium text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary",
            collapsed ? "justify-center" : "px-2.5"
          )}
          aria-label={t("nav.collapse")}
        >
          {collapsed ? (
            <ChevronRight className="size-[18px]" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="size-[18px]" aria-hidden="true" />
              <span>{t("nav.collapse")}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
