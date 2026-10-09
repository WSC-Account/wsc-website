import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("wsc-cookie-consent", JSON.stringify({
    necessary: true, analytics: false, marketing: false,
  })));
});

test("switching back to Club Policies keeps the tab controls and reading position", async ({ page }) => {
  await page.goto("/policies#terms");
  const clubPolicies = page.getByRole("button", { name: "Club Policies", exact: true });
  await expect(page.getByRole("button", { name: "Terms of Service", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.evaluate(() => window.scrollTo(0, 550));
  const before = await page.evaluate(() => window.scrollY);
  expect(before).toBeGreaterThan(100);
  await clubPolicies.click();
  await expect(page).toHaveURL(/\/policies$/);
  await expect(clubPolicies).toHaveAttribute("aria-pressed", "true");
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(5);
});

test("duplicate history and hash events preserve a required cross-route top reset", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/policies");
  await expect(page.getByRole("button", { name: "Club Policies", exact: true })).toBeVisible();
  await page.evaluate(() => {
    window.scrollTo(0, 650);
    history.pushState(null, "", "/contact");
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { level: 1, name: "Get in Touch." })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});
