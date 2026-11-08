/*
 * 4B Design — Tennis Page
 * Real content from WSC website crawl
 * Tier 1 Sports branding
 * Scroll reveal animations for consistent UX
 */
import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import Tier1Banner from "@/components/Tier1Banner";
import FullWidthImage from "@/components/FullWidthImage";
import ResponsiveImage from "@/components/ResponsiveImage";
import StructuredData, { getBreadcrumbSchema, getServiceSchema } from "@/components/StructuredData";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";
import { adultClasses, ADULT_CLASS_DETAILS } from "@/lib/adult-tennis";
import { juniorCoreSchedule } from "@/lib/junior-core";
import { pacificDay } from "@/lib/session-calendar";

const TENNIS_COURTS_IMG = "/images/wsc/tennis-courts.webp";
const TENNIS_PLAYER_IMG = "/images/wsc/tennis-player.webp";
const TENNIS_HERO_IMG = TENNIS_PLAYER_IMG;
const TENNIS_COACH_BALL_FEED_IMG = "/images/wsc/tennis-coach-ball-feed.webp";
const TENNIS_COACH_CONVERSATION_IMG = "/images/wsc/tennis-coach-conversation.webp";
const TENNIS_COACH_INSTRUCTION_IMG = "/images/wsc/tennis-coach-court-instruction.webp";
const TENNIS_JUNIOR_BALL_BASKET_IMG = "/images/wsc/tennis-junior-ball-basket.webp";
const TENNIS_JUNIOR_CONFIDENCE_IMG = "/images/wsc/tennis-junior-confidence.webp";
const TENNIS_JUNIOR_POINT_PLAY_IMG = "/images/wsc/tennis-junior-point-play.webp";
const TENNIS_JUNIOR_SERVE_IMG = "/images/wsc/tennis-junior-serve.webp";
const TENNIS_MATCHPLAY_BENCH_IMG = "/images/wsc/tennis-matchplay-bench.webp";
const TENNIS_ALUMNI_SIGN_IMG = "/images/wsc/tennis-tier1-alumni-sign.webp";
const TENNIS_PLAYER_FOREHAND_IMG = "/images/wsc/tennis-player-forehand.webp";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";
const TIER1_TENNIS_URL = "https://www.tier1nw.com/tennis";
const TIER1_CORE_URL = "https://www.tier1nw.com/tennis/intro-classes";
const TIER1_COACHES_URL = "https://www.tier1nw.com/tennis#tennis-coaches";
const SECTION_SPACING = "px-6 py-16 lg:px-14 lg:py-28";
const SECTION_SPACING_TIGHT = "px-6 py-14 lg:px-14 lg:py-28";

const programVisuals = [
  {
    src: TENNIS_COACH_BALL_FEED_IMG,
    alt: "Tier 1 coach feeding tennis balls during a training session at Woodinville Sports Club",
    label: "Core instruction",
    objectPosition: "center 43%",
  },
  {
    src: TENNIS_JUNIOR_POINT_PLAY_IMG,
    alt: "Junior tennis player striking a forehand during Tier 1 training at Woodinville Sports Club",
    label: "Junior pathway",
    objectPosition: "center 44%",
  },
  {
    src: TENNIS_COACH_CONVERSATION_IMG,
    alt: "Tier 1 coach speaking with a player on an indoor tennis court at Woodinville Sports Club",
    label: "Coach connection",
    objectPosition: "center 38%",
  },
];

const trainingGallery = [
  {
    src: TENNIS_COACH_BALL_FEED_IMG,
    alt: "Tier 1 coach feeding a ball from beside a training cart at Woodinville Sports Club",
    label: "Coaching standard",
    title: "High-repetition reps with an expert eye.",
    detail: "Coaches stay close to the work: feed, observe, correct, and keep the tempo high.",
    objectPosition: "center 42%",
  },
  {
    src: TENNIS_PLAYER_FOREHAND_IMG,
    alt: "Tennis player hitting a forehand during indoor training at Woodinville Sports Club",
    label: "Point patterns",
    title: "Players train live patterns, not just isolated strokes.",
    detail: "The program blends technical work with rally habits, movement, and competitive decisions.",
    objectPosition: "center 38%",
  },
  {
    src: TENNIS_COACH_CONVERSATION_IMG,
    alt: "Tier 1 coach and player talking between drills at Woodinville Sports Club",
    label: "Player feedback",
    title: "Teaching happens between balls, too.",
    detail: "Small coaching moments help players understand why a correction matters before the next rep.",
    objectPosition: "center 41%",
  },
  {
    src: TENNIS_JUNIOR_BALL_BASKET_IMG,
    alt: "Junior tennis player carrying balls on a racquet at Woodinville Sports Club",
    label: "Junior culture",
    title: "Young players learn the habits around the game.",
    detail: "The pathway builds responsibility, confidence, and comfort on court alongside technique.",
    objectPosition: "center 42%",
  },
  {
    src: TENNIS_JUNIOR_CONFIDENCE_IMG,
    alt: "Junior tennis player smiling on an indoor court at Woodinville Sports Club",
    label: "Confidence building",
    title: "Comfort on court grows one rep at a time.",
    detail: "The best junior environments leave room for focus, confidence, and joy between the competitive moments.",
    objectPosition: "center 46%",
  },
  {
    src: TENNIS_JUNIOR_POINT_PLAY_IMG,
    alt: "Junior tennis player hitting a forehand during point play at Woodinville Sports Club",
    label: "Competitive reps",
    title: "Junior athletes see real ball speed early.",
    detail: "Players grow through structured rallies, point play, and coaching that meets their level.",
    objectPosition: "center 44%",
  },
  {
    src: TENNIS_COACH_INSTRUCTION_IMG,
    alt: "Tennis coach giving on-court instruction with racquet in hand at Woodinville Sports Club",
    label: "Court instruction",
    title: "The staff is present, direct, and invested.",
    detail: "Coaching is hands-on, standards-driven, and rooted in day-to-day commitment to the sport.",
    objectPosition: "center 39%",
  },
];

const coachHighlights = [
  {
    title: "High-performance leadership",
    desc: "Tier 1 is led by Filipp Pogostkin, a former world-ranked professional and high-performance director whose work has helped players compete nationally, internationally, and at top college programs.",
  },
  {
    title: "A serious development staff",
    desc: "The coaching team brings backgrounds that include former world-ranked play, Division I college tennis, international coaching experience, and daily work with juniors chasing the next level.",
  },
  {
    title: "Committed to the craft",
    desc: "Tier 1 coaches are not casual instructors. They are invested in technical standards, athletic habits, competitive mindset, and doing the work the right way every day.",
  },
];

export default function Tennis() {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const activeGalleryItem = trainingGallery[activeGalleryIndex];
  const showPreviousGalleryItem = () => {
    setActiveGalleryIndex((current) => (current === 0 ? trainingGallery.length - 1 : current - 1));
  };
  const showNextGalleryItem = () => {
    setActiveGalleryIndex((current) => (current + 1) % trainingGallery.length);
  };

  // Scroll-reveal hooks
  const { ref: programsRef, isVisible: programsVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: facilitiesRef, isVisible: facilitiesVisible } = useScrollReveal({ threshold: 0.1 });
  const { containerRef: coachesRef, visibleItems: coachesVisible } = useStaggerReveal(3, { staggerDelay: 150, threshold: 0.08 });
  const { ref: galleryRef, isVisible: galleryVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: bookingRef, isVisible: bookingVisible } = useScrollReveal({ threshold: 0.1 });
  const { containerRef: adultRef, visibleItems: adultVisible } = useStaggerReveal(6, { staggerDelay: 90, threshold: 0.06 });
  const { ref: leagueRef, isVisible: leagueVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.tennis} />
      <StructuredData schemas={[
        getBreadcrumbSchema([
          { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
          { name: "Tennis", url: "https://www.woodinvillesportsclub.com/tennis" },
        ]),
        getServiceSchema({
          name: "Tennis Programs and Court Access",
          description: SEO.tennis.description,
          url: "https://www.woodinvillesportsclub.com/tennis",
          serviceType: "Tennis instruction, classes, academy training, and court rental",
          image: TENNIS_HERO_IMG,
          audience: "Junior and adult tennis players",
        }),
      ]} />
      <PageHero
        eyebrow="Tier 1 Tennis"
        headline="Elevate Your Tennis Game at WSC."
        subtitle="World-class instruction and facilities for players of all levels. Home of Tier 1 Sports — one of the nation's leading developmental programs."
        image={TENNIS_HERO_IMG}
        imagePosition="0% 8%"
      />

      <nav aria-label="Tennis pathways" className="bg-dark-bg px-6 py-6 lg:px-14">
        <div className="max-w-[1440px] mx-auto flex flex-wrap gap-4">
          <Link href="/tennis/adult" className="border border-parchment/40 px-6 py-3 text-parchment no-underline hover:bg-parchment/10">Explore Adult Tennis</Link>
          <a href="#junior-tennis" className="border border-parchment/40 px-6 py-3 text-parchment no-underline hover:bg-parchment/10">Explore Junior Tennis</a>
        </div>
      </nav>

      {/* Programs */}
      <section className={`bg-parchment ${SECTION_SPACING}`}>
        <div
          ref={programsRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${programsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">Top-Tier Coaching</p>
          <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15] mb-8 lg:mb-14">
            Training pathways<br />for every level.
          </h2>

          <div className="mb-10 grid grid-cols-1 gap-[3px] md:grid-cols-3 lg:mb-14">
            {programVisuals.map((visual) => (
              <figure key={visual.src} className="group relative overflow-hidden bg-dark-bg">
                <ResponsiveImage
                  src={visual.src}
                  alt={visual.alt}
                  sizes="(min-width: 1024px) 31vw, 100vw"
                  loading="lazy"
                  pictureClassName="block"
                  className="aspect-[4/3] w-full object-cover saturate-[0.68] brightness-[0.9] transition-transform duration-[700ms] ease-out group-hover:scale-[1.035] md:aspect-[5/4] lg:aspect-[4/3]"
                  style={{ objectPosition: visual.objectPosition }}
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-bg/80 to-transparent px-5 pb-5 pt-12 text-parchment text-[11px] tracking-[0.16em] uppercase">
                  {visual.label}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Tier 1 Performance NW */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-4 lg:gap-12 items-baseline py-8 border-b border-wsc-border">
            <p className="text-accent-on-light text-[12px] tracking-[0.2em] uppercase">Elite</p>
            <div>
              <h3 className="text-[20px] font-light tracking-[-0.01em] mb-2">Tier 1 Performance NW</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-3">
                Elite youth academy for aspiring champions. Full-time and after-school options with intensive training programs and top-notch facilities.
              </p>
              <ul className="space-y-1.5">
                {[
                  "Personalized coaching from former world-ranked players and D1 standouts",
                  "Tournament preparation and college recruitment assistance",
                  "Learning facilities for Full-Time Academy kids",
                ].map((item, i) => (
                  <li key={i} className="text-ink-mid text-[13px] leading-[1.72] flex items-start gap-2">
                    <span className="text-accent-on-light text-[10px] mt-1">—</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={TIER1_TENNIS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
            >
              Explore Tier 1 Tennis
            </a>
          </div>

          {/* Tier 1 Core */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-4 lg:gap-12 items-baseline py-8 border-b border-wsc-border">
            <p className="text-accent-on-light text-[12px] tracking-[0.2em] uppercase">Juniors</p>
            <div>
              <h3 className="text-[20px] font-light tracking-[-0.01em] mb-1">Tier 1 Core Tennis</h3>
              <p className="text-ink-light text-[11px] tracking-[0.08em] uppercase mb-3">Formerly RPM Tennis</p>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-3">
                Junior tennis classes for ages 3 and up, built around athletic movement, technical foundations, and the habits that prepare players for higher-performance training.
              </p>
              <ul className="space-y-1.5">
                {[
                  "Athletic movement and coordination",
                  "High activity and repetition",
                  "Age-appropriate courts and equipment",
                  "Basic rally and game play",
                  "Learning through play — fun and confidence building",
                ].map((item, i) => (
                  <li key={i} className="text-ink-mid text-[13px] leading-[1.72] flex items-start gap-2">
                    <span className="text-accent-on-light text-[10px] mt-1">—</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={TIER1_CORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
            >
              Learn More About Tier 1 Core
            </a>
          </div>

          {/* Adult Tennis */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-4 lg:gap-12 items-baseline py-8 border-b border-wsc-border">
            <p className="text-accent-on-light text-[12px] tracking-[0.2em] uppercase">Adults</p>
            <div>
              <h3 className="text-[20px] font-light tracking-[-0.01em] mb-2">Adult Tennis</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-3">
                Start playing, sharpen your skills, or find your next match. Coached classes for beginners through advanced players, plus team tennis and UTR matchplay.
              </p>
              <p className="text-ink text-[14px] mb-3">
                Adult Tennis Director: Connor Vordale
              </p>
              <ul className="space-y-1.5">
                {[
                  "Group classes focused on technique, drilling, and matchplay",
                  "Expert coaching for beginner to advanced players",
                  "Regular tournaments, socials, and matchplay opportunities",
                  "Competition training",
                ].map((item, i) => (
                  <li key={i} className="text-ink-mid text-[13px] leading-[1.72] flex items-start gap-2">
                    <span className="text-accent-on-light text-[10px] mt-1">—</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/tennis/adult"
              className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
            >
              Explore Adult Tennis
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className={`bg-parchment-mid ${SECTION_SPACING_TIGHT}`}>
        <div
          ref={facilitiesRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${facilitiesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">Facilities</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              Eight indoor courts.<br />One outdoor court.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Our indoor tennis facility provides year-round play through Pacific Northwest weather, with one outdoor court available for fresh-air hitting when conditions allow. Professional-grade surfaces and consistent indoor lighting support focused training conditions.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { val: "8", label: "Indoor Courts" },
                { val: "3+", label: "Age Groups" },
                { val: "UTR", label: "Matchplay" },
                { val: "Year", label: "Round Play" },
              ].map((m, i) => (
                <div key={i} className="py-4 border-t border-wsc-border">
                  <div className="text-accent-on-light text-[28px] font-light tracking-[-0.02em] leading-none mb-1">
                    {m.val}
                  </div>
                  <div className="text-ink-light text-[11px] tracking-[0.14em] uppercase">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-[3px] sm:grid-cols-[minmax(0,1fr)_minmax(120px,0.34fr)]">
            <ResponsiveImage
              src={TENNIS_COURTS_IMG}
              alt="Indoor tennis courts at Woodinville Sports Club"
              loading="lazy"
              pictureClassName="block h-full"
              className="min-h-[320px] w-full object-cover saturate-[0.55] brightness-[0.85] sm:min-h-[420px]"
              style={{ objectPosition: "25% 24%" }}
            />
            <div className="grid grid-cols-2 gap-[3px] sm:grid-cols-1">
              <ResponsiveImage
                src={TENNIS_ALUMNI_SIGN_IMG}
                alt="Tier 1 and WSC alumni sign at Woodinville Sports Club"
                sizes="(min-width: 1024px) 18vw, 50vw"
                loading="lazy"
                pictureClassName="block h-full"
                className="h-full min-h-[190px] w-full object-cover saturate-[0.78] brightness-[0.9]"
                style={{ objectPosition: "center" }}
              />
              <ResponsiveImage
                src={TENNIS_JUNIOR_SERVE_IMG}
                alt="Junior tennis player serving at Woodinville Sports Club"
                sizes="(min-width: 1024px) 18vw, 50vw"
                loading="lazy"
                pictureClassName="block h-full"
                className="h-full min-h-[190px] w-full object-cover saturate-[0.72] brightness-[0.9]"
                style={{ objectPosition: "center 28%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Staff */}
      <section className={`bg-parchment ${SECTION_SPACING_TIGHT}`}>
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 gap-9 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div>
              <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">Our Coaches</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-7">
                Coaches who live the sport.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
                WSC tennis is powered by Tier 1 coaches who have built their lives around player development. The staff brings elite playing backgrounds, high-performance coaching standards, and a shared commitment to helping athletes train with purpose.
              </p>
              <a
                href={TIER1_COACHES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
              >
                Meet the Tier 1 Coaches
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
              </a>
            </div>

            <div ref={coachesRef} className="grid grid-cols-1 gap-[3px]">
              {coachHighlights.map((item, i) => (
                <article
                  key={item.title}
                  className={`bg-parchment-mid p-8 lg:p-10 transition-all duration-700 ease-out ${coachesVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                  <p className="text-accent-on-light text-[12px] tracking-[0.2em] uppercase mb-3">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-[20px] font-light tracking-[-0.01em] mb-4">{item.title}</h3>
                  <p className="text-ink-mid text-[14px] leading-[1.72]">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Training Gallery */}
      <section className={`bg-parchment-mid ${SECTION_SPACING_TIGHT}`}>
        <div
          ref={galleryRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${galleryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="mb-9 grid grid-cols-1 gap-6 lg:mb-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:items-end">
            <div>
              <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">Inside Tier 1 Training</p>
              <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15]">
                Coaches and players<br />on court together.
              </h2>
            </div>
            <p className="text-ink-mid text-[16px] leading-[1.82] max-w-[720px]">
              The day-to-day environment is hands-on: coaches feeding balls, players moving through live patterns, juniors learning responsibility, and feedback happening right on court.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-[3px] lg:grid-cols-[minmax(0,1.18fr)_minmax(280px,0.52fr)]">
            <figure className="relative overflow-hidden bg-dark-bg">
              <ResponsiveImage
                key={activeGalleryItem.src}
                src={activeGalleryItem.src}
                alt={activeGalleryItem.alt}
                sizes="(min-width: 1024px) 62vw, 100vw"
                loading="lazy"
                pictureClassName="block"
                className="aspect-[16/10] w-full object-cover saturate-[0.72] brightness-[0.86] transition-opacity duration-300 lg:aspect-[16/9]"
                style={{ objectPosition: activeGalleryItem.objectPosition }}
              />
              <figcaption
                aria-live="polite"
                className="absolute bottom-5 left-5 bg-dark-bg/72 px-4 py-3 text-parchment backdrop-blur-sm"
              >
                <p className="text-volt-bright text-[11px] tracking-[0.18em] uppercase">
                  {String(activeGalleryIndex + 1).padStart(2, "0")} / {String(trainingGallery.length).padStart(2, "0")} — {activeGalleryItem.label}
                </p>
              </figcaption>
              <div className="absolute right-5 top-5 flex gap-2">
                <button
                  type="button"
                  onClick={showPreviousGalleryItem}
                  className="flex h-11 w-11 items-center justify-center border border-parchment/35 bg-dark-bg/65 text-parchment transition-colors duration-200 hover:border-volt-bright hover:text-volt-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-bright"
                  aria-label="Show previous tennis training photo"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={showNextGalleryItem}
                  className="flex h-11 w-11 items-center justify-center border border-parchment/35 bg-dark-bg/65 text-parchment transition-colors duration-200 hover:border-volt-bright hover:text-volt-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-bright"
                  aria-label="Show next tennis training photo"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" strokeWidth={1.8} />
                </button>
              </div>
            </figure>

            <div className="grid grid-cols-2 gap-[3px] bg-parchment">
              <div className="col-span-2 flex flex-col justify-between bg-parchment p-7 lg:min-h-[226px]">
                <div>
                  <p className="text-accent-on-light text-[12px] tracking-[0.2em] uppercase mb-3">{activeGalleryItem.label}</p>
                  <h3 className="text-[22px] font-light tracking-[-0.01em] leading-[1.15] mb-4">{activeGalleryItem.title}</h3>
                  <p className="text-ink-mid text-[14px] leading-[1.72]">{activeGalleryItem.detail}</p>
                </div>
                <div className="mt-7 flex gap-2" aria-label="Tennis training photo selector">
                  {trainingGallery.map((item, i) => (
                    <button
                      key={item.src}
                      type="button"
                      onClick={() => setActiveGalleryIndex(i)}
                      className={`h-1.5 flex-1 transition-colors duration-200 ${i === activeGalleryIndex ? "bg-volt-bright" : "bg-ink/20 hover:bg-ink/40"}`}
                      aria-label={`Show ${item.label} photo`}
                      aria-pressed={i === activeGalleryIndex}
                    />
                  ))}
                </div>
              </div>

              {trainingGallery.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setActiveGalleryIndex(i)}
                  className={`group relative aspect-[16/10] overflow-hidden bg-dark-bg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-bright ${i === activeGalleryIndex ? "ring-2 ring-volt-bright ring-inset" : ""}`}
                  aria-label={`Show ${item.label} photo`}
                  aria-pressed={i === activeGalleryIndex}
                >
                  <ResponsiveImage
                    src={item.src}
                    alt=""
                    sizes="(min-width: 1024px) 15vw, 50vw"
                    loading={i < 2 ? "eager" : "lazy"}
                    pictureClassName="block h-full"
                    className="h-full w-full object-cover saturate-[0.58] brightness-[0.76] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    style={{ objectPosition: item.objectPosition }}
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-bg/82 to-transparent px-3 pb-3 pt-8 text-[10px] tracking-[0.14em] uppercase text-parchment">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Junior Core classes */}
      <section id="junior-tennis" className={`bg-parchment ${SECTION_SPACING} scroll-mt-[var(--site-header-height,130px)]`}>
        <div className="max-w-[1440px] mx-auto">
          <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">Junior Tennis at WSC</p>
          <h2 className="text-3xl lg:text-4xl font-light mb-4">Junior Core class times</h2>
          <p className="text-ink-mid leading-relaxed max-w-3xl mb-6">
            Build the foundations with Core Jump Start, Red Ball, Orange Ball, Green Ball, and Yellow Ball.
            Find a weekly time below, then select it to view class details, placement guidance, pricing, and registration in CourtReserve.
          </p>
          {pacificDay() <= juniorCoreSchedule.end ? (
            <>
              <p className="font-medium text-ink mb-2">{juniorCoreSchedule.label}</p>
              <p className="text-sm text-ink-mid mb-6">All times Pacific. Thursday classes skip Thanksgiving (Nov 26).</p>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {juniorCoreSchedule.classes.map(({ name, times }) => (
                  <article key={name} className="border border-wsc-border bg-parchment-mid/40">
                    <h3 className="border-b border-wsc-border px-5 py-4 text-xl font-light">{name}</h3>
                    <ul className="divide-y divide-wsc-border px-5">
                      {times.map(({ day, time, event }) => (
                        <li key={event} className="flex items-baseline justify-between gap-3 py-3 text-sm">
                          <span className="text-ink-mid">{day}</span>
                          <a
                            href={`https://app.courtreserve.com/Online/Events/Details/6689/${event}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-baseline gap-1.5 text-ink underline underline-offset-4 hover:text-accent-on-light"
                            aria-label={`${name}, ${day}, ${time} in CourtReserve`}
                          >
                            <span className="tabular-nums">{time}</span>
                            <ArrowUpRight size={13} className="shrink-0" aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <p className="mt-4 text-sm text-ink-mid">CourtReserve shows live availability, waitlists, and holiday programs.</p>
            </>
          ) : (
            <a href={COURT_RESERVE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-ink underline underline-offset-4">
              Check current Core class times in CourtReserve <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
          <div className="mt-10 flex flex-col gap-5 border-t border-wsc-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-light mb-2">Explore the Academy pathway</h3>
              <p className="text-ink-mid leading-relaxed max-w-2xl">Visit Tier 1 for Academy programs, player evaluations, and the full performance pathway.</p>
            </div>
            <a href={TIER1_TENNIS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-dark-bg px-6 py-3 text-sm text-parchment no-underline hover:bg-ink-mid">
              Explore Tier 1 Academy <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Adult Class Menu */}
      <section id="adult-tennis" className={`bg-parchment-mid ${SECTION_SPACING} scroll-mt-[var(--site-header-height,130px)]`}>
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-10 grid grid-cols-1 gap-8 lg:mb-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.52fr)] lg:items-end">
            <div>
              <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">Adult Tennis</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
                Classes, socials, and matchplay.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] max-w-[720px]">
                {ADULT_CLASS_DETAILS}
              </p>
              <Link
                href="/tennis/adult#classes"
                className="mt-4 inline-block text-ink underline underline-offset-4"
              >
                See adult tennis class times
              </Link>
            </div>
            <div className="hidden lg:block">
              <ResponsiveImage
                src={TENNIS_PLAYER_FOREHAND_IMG}
                alt="Tennis player hitting a forehand during indoor training at Woodinville Sports Club"
                sizes="(min-width: 1024px) 34vw, 100vw"
                loading="lazy"
                className="aspect-[16/10] w-full object-cover saturate-[0.72] brightness-[0.9]"
                style={{ objectPosition: "center 39%" }}
              />
            </div>
          </div>

          <div ref={adultRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
            {adultClasses.map((classItem, i) => (
              <article
                key={classItem.name}
                className={`bg-parchment p-6 border-t-2 border-transparent hover:border-volt transition-all duration-700 ease-out lg:p-8 ${adultVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <p className="text-accent-on-light text-[12px] tracking-[0.2em] uppercase mb-3">{classItem.level}</p>
                <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">{classItem.name}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{classItem.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-7 bg-parchment p-6 lg:mt-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.55fr)] lg:gap-8 lg:p-8 lg:items-center">
            <div>
              <p className="text-accent-on-light text-[12px] tracking-[0.2em] uppercase mb-3">Friday Night UTR Matchplay</p>
              <h3 className="text-[20px] font-light tracking-[-0.01em] mb-3">Verified singles matches for juniors and adults.</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72]">
                Friday nights alternate between juniors 18 and under and adults 19+. Registration closes Wednesday night, draws post Thursday at 1:00 PM, and matches use Fast 4 scoring with opponents near each player's UTR level.
              </p>
              <a
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
              >
                Register
              </a>
            </div>
            <ResponsiveImage
              src={TENNIS_MATCHPLAY_BENCH_IMG}
              alt="Junior tennis player sitting courtside during matchplay at Woodinville Sports Club"
              sizes="(min-width: 1024px) 34vw, 100vw"
              loading="lazy"
              className="aspect-[16/10] w-full object-cover saturate-[0.7] brightness-[0.92]"
              style={{ objectPosition: "center 52%" }}
            />
          </div>
        </div>
      </section>

      {/* Court Booking */}
      <section className={`bg-parchment-mid ${SECTION_SPACING_TIGHT}`}>
        <div
          ref={bookingRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${bookingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">Court Booking</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
              Court Booking<br />Access Pass.
            </h2>
          </div>
          <div>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
              $120 + tax annual fee for the Court Booking Access Pass. Reserve courts up to 7 days in advance using CourtReserve or by visiting/calling our front desk.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-wsc-border">
                <span className="text-ink text-[14px]">Per 30 Minutes</span>
                <span className="text-accent-on-light text-[16px] font-light">$21.14 + tax</span>
              </div>
              <div className="flex justify-between py-3 border-b border-wsc-border">
                <span className="text-ink text-[14px]">Booking Increments</span>
                <span className="text-ink-mid text-[14px]">30, 60 & 90 minutes</span>
              </div>
              <div className="flex justify-between py-3 border-b border-wsc-border">
                <span className="text-ink text-[14px]">Non-Member Guest Fee</span>
                <span className="text-ink-mid text-[14px]">$10 + tax (member must be present)</span>
              </div>
            </div>
            <p className="text-ink-light text-[13px] italic mb-8">
              Tennis instruction by unauthorized coaches is strictly prohibited.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/membership"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
              >
                Membership Sign Up
              </Link>
              <a
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-ink border border-wsc-border px-8 py-3.5 hover:border-volt transition-colors duration-200"
              >
                Book a Court
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Team Tennis */}
      <section className={`bg-parchment ${SECTION_SPACING_TIGHT}`}>
        <div
          ref={leagueRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.35fr] gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${leagueVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">USTA & SACT</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              Team tennis at WSC.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82]">
              WSC welcomes USTA and Seattle Area Cup Tennis teams. Captains must hold at least a Class Registration Pass, and at least one captain per team must have a valid WSC membership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {[
              {
                label: "Match Length",
                desc: "League matches typically run 90 minutes. Matches beyond 95 minutes must continue on an overflow court or be scheduled for completion later.",
              },
              {
                label: "Team Fees",
                desc: "Home and visiting teams pay $21 + tax per person in one lump-sum payment at the front desk.",
              },
              {
                label: "Warm-Up Courts",
                desc: "Home captains with booking privileges may reserve warm-up courts up to 7 days in advance. Visiting teams may book within 24 hours by calling the front desk.",
              },
              {
                label: "Cancellation",
                desc: "Teams must communicate match cancellations at least 24 hours before the scheduled match time. Late defaults may be responsible for the full court cost.",
              },
            ].map((item) => (
              <article key={item.label} className="bg-parchment-mid p-8">
                <p className="text-accent-on-light text-[12px] tracking-[0.2em] uppercase mb-3">{item.label}</p>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width visual break */}
      <FullWidthImage
        src={TENNIS_COACH_INSTRUCTION_IMG}
        alt="Tennis coach giving on-court instruction at Woodinville Sports Club"
        caption="Tennis at WSC pairs high-repetition coaching with a clear player pathway."
        subcaption="Tier 1 Tennis Academy"
        height="medium"
      />

      {/* Tier 1 compact banner */}
      <Tier1Banner variant="compact" />

      {/* CTA */}
      <section className="bg-dark-mid px-6 py-16 lg:px-14 lg:py-24">
        <div
          ref={ctaRef}
          className={`max-w-[1440px] mx-auto text-center transition-all duration-700 ease-out ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Get Started</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
            Ready to step on court?
          </h2>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href="/membership"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
            >
              View Membership
            </Link>
            <a
              href="https://app.courtreserve.com/Online/Portal/Index/6689"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
            >
              Book a Court
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
