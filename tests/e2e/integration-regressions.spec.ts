import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "wsc-cookie-consent",
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );
  });
});

test("Fall 1 registration rolls forward on an open page and retires summer links", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-08-24T19:00:00Z"));
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Fall 1 Registration Is Open",
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Register for Fall 1", exact: true })
  ).toBeVisible();
  await expect(page.locator('nav a[href="/summer"]')).toHaveCount(1);

  await page.clock.setFixedTime(new Date("2026-09-25T19:00:00Z"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(
    page.getByRole("heading", {
      name: "Fall 2 Registration Is Open",
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Register for Fall 2", exact: true })
  ).toHaveAttribute(
    "href",
    "https://app.courtreserve.com/Online/Portal/Index/6689"
  );
  await expect(
    page.locator(
      'nav a[href="/summer"], nav a[href="/tennis/summer-tennis"], footer a[href="/summer"]'
    )
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Register for Fall 1", exact: true })
  ).toHaveCount(0);

  await page.goto("/sessions");
  await expect(
    page.getByRole("heading", {
      name: "Fall 2 Registration Is Open",
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Fall 1 In session/ })
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("button", { name: /Winter 3 \(2027\)/ })
  ).toBeVisible();

  // Summer 2027 must not reactivate the detailed Summer 2026 pages.
  await page.clock.setFixedTime(new Date("2027-07-01T19:00:00Z"));
  for (const path of ["/summer", "/tennis/summer-tennis"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Summer 2026.*Ended/
    );
  }
});

test("merged navigation retains hash destinations and mobile keyboard controls", async ({
  page,
  isMobile,
}) => {
  await page.goto("/sessions");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  if (isMobile) {
    await nav.getByRole("button", { name: "Open navigation menu" }).click();
    await nav.getByRole("button", { name: "Show Tennis submenu" }).click();
  } else {
    await nav.getByRole("link", { name: "Tennis", exact: true }).hover();
  }
  await nav.getByRole("link", { name: "Adult Tennis", exact: true }).click();
  await expect(page).toHaveURL(/\/tennis#adult-tennis$/);
  await expect(page.locator("#adult-tennis")).toBeInViewport();
  await expect
    .poll(() =>
      page.locator("#adult-tennis").evaluate(element => {
        const header = document.querySelector("nav > div")!;
        return Math.abs(
          element.getBoundingClientRect().top -
            header.getBoundingClientRect().height
        );
      })
    )
    .toBeLessThan(3);
  if (isMobile) {
    const toggle = nav.getByRole("button", { name: "Open navigation menu" });
    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  }
});

test("a stale lazy route recovers by reloading the current URL", async ({
  page,
}) => {
  let blockedImports = 0;
  let documents = 0;
  page.on("request", request => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents++;
  });
  await page.route(
    /\/(?:src\/pages\/FAQ\.tsx|assets\/FAQ-[^/]+\.js)(?:\?.*)?$/,
    async route => {
      if (blockedImports === 0) {
        blockedImports++;
        await route.abort("failed");
      } else {
        await route.continue();
      }
    }
  );
  await page.goto("/");
  await page.locator('footer a[href="/faq"]').click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Quick Answers."
  );
  await expect(page).toHaveURL(/\/faq$/);
  expect(blockedImports).toBe(1);
  // Vite can also reload once when it optimizes this route's dependencies.
  expect(documents).toBeGreaterThanOrEqual(2);
  expect(
    await page.evaluate(
      () =>
        (
          performance.getEntriesByType(
            "navigation"
          )[0] as PerformanceNavigationTiming
        ).type
    )
  ).toBe("reload");
});

test("fitness assessment tracks one conversion only after a successful submission", async ({
  page,
}) => {
  const startedAt = Date.now();
  await page.clock.setFixedTime(new Date(startedAt));
  const events: unknown[][] = [];
  await page.exposeFunction("recordTestAnalytics", (...args: unknown[]) =>
    events.push(args)
  );
  await page.addInitScript(() => {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag = (
      ...args
    ) => {
      (
        window as unknown as {
          recordTestAnalytics: (...args: unknown[]) => void;
        }
      ).recordTestAnalytics(...args);
    };
  });
  let attempts = 0;
  let payload: Record<string, unknown> | undefined;
  await page.route("**/api/contact", async route => {
    payload = route.request().postDataJSON();
    attempts++;
    await route.fulfill({
      status: attempts === 1 ? 503 : 200,
      contentType: "application/json",
      body: JSON.stringify(
        attempts === 1
          ? { error: "Please retry your assessment request." }
          : { ok: true }
      ),
    });
  });
  await page.goto("/free-fitness-assessment");
  await page
    .getByRole("button", { name: "Claim Your Free Assessment", exact: true })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Full Name").fill("Integration Test");
  await dialog.getByLabel("Email Address").fill("integration@example.com");
  await dialog.getByLabel("Monday", { exact: true }).check();
  await dialog
    .getByLabel("Preferred time of day")
    .selectOption("Morning (7am - 12pm)");
  // Respect the form's three-second time gate without slowing the test.
  await page.clock.setFixedTime(new Date(startedAt + 4_000));
  const submit = dialog.getByRole("button", {
    name: /Request Free Assessment|Claim My Free Assessment/,
  });
  expect(events.filter(event => event[1] === "conversion")).toHaveLength(0);
  await submit.click();
  await expect(dialog.getByRole("alert")).toContainText("Please retry");
  expect(events.filter(event => event[1] === "conversion")).toHaveLength(0);
  // Failed network requests still count toward the ten-second spam guard.
  await page.clock.setFixedTime(new Date(startedAt + 15_000));
  await submit.click();
  await expect(
    dialog.getByRole("heading", { name: "You're In." })
  ).toBeVisible();
  await expect
    .poll(() => events.filter(event => event[1] === "conversion"))
    .toEqual([
      [
        "event",
        "conversion",
        { send_to: "AW-18217215416/ouj7CNbhquccELjL0u5D" },
      ],
    ]);
  expect(payload).toMatchObject({
    formType: "free_fitness_assessment",
    source: "/free-fitness-assessment",
    email: "integration@example.com",
  });
});
