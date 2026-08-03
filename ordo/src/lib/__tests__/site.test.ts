import { afterEach, describe, expect, it } from "vitest";
import { getAppVersion, getContactEmail, getSiteUrl } from "@/lib/site";

const env = { ...process.env };

afterEach(() => {
  process.env = { ...env };
});

describe("getSiteUrl", () => {
  it("strips trailing slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://ordo.app/";
    expect(getSiteUrl()).toBe("https://ordo.app");
  });

  it("falls back to localhost", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});

describe("getContactEmail", () => {
  it("reads public contact email", () => {
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = "hi@example.com";
    expect(getContactEmail()).toBe("hi@example.com");
  });

  it("has default", () => {
    delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    delete process.env.CONTACT_EMAIL;
    expect(getContactEmail()).toContain("@");
  });
});

describe("getAppVersion", () => {
  it("returns a version string", () => {
    expect(getAppVersion().length).toBeGreaterThan(0);
  });
});
