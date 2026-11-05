import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("wsc-cookie-consent", JSON.stringify({
    necessary: true, analytics: false, marketing: false,
  })));
});

test("Contact schedule link lands at the pickleball schedule and preserves Back", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("link", { name: "See schedule", exact: true }).click();
  await expect(page).toHaveURL(/\/pickleball#open-play-schedule$/);
  await expect(page.locator("#open-play-schedule")).toBeInViewport();
  await expect(page.getByRole("heading", { name: "Fall / Winter / Spring hours." })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/contact$/);
});

test("past pickleball dates stay archived and month-only dates expire without inventing an event day", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-11-04T20:00:00Z"));
  await page.goto("/pickleball");
  const tournaments = page.locator("#pickleball-tournaments");
  const upcoming = tournaments.locator('[aria-label="Upcoming tournament dates"]');
  await expect(upcoming.getByRole("article")).toHaveCount(1);
  await expect(upcoming.getByRole("heading", { name: "Holiday Classic", exact: true })).toBeVisible();
  await expect(upcoming.getByText("Exact dates to be confirmed")).toBeVisible();
  await tournaments.locator("summary").click();
  const past = tournaments.locator("details");
  await expect(past.getByRole("article")).toHaveCount(3);
  await expect(past.getByRole("heading", { name: "Spring Fling", exact: true })).toBeVisible();
  await expect(past.getByText("Past date", { exact: true })).toHaveCount(3);

  await page.clock.setFixedTime(new Date("2027-01-01T20:00:00Z"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(upcoming.getByRole("article")).toHaveCount(0);
  await expect(upcoming.getByText(/New tournament dates have not been published/)).toBeVisible();
  await expect(past.getByRole("heading", { name: "Holiday Classic", exact: true })).toBeVisible();
  await expect(past.getByRole("article")).toHaveCount(4);
});
