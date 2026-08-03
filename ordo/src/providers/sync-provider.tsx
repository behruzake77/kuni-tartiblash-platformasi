"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getActiveProvider,
  loadSyncMeta,
  runSync,
  setStatus,
} from "@/lib/sync/engine";
import type { SyncMeta } from "@/lib/sync/types";
import { loadDayState } from "@/lib/storage";
import { useDay } from "@/providers/day-provider";

type SyncContextValue = {
  meta: SyncMeta;
  online: boolean;
  isRemote: boolean;
  providerLabel: string;
  syncNow: (silent?: boolean) => Promise<SyncMeta>;
  refreshMeta: () => void;
};

const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const { replaceState, ready } = useDay();
  const [meta, setMeta] = useState<SyncMeta>(() => loadSyncMeta());
  const [online, setOnline] = useState(true);
  const provider = getActiveProvider();

  const refreshMeta = useCallback(() => {
    setMeta(loadSyncMeta());
  }, []);

  useEffect(() => {
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const onOnline = () => {
      setOnline(true);
      setStatus("idle");
      refreshMeta();
    };
    const onOffline = () => {
      setOnline(false);
      setStatus("offline");
      refreshMeta();
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    const onMeta = () => refreshMeta();
    window.addEventListener("ordo:sync-meta", onMeta);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("ordo:sync-meta", onMeta);
    };
  }, [refreshMeta]);

  // Apply remote day into live DayProvider
  useEffect(() => {
    const onApply = () => {
      replaceState(loadDayState());
    };
    window.addEventListener("ordo:sync-apply", onApply);
    return () => window.removeEventListener("ordo:sync-apply", onApply);
  }, [replaceState]);

  // Auto pull on mount + interval when remote configured
  useEffect(() => {
    if (!ready) return;
    if (!provider.isRemote) return;
    if (!navigator.onLine) return;

    let cancelled = false;
    (async () => {
      const m = await runSync({ direction: "both", silent: true });
      if (!cancelled) setMeta(m);
    })();

    const id = window.setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        runSync({ direction: "both", silent: true }).then(setMeta);
      }
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [ready, provider.isRemote]);

  // Debounced auto-push after local day saves (when autoSync + remote)
  useEffect(() => {
    if (!ready || !provider.isRemote) return;
    let timer: number | null = null;
    const onSaved = () => {
      try {
        const prefs = JSON.parse(
          localStorage.getItem("ordo.prefs.v1") || "{}"
        ) as { autoSync?: boolean };
        if (prefs.autoSync === false) return;
      } catch {
        /* continue */
      }
      if (!navigator.onLine) return;
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        runSync({ direction: "push", silent: true }).then(setMeta);
      }, 2500);
    };
    window.addEventListener("ordo:day-saved", onSaved);
    return () => {
      window.removeEventListener("ordo:day-saved", onSaved);
      if (timer) window.clearTimeout(timer);
    };
  }, [ready, provider.isRemote]);

  const syncNow = useCallback(async (silent = false) => {
    const m = await runSync({ direction: "both", silent });
    setMeta(m);
    // ensure day UI refresh even if apply event already fired
    replaceState(loadDayState());
    return m;
  }, [replaceState]);

  const value = useMemo(
    () => ({
      meta,
      online,
      isRemote: provider.isRemote,
      providerLabel: provider.label,
      syncNow,
      refreshMeta,
    }),
    [meta, online, provider.isRemote, provider.label, syncNow, refreshMeta]
  );

  return (
    <SyncContext.Provider value={value}>{children}</SyncContext.Provider>
  );
}

export function useSync() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error("useSync must be used within SyncProvider");
  return ctx;
}
