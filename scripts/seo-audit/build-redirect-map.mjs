#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");
const outputDir = path.join(__dirname, "output");

const OLD_ORIGIN = "https://www.woodinvillesportsclub.com";
const NEW_ORIGIN = "https://www.woodinvillesportsclub.com";

const canonicalRouteOverrides = new Map([
  ["/fitness", "/gym"],
  ["/terms", "/policies"],
]);

const nonPublicRoutes = new Set(["/404"]);
const routeAliases = new Set(["/fitness", "/terms"]);

const manualClosestTargets = new Map([
  ["/about-1", "/about"],
  ["/about-3", "/about"],
  ["/about-wsc", "/about"],
  ["/adult-wsc-tennis", "/tennis"],
  ["/apl-training-center", "/gym"],
  ["/areasweserve", "/about"],
  ["/blog", "/"],
  ["/blog/categories/golf", "/golf"],
  ["/blog/categories/tennis", "/tennis"],
  ["/book", "https://app.courtreserve.com/Online/Portal/Index/6689"],
  ["/book-online", "https://app.courtreserve.com/Online/Portal/Index/6689"],
  ["/camps", "/summer"],
  ["/coaching-conference", "/contact"],
  ["/contact-us", "/contact"],
  ["/copy-of-2025-summer-camp-sign-up", "/summer"],
  ["/copy-of-adventure-camp", "/summer"],
  ["/copy-of-camps", "/summer"],
  ["/copy-of-golf-camp", "/summer"],
  ["/copy-of-tennis", "/tennis"],
  ["/copy-of-tennis-camp", "/summer"],
  ["/courses", "/summer"],
  ["/courses/tennis", "/tennis"],
  ["/events-1", "/events"],
  ["/faqs", "/faq"],
  ["/fitness", "/gym"],
  ["/free-fitness-assessment", "/gym"],
  ["/fta-parent-meeting-4-21", "/contact"],
  ["/golf-coaching", "/golf"],
  ["/inquiry-services-page", "/contact"],
  ["/main-gym", "/gym"],
  ["/matpilates", "/gym"],
  ["/member-request", "/contact"],
  ["/membership-agreement", "/policies"],
  ["/membership-policies", "/policies"],
  ["/newsletter-signup", "/contact"],
  ["/performance-training-team", "/gym"],
  ["/personal-training-interest-form", "/gym"],
  ["/pickleball-camp", "/summer"],
  ["/racket-stringing", "/pro-shop"],
  ["/registration-instructions", "/summer"],
  ["/rpm-elite-application", "/tennis"],
  ["/sact", "/tennis"],
  ["/strength-and-conditioning", "/gym"],
  ["/summer-camp-signup", "/summer"],
  ["/summer-camps-adventureclub", "/summer"],
  ["/summer-camps-golf", "/summer"],
  ["/summer-camps-tennis", "/summer"],
  ["/testimonials", "/about"],
  ["/tier-1-classes-application-form", "/tennis"],
  ["/tier-1-performance", "/gym"],
  ["/tier1-auto-enroll-policy", "/policies"],
  ["/tier1coreitennis", "/tennis"],
  ["/tier1golfacademy", "/golf"],
  ["/tier1golfftaform", "/golf"],
  ["/upcoming-session-dates", "/sessions"],
  ["/usta", "/tennis"],
]);

const reviewNeededRules = [
  {
    test: (pathname) => pathname === "/blog",
    reason: "No blog index exists in the new build.",
  },
  {
    test: (pathname) => pathname.startsWith("/blog/categories/"),
    reason: "No blog category pages exist in the new build.",
  },
  {
    test: (pathname) => pathname.startsWith("/post/"),
    reason: "Individual blog article content has no 1:1 page in the new build.",
  },
];

function normalizePathname(rawUrlOrPath) {
  const url = rawUrlOrPath.startsWith("http")
    ? new URL(rawUrlOrPath)
    : new URL(rawUrlOrPath, OLD_ORIGIN);
  let pathname = url.pathname.replace(/\/+$/, "");
  if (pathname === "") pathname = "/";
  return decodeURI(pathname);
}

function toAbsoluteUrl(destination) {
  if (!destination) return "";
  if (/^https?:\/\//i.test(destination)) return destination;
  return new URL(destination, NEW_ORIGIN).toString();
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function routePatternToRegex(source) {
  const escaped = source
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/:([A-Za-z0-9_]+)\\\*/g, ".*")
    .replace(/:([A-Za-z0-9_]+)/g, "[^/]+");
  return new RegExp(`^${escaped}/?$`);
}

function routeExists(pathname, routes) {
  for (const route of routes) {
    if (route === pathname) return true;
    if (route.includes(":") && routePatternToRegex(route).test(pathname)) return true;
  }
  return false;
}

function getRedirectsFromVercel(vercelConfig) {
  return (vercelConfig.redirects ?? []).map((redirect) => ({
    ...redirect,
    regex: routePatternToRegex(redirect.source),
  }));
}

function findRedirectTarget(pathname, redirects) {
  const manual = manualClosestTargets.get(pathname);
  if (manual) return manual;

  const redirect = redirects.find((candidate) => candidate.regex.test(pathname));
  if (redirect?.destination) return redirect.destination;

  if (pathname.startsWith("/adult-rpm-classes/")) return "/tennis";
  if (pathname.startsWith("/event-details-registration/")) return "/contact";
  if (pathname.startsWith("/post/")) return "/";
  if (pathname.startsWith("/courses/")) return "/summer";
  if (pathname.startsWith("/blog/")) return "/";

  return "";
}

async function getAppRoutes() {
  const appFile = path.join(repoRoot, "client/src/App.tsx");
  const appSource = await fs.readFile(appFile, "utf8");
  const routes = new Set();
  for (const match of appSource.matchAll(/<Route\s+path="([^"]+)"/g)) {
    routes.add(normalizePathname(match[1]));
  }
  return routes;
}

function classifyOldUrl(pathname, routes, redirects) {
  const canonicalOverride = canonicalRouteOverrides.get(pathname);
  if (canonicalOverride) {
    return {
      matchType: "redirect-needed",
      newUrl: toAbsoluteUrl(canonicalOverride),
      reviewReason: "",
    };
  }

  if (routeExists(pathname, routes) && !nonPublicRoutes.has(pathname) && !routeAliases.has(pathname)) {
    return {
      matchType: "exact",
      newUrl: toAbsoluteUrl(pathname),
      reviewReason: "",
    };
  }

  const closestTarget = findRedirectTarget(pathname, redirects);
  const reviewRule = reviewNeededRules.find((rule) => rule.test(pathname));
  if (reviewRule) {
    return {
      matchType: "missing-content",
      newUrl: toAbsoluteUrl(closestTarget),
      reviewReason: reviewRule.reason,
    };
  }

  if (closestTarget) {
    return {
      matchType: "redirect-needed",
      newUrl: toAbsoluteUrl(closestTarget),
      reviewReason: "",
    };
  }

  return {
    matchType: "missing-content",
    newUrl: "",
    reviewReason: "No route or redirect target was found in the repo.",
  };
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const [auditRaw, vercelRaw, routes] = await Promise.all([
    fs.readFile(path.join(outputDir, "current-urls.json"), "utf8"),
    fs.readFile(path.join(repoRoot, "vercel.json"), "utf8"),
    getAppRoutes(),
  ]);

  const audit = JSON.parse(auditRaw);
  const records = audit.records ?? [];
  const vercelConfig = JSON.parse(vercelRaw);
  const redirects = getRedirectsFromVercel(vercelConfig);

  const rows = [];
  const oldPathnames = new Set();

  for (const record of records) {
    const oldUrl = record.source_url || record.final_url;
    const pathname = normalizePathname(oldUrl);
    oldPathnames.add(pathname);
    const classification = classifyOldUrl(pathname, routes, redirects);

    rows.push({
      old_url: oldUrl,
      new_url: classification.newUrl,
      match_type: classification.matchType,
      review_reason: classification.reviewReason,
      old_title: record.title ?? "",
      old_word_count: record.word_count ?? "",
    });
  }

  const canonicalRoutes = [...routes]
    .filter((route) => !nonPublicRoutes.has(route))
    .filter((route) => !routeAliases.has(route))
    .filter((route) => !route.includes(":"))
    .filter((route) => !oldPathnames.has(route))
    .sort((a, b) => a.localeCompare(b));

  for (const route of canonicalRoutes) {
    rows.push({
      old_url: "",
      new_url: toAbsoluteUrl(route),
      match_type: "new-page",
      review_reason: "",
      old_title: "",
      old_word_count: "",
    });
  }

  const redirectMapPath = path.join(outputDir, "redirect-map.csv");
  const requestedHeaders = ["old_url", "new_url", "match_type"];
  const csv = [
    requestedHeaders.join(","),
    ...rows.map((row) => requestedHeaders.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
  await fs.writeFile(redirectMapPath, `${csv}\n`, "utf8");

  const detailedPath = path.join(outputDir, "redirect-map-details.json");
  await fs.writeFile(
    detailedPath,
    `${JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        old_url_count: records.length,
        old_unique_path_count: oldPathnames.size,
        new_route_count: canonicalRoutes.length + [...oldPathnames].filter((p) => routes.has(p)).length,
        counts: rows.reduce((acc, row) => {
          acc[row.match_type] = (acc[row.match_type] ?? 0) + 1;
          return acc;
        }, {}),
        missing_content: rows.filter((row) => row.match_type === "missing-content"),
        rows,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        redirectMapPath,
        detailedPath,
        counts: rows.reduce((acc, row) => {
          acc[row.match_type] = (acc[row.match_type] ?? 0) + 1;
          return acc;
        }, {}),
        missingContentCount: rows.filter((row) => row.match_type === "missing-content").length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
