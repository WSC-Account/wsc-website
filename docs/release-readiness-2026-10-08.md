# WSC release readiness — October 8, 2026

The next audit pass fixed deployment packaging, a standalone-server path traversal, and Google consent boundaries on `codex/website-audit-cleanup`, based on `4f166f8`; the Adult Tennis and Connor Vordale work is preserved. This report records validation before publication. That validation did not merge or deploy code, create paid services, change production configuration, submit real forms, or send email. Subsequent release status belongs in the pull request and deployment checks.

## Confirmed production state

Read-only Vercel CLI queries identified project `woodinville-sports-club-wsc` under `caliber-labs`. The active production deployment is ready and points to `main` commit `8fe73d559f3e05a92ec262fe8f29dcdde1b81d63`. It does not contain this audit work. Production uses Node 24.x, Fluid compute, and region `iad1`.

Production environment **names**, not decrypted values, were inspected. No Redis REST or recording-webhook configuration is present, and the project's integration resource listing is empty. Existing Postmark and Constant Contact variable names are present; this does not prove those credentials or delivery work. Sanitized evidence is in `output/release-readiness-2026-10-08/vercel-readiness.json`.

## Completed local changes

1. **Confined standalone HTML serving to its public directory.** A raw HTTP request with parent-directory segments could previously return HTML outside `dist/public`. The fallback now checks the resolved path boundary. A real HTTP fixture verifies literal/encoded traversal attempts return 404 while normal pages, redirects, caching, and security headers still work. This finding concerns the Express server; it does not establish that Vercel's static hosting shared the issue.
2. **Excluded local state from Vercel releases.** `.vercelignore` and function-level exclusions now block local `data/`, environment files, audit output, and browser artifacts. A filename-only `pnpm vercel:bundle-check` refuses contaminated or incomplete prebuilt output without opening records or credentials.
3. **Fixed native Vercel API imports.** Relative server/shared imports use `.js` specifiers, allowing compiled API modules to load directly in Node. The prior extensionless imports passed the bundled Express build but failed native module resolution. Both Vercel APIs loaded and handled OPTIONS/GET in an isolated fresh Vercel build with synthetic data sentinels; the sentinels were excluded. API duration is 150 seconds to accommodate bounded storage/provider operations within the 180-second request lease. CI now uses Node 24 to match production.
4. **Contained linked Google tracking.** The public Google configuration connects Analytics and Ads. Google scripts and events now require both Analytics and Marketing permission, and Google consent updates deny all four types when either choice is off. Vercel/Umami remain controlled by Analytics; attribution storage remains controlled by Marketing. The preference dialog explains this arrangement. This restriction stays until the external destinations can be separated and verified. Custom Analytics events explicitly target the shared GA4 measurement ID; an invalid configured ID suppresses those events instead of falling back to Google's default destination group. Explicit Ads conversion labels are preserved.

Old local `.vercel/output` contains paths for form records and the newsletter token cache inside both API bundles. Only filenames were inspected. This is **not evidence that customer records or credentials were publicly exposed**. The stale output remains untouched and must not be deployed. `pnpm build` refreshes `dist/`, not `.vercel/output`; any prebuilt deployment requires a fresh Vercel build and a passing bundle check. The isolated packaging build was credential-free and did not deploy anything.

Vercel configuration references: [function exclusions and duration](https://vercel.com/docs/project-configuration/vercel-json), [function duration limits](https://vercel.com/docs/functions/configuring-functions/duration).

## Google configuration findings and proposed corrections

The audit downloaded public Google configuration, then replayed initialization in an isolated browser with all measurement requests blocked. It did not submit synthetic events to Google or use private Ads/Analytics administration. Detailed evidence and limitations are in `output/tracking-audit-2026-10-08/report.md`.

| Finding | Proposed correction / decision |
| --- | --- |
| GA4 `G-S6448TRP0T` connects to Ads `AW-16588347914`; the app and GTM also configure `AW-18217215416`. | Confirm whether the older Ads destination is intentional. Proposed default: keep only `AW-18217215416`, after verifying ownership and campaign use. |
| Two manual screen views produced four main GA4 page-view events in the blocked replay. Published Google configuration also enables automatic history measurement. | Keep the app as the page-view owner; disable the competing automatic initial/history paths in Google/GTM. Adding `send_page_view: false` locally to Ads/global config did not solve the replay duplicates. |
| GTM sends an Ads conversion on a membership-page link click. | Treat it as an interest metric unless a completed membership can be verified. Decide whether it should remain a secondary conversion; private bidding configuration was not inspected. |
| Published Google tags enable automatic detection of email and, in the newer tag, phone/address data. | Confirm whether this collection is intended and scope fields/pages appropriately. Configuration alone does not prove customer data was transmitted. |

After the account changes, repeat the blocked-network four-consent-combination check and require one GA4 page-view event per screen before lifting the temporary paired-permission rule. No duplicate fitness-assessment conversion was demonstrated. See Google's [manual page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views) and [consent behavior](https://developers.google.com/tag-platform/security/guides/consent).

## Shared storage decision

Cross-instance request deduplication, rate limits, durable submission records, and rotating newsletter credentials need shared storage. The code supports Redis REST through `FORM_REDIS_REST_URL` / `FORM_REDIS_REST_TOKEN` or the KV equivalents. Preview and production must use separate stores. Default retention is 30 days for submission records, 24 hours for retry coordination, and 180 days for newsletter token pairs.

The proposed setup is separate Upstash databases through Vercel, each with an enforceable maximum budget of $10/month. The user approved proceeding with the release plan at a total budget of up to $20/month; provisioning was not part of the validation recorded here. Confirm the selected plan's request-size allowance accommodates an approximately 3.4 MB encoded resume record, and verify the billing cap before purchase. Alternatives are a user-supplied existing Redis service or leaving this unconfigured with per-process guarantees only. See [Vercel Redis options](https://vercel.com/docs/redis) and [Upstash pricing](https://upstash.com/pricing/redis).

Once configured, validate isolated preview storage first, including request acknowledgement, retention and concurrent retry/token coordination. Real email or newsletter enrollment tests must use an intentionally selected test recipient and account. Staff ownership of uncertain delivery remains a separate operational decision; there is no background retry worker or dashboard in this change.

## Verification

- `pnpm verify`: 130 passing tests, TypeScript, production build, and image-reference validation.
- `pnpm test:e2e`: 60 desktop/mobile production browser checks passed. After the final explicit event-routing change, all 22 relevant consent/form and integration checks passed again against the rebuilt production output; results are in `e2e-final-tracking.log`.
- `pnpm audit --json`: zero reported dependency advisories.
- Fresh isolated Vercel build: both APIs loaded in native Node 24; OPTIONS returned 204, GET returned 405; local-state sentinel exclusions and bundle guard passed.
- Inventory: 429 images, 59 generated HTML routes, no missing image references. No public images were deleted.

Logs and sanitized release metadata are in `output/release-readiness-2026-10-08/`. Local form tests use fakes; browser submissions are intercepted. These results establish local behavior and packaging, not production email delivery or corrected Google account configuration.

The full cleanup is documented in [the implementation report](code-audit-implementation-2026-10-07.md). Storage provisioning within the approved budget and verification of Google destination ownership remain necessary before completing the live configuration checks.
