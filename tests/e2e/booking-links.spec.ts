import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const BOOKING_URL =
  "https://app.courtreserve.com/Online/Events/List/6689/C7BR91B9SH6689";
const CONVERSION_ID = "AW-18217215416/-Y8cCL7y9-McELjL0u5D";

type BookingTestWindow = Window & {
  gtag: (...args: unknown[]) => void;
  bookingTestEvents: unknown[][];
  bookingTestClicks: {
    defaultPrevented: boolean;
    button: number;
    ctrlKey: boolean;
    metaKey: boolean;
  }[];
};

async function openFitness(
  page: Page,
  context: BrowserContext,
  options: { consent: boolean; throwOnConversion?: boolean }
) {
  // All remote traffic is intercepted, including the first request in a new tab.
  await context.route("**/*", route => {
    const url = new URL(route.request().url());
    if (url.hostname === "app.courtreserve.com") {
      return route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<h1>Test booking destination</h1>",
      });
    }
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost")
      return route.continue();
    return route.abort();
  });
  await page.addInitScript(({ consent, throwOnConversion }) => {
    localStorage.setItem(
      "wsc-cookie-consent",
      JSON.stringify({
        necessary: true,
        analytics: consent,
        marketing: consent,
        timestamp: new Date().toISOString(),
      })
    );
    const testWindow = window as BookingTestWindow;
    testWindow.bookingTestEvents = [];
    testWindow.bookingTestClicks = [];
    testWindow.gtag = (...args) => {
      testWindow.bookingTestEvents.push(args);
      if (throwOnConversion && args[0] === "event" && args[1] === "conversion")
        throw new Error("Test tracking failure");
      // Never invoke event_callback: a tracking response must not own navigation.
    };
    const recordClick = (event: MouseEvent) => {
      const link = event.target instanceof Element
        ? event.target.closest("a")
        : null;
      if (link?.hostname !== "app.courtreserve.com") return;
      testWindow.bookingTestClicks.push({
        defaultPrevented: event.defaultPrevented,
        button: event.button,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
      });
    };
    window.addEventListener("click", recordClick);
    window.addEventListener("auxclick", recordClick);
  }, options);
  await page.goto("/fitness");
  await expect(page.locator(`a[href="${BOOKING_URL}"]`)).toHaveCount(3);
}

async function expectBookingTab(
  page: Page,
  context: BrowserContext,
  click: () => Promise<void>
) {
  const [bookingTab] = await Promise.all([
    context.waitForEvent("page", { timeout: 10_000 }),
    click(),
  ]);
  await expect(bookingTab).toHaveURL(BOOKING_URL);
  await expect(bookingTab.getByRole("heading", { level: 1 })).toHaveText(
    "Test booking destination"
  );
  await expect(page).toHaveURL(/\/fitness$/);
  await bookingTab.close();
}

test("all Fitness booking links open new tabs when advertising consent is declined", async ({
  page,
  context,
}) => {
  await openFitness(page, context, { consent: false });
  const bookingLinks = page.locator(`a[href="${BOOKING_URL}"]`);
  for (let index = 0; index < 3; index++) {
    const link = bookingLinks.nth(index);
    await expect(link).toHaveAttribute("target", "_blank");
    await expectBookingTab(page, context, () => link.click());
  }
  const recorded = await page.evaluate(() => {
    const testWindow = window as BookingTestWindow;
    return {
      events: testWindow.bookingTestEvents,
      clicks: testWindow.bookingTestClicks,
    };
  });
  expect(recorded.events.filter(event => event[0] === "event")).toEqual([]);
  expect(recorded.clicks).toHaveLength(3);
  expect(recorded.clicks.every(click => !click.defaultPrevented)).toBe(true);
});

test("Fitness booking remains native when conversion tracking throws", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await openFitness(page, context, { consent: true, throwOnConversion: true });
  await expectBookingTab(page, context, () =>
    page.getByRole("link", { name: "Browse & Register", exact: true }).click()
  );
  const events = await page.evaluate(() =>
    (window as BookingTestWindow).bookingTestEvents.filter(
      event => event[0] === "event" && event[1] === "conversion"
    )
  );
  expect(events).toEqual([
    ["event", "conversion", { send_to: CONVERSION_ID, value: 1, currency: "USD" }],
  ]);
  expect(errors).toEqual([]);
});

test("Fitness booking preserves modifier and middle-click navigation", async ({
  page,
  context,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop pointer gestures do not apply to touch emulation.");
  await openFitness(page, context, { consent: true });
  const link = page.getByRole("link", { name: "Browse & Register", exact: true });
  await expectBookingTab(page, context, () =>
    link.click({ modifiers: ["ControlOrMeta"] })
  );
  await expectBookingTab(page, context, () => link.click({ button: "middle" }));
  const clicks = await page.evaluate(() =>
    (window as BookingTestWindow).bookingTestClicks
  );
  expect(clicks).toHaveLength(2);
  expect(clicks[0].ctrlKey || clicks[0].metaKey).toBe(true);
  expect(clicks[1].button).toBe(1);
  expect(clicks.every(click => !click.defaultPrevented)).toBe(true);
});
