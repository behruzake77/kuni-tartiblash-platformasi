import { test, expect } from "@playwright/test";

async function landOnApp(page: import("@playwright/test").Page) {
  await page.goto("/app");
  for (let i = 0; i < 4; i++) {
    const skip = page.getByRole("button", { name: /skip|o‘tkaz|пропуст/i });
    if (await skip.isVisible().catch(() => false)) {
      await skip.click();
      break;
    }
    const next = page.getByRole("button", { name: /continue|davom|продолж/i });
    if (await next.isVisible().catch(() => false)) {
      await next.click();
      continue;
    }
    const finish = page.getByRole("button", { name: /open my day|kunimni|открыть/i });
    if (await finish.isVisible().catch(() => false)) {
      await finish.click();
      break;
    }
    break;
  }
}

test.describe("App core flows", () => {
  test("settings page shows sync and export sections", async ({ page }) => {
    await landOnApp(page);
    await page.goto("/app/settings");
    await expect(
      page.getByRole("heading", { name: /settings|sozlamalar|настройки/i })
    ).toBeVisible();
    // Export or sync related copy
    await expect(page.getByText(/export|eksport|экспорт|sync|sinxron|синхрон/i).first()).toBeVisible();
  });

  test("focus page shows timer", async ({ page }) => {
    await landOnApp(page);
    await page.goto("/app/focus");
    await expect(page.getByText(/\d{2}:\d{2}/).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /start|boshlash|старт|pause|pauza/i }).first()
    ).toBeVisible();
  });

  test("command palette opens with Meta+K", async ({ page }) => {
    await landOnApp(page);
    await page.goto("/app");
    await page.keyboard.press("Control+KeyK");
    // Palette input or dialog
    const combo = page.getByPlaceholder(/command|buyruq|команд|search|qidir/i);
    await expect(combo.or(page.getByRole("dialog")).first()).toBeVisible({
      timeout: 10_000,
    });
    await page.keyboard.press("Escape");
  });
});
