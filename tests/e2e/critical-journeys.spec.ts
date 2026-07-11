import { expect, test } from "@playwright/test";

const criticalPages = [
  { path: "/", heading: /Level Up Your Game at WSC/i },
  { path: "/tennis", heading: /Tennis/i },
  { path: "/golf", heading: /Golf/i },
  { path: "/membership", heading: /Train Without Limits/i },
  { path: "/contact", heading: /Get in Touch/i },
] as const;

test.describe("critical visitor journeys", () => {
  for (const pageDetails of criticalPages) {
    test(`${pageDetails.path} renders its main content without overflowing`, async ({
      page,
      isMobile,
    }) => {
      const runtimeErrors: Error[] = [];
      page.on("pageerror", error => runtimeErrors.push(error));

      await page.goto(pageDetails.path, { waitUntil: "domcontentloaded" });

      await expect(page.locator("h1")).toContainText(pageDetails.heading);
      await expect(page.locator("main#main-content")).toBeVisible();

      if (isMobile) {
        const viewportFitsContent = await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1
        );
        expect(
          viewportFitsContent,
          `${pageDetails.path} should not scroll sideways on mobile`
        ).toBe(true);
      }

      expect(
        runtimeErrors,
        `${pageDetails.path} should not produce browser errors`
      ).toEqual([]);
    });
  }

  test("main navigation reaches the contact page", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const navigation = page.getByRole("navigation", {
      name: "Main navigation",
    });

    if (isMobile) {
      await navigation
        .getByRole("button", { name: "Open navigation menu" })
        .click();
    }

    await navigation
      .getByRole("link", { name: "Contact", exact: true })
      .click();

    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Get in Touch"
    );
  });

  test("contact form sends the expected request and shows success", async ({
    page,
  }) => {
    let submittedPayload: Record<string, unknown> | undefined;
    await page.route("**/api/contact", async route => {
      submittedPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, id: "browser-test-submission" }),
      });
    });

    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await page.getByLabel("First Name").fill("Browser");
    await page.getByLabel("Last Name").fill("Test");
    await page
      .getByLabel("Email", { exact: true })
      .fill("browser-test@example.com");
    await page
      .getByLabel("Message", { exact: true })
      .fill("Please send membership information.");

    // The real form deliberately rejects submissions made within three seconds as bot traffic.
    await page.waitForTimeout(3_100);
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByRole("status")).toContainText("Message sent");
    expect(submittedPayload).toMatchObject({
      formType: "contact",
      formName: "Contact Form",
      source: "/contact",
      name: "Browser Test",
      email: "browser-test@example.com",
      message: "Please send membership information.",
    });
  });

  test("unknown pages show a useful 404 with a way home", async ({ page }) => {
    await page.goto("/this-page-does-not-exist", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByText("Page not found.", { exact: true })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Go Home" })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
