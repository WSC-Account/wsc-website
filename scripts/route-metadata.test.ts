import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { SEO } from "../client/src/lib/seo-data";
import { pageRoutes, routeMetadata } from "./seo-audit/route-metadata";

test("every SEO entry has explicit build metadata and a registered client route", () => {
  assert.deepEqual(Object.keys(routeMetadata).sort(), Object.keys(SEO).sort());
  const app = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");
  const registeredPaths = Array.from(app.matchAll(/<Route\s+path="([^"]+)"/g), match => match[1]);
  const routePatterns = registeredPaths.map(route => new RegExp(`^${route.split("/").map(segment =>
    segment.startsWith(":") ? "[^/]+" : segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  ).join("/")}$`));
  assert.equal(new Set(pageRoutes.map(route => route.path)).size, pageRoutes.length);

  for (const route of pageRoutes) {
    assert.ok(routePatterns.some(pattern => pattern.test(route.path)), `${route.path} needs a client route`);
    assert.ok(existsSync(new URL(`../client/public${route.image}`, import.meta.url)), `${route.path} image is missing`);
    assert.equal(typeof route.staticShell, "boolean", `${route.path} needs an explicit shell policy`);
    if ("robots" in route && route.robots.startsWith("noindex")) {
      assert.equal(route.sitemap, false, `${route.path} must not publish a noindex URL in the sitemap`);
    }
  }
});

test("ads and consolidated pages retain their existing sitemap and shell policies", () => {
  assert.equal(routeMetadata.freeFitnessAssessment.sitemap, false);
  assert.equal(routeMetadata.freeFitnessAssessment.staticShell, true);
  assert.equal("robots" in SEO.freeFitnessAssessment, false);
  assert.equal(routeMetadata.personalTraining.sitemap, false);
  assert.equal(routeMetadata.newsletterSignup.sitemap, false);
  assert.equal(routeMetadata.privacy.sitemap, false);
  assert.equal(routeMetadata.privacy.staticShell, false);
});
