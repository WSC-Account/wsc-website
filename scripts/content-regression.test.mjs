import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("main navigation separates Fitness Center and APL", () => {
  const navbar = read("client/src/components/Navbar.tsx");

  assert.match(navbar, /href:\s*"\/gym",[\s\S]*?label:\s*"Fitness Center"/);
  assert.match(navbar, /href:\s*"\/fitness",[\s\S]*?label:\s*"Athletic Performance Lab"/);
  assert.match(navbar, /children/);
});
test("main navigation uses the club phone number", () => {
  const navbar = read("client/src/components/Navbar.tsx");

  assert.match(navbar, /href="tel:\+14254871090"/);
  assert.match(navbar, /\(425\) 487-1090/);
  assert.doesNotMatch(navbar, /481-4686|\+14254814686/);
});

test("fitness route renders the Athletic Performance Lab page", () => {
  const app = read("client/src/App.tsx");

  assert.match(app, /const Fitness = lazy\(\(\) => import\("\.\/pages\/Fitness"\)\)/);
  assert.match(app, /<Route path="\/fitness" component=\{Fitness\} \/>/);
  assert.doesNotMatch(app, /<Route path="\/fitness">\{\(\) => <Redirect to="\/gym" \/>/);
});

test("Athletic Performance Lab is directly public in production", () => {
  const server = read("server/index.ts");
  const sitemapGenerator = read("scripts/seo-audit/generate-public-seo-files.ts");
  const vercel = JSON.parse(read("vercel.json"));
  const redirects = vercel.redirects ?? [];

  assert.equal(
    redirects.some((redirect) => redirect.source === "/fitness"),
    false,
    "/fitness should not be redirected away from the APL page",
  );
  assert.equal(
    redirects.find((redirect) => redirect.source === "/apl-training-center")?.destination,
    "/fitness",
  );
  assert.doesNotMatch(server, /"\/fitness":\s*"\/gym"/);
  assert.match(sitemapGenerator, /SEO\.apl\.path/);
});

test("golf academy section links WSC CourtReserve and Tier 1 Golf", () => {
  const golf = read("client/src/pages/Golf.tsx");
  const sectionStart = golf.indexOf("{/* Tier 1 Golf Academy */}");
  const sectionEnd = golf.indexOf("{/* Range Pricing */}");
  const academySection = golf.slice(sectionStart, sectionEnd);

  assert.notEqual(sectionStart, -1);
  assert.notEqual(sectionEnd, -1);
  assert.match(golf, /const COURT_RESERVE_URL = "https:\/\/app\.courtreserve\.com\/Online\/Portal\/Index\/6689"/);
  assert.match(golf, /const TIER1_GOLF_URL = "https:\/\/www\.tier1nw\.com\/golf"/);
  assert.match(golf, /const TIER1_GOLF_APPLY_URL = "https:\/\/www\.tier1nw\.com\/golf\/apply"/);
  assert.match(academySection, /href=\{COURT_RESERVE_URL\}/);
  assert.match(academySection, /href=\{TIER1_GOLF_URL\}/);
  assert.match(academySection, /href=\{TIER1_GOLF_APPLY_URL\}/);
  assert.match(academySection, /Register in CourtReserve/);
  assert.match(academySection, /Data-driven junior golf development at WSC/);
  assert.match(academySection, /September 2026/);
  assert.match(golf, /Full-Time Golf Academy/);
  assert.match(golf, /Par to Eagle Pathway/);
  assert.doesNotMatch(golf, /Par to Albatros Pathway/);
  assert.match(golf, /APL integration|APL Integrated/i);
  assert.match(golf, /Competition pathway/i);
  assert.match(golf, /Tier1golf@woodinvillesportsclub\.com/);
  assert.doesNotMatch(academySection, /href="\/membership"/);
});

test("golf simulator section does not promote trial membership", () => {
  const golf = read("client/src/pages/Golf.tsx");

  assert.doesNotMatch(golf, /Trial Access|Trial golf simulator|Trial members/i);
});

test("membership page does not list the retired trial golf simulator pass", () => {
  const membership = read("client/src/pages/Membership.tsx");

  assert.doesNotMatch(
    membership,
    /Trial Golf Simulators|Trial members|7-day window|Bring up to 3 guests per session|try the golf simulators before committing/i,
  );
});

test("covered driving bay count is not capped at 23", () => {
  const files = [
    "client/src/pages/About.tsx",
    "client/src/pages/Golf.tsx",
    "client/src/pages/Home.tsx",
    "client/src/pages/Summer.tsx",
    "client/src/pages/Policies.tsx",
    "client/src/pages/Terms.tsx",
    "client/src/components/StructuredData.tsx",
    "client/index.html",
  ];

  for (const file of files) {
    const source = read(file);
    const sourceWithoutAllowedCounts = source.replace(/more than 23/gi, "").replace(/23\+/g, "");

    assert.doesNotMatch(sourceWithoutAllowedCounts, /\b23(?:-bay| covered| bays)/i, `${file} should not use 23 as the exact covered bay count`);
    assert.doesNotMatch(source, /val:\s*"23",\s*label:\s*"Covered(?: Driving)? Bays/i, `${file} should not use 23 as an exact covered bay stat`);
  }
});

test("summer registration explains weekly and drop-in signup options", () => {
  const summer = read("client/src/pages/Summer.tsx");
  const home = read("client/src/pages/Home.tsx");

  assert.match(summer, /<strong[^>]*>\s*week-to-week\s*<\/strong>/i);
  assert.match(summer, /<strong[^>]*>\s*drop-ins\s*<\/strong>/i);
  assert.match(summer, /pricing information is available in CourtReserve/i);
  assert.match(home, /<strong[^>]*>\s*Week-to-week\s*<\/strong>/);
  assert.match(home, /<strong[^>]*>\s*drop-ins?\s*<\/strong>/i);
});

test("summer Core Orange and Green tennis runs in the afternoon", () => {
  const summer = read("client/src/pages/Summer.tsx");

  assert.match(summer, /label:\s*"Core Orange\/Green PM"/);
  assert.match(summer, /subtitle:\s*"Orange · Green"/);
  assert.match(summer, /ageNote:\s*"Ages 9–12"/);
  assert.match(summer, /"tennis-core-orange-green-pm"[\s\S]*?time:\s*"1:00 PM"[\s\S]*?time:\s*"4:00 PM"/);
  assert.doesNotMatch(summer, /subtitle:\s*"JumpStart · Red · Orange · Green · ½-Day Yellow"/);
});

test("policies page uses the full collapsible membership agreement", () => {
  const policies = read("client/src/pages/Policies.tsx");

  assert.match(policies, /Accordion/);
  assert.match(policies, /RELEASE OF LIABILITY AND ASSUMPTION OF RISK/);
  assert.match(policies, /Member\/Passholder agrees to make timely payment of ALL fees/);
  assert.match(policies, /WSC may take images or videos of Member\/Passholders and guests/);
  assert.doesNotMatch(policies, /The WSC Membership Agreement was last updated on/);
  assert.doesNotMatch(policies, /Using WSC facilities, services, or activities involves the risk of injury, ranging from minor to catastrophic injuries including death/);
});

test("privacy policy is consolidated under policies and terms", () => {
  const app = read("client/src/App.tsx");
  const policies = read("client/src/pages/Policies.tsx");
  const footer = read("client/src/components/Footer.tsx");
  const cookieConsent = read("client/src/components/CookieConsent.tsx");
  const sitemapGenerator = read("scripts/seo-audit/generate-public-seo-files.ts");
  const vercel = JSON.parse(read("vercel.json"));
  const redirects = vercel.redirects ?? [];

  assert.match(policies, /type PolicyTab = "policies" \| "terms" \| "privacy"/);
  assert.match(policies, /<Privacy embedded \/>/);
  assert.match(app, /<Redirect to="\/policies#privacy" \/>/);
  assert.equal(redirects.find((redirect) => redirect.source === "/privacy")?.destination, "/policies#privacy");
  assert.doesNotMatch(footer, /href="\/privacy"/);
  assert.match(cookieConsent, /href="\/policies#privacy"/);
  assert.doesNotMatch(sitemapGenerator, /SEO\.privacy\.path/);
});

test("membership auto-renewal is clearly disclosed", () => {
  const membership = read("client/src/pages/Membership.tsx");
  const policies = read("client/src/pages/Policies.tsx");

  assert.match(membership, /All Memberships:[\s\S]*?Auto-renew/i);
  assert.match(policies, /All memberships auto-renew/i);
});

test("website forms are routed to WSC email notifications", () => {
  const apiRoute = read("api/contact.ts");
  const formServer = read("server/form-submissions.ts");
  const packageJson = JSON.parse(read("package.json"));
  const readme = read("README.md");
  const postmarkCheck = read("scripts/check-postmark-setup.mjs");
  const postmarkSmoke = read("scripts/smoke-test-form-delivery.mjs");

  assert.match(apiRoute, /handleFormSubmissionRequest/);
  assert.match(apiRoute, /from "\.\.\/server\/form-submissions\.js"/);
  assert.match(formServer, /POSTMARK_SERVER_TOKEN/);
  assert.match(formServer, /FORM_ALERT_TO/);
  assert.match(formServer, /FORM_ALERT_FROM/);
  assert.match(formServer, /GOLF_LESSONS_EMAIL = "tier1golf@woodinvillesportsclub\.com"/);
  assert.match(formServer, /resolveNotificationRecipients\(submission\.formType\)/);
  assert.match(formServer, /result\.email\.status !== "sent"/);
  assert.match(formServer, /CONSTANT_CONTACT_CLIENT_ID/);
  assert.match(formServer, /contacts\/sign_up_form/);
  assert.match(formServer, /CONSTANT_CONTACT_LIST_IDS/);
  assert.match(formServer, /buildNotificationSubject/);
  assert.match(formServer, /Title: \$\{submission\.subject\}/);
  assert.equal(packageJson.scripts["postmark:check"], "node scripts/check-postmark-setup.mjs");
  assert.equal(packageJson.scripts["postmark:smoke-forms"], "tsx scripts/smoke-test-form-delivery.mjs");
  assert.match(postmarkCheck, /POSTMARK_SERVER_TOKEN/);
  assert.match(postmarkCheck, /FORM_ALERT_TO/);
  assert.match(postmarkCheck, /FORM_ALERT_FROM/);
  assert.match(postmarkCheck, /POSTMARK_TEST_TO/);
  assert.match(postmarkCheck, /--send-test/);
  assert.match(postmarkCheck, /ServerClient/);
  assert.match(postmarkSmoke, /POSTMARK_API_TEST/);
  assert.match(postmarkSmoke, /Info@woodinvillesportsclub\.com/);
  assert.match(postmarkSmoke, /\/api\/contact/);
  assert.match(postmarkSmoke, /--form=contact/);
  assert.match(postmarkSmoke, /contact/);
  assert.match(postmarkSmoke, /newsletter_signup/);
  assert.match(postmarkSmoke, /golf_lesson/);
  assert.match(postmarkSmoke, /member_cancellation/);
  assert.match(postmarkSmoke, /personal_training/);
  assert.match(postmarkSmoke, /private_event/);
  assert.match(postmarkSmoke, /career_application/);
  assert.match(readme, /FORM_ALERT_TO=info@woodinvillesportsclub\.com/);
  assert.match(readme, /Golf lesson submissions are additionally routed to `tier1golf@woodinvillesportsclub\.com`/);
  assert.match(readme, /CONSTANT_CONTACT_REFRESH_TOKEN/);
  assert.match(readme, /CONSTANT_CONTACT_INTEREST_LIST_MAP/);
  assert.match(readme, /pnpm postmark:check/);
  assert.match(readme, /pnpm postmark:smoke-forms/);
});

test("live website inquiry forms exist in the new build", () => {
  const app = read("client/src/App.tsx");
  const forms = read("client/src/components/InquiryForms.tsx");
  const careers = read("client/src/pages/Careers.tsx");
  const events = read("client/src/pages/Events.tsx");
  const golf = read("client/src/pages/Golf.tsx");

  assert.match(app, /<Route path="\/member-request" component=\{MemberCancellationFormPage\} \/>/);
  assert.match(app, /<Route path="\/personal-training-interest-form" component=\{PersonalTrainingFormPage\} \/>/);
  assert.match(app, /<Route path="\/golf-coaching" component=\{GolfLessonFormPage\} \/>/);
  assert.match(app, /<Route path="\/newsletter-signup" component=\{NewsletterSignupPage\} \/>/);

  assert.match(forms, /Membership Cancellation Requests/);
  assert.match(forms, /Is there anything we could have done better\?/);
  assert.doesNotMatch(forms, /What's the primary reason for canceling\?/);
  assert.doesNotMatch(forms, /Please provide more details regarding your above cancellation reason\./);
  assert.doesNotMatch(forms, /Are you open to discussing options before finalizing your cancellation\?/);
  assert.doesNotMatch(forms, /discussionPreference/);

  assert.match(forms, /Personal Training Interest Form/);
  assert.match(forms, /Is this for an adult or child\?/);
  assert.match(forms, /Are you open to Small Group Training\?/);

  assert.match(forms, /Golf Lessons Inquiry/);
  assert.match(forms, /Tell us a little about your golf experience and what you're looking for\./);
  assert.match(forms, /Beginner/);
  assert.match(forms, /Intermediate/);
  assert.match(forms, /Advanced/);

  assert.match(events, /PrivateEventsInquiryForm/);
  assert.match(forms, /Tell Us About Your Event/);

  assert.match(careers, /CareersApplicationForm/);
  assert.match(forms, /Department Applying For/);
  assert.match(forms, /Are you legally authorized to work in the United States\?/);
  assert.match(forms, /Will you now or in the future require sponsorship for employment visa status\?/);
  assert.match(forms, /Upload Resume/);

  assert.match(golf, /GolfLessonInquiryForm/);
  assert.match(forms, /Newsletter Signup/);
  assert.match(forms, /Tennis updates/);
  assert.match(forms, /Golf updates/);
  assert.match(forms, /Summer camp updates/);
});

test("form submission API accepts all live website form types", () => {
  const clientForms = read("client/src/lib/forms.ts");
  const formServer = read("server/form-submissions.ts");

  for (const formType of [
    "member_cancellation",
    "personal_training",
    "golf_lesson",
    "private_event",
    "career_application",
    "newsletter_signup",
  ]) {
    assert.match(clientForms, new RegExp(`"${formType}"`));
    assert.match(formServer, new RegExp(`"${formType}"`));
  }

  assert.match(formServer, /WSC Contact Form - Message from/);
  assert.match(formServer, /WSC Newsletter Signup -/);
  assert.match(formServer, /WSC Membership Cancellation Request -/);
  assert.match(formServer, /WSC Personal Training Request -/);
  assert.match(formServer, /WSC Golf Lesson Inquiry -/);
  assert.match(formServer, /WSC Private Event Inquiry -/);
  assert.match(formServer, /WSC Career Application -/);
});

test("live website forms are discoverable from site clicks", () => {
  const footer = read("client/src/components/Footer.tsx");
  const membership = read("client/src/pages/Membership.tsx");
  const gym = read("client/src/pages/Gym.tsx");
  const fitness = read("client/src/pages/Fitness.tsx");
  const vercel = JSON.parse(read("vercel.json"));
  const redirects = vercel.redirects ?? [];

  for (const href of [
    "/member-request",
    "/personal-training-interest-form",
    "/golf-coaching",
    "/newsletter-signup",
  ]) {
    assert.match(footer, new RegExp(`href="${href}"`));
    assert.equal(
      redirects.some((redirect) => redirect.source === href),
      false,
      `${href} should not be redirected away from its form route`,
    );
  }

  assert.match(membership, /Cancellation Request/);
  assert.match(membership, /href="\/member-request"/);
  assert.match(membership, /Open the membership cancellation form/);
  assert.match(membership, /Manage or Cancel Membership/);
  assert.match(gym, /Request Personal Training/);
  assert.match(gym, /href="\/personal-training-interest-form"/);
  assert.match(gym, /Explore Fitness Memberships/);
  assert.match(gym, /href="\/membership"/);
  assert.match(fitness, /Request Personal Training/);
  assert.match(fitness, /href="\/personal-training-interest-form"/);
});

test("customer action forms stay indexable while newsletter and duplicate aliases stay out of search", () => {
  const seoHead = read("client/src/components/SEOHead.tsx");
  const memberCancellation = read("client/src/pages/MemberCancellationFormPage.tsx");
  const newsletter = read("client/src/pages/NewsletterSignupPage.tsx");
  const personalTraining = read("client/src/pages/PersonalTrainingFormPage.tsx");
  const golfLessons = read("client/src/pages/GolfLessonFormPage.tsx");
  const sitemapGenerator = read("scripts/seo-audit/generate-public-seo-files.ts");
  const sitemap = read("client/public/sitemap.xml");
  const staticRoutes = read("scripts/seo-audit/generate-static-route-html.ts");
  const redirects = JSON.parse(read("vercel.json")).redirects ?? [];

  assert.match(seoHead, /robots = "index, follow"/);
  assert.match(seoHead, /setMeta\("name", "robots", robots\)/);
  assert.doesNotMatch(memberCancellation, /noindex/);
  assert.match(newsletter, /robots="noindex, follow"/);
  assert.doesNotMatch(personalTraining, /noindex/);
  assert.doesNotMatch(golfLessons, /noindex/);

  assert.match(sitemapGenerator, /SEO\.memberCancellation\.path/);
  assert.doesNotMatch(sitemapGenerator, /SEO\.newsletterSignup\.path/);
  assert.match(sitemapGenerator, /SEO\.personalTrainingRequest\.path/);
  assert.match(sitemapGenerator, /SEO\.golfLessons\.path/);
  assert.match(sitemap, /<loc>https:\/\/www\.woodinvillesportsclub\.com\/member-request<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.woodinvillesportsclub\.com\/newsletter-signup<\/loc>/);
  assert.match(
    sitemap,
    /<loc>https:\/\/www\.woodinvillesportsclub\.com\/personal-training-interest-form<\/loc>/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/www\.woodinvillesportsclub\.com\/golf-coaching<\/loc>/,
  );
  assert.match(staticRoutes, /canonicalPath: memberRoute\.path,[\s\S]{0,80}?robots: "noindex, follow"/);
  assert.match(staticRoutes, /canonicalPath: trainingRoute\.path,[\s\S]{0,80}?robots: "noindex, follow"/);
  assert.match(staticRoutes, /canonicalPath: golfRoute\.path,[\s\S]{0,80}?robots: "noindex, follow"/);

  for (const [source, destination] of [
    ["/member-cancellation", "/member-request"],
    ["/member-cancelation", "/member-request"],
    ["/personal-training-request", "/personal-training-interest-form"],
    ["/golf-lessons", "/golf-coaching"],
  ]) {
    assert.equal(
      redirects.some(
        (redirect) => redirect.source === source && redirect.destination === destination && redirect.permanent,
      ),
      true,
      `${source} should permanently redirect to ${destination}`,
    );
  }
});

test("gym page is positioned around memberships and personal training", () => {
  const gym = read("client/src/pages/Gym.tsx");
  const seo = read("client/src/lib/seo-data.ts");
  const structuredData = read("client/src/components/StructuredData.tsx");

  assert.match(gym, /Fitness memberships that fit real life/);
  assert.match(gym, /clean, accessible gym/);
  assert.match(gym, /personal training with world-class instructors/i);
  assert.match(gym, /World-class instructors/);
  assert.match(gym, /Accessible hours/);
  assert.match(gym, /gym-main-interior\.webp/);
  assert.match(gym, /gym-training-tools\.webp/);
  assert.match(gym, /gym-functional-zone\.webp/);
  assert.doesNotMatch(gym, /const GYM_WEIGHTS = GYM_MAIN/);
  assert.doesNotMatch(gym, /const GYM_FUNCTIONAL = GYM_MAIN/);
  assert.match(seo, /Fitness Memberships & Gym Access/);
  assert.match(seo, /clean, accessible fitness memberships/i);
  assert.match(structuredData, /Clean, accessible fitness memberships/);
});

test("gym page does not mention APL class programming", () => {
  const gym = read("client/src/pages/Gym.tsx");

  assert.doesNotMatch(gym, /Athletic Performance Lab|APL Group Classes|S&C|Tier 1 APL/i);
  assert.doesNotMatch(gym, /packages?/i);
  assert.doesNotMatch(gym, /4\/8\/∞/);
});

test("APL page explains offerings, coaching, and who it is for", () => {
  const fitness = read("client/src/pages/Fitness.tsx");

  assert.match(fitness, /Athletic Performance Lab/);
  assert.match(fitness, /Offerings/);
  assert.match(fitness, /Coaches/);
  assert.match(fitness, /Who It's For/);
  assert.match(fitness, /Jordy Champagne/);
  assert.match(fitness, /Director of Strength and Conditioning/);
  assert.doesNotMatch(fitness, /Zach Brooks/);
  assert.doesNotMatch(fitness, /Coach Dom|Director of Performance/);
  assert.match(fitness, /https:\/\/www\.tier1nw\.com\/apl/);
});

test("personal training does not publish Dom's direct email", () => {
  const gym = read("client/src/pages/Gym.tsx");

  assert.doesNotMatch(gym, /dgraham@woodinvillesportsclub\.com/i);
  assert.doesNotMatch(gym, /Email Don Graham/i);
});

test("junior tennis pathway sends performance-minded juniors to Tier 1 Tennis", () => {
  const tennis = read("client/src/pages/Tennis.tsx");

  assert.match(tennis, /Junior Performance Development/);
  assert.match(tennis, /Explore Tier 1 Tennis/);
  assert.match(tennis, /Primary academy tracks/);
  assert.match(tennis, /Tier 1 Afterschool Academy/);
  assert.match(tennis, /Full Time Academy/);
  assert.match(tennis, /https:\/\/www\.tier1nw\.com\/tennis/);
});

test("tennis page uses junior confidence and matchplay photos", () => {
  const tennis = read("client/src/pages/Tennis.tsx");
  const responsiveImages = read("client/src/lib/responsive-image.ts");

  assert.match(tennis, /tennis-junior-confidence\.webp/);
  assert.match(tennis, /Confidence building/);
  assert.match(tennis, /tennis-matchplay-bench\.webp/);
  assert.match(tennis, /Friday Night UTR Matchplay[\s\S]*?TENNIS_MATCHPLAY_BENCH_IMG/);
  assert.match(responsiveImages, /tennis-junior-confidence\.webp/);
  assert.match(responsiveImages, /tennis-matchplay-bench\.webp/);
});

test("home facility chart includes golf sims and both fitness centers", () => {
  const home = read("client/src/pages/Home.tsx");

  assert.match(home, /Indoor Golf Sims/);
  assert.match(home, /Fitness Centers/);
  assert.match(home, /Main Gym \+ APL/);
});

test("founded year is 1976 across visible and structured content", () => {
  const files = [
    "client/src/pages/Home.tsx",
    "client/src/pages/About.tsx",
    "client/src/components/Footer.tsx",
    "client/src/components/StructuredData.tsx",
    "client/index.html",
  ];

  for (const file of files) {
    const source = read(file);

    assert.match(source, /1976/, `${file} should reference 1976`);
    assert.doesNotMatch(source, /1979/, `${file} should not reference 1979`);
  }
});

test("structured location uses the official WSC parcel coordinates", () => {
  const files = [
    "client/src/components/StructuredData.tsx",
    "client/index.html",
  ];

  for (const file of files) {
    const source = read(file);

    assert.match(source, /47\.73908/, `${file} should use the WSC parcel latitude`);
    assert.match(source, /-122\.14327/, `${file} should use the WSC parcel longitude`);
    assert.doesNotMatch(source, /47\.7543|-122\.1635/);
  }
});

test("FAQ structured data appears only with the visible FAQ content", () => {
  const index = read("client/index.html");
  const home = read("client/src/pages/Home.tsx");
  const sharedStructuredData = read("client/src/components/StructuredData.tsx");
  const faq = read("client/src/pages/FAQ.tsx");

  assert.doesNotMatch(index, /FAQPage|Structured Data: FAQ/);
  assert.doesNotMatch(home, /getFAQSchema/);
  assert.doesNotMatch(sharedStructuredData, /getFAQSchema|FAQPage/);
  assert.match(faq, /"@type": "FAQPage"/);
  assert.match(faq, /mainEntity: FAQS\.map/);
  assert.match(faq, /filteredFAQs\.map/);
});
