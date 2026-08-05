"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { useUser } from "@/providers/user-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useUser();
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-hero lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(59,130,246,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(139,92,246,0.18), transparent 35%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <Logo href="/" size="md" />
        </div>
        <div className="relative z-10 max-w-md">
          <blockquote className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-snug tracking-tight text-text-primary">
            {t("auth.tagline")}
          </blockquote>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {t("auth.taglineBody")}
          </p>
        </div>
        <p className="relative z-10 font-[family-name:var(--font-mono)] text-xs text-text-tertiary">
          Plan · Focus · Close
        </p>
      </aside>

      <div className="flex flex-col bg-bg">
        <div className="flex min-h-16 items-center justify-between px-4 py-4 sm:px-6 lg:hidden">
          <Logo href="/" size="sm" />
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            {t("common.back")}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
