"use client";

import { useUser } from "@/providers/user-provider";
import { LiveWallpaper } from "./live-wallpaper";
import type { ThemeId } from "@/lib/themes";

const THEME_TO_PRESET: Record<string, "nebula" | "aurora-mountains" | "ocean" | "cyberpunk"> = {
  "live-nebula": "nebula",
  "live-aurora": "aurora-mountains",
  "live-ocean": "ocean",
  "live-cyber": "cyberpunk",
};

export function LiveWallpaperBridge() {
  const { prefs } = useUser();
  const preset = THEME_TO_PRESET[prefs.themePreset as ThemeId];

  if (!preset) return null;

  return (
    <LiveWallpaper
      preset={preset}
      className="ordo-live-wallpaper"
    />
  );
}
