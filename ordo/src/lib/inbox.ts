/** In-app notification inbox */

export type InboxItem = {
  id: string;
  title: string;
  body?: string;
  href?: string;
  read: boolean;
  at: string;
  kind: "reminder" | "system" | "sync" | "info";
};

const KEY = "ordo.inbox.v1";
const MAX = 100;

function canStore() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadInbox(): InboxItem[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InboxItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInbox(items: InboxItem[]) {
  if (!canStore()) return;
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
}

export function pushInbox(
  item: Omit<InboxItem, "id" | "at" | "read"> & { read?: boolean; at?: string }
): InboxItem {
  const full: InboxItem = {
    id: `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    at: item.at || new Date().toISOString(),
    read: item.read ?? false,
    title: item.title,
    body: item.body,
    href: item.href,
    kind: item.kind,
  };
  const next = [full, ...loadInbox()].slice(0, MAX);
  saveInbox(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("ordo:inbox", { detail: { item: full, list: next } })
    );
  }
  return full;
}

export function markInboxRead(id?: string) {
  const list = loadInbox().map((n) =>
    !id || n.id === id ? { ...n, read: true } : n
  );
  saveInbox(list);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("ordo:inbox", { detail: { item: null, list } })
    );
  }
  return list;
}

export function clearInbox() {
  saveInbox([]);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("ordo:inbox", { detail: { item: null, list: [] } })
    );
  }
}

export function unreadCount(list?: InboxItem[]) {
  return (list || loadInbox()).filter((n) => !n.read).length;
}
