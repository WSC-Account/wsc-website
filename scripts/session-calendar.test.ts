import test from "node:test";
import assert from "node:assert/strict";
import {
  calendarDay,
  pacificDay,
  seasonalState,
  sessions,
  sessionStatus,
  summer2026Available,
  summer2026Headline,
} from "../client/src/lib/session-calendar";

test("today promotes Fall 2 registration while identifying Fall 1 as current", () => {
  const state = seasonalState("2026-09-20");
  assert.equal(state.current?.name, "Fall 1");
  assert.equal(state.next?.name, "Fall 2");
  assert.equal(state.title, "Fall 2 Registration Is Open");
  assert.match(state.description, /October 5, 2026/);
  assert.equal(state.external, true);
  assert.equal(state.showSummer2026, false);
});

test("session boundaries include the entire last Pacific day", () => {
  const before = pacificDay(new Date("2026-10-05T06:59:59Z"));
  const after = pacificDay(new Date("2026-10-05T07:00:00Z"));
  assert.equal(before, "2026-10-04");
  assert.equal(after, "2026-10-05");
  assert.equal(seasonalState(before).current?.name, "Fall 1");
  const next = seasonalState(after);
  assert.equal(next.current?.name, "Fall 2");
  assert.equal(next.next?.name, "Fall 3");
  assert.equal(next.open, undefined);
  assert.equal(next.title, "Fall 2 Is in Session");
});

test("registration opens on the published drop day, not earlier", () => {
  assert.equal(seasonalState("2026-10-11").open, undefined);
  assert.equal(seasonalState("2026-10-12").open?.name, "Fall 3");
  assert.equal(sessionStatus(sessions[0], "2026-10-05").label, "Past");
});

test("winter break and next year's sessions cross the year boundary", () => {
  assert.equal(seasonalState("2026-12-21").current?.name, "Winter Break Camps");
  assert.equal(seasonalState("2027-01-03").current?.name, "Winter Break Camps");
  assert.equal(seasonalState("2027-01-04").current?.name, "Winter 1");
  assert.equal(seasonalState("2027-01-04").next?.name, "Winter 2");
});

test("Pacific calendar dates handle daylight saving changes", () => {
  assert.equal(pacificDay(new Date("2026-11-01T07:00:00Z")), "2026-11-01");
  assert.equal(pacificDay(new Date("2026-11-01T09:00:00Z")), "2026-11-01");
  assert.equal(pacificDay(new Date("2027-03-15T06:59:59Z")), "2027-03-14");
  assert.equal(pacificDay(new Date("2027-03-15T07:00:00Z")), "2027-03-15");
});

test("approximate registration dates never manufacture an open date", () => {
  assert.equal(calendarDay("Mid-January 2027"), undefined);
  const state = seasonalState("2027-06-01");
  assert.equal(state.next?.name, "Summer");
  assert.equal(state.open, undefined);
  assert.match(state.description, /Mid-January 2027/);
  assert.equal(state.external, false);
});

test("summer promotion changes in its last week then expires permanently", () => {
  assert.equal(summer2026Headline("2026-08-23"), "Summer Training Is Underway");
  assert.equal(summer2026Headline("2026-08-24"), "One Week Left of Summer!");
  assert.equal(summer2026Available("2026-08-30"), true);
  assert.equal(summer2026Available("2026-08-31"), false);
  assert.equal(summer2026Available("2027-07-01"), false);
  assert.equal(summer2026Headline("2027-07-01"), "Summer 2026 Has Ended");
});

test("expired or empty calendars fall back without stale registrations", () => {
  for (const state of [
    seasonalState("2027-08-30"),
    seasonalState("2026-09-20", []),
  ]) {
    assert.equal(state.current, undefined);
    assert.equal(state.next, undefined);
    assert.equal(state.open, undefined);
    assert.equal(state.title, "Explore WSC Programs");
    assert.equal(state.ctaHref, "/sessions");
    assert.match(state.description, /New session dates/);
  }
});

test("all published session ranges are exact, ordered, and non-overlapping", () => {
  for (const [index, session] of sessions.entries()) {
    const start = calendarDay(session.start);
    const end = calendarDay(session.end);
    assert.ok(start && end && start <= end, session.name);
    if (index > 0) assert.ok(calendarDay(sessions[index - 1].end)! < start);
  }
});
