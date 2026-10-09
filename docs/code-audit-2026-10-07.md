# WSC website code audit

October 7, 2026 · Performance, dead code, reliability, and maintainability

## Overall assessment

The site has a sound foundation and does not need a framework rewrite. The largest measured cleanup opportunity is unused UI scaffolding: an isolated experiment reduced generated CSS by **41.5%**, without changing the rendered application. The most important functional work is making route recovery and form handling dependable, and aligning advertising events with the consent controls visitors see.

This report records the original audit and implementation plan, before application changes. See [the implementation report](code-audit-implementation-2026-10-07.md) for the subsequent cleanup, verification, and remaining deployment decisions. The audit itself did not change code or production settings.

## Scope and evidence

- Repository: `/Users/filipp/Downloads/wsc-website`.
- Audited branch: `codex/adult-tennis-presence`, commit `4f166f8162fc4cd650f3e0ec1bdecd859cf45624`.
- Fetched `origin/main`: `8fe73d559f3e05a92ec262fe8f29dcdde1b81d63`; the audited branch is two commits ahead and contains the Adult Tennis work.
- Reviewed frontend imports, routing, shared components, page/data patterns, assets, forms, both API adapters, the Express server, integrations, build/SEO generators, dependencies, and CI/tests.
- Runtime import analysis covered 127 client TypeScript modules. Findings are based on source review, dependency advisories, local production-build experiments, and browser checks. The main functional findings also exist on `origin/main`; unused asset candidates reflect the Adult Tennis branch specifically.
- Production credentials, Vercel firewall rules, GTM container contents, provider delivery logs, and field performance data were not inspected. Conditional risks below are not claims of observed production incidents.

### Validation

| Check | Result |
|---|---|
| `pnpm verify` | Passed: 67 tests, TypeScript, production build |
| `pnpm test:e2e` | Passed: 28 desktop/mobile tests |
| TypeScript with `noUnusedLocals` and `noUnusedParameters` | Passed; these flags do not detect unreachable files |
| Public SEO file audit | 50 sitemap URLs; canonical host and robots checks passed |
| Generated route shells | 59 HTML files built |
| Production-build route smoke | 54 URLs checked at desktop and mobile widths; details in evidence files |
| Persistent chunk failure | Reproduced five automatic reloads after five consecutive blocked chunk requests |
| Homepage image requests | Confirmed hidden eager hero images requested at 390px and 1440px |
| Isolated dead-code experiment | Both baseline and reduced Vite builds passed; CSS fell 41.5% |
| `pnpm audit --json` | 26 advisories: 1 critical, 15 high, 9 moderate, 1 low; applicability discussed below |

The regular browser suite uses the development server and mocks form responses. The additional route smoke uses the built application through the local production server; it checks rendered headings, HTTP status, runtime errors during rendering, and horizontal overflow. It is not exhaustive accessibility, visual regression, provider-delivery, or field-speed testing. No Lighthouse score or real-user speed improvement is claimed.

Build baseline: the main JavaScript asset is 319.96 kB (97.38 kB gzip as reported by Vite), and global CSS is 177.95 kB. The largest route-specific JavaScript asset is Summer at 164.46 kB (49.30 kB gzip). Route chunks are loaded on demand; their sizes should not be added to a homepage download estimate. Use these as a baseline for future asset budgets.

## Fix first

### 1. Bound automatic route recovery — P1, reproduced

**Evidence:** [ErrorBoundary.tsx:56](/Users/filipp/Downloads/wsc-website/client/src/components/ErrorBoundary.tsx:56).

The error boundary clears its reload marker whenever it mounts, before a lazy route finishes loading. If that route's JavaScript keeps failing, every reload clears the marker again. In a production-build experiment, blocking the FAQ chunk five consecutive times produced **six document requests**; the page recovered only when the sixth chunk attempt was allowed.

**Change:** Keep the marker across reloads until the route actually renders successfully, or use a bounded retry count with expiry. Catch storage-access failures. After one automatic retry, offer a stable recovery screen.

**Acceptance:** Test one transient failure, persistent failure, storage unavailable, and successful recovery. The existing browser test only blocks the first import and then permits success.

### 2. Make accepted form records durable — P1, configuration-dependent risk

**Evidence:** [form-submissions.ts:294](/Users/filipp/Downloads/wsc-website/server/form-submissions.ts:294), [processing result:217](/Users/filipp/Downloads/wsc-website/server/form-submissions.ts:217), [failure copy:178](/Users/filipp/Downloads/wsc-website/server/form-submissions.ts:178).

On Vercel, records default to `/tmp/wsc-form-submissions`. Optional webhook failures are logged and ignored; processing still reports `recorded: true`. If notification delivery fails as well, the response says the submission was saved, although its only record may be temporary. Vercel describes `/tmp` as scratch space, not a durable application record store. [Vercel runtime documentation](https://vercel.com/docs/functions/runtimes).

**Change:** Store an accepted submission in a durable database or queue before acknowledging it. Track email/newsletter delivery separately and retry failures with an idempotency key. Until that exists, make responses accurately distinguish temporary recording from durable acceptance.

**Limit:** The README already acknowledges this requirement. A working production webhook may mitigate it, but its configuration and delivery were not verified.

### 3. Stop reporting successful delivery for fast legitimate submissions — P2, confirmed code path

**Evidence:** [Contact.tsx:25](/Users/filipp/Downloads/wsc-website/client/src/pages/Contact.tsx:25), [InquiryForms.tsx:164](/Users/filipp/Downloads/wsc-website/client/src/components/InquiryForms.tsx:164), [Home.tsx:410](/Users/filipp/Downloads/wsc-website/client/src/pages/Home.tsx:410).

The client treats both a filled honeypot and a fast submission as bots. It shows success and clears the fields without calling the API. An autofilled contact submission within three seconds, or an inquiry/newsletter within one second, can hit this path.

**Change:** Keep the user's entries and show a brief retry message for `too_fast`. Keep honeypot handling separate. Test autofill/fast submission explicitly; the current browser tests wait beyond the gate.

### 4. Make advertising tracking obey marketing consent — P2, confirmed code mismatch

**Evidence:** [Analytics.tsx:20](/Users/filipp/Downloads/wsc-website/client/src/components/Analytics.tsx:20), [forms.ts:97](/Users/filipp/Downloads/wsc-website/client/src/lib/forms.ts:97), [CookieConsent.tsx:75](/Users/filipp/Downloads/wsc-website/client/src/components/CookieConsent.tsx:75).

The interface saves separate analytics and marketing choices, but loading GA/GTM depends only on analytics consent. Assessment submission code emits an advertising conversion whenever `gtag` exists, regardless of the marketing choice. Other advertising click handlers follow the same pattern. Removing script elements also does not undo code that already executed.

**Change:** Centralize consent state and event dispatch. Gate advertising events on marketing consent, apply the SDK's consent updates, and provide a visible way to reopen preferences. Preserve the existing rule that assessment conversions follow successful submissions.

**Acceptance:** Exercise all four analytics/marketing combinations, withdrawal after initial acceptance, route changes, and failed/successful form submissions. GTM container configuration needs a separate check before claiming what ultimately reaches Google. This is a behavior mismatch, not a legal determination.

### 5. Add server-side abuse controls and provider deadlines — P2

**Evidence:** [request handler:136](/Users/filipp/Downloads/wsc-website/server/form-submissions.ts:136), [serial processing:217](/Users/filipp/Downloads/wsc-website/server/form-submissions.ts:217), [webhook fetch:306](/Users/filipp/Downloads/wsc-website/server/form-submissions.ts:306), [token fetch:407](/Users/filipp/Downloads/wsc-website/server/form-submissions.ts:407).

Client timing and rate limits are bypassable by direct API calls. The server's honeypot does not establish a request quota. Separately, application `fetch` calls for the webhook and Constant Contact have no explicit deadline and run before notification delivery; a stalled optional provider can hold up the entire request.

**Change:** Add a shared server-side rate limit, bounded provider timeouts, and delivery retries outside the visitor's request. Use idempotency so retries do not duplicate leads. Review attachment type/form allowlists. Preserve the existing size limits and escaping.

**Limit:** No abuse was observed; external Vercel firewall rules were not inspected. Postmark already has an SDK timeout—the missing deadlines are on the application's other outbound calls.

### 6. Make newsletter integration state reliable and explicit — P2

**Evidence:** [token refresh:386](/Users/filipp/Downloads/wsc-website/server/form-submissions.ts:386), [token cache:798](/Users/filipp/Downloads/wsc-website/server/form-submissions.ts:798), [optional sync:329](/Users/filipp/Downloads/wsc-website/server/form-submissions.ts:329), [newsletter copy:891](/Users/filipp/Downloads/wsc-website/client/src/components/InquiryForms.tsx:891).

Refreshed Constant Contact tokens are stored in an instance-local file, with no shared refresh lock. Cold starts can fall back to the original environment token, and simultaneous instances can independently refresh. The provider returns a new token pair and rate-limits excessive refresh activity. [Constant Contact documentation](https://developer.constantcontact.com/api_guide/oauth2-authorization/server-flow).

When the integration is unconfigured, the handler can still accept an emailed signup request while the UI says the person is on the newsletter list.

**Change:** Use durable shared token storage with coordinated refresh. Distinguish `subscribed`, `received for manual processing`, and `failed` outcomes in the response and UI. Decide whether automatic list subscription is required or manual processing is an intentional fallback.

## Efficiency and cleanup

### 7. Remove unreachable UI scaffolding and prune its packages — P2, measured benefit

**Evidence:** [package.json:28](/Users/filipp/Downloads/wsc-website/package.json:28), [complete inventory and method](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-dead-code-final.md).

Import reachability identifies **54 of 127 client modules** outside the runtime graph: approximately **6,376 lines / 207,283 source bytes**. This includes:

- 49 of 52 UI wrappers; retain `accordion`, `dialog`, and `sonner`.
- Three orphan hooks: `useComposition`, `usePersistFn`, and `useMobile`.
- The old `Terms` page, superseded by the consolidated Policies page.
- `MarketingBanner`, which is no longer imported by the application.

**33 of 47 direct production dependencies** are outside the runtime graph: 32 serve only orphan UI files; `next-themes` has no source imports. Remove the files and their direct dependencies together, regenerate the lockfile, and then run verification. Packages may still remain transitively where active dependencies require them.

Two isolated Vite builds measured the effect of deleting only the 49 wrappers and three hooks:

| CSS metric | Before | After | Reduction |
|---|---:|---:|---:|
| Raw bytes | 177,949 | 104,064 | **41.5%** |
| Gzip bytes, same zlib settings | 26,406 | 16,240 | **38.5%** |

Unused JavaScript is already tree-shaken; the 207 KB source total is **not** a JavaScript download saving. The CSS reduction occurs because Tailwind scans class names in otherwise unused source files. The isolated experiment verifies build/size benefit, not acceptance of a full cleanup; no dependencies were removed there.

**Preserve:** `Privacy.tsx` is active inside Policies. `/api/forms` is an intentional compatibility alias. `Terms.tsx` and `MarketingBanner.tsx` are still read by source-text tests, so retire those assertions together with the files and keep tests for the actual rendered policy/seasonal surfaces.

### 8. Avoid eager downloads for the hidden homepage hero — P2, browser-confirmed

**Evidence:** [mobile hero:461](/Users/filipp/Downloads/wsc-website/client/src/pages/Home.tsx:461), [desktop hero:576](/Users/filipp/Downloads/wsc-website/client/src/pages/Home.tsx:576), [request evidence](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-audit-hero.txt).

Both responsive layouts exist in the DOM, and each has an eager, high-priority image. CSS visibility does not stop those downloads. At 390px, the hidden desktop aerial image was requested (27,651 bytes). At 1440px, the hidden mobile sunset image was requested at full size (249,694 bytes). The static shell also preloads the sunset image on desktop.

**Change:** Use media-aware image selection/rendering and matching preload media conditions. Treat the visible hero as the priority asset for that viewport. Some images are reused farther down the page, so these figures describe avoidable early competition—not guaranteed whole-session byte savings.

### 9. Prune image candidates and consolidate exact duplicates — P3

**Evidence:** [asset inventory](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-assets-audit.json), [responsive URL generation:74](/Users/filipp/Downloads/wsc-website/client/src/lib/responsive-image.ts:74).

Three currently unreferenced image families contain **24 files / 1,412,104 bytes**: `golf-instructors-swing-lab`, `tennis-junior-trophy`, and `pickleball-action`. The junior trophy becomes unused with the Adult Tennis homepage changes; do not remove it independently from an unchanged `main`.

Hash comparison also found 15 duplicate groups with 1,363,427 redundant bytes. These overlap the unused candidates and must not be added together. `gym-main` and `fitness-center-hero` are identical across their eight-file families, representing roughly 1 MB of duplicate assets.

**Change:** Canonicalize active image references before deleting aliases. Review previously published URLs before removal. Keep responsive variants that are dynamically constructed; literal text searches alone would misidentify them as dead. These are repository/deployment savings, not automatic page-speed savings.

### 10. Patch dependencies and add continuing audit coverage — P2

**Evidence:** [full registry audit](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-audit-dependencies.json), [pinned override:102](/Users/filipp/Downloads/wsc-website/package.json:102).

The audit returned 26 advisories across the installed tree. They do not represent 26 independently demonstrated attacks against this website. Update affected production packages/transitives and build tooling, then re-run the audit and functional checks. In particular, the fixed `qs` override prevents a normal compatible update from resolving that package.

| Package/group | Installed evidence | Minimum fixed version covering this audit's listed findings |
|---|---|---|
| `compression` | 1.8.1 | 1.8.2 |
| `proxy-addr` through Express | 2.0.7 | 2.0.8 |
| `qs` override | 6.15.2 | 6.16.0 |
| Axios through Postmark | 1.19.0 | 1.20.0 |
| Vite | 8.0.10 | 8.0.16 |
| PostCSS | 8.5.10 | 8.5.23 |
| esbuild | 0.28.0 | 0.28.1 |
| nanoid | 3.3.11 | 3.3.18 |
| source-map-js | 1.2.1 | 1.2.2 |

These are audit-snapshot remediation targets, not a lockfile change plan; recheck current releases and compatibility when implementing.

The critical `proxy-addr` advisory requires a particular trusted-subnet configuration that this code does not use. Compression applies to the standalone Express server, not the direct Vercel handlers. Several Vite/esbuild findings concern development servers on Windows. Postmark uses a fixed provider endpoint; the audit did not establish the input/control prerequisites for the reported Axios attacks. [proxy-addr advisory](https://github.com/advisories/GHSA-jqcg-44mw-7w3h), [compression advisory](https://github.com/advisories/GHSA-vc2v-76pw-4v95), [Vite advisory](https://github.com/advisories/GHSA-fx2h-pf6j-xcff).

## Navigation, content, and maintainability

### 11. Use one navigation action for section links — P2

**Evidence:** [Navbar.tsx:127](/Users/filipp/Downloads/wsc-website/client/src/components/Navbar.tsx:127).

Cross-page section links first navigate to the pathname, then push the same pathname with a hash 50 ms later. This adds two history entries. The handler also prevents default behavior for modified clicks.

The production-build browser reproduction confirmed two added entries for Home → Junior Tennis. Pressing Back once left the visitor on `/tennis` instead of returning home. [Reproduction](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-audit-home-history.txt).

**Change:** Navigate once to the complete destination, share one hash-scroll implementation, and preserve Cmd/Ctrl/middle-click behavior. Test Home → Junior Tennis → Back, same-page anchors, and direct deep links.

### 12. Derive tournament status from dates — P2

**Evidence:** [GolfTournaments.tsx:270](/Users/filipp/Downloads/wsc-website/client/src/pages/GolfTournaments.tsx:270), [status display:582](/Users/filipp/Downloads/wsc-website/client/src/pages/GolfTournaments.tsx:582).

Nine July/August 2026 tournaments are hardcoded as upcoming and never expire. The shared seasonal calendar does not govern this data.

**Change:** Store explicit start/end dates and calculate upcoming/current/past in Pacific time, retaining explicit cancelled/TBD overrides. Add boundary-date checks. This is a code-level cause of stale content, separate from the business-policy contradictions in the existing corrections worksheet.

### 13. Test the production artifact and provider outcomes in CI — P2

**Evidence:** [playwright.config.ts:35](/Users/filipp/Downloads/wsc-website/playwright.config.ts:35), [mocked form request:92](/Users/filipp/Downloads/wsc-website/tests/e2e/critical-journeys.spec.ts:92), [server tests:222](/Users/filipp/Downloads/wsc-website/scripts/form-submissions.test.ts:222).

CI builds production output but runs browser tests against `pnpm dev`. Mocked browser responses do not verify API adapters or provider delivery. Existing unit coverage checks validation and missing configuration, but not successful fake-provider delivery, timeout behavior, durable acceptance, or coordinated token refresh.

**Change:** Add a production-output smoke job, including redirects/status codes and generated metadata. Inject fake storage/email/newsletter providers for offline integration tests. Cover persistent route failure and consent choices. Keep live provider tests deliberate and separate.

The free fitness assessment route is also absent from the four-route protected advertising-page registry at [check-protected-landing-pages.mjs:7](/Users/filipp/Downloads/wsc-website/scripts/check-protected-landing-pages.mjs:7). Add it if the existing advertising-page protection policy should cover that campaign.

### 14. Consolidate route metadata and static rendering — P3

**Evidence:** [documented route checklist:145](/Users/filipp/Downloads/wsc-website/README.md:145), [static shell generation:130](/Users/filipp/Downloads/wsc-website/scripts/seo-audit/generate-static-route-html.ts:130), [React entry:5](/Users/filipp/Downloads/wsc-website/client/src/main.tsx:5).

A page currently requires edits in the router, SEO metadata, sitemap generator, and static-shell generator. The generator builds a separate generic hero, and React replaces it with independently maintained markup. That permits heading/image/layout drift during startup.

**Change:** First introduce a shared route manifest containing canonical path, aliases, sitemap policy, metadata, and hero/preload intent. Longer term, assess prerendering the actual route components. Preserve the existing static metadata and redirects while making incremental changes; a wholesale framework migration is not justified by this audit.

### 15. Simplify shared systems and documentation — P3

- Split the large [form handler](/Users/filipp/Downloads/wsc-website/server/form-submissions.ts:208) into validation, durable storage, and provider modules; share client/server form contracts without moving secrets into client code.
- Make [gallery captions](/Users/filipp/Downloads/wsc-website/client/src/components/FacilityGallery.tsx:67) available to keyboard/touch users; mouse hover currently controls their display.
- Put the [seasonal date subscription](/Users/filipp/Downloads/wsc-website/client/src/hooks/useSessionCalendar.ts:5) in shared state instead of creating separate 30-second timers in multiple consumers. This is a small efficiency/lifecycle improvement.
- Remove optional theme-switching scaffolding if dark mode is not planned. The active app is fixed to light mode and the exported theme hook has no consumers.
- Update README script/form descriptions: `verify` now includes tests, the form inventory omits the assessment, and assessment email routing has an additional recipient not described in the general routing statement.
- Decide whether the standalone Express deployment remains supported. It is not dead code—it is used by `pnpm start`—but it duplicates a subset of Vercel routing. If retained, validate both paths; otherwise retire it deliberately.

## Recommended implementation sequence

| Batch | Work | Validation and decisions |
|---|---|---|
| 1: Focused cleanup | Remove orphan UI/hooks, then obsolete Terms/banner assertions; prune packages; patch advisories | Full tests/typecheck/build and browser checks; compare CSS. Preserve Adult Tennis and active policies. |
| 2: Visitor reliability | Bounded recovery, truthful fast-submit handling, consent-aware events, one-step hash navigation, responsive hero loading | Targeted failure/consent/history tests; network comparison; desktop/mobile review. |
| 3: Lead delivery | Durable acceptance, queued/idempotent notifications, timeouts/rate limits, shared newsletter tokens | Choose durable storage and newsletter fallback behavior; test fake providers and then deliberately verify deployment configuration. |
| 4: Maintenance | Shared route manifest, dated tournament status, production CI, gallery accessibility, docs and asset pruning | Preserve legacy URLs and campaign tracking; review external asset URLs before deletion. |

Do not combine the known business-policy contradictions with mechanical cleanup. Their correct values still need answers in the existing corrections worksheet. No major functional regression specific to the Adult Tennis additions was found in this review.

## What to preserve

Most routes are already lazy-loaded. Optional services are deferred. Responsive AVIF/WebP images include dimensions. The seasonal calendar handles Pacific dates and updates open tabs. Mobile navigation supports keyboard dismissal. Successful form responses gate assessment conversions. Adult Tennis class/pricing data is shared. API validation escapes email HTML, uses the visitor address as ReplyTo, limits request sizes, and shares one handler across compatibility endpoints. CI uses a frozen lockfile and checks desktop/mobile journeys.

## Evidence files

All local evidence is in [output/code-audit-2026-10-07](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07). Key records:

- [Tests and build](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-audit-verify.log)
- [Browser suite](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-audit-e2e.log)
- [Desktop production routes](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-audit-routes-desktop.txt)
- [Mobile production routes](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-audit-routes-mobile.txt)
- [Persistent reload reproduction](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-audit-reload.txt)
- [Hero image requests](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-audit-hero.txt)
- [Dead-code inventory and measurement](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-dead-code-final.md)
- [Machine-readable import graph](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-dead-code-results.json)
- [Dependency advisories](/Users/filipp/Downloads/wsc-website/output/code-audit-2026-10-07/wsc-audit-dependencies.json)
