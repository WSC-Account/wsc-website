import { expect, test } from "@playwright/test";

test("a failed form retry survives reload without storing its personal information", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "wsc-cookie-consent",
      JSON.stringify({ analytics: false, marketing: false })
    )
  );
  let now = new Date("2026-10-07T12:00:00Z").getTime();
  await page.clock.setFixedTime(now);
  const requestKeys: string[] = [];
  await page.route("**/api/contact", async route => {
    requestKeys.push(route.request().headers()["idempotency-key"]);
    await route.fulfill({
      status: requestKeys.length === 1 ? 503 : 200,
      json:
        requestKeys.length === 1
          ? { ok: false, error: "Please retry this request." }
          : { ok: true },
    });
  });
  const fillAndSubmit = async () => {
    await page.getByLabel("First Name").fill("Private");
    await page.getByLabel("Last Name").fill("Visitor");
    await page.getByLabel("Email", { exact: true }).fill("private@example.com");
    await page
      .getByLabel("Message", { exact: true })
      .fill("A private membership question.");
    now += 11_000;
    await page.clock.setFixedTime(now);
    await page.getByRole("button", { name: "Send Message" }).click();
  };
  await page.goto("/contact");
  await fillAndSubmit();
  await expect(page.locator("form [role=alert]")).toContainText(
    "Please retry this request"
  );
  const cache = await page.evaluate(() =>
    sessionStorage.getItem("wsc-pending-form-requests")
  );
  expect(cache).toContain(requestKeys[0]);
  expect(cache).not.toMatch(
    /private@example\.com|Private|Visitor|membership question/
  );
  await page.reload();
  await fillAndSubmit();
  await expect(page.locator("form [role=status]")).toContainText(
    "Message sent"
  );
  expect(requestKeys[1]).toBe(requestKeys[0]);
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("wsc-pending-form-requests")
    )
  ).toBeNull();
  await fillAndSubmit();
  await expect(page.locator("form [role=status]")).toContainText(
    "Message sent"
  );
  expect(requestKeys[2]).not.toBe(requestKeys[1]);
});
