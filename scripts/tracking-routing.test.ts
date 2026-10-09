import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { build } from "esbuild";
import { resolveAnalyticsMeasurementId } from "../client/src/lib/tracking-config";

const originalWindow = globalThis.window;
afterEach(() => {
  globalThis.window = originalWindow;
});

// Bundle with the same environment substitution used by the browser build so
// an invalid deployment setting exercises the real helper's no-event branch.
async function tracker(env: Record<string, string>) {
  const result = await build({
    entryPoints: [
      new URL("../client/src/lib/tracking.ts", import.meta.url).pathname,
    ],
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    define: { "import.meta.env": JSON.stringify(env) },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`
  ) as Promise<typeof import("../client/src/lib/tracking")>;
}

function browser(analytics = true, marketing = true) {
  const calls: unknown[][] = [];
  globalThis.window = {
    localStorage: { getItem: () => JSON.stringify({ analytics, marketing }) },
    gtag: (...args: unknown[]) => calls.push(args),
  } as unknown as Window & typeof globalThis;
  return calls;
}

test("the shared Analytics destination preserves environment precedence and rejects non-measurement IDs", () => {
  assert.equal(resolveAnalyticsMeasurementId({}), "G-S6448TRP0T");
  assert.equal(
    resolveAnalyticsMeasurementId({ VITE_GA4_MEASUREMENT_ID: " G-TEST1234 " }),
    "G-TEST1234"
  );
  assert.equal(
    resolveAnalyticsMeasurementId({
      NEXT_PUBLIC_GA_ID: "G-FIRST123",
      VITE_GA4_MEASUREMENT_ID: "G-SECOND123",
    }),
    "G-FIRST123"
  );
  assert.equal(
    resolveAnalyticsMeasurementId({
      NEXT_PUBLIC_GA_ID: "invalid",
      VITE_GA4_MEASUREMENT_ID: "G-SECOND123",
    }),
    null
  );
});

test("custom Analytics events have one explicit configured destination, even if a caller supplies a different send_to", async () => {
  const { trackAnalyticsEvent, trackAdvertisingConversion } = await tracker({
    VITE_GA4_MEASUREMENT_ID: "G-TEST1234",
  });
  const calls = browser();
  assert.equal(
    trackAnalyticsEvent("form_submit", {
      form_type: "contact",
      send_to: "AW-unintended",
    }),
    true
  );
  assert.deepEqual(calls, [
    ["event", "form_submit", { form_type: "contact", send_to: "G-TEST1234" }],
  ]);
  assert.equal(trackAdvertisingConversion("AW-18217215416/test-label"), true);
  assert.deepEqual(calls[1], [
    "event",
    "conversion",
    { send_to: "AW-18217215416/test-label" },
  ]);
});

test("invalid configured Analytics IDs emit no event instead of falling back to the default target group", async () => {
  for (const id of [
    "invalid",
    "AW-18217215416",
    "G-PLACEHOLDER",
    "G-REPLACE_ME",
    " ",
  ]) {
    const { trackAnalyticsEvent } = await tracker({
      VITE_GA4_MEASUREMENT_ID: id,
    });
    const calls = browser();
    assert.equal(
      trackAnalyticsEvent("form_submit", { source: "/contact" }),
      false
    );
    assert.deepEqual(calls, []);
  }
});

test("explicit routing still honors both permission choices", async () => {
  const { trackAnalyticsEvent, trackAdvertisingConversion } = await tracker({
    VITE_GA4_MEASUREMENT_ID: "G-TEST1234",
  });
  for (const [analytics, marketing] of [
    [false, false],
    [true, false],
    [false, true],
  ]) {
    const calls = browser(analytics, marketing);
    assert.equal(
      trackAnalyticsEvent("contact_click", { source: "/contact" }),
      false
    );
    assert.equal(
      trackAdvertisingConversion("AW-18217215416/test-label"),
      false
    );
    assert.deepEqual(calls, []);
  }
});
