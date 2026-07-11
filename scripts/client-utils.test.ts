import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { BLOG_CATEGORIES, BLOG_POSTS } from "../client/src/lib/blog-data.ts";
import {
  FormSubmissionError,
  submitWebsiteForm,
  type WebsiteFormPayload,
} from "../client/src/lib/forms.ts";
import {
  imageDimensionsFor,
  responsiveAvifSrcSet,
  responsiveWebpSrcSet,
} from "../client/src/lib/responsive-image.ts";
import { SEO } from "../client/src/lib/seo-data.ts";

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalWindow === undefined)
    delete (globalThis as { window?: Window }).window;
  else globalThis.window = originalWindow;
});

const payload: WebsiteFormPayload = {
  formType: "contact",
  formName: "Contact Form",
  source: "/contact",
  name: "Jane Visitor",
  email: "jane@example.com",
  message: "Hello",
};

test("the browser form helper sends JSON and tracks only successful submissions", async () => {
  let request: { input: RequestInfo | URL; init?: RequestInit } | undefined;
  const analyticsCalls: unknown[][] = [];
  globalThis.fetch = async (input, init) => {
    request = { input, init };
    return new Response(JSON.stringify({ ok: true, id: "submission-1" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  globalThis.window = {
    gtag: (...args: unknown[]) => analyticsCalls.push(args),
  } as unknown as Window & typeof globalThis;

  const result = await submitWebsiteForm(payload);

  assert.deepEqual(result, { ok: true, id: "submission-1" });
  assert.equal(request?.input, "/api/contact");
  assert.equal(request?.init?.method, "POST");
  assert.deepEqual(request?.init?.headers, {
    "Content-Type": "application/json",
  });
  assert.deepEqual(JSON.parse(String(request?.init?.body)), payload);
  assert.deepEqual(analyticsCalls, [
    [
      "event",
      "form_submit",
      { form_name: "Contact Form", form_type: "contact", source: "/contact" },
    ],
  ]);
});

test("the browser form helper attaches Google Business Profile attribution", async () => {
  let submittedBody: WebsiteFormPayload | undefined;
  globalThis.fetch = async (_input, init) => {
    submittedBody = JSON.parse(String(init?.body)) as WebsiteFormPayload;
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  globalThis.window = {
    sessionStorage: {
      getItem: () =>
        JSON.stringify({
          utm_source: "google",
          utm_medium: "organic",
          utm_campaign: "google_business_profile",
          utm_content: "book_tennis",
          landing_page: "/tennis?utm_source=google",
        }),
    },
  } as unknown as Window & typeof globalThis;

  await submitWebsiteForm({
    ...payload,
    metadata: { customer_type: "new" },
  });

  assert.deepEqual(submittedBody?.metadata, {
    customer_type: "new",
    marketing_utm_source: "google",
    marketing_utm_medium: "organic",
    marketing_utm_campaign: "google_business_profile",
    marketing_utm_content: "book_tennis",
    marketing_landing_page: "/tennis?utm_source=google",
  });
});

test("the browser form helper preserves useful server errors", async () => {
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        ok: false,
        error: "Please enter a valid email address.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );

  await assert.rejects(submitWebsiteForm(payload), (error: unknown) => {
    assert.ok(error instanceof FormSubmissionError);
    assert.equal(error.status, 400);
    assert.equal(error.message, "Please enter a valid email address.");
    return true;
  });
});

test("the browser form helper falls back safely when a failed response is not JSON", async () => {
  globalThis.fetch = async () =>
    new Response("Service unavailable", { status: 503 });

  await assert.rejects(submitWebsiteForm(payload), (error: unknown) => {
    assert.ok(error instanceof FormSubmissionError);
    assert.equal(error.status, 503);
    assert.equal(
      error.message,
      "We could not submit the form right now. Please try again."
    );
    return true;
  });
});

test("responsive image helpers preserve real dimensions and portrait widths", () => {
  assert.deepEqual(
    imageDimensionsFor("/images/wsc/tennis-junior-backhand.webp"),
    {
      width: 1200,
      height: 1800,
    }
  );
  assert.equal(
    responsiveWebpSrcSet("/images/wsc/tennis-junior-backhand.webp"),
    "/images/wsc/responsive/tennis-junior-backhand-720.webp 480w, /images/wsc/responsive/tennis-junior-backhand-900.webp 600w, /images/wsc/responsive/tennis-junior-backhand-1200.webp 800w, /images/wsc/tennis-junior-backhand.webp 1200w"
  );
  assert.equal(
    responsiveAvifSrcSet("/images/wsc/campus-dome.webp"),
    "/images/wsc/responsive/campus-dome-720.avif 720w, /images/wsc/responsive/campus-dome-900.avif 900w, /images/wsc/responsive/campus-dome-1200.avif 1200w, /images/wsc/responsive/campus-dome-full.avif 1800w"
  );
  assert.equal(responsiveWebpSrcSet("/images/wsc/logo.png"), undefined);
});

test("blog entries have unique URLs, valid categories, and usable content", () => {
  const categorySlugs = new Set(BLOG_CATEGORIES.map(category => category.slug));
  const postSlugs = BLOG_POSTS.map(post => post.slug);

  assert.equal(
    new Set(postSlugs).size,
    postSlugs.length,
    "blog post slugs must be unique"
  );
  for (const post of BLOG_POSTS) {
    assert.ok(
      categorySlugs.has(post.categorySlug),
      `${post.slug} has an unknown category`
    );
    assert.ok(
      post.sections.length > 0,
      `${post.slug} needs at least one content section`
    );
    assert.match(
      post.image,
      /^\/images\/wsc\/.+\.webp$/,
      `${post.slug} needs a local WebP image`
    );
    assert.match(
      post.cta.href,
      /^(\/|https:\/\/)/,
      `${post.slug} CTA should use an internal path or secure external URL`
    );
  }
});

test("SEO metadata uses complete titles, descriptions, and canonical paths", () => {
  for (const [key, entry] of Object.entries(SEO)) {
    assert.ok(
      entry.title.trim().length >= 10,
      `${key} has a missing or very short title`
    );
    assert.ok(
      entry.description.trim().length >= 50,
      `${key} has a missing or very short description`
    );
    assert.match(entry.path, /^\//, `${key} needs an absolute site path`);
  }
});
