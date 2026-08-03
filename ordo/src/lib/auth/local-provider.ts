import type { AuthProvider, AuthUser, SignInInput } from "@/lib/auth/types";
import {
  clearUser,
  loadUser,
  saveUser,
  type OrdoUser,
} from "@/lib/user-storage";

function toAuth(u: OrdoUser): AuthUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt,
  };
}

/**
 * Device-local demo auth (default).
 * Passwords are NOT persisted — evaluation only.
 */
export const localAuthProvider: AuthProvider = {
  id: "local",
  label: "Local (this device)",
  isRemote: false,

  getSessionUser() {
    const u = loadUser();
    return u ? toAuth(u) : null;
  },

  async signIn(input: SignInInput) {
    const email = input.email.trim().toLowerCase();
    if (!email.includes("@") || input.password.length < 4) {
      throw new Error("INVALID_CREDENTIALS");
    }
    const existing = loadUser();
    const next: OrdoUser =
      existing && existing.email === email
        ? {
            ...existing,
            name: input.name?.trim() || existing.name,
          }
        : {
            id: `u_${Date.now().toString(36)}`,
            name:
              input.name?.trim() ||
              existing?.name ||
              email.split("@")[0] ||
              "Operator",
            email,
            createdAt: existing?.createdAt || new Date().toISOString(),
          };
    if (input.name?.trim()) next.name = input.name.trim();
    saveUser(next);
    return toAuth(next);
  },

  async signUp(input: SignInInput) {
    if (input.password.length < 8) {
      throw new Error("INVALID_CREDENTIALS");
    }
    return localAuthProvider.signIn(input);
  },

  signOut() {
    clearUser();
  },
};
