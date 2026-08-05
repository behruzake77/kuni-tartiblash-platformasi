"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/user-provider";

export function SignupForm() {
  const router = useRouter();
  const { t, signUpAsync, setOnboardedFlag, authProviderId } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    try {
      if (!email.includes("@") || password.length < 8) {
        throw new Error("INVALID");
      }
      await signUpAsync({ email, password, name });
      setOnboardedFlag(false);
      router.push("/app");
    } catch {
      setError(t("auth.invalid"));
    } finally {
      setLoading(false);
    }
  }

  async function demoSignUp() {
    setLoading(true);
    setError(null);
    try {
      await signUpAsync({
        email: "demo@ordo.app",
        password: "demo-demo",
        name: "Demo Operator",
      });
      setOnboardedFlag(false);
      router.push("/app");
    } catch {
      setError(t("auth.invalid"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <p className="rounded-[var(--radius-sm)] border border-border bg-surface-2 px-3 py-2 text-xs text-text-tertiary">
        {authProviderId === "local"
          ? t("auth.demoHint")
          : `Auth provider: ${authProviderId}`}
      </p>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-sm font-medium tracking-[var(--tracking-wider)] text-text-primary"
        >
          {t("auth.name")}
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Ada Lovelace"
          leftIcon={<User aria-hidden="true" />}
          animated
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium tracking-[var(--tracking-wider)] text-text-primary"
        >
          {t("auth.email")}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          leftIcon={<Mail aria-hidden="true" />}
          animated
          error={Boolean(error)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium tracking-[var(--tracking-wider)] text-text-primary"
        >
          {t("auth.password")}
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="••••••••"
          leftIcon={<Lock aria-hidden="true" />}
          animated
          error={Boolean(error)}
        />
        <p className="text-xs text-text-tertiary">{t("auth.passwordHint")}</p>
      </div>

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        loading={loading}
        className="mt-2 w-full"
      >
        {t("auth.createWs")}
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-bg px-2 text-text-tertiary">{t("common.or")}</span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        loading={loading}
        onClick={demoSignUp}
      >
        {t("auth.google")}
      </Button>

      <p className="text-center text-xs leading-relaxed text-text-tertiary">
        {t("auth.terms")}
      </p>
    </form>
  );
}
