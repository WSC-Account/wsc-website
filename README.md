# Woodinville Sports Club Website

Production website for Woodinville Sports Club, a sports campus in Woodinville, Washington. The site covers tennis, golf, gym and fitness, pickleball, summer programs, memberships, events, careers, policies, blog resources, and contact flows.

## Stack

- React 19 and TypeScript
- Vite 8 with Tailwind CSS 4
- Wouter routing
- Express production server
- Vercel deployment config
- Postmark-backed website form notifications
- Static SEO shell generation for public routes

## Quick Start

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The development server runs Vite. It will use port `3000` when available.

## Scripts

```bash
pnpm dev
pnpm check
pnpm build
pnpm start
pnpm verify
pnpm test:e2e
pnpm audit
pnpm assets:check
pnpm forms:storage-check
pnpm vercel:bundle-check
```

- `pnpm dev` starts local Vite development.
- `pnpm check` runs TypeScript without emitting files.
- `pnpm build` generates robots/sitemap files, builds the Vite app, creates route-specific HTML shells, defers built CSS, and bundles the Express server.
- `pnpm start` serves the production build from `dist/`.
- `pnpm verify` runs unit/content checks, TypeScript (including unused local/import checks), a production build, and image-reference validation.
- `pnpm test:e2e` tests the production build on desktop and mobile Chromium using the Express server on port `4187`; run `pnpm build` first. For development-only checks, use `PLAYWRIGHT_USE_DEV_SERVER=1 pnpm test:e2e`.
- `pnpm audit` checks currently published dependency advisories. CI runs this daily and fails on high/critical findings.
- `pnpm assets:check` checks active source and built HTML image references; build first. `pnpm assets:audit` also saves an inventory of unused and duplicate image candidates to `output/asset-audit.json` without deleting public URLs.
- `pnpm forms:storage-check` checks local storage configuration offline without printing secrets. Add `--require-shared` to fail when shared storage is absent, or `--env-file=path` to check a specific file instead of `.env` / `.env.local`. Process environment variables take precedence. This does not verify credentials or deployed settings.
- `pnpm vercel:bundle-check` checks filenames in a fresh `.vercel/output` without reading their contents. It rejects local records, environment files, and audit artifacts in deployment output and requires both form API functions. Pass a different output directory as an argument when validating an isolated build.

## Project Structure

```text
client/src/pages/           Route-level pages
client/src/components/      Shared UI and layout components
client/src/lib/seo-data.ts  Canonical page SEO metadata
shared/route-metadata.json  Sitemap, static-shell, image, and landing-page policies
shared/form-contracts.ts    Public form request and response types
client/public/images/wsc/   Production image assets
server/                     Express server and form handling
api/                        Vercel-compatible API handlers
scripts/seo-audit/          SEO, sitemap, redirect, and static-shell tooling
```

## Public Routes

The main website routes are registered in `client/src/App.tsx`.

- `/`
- `/tennis`
- `/golf`
- `/gym`
- `/fitness`
- `/pickleball`
- `/summer`
- `/membership`
- `/sessions`
- `/events`
- `/careers`
- `/blog`
- `/about`
- `/contact`
- `/pro-shop`
- `/faq`
- `/policies`
- `/privacy`
- `/accessibility`

Legacy Wix URLs are handled through `vercel.json` redirects and SEO audit scripts.

## Environment

Copy `.env.example` to `.env.local` for local secrets. Analytics is optional and consent-gated. Vercel Web Analytics is enabled through `@vercel/analytics` and does not require an env var in this app; enable Web Analytics for the project in Vercel. Optional self-hosted analytics and GA4 can be configured with:

```bash
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
NEXT_PUBLIC_GA_ID=G-S6448TRP0T
VITE_GTM_CONTAINER_ID=GTM-PKPNJDFR
```

Optional Umami analytics and Vercel Web Analytics load only with analytics consent. Campaign-attribution storage requires marketing consent. The published Google configuration links Analytics and Ads destinations, so all Google scripts (GA4, Ads, and GTM) and their events currently require **both** choices. The preferences remain independent for other services. Visitors can reopen preferences from the footer; withdrawing consent clears campaign attribution and refreshes the page to unload initialized trackers. Separating Google consent again requires separating and verifying the external Google destinations first. The October 8 blocked-network audit also found duplicate Google pageviews; fixing the published Google configuration remains necessary. See [release readiness](docs/release-readiness-2026-10-08.md).

Website forms submit to `/api/contact`, attempt a local JSONL record, and send notifications through Postmark:

```bash
POSTMARK_SERVER_TOKEN=your-postmark-server-token
POSTMARK_MESSAGE_STREAM=outbound
POSTMARK_TEST_TO=
FORM_ALERT_TO=info@woodinvillesportsclub.com
FORM_ALERT_FROM="WSC Website <Info@woodinvillesportsclub.com>"
FORM_SUBMISSIONS_DIR=./data/form-submissions
FORM_WEBHOOK_URL=
FORM_REDIS_REST_URL=
FORM_REDIS_REST_TOKEN=
```

`FORM_ALERT_FROM` must use a sender signature or sender domain verified in Postmark. The visitor's email is sent as `ReplyTo`, never as the sender. `POSTMARK_MESSAGE_STREAM` defaults to `outbound`. Golf lesson submissions are additionally routed to `tier1golf@woodinvillesportsclub.com`; free fitness assessments also go to `camostad@woodinvillesportsclub.com`. Each notification gets a server-generated subject line and matching title in the email body.

Optional shared storage uses the [Redis REST protocol](https://upstash.com/docs/redis/features/restapi) through the two `FORM_REDIS_REST_*` variables; existing `KV_REST_API_URL` / `KV_REST_API_TOKEN` variables are also supported. Keep these credentials server-only. Configure separate storage for preview and production. Shared storage retains submissions for 30 days, coordinates unchanged retries for 24 hours, and shares rate limits across instances (20 requests per IP and five new submissions per email per ten minutes). It also coordinates Constant Contact token refreshes. This code does not provision a storage service.

Without shared storage, rate limits and deduplication are per process and reset on restart. Local JSONL files are best-effort: Vercel scratch files are temporary; an Express host must mount persistent storage for records to survive host replacement. An optional `FORM_WEBHOOK_URL` provides another recording destination; its successful acknowledgement is treated as acceptance for durable recording, so configure it only for a service that actually retains submissions.

Provider requests have bounded timeouts. Unchanged client retries reuse an idempotency key and only repeat confirmed failures; an ambiguous timeout shows a submission reference for staff to check before resending. Failed notifications are reported truthfully even when a record was saved. There is no background retry worker or staff submission dashboard in this implementation. Retry keys survive reloads in the same tab for 24 hours, using session storage containing only fingerprints, random request keys, and timestamps; fields and resumes are not saved there. Successful submissions clear the saved key, changed payloads get a new one, and blocked storage falls back to memory. Use the displayed reference to investigate uncertain delivery rather than editing or repeatedly resending it.

Newsletter signups can also be added directly to Constant Contact. Create a Constant Contact V3 API app, complete the OAuth flow once, then configure:

```bash
CONSTANT_CONTACT_CLIENT_ID=your-api-key
CONSTANT_CONTACT_CLIENT_SECRET=your-client-secret
CONSTANT_CONTACT_REFRESH_TOKEN=your-refresh-token
CONSTANT_CONTACT_LIST_IDS=primary-list-id
CONSTANT_CONTACT_INTEREST_LIST_MAP='{"Tennis updates":"tennis-list-id","Golf updates":"golf-list-id"}'
CONSTANT_CONTACT_TOKEN_CACHE_FILE=./data/constant-contact-token.json
CONSTANT_CONTACT_TEST_EMAIL=
```

`CONSTANT_CONTACT_LIST_IDS` is the default list membership for every newsletter signup. `CONSTANT_CONTACT_INTEREST_LIST_MAP` is optional JSON that maps the site checkbox labels to additional Constant Contact list IDs. With shared storage, the server saves rotated token pairs there for 180 days and locks concurrent refreshes. Without it, a standalone host uses `CONSTANT_CONTACT_TOKEN_CACHE_FILE`; Vercel uses only a per-instance cache, which is insufficient for reliable rotating credentials across instances. Configure shared storage before relying on automatic newsletter enrollment in production. `CONSTANT_CONTACT_ACCESS_TOKEN` is supported only as a short-lived fallback when refresh-token credentials are not configured. The site confirms enrollment only after Constant Contact confirms it; an unconfigured integration with a successful staff notification instead confirms receipt of a signup request.

Run `pnpm constant-contact:check` to validate the local Constant Contact env without touching the API. Run `pnpm constant-contact:check -- --refresh-token` to validate OAuth and write a fresh token cache. Run `pnpm constant-contact:check -- --sync-test --email=test@example.com` only when you intentionally want to create or update a test contact in the configured list.

The legacy Constant Contact utility's refresh/sync modes and the form smoke script's newsletter sync modes are disabled whenever shared storage variables are configured: those utilities use isolated token caches and cannot coordinate rotating credentials across instances. Use the application's coordinated newsletter flow in that environment; the offline setup check and ordinary Postmark test mode remain available.

Run `pnpm postmark:check` before launch to confirm the required Postmark environment is present without sending an email. Run `pnpm postmark:check -- --send-test --test-api-token --to=Info@woodinvillesportsclub.com` to validate a single Postmark API send without delivering it. Run `pnpm postmark:smoke-forms` to submit every live website form type through `/api/contact` with Postmark's test API token and `Info@woodinvillesportsclub.com` as the configured recipient. The form smoke test disables Constant Contact by default so test payloads do not enter live newsletter lists; pass `--constant-contact --form=newsletter_signup` only for a deliberate Constant Contact sync test. After Postmark approves the account and the sender signature or domain is verified, run `pnpm postmark:check -- --send-test --to=you@example.com` or set `POSTMARK_TEST_TO` to send a deliberate real test message through the configured message stream.

## Forms

The active forms are:

- Contact form on `/contact`
- Free fitness assessment form on `/free-fitness-assessment` and the shared assessment modal
- Newsletter signup form on `/` and `/newsletter-signup`
- Membership cancellation request form on `/member-request`, `/member-cancellation`, and `/member-cancelation`
- Personal training interest form on `/personal-training-interest-form` and `/personal-training-request`
- Golf lesson request form on `/golf`, `/golf-coaching`, and `/golf-lessons`
- Private events inquiry form on `/events` and `/events-1`
- Careers application form on `/careers`

Client-side form submission is centralized in `client/src/lib/forms.ts`, with retry persistence in `form-idempotency.ts` and public types in `shared/form-contracts.ts`. The server separates request coordination/recording (`form-submissions.ts`), validation (`form-validation.ts`), Postmark/Constant Contact providers (`form-providers.ts`), storage (`form-store.ts`), and bounded HTTP requests (`form-http.ts`). `/api/forms` remains as a compatibility alias for older clients. Offline tests inject provider/storage implementations and never send real notifications.

## SEO and Static Output

Page metadata is managed in `client/src/lib/seo-data.ts`. The build process uses it to generate:

- `client/public/robots.txt`
- `client/public/sitemap.xml`
- route-specific HTML shells in `dist/public`

When adding or removing public pages, update:

- `client/src/App.tsx`
- `client/src/lib/seo-data.ts`
- `shared/route-metadata.json` (both generators consume this shared policy)
- `vercel.json` redirects if legacy URLs should point somewhere specific

## Content and Images

Most marketing content lives in `client/src/pages`. Shared layout, navigation, footer, banners, and structured data live in `client/src/components`.

Production-ready images should live in `client/public/images/wsc/`. Hero and page images are referenced from page files and from the static route generation script.

## Deployment

The repository is configured for Vercel:

```bash
pnpm build
```

Vercel uses:

- build command: `pnpm build`
- install command: `pnpm install --frozen-lockfile`
- output directory: `dist/public`
- API duration: 150 seconds, covering bounded storage/provider operations within the 180-second request lease
- `.vercelignore` excludes local runtime data and audit artifacts from source uploads; `functions.excludeFiles` also excludes them from API bundles

Before deploying, run:

```bash
pnpm verify
pnpm test:e2e
pnpm audit
```

For a local prebuilt deployment, create fresh output with the Vercel CLI, then run `pnpm vercel:bundle-check` before any `vercel deploy --prebuilt`. `pnpm build` creates `dist/`; it does **not** refresh `.vercel/output`. Old local Vercel output may contain runtime records and a newsletter token cache and must not be reused. The guard deliberately fails on that stale output. Never copy local `data/`, `.env*`, or audit reports into a release workspace.

Vercel's compiled API modules run directly in Node, so relative server/shared imports must use `.js` specifiers. The native-module test checks this independently of the bundled Express build. Local tests do not prove live form delivery: shared production storage and the external Google tracking settings still need the decisions recorded in [release readiness](docs/release-readiness-2026-10-08.md).

## Live Site Scrape

```bash
pnpm scrape:live
```

The scraper crawls the legacy/live site into `.scrape/` for content and photo comparison. Raw scrape output is ignored by Git.

## Maintenance Checklist

Before merging content or routing changes:

1. Run `pnpm check`.
2. Run `pnpm build`.
3. Confirm changed routes render correctly.
4. Confirm sitemap and redirects match the intended public pages.
5. Keep `.env*`, local form data, build output, and scrape output out of Git.
