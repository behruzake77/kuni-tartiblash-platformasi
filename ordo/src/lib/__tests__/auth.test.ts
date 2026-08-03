import { describe, expect, it } from "vitest";
import { getAuthProviderId, resolveAuthProvider } from "@/lib/auth";

describe("auth provider resolution", () => {
  it("defaults to local", () => {
    expect(getAuthProviderId()).toBe("local");
    const p = resolveAuthProvider();
    expect(p.id).toBe("local");
    expect(p.isRemote).toBe(false);
  });

  it("local provider rejects short passwords", async () => {
    const p = resolveAuthProvider();
    await expect(
      p.signIn({ email: "a@b.com", password: "12" })
    ).rejects.toThrow(/INVALID/);
  });

  it("local provider accepts valid credentials", async () => {
    const p = resolveAuthProvider();
    const user = await p.signIn({
      email: "test@ordo.app",
      password: "secret12",
      name: "Tester",
    });
    expect(user.email).toBe("test@ordo.app");
    expect(user.name).toBe("Tester");
    expect(user.id).toBeTruthy();
  });
});
