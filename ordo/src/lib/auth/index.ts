import { localAuthProvider } from "@/lib/auth/local-provider";
import { supabaseAuthProvider } from "@/lib/auth/supabase";
import type { AuthProvider, AuthProviderId } from "@/lib/auth/types";

/**
 * Resolve active auth provider from env.
 *
 * NEXT_PUBLIC_ORDO_AUTH=local|clerk|supabase  (default: local)
 *
 * Clerk / Supabase adapters are stubs until packages + keys are added.
 * UI already goes through UserProvider → can be rewired to this module.
 */
export function getAuthProviderId(): AuthProviderId {
  const raw = (
    process.env.NEXT_PUBLIC_ORDO_AUTH ||
    process.env.ORDO_AUTH ||
    "local"
  )
    .toLowerCase()
    .trim();
  if (raw === "clerk" || raw === "supabase") return raw;
  return "local";
}

export function resolveAuthProvider(): AuthProvider {
  const id = getAuthProviderId();

  if (id === "clerk") {
    return {
      id: "clerk",
      label: "Clerk",
      isRemote: true,
      getSessionUser: async () => {
        console.warn(
          "[ordo-auth] Clerk selected but not configured. Falling back to null session. See DEPLOY.md"
        );
        return null;
      },
      signIn: async () => {
        throw new Error(
          "CLERK_NOT_CONFIGURED: Add @clerk/nextjs and keys. See DEPLOY.md"
        );
      },
      signUp: async () => {
        throw new Error(
          "CLERK_NOT_CONFIGURED: Add @clerk/nextjs and keys. See DEPLOY.md"
        );
      },
      signOut: async () => {
        /* no-op */
      },
    };
  }

  if (id === "supabase") return supabaseAuthProvider;

  return localAuthProvider;
}

export type { AuthProvider, AuthUser, SignInInput, AuthProviderId } from "@/lib/auth/types";
