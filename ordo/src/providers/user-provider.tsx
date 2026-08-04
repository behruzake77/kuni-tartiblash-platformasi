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
import { detectLocale, t as translate, type Locale } from "@/lib/i18n";
import {
  clearUser,
  isOnboarded,
  loadPrefs,
  loadUser,
  savePrefs,
  saveUser,
  setOnboarded as persistOnboarded,
  wipeAllOrdoData,
  type OrdoPrefs,
  type OrdoUser,
} from "@/lib/user-storage";
import { getAuthProviderId, resolveAuthProvider } from "@/lib/auth";

type UserContextValue = {
  ready: boolean;
  user: OrdoUser | null;
  prefs: OrdoPrefs;
  locale: Locale;
  onboarded: boolean;
  authProviderId: string;
  authProviderLabel: string;
  t: (key: string, vars?: Record<string, string | number>) => string;
  /**
   * Sync API for forms. Uses local storage immediately when auth=local.
   * For clerk/supabase (async), call signInAsync instead.
   */
  signIn: (opts: { email: string; password: string; name?: string }) => OrdoUser;
  /** Async path for remote providers */
  signInAsync: (opts: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<OrdoUser>;
  signUpAsync: (opts: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<OrdoUser>;
  signOut: () => void;
  updateUser: (patch: Partial<Pick<OrdoUser, "name" | "email">>) => void;
  updatePrefs: (patch: Partial<OrdoPrefs>) => void;
  completeOnboarding: (opts: {
    name: string;
    locale: Locale;
    firstPriority?: string;
  }) => void;
  setOnboardedFlag: (v: boolean) => void;
  wipeAll: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

function authToOrdo(u: {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}): OrdoUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt,
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<OrdoUser | null>(null);
  const [prefs, setPrefs] = useState<OrdoPrefs>(loadPrefs());
  const [onboarded, setOnboarded] = useState(true);

  const authProviderId = getAuthProviderId();
  const authProviderLabel = resolveAuthProvider().label;

  useEffect(() => {
    const p = loadPrefs();
    if (!localStorage.getItem("ordo.prefs.v1")) {
      p.locale = detectLocale();
      savePrefs(p);
    }
    setPrefs(p);
    setOnboarded(isOnboarded());
    const provider = resolveAuthProvider();
    if (provider.isRemote) {
      void Promise.resolve(provider.getSessionUser()).then((sessionUser) => {
        if (sessionUser) {
          const next = authToOrdo(sessionUser);
          saveUser(next);
          setUser(next);
        } else {
          setUser(null);
        }
        setReady(true);
      }).catch(() => {
        setUser(null);
        setReady(true);
      });
    } else {
      setUser(loadUser());
      setReady(true);
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(prefs.locale, key, vars),
    [prefs.locale]
  );

  const signInAsync = useCallback(
    async (opts: { email: string; password: string; name?: string }) => {
      const provider = resolveAuthProvider();
      const authUser = await provider.signIn(opts);
      const next = authToOrdo(authUser);
      saveUser(next);
      setUser(next);
      return next;
    },
    []
  );

  const signUpAsync = useCallback(
    async (opts: { email: string; password: string; name?: string }) => {
      const provider = resolveAuthProvider();
      const authUser = await provider.signUp(opts);
      const next = authToOrdo(authUser);
      saveUser(next);
      setUser(next);
      return next;
    },
    []
  );

  const signIn = useCallback(
    (opts: { email: string; password: string; name?: string }) => {
      // Fast local path (default) — keeps existing forms synchronous
      if (getAuthProviderId() === "local") {
        const email = opts.email.trim().toLowerCase();
        const existing = loadUser();
        const next: OrdoUser =
          existing && existing.email === email
            ? {
                ...existing,
                name: opts.name?.trim() || existing.name,
              }
            : {
                id: `u_${Date.now().toString(36)}`,
                name:
                  opts.name?.trim() ||
                  existing?.name ||
                  email.split("@")[0] ||
                  "Operator",
                email,
                createdAt: existing?.createdAt || new Date().toISOString(),
              };
        if (opts.name?.trim()) next.name = opts.name.trim();
        saveUser(next);
        setUser(next);
        void opts.password;
        return next;
      }

      // Remote: kick off async; throw guidance if someone expected sync
      void signInAsync(opts);
      const optimistic: OrdoUser = {
        id: `pending_${Date.now().toString(36)}`,
        name: opts.name?.trim() || opts.email.split("@")[0] || "User",
        email: opts.email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
      };
      return optimistic;
    },
    [signInAsync]
  );

  const signOut = useCallback(() => {
    try {
      void resolveAuthProvider().signOut();
    } catch {
      /* ignore */
    }
    clearUser();
    setUser(null);
  }, []);

  const updateUser = useCallback(
    (patch: Partial<Pick<OrdoUser, "name" | "email">>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          ...patch,
          email: patch.email?.trim().toLowerCase() || prev.email,
          name: patch.name?.trim() || prev.name,
        };
        saveUser(next);
        return next;
      });
    },
    []
  );

  const updatePrefs = useCallback((patch: Partial<OrdoPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      savePrefs(next);
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(
    (opts: { name: string; locale: Locale; firstPriority?: string }) => {
      const name = opts.name.trim() || "Operator";
      const current = loadUser();
      const next: OrdoUser = current
        ? { ...current, name }
        : {
            id: `u_${Date.now().toString(36)}`,
            name,
            email: "you@ordo.local",
            createdAt: new Date().toISOString(),
          };
      saveUser(next);
      setUser(next);
      updatePrefs({ locale: opts.locale });
      persistOnboarded(true);
      setOnboarded(true);
      if (opts.firstPriority?.trim()) {
        window.dispatchEvent(
          new CustomEvent("ordo:onboard-priority", {
            detail: { title: opts.firstPriority.trim() },
          })
        );
      }
    },
    [updatePrefs]
  );

  const setOnboardedFlag = useCallback((v: boolean) => {
    persistOnboarded(v);
    setOnboarded(v);
  }, []);

  const wipeAll = useCallback(() => {
    wipeAllOrdoData();
    setUser(null);
    setPrefs(loadPrefs());
    setOnboarded(false);
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      ready,
      user,
      prefs,
      locale: prefs.locale,
      onboarded,
      authProviderId,
      authProviderLabel,
      t,
      signIn,
      signInAsync,
      signUpAsync,
      signOut,
      updateUser,
      updatePrefs,
      completeOnboarding,
      setOnboardedFlag,
      wipeAll,
    }),
    [
      ready,
      user,
      prefs,
      onboarded,
      authProviderId,
      authProviderLabel,
      t,
      signIn,
      signInAsync,
      signUpAsync,
      signOut,
      updateUser,
      updatePrefs,
      completeOnboarding,
      setOnboardedFlag,
      wipeAll,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
