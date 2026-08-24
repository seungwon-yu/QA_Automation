import { test, expect } from "@playwright/test";

test("player can start, jump, and expose QA state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start", exact: true }).click();

  await expect(page.locator("#state")).toHaveText("running");

  const before = await page.evaluate(() => window.__QA_AUTOMATION__.getState().player.y);
  await page.keyboard.press("Space");
  await page.waitForTimeout(120);
  const after = await page.evaluate(() => window.__QA_AUTOMATION__.getState().player.y);

  expect(after).toBeLessThan(before);
});
