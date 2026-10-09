import { expect, test } from "@playwright/test";

test("expired tournaments leave upcoming cards and remain available in the full schedule", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-07T19:00:00Z"));
  await page.addInitScript(() => {
    localStorage.setItem("wsc-cookie-consent", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
  });
  await page.goto("/golf/tournaments");
  const finder = page.locator("#upcoming-tournaments");
  await expect(finder.getByRole("article")).toHaveCount(1);
  await expect(finder.getByRole("heading", { name: "WJGA Turkey Shoot", exact: true })).toBeVisible();

  // Re-evaluate an already open page after the last placeholder date has passed.
  await page.clock.setFixedTime(new Date("2026-11-12T20:00:00Z"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(finder.getByRole("heading", { name: "No upcoming matches yet." })).toBeVisible();
  await expect(finder.getByRole("article")).toHaveCount(0);

  await finder.locator("summary").click();
  const pastTournament = finder.getByRole("article").filter({
    has: page.getByRole("heading", { name: "WJGA State Match Play", exact: true }),
  });
  await expect(pastTournament.getByText("Completed", { exact: true })).toBeVisible();
});
