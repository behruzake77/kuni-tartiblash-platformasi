"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOCALES, type Locale } from "@/lib/i18n";
import { createDefaultDay, formatFocus, todayKey } from "@/lib/day-defaults";
import { saveDayState } from "@/lib/storage";
import {
  getNotificationPermission,
  requestNotificationPermission,
  showOrdoNotification,
  type NotificationPermissionState,
} from "@/lib/notifications";
import { buildScheduleIcs, downloadTextFile } from "@/lib/export/ics";
import {
  buildDayMarkdown,
  buildWeeklyMarkdown,
} from "@/lib/export/markdown";
import { buildWeekSeries, weekSummary } from "@/lib/weekly-stats";
import { useDay } from "@/providers/day-provider";
import { useUser } from "@/providers/user-provider";
import { useSync } from "@/providers/sync-provider";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { isAdminEmail } from "@/lib/admin";
import { supabase } from "@/lib/auth/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const {
    t,
    user,
    prefs,
    updateUser,
    updatePrefs,
    signOut,
    wipeAll,
    authProviderId,
    authProviderLabel,
  } = useUser();
  const { replaceState, state } = useDay();
  const { meta, online, isRemote, providerLabel, syncNow, refreshMeta } =
    useSync();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [dayStart, setDayStart] = useState(prefs.dayStart);
  const [focusMinutes, setFocusMinutes] = useState(String(prefs.focusMinutes));
  const [maxPriorities, setMaxPriorities] = useState(
    String(prefs.maxPriorities)
  );
  const [lead, setLead] = useState(String(prefs.reminderLeadMinutes ?? 5));
  const [workspace, setWorkspace] = useState(prefs.workspaceKey || "");
  const [perm, setPerm] = useState<NotificationPermissionState>("default");
  const [health, setHealth] = useState<string>("—");

  useEffect(() => {
    setPerm(getNotificationPermission());
    fetch("/api/sync/health")
      .then((r) => r.json())
      .then((j) => setHealth(j.ok ? `ok · ${j.workspaces} ws` : "down"))
      .catch(() => setHealth("down"));
  }, []);

  function saveProfile() {
    updateUser({ name, email });
    // default workspace to email if empty
    if (!prefs.workspaceKey && email.includes("@")) {
      updatePrefs({ workspaceKey: email.trim().toLowerCase() });
      setWorkspace(email.trim().toLowerCase());
    }
    toast({ title: t("settings.saved"), kind: "success" });
  }

  async function uploadAvatar(file: File) {
    if (!supabase || !user) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      toast({ title: "Avatar yuklanmadi", description: "PNG, JPG yoki WebP va maksimal 2 MB tanlang.", kind: "default" });
      return;
    }
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, cacheControl: "3600" });
    if (error) { toast({ title: "Avatar yuklanmadi", description: error.message, kind: "default" }); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
    updateUser({ avatarUrl: data.publicUrl });
    toast({ title: "Avatar yangilandi", kind: "success" });
  }

  function saveDefaults() {
    updatePrefs({
      dayStart,
      focusMinutes: Math.max(5, Number(focusMinutes) || 45),
      maxPriorities: Math.min(5, Math.max(1, Number(maxPriorities) || 3)),
    });
    toast({ title: t("settings.saved"), kind: "success" });
  }

  function saveReminders(patch: {
    remindersEnabled?: boolean;
    inAppReminders?: boolean;
    reminderLeadMinutes?: number;
  }) {
    updatePrefs(patch);
    toast({ title: t("settings.saved"), kind: "success" });
  }

  function saveWorkspace() {
    const key = workspace.trim().toLowerCase();
    updatePrefs({
      workspaceKey: key,
      useBuiltInSync: true,
    });
    refreshMeta();
    toast({
      title: key ? t("sync.workspaceSaved") : t("settings.saved"),
      kind: "success",
    });
    // force provider re-resolve on next sync
    window.setTimeout(() => {
      if (key) syncNow(true);
    }, 100);
  }

  async function askPermission() {
    const p = await requestNotificationPermission();
    setPerm(p);
  }

  function testNotification() {
    const ok = showOrdoNotification({
      title: "Ordo",
      body: t("settings.testReminder"),
      tag: "ordo-test",
      onClickUrl: "/app",
    });
    if (ok) toast({ title: t("settings.testReminderSent"), kind: "success" });
    else {
      toast({ title: t("settings.testReminderFail"), kind: "default" });
      if (prefs.inAppReminders) {
        toast({
          title: t("reminders.upcoming"),
          description: "Deep work · 09:00",
          kind: "info",
        });
      }
    }
  }

  function exportData() {
    const blob = new Blob(
      [JSON.stringify({ user, prefs, day: state }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ordo-export-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: t("settings.exported"), kind: "success" });
  }

  function exportMd() {
    const md = buildDayMarkdown(state, { title: `Ordo — ${state.date}` });
    downloadTextFile(`ordo-day-${state.date}.md`, md, "text/markdown;charset=utf-8");
    toast({ title: t("export.done"), kind: "success" });
  }

  function exportIcs() {
    const ics = buildScheduleIcs({
      blocks: state.schedule,
      calName: `Ordo ${state.date}`,
    });
    downloadTextFile(
      `ordo-schedule-${state.date}.ics`,
      ics,
      "text/calendar;charset=utf-8"
    );
    toast({ title: t("export.done"), kind: "success" });
  }

  function exportWeek() {
    const series = buildWeekSeries(7);
    const sum = weekSummary(series);
    const md = buildWeeklyMarkdown({
      title: `Ordo weekly · ${series[0]?.date} → ${series[series.length - 1]?.date}`,
      days: series.map((s) => ({
        date: s.date,
        completion: s.completion,
        focusSec: s.focusSec,
        habits: s.habitsPct,
      })),
      notes: [
        `Avg completion ${sum.avgCompletion}%`,
        `Total focus ${formatFocus(sum.totalFocusSec)}`,
        `Closed days ${sum.closedDays}/7`,
        sum.bestDate
          ? `Best day ${sum.bestDate} (${sum.bestCompletion}%)`
          : "No best day yet",
      ],
    });
    downloadTextFile(
      `ordo-week-${todayKey()}.md`,
      md,
      "text/markdown;charset=utf-8"
    );
    toast({ title: t("export.done"), kind: "success" });
  }

  function importData(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (data.day?.version === 1) {
          saveDayState(data.day);
          replaceState(data.day);
        }
        if (data.prefs) updatePrefs(data.prefs);
        if (data.user?.email) updateUser(data.user);
        toast({ title: t("settings.imported"), kind: "success" });
      } catch {
        toast({ title: "Import amalga oshmadi", kind: "default" });
      }
    };
    reader.readAsText(file);
  }

  function resetToday() {
    const fresh = createDefaultDay();
    saveDayState(fresh);
    replaceState(fresh);
    toast({ title: t("settings.resetDone"), kind: "info" });
  }

  const permLabel =
    perm === "granted"
      ? t("settings.remindersGranted")
      : perm === "denied"
        ? t("settings.remindersDenied")
        : perm === "unsupported"
          ? t("settings.remindersUnsupported")
          : t("settings.remindersDefault");

  return (
    <AppShell title={t("nav.settings")}>
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">
          {t("settings.title")}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{t("settings.sub")}</p>
        {isAdminEmail(user?.email) && <Link href="/app/admin" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">Admin panelni ochish →</Link>}
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("settings.profile")}</CardTitle>
            <CardDescription>{t("settings.profileDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2.5 text-xs text-text-tertiary">
              Auth:{" "}
              <span className="font-medium text-text-secondary">
                {authProviderLabel}
              </span>{" "}
              <span className="font-[family-name:var(--font-mono)]">
                ({authProviderId})
              </span>
            </div>
            <div className="flex items-center gap-4 rounded-[var(--radius-md)] border border-border bg-surface-2 p-3">
              <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-brand text-sm font-bold text-white">{user?.avatarUrl ? <span className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${user.avatarUrl})` }} /> : (user?.name || "O").slice(0, 1).toUpperCase()}</span>
              <label className="cursor-pointer rounded-[var(--radius-sm)] border border-border bg-surface-1 px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-3">Avatar yuklash<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadAvatar(file); }} /></label>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="display-name">
                {t("settings.displayName")}
              </label>
              <Input
                id="display-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="email-settings">
                {t("settings.email")}
              </label>
              <Input
                id="email-settings"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button variant="primary" size="sm" onClick={saveProfile}>
              {t("common.save")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("settings.language")}</CardTitle>
            <CardDescription>{t("settings.languageDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-3">
            {LOCALES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  updatePrefs({ locale: l.id as Locale });
                  toast({ title: t("settings.saved"), kind: "success" });
                }}
                className={cn(
                  "rounded-[var(--radius-md)] border px-3 py-3 text-left text-sm transition-colors",
                  prefs.locale === l.id
                    ? "border-primary bg-primary-subtle text-primary"
                    : "border-border bg-surface-2 text-text-secondary hover:border-border-strong"
                )}
              >
                <span className="block font-medium">{l.native}</span>
                <span className="text-xs opacity-70">{l.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("settings.themeTitle")}</CardTitle>
            <CardDescription>{t("settings.themeDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {THEMES.map((th) => {
              const selected = prefs.themePreset === th.id;
              const themeToast =
                prefs.locale === "uz"
                  ? "Dizayn yangilandi"
                  : prefs.locale === "ru"
                    ? "Тема обновлена"
                    : "Theme updated";
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    updatePrefs({ themePreset: th.id });
                    toast({
                      title: themeToast,
                      description: th.label[prefs.locale],
                      kind: "success",
                    });
                  }}
                  aria-pressed={selected}
                  className={cn(
                    "group relative overflow-hidden rounded-[var(--radius-md)] border p-0 text-left transition-all duration-[var(--duration-base)] ease-[var(--ease-soft)]",
                    selected
                      ? "border-primary ring-2 ring-primary/25"
                      : "border-border hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg"
                  )}
                >
                  <span
                    className="block h-14 w-full"
                    style={{ background: th.swatch }}
                    aria-hidden="true"
                  >
                    <span
                      className="block h-1.5 w-full"
                      style={{ background: th.strip }}
                    />
                  </span>
                  <span className="block p-2">
                    <span
                      className={cn(
                        "block text-xs font-semibold",
                        selected ? "text-primary" : "text-text-primary"
                      )}
                    >
                      {th.label[prefs.locale]}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-text-tertiary">
                      {th.description[prefs.locale]}
                    </span>
                  </span>
                  {selected && (
                    <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-primary text-white shadow-sm">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("sync.title")}</CardTitle>
            <CardDescription>{t("sync.sub")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="workspace">
                {t("sync.workspace")}
              </label>
              <p className="text-xs text-text-tertiary">
                {t("sync.workspaceDesc")}
              </p>
              <Input
                id="workspace"
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                placeholder={t("sync.workspacePh")}
              />
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={prefs.useBuiltInSync !== false}
                onChange={(e) =>
                  updatePrefs({ useBuiltInSync: e.target.checked })
                }
                className="size-4 accent-[var(--color-primary)]"
              />
              {t("sync.useBuiltIn")}
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={prefs.autoSync !== false}
                onChange={(e) => updatePrefs({ autoSync: e.target.checked })}
                className="size-4 accent-[var(--color-primary)]"
              />
              {t("sync.auto")}
            </label>
            <Button variant="secondary" size="sm" onClick={saveWorkspace}>
              {t("common.save")}
            </Button>

            <div className="grid gap-2 rounded-[var(--radius-md)] border border-border bg-surface-2 p-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-text-tertiary">{t("sync.provider")}</span>
                <span className="font-medium text-text-primary">
                  {providerLabel}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-text-tertiary">{t("sync.health")}</span>
                <span className="font-[family-name:var(--font-mono)] text-xs text-text-secondary">
                  {health}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-text-tertiary">{t("sync.device")}</span>
                <span className="max-w-[55%] truncate font-[family-name:var(--font-mono)] text-xs text-text-secondary">
                  {meta.deviceId}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-text-tertiary">{t("sync.lastPull")}</span>
                <span className="text-text-secondary">
                  {meta.lastPulledAt
                    ? new Date(meta.lastPulledAt).toLocaleString()
                    : t("sync.never")}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-text-tertiary">{t("sync.lastPush")}</span>
                <span className="text-text-secondary">
                  {meta.lastPushedAt
                    ? new Date(meta.lastPushedAt).toLocaleString()
                    : t("sync.never")}
                </span>
              </div>
              {!online && (
                <p className="text-xs text-warning">{t("sync.offline")}</p>
              )}
              {meta.lastError && (
                <p className="text-xs text-danger">{meta.lastError}</p>
              )}
              {!isRemote && (
                <p className="text-xs text-text-tertiary">
                  {t("sync.configureHint")}
                </p>
              )}
            </div>
            <Button
              variant="gradient"
              size="sm"
              disabled={!isRemote || !online || meta.status === "syncing"}
              onClick={async () => {
                const m = await syncNow(false);
                toast({
                  title:
                    m.status === "synced" ? t("sync.synced") : t("sync.error"),
                  description: m.lastError || providerLabel,
                  kind: m.status === "synced" ? "success" : "default",
                });
              }}
            >
              {meta.status === "syncing" ? t("sync.syncing") : t("sync.now")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("settings.reminders")}</CardTitle>
            <CardDescription>{t("settings.remindersDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={prefs.remindersEnabled}
                onChange={(e) =>
                  saveReminders({ remindersEnabled: e.target.checked })
                }
                className="size-4 accent-[var(--color-primary)]"
              />
              {t("settings.remindersEnable")}
            </label>
            <label className="flex items-center gap-3 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={prefs.inAppReminders}
                onChange={(e) =>
                  saveReminders({ inAppReminders: e.target.checked })
                }
                className="size-4 accent-[var(--color-primary)]"
              />
              {t("settings.remindersInApp")}
            </label>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="lead">
                {t("settings.remindersLead")}
              </label>
              <Input
                id="lead"
                type="number"
                min={0}
                max={60}
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                onBlur={() =>
                  saveReminders({
                    reminderLeadMinutes: Math.min(
                      60,
                      Math.max(0, Number(lead) || 0)
                    ),
                  })
                }
              />
            </div>
            <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2.5 text-sm">
              <p className="text-text-tertiary">
                {t("settings.remindersPermission")}
              </p>
              <p className="mt-1 font-medium text-text-primary">{permLabel}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {perm !== "granted" && perm !== "unsupported" && (
                <Button variant="secondary" size="sm" onClick={askPermission}>
                  {t("settings.remindersRequest")}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={testNotification}>
                {t("settings.testReminder")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("export.section")}</CardTitle>
            <CardDescription>{t("export.sectionDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:flex sm:flex-wrap">
            <Button variant="secondary" size="md" className="w-full sm:w-auto" onClick={exportMd}>
              {t("export.dayMd")}
            </Button>
            <Button variant="secondary" size="md" className="w-full sm:w-auto" onClick={exportIcs}>
              {t("export.scheduleIcs")}
            </Button>
            <Button variant="secondary" size="md" className="w-full sm:w-auto" onClick={exportWeek}>
              {t("export.weekMd")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("settings.dayDefaults")}</CardTitle>
            <CardDescription>{t("settings.dayDefaultsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="day-start">
                {t("settings.dayStart")}
              </label>
              <Input
                id="day-start"
                type="text"
                inputMode="numeric"
                pattern="^([01]\d|2[0-3]):[0-5]\d$"
                placeholder="08:00"
                value={dayStart}
                onChange={(e) => setDayStart(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="focus-default">
                {t("settings.focusDefault")}
              </label>
              <Input
                id="focus-default"
                type="number"
                min={5}
                value={focusMinutes}
                onChange={(e) => setFocusMinutes(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="priority-cap">
                {t("settings.priorityCap")}
              </label>
              <Input
                id="priority-cap"
                type="number"
                min={1}
                max={5}
                value={maxPriorities}
                onChange={(e) => setMaxPriorities(e.target.value)}
              />
            </div>
            <Button variant="secondary" size="sm" onClick={saveDefaults}>
              {t("settings.updateDefaults")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("shortcuts.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 font-[family-name:var(--font-mono)] text-sm text-text-secondary">
            <p>
              <kbd className="rounded border border-border bg-surface-3 px-1.5 py-0.5 text-xs">
                ⌘K
              </kbd>{" "}
              {t("shortcuts.cmdk")}
            </p>
            <p>
              <kbd className="rounded border border-border bg-surface-3 px-1.5 py-0.5 text-xs">
                g
              </kbd>{" "}
              {t("shortcuts.goto")}
            </p>
            <p>
              <kbd className="rounded border border-border bg-surface-3 px-1.5 py-0.5 text-xs">
                n
              </kbd>{" "}
              {t("shortcuts.newTask")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("settings.data")}</CardTitle>
            <CardDescription>{t("settings.dataDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={exportData}>
              {t("settings.export")}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              {t("settings.import")}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importData(f);
              }}
            />
            <Button variant="outline" size="sm" onClick={resetToday}>
              {t("settings.resetDay")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-danger">
              {t("settings.danger")}
            </CardTitle>
            <CardDescription>{t("settings.dangerDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                signOut();
                toast({ title: t("settings.signedOut"), kind: "info" });
                router.push("/login");
              }}
            >
              {t("common.signOut")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (
                  confirm(
                    "Wipe all Ordo data on this device? This cannot be undone."
                  )
                ) {
                  wipeAll();
                  replaceState(createDefaultDay());
                  toast({ title: t("settings.wiped"), kind: "default" });
                  router.push("/");
                }
              }}
            >
              {t("settings.wipe")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
