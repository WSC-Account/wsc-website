import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const protectedLandingPages = [
  {
    name: "Driving Range",
    route: "/golf/driving-range",
    pageFile: "client/src/pages/DrivingRange.tsx",
    component: "DrivingRange",
    seoKey: "drivingRange",
    aliases: ["/driving-range", "/golf-driving-range"],
  },
  {
    name: "Golf Tournaments",
    route: "/golf/tournaments",
    pageFile: "client/src/pages/GolfTournaments.tsx",
    component: "GolfTournaments",
    seoKey: "golfTournaments",
    aliases: ["/golf-tournaments"],
  },
  {
    name: "Golf Lessons",
    route: "/golf-coaching",
    pageFile: "client/src/pages/GolfLessonFormPage.tsx",
    component: "GolfLessonFormPage",
    seoKey: "golfLessons",
    aliases: ["/golf-lessons"],
  },
  {
    name: "Personal Training Request",
    route: "/personal-training-interest-form",
    pageFile: "client/src/pages/PersonalTrainingFormPage.tsx",
    component: "PersonalTrainingFormPage",
    seoKey: "personalTrainingRequest",
    aliases: ["/personal-training-request"],
  },
];

const confirmationRequiredFiles = new Set([
  "client/src/App.tsx",
  "client/src/components/Navbar.tsx",
  "client/src/lib/seo-data.ts",
  "scripts/seo-audit/generate-public-seo-files.ts",
  "scripts/seo-audit/generate-static-route-html.ts",
  "vercel.json",
  ...protectedLandingPages.map((page) => page.pageFile),
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertRouteContract() {
  const app = read("client/src/App.tsx");
  const seo = read("client/src/lib/seo-data.ts");
  const sitemapGenerator = read("scripts/seo-audit/generate-public-seo-files.ts");
  const staticGenerator = read("scripts/seo-audit/generate-static-route-html.ts");
  const sitemap = read("client/public/sitemap.xml");
  const vercel = JSON.parse(read("vercel.json"));
  const redirects = vercel.redirects ?? [];

  for (const page of protectedLandingPages) {
    assert.ok(existsSync(new URL(`../${page.pageFile}`, import.meta.url)), `${page.name} page file is missing`);
    assert.match(
      app,
      new RegExp(`const\\s+${page.component}\\s*=\\s*lazy\\(\\(\\)\\s*=>\\s*import\\("${escapeRegExp(`./pages/${page.component}`)}"\\)\\)`),
      `${page.name} component must be lazy-loaded in App.tsx`,
    );
    assert.match(
      app,
      new RegExp(`<Route\\s+path="${escapeRegExp(page.route)}"\\s+component=\\{${page.component}\\}\\s+/>`),
      `${page.name} route ${page.route} must be registered in App.tsx`,
    );
    assert.match(
      seo,
      new RegExp(`${page.seoKey}:\\s*\\{[\\s\\S]*?path:\\s*"${escapeRegExp(page.route)}"`),
      `${page.name} route must stay in SEO metadata`,
    );
    assert.match(
      sitemapGenerator,
      new RegExp(`SEO\\.${page.seoKey}\\.path`),
      `${page.name} route must stay in sitemap generation`,
    );
    assert.match(
      staticGenerator,
      new RegExp(`"${escapeRegExp(page.route)}"`),
      `${page.name} route must stay in static shell generation image metadata`,
    );
    assert.match(
      sitemap,
      new RegExp(`https://www\\.woodinvillesportsclub\\.com${escapeRegExp(page.route)}`),
      `${page.name} route must stay in the committed sitemap`,
    );

    for (const alias of page.aliases) {
      assert.equal(
        redirects.some((redirect) => redirect.source === alias && redirect.destination === page.route && redirect.permanent === true),
        true,
        `${alias} must permanently redirect to protected landing page ${page.route}`,
      );
    }
  }
}

function changedFilesForPullRequest() {
  if (process.env.GITHUB_EVENT_NAME !== "pull_request" || !process.env.GITHUB_EVENT_PATH) return [];

  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  const baseSha = event.pull_request?.base?.sha;
  const headSha = event.pull_request?.head?.sha;

  if (!baseSha || !headSha) {
    throw new Error("Protected landing page confirmation check could not read pull request base/head SHAs.");
  }

  return execFileSync("git", ["diff", "--name-only", `${baseSha}...${headSha}`], { encoding: "utf8" })
    .split("\n")
    .map((file) => file.trim())
    .filter(Boolean);
}

function assertPullRequestConfirmation() {
  const changedProtectedFiles = changedFilesForPullRequest().filter((file) => confirmationRequiredFiles.has(file));
  if (changedProtectedFiles.length === 0) return;

  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  const body = event.pull_request?.body ?? "";
  const hasApprovalLine = /Protected ad landing page change approved by:\s*@?[A-Za-z0-9._-]+/i.test(body);
  const hasAdsReview = /Google Ads impact reviewed:\s*yes/i.test(body);

  assert.equal(
    hasApprovalLine && hasAdsReview,
    true,
    [
      "Protected ad landing page files changed without explicit PR confirmation.",
      "Add both lines to the PR body before merging:",
      "Protected ad landing page change approved by: @name",
      "Google Ads impact reviewed: yes",
      "",
      "Changed protected files:",
      ...changedProtectedFiles.map((file) => `- ${file}`),
    ].join("\n"),
  );
}

assertRouteContract();
assertPullRequestConfirmation();

console.log(`Protected landing page guard passed for ${protectedLandingPages.length} page(s).`);
