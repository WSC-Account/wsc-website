import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  const trackingTest =
    testInfo.title.includes("fitness assessment tracks") ||
    testInfo.title.includes("branded CourtReserve");
  await page.addInitScript((trackingTest) => {
    localStorage.setItem(
      "wsc-cookie-consent",
      JSON.stringify({
        necessary: true,
        analytics: trackingTest,
        marketing: trackingTest,
        timestamp: new Date().toISOString(),
      })
    );
  }, trackingTest);
});

test("branded CourtReserve links retain booking destinations and conversions", async ({
  page,
  context,
}) => {
  const portal = "https://book.woodinvillesportsclub.com/Online/Portal/Index/6689";
  const classes = "https://book.woodinvillesportsclub.com/Online/Events/List/6689/C7BR91B9SH6689";
  // Exercise real click/navigation behavior without sending analytics or booking requests.
  await context.route(/https:\/\/(?:www\.)?googletagmanager\.com\//, route =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  );
  await context.route("https://book.woodinvillesportsclub.com/**", route =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Booking destination</h1>" })
  );
  const events: unknown[][] = [];
  await page.exposeFunction("recordBookingAnalytics", (...args: unknown[]) => events.push(args));
  await page.addInitScript(() => {
    window.gtag = (...args) => {
      (window as unknown as { recordBookingAnalytics: (...args: unknown[]) => void })
        .recordBookingAnalytics(...args);
    };
  });

  await page.goto("/membership");
  const signup = page.getByRole("link", { name: "Sign Up", exact: true }).first();
  await expect(signup).toHaveAttribute("href", portal);
  const [bookingTab] = await Promise.all([
    page.waitForEvent("popup"),
    signup.click(),
  ]);
  await expect(bookingTab).toHaveURL(portal);
  await expect.poll(() => events.filter(event => event[1] === "booking_click")).toEqual([
    ["event", "booking_click", expect.objectContaining({ link_url: portal, booking_provider: "CourtReserve" })],
  ]);
  expect(events.filter(event => event[1] === "membership_click")).toEqual([
    ["event", "membership_click", expect.objectContaining({ membership_action: "start_courtreserve" })],
  ]);
  expect(events.filter(event => event[1] === "outbound_click")).toEqual([]);
  await bookingTab.close();

  events.length = 0;
  await page.goto("/fitness");
  await page.locator(`a[href="${classes}"]`).first().click();
  // Fitness waits for its advertising callback, with a timeout fallback, before navigating.
  await expect(page).toHaveURL(classes);
  expect(events.filter(event => event[1] === "booking_click")).toEqual([
    ["event", "booking_click", expect.objectContaining({ link_url: classes, booking_provider: "CourtReserve" })],
  ]);
  expect(events.filter(event => event[1] === "conversion")).toEqual([
    ["event", "conversion", expect.objectContaining({ send_to: "AW-18217215416/-Y8cCL7y9-McELjL0u5D" })],
  ]);
  expect(events.filter(event => event[1] === "outbound_click")).toEqual([]);
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
    "https://book.woodinvillesportsclub.com/Online/Portal/Index/6689"
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
  await expect(page).toHaveURL(/\/tennis\/adult$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your game.");
  if (isMobile) {
    await nav.getByRole("button", { name: "Open navigation menu" }).click();
    await nav.getByRole("button", { name: "Show Tennis submenu" }).click();
  } else {
    await nav.getByRole("link", { name: "Tennis", exact: true }).hover();
  }
  await nav.getByRole("link", { name: "Junior Tennis", exact: true }).click();
  await expect(page).toHaveURL(/\/tennis#junior-tennis$/);
  await expect(page.locator("#junior-tennis")).toBeInViewport();
  await expect
    .poll(() =>
      page.locator("#junior-tennis").evaluate(element => {
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

test("Golf submenu opens Tier 1 in a new tab and keeps WSC navigation usable", async ({
  page,
  context,
  isMobile,
}) => {
  const tier1GolfUrl = "https://www.tier1nw.com/golf";
  await context.route(tier1GolfUrl, route =>
    route.fulfill({
      contentType: "text/html",
      body: "<h1>Tier 1 Golf</h1>",
    })
  );
  await page.goto("/golf");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const openGolfMenu = async () => {
    if (isMobile) {
      await nav.getByRole("button", { name: "Open navigation menu" }).click();
      await nav.getByRole("button", { name: "Show Golf submenu" }).click();
    } else {
      await nav.getByRole("link", { name: "Golf", exact: true }).hover();
    }
  };
  await openGolfMenu();
  const popupPromise = page.waitForEvent("popup");
  await nav.getByRole("link", { name: "Tier 1 Golf", exact: true }).click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(tier1GolfUrl);
  await expect(popup.getByRole("heading", { level: 1 })).toHaveText(
    "Tier 1 Golf"
  );
  await expect(page).toHaveURL(/\/golf$/);
  if (isMobile) {
    await expect(
      nav.getByRole("button", { name: "Open navigation menu" })
    ).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  }
  await popup.close();
  await openGolfMenu();
  await nav.getByRole("link", { name: "Golf Simulators", exact: true }).click();
  await expect(page).toHaveURL(/\/golf#swing-lab$/);
  await expect(page.locator("#swing-lab")).toBeInViewport();
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
  await page.route(/https:\/\/(?:www\.)?googletagmanager\.com\//, route => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
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
