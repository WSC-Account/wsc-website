import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("wsc-cookie-consent", JSON.stringify({
    necessary: true, analytics: false, marketing: false, timestamp: new Date().toISOString(),
  })));
});

test("a persistent route failure stops after one automatic reload", async ({ page }) => {
  let documents = 0;
  page.on("request", request => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++;
  });
  await page.route(/\/(?:src\/pages\/FAQ\.tsx|assets\/FAQ-[^/]+\.js)(?:\?.*)?$/, route => route.abort("failed"));
  await page.goto("/faq");
  await expect(page.getByRole("heading", { name: "This page couldn't load." })).toBeVisible();
  await expect.poll(() => documents).toBe(2);
  await page.waitForTimeout(500);
  expect(documents).toBe(2);
  await expect(page.getByRole("button", { name: "Reload Page" })).toBeVisible();
});

test("restricted session storage leaves manual route recovery available", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, "sessionStorage", {
    get() { throw new DOMException("Storage blocked", "SecurityError"); },
  }));
  let documents = 0;
  page.on("request", request => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++;
  });
  await page.route(/\/(?:src\/pages\/FAQ\.tsx|assets\/FAQ-[^/]+\.js)(?:\?.*)?$/, route => route.abort("failed"));
  await page.goto("/faq");
  await expect(page.getByRole("button", { name: "Reload Page" })).toBeVisible();
  expect(documents).toBe(1);
});

test("section navigation adds one history entry and Back returns home", async ({ page, isMobile }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const before = await page.evaluate(() => history.length);
  if (isMobile) {
    await nav.getByRole("button", { name: "Open navigation menu" }).click();
    await nav.getByRole("button", { name: "Show Tennis submenu" }).click();
  } else {
    await nav.getByRole("link", { name: "Tennis", exact: true }).hover();
  }
  await nav.getByRole("link", { name: "Junior Tennis", exact: true }).click();
  await expect(page).toHaveURL(/\/tennis#junior-tennis$/);
  await expect(page.locator("#junior-tennis")).toBeInViewport();
  expect(await page.evaluate(() => history.length)).toBe(before + 1);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test("hidden responsive heroes do not select a real eager image", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  const hiddenImages = await page.locator("img[loading=eager]").evaluateAll(images =>
    images.filter(image => !image.getClientRects().length).map(image => (image as HTMLImageElement).currentSrc),
  );
  expect(hiddenImages.length).toBeGreaterThan(0);
  expect(hiddenImages.every(src => src.startsWith("data:image/"))).toBe(true);
});

test("production output serves metadata, legacy redirects, and real 404 statuses", async ({ request }) => {
  const assessment = await request.get("/free-fitness-assessment");
  expect(assessment.status()).toBe(200);
  expect(await assessment.text()).toContain('rel="canonical" href="https://www.woodinvillesportsclub.com/free-fitness-assessment"');
  const redirect = await request.get("/driving-range?utm_source=audit", { maxRedirects: 0 });
  expect(redirect.status()).toBe(301);
  expect(redirect.headers().location).toBe("/golf/driving-range?utm_source=audit");
  expect((await request.get("/missing-audit-page")).status()).toBe(404);
});
