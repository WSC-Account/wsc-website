import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  CONSENT_STORAGE_KEY,
  canUseGoogleTracking,
  getCookieConsent,
  googleConsentSettings,
  saveCookieConsent,
} from "../client/src/lib/consent";
import {
  captureMarketingAttribution,
  getMarketingAttribution,
  trackMarketingEvent,
} from "../client/src/lib/marketing-attribution";
import {
  newsletterSubmissionMessage,
  submitWebsiteForm,
} from "../client/src/lib/forms";
import { trackAdvertisingConversion } from "../client/src/lib/tracking";

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.window = originalWindow;
  globalThis.document = originalDocument;
  globalThis.fetch = originalFetch;
});

function browser(analytics: boolean, marketing: boolean) {
  const store = new Map<string, string>([
    [CONSENT_STORAGE_KEY, JSON.stringify({ analytics, marketing })],
  ]);
  const session = new Map<string, string>();
  const calls: unknown[][] = [];
  const storage = (data: Map<string, string>) => ({
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
    removeItem: (key: string) => data.delete(key),
  });
  globalThis.window = {
    localStorage: storage(store),
    sessionStorage: storage(session),
    location: {
      href: "https://www.woodinvillesportsclub.com/fitness?gclid=private-click&utm_source=google",
    },
    gtag: (...args: unknown[]) => calls.push(args),
    dispatchEvent: () => true,
  } as unknown as Window & typeof globalThis;
  globalThis.document = { referrer: "https://example.com" } as Document;
  return { store, session, calls };
}

for (const analytics of [false, true]) {
  for (const marketing of [false, true]) {
    test(`linked Google tracking needs both choices: analytics=${analytics}, marketing=${marketing}`, async () => {
      const { calls, session } = browser(analytics, marketing);
      globalThis.fetch = async () => new Response(JSON.stringify({ ok: true }));
      captureMarketingAttribution();
      const googleAllowed = analytics && marketing;
      assert.equal(canUseGoogleTracking(), googleAllowed);
      assert.deepEqual(getCookieConsent(), {
        necessary: true,
        analytics,
        marketing,
        timestamp: "",
      });
      assert.equal(session.size, marketing ? 1 : 0);
      assert.equal(
        getMarketingAttribution()?.gclid,
        marketing ? "private-click" : undefined
      );
      await submitWebsiteForm({
        formType: "free_fitness_assessment",
        source: "/fitness",
        email: "test@example.com",
      });
      assert.equal(
        calls.filter(call => call[1] === "form_submit").length,
        googleAllowed ? 1 : 0
      );
      assert.equal(
        calls.filter(call => call[1] === "conversion").length,
        googleAllowed ? 1 : 0
      );
      assert.deepEqual(googleConsentSettings({ analytics, marketing }), {
        analytics_storage: googleAllowed ? "granted" : "denied",
        ad_storage: googleAllowed ? "granted" : "denied",
        ad_user_data: googleAllowed ? "granted" : "denied",
        ad_personalization: googleAllowed ? "granted" : "denied",
      });
    });
  }
}

test("withdrawal updates the SDK, clears attribution and stops already initialized trackers", () => {
  const { calls, session } = browser(true, true);
  captureMarketingAttribution();
  assert.equal(saveCookieConsent({ analytics: false, marketing: false }), true);
  captureMarketingAttribution();
  assert.equal(session.size, 0);
  assert.equal(getCookieConsent().analytics, false);
  assert.deepEqual(calls.at(-1), [
    "consent",
    "update",
    googleConsentSettings({ analytics: false, marketing: false }),
  ]);
  calls.length = 0;
  trackMarketingEvent("contact_click", { contact_method: "phone" });
  assert.equal(trackAdvertisingConversion("AW-test/lead"), false);
  assert.equal(calls.length, 0);
});

test("analytics-only clicks cannot forward full campaign URLs to a preexisting Google SDK", () => {
  const { calls } = browser(true, false);
  trackMarketingEvent("outbound_click", {
    link_url: "https://example.com/book?gclid=private#campaign",
  });
  assert.deepEqual(calls, []);
});

for (const remaining of [
  { analytics: true, marketing: false },
  { analytics: false, marketing: true },
]) {
  test(`withdrawing either choice denies every linked Google consent type: ${JSON.stringify(remaining)}`, () => {
    const { calls } = browser(true, true);
    assert.equal(saveCookieConsent(remaining), true);
    assert.deepEqual(calls.at(-1), [
      "consent",
      "update",
      {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      },
    ]);
    calls.length = 0;
    trackMarketingEvent("outbound_click", {
      link_url: "https://example.com/?gclid=private-click",
    });
    assert.equal(trackAdvertisingConversion("AW-test/lead"), false);
    assert.deepEqual(calls, []);
  });
}

test("failed form requests do not report conversion and reuse their idempotency key", async () => {
  const { calls } = browser(true, true);
  const keys: string[] = [];
  const payload = {
    formType: "free_fitness_assessment" as const,
    source: "/retry-test",
    email: "retry@example.com",
  };
  let fail = true;
  globalThis.fetch = async (_input, init) => {
    keys.push(new Headers(init?.headers).get("Idempotency-Key")!);
    return new Response(
      JSON.stringify(fail ? { ok: false, error: "Try again" } : { ok: true }),
      { status: fail ? 503 : 200 }
    );
  };
  await assert.rejects(submitWebsiteForm(payload), /Try again/);
  assert.equal(calls.length, 0);
  fail = false;
  await submitWebsiteForm(payload);
  assert.equal(keys[0], keys[1]);
  assert.equal(calls.filter(call => call[1] === "conversion").length, 1);
  await submitWebsiteForm(payload);
  assert.notEqual(keys[1], keys[2]);
});

test("newsletter confirmation distinguishes enrollment from a manual signup request", () => {
  assert.match(
    newsletterSubmissionMessage({ constantContactStatus: "synced" }),
    /you're on/
  );
  assert.match(
    newsletterSubmissionMessage({ constantContactStatus: "not_configured" }),
    /signup request/
  );
  assert.match(newsletterSubmissionMessage({}), /signup request/);
});

test("a tracking SDK failure cannot turn a delivered submission into an error", async () => {
  browser(true, true);
  window.gtag = () => {
    throw new Error("SDK failed");
  };
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: true }));
  const result = await submitWebsiteForm({
    formType: "free_fitness_assessment",
    source: "/sdk-failure",
    email: "test@example.com",
  });
  assert.equal(result.ok, true);
});
