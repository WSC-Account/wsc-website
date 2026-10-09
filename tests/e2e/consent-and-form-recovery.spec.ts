import { expect, test } from "@playwright/test";

for (const analytics of [false, true]) {
  for (const marketing of [false, true]) {
    test(`cookie settings contain linked Google tags: analytics=${analytics} marketing=${marketing}`, async ({
      page,
    }) => {
      const googleRequests: string[] = [];
      await page.route("https://www.googletagmanager.com/**", route => {
        googleRequests.push(route.request().url());
        return route.abort();
      });
      // Preserve the real Vercel loader/queue while preventing analytics traffic.
      await page.route("**/_vercel/insights/**", route => route.abort());
      await page.route("https://va.vercel-scripts.com/**", route =>
        route.abort()
      );
      await page.goto(
        "/contact?gclid=private-test-click&utm_source=consent-test"
      );
      await page
        .getByRole("button", { name: "Cookie preferences", exact: true })
        .click();
      const dialog = page.getByRole("dialog", { name: "Cookie consent" });
      await expect(dialog).toBeVisible();
      if (analytics)
        await dialog
          .getByRole("switch", { name: "Allow analytics cookies" })
          .click();
      if (marketing)
        await dialog
          .getByRole("switch", { name: "Allow marketing cookies" })
          .click();
      await dialog.getByRole("button", { name: "Save Preferences" }).click();
      await expect
        .poll(() =>
          page.evaluate(() =>
            JSON.parse(localStorage.getItem("wsc-cookie-consent") || "{}")
          )
        )
        .toMatchObject({ analytics, marketing });
      const googleAllowed = analytics && marketing;
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              (window as unknown as Record<string, unknown>)[
                "ga-disable-G-S6448TRP0T"
              ]
          )
        )
        .toBe(!googleAllowed);
      if (googleAllowed)
        await expect(page.locator("#wsc-google-script")).toHaveCount(1);
      else await expect(page.locator("#wsc-google-script")).toHaveCount(0);
      await expect(page.locator("#wsc-gtm-script")).toHaveCount(
        googleAllowed ? 1 : 0
      );
      await expect(
        page.locator(
          'script[src*="/_vercel/insights/"], script[src*="va.vercel-scripts.com/"]'
        )
      ).toHaveCount(analytics ? 1 : 0);
      if (!googleAllowed) {
        expect(googleRequests).toEqual([]);
        expect(
          await page.evaluate(() =>
            (window.dataLayer || []).filter(
              entry =>
                typeof entry === "object" &&
                entry !== null &&
                0 in entry &&
                entry[0] === "event"
            )
          )
        ).toEqual([]);
      }
      if (analytics && !marketing) {
        const filtered = await page.evaluate(() => {
          const queue = (
            window as unknown as {
              vaq: [
                string,
                (event: { url: string; type: string }) => unknown,
              ][];
            }
          ).vaq;
          const beforeSend = queue.findLast(
            entry => entry[0] === "beforeSend"
          )?.[1];
          return beforeSend?.({ type: "pageview", url: window.location.href });
        });
        expect(filtered).toMatchObject({
          url: `${new URL(page.url()).origin}/contact`,
        });
        expect(JSON.stringify(filtered)).not.toMatch(
          /private-test-click|consent-test|gclid|utm_source/
        );
      }
      const stored = await page.evaluate(() =>
        sessionStorage.getItem("wsc-marketing-attribution")
      );
      if (marketing)
        expect(JSON.parse(stored || "{}")).toMatchObject({
          gclid: "private-test-click",
        });
      else expect(stored).toBeNull();
      await page
        .getByRole("button", { name: "Cookie preferences", exact: true })
        .click();
      await expect(
        dialog.getByRole("switch", { name: "Allow analytics cookies" })
      ).toHaveAttribute("aria-checked", String(analytics));
      await expect(
        dialog.getByRole("switch", { name: "Allow marketing cookies" })
      ).toHaveAttribute("aria-checked", String(marketing));
    });
  }
}

test("withdrawing permission refreshes into a page without Google trackers or campaign storage", async ({
  page,
}) => {
  await page.route("https://www.googletagmanager.com/**", route =>
    route.abort()
  );
  await page.goto("/contact?gclid=test-campaign");
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await page.getByRole("button", { name: "Accept All", exact: true }).click();
  await expect(page.locator("#wsc-gtm-script")).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(() => sessionStorage.getItem("wsc-marketing-attribution"))
    )
    .not.toBeNull();
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await Promise.all([
    page.waitForEvent("load"),
    page.getByRole("button", { name: "Decline", exact: true }).click(),
  ]);
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem("wsc-cookie-consent") || "{}")
      )
    )
    .toMatchObject({ analytics: false, marketing: false });
  await expect(page.locator("#wsc-google-script, #wsc-gtm-script")).toHaveCount(
    0
  );
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("wsc-marketing-attribution")
    )
  ).toBeNull();
});

test("a fast contact submission retains its fields and can be retried", async ({
  page,
}) => {
  const now = new Date("2026-10-07T12:00:00Z");
  await page.clock.setFixedTime(now);
  let requests = 0;
  await page.route("**/api/contact", async route => {
    requests += 1;
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto("/contact");
  await page.getByLabel("First Name").fill("Browser");
  await page.getByLabel("Last Name").fill("Test");
  await page.getByLabel("Email", { exact: true }).fill("browser@example.com");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Please send membership information.");
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.locator("form [role=alert]")).toContainText(
    "Your information has been kept"
  );
  expect(requests).toBe(0);
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "browser@example.com"
  );
  await page.clock.setFixedTime(new Date(now.getTime() + 4_000));
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.locator("form [role=status]")).toContainText(
    "Message sent"
  );
  expect(requests).toBe(1);
});

test("newsletter manual fallback confirms a request without claiming enrollment", async ({
  page,
}) => {
  const now = new Date("2026-10-07T12:00:00Z");
  await page.clock.setFixedTime(now);
  await page.route("**/api/contact", route =>
    route.fulfill({
      json: {
        ok: true,
        accepted: true,
        constantContactStatus: "not_configured",
      },
    })
  );
  await page.goto("/newsletter-signup");
  await page.locator("#newsletter-email-page").fill("newsletter@example.com");
  await page.clock.setFixedTime(new Date(now.getTime() + 2_000));
  await page.getByRole("button", { name: "Sign Up", exact: true }).click();
  await expect(page.locator("form [role=status]")).toContainText(
    "We received your signup request"
  );
});
