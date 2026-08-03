"use client";

import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { useUser } from "@/providers/user-provider";

export default function SignupPage() {
  const { t } = useUser();
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary">
        {t("auth.create")}
      </h1>
      <p className="mt-2 text-sm text-text-secondary">{t("auth.createSub")}</p>
      <div className="mt-8">
        <SignupForm />
      </div>
      <p className="mt-8 text-center text-sm text-text-secondary">
        {t("auth.hasAccount")}{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          {t("common.signIn")}
        </Link>
      </p>
    </div>
  );
}
