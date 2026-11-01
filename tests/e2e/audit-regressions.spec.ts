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

test("homepage loads its collage with one high-priority tennis image and no hidden eager downloads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  const hero = page.locator(".home-hero");
  const collageImages = hero.locator(".home-hero-collage img");
  await expect(collageImages).toHaveCount(7);
  const heroImage = hero.locator(".home-hero-collage img[loading=eager]");
  await expect(heroImage).toHaveCount(1);
  await expect(hero.locator('img[fetchpriority="high"]')).toHaveCount(1);
  await expect(heroImage).toBeVisible();
  await expect(heroImage).toHaveAttribute("alt", /tennis.*Woodinville Sports Club/i);
  await expect(heroImage).toHaveAttribute("loading", "eager");
  await expect(heroImage).toHaveAttribute("fetchpriority", "high");
  await expect.poll(() => heroImage.evaluate(image => {
    const hero = image as HTMLImageElement;
    return hero.complete && hero.naturalWidth > 1 && /^https?:/.test(hero.currentSrc);
  })).toBe(true);

  for (const image of await collageImages.all()) {
    await expect(image).toBeVisible();
  }
  await expect.poll(() => collageImages.evaluateAll(images =>
    images.every(image => {
      const img = image as HTMLImageElement;
      return img.complete && img.naturalWidth > 1 && /^https?:/.test(img.currentSrc);
    }),
  )).toBe(true);

  const adultTennis = hero.getByRole("link", { name: "Adult Tennis", exact: true });
  const juniorTennis = hero.getByRole("link", { name: "Junior Tennis", exact: true });
  await expect(adultTennis).toBeVisible();
  await expect(adultTennis).toHaveAttribute("href", "/tennis/adult");
  await expect(juniorTennis).toBeVisible();
  await expect(juniorTennis).toHaveAttribute("href", "/tennis#junior-tennis");

  const hiddenRealImages = await page.locator("img[loading=eager]").evaluateAll(images =>
    images.filter(image => {
      const style = getComputedStyle(image);
      const hidden = !image.getClientRects().length || style.visibility === "hidden";
      return hidden && /^https?:/.test((image as HTMLImageElement).currentSrc);
    }).map(image => (image as HTMLImageElement).currentSrc),
  );
  expect(hiddenRealImages).toEqual([]);
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
