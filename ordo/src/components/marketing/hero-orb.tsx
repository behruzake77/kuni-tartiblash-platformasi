"use client";

import { cn } from "@/lib/utils";

/**
 * Ordo Core Orb — premium CSS fallback
 * Full Three.js scene lives in preview/hero-3d.js for the static marketing page.
 * This component mirrors the same visual language inside Next.js (no WebGL bundle cost on every route).
 */

export function HeroOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[480px]",
        className
      )}
      aria-hidden="true"
    >
      {/* Aura */}
      <div className="absolute inset-[6%] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.4)_0%,rgba(139,92,246,0.18)_40%,transparent_70%)] blur-3xl" />

      {/* Outer ring + bead */}
      <div className="absolute inset-[8%] animate-[spin_22s_linear_infinite] rounded-full border border-[color-mix(in_srgb,var(--color-primary)_40%,transparent)] shadow-[0_0_30px_rgba(59,130,246,0.15)]">
        <span className="absolute -right-1.5 top-[22%] size-3 rounded-full bg-gradient-brand shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
      </div>

      {/* Dashed counter ring */}
      <div className="absolute inset-[16%] rotate-[32deg] animate-[spin_32s_linear_infinite_reverse] rounded-full border border-dashed border-[color-mix(in_srgb,var(--color-secondary)_35%,transparent)] opacity-80" />

      {/* Thin cyan ring */}
      <div className="absolute inset-[20%] -rotate-[18deg] animate-[spin_40s_linear_infinite] rounded-full border border-[color-mix(in_srgb,var(--color-accent)_25%,transparent)] opacity-60" />

      {/* Glass core */}
      <div className="absolute inset-[26%] overflow-hidden rounded-full border border-white/15 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.35),transparent_40%),radial-gradient(circle_at_70%_68%,rgba(59,130,246,0.55),transparent_55%),linear-gradient(145deg,rgba(34,211,238,0.3),rgba(124,58,237,0.4)_45%,rgba(10,14,30,0.95))] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_40px_100px_rgba(0,0,0,0.55),0_0_60px_rgba(99,102,241,0.25)]">
        <div className="absolute left-[18%] top-[14%] h-[28%] w-[38%] rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.6),transparent_70%)] blur-[2px]" />
        <div className="absolute inset-[30%] animate-pulse rounded-full bg-gradient-brand opacity-55 blur-md" />
        <div className="absolute inset-[42%] rounded-full bg-white/25 blur-sm" />
      </div>

      {/* Floor reflection */}
      <div className="absolute bottom-[6%] left-1/2 h-8 w-[58%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse,rgba(99,102,241,0.4),transparent_70%)] blur-lg" />

      {/* Floating chips */}
      <div className="absolute left-0 top-[12%] z-10 hidden items-center gap-2 rounded-2xl border border-border-strong bg-surface-2/80 px-3.5 py-2.5 text-xs font-medium text-text-secondary shadow-lg backdrop-blur-md sm:flex">
        <span className="size-2 rounded-full bg-success shadow-[0_0_10px_var(--color-success)]" />
        Focus · <span className="text-text-primary">1h 20m</span>
      </div>
      <div className="absolute bottom-[16%] right-0 z-10 hidden rounded-2xl border border-border-strong bg-surface-2/80 px-3.5 py-2.5 text-xs font-medium text-text-secondary shadow-lg backdrop-blur-md sm:block">
        Priorities · <span className="text-text-primary">2/3 done</span>
      </div>
    </div>
  );
}
