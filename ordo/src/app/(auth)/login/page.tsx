"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { useUser } from "@/providers/user-provider";

export default function LoginPage() {
  const { t } = useUser();
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">
        {t("auth.welcome")}
      </h1>
      <p className="mt-2 text-sm text-text-secondary">{t("auth.welcomeSub")}</p>
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="mt-8 text-center text-sm text-text-secondary">
        {t("auth.noAccount")}{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          {t("common.getStarted")}
        </Link>
      </p>
    </div>
  );
}
