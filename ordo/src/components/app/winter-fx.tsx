"use client";

import { useEffect } from "react";
import { useUser } from "@/providers/user-provider";

/**
 * WinterFx — ambient micro-interactions for the Winter Aurora theme.
 *  · Subtle mouse parallax (drives --parallax-x / --parallax-y on <html>,
 *    consumed by the aurora + mountain scene layers).
 *  · Tiny snow-sparkle burst on any button/link click.
 * Completely inert outside the winter theme and for reduced-motion users.
 */
export function WinterFx() {
  const { prefs } = useUser();
  const active = prefs.themePreset === "winter";

  // Mouse parallax
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        root.style.setProperty("--parallax-x", x.toFixed(4));
        root.style.setProperty("--parallax-y", y.toFixed(4));
      });
    };
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  // Click sparkles
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "button, a, [role='button'], [role='option']"
      );
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const host = document.createElement("span");
      host.className = "winter-sparkles";
      host.setAttribute("aria-hidden", "true");
      host.style.left = `${rect.left + rect.width / 2}px`;
      host.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(host);

      const n = 8;
      for (let i = 0; i < n; i++) {
        const s = document.createElement("i");
        const ang = (Math.PI * 2 * i) / n + Math.random() * 0.6;
        const dist = 26 + Math.random() * 36;
        s.style.setProperty("--dx", `${Math.cos(ang) * dist}px`);
        s.style.setProperty("--dy", `${Math.sin(ang) * dist}px`);
        s.style.setProperty("--sz", `${2 + Math.random() * 3}px`);
        s.style.setProperty("--delay", `${(Math.random() * 0.08).toFixed(3)}s`);
        host.appendChild(s);
      }
      window.setTimeout(() => host.remove(), 700);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [active]);

  return null;
}
