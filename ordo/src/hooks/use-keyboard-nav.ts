"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Gmail-style chords: g then t/f/h/s/r/i
 * Also: n = new task event
 */
export function useKeyboardNav(enabled = true) {
  const router = useRouter();
  const pendingG = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const clearPending = () => {
      pendingG.current = false;
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      if (pendingG.current) {
        e.preventDefault();
        const map: Record<string, string> = {
          t: "/app",
          s: "/app/schedule",
          f: "/app/focus",
          h: "/app/habits",
          r: "/app/review",
          i: "/app/insights",
          a: "/app/activity",
          comma: "/app/settings",
          ",": "/app/settings",
        };
        const href = map[key];
        clearPending();
        if (href) router.push(href);
        return;
      }

      if (key === "g") {
        e.preventDefault();
        pendingG.current = true;
        timer.current = window.setTimeout(clearPending, 900);
        return;
      }

      if (key === "n") {
        e.preventDefault();
        window.dispatchEvent(new Event("ordo:add-task"));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearPending();
    };
  }, [enabled, router]);
}
