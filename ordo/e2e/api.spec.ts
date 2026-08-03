import { test, expect } from "@playwright/test";

/**
 * API-level smoke tests — no full browser chrome required for assertions.
 * Useful in constrained CI images; browser specs need Playwright OS deps.
 */
test.describe("API smoke", () => {
  test("GET /api/health", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.service).toBe("ordo");
    expect(json.auth).toBeTruthy();
    expect(json.sync).toBeTruthy();
  });

  test("GET /api/sync/health", async ({ request }) => {
    const res = await request.get("/api/sync/health");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.service).toBe("ordo-sync");
  });

  test("GET /api/sync/state without workspace returns 404 or payload", async ({
    request,
  }) => {
    const res = await request.get("/api/sync/state?workspace=e2e-missing");
    expect([200, 404]).toContain(res.status());
  });

  test("PUT then GET sync roundtrip", async ({ request }) => {
    const workspace = `e2e-${Date.now()}`;
    const payload = {
      version: 1 as const,
      updatedAt: new Date().toISOString(),
      deviceId: "e2e-device",
      user: null,
      prefs: {
        locale: "en",
        dayStart: "08:00",
        focusMinutes: 45,
        maxPriorities: 3,
        reminderLeadMinutes: 5,
        remindersEnabled: true,
        inAppReminders: true,
        workspaceKey: workspace,
        useBuiltInSync: true,
        autoSync: true,
      },
      day: {
        version: 1 as const,
        date: "2026-08-03",
        tasks: [],
        habits: [],
        schedule: [],
        focusSessions: [],
        focusSecondsToday: 0,
        review: {
          date: "2026-08-03",
          wins: "",
          slipped: "",
          tomorrow: "",
          energy: null,
          closedAt: null,
        },
        updatedAt: new Date().toISOString(),
      },
    };

    const put = await request.put("/api/sync/state", {
      data: { ...payload, workspace },
      headers: { "x-ordo-workspace": workspace },
    });
    expect(put.ok()).toBeTruthy();

    const get = await request.get(
      `/api/sync/state?workspace=${encodeURIComponent(workspace)}`,
      { headers: { "x-ordo-workspace": workspace } }
    );
    expect(get.ok()).toBeTruthy();
    const body = await get.json();
    expect(body.version).toBe(1);
    expect(body.day.date).toBe("2026-08-03");
    expect(body.deviceId).toBe("e2e-device");
  });

  test("marketing HTML responds", async ({ request }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html.length).toBeGreaterThan(500);
    expect(html.toLowerCase()).toContain("ordo");
  });

  test("security headers present on home", async ({ request }) => {
    const res = await request.get("/");
    const headers = res.headers();
    expect(headers["x-content-type-options"] || "").toMatch(/nosniff/i);
    expect(headers["x-frame-options"] || "").toBeTruthy();
    expect(headers["content-security-policy"] || "").toContain("default-src");
  });

  test("robots and sitemap", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    const rtext = await robots.text();
    expect(rtext).toMatch(/disallow/i);

    const sm = await request.get("/sitemap.xml");
    expect(sm.ok()).toBeTruthy();
    const stext = await sm.text();
    expect(stext).toContain("urlset");
  });
});
