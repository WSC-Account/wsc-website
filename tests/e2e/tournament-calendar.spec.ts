import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("wsc-cookie-consent", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
  });
});

test("verified winter dates expire while the archive remains available", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-11-04T20:00:00Z"));
  await page.goto("/golf/tournaments");
  const finder = page.locator("#upcoming-tournaments");
  await expect(finder.getByRole("article")).toHaveCount(2);
  const turkeyShoot = finder.getByRole("article").filter({ has: page.getByRole("heading", { name: "WJGA Turkey Shoot", exact: true }) });
  await expect(turkeyShoot.getByText("High Cedars GC", { exact: true })).toBeVisible();
  await expect(turkeyShoot.getByText("Registration portal coming soon.", { exact: false })).toBeVisible();
  await expect(turkeyShoot.getByText("Ages unconfirmed", { exact: true })).toBeVisible();
  await expect(turkeyShoot.getByRole("link", { name: "Check live source" })).toHaveAttribute("href", "https://www.wjga.net/tournaments/complete-wjga-schedule/");

  // Re-evaluate an already open page after each published event date passes.
  await page.clock.setFixedTime(new Date("2026-11-12T20:00:00Z"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(finder.getByRole("article")).toHaveCount(1);
  const winterClassic = finder.getByRole("article").filter({ has: page.getByRole("heading", { name: "WJGA Winter Classic", exact: true }) });
  await expect(winterClassic.getByText("Riverbend GC", { exact: true })).toBeVisible();
  await page.clock.setFixedTime(new Date("2026-12-22T20:00:00Z"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(finder.getByRole("heading", { name: "No upcoming matches yet." })).toBeVisible();
  await expect(finder.getByRole("article")).toHaveCount(0);

  await finder.locator("summary").click();
  const pastTournament = finder.getByRole("article").filter({
    has: page.getByRole("heading", { name: "WJGA State Match Play", exact: true }),
  });
  await expect(pastTournament.getByText("Past", { exact: true })).toBeVisible();
});

test("younger age filters retain the WJGA district and state pathway", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-06-20T19:00:00Z"));
  await page.goto("/golf/tournaments");
  const fullSchedule = page.locator("#full-schedule");
  await fullSchedule.locator("summary").click();

  for (const age of ["8-11", "12-13"]) {
    await page.getByLabel("Age", { exact: true }).selectOption(age);
    await expect(fullSchedule.getByRole("article").filter({ hasText: /WJGA District [126]|WJGA State Championship/ })).toHaveCount(13);
    await expect(fullSchedule.getByRole("heading", { name: "WJGA State Championship", exact: true })).toBeVisible();
    await expect(fullSchedule.getByRole("heading", { name: "WJGA State Match Play", exact: true })).toHaveCount(0);
    await expect(fullSchedule.getByRole("heading", { name: "U.S. Junior Amateur Qualifying", exact: true })).toHaveCount(0);
  }
});

test("unconfirmed ages stay discoverable without being advertised as eligible", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-11-04T20:00:00Z"));
  await page.goto("/golf/tournaments");
  const finder = page.locator("#upcoming-tournaments");
  await page.getByLabel("Age", { exact: true }).selectOption("14-18");
  await expect(finder.getByRole("article")).toHaveCount(0);
  await page.getByLabel("Age", { exact: true }).selectOption("all");
  await expect(finder.getByRole("article")).toHaveCount(2);
  await expect(finder.getByText("Ages unconfirmed", { exact: true })).toHaveCount(2);
});
