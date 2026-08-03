"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useInbox } from "@/providers/inbox-provider";
import { useUser } from "@/providers/user-provider";
import { cn } from "@/lib/utils";

export function NotificationCenter() {
  const { items, unread, markRead, clear } = useInbox();
  const { t, locale } = useUser();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const time = (iso: string) => {
    try {
      const loc =
        locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US";
      return new Intl.DateTimeFormat(loc, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return "";
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open && unread > 0) {
            // keep unread until user marks — optional auto mark none
          }
        }}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
        aria-label={t("inbox.title")}
        aria-expanded={open}
      >
        <Bell className="size-4" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-[var(--z-popover)] w-[min(100vw-2rem,360px)] overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface-elevated shadow-xl"
          role="dialog"
          aria-label={t("inbox.title")}
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <p className="text-sm font-semibold text-text-primary">
              {t("inbox.title")}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => markRead()}
                className="inline-flex h-8 items-center gap-1 rounded-[var(--radius-sm)] px-2 text-xs text-text-tertiary hover:bg-surface-3 hover:text-text-primary"
                title={t("inbox.markAll")}
              >
                <CheckCheck className="size-3.5" />
                <span className="hidden sm:inline">{t("inbox.markAll")}</span>
              </button>
              <button
                type="button"
                onClick={() => clear()}
                className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary hover:bg-surface-3 hover:text-danger"
                title={t("inbox.clear")}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-text-tertiary">
                {t("inbox.empty")}
              </p>
            ) : (
              <ul>
                {items.slice(0, 40).map((n) => {
                  const inner = (
                    <div
                      className={cn(
                        "flex gap-3 px-3 py-3 transition-colors hover:bg-surface-3/70",
                        !n.read && "bg-primary-subtle/40"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-1.5 size-2 shrink-0 rounded-full",
                          n.read ? "bg-transparent" : "bg-primary"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary">
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="mt-0.5 text-xs text-text-secondary">
                            {n.body}
                          </p>
                        )}
                        <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-text-tertiary">
                          {time(n.at)} · {n.kind}
                        </p>
                      </div>
                    </div>
                  );

                  return (
                    <li key={n.id} className="border-b border-border last:border-0">
                      {n.href ? (
                        <Link
                          href={n.href}
                          onClick={() => {
                            markRead(n.id);
                            setOpen(false);
                          }}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left"
                          onClick={() => markRead(n.id)}
                        >
                          {inner}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
