import { expect, test } from "@playwright/test";

const portal =
  "https://book.woodinvillesportsclub.com/Online/Portal/Index/6689";

test.describe("homepage without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps the current tennis hero and usable navigation and booking", async ({
    page,
    context,
  }) => {
    await context.route("https://book.woodinvillesportsclub.com/**", route =>
      route.fulfill({
        contentType: "text/html",
        body: "<h1>Booking destination</h1>",
      })
    );
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /Train in\s*Woodinville\./
    );
    await expect(page.locator(".home-hero-collage img")).toHaveCount(7);
    await expect(
      page.locator('.home-hero img[fetchpriority="high"]')
    ).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: "Adult Tennis", exact: true })
    ).toHaveAttribute("href", "/tennis/adult");
    await expect(
      page.getByRole("link", { name: "Junior Tennis", exact: true })
    ).toHaveAttribute("href", "/tennis#junior-tennis");
    await expect(page.locator('link[rel="stylesheet"]')).not.toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1
      )
    ).toBe(true);

    const [booking] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "Book / Register", exact: true }).click(),
    ]);
    await expect(booking).toHaveURL(portal);
    await booking.close();
    await page
      .getByRole("navigation", { name: "Explore the club" })
      .getByRole("link", { name: "Membership", exact: true })
      .click();
    await expect(page).toHaveURL(/\/membership$/);
  });
});

test("failed application scripts leave useful initial HTML and the correct image preload", async ({
  page,
}) => {
  await page.route("**/*.js", route => route.abort("failed"));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Train in\s*Woodinville\./
  );
  await expect(
    page.getByRole("link", { name: "Adult Tennis", exact: true })
  ).toBeVisible();
  const preloads = page.locator('head link[rel="preload"][as="image"]');
  await expect(preloads).toHaveCount(1);
  await expect(preloads).toHaveAttribute(
    "imagesrcset",
    /tennis-junior-backhand/
  );
  await expect(preloads).toHaveAttribute(
    "imagesizes",
    "(min-width: 1024px) 42vw, 50vw"
  );
  await expect(page.locator('link[rel="stylesheet"]')).not.toHaveCount(0);
});

test("homepage Tier 1 Tennis action leads directly to tennis", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Explore Tier 1 Tennis", exact: true })
  ).toHaveAttribute("href", "https://www.tier1nw.com/tennis");
});
