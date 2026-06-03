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
```

- `pnpm dev` starts local Vite development.
- `pnpm check` runs TypeScript without emitting files.
- `pnpm build` generates robots/sitemap files, builds the Vite app, creates route-specific HTML shells, defers built CSS, and bundles the Express server.
- `pnpm start` serves the production build from `dist/`.
- `pnpm verify` runs `pnpm check` and `pnpm build`.

## Project Structure

```text
client/src/pages/           Route-level pages
client/src/components/      Shared UI and layout components
client/src/lib/seo-data.ts  Canonical page SEO metadata
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

Copy `.env.example` to `.env.local` for local secrets. Analytics is optional and consent-gated:

```bash
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
NEXT_PUBLIC_GA_ID=G-S6448TRP0T
```

Website forms submit to `/api/contact`, write JSONL records, and send notifications through Postmark:

```bash
POSTMARK_SERVER_TOKEN=your-postmark-server-token
POSTMARK_MESSAGE_STREAM=outbound
POSTMARK_TEST_TO=
FORM_ALERT_TO=Info@woodinvillesportsclub.com
FORM_ALERT_FROM="WSC Website <Info@woodinvillesportsclub.com>"
FORM_SUBMISSIONS_DIR=./data/form-submissions
FORM_WEBHOOK_URL=
```

`FORM_ALERT_FROM` must use a sender signature or sender domain verified in Postmark. The visitor's email is sent as `ReplyTo`, never as the sender. `POSTMARK_MESSAGE_STREAM` defaults to `outbound`. `FORM_WEBHOOK_URL` is optional, but recommended for durable off-site records on serverless deployments because local JSONL storage can be temporary.

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

`CONSTANT_CONTACT_LIST_IDS` is the default list membership for every newsletter signup. `CONSTANT_CONTACT_INTEREST_LIST_MAP` is optional JSON that maps the site checkbox labels to additional Constant Contact list IDs. The server refreshes OAuth access tokens and writes the newest token pair to `CONSTANT_CONTACT_TOKEN_CACHE_FILE`; use durable storage for that file on production hosts where the filesystem is temporary. `CONSTANT_CONTACT_ACCESS_TOKEN` is supported only as a short-lived fallback when refresh-token credentials are not configured.

Run `pnpm constant-contact:check` to validate the local Constant Contact env without touching the API. Run `pnpm constant-contact:check -- --refresh-token` to validate OAuth and write a fresh token cache. Run `pnpm constant-contact:check -- --sync-test --email=test@example.com` only when you intentionally want to create or update a test contact in the configured list.

Run `pnpm postmark:check` before launch to confirm the required Postmark environment is present without sending an email. Run `pnpm postmark:check -- --send-test --test-api-token --to=Info@woodinvillesportsclub.com` to validate a single Postmark API send without delivering it. Run `pnpm postmark:smoke-forms` to submit every live website form type through `/api/contact` with Postmark's test API token and `Info@woodinvillesportsclub.com` as the configured recipient. The form smoke test disables Constant Contact by default so test payloads do not enter live newsletter lists; pass `--constant-contact --form=newsletter_signup` only for a deliberate Constant Contact sync test. After Postmark approves the account and the sender signature or domain is verified, run `pnpm postmark:check -- --send-test --to=you@example.com` or set `POSTMARK_TEST_TO` to send a deliberate real test message through the configured message stream.

## Forms

The active forms are:

- Contact form on `/contact`
- Golf lesson request form on `/golf`
- Newsletter signup form on `/`

Client-side form submission is centralized in `client/src/lib/forms.ts`. Server-side validation, honeypot handling, JSONL recording, optional webhook forwarding, optional Constant Contact newsletter sync, and Postmark delivery live in `server/form-submissions.ts`. `/api/forms` remains as a compatibility alias for older clients.

## SEO and Static Output

Page metadata is managed in `client/src/lib/seo-data.ts`. The build process uses it to generate:

- `client/public/robots.txt`
- `client/public/sitemap.xml`
- route-specific HTML shells in `dist/public`

When adding or removing public pages, update:

- `client/src/App.tsx`
- `client/src/lib/seo-data.ts`
- `scripts/seo-audit/generate-public-seo-files.ts`
- `scripts/seo-audit/generate-static-route-html.ts`
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

Before deploying, run:

```bash
pnpm verify
```

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
