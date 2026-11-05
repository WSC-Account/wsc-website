import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("membership cancellation link is keyboard-accessible only while its answer is open", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("wsc-cookie-consent", JSON.stringify({
    necessary: true, analytics: false, marketing: false, timestamp: new Date().toISOString(),
  })));
  await page.goto("/membership");

  const question = page.getByRole("button", { name: "How do I cancel my membership?", exact: true });
  const nextQuestion = page.getByRole("button", { name: "Can I upgrade or downgrade my membership?", exact: true });
  const cancellationLink = page.getByRole("link", { name: "Open the membership cancellation form", exact: true });

  await expect(question).toHaveAttribute("aria-expanded", "false");
  await question.focus();
  await page.keyboard.press("Tab");
  await expect(nextQuestion).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(question).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(cancellationLink).toBeFocused();
  await expect(cancellationLink).toBeVisible();
  await expect(cancellationLink).toHaveAttribute("href", "/member-request");

  await page.keyboard.press("Shift+Tab");
  await expect(question).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Tab");
  await expect(nextQuestion).toBeFocused();
});
