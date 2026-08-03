/**
 * Auth provider contract — swap Local for Clerk/Supabase without rewriting UI.
 */

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  createdAt: string;
};

export type SignInInput = {
  email: string;
  password: string;
  name?: string;
};

export type AuthProviderId = "local" | "clerk" | "supabase";

export type AuthProvider = {
  id: AuthProviderId;
  label: string;
  /** True when remote IdP is configured via env */
  isRemote: boolean;
  getSessionUser: () => Promise<AuthUser | null> | AuthUser | null;
  signIn: (input: SignInInput) => Promise<AuthUser>;
  signUp: (input: SignInInput) => Promise<AuthUser>;
  signOut: () => Promise<void> | void;
};
