import { test, expect } from "@playwright/test";

test.describe("Ordo smoke", () => {
  test("marketing home renders hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /start free|bepul|начать/i }).first()).toBeVisible();
  });

  test("health API is ok", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.service).toBe("ordo");
  });

  test("privacy and terms are reachable", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /privacy/i })).toBeVisible();
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: /terms/i })).toBeVisible();
  });

  test("login page shows demo form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in|kirish|войти/i })).toBeVisible();
  });

  test("can open app today board (skip onboard if present)", async ({ page }) => {
    await page.goto("/app");
    // Onboarding gate may appear for first visit
    const skip = page.getByRole("button", { name: /skip|o‘tkaz|пропуст/i });
    if (await skip.isVisible().catch(() => false)) {
      await skip.click();
    }
    // Finish button on last step if needed
    const finish = page.getByRole("button", { name: /open my day|kunimni|открыть/i });
    if (await finish.isVisible().catch(() => false)) {
      await finish.click();
    }
    // Continue through steps if still onboarding
    for (let i = 0; i < 3; i++) {
      const next = page.getByRole("button", { name: /continue|davom|продолж/i });
      if (await next.isVisible().catch(() => false)) {
        await next.click();
      }
    }
    if (await finish.isVisible().catch(() => false)) {
      await finish.click();
    }

    await expect(page).toHaveURL(/\/app/);
    // Today shell title or greeting area
    await expect(
      page.getByRole("heading", { name: /today|bugun|сегодня|here's your day|kuningiz|ваш день/i }).first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test("button gallery loads", async ({ page }) => {
    await page.goto("/ui");
    await expect(page.getByRole("heading", { name: /buttons/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /get started|default|primary/i }).first()).toBeVisible();
  });

  test("404 page", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-ordo");
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByRole("link", { name: /go home|today/i }).first()).toBeVisible();
  });
});
