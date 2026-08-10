"use client";

import { useEffect, useRef } from "react";

/**
 * Ordo Vanta Wallpaper — uses Vanta.js for premium 3D animated backgrounds.
 * Loads Three.js + Vanta effect via CDN script tags for maximum compatibility.
 */

type VantaEffect = "fog" | "waves" | "birds" | "clouds" | "globe" | "net" | "rings" | "topology" | "cells" | "dots" | "halo" | "trunk" | "ripple";

type VantaWallpaperProps = {
  effect?: VantaEffect;
  className?: string;
};

/** Per-effect dark theme color presets */
const EFFECT_COLORS: Record<string, Record<string, unknown>> = {
  fog: {
    highlightColor: 0x5dbdff,
    midtoneColor: 0x8b7dff,
    lowlightColor: 0x0d1f3c,
    baseColor: 0x061220,
    blurFactor: 0.6,
    speed: 0.8,
    zoom: 0.8,
  },
  waves: {
    color: 0x5dbdff,
    shininess: 30,
    waveHeight: 15,
    waveSpeed: 0.5,
    zoom: 0.75,
  },
  birds: {
    color1: 0x5dbdff,
    color2: 0x8b7dff,
    quantity: 3,
    birdSize: 1.2,
    wingSpan: 20,
    speedLimit: 3,
  },
  clouds: {
    skyColor: 0x061220,
    cloudColor: 0x1a3a5c,
    cloudShadowColor: 0x0d1f3c,
    sunColor: 0x5dbdff,
    sunGlareColor: 0x8b7dff,
    sunlightColor: 0x68ffd2,
    speed: 0.4,
  },
  globe: {
    color: 0x5dbdff,
    color2: 0x8b7dff,
    size: 1.0,
  },
  net: {
    color: 0x5dbdff,
    backgroundColor: 0x061220,
    points: 10,
    maxDistance: 20,
    spacing: 15,
  },
  rings: {
    color: 0x5dbdff,
    backgroundAlpha: 0,
  },
  topology: {
    color: 0x5dbdff,
    backgroundColor: 0x061220,
  },
  cells: {
    color1: 0x5dbdff,
    color2: 0x8b7dff,
    size: 1.5,
    speed: 0.8,
  },
  dots: {
    color: 0x5dbdff,
    color2: 0x8b7dff,
    backgroundColor: 0x061220,
    size: 3,
    spacing: 30,
  },
  halo: {
    color: 0x5dbdff,
    backgroundColor: 0x061220,
    size: 1.5,
  },
  trunk: {
    color: 0x5dbdff,
    backgroundColor: 0x061220,
    chaos: 4,
  },
  ripple: {
    color: 0x5dbdff,
    backgroundColor: 0x061220,
  },
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export function VantaWallpaper({
  effect = "fog",
  className,
}: VantaWallpaperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    async function init() {
      try {
        // Load Three.js from CDN if not already loaded
        if (!(window as unknown as Record<string, unknown>).THREE) {
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
        }

        if (cancelled || !containerRef.current) return;

        // Load Vanta effect script
        await loadScript(`https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.${effect}.min.js`);

        if (cancelled || !containerRef.current) return;

        // Access the Vanta effect constructor
        const vanta = (window as unknown as Record<string, unknown>).VANTA as Record<string, unknown> | undefined;
        if (!vanta || typeof vanta[effect.toUpperCase()] !== "function") {
          console.error("[VantaWallpaper] Effect not found:", effect);
          return;
        }

        const colors = EFFECT_COLORS[effect] || {};

        vantaRef.current = (vanta[effect.toUpperCase()] as (opts: Record<string, unknown>) => { destroy: () => void })({
          el: containerRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          ...colors,
        });
      } catch (err) {
        console.error("[VantaWallpaper] Failed to init:", err);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (vantaRef.current) {
        try { vantaRef.current.destroy(); } catch { /* ignore */ }
        vantaRef.current = null;
      }
    };
  }, [effect]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -2,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
