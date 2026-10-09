import assert from "node:assert/strict";
import test from "node:test";
import { pacificDay } from "../client/src/lib/session-calendar";
import { tournamentState } from "../client/src/lib/tournament-calendar";

const tournament = { startDate: "2026-08-10", endDate: "2026-08-14" };

test("multi-day tournaments remain current through the final Pacific day", () => {
  assert.deepEqual(tournamentState(tournament, "2026-08-09"), { status: "Upcoming", showInUpcoming: true });
  for (const today of ["2026-08-10", "2026-08-12", "2026-08-14"]) {
    assert.deepEqual(tournamentState(tournament, today), { status: "In progress", showInUpcoming: true });
  }
  assert.deepEqual(tournamentState(tournament, "2026-08-15"), { status: "Completed", showInUpcoming: false });
});

test("single-day tournaments expire at Pacific midnight, not UTC midnight", () => {
  const singleDay = { startDate: "2026-07-09", endDate: "2026-07-09" };
  assert.equal(tournamentState(singleDay, pacificDay(new Date("2026-07-10T06:59:59Z"))).status, "In progress");
  assert.deepEqual(tournamentState(singleDay, pacificDay(new Date("2026-07-10T07:00:00Z"))), {
    status: "Completed", showInUpcoming: false,
  });
});

test("TBD overrides preserve unconfirmed details without keeping expired cards upcoming", () => {
  const unconfirmed = { startDate: "2026-11-11", endDate: "2026-11-11", statusOverride: "TBD" as const };
  for (const today of ["2026-10-07", "2026-11-11"]) {
    assert.deepEqual(tournamentState(unconfirmed, today), { status: "TBD", showInUpcoming: true });
  }
  assert.deepEqual(tournamentState(unconfirmed, "2026-11-12"), { status: "TBD", showInUpcoming: false });
});

test("invalid dates and reversed tournament ranges fail instead of silently misclassifying events", () => {
  assert.throws(() => tournamentState({ startDate: "2026-02-30", endDate: "2026-03-01" }, "2026-02-28"), RangeError);
  assert.throws(() => tournamentState({ startDate: "2026-08-14", endDate: "2026-08-10" }, "2026-08-12"), RangeError);
  assert.throws(() => tournamentState(tournament, "August 14, 2026"), RangeError);
});
