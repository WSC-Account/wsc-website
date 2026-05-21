# Woodinville Sports Club Website

Production website for Woodinville Sports Club, a sports campus in Woodinville, Washington. The site covers tennis, golf, gym and fitness, pickleball, summer programs, memberships, events, careers, policies, blog resources, and contact flows.

## Stack

- React 19 and TypeScript
- Vite 8 with Tailwind CSS 4
- Wouter routing
- Express production server
- Vercel deployment config
- Resend-backed website form notifications
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
```

Website forms submit to `/api/forms`, write JSONL records, and send notifications through Resend:

```bash
RESEND_API_KEY=your-resend-api-key
FORM_EMAIL_TO=Info@woodinvillesportsclub.com
FORM_EMAIL_FROM="WSC Website <forms@woodinvillesportsclub.com>"
FORM_SUBMISSIONS_DIR=./data/form-submissions
FORM_WEBHOOK_URL=
```

`FORM_EMAIL_FROM` must use a sender domain verified in Resend. `FORM_WEBHOOK_URL` is optional, but recommended for durable off-site records on serverless deployments because local JSONL storage can be temporary.

## Forms

The active forms are:

- Contact form on `/contact`
- Golf lesson request form on `/golf`
- Newsletter signup form on `/`

Client-side form submission is centralized in `client/src/lib/forms.ts`. Server-side validation, JSONL recording, optional webhook forwarding, and Resend delivery live in `server/form-submissions.ts`.

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
