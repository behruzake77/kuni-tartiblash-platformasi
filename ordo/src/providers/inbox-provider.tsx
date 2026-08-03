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
  clearInbox,
  loadInbox,
  markInboxRead,
  pushInbox,
  unreadCount,
  type InboxItem,
} from "@/lib/inbox";

type InboxContextValue = {
  items: InboxItem[];
  unread: number;
  notify: (opts: {
    title: string;
    body?: string;
    href?: string;
    kind?: InboxItem["kind"];
  }) => InboxItem;
  markRead: (id?: string) => void;
  clear: () => void;
  refresh: () => void;
};

const InboxContext = createContext<InboxContextValue | null>(null);

export function InboxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InboxItem[]>([]);

  const refresh = useCallback(() => setItems(loadInbox()), []);

  useEffect(() => {
    refresh();
    const onInbox = (e: Event) => {
      const list = (e as CustomEvent<{ list: InboxItem[] }>).detail?.list;
      if (list) setItems(list);
      else refresh();
    };
    window.addEventListener("ordo:inbox", onInbox as EventListener);
    return () =>
      window.removeEventListener("ordo:inbox", onInbox as EventListener);
  }, [refresh]);

  const notify = useCallback(
    (opts: {
      title: string;
      body?: string;
      href?: string;
      kind?: InboxItem["kind"];
    }) => {
      return pushInbox({
        title: opts.title,
        body: opts.body,
        href: opts.href,
        kind: opts.kind || "info",
      });
    },
    []
  );

  const markRead = useCallback((id?: string) => {
    setItems(markInboxRead(id));
  }, []);

  const clear = useCallback(() => {
    clearInbox();
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      unread: unreadCount(items),
      notify,
      markRead,
      clear,
      refresh,
    }),
    [items, notify, markRead, clear, refresh]
  );

  return (
    <InboxContext.Provider value={value}>{children}</InboxContext.Provider>
  );
}

export function useInbox() {
  const ctx = useContext(InboxContext);
  if (!ctx) throw new Error("useInbox must be used within InboxProvider");
  return ctx;
}
