import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("main navigation labels the gym route as Fitness Centers", () => {
  const navbar = read("client/src/components/Navbar.tsx");

  assert.match(navbar, /href:\s*"\/gym",\s*label:\s*"Fitness Centers"/);
});

test("golf academy registration links open WSC CourtReserve", () => {
  const golf = read("client/src/pages/Golf.tsx");
  const sectionStart = golf.indexOf("{/* Tier 1 Golf Academy */}");
  const sectionEnd = golf.indexOf("{/* Range Pricing */}");
  const academySection = golf.slice(sectionStart, sectionEnd);

  assert.notEqual(sectionStart, -1);
  assert.notEqual(sectionEnd, -1);
  assert.match(golf, /const COURT_RESERVE_URL = "https:\/\/app\.courtreserve\.com\/Online\/Portal\/Index\/6689"/);
  assert.match(academySection, /href=\{COURT_RESERVE_URL\}/);
  assert.match(academySection, /Register in CourtReserve/);
  assert.doesNotMatch(academySection, /href=\{TIER1_GOLF_URL\}|href="\/membership"/);
});

test("golf simulator section does not promote trial membership", () => {
  const golf = read("client/src/pages/Golf.tsx");

  assert.doesNotMatch(golf, /Trial Access|Trial golf simulator|Trial members/i);
});

test("covered driving bay count is not capped at 23", () => {
  const files = [
    "client/src/pages/About.tsx",
    "client/src/pages/Golf.tsx",
    "client/src/pages/Home.tsx",
    "client/src/pages/Summer.tsx",
    "client/src/pages/Policies.tsx",
    "client/src/pages/Terms.tsx",
    "client/src/components/StructuredData.tsx",
    "client/index.html",
  ];

  for (const file of files) {
    const source = read(file);
    const sourceWithoutAllowedCounts = source.replace(/more than 23/gi, "").replace(/23\+/g, "");

    assert.doesNotMatch(sourceWithoutAllowedCounts, /\b23(?:-bay| covered| bays)/i, `${file} should not use 23 as the exact covered bay count`);
    assert.doesNotMatch(source, /val:\s*"23",\s*label:\s*"Covered(?: Driving)? Bays/i, `${file} should not use 23 as an exact covered bay stat`);
  }
});

test("policies page uses the full collapsible membership agreement", () => {
  const policies = read("client/src/pages/Policies.tsx");

  assert.match(policies, /Accordion/);
  assert.match(policies, /RELEASE OF LIABILITY AND ASSUMPTION OF RISK/);
  assert.match(policies, /Member\/Passholder agrees to make timely payment of ALL fees/);
  assert.match(policies, /WSC may take images or videos of Member\/Passholders and guests/);
  assert.doesNotMatch(policies, /The WSC Membership Agreement was last updated on/);
  assert.doesNotMatch(policies, /Using WSC facilities, services, or activities involves the risk of injury, ranging from minor to catastrophic injuries including death/);
});

test("gym page does not mention class packages", () => {
  const gym = read("client/src/pages/Gym.tsx");

  assert.doesNotMatch(gym, /packages?/i);
  assert.doesNotMatch(gym, /4\/8\/∞/);
});

test("APL group classes link to the Tier 1 APL page", () => {
  const gym = read("client/src/pages/Gym.tsx");

  assert.match(gym, /https:\/\/www\.tier1nw\.com\/apl/);
});

test("personal training does not publish Dom's direct email", () => {
  const gym = read("client/src/pages/Gym.tsx");

  assert.doesNotMatch(gym, /dgraham@woodinvillesportsclub\.com/i);
  assert.doesNotMatch(gym, /Email Don Graham/i);
});

test("junior tennis pathway sends deeper details to Tier 1", () => {
  const tennis = read("client/src/pages/Tennis.tsx");

  assert.match(tennis, /Explore the Junior Pathway at Tier 1/);
  assert.match(tennis, /https:\/\/www\.tier1nw\.com\/tennis\/intro-classes/);
});

test("home facility chart includes golf sims and both fitness centers", () => {
  const home = read("client/src/pages/Home.tsx");

  assert.match(home, /Indoor Golf Sims/);
  assert.match(home, /Fitness Centers/);
  assert.match(home, /Main Gym \+ APL/);
});

test("founded year is 1976 across visible and structured content", () => {
  const files = [
    "client/src/pages/Home.tsx",
    "client/src/pages/About.tsx",
    "client/src/components/Footer.tsx",
    "client/src/components/StructuredData.tsx",
    "client/index.html",
  ];

  for (const file of files) {
    const source = read(file);

    assert.match(source, /1976/, `${file} should reference 1976`);
    assert.doesNotMatch(source, /1979/, `${file} should not reference 1979`);
  }
});
