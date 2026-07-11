#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const publicDir = path.resolve("client/public");
const outputPath = path.resolve("scripts/seo-audit/output/public-seo-files-audit.json");

const [robots, sitemap] = await Promise.all([
  fs.readFile(path.join(publicDir, "robots.txt"), "utf8"),
  fs.readFile(path.join(publicDir, "sitemap.xml"), "utf8"),
]);

const urls = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);
const lastmodCount = (sitemap.match(/<lastmod>/g) ?? []).length;
const report = {
  checkedAt: new Date().toISOString(),
  robotsAllowsAll: /User-agent:\s*\*/i.test(robots),
  robotsHasDisallowRoot: /Disallow:\s*\/$/im.test(robots),
  sitemapUrlCount: urls.length,
  allWww: urls.every((url) => url.startsWith("https://www.woodinvillesportsclub.com/")),
  lastmodCount,
  urls,
};

await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));

if (
  !report.robotsAllowsAll ||
  report.robotsHasDisallowRoot ||
  !report.allWww ||
  report.sitemapUrlCount === 0 ||
  report.lastmodCount !== report.sitemapUrlCount
) {
  process.exitCode = 1;
}
