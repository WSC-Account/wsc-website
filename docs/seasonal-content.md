# Calendar-driven seasonal content

The published schedule lives in `client/src/lib/session-calendar.ts`. The homepage, session calendar, navigation, footer, and marketing banner derive current sessions and upcoming registration from that same data.

- Dates are evaluated in America/Los_Angeles, regardless of the visitor's timezone. Session end dates are inclusive.
- Registration opens on the published session-drop date; auto-enrollment remains a separate published date.
- Open tabs refresh their calendar date every 30 seconds and when brought back into focus.
- Keep exact dates in the existing “October 5, 2026” format. Approximate dates such as “Mid-January 2027” are displayed but never used to claim registration is open.
- Extend the schedule when new dates are approved. The current calendar ends August 29, 2027. After that, promotional content falls back to general programs rather than advertising an expired session.
- The detailed summer pages and tournament links describe Summer 2026 only. They expire after August 30, 2026 and must not be reused for a future summer without updating that year's program details. Visitors to old URLs see a completed-season notice and current program links.

Calendar boundary tests run with `pnpm test`. Check `pnpm verify` and `pnpm test:e2e` before deploying calendar changes.
