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
  clearActivity,
  loadActivity,
  pushActivity,
  type ActivityItem,
  type ActivityKind,
} from "@/lib/activity";

type ActivityContextValue = {
  items: ActivityItem[];
  log: (
    kind: ActivityKind,
    title: string,
    detail?: string
  ) => ActivityItem;
  clear: () => void;
  refresh: () => void;
};

const ActivityContext = createContext<ActivityContextValue | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ActivityItem[]>([]);

  const refresh = useCallback(() => {
    setItems(loadActivity());
  }, []);

  useEffect(() => {
    refresh();
    const onAct = (e: Event) => {
      const list = (e as CustomEvent<{ list: ActivityItem[] }>).detail?.list;
      if (list) setItems(list);
      else refresh();
    };
    window.addEventListener("ordo:activity", onAct as EventListener);
    return () =>
      window.removeEventListener("ordo:activity", onAct as EventListener);
  }, [refresh]);

  const log = useCallback(
    (kind: ActivityKind, title: string, detail?: string) => {
      return pushActivity({ kind, title, detail });
    },
    []
  );

  const clear = useCallback(() => {
    clearActivity();
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({ items, log, clear, refresh }),
    [items, log, clear, refresh]
  );

  return (
    <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider");
  return ctx;
}
