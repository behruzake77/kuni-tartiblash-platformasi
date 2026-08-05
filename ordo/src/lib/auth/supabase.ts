import { createClient, type User } from "@supabase/supabase-js";
import type { AuthProvider, AuthUser, SignInInput } from "@/lib/auth/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

function configuredClient() {
  if (!supabase) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }
  return supabase;
}

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name:
      (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
      user.email?.split("@")[0] ||
      "User",
    email: user.email || "",
    imageUrl:
      typeof user.user_metadata?.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : null,
    createdAt: user.created_at,
  };
}

export const supabaseAuthProvider: AuthProvider = {
  id: "supabase",
  label: "Supabase Auth",
  isRemote: Boolean(supabase),

  async getSessionUser() {
    const client = configuredClient();
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) return null;
    return toAuthUser(data.user);
  },

  async signIn(input: SignInInput) {
    const client = configuredClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    });
    if (error || !data.user) throw new Error(error?.message || "AUTH_FAILED");
    return toAuthUser(data.user);
  },

  async signUp(input: SignInInput) {
    const client = configuredClient();
    const { data, error } = await client.auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      options: { data: { name: input.name?.trim() || "" } },
    });
    if (error || !data.user) throw new Error(error?.message || "SIGNUP_FAILED");
    return toAuthUser(data.user);
  },

  async signOut() {
    if (supabase) await supabase.auth.signOut();
  },
};
