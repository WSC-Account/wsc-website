# WSC audit implementation

October 7, 2026

Updated October 8: [release readiness](release-readiness-2026-10-08.md) records the subsequent production configuration inspection, deployment fixes, and external Google tracking findings. Its validation results supersede the earlier counts below.

Implemented on `codex/website-audit-cleanup`, based on `4f166f8` with the Adult Tennis and Connor Vordale work preserved. This report records the local cleanup and validation before publication; subsequent release status belongs in the pull request and deployment checks. No live form submission, email, or infrastructure provisioning was performed during this validation.

## Measured results

| Measure | Before | After |
|---|---:|---:|
| Unreachable client modules | 54 | 0 detected by runtime import scan |
| Direct production dependencies | 47 | 14 |
| Reported dependency advisories | 26 | 0 |
| Generated CSS | 177,949 bytes | 101,656 bytes, down 42.9% |
| CSS with Node's default gzip | 26,406 bytes | 16,016 bytes, down 39.3% |
| Sitemap URLs | 50 | 50, same inclusion and priorities |
| Static HTML routes | 59 | 59, same canonical/robots/image policies |

These are local build and audit measurements, not a field-speed or Lighthouse score. The initial JavaScript bundle remains approximately 320 kB before compression. Removing unused scaffolding mainly reduced generated CSS and maintenance burden.

## What changed

- Removed 49 unused UI wrappers, three unused hooks, the obsolete Terms page, and the unused MarketingBanner. Active policies, seasonal banners, accordion/dialog/toast components, and legacy URLs remain supported. Removed 33 unused production packages and unused Google Maps types; applied compatible security updates.
- Limited stale-route recovery to one automatic reload per route in five minutes. Persistent failures and restricted storage now leave a useful manual recovery screen.
- Replaced double navigation for section links with one history entry. Shared hash scrolling waits for lazy content, preserves modified clicks, and keeps policy-tab changes from jumping to the page top.
- Made homepage picture sources and static preloads respect screen size. Desktop checks requested the aerial hero without the hidden sunset image; mobile checks requested the sunset hero without the hidden aerial image.
- Centralized independent analytics and marketing consent. Vercel/Umami follow Analytics; campaign-attribution storage follows Marketing. The October 8 external audit found linked Google destinations, so Google scripts and events now require both choices pending account cleanup. Footer preferences can be reopened, and saved consent withdrawal refreshes the page to unload initialized trackers.
- Legitimate fast submissions retain entered values and show a retry message. Newsletter confirmation distinguishes confirmed enrollment from a signup request sent to staff. Conversion events still occur only after successful submissions.
- Added server-side rate limits, idempotent retries, provider deadlines, explicit partial/uncertain delivery states, and PDF/DOC/DOCX resume validation. Confirmed provider operations are not repeated on the same retry; failed webhook recording can recover independently of a successful local record.
- Added optional shared Redis REST storage for submission records, request coordination, and rotating Constant Contact credentials. Storage writes require acknowledgements; ambiguous provider outcomes display a reference for staff investigation.
- Derived tournament status from explicit dates in Pacific time, including expiry on an already open page. Gallery captions now remain readable on touch devices. Seasonal consumers share one timer and focus/visibility subscription.
- Consolidated generator metadata in `shared/route-metadata.json`, retaining existing SEO and route policies. Added the free fitness assessment to the protected landing-page checks, preserving its indexability and sitemap exclusion.
- Changed browser CI to exercise production output, added daily dependency audits, and updated setup/maintenance documentation.

## Follow-up cleanup

- Form retry keys now survive a page reload in the same tab for 24 hours. Session storage holds only SHA-256 fingerprints, random request keys, and timestamps, with a 32-entry cap and automatic expiry. Form fields and resume contents are not persisted. Successful submissions clear their keys; changed payloads get new keys. Restricted storage still falls back to memory for the current page.
- Shared public form contracts now keep browser and server request/response types aligned. The main request handler is 434 lines, down from 1,297 after the reliability work, with provider integration, validation, and internal types in focused modules. Existing validation and delivery behavior remain covered by the offline provider tests.
- Removed the unused theme-switching provider and hook, retaining the existing light presentation. TypeScript now rejects unused locals, imports, and parameters.
- Added `pnpm assets:check` to `pnpm verify`. The checker walks active source imports, route metadata, responsive candidates, CSS, and generated HTML. Current inventory: 429 public images, zero missing references, and zero unresolved dynamic image expressions. `pnpm assets:audit` saves the detailed inventory.
- The conservative inventory lists **38 unused-image candidates (2,352,153 bytes)** and **15 groups of identical images (1,363,427 redundant bytes)**. The two byte totals overlap. No public image URLs were removed: external use in email, ads, or bookmarks still needs review.
- Added an offline, secret-redacting storage configuration check. `pnpm forms:storage-check --require-shared` correctly fails on this checkout because shared storage is not configured locally. This is an outstanding deployment configuration requirement, not a code-test failure; the October 8 metadata inspection also confirmed shared storage is absent in production. Legacy newsletter refresh/sync utilities now reject shared-storage environments so their isolated caches cannot invalidate coordinated OAuth credentials.

## Verification

Final verification results are recorded with the logs in `output/code-audit-implementation-2026-10-07/`.

- `pnpm verify`: **118 passing unit/content tests**, TypeScript, production build, and image-reference validation.
- `pnpm test:e2e`: **60 desktop/mobile production browser checks**, including route failures, section history, policy scrolling, consent combinations/withdrawal, form recovery across reloads, seasonal rollover, tournament expiry, generated metadata, redirects, and HTTP 404s.
- `pnpm audit --json`: zero currently reported advisories.
- Runtime import scan: 76 client modules, no unreachable modules, no direct production dependencies outside the runtime graph.
- Isolated metadata comparison: identical 50 sitemap entries and 59 static routes.
- Visual review: desktop/mobile homepage, mobile consent controls, and gallery captions. Screenshots are in `output/playwright/cleanup-*.png`.
- Backend tests use fake providers/storage and make no live provider calls. Browser form submissions are mocked. These checks do not establish production email delivery or external GTM behavior.

## Deployment decisions and remaining recommendations

1. **Connect shared storage before relying on cross-instance guarantees.** Set `FORM_REDIS_REST_URL` and `FORM_REDIS_REST_TOKEN`, or the supported KV equivalents, with separate preview/production stores. The chosen service must accommodate resume records of roughly 3.4 MB after base64 encoding. Current retention defaults are 30 days for submissions, 24 hours for retry coordination, and 180 days for the newsletter token cache; confirm these operational choices. Without shared storage, coordination is per process and Vercel JSONL files remain temporary.
2. **Decide who handles failed or uncertain delivery.** This implementation retries failed steps when a visitor retries an unchanged request; it does not include a background worker or staff dashboard. Same-tab retries retain their keys across reloads for 24 hours when session storage is available. New tabs, blocked storage, edits, or expiry can create a new key; use the displayed submission reference to investigate uncertain outcomes before resending. A recording webhook must retain submissions and honor its supplied idempotency key.
3. **Correct the external Google configuration before release.** The October 8 public-configuration inspection and blocked-network replay found linked Ads destinations and duplicate GA4 pageviews. The local gate now requires both consent choices for Google. Destination ownership and automatic tracking settings still need decisions and account changes; see [release readiness](release-readiness-2026-10-08.md). Live provider credentials were not tested.
4. **Keep broader refactors separate.** Public image pruning still needs confirmation that old image URLs are not used by ads/email; the new inventory makes that review concrete. Prerendering actual route components remains a follow-up opportunity if startup layout/SEO-shell drift is a priority. Express remains supported and is tested by the production browser suite.
5. **Resolve business-content questions using the corrections worksheet.** Cleanup does not establish the correct prices, program promises, schedules, or policies where the prior content review identified contradictions.

Deployment setup and limits are documented in [README.md](../README.md). The original findings remain in [the audit report](code-audit-2026-10-07.md).
