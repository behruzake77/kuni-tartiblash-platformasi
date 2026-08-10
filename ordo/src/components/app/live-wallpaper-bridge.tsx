"use client";

import { useUser } from "@/providers/user-provider";
import { VantaWallpaper } from "./vanta-wallpaper";
import type { ThemeId } from "@/lib/themes";

const THEME_TO_EFFECT: Record<string, "fog" | "waves" | "birds" | "clouds" | "globe" | "net" | "rings" | "topology" | "cells" | "dots" | "halo" | "trunk" | "ripple"> = {
  "live-nebula": "fog",
  "live-aurora": "topology",
  "live-ocean": "waves",
  "live-cyber": "net",
  "live-birds": "birds",
  "live-globe": "globe",
  "live-clouds": "clouds",
  "live-rings": "rings",
};

export function LiveWallpaperBridge() {
  const { prefs } = useUser();
  const effect = THEME_TO_EFFECT[prefs.themePreset as ThemeId];

  if (!effect) return null;

  return (
    <VantaWallpaper
      effect={effect}
      className="ordo-live-wallpaper"
    />
  );
}
