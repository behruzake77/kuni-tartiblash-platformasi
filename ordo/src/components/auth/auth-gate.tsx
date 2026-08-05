"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/providers/user-provider";

/** Client-side gate for remote auth modes.
 * Local mode remains available for the demo/local-first experience.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { ready, user, authProviderId, t } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const requiresAccount = authProviderId === "supabase" || authProviderId === "clerk";

  useEffect(() => {
    if (ready && requiresAccount && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [ready, requiresAccount, user, router, pathname]);

  if (!ready || (requiresAccount && !user)) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
        <div className="space-y-3">
          <span className="mx-auto block size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-text-tertiary">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
