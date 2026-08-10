/**
 * ORDO Theme Engine v2 — theme registry.
 *
 * Each theme is a full visual identity: colors, scene (animated background),
 * card treatment, typography and radius personality. The actual CSS lives in
 * `src/styles/theme-presets.css` keyed on `html[data-ordo-theme="<id>"]`.
 * This registry is the single source of truth for the Settings picker UI.
 */

export type ThemeId =
  | "default"
  | "ocean"
  | "forest"
  | "sunset"
  | "winter"
  | "spring"
  | "comic"
  | "space"
  | "travel"
  | "pixel"
  | "live-nebula"
  | "live-aurora"
  | "live-ocean"
  | "live-cyber";

export type ThemeMeta = {
  id: ThemeId;
  label: { en: string; uz: string; ru: string };
  description: { en: string; uz: string; ru: string };
  /** Mini preview background (CSS) shown in the Settings picker. */
  swatch: string;
  /** Signature brand gradient for the preview strip. */
  strip: string;
  /** Scene flavor used by the picker caption. */
  scene: string;
};

export const THEMES: ThemeMeta[] = [
  {
    id: "default",
    label: { en: "Classic", uz: "Klassik", ru: "Классика" },
    description: {
      en: "Calm original Ordo look with a soft aurora.",
      uz: "Yumshoq aurora bilan jim, original Ordo ko‘rinishi.",
      ru: "Спокойный оригинальный вид Ordo с мягким сиянием.",
    },
    swatch:
      "radial-gradient(90% 70% at 15% 20%, rgba(59,130,246,.45), transparent 60%), radial-gradient(80% 70% at 85% 15%, rgba(139,92,246,.4), transparent 60%), linear-gradient(150deg,#0b0f1a,#101a33 55%,#0b0f1a)",
    strip: "linear-gradient(135deg,#3b82f6,#8b5cf6 55%,#22d3ee)",
    scene: "aurora",
  },
  {
    id: "ocean",
    label: { en: "Ocean", uz: "Okean", ru: "Океан" },
    description: {
      en: "Deep sea blues, rising bubbles and glass cards.",
      uz: "Chuqur okean ranglari, ko‘tarilayotgan pufakchalar va shisha kartalar.",
      ru: "Глубокие океанские тона, пузырьки и стеклянные карточки.",
    },
    swatch:
      "radial-gradient(95% 75% at 20% 25%, rgba(34,211,238,.5), transparent 62%), radial-gradient(85% 70% at 85% 20%, rgba(37,99,235,.5), transparent 60%), linear-gradient(155deg,#04121d,#06283d 60%,#04121d)",
    strip: "linear-gradient(135deg,#0891b2,#2563eb 55%,#22d3ee)",
    scene: "bubbles",
  },
  {
    id: "forest",
    label: { en: "Forest", uz: "O‘rmon", ru: "Лес" },
    description: {
      en: "Living greens with drifting spores and soft glow.",
      uz: "Tirik yashillik, suzuvchi sporalar va yumshoq nur.",
      ru: "Живая зелень, плывущие споры и мягкое свечение.",
    },
    swatch:
      "radial-gradient(90% 70% at 18% 22%, rgba(34,197,94,.5), transparent 62%), radial-gradient(80% 65% at 82% 18%, rgba(163,230,53,.35), transparent 60%), linear-gradient(150deg,#04150c,#0a2416 60%,#04150c)",
    strip: "linear-gradient(135deg,#15803d,#22c55e 55%,#a3e635)",
    scene: "spores",
  },
  {
    id: "sunset",
    label: { en: "Sunset", uz: "Quyosh botishi", ru: "Закат" },
    description: {
      en: "Golden hour — warm gradients and drifting light dust.",
      uz: "Oltin soat — issiq ranglar va suzuvchi yorug‘lik changlari.",
      ru: "Золотой час — тёплые градиенты и плывущая светлая пыль.",
    },
    swatch:
      "radial-gradient(95% 75% at 18% 25%, rgba(249,115,22,.55), transparent 62%), radial-gradient(85% 70% at 85% 20%, rgba(236,72,153,.45), transparent 60%), linear-gradient(155deg,#1c0a04,#3b1407 55%,#2a0a12)",
    strip: "linear-gradient(135deg,#f97316,#ec4899 55%,#fbbf24)",
    scene: "dust",
  },
  {
    id: "winter",
    label: { en: "Winter Aurora", uz: "Qish aurorasi", ru: "Зимнее сияние" },
    description: {
      en: "Cinematic night, aurora borealis, snowfall and frosted glass.",
      uz: "Kino uslubidagi tungi osmon, aurora, qor yog‘ishi va muzdek shisha.",
      ru: "Кинематографичная ночь, северное сияние, снегопад и ледяное стекло.",
    },
    swatch:
      "radial-gradient(70% 45% at 20% -5%, rgba(104,255,210,.45), transparent 60%), radial-gradient(60% 42% at 55% -6%, rgba(93,189,255,.5), transparent 62%), radial-gradient(55% 40% at 85% -4%, rgba(139,125,255,.5), transparent 60%), linear-gradient(175deg,#061220,#0d1f3c 70%,#0a1a33)",
    strip: "linear-gradient(135deg,#5dbdff,#8b7dff)",
    scene: "aurora",
  },
  {
    id: "spring",
    label: { en: "Spring", uz: "Bahor", ru: "Весна" },
    description: {
      en: "Blossom petals, fresh greens and airy light.",
      uz: "Gul barglari, yangi yashillik va yengil nafislik.",
      ru: "Лепестки, свежая зелень и лёгкость.",
    },
    swatch:
      "radial-gradient(90% 70% at 18% 22%, rgba(16,185,129,.5), transparent 62%), radial-gradient(80% 65% at 82% 20%, rgba(244,114,182,.42), transparent 60%), linear-gradient(150deg,#06150e,#0d2418 60%,#0b1120)",
    strip: "linear-gradient(135deg,#10b981,#84cc16 55%,#f472b6)",
    scene: "petals",
  },
  {
    id: "comic",
    label: { en: "Comic", uz: "Komiks", ru: "Комикс" },
    description: {
      en: "Bold pop-art outlines, halftone dots, punchy colors.",
      uz: "Qalin pop-art konturlar, halftone nuqtalar, jo‘shqin ranglar.",
      ru: "Смелые контуры поп-арта, растровые точки, яркие цвета.",
    },
    swatch:
      "radial-gradient(90% 70% at 20% 25%, rgba(239,68,68,.5), transparent 62%), radial-gradient(80% 65% at 80% 18%, rgba(37,99,235,.5), transparent 60%), linear-gradient(150deg,#170b14,#251035 60%,#170b14)",
    strip: "linear-gradient(135deg,#ef4444,#2563eb 55%,#facc15)",
    scene: "halftone",
  },
  {
    id: "space",
    label: { en: "Space", uz: "Koinot", ru: "Космос" },
    description: {
      en: "A nebula of stars behind dark glass, mono accents.",
      uz: "Qorong‘i shisha ortida yulduzli nebula, mono shrift.",
      ru: "Туманность звёзд за тёмным стеклом, моно-акценты.",
    },
    swatch:
      "radial-gradient(95% 75% at 20% 25%, rgba(147,51,234,.55), transparent 62%), radial-gradient(85% 70% at 82% 18%, rgba(79,70,229,.5), transparent 60%), radial-gradient(60% 50% at 60% 80%, rgba(103,232,249,.25), transparent 65%), linear-gradient(155deg,#0a0618,#150b2e 60%,#0a0618)",
    strip: "linear-gradient(135deg,#7e22ce,#4f46e5 55%,#67e8f9)",
    scene: "stars",
  },
  {
    id: "travel",
    label: { en: "Travel", uz: "Sayohat", ru: "Путешествие" },
    description: {
      en: "Open skies, sun rays and a road-trip glow.",
      uz: "Ochiq osmon, quyosh nurlari va yo‘l-ta‘til shu’lasi.",
      ru: "Открытое небо, лучи солнца и дорожное сияние.",
    },
    swatch:
      "radial-gradient(95% 75% at 20% 20%, rgba(6,182,212,.5), transparent 62%), radial-gradient(80% 65% at 80% 18%, rgba(14,165,233,.45), transparent 60%), radial-gradient(60% 45% at 75% 85%, rgba(245,158,11,.35), transparent 65%), linear-gradient(155deg,#051019,#0a2233 60%,#051019)",
    strip: "linear-gradient(135deg,#06b6d4,#0ea5e9 55%,#f59e0b)",
    scene: "streaks",
  },
  {
    id: "pixel",
    label: { en: "Pixel", uz: "Pixel", ru: "Пиксель" },
    description: {
      en: "Retro grid, sharp corners, lime & violet, mono type.",
      uz: "Retro panjara, o‘tkir burchaklar, lime-binafsha, mono shrift.",
      ru: "Ретро-сетка, острые углы, лайм и фиолетовый, моно-шрифт.",
    },
    swatch:
      "linear-gradient(rgba(163,230,53,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,.18) 1px, transparent 1px), linear-gradient(155deg,#0d0918,#16102b 60%,#0d0918)",
    strip: "linear-gradient(135deg,#a3e635,#8b5cf6 55%,#facc15)",
    scene: "grid",
  },
  {
    id: "live-nebula",
    label: { en: "Live Nebula", uz: "Jonli Nebula", ru: "Живая туманность" },
    description: {
      en: "Real-time 3D nebula — deep space colors, animated particles, mouse-reactive.",
      uz: "Real vaqtda 3D nebula — chuqur kosmos ranglari, animatsiyalangan zarrachalar.",
      ru: "Реалтайм 3D туманность — глубокий космос, анимированные частицы.",
    },
    swatch:
      "radial-gradient(90% 70% at 20% 25%, rgba(147,51,234,.55), transparent 62%), radial-gradient(85% 70% at 82% 18%, rgba(79,70,229,.5), transparent 60%), radial-gradient(60% 50% at 60% 80%, rgba(103,232,249,.25), transparent 65%), linear-gradient(155deg,#0a0618,#150b2e 60%,#0a0618)",
    strip: "linear-gradient(135deg,#7e22ce,#4f46e5 55%,#67e8f9)",
    scene: "live",
  },
  {
    id: "live-aurora",
    label: { en: "Live Aurora", uz: "Jonli Aurora", ru: "Живое сияние" },
    description: {
      en: "Real-time 3D aurora borealis over snowy mountains — cinematic, parallax.",
      uz: "Real vaqtda 3D aurora — qorli tog'lar ustida kino effekti.",
      ru: "Реалтайм 3D северное сияние над заснеженными горами.",
    },
    swatch:
      "radial-gradient(70% 45% at 20% -5%, rgba(104,255,210,.45), transparent 60%), radial-gradient(60% 42% at 55% -6%, rgba(93,189,255,.5), transparent 62%), radial-gradient(55% 40% at 85% -4%, rgba(139,125,255,.5), transparent 60%), linear-gradient(175deg,#061220,#0d1f3c 70%,#0a1a33)",
    strip: "linear-gradient(135deg,#5dbdff,#8b7dff)",
    scene: "live",
  },
  {
    id: "live-ocean",
    label: { en: "Live Ocean", uz: "Jonli Okean", ru: "Живой океан" },
    description: {
      en: "Real-time 3D moonlit ocean — waves, reflections, night sky.",
      uz: "Real vaqtda 3D okean — to'lqinlar, aks ettirish, tungi osmon.",
      ru: "Реалтайм 3D лунный океан — волны, отражения, ночное небо.",
    },
    swatch:
      "radial-gradient(95% 75% at 20% 25%, rgba(34,211,238,.5), transparent 62%), radial-gradient(85% 70% at 85% 20%, rgba(37,99,235,.5), transparent 60%), linear-gradient(155deg,#04121d,#06283d 60%,#04121d)",
    strip: "linear-gradient(135deg,#0891b2,#2563eb 55%,#22d3ee)",
    scene: "live",
  },
  {
    id: "live-cyber",
    label: { en: "Live Cyberpunk", uz: "Jonli Cyberpunk", ru: "Живой киберпанк" },
    description: {
      en: "Real-time 3D cyberpunk city — neon beams, grid, particles, skyline.",
      uz: "Real vaqtda 3D cyberpunk shahar — neon nurlar, panjara, zarrachalar.",
      ru: "Реалтайм 3D киберпанк-город — неоновые лучи, сетка, частицы.",
    },
    swatch:
      "radial-gradient(90% 70% at 20% 25%, rgba(236,72,153,.5), transparent 62%), radial-gradient(80% 65% at 80% 18%, rgba(59,130,246,.5), transparent 60%), linear-gradient(155deg,#0a0015,#1a0030 60%,#0a0015)",
    strip: "linear-gradient(135deg,#ec4899,#3b82f6 55%,#06b6d4)",
    scene: "live",
  },
];

export function getTheme(id: string): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/**
 * Applies a theme preset to <html data-ordo-theme="...">.
 * Uses the View Transitions API when available so the whole design
 * crossfades smoothly; falls back to an instant swap.
 */
export function applyThemePreset(id: ThemeId) {
  if (typeof document === "undefined") return;
  const set = () => {
    document.documentElement.dataset.ordoTheme = id;
  };
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };
  if (typeof doc.startViewTransition === "function") {
    try {
      doc.startViewTransition(set);
      return;
    } catch {
      /* fall through to direct apply */
    }
  }
  set();
}
