import { expect, test, type Page } from "@playwright/test";
import { normalizePayload } from "../../server/form-validation";

test.use({ reducedMotion: "reduce" });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("wsc-cookie-consent", JSON.stringify({
    necessary: true, analytics: false, marketing: false, timestamp: new Date().toISOString(),
  })));
});

async function followTermsSection(page: Page, name: string) {
  const menu = page.getByRole("button", { name: "Jump to Section", exact: true });
  if (await menu.isVisible() && await menu.getAttribute("aria-expanded") === "false") {
    await menu.click();
  }
  await page.locator("#policies-quick-nav").getByRole("link", { name, exact: true }).click();
}

test("Terms section links and browser history retain the Terms content", async ({ page }) => {
  await page.goto("/policies#terms");
  const termsTab = page.getByRole("button", { name: "Terms of Service", exact: true });
  await expect(termsTab).toHaveAttribute("aria-pressed", "true");

  await followTermsSection(page, "Booking");
  await expect(page).toHaveURL(/\/policies#terms-booking$/);
  await expect(termsTab).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#terms-booking")).toBeVisible();

  await followTermsSection(page, "Programs");
  await expect(page).toHaveURL(/\/policies#terms-programs$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/policies#terms-booking$/);
  await expect(termsTab).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#terms-booking")).toBeVisible();

  await page.getByRole("button", { name: "Club Policies", exact: true }).click();
  await expect(page).toHaveURL(/\/policies$/);
  await expect(page.locator("#terms-booking")).toHaveCount(0);
  await expect(page.locator("#court-booking")).toBeVisible();
});

test("direct Terms section links mount and scroll to the requested section", async ({ page }) => {
  for (const [hash, heading] of [
    ["terms-booking", "Booking & cancellation policies."],
    ["terms-programs", "Programs & Tier 1 Sports."],
  ]) {
    await page.goto(`/policies#${hash}`);
    await expect(page.getByRole("button", { name: "Terms of Service", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(`#${hash}`).getByRole("heading", { name: heading, exact: true })).toBeInViewport();
  }
});

for (const feedback of ["", "   ", "More early morning classes would help."]) {
  test(`cancellation requests accept ${feedback.trim() ? "optional feedback" : feedback ? "blank-space feedback" : "no feedback"}`, async ({ page }) => {
    let received: ReturnType<typeof normalizePayload> | undefined;
    await page.clock.setFixedTime(new Date("2026-11-04T12:00:00Z"));
    await page.route("**/api/contact", async route => {
      // Exercise the actual server validation without delivering or recording a request.
      received = normalizePayload(route.request().postDataJSON());
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await page.goto("/member-request");
    await page.getByLabel("First Name").fill("Test");
    await page.getByLabel("Last Name").fill("Member");
    await page.getByLabel(/^Email/).fill("member@example.com");
    await page.getByLabel(/^Phone/).fill("425-555-0100");
    const feedbackField = page.getByLabel("Is there anything we could have done better? (optional)", { exact: true });
    await expect(feedbackField).not.toHaveAttribute("required");
    await feedbackField.fill(feedback);
    await page.clock.setFixedTime(new Date("2026-11-04T12:00:02Z"));
    await page.getByRole("button", { name: "Submit Request", exact: true }).click();

    await expect(page.locator("form [role=status]")).toContainText("Cancellation request submitted.");
    expect(received).toMatchObject({
      formType: "member_cancellation",
      name: "Test Member",
      email: "member@example.com",
      phone: "425-555-0100",
      source: "/member-request",
      message: feedback.trim() || "Membership cancellation requested. No feedback provided.",
    });
  });
}
