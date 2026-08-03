"use client";

import { Cloud, CloudOff, Loader2, RefreshCw } from "lucide-react";
import { useSync } from "@/providers/sync-provider";
import { useUser } from "@/providers/user-provider";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function SyncIndicator({ compact = false }: { compact?: boolean }) {
  const { meta, online, isRemote, providerLabel, syncNow } = useSync();
  const { t } = useUser();
  const { toast } = useToast();

  const status = !online
    ? "offline"
    : meta.status === "syncing"
      ? "syncing"
      : meta.status === "error"
        ? "error"
        : isRemote
          ? meta.status === "synced"
            ? "synced"
            : "idle"
          : "local";

  const label =
    status === "offline"
      ? t("sync.offline")
      : status === "syncing"
        ? t("sync.syncing")
        : status === "error"
          ? t("sync.error")
          : status === "synced"
            ? t("sync.synced")
            : status === "local"
              ? t("sync.localOnly")
              : t("sync.idle");

  const Icon =
    status === "syncing"
      ? Loader2
      : status === "offline" || status === "error"
        ? CloudOff
        : Cloud;

  async function onClick() {
    if (!isRemote) {
      toast({
        title: t("sync.localOnly"),
        description: t("sync.configureHint"),
        kind: "info",
      });
      return;
    }
    if (!online) {
      toast({ title: t("sync.offline"), kind: "default" });
      return;
    }
    const m = await syncNow(false);
    toast({
      title: m.status === "synced" ? t("sync.synced") : t("sync.error"),
      description: m.lastError || providerLabel,
      kind: m.status === "synced" ? "success" : "default",
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${label} · ${providerLabel}`}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-sm)] px-2 text-xs font-medium transition-colors",
        "text-text-tertiary hover:bg-surface-2 hover:text-text-secondary",
        status === "error" && "text-danger hover:text-danger",
        status === "synced" && "text-success hover:text-success"
      )}
    >
      <Icon
        className={cn("size-3.5", status === "syncing" && "animate-spin")}
        aria-hidden="true"
      />
      {!compact && <span className="hidden md:inline">{label}</span>}
      {isRemote && status !== "syncing" && (
        <RefreshCw className="hidden size-3 opacity-50 sm:inline" />
      )}
    </button>
  );
}
