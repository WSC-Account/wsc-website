import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("main navigation labels the gym route as Fitness Centers", () => {
  const navbar = read("client/src/components/Navbar.tsx");

  assert.match(navbar, /href:\s*"\/gym",\s*label:\s*"Fitness Centers"/);
});

test("golf page links Tier 1 Golf to the Tier 1 golf page", () => {
  const golf = read("client/src/pages/Golf.tsx");

  assert.match(golf, /https:\/\/www\.tier1nw\.com\/golf/);
});

test("golf simulator section does not promote trial membership", () => {
  const golf = read("client/src/pages/Golf.tsx");

  assert.doesNotMatch(golf, /Trial Access|Trial golf simulator|Trial members/i);
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
