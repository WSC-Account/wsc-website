/* WSC homepage — tennis first, with live registration and supporting campus programs. */
import { lazy, Suspense, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { Instagram, ChevronRight, Quote } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import StructuredData, {
  getLocalBusinessSchema,
  getWebSiteSchema,
} from "@/components/StructuredData";
import { useFormProtection } from "@/hooks/useFormProtection";
import { useDeferredMount } from "@/hooks/useDeferredMount";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";
import { newsletterSubmissionMessage, submitWebsiteForm } from "@/lib/forms";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useSessionCalendar } from "@/hooks/useSessionCalendar";
import { summer2026Headline } from "@/lib/session-calendar";

const InstagramFeed = lazy(() => import("@/components/InstagramFeed"));
const FacilityGallery = lazy(() => import("@/components/FacilityGallery"));
const FullWidthImage = lazy(() => import("@/components/FullWidthImage"));

const TENNIS_HERO_IMG = "/images/wsc/tennis-junior-backhand.webp";
const TENNIS_IMG = "/images/wsc/tennis-adult-clinic.webp";
const GOLF_IMG = "/images/wsc/golf-practice-area.webp";
const PERF_IMG = "/images/wsc/gym-main-interior.webp";
const PICKLE_IMG = "/images/wsc/pickleball-dome.webp";

/* Existing campus and program photography */
const GALLERY_TENNIS = "/images/wsc/tennis-core-group.webp";
const GALLERY_GOLF = "/images/wsc/campus-sunset.webp";
const GALLERY_YOUTH = "/images/wsc/apl-speed-training.webp";
const GALLERY_ADULT_FITNESS = "/images/wsc/apl-medicine-ball.webp";

/* Real facility photos */
const SWINGLAB_IMG = "/images/wsc/swing-lab-simulators.webp";
const SUMMER_KIDS_IMG = "/images/wsc/summer-camp.webp";
const COURT_RESERVE_SIGN_UP_URL =
  "https://book.woodinvillesportsclub.com/Online/Portal/Index/6689";

const heroCollageImages = [
  {
    src: TENNIS_HERO_IMG,
    alt: "Junior tennis player practicing a backhand at Woodinville Sports Club",
    tile: "lead",
    position: "center 68%",
    sizes: "(min-width: 1024px) 42vw, 50vw",
  },
  {
    src: TENNIS_IMG,
    alt: "Adult tennis player working with a coach at Woodinville Sports Club",
    tile: "adult",
    position: "center 35%",
    sizes: "25vw",
  },
  {
    src: SUMMER_KIDS_IMG,
    alt: "Golf swing practice at Woodinville Sports Club",
    tile: "camp",
    position: "center 32%",
    sizes: "(min-width: 1024px) 17vw, 25vw",
  },
  {
    src: GOLF_IMG,
    alt: "Golf driving range at Woodinville Sports Club",
    tile: "golf",
    position: "center",
    sizes: "(min-width: 1024px) 17vw, 25vw",
  },
  {
    src: "/images/wsc/apl-training.webp",
    alt: "Athletic Performance Lab training at Woodinville Sports Club",
    tile: "fitness",
    position: "center 20%",
    sizes: "(min-width: 1024px) 17vw, 25vw",
  },
  {
    src: PICKLE_IMG,
    alt: "Pickleball in the WSC dome",
    tile: "pickleball",
    position: "center",
    sizes: "(min-width: 1024px) 17vw, 25vw",
  },
  {
    src: SWINGLAB_IMG,
    alt: "Swing Lab indoor golf simulators at Woodinville Sports Club",
    tile: "simulators",
    position: "center",
    sizes: "25vw",
  },
];

const campusFacts = [
  { label: "Tennis courts", detail: "8 indoor + 1 outdoor" },
  { label: "Driving range", detail: "23+ covered bays · Free Toptracer" },
  { label: "Swing Lab", detail: "4 golf simulators" },
  { label: "Fitness centers", detail: "2 — Main Gym + APL" },
  { label: "Campus", detail: "67 acres" },
  { label: "Established", detail: "1976" },
];

const disciplines = [
  {
    tag: "Golf",
    name: "Golf",
    desc: "A public driving range, grass tees, and a 2.5-acre short-game area. Coaching for juniors and adults.",
    img: GOLF_IMG,
    imageAlt: "Golf practice facilities at Woodinville Sports Club",
    imagePosition: "center",
    href: "/golf",
  },
  {
    tag: "Fitness",
    name: "Fitness Centers",
    desc: "Main Gym + APL. Gym memberships, personal training, and coached strength and conditioning for youth and adults.",
    img: PERF_IMG,
    imageAlt: "Main gym at Woodinville Sports Club",
    imagePosition: "center",
    href: "/gym",
  },
  {
    tag: "Pickleball",
    name: "Pickleball",
    desc: "Open play seven days a week, private court rentals, and classes in the Dome.",
    img: PICKLE_IMG,
    imageAlt: "The Dome pickleball facilities at Woodinville Sports Club",
    imagePosition: "center",
    href: "/pickleball",
  },
];

const testimonials = [
  {
    quote:
      "My kids started in Adventure Club and now they're in the tennis academy full time. This place became our second home. The coaches know our kids by name.",
    name: "Sarah M.",
    role: "Family All-Access Member since 2019",
  },
  {
    quote:
      "I joined for the driving range. I stayed for the community. Saturday mornings here — hitting balls, grabbing coffee, running into neighbors — it's the best part of my week.",
    name: "David L.",
    role: "Individual All-Access Member",
  },
  {
    quote:
      "As a competitive junior player, the Tier 1 program pushed my game to a level I didn't think was possible. Coach Filipp and the team genuinely care about every athlete.",
    name: "Maya K.",
    role: "Tier 1 Tennis Academy, Age 16",
  },
];

const galleryImages = [
  {
    src: "/images/wsc/tennis-coach-ball-feed.webp",
    alt: "Tennis coaching at Woodinville Sports Club",
    caption: "On court with the WSC coaching team",
    span: "wide" as const,
  },
  {
    src: TENNIS_IMG,
    alt: "Adult tennis clinic at WSC",
    caption: "Adult tennis clinic",
    span: "normal" as const,
  },
  {
    src: SWINGLAB_IMG,
    alt: "Swing Lab simulators",
    caption: "Swing Lab — 4 Uneekor simulators with 24 data points",
    span: "normal" as const,
  },
  {
    src: GALLERY_TENNIS,
    alt: "Junior tennis players training with WSC coaches",
    caption: "Junior tennis training",
    span: "normal" as const,
  },
  {
    src: GALLERY_YOUTH,
    alt: "Youth athletes running speed drills on an outdoor court at WSC",
    caption: "APL youth speed and athletic development",
    span: "normal" as const,
    uncropped: true,
  },
  {
    src: GALLERY_GOLF,
    alt: "Driving range at sunset",
    caption: "The driving range at sunset",
    span: "wide" as const,
  },
  {
    src: PICKLE_IMG,
    alt: "Pickleball dome",
    caption: "The Dome — open play 7 days a week",
    span: "normal" as const,
  },
  {
    src: GALLERY_ADULT_FITNESS,
    alt: "Adults training with medicine balls and resistance bands at WSC",
    caption: "Adult APL strength and movement training",
    span: "normal" as const,
    uncropped: true,
  },
];

function DeferredHomeSection({
  children,
  delayMs = 600,
}: {
  children: ReactNode;
  delayMs?: number;
}) {
  const ready = useDeferredMount(delayMs);
  if (!ready) return null;

  return <Suspense fallback={null}>{children}</Suspense>;
}

export default function Home() {
  const season = useSessionCalendar();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [newsletterStatusType, setNewsletterStatusType] = useState<
    "success" | "error"
  >("success");
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const {
    honeypotProps: newsletterHoneypotProps,
    validateSubmission: validateNewsletterSubmission,
  } = useFormProtection(1);

  const handleNewsletterSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const check = validateNewsletterSubmission();
    if (!check.valid) {
      if (check.reason === "honeypot") {
        setNewsletterStatus("Thank you for subscribing.");
        setNewsletterStatusType("success");
        setNewsletterEmail("");
        return;
      }
      if (check.reason === "too_fast") {
        setNewsletterStatus(
          "Please wait a moment, then try again. Your information has been kept."
        );
        setNewsletterStatusType("error");
        return;
      }
      if (check.reason === "rate_limited") {
        setNewsletterStatus("Please wait a moment before subscribing again.");
        setNewsletterStatusType("error");
        return;
      }
    }

    setIsNewsletterSubmitting(true);
    setNewsletterStatus("");
    try {
      const result = await submitWebsiteForm({
        formType: "newsletter_signup",
        source: "/",
        formName: "Newsletter Signup",
        email: newsletterEmail,
        subject: "WSC newsletter signup",
        metadata: {
          signupLocation: "home_newsletter",
          consent: "Submitted the WSC newsletter signup form.",
        },
      });

      const message = newsletterSubmissionMessage(result);
      setNewsletterStatus(message);
      setNewsletterStatusType("success");
      setNewsletterEmail("");
      notifySuccess(message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not subscribe you right now. Please try again.";
      setNewsletterStatus(message);
      setNewsletterStatusType("error");
      notifyError(message);
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <div className="home-page min-h-screen font-normal">
      <SEOHead {...SEO.home} />
      <StructuredData
        schemas={[getLocalBusinessSchema(), getWebSiteSchema()]}
      />

      {/* The original whole-club collage, with tennis leading the composition. */}
      <section
        className="bg-dark-bg pt-[var(--site-header-height,130px)]"
        aria-labelledby="home-title"
      >
        <div className="home-hero relative isolate overflow-hidden">
          <div className="home-hero-collage">
            {heroCollageImages.map((tile, index) => (
              <div
                key={tile.tile}
                className={`home-hero-tile home-hero-tile--${tile.tile}`}
              >
                <ResponsiveImage
                  src={tile.src}
                  alt={tile.alt}
                  sizes={tile.sizes}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  pictureClassName="block h-full w-full"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: tile.position }}
                />
              </div>
            ))}
          </div>
          <div
            className="home-hero-shade absolute inset-0 -z-10"
            aria-hidden="true"
          />
          <div className="home-hero-copy mx-auto w-full max-w-[1440px] px-6 py-9 sm:py-12 lg:px-14 lg:py-20">
            <h1
              id="home-title"
              className="max-w-[560px] text-[clamp(42px,5vw,72px)] font-light leading-[1.04] tracking-[-0.035em] text-parchment"
            >
              Train in
              <br />
              Woodinville.
            </h1>
            <p className="mt-5 max-w-[360px] text-[17px] leading-[1.6] text-parchment">
              Adult classes, junior programs from age 3, and Tier 1 academy
              training.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/tennis/adult"
                className="home-button bg-volt-bright text-dark-bg hover:bg-parchment"
              >
                Adult Tennis <ChevronRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/tennis#junior-tennis"
                className="home-button border border-parchment/70 text-parchment hover:bg-parchment hover:text-ink"
              >
                Junior Tennis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-wsc-border bg-parchment px-6 lg:px-14">
        <dl className="home-campus-facts mx-auto max-w-[1328px]">
          {campusFacts.map(fact => (
            <div key={fact.label}>
              <dt className="text-[13px] text-ink-mid">{fact.label}</dt>
              <dd className="mt-1.5 text-[15px] font-medium leading-[1.4] text-ink">
                {fact.detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Now at WSC — dates, status, and registration come from the shared calendar. */}
      <section
        className="bg-parchment-mid px-6 py-10 lg:px-14 lg:py-12"
        aria-labelledby="home-season-title"
      >
        <div className="mx-auto flex max-w-[1328px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-[720px]">
            <h2
              id="home-season-title"
              className="text-[25px] font-normal leading-[1.2] tracking-[-0.02em] sm:text-[30px]"
            >
              {season.title}
            </h2>
            <p className="mt-3 text-[16px] leading-[1.65] text-ink-mid">
              {season.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-5">
            <a
              href={season.ctaHref}
              target={season.external ? "_blank" : undefined}
              rel={season.external ? "noopener noreferrer" : undefined}
              className="home-button bg-ink text-parchment hover:bg-ink-mid"
            >
              {season.ctaLabel}
              <ChevronRight size={16} aria-hidden="true" />
            </a>
            <Link href="/sessions" className="home-text-link">
              Session dates
            </Link>
          </div>
        </div>
      </section>

      {/* ── TENNIS — THE CLUB'S PRIMARY PROGRAM ── */}
      <section
        id="home-programs"
        className="scroll-mt-[var(--site-header-height,130px)] bg-parchment px-6 py-16 lg:px-14 lg:py-24"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-wsc-border pb-7 lg:mb-12">
            <h2 className="text-[clamp(32px,3.5vw,48px)] font-light leading-[1.1] tracking-[-0.03em]">
              Adult & junior tennis.
            </h2>
            <Link href="/tennis" className="home-text-link">
              All tennis programs <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
            <article>
              <ResponsiveImage
                src={TENNIS_IMG}
                alt="An adult tennis player practicing with a WSC coach"
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
                style={{ objectPosition: "center 55%" }}
              />
              <h3 className="mt-6 text-[28px] font-normal leading-[1.2] tracking-[-0.02em]">
                Adult Tennis
              </h3>
              <p className="mt-3 max-w-[50ch] text-[16px] leading-[1.65] text-ink-mid">
                Beginner classes, clinics, team tennis, and matchplay.
              </p>
              <Link href="/tennis/adult" className="home-text-link mt-4">
                Explore Adult Tennis{" "}
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </article>
            <article>
              <ResponsiveImage
                src={GALLERY_TENNIS}
                alt="Young tennis players learning together with their WSC coach"
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
                style={{ objectPosition: "center 38%" }}
              />
              <h3 className="mt-6 text-[28px] font-normal leading-[1.2] tracking-[-0.02em]">
                Junior Tennis
              </h3>
              <p className="mt-3 max-w-[50ch] text-[16px] leading-[1.65] text-ink-mid">
                Programs from age 3, from first lessons through competitive
                development.
              </p>
              <Link
                href="/tennis#junior-tennis"
                className="home-text-link mt-4"
              >
                Explore Junior Tennis{" "}
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </article>
          </div>
          <div className="mt-12 flex flex-col gap-6 bg-dark-bg p-7 text-parchment sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-[26px] font-normal leading-[1.2] tracking-[-0.02em]">
                Tier 1 Tennis Academy
              </h3>
              <p className="mt-3 text-[16px] leading-[1.65] text-parchment/85">
                Coached training and matchplay for competitive junior players.
              </p>
            </div>
            <a
              href="https://www.tier1nw.com"
              target="_blank"
              rel="noopener noreferrer"
              className="home-button self-start border border-parchment/60 text-parchment hover:bg-parchment hover:text-ink lg:shrink-0"
            >
              Explore Tier 1 Tennis{" "}
              <ChevronRight size={16} aria-hidden="true" />
            </a>
          </div>

          {/* Summer Training — standalone */}
          {season.showSummer2026 && (
            <div className="mt-12 flex flex-col gap-6 border-t border-wsc-border pt-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-[600px]">
                <h3 className="text-[22px] font-light tracking-[-0.01em] mb-3">
                  {summer2026Headline(season.today)}
                </h3>
                <p className="text-ink-mid text-[16px] leading-[1.65]">
                  Tennis and Golf Academy programs, plus multi-sport Adventure
                  Club. Ages 3–18, June 29 – August 30.
                </p>
              </div>
              <Link
                href="/summer"
                className="inline-flex items-center gap-2 text-[14px] font-medium no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-mid hover:text-ink transition-colors duration-200 shrink-0"
              >
                Explore Summer
                <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── SUPPORTING CAMPUS PROGRAMS ── */}
      <section
        className="bg-parchment-mid px-6 py-16 lg:px-14 lg:py-20"
        aria-labelledby="home-campus-title"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5 border-b border-wsc-border pb-6">
            <h2
              id="home-campus-title"
              className="text-[30px] font-light leading-[1.15] tracking-[-0.02em]"
            >
              More at the club.
            </h2>
            <Link href="/membership" className="home-text-link">
              Memberships <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-10 md:grid-cols-3 lg:gap-8">
            {disciplines.map(d => (
              <article key={d.tag} className="min-w-0">
                <ResponsiveImage
                  src={d.img}
                  alt={d.imageAlt}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                  style={{ objectPosition: d.imagePosition }}
                />
                <h3 className="mt-5 text-[24px] font-normal leading-[1.2] tracking-[-0.02em]">
                  {d.name}
                </h3>
                <p className="mt-3 text-[16px] leading-[1.65] text-ink-mid">
                  {d.desc}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  <Link href={d.href} className="home-text-link">
                    {d.tag === "Fitness"
                      ? "Explore the gym"
                      : `Explore ${d.tag}`}{" "}
                    <ChevronRight size={16} aria-hidden="true" />
                  </Link>
                  {d.tag === "Fitness" && (
                    <Link href="/fitness" className="home-text-link">
                      Explore APL <ChevronRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACILITY GALLERY — Immersive Photo Grid ── */}
      <DeferredHomeSection delayMs={900}>
        <FacilityGallery
          images={galleryImages}
          title="Around the club"
          eyebrow=""
          dark
        />
      </DeferredHomeSection>

      {/* ── SWING LAB + TIER 1 GOLF — Compact Teasers ── */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[3px]">
            {/* Swing Lab Teaser */}
            <div className="bg-parchment overflow-hidden group">
              <div className="overflow-hidden">
                <ResponsiveImage
                  src={SWINGLAB_IMG}
                  alt="Swing Lab Golf Simulators at WSC"
                  loading="lazy"
                  className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="text-[22px] font-light tracking-[-0.01em] mb-3">
                  Swing Lab — Indoor Golf Sims
                </h3>
                <p className="text-ink-mid text-[16px] leading-[1.65] mb-5">
                  Four Uneekor simulators with 24 swing data points and over
                  2,000 courses to play.
                </p>
                <Link
                  href="/golf"
                  className="inline-flex items-center gap-1.5 text-ink text-[14px] font-medium no-underline border-b border-volt pb-[3px] group-hover:text-ink-mid transition-colors duration-200"
                >
                  Explore Swing Lab
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>

            {/* WSC Golf Academy Teaser */}
            <div className="bg-parchment overflow-hidden group">
              <div className="overflow-hidden">
                <ResponsiveImage
                  src={GOLF_IMG}
                  alt="Tier 1 Golf Academy at WSC"
                  loading="lazy"
                  className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="text-[22px] font-light tracking-[-0.01em] mb-3">
                  WSC Golf Academy Junior Pathway
                </h3>
                <p className="text-ink-mid text-[16px] leading-[1.65] mb-5">
                  Intro to Golf, age-group Golf Club training, and approval-only
                  Tier 1 High Performance for competitive athletes.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <a
                    href="https://www.tier1nw.com/golf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink text-[14px] font-medium no-underline border-b border-volt pb-[3px] group-hover:text-ink-mid transition-colors duration-200"
                  >
                    Explore Tier 1 Golf
                    <ChevronRight size={12} />
                  </a>
                  <Link
                    href="/golf"
                    className="text-ink-mid text-[14px] font-medium no-underline hover:text-ink transition-colors duration-200"
                  >
                    All golf programs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEMBER TESTIMONIALS ── */}
      <section className="bg-dark-bg px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-14">
            <h2 className="text-parchment text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15]">
              From our members
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-parchment/[0.06]">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-dark-bg p-8 lg:p-10">
                <Quote size={20} className="text-volt-bright/40 mb-6" />
                <p className="text-parchment/80 text-[16px] leading-[1.7] mb-8 italic">
                  "{t.quote}"
                </p>
                <div className="border-t border-parchment/[0.08] pt-5">
                  <p className="text-parchment text-[15px] font-medium mb-1">
                    {t.name}
                  </p>
                  <p className="text-parchment/75 text-[11px] tracking-[0.1em] uppercase">
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH VISUAL BREAK — Summer Kids ── */}
      {season.showSummer2026 && (
        <DeferredHomeSection delayMs={1100}>
          <FullWidthImage
            src={SUMMER_KIDS_IMG}
            alt="Summer camp kids at WSC"
            caption="Summer Training Camp — ages 3 to 18, June 29 through August 30."
            subcaption="Summer 2026"
            height="short"
          />
        </DeferredHomeSection>
      )}

      {/* ── MEMBERSHIP — Experience-First ── */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <h2 className="text-[clamp(32px,3.5vw,48px)] font-light leading-[1.1] tracking-[-0.03em]">
              Memberships
            </h2>
            <Link href="/membership" className="home-text-link">
              Compare memberships <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {/* Pricing tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px] mb-8">
            {[
              {
                name: "Family All-Access",
                price: "$100/mo",
                desc: "All household individuals — two adults max plus kids 17 and under. Includes class registration, court and range access, gym, sauna, locker rooms, plus golf simulator, range bucket, mini-golf, beverage, and golf happy hour perks.",
              },
              {
                name: "Individual All-Access",
                price: "$40/mo",
                desc: "One 18+ individual. Full campus access including class registration, court and range access, gym, sauna, locker rooms, plus golf simulator, range bucket, mini-golf, beverage, and golf happy hour perks.",
              },
              {
                name: "Court & Range Access",
                price: "$120/yr",
                desc: "Two 18+ individuals plus household. Enables court booking and class registration. Golf simulator booking with 7-day window, $4 off range buckets, and mini-golf discounts.",
              },
            ].map((m, i) => (
              <div key={i} className="bg-parchment-mid p-7 lg:p-9">
                <h3 className="text-[22px] font-normal tracking-[-0.01em] mb-4">
                  {m.name}
                </h3>
                <p className="text-ink text-[34px] font-normal tracking-[-0.03em] mb-5">
                  {m.price}
                </p>
                <p className="text-ink-mid text-[16px] leading-[1.65] mb-6">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href={COURT_RESERVE_SIGN_UP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[14px] font-medium no-underline bg-volt-bright text-dark-bg px-10 py-3.5 hover:bg-parchment-mid hover:text-ink transition-colors duration-200"
            >
              Start Your Membership
            </a>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER SIGNUP ── */}
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-28">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            The WSC newsletter
          </h2>
          <p className="text-parchment/75 text-[15px] leading-[1.75] mb-8">
            Schedules, registration deadlines, and club updates every Monday.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            data-form-name="Newsletter Signup"
          >
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address for newsletter subscription"
                disabled={isNewsletterSubmitting}
                className="flex-1 bg-dark-bg border border-parchment/[0.15] px-5 py-3 text-[16px] text-parchment placeholder:text-parchment/70 focus:border-volt-bright focus:outline-none transition-colors"
              />
              <input {...newsletterHoneypotProps} />
              <button
                type="submit"
                disabled={isNewsletterSubmitting}
                className={`text-[14px] font-medium px-8 py-3 transition-colors duration-200 ${
                  isNewsletterSubmitting
                    ? "bg-parchment/25 text-parchment/70 cursor-default"
                    : "bg-volt-bright text-dark-bg hover:bg-parchment"
                }`}
              >
                {isNewsletterSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            {newsletterStatus ? (
              <p
                role={newsletterStatusType === "error" ? "alert" : "status"}
                aria-live="polite"
                aria-atomic="true"
                className={`mt-4 text-[13px] leading-[1.6] ${
                  newsletterStatusType === "error"
                    ? "text-red-200"
                    : "text-parchment"
                }`}
              >
                {newsletterStatus}
              </p>
            ) : null}
            <p className="text-parchment/75 text-[13px] leading-[1.6] mt-4">
              Unsubscribe at any time. See our{" "}
              <Link
                href="/policies#privacy"
                className="text-parchment/70 underline hover:text-parchment transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-parchment px-6 pt-14 lg:px-14">
        <p className="text-[15px] text-ink-mid">
          Part of Woodinville since 1976.
        </p>
        <Link href="/contact" className="home-text-link">
          Plan a visit <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {/* ── INSTAGRAM FEED ── */}
      <DeferredHomeSection delayMs={1200}>
        <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col gap-5 mb-10 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[clamp(22px,2.4vw,32px)] font-light tracking-[-0.02em] leading-[1.15]">
                  @woodinvillesportsclub
                </h2>
              </div>
              <a
                href="https://www.instagram.com/woodinvillesportsclub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start text-[14px] font-medium no-underline text-ink border border-wsc-border px-6 py-2.5 hover:border-volt hover:text-ink-mid transition-colors duration-200 sm:self-auto"
              >
                <Instagram size={14} />
                Follow on Instagram
              </a>
            </div>
            <InstagramFeed />
          </div>
        </section>
      </DeferredHomeSection>
    </div>
  );
}
