"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus first input
    window.setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLElement>(
        "input,textarea,button"
      );
      el?.focus();
    }, 10);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={cn(
          "relative w-full max-w-md rounded-[var(--radius-xl)] border border-border-strong bg-surface-elevated p-6 shadow-xl",
          "animate-dialog-in",
          className
        )}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary hover:bg-surface-3 hover:text-text-primary"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
        <h2
          id={titleId}
          className="pr-8 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-text-primary"
        >
          {title}
        </h2>
        {description && (
          <p id={descId} className="mt-1 text-sm text-text-secondary">
            {description}
          </p>
        )}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
