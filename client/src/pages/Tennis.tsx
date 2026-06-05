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
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const TENNIS_COURTS_IMG = "/images/wsc/tennis-courts.webp";
const TENNIS_HERO_IMG = TENNIS_COURTS_IMG;
const TENNIS_COACH_BALL_FEED_IMG = "/images/wsc/tennis-coach-ball-feed.webp";
const TENNIS_COACH_CONVERSATION_IMG = "/images/wsc/tennis-coach-conversation.webp";
const TENNIS_COACH_INSTRUCTION_IMG = "/images/wsc/tennis-coach-court-instruction.webp";
const TENNIS_JUNIOR_BALL_BASKET_IMG = "/images/wsc/tennis-junior-ball-basket.webp";
const TENNIS_JUNIOR_POINT_PLAY_IMG = "/images/wsc/tennis-junior-point-play.webp";
const TENNIS_JUNIOR_SERVE_IMG = "/images/wsc/tennis-junior-serve.webp";
const TENNIS_ALUMNI_SIGN_IMG = "/images/wsc/tennis-tier1-alumni-sign.webp";
const TENNIS_PLAYER_FOREHAND_IMG = "/images/wsc/tennis-player-forehand.webp";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";
const TIER1_TENNIS_URL = "https://www.tier1nw.com/tennis";
const TIER1_CORE_URL = "https://www.tier1nw.com/tennis/intro-classes";
const TIER1_COACHES_URL = "https://www.tier1nw.com/tennis#tennis-coaches";

const academyTracks = [
  {
    name: "Tier 1 Afterschool Academy",
    description: "Year-round training for junior players building technique, athletic habits, and match confidence after school.",
  },
  {
    name: "Full Time Academy",
    description: "A dedicated academy track for committed junior athletes pursuing a complete tennis and performance pathway.",
  },
];

const corePathway = [
  {
    name: "JumpStart",
    ages: "Ages 3-5",
    color: "#4da3ff",
  },
  {
    name: "Red Ball",
    ages: "Ages 5-8",
    color: "#ef4444",
  },
  {
    name: "Orange Ball",
    ages: "Ages 9-10",
    color: "#f97316",
  },
  {
    name: "Green Ball",
    ages: "Ages 10-12",
    color: "#22c55e",
  },
  {
    name: "Yellow Ball",
    ages: "Ages 12+",
    color: "#facc15",
  },
];

const adultClasses = [
  {
    name: "Intro to Tennis",
    level: "Beginner",
    desc: "For players with little to no tennis experience. Covers the five basic strokes, grips, and footwork.",
  },
  {
    name: "Co-ed Doubles Strategy Clinic",
    level: "NTRP 2.5-3.0",
    desc: "Net play, positioning, shot selection, movement patterns, communication, and match-play readiness.",
  },
  {
    name: "Shot Spotlight",
    level: "NTRP 2.5-3.5",
    desc: "A weekly deep dive into one featured shot, focused on form, execution, and repetition.",
  },
  {
    name: "Patterns & Point Play",
    level: "NTRP 2.5 advanced-3.5",
    desc: "Fast-paced rallying, player-fed points, consistency work, and competitive pattern training.",
  },
  {
    name: "Technique & Live Ball",
    level: "NTRP 2.5 advanced-3.5",
    desc: "Coach-fed technical instruction followed by champion/challenger style live-ball play.",
  },
  {
    name: "Small Group Intensives",
    level: "NTRP 3.0-4.0+",
    desc: "High-repetition training for players who want a harder, more focused class format.",
  },
];

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
  const { containerRef: coreRef, visibleItems: coreVisible } = useStaggerReveal(5, { staggerDelay: 110, threshold: 0.08 });
  const { containerRef: adultRef, visibleItems: adultVisible } = useStaggerReveal(6, { staggerDelay: 90, threshold: 0.06 });
  const { ref: leagueRef, isVisible: leagueVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.tennis} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Tennis", url: "https://www.woodinvillesportsclub.com/tennis" },
      ])]} />
      <PageHero
        eyebrow="Tier 1 Tennis"
        headline="Elevate Your Tennis Game at WSC."
        subtitle="World-class instruction and facilities for players of all levels. Home of Tier 1 Sports — one of the nation's leading developmental programs."
        image={TENNIS_HERO_IMG}
      />

      {/* Programs */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={programsRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${programsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Top-Tier Coaching</p>
          <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15] mb-14">
            Training pathways<br />for every level.
          </h2>

          <div className="mb-14 grid grid-cols-1 gap-[3px] md:grid-cols-3">
            {programVisuals.map((visual) => (
              <figure key={visual.src} className="group relative overflow-hidden bg-dark-bg">
                <ResponsiveImage
                  src={visual.src}
                  alt={visual.alt}
                  sizes="(min-width: 1024px) 31vw, 100vw"
                  loading="lazy"
                  pictureClassName="block"
                  className="aspect-[4/3] w-full object-cover saturate-[0.68] brightness-[0.9] transition-transform duration-[700ms] ease-out group-hover:scale-[1.035]"
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
            <p className="text-volt text-[12px] tracking-[0.2em] uppercase">Elite</p>
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
                    <span className="text-volt text-[10px] mt-1">—</span> {item}
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
            <p className="text-volt text-[12px] tracking-[0.2em] uppercase">Juniors</p>
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
                    <span className="text-volt text-[10px] mt-1">—</span> {item}
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
            <p className="text-volt text-[12px] tracking-[0.2em] uppercase">Adults</p>
            <div>
              <h3 className="text-[20px] font-light tracking-[-0.01em] mb-2">Adult Tennis</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-3">
                Rigorous group classes for players of all levels. Regular tournaments and UTR matchplay opportunities.
              </p>
              <ul className="space-y-1.5">
                {[
                  "Group classes focused on technique, drilling, and matchplay",
                  "Expert coaching for beginner to advanced players",
                  "Regular tournaments, socials, and matchplay opportunities",
                  "Competition training",
                ].map((item, i) => (
                  <li key={i} className="text-ink-mid text-[13px] leading-[1.72] flex items-start gap-2">
                    <span className="text-volt text-[10px] mt-1">—</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="https://app.courtreserve.com/Online/Portal/Index/6689"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
            >
              View Adult Tennis Schedule
            </a>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={facilitiesRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${facilitiesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Facilities</p>
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
                  <div className="text-volt-bright text-[28px] font-light tracking-[-0.02em] leading-none mb-1">
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
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div>
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Our Coaches</p>
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
                  <p className="text-volt text-[12px] tracking-[0.2em] uppercase mb-3">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-[20px] font-light tracking-[-0.01em] mb-4">{item.title}</h3>
                  <p className="text-ink-mid text-[14px] leading-[1.72]">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Training Gallery */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={galleryRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${galleryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:items-end">
            <div>
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Inside Tier 1 Training</p>
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
                  <p className="text-volt text-[12px] tracking-[0.2em] uppercase mb-3">{activeGalleryItem.label}</p>
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

      {/* Junior Performance Development */}
      <section className="bg-dark-bg px-6 lg:px-14 py-24 lg:py-28 overflow-hidden">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Junior Performance Development</p>
            <h2 className="text-parchment text-[clamp(30px,3.6vw,54px)] font-light tracking-[-0.03em] leading-[1.03] mb-6">
              Build the complete junior athlete.
            </h2>
            <p className="text-parchment/78 text-[16px] leading-[1.82] mb-8 max-w-[560px]">
              Tier 1 develops junior players through age-aware technical progressions, athletic movement, live-ball reps, and competitive habits. WSC shows the entry points here; Tier 1 carries athletes into the full tennis pathway, academy evaluation, and performance training.
            </p>
            <div className="flex flex-wrap gap-3 mb-9">
              {["Junior Athletes", "Performance Pathway", "Tier 1 Tennis"].map((item) => (
                <span key={item} className="text-parchment/75 text-[11px] tracking-[0.14em] uppercase border border-parchment/15 px-4 py-2">
                  {item}
                </span>
              ))}
            </div>
            <a
              href={TIER1_TENNIS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
            >
              Explore Tier 1 Tennis
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
            </a>
            <div className="mt-10 grid grid-cols-2 gap-[3px]">
              <ResponsiveImage
                src={TENNIS_JUNIOR_POINT_PLAY_IMG}
                alt="Junior tennis player hitting a forehand during Tier 1 training at Woodinville Sports Club"
                sizes="(min-width: 1024px) 20vw, 50vw"
                loading="lazy"
                className="aspect-[3/4] w-full object-cover saturate-[0.75] brightness-[0.88]"
                style={{ objectPosition: "center 42%" }}
              />
              <ResponsiveImage
                src={TENNIS_JUNIOR_BALL_BASKET_IMG}
                alt="Junior tennis player carrying balls on a racquet at Woodinville Sports Club"
                sizes="(min-width: 1024px) 20vw, 50vw"
                loading="lazy"
                className="aspect-[3/4] w-full object-cover saturate-[0.75] brightness-[0.88]"
                style={{ objectPosition: "center 42%" }}
              />
            </div>
          </div>

          <div ref={coreRef} className="relative">
            <div className="absolute left-6 right-6 top-[39px] hidden h-px bg-parchment/15 md:block" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {corePathway.map((level, i) => (
                <article
                  key={level.name}
                  className={`relative bg-white/[0.045] border border-parchment/10 p-6 min-h-[176px] transition-all duration-700 ease-out hover:border-volt-bright/45 ${coreVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                  <div
                    className="relative z-10 h-8 w-8 rounded-full border border-white/30 shadow-[0_0_24px_rgba(77,163,255,0.18)] mb-8"
                    style={{ backgroundColor: level.color }}
                  />
                  <p className="text-volt-bright text-[11px] tracking-[0.18em] uppercase mb-3">{level.ages}</p>
                  <h3 className="text-parchment text-[19px] font-light tracking-[-0.01em] leading-[1.2]">{level.name}</h3>
                </article>
              ))}
            </div>
            <div className="mt-5 border border-volt-bright/25 bg-volt-bright/[0.08] p-6 lg:p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-volt-bright text-[11px] tracking-[0.2em] uppercase mb-2">Primary academy tracks</p>
                  <p className="text-parchment/78 text-[13px] leading-[1.7] max-w-[600px]">
                    Want age-group pathways, academy options, evaluation details, and current programming? Continue to Tier 1 for the complete tennis overview.
                  </p>
                </div>
                <a
                  href={TIER1_TENNIS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 self-start text-volt-bright text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt-bright pb-[3px]"
                >
                  View Tier 1 Tennis
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.8} />
                </a>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {academyTracks.map((track) => (
                  <a
                    key={track.name}
                    href={TIER1_TENNIS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[178px] flex-col justify-between border border-volt-bright/35 bg-dark-bg/60 p-5 no-underline transition-colors duration-200 hover:border-volt-bright hover:bg-dark-bg/80"
                  >
                    <div>
                      <p className="text-volt-bright text-[11px] tracking-[0.18em] uppercase mb-4">Academy Track</p>
                      <h3 className="text-parchment text-[clamp(22px,2vw,29px)] font-light tracking-[-0.02em] leading-[1.05]">{track.name}</h3>
                      <p className="mt-4 text-parchment/70 text-[13px] leading-[1.6]">{track.description}</p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-volt-bright text-[11px] tracking-[0.14em] uppercase">
                      View Tier 1
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" strokeWidth={1.8} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adult Class Menu */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.52fr)] lg:items-end">
            <div>
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Adult Tennis</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
                Classes, socials, and matchplay.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] max-w-[720px]">
                Adult classes meet weekly, with drop-ins opening one week prior when available. Pricing varies by class length and session duration, typically $45-$75 + tax per class or $225-$325 + tax per 5-week session. Coaches evaluate new players and may suggest level adjustments.
              </p>
            </div>
            <ResponsiveImage
              src={TENNIS_PLAYER_FOREHAND_IMG}
              alt="Tennis player hitting a forehand during indoor training at Woodinville Sports Club"
              sizes="(min-width: 1024px) 34vw, 100vw"
              loading="lazy"
              className="aspect-[16/10] w-full object-cover saturate-[0.72] brightness-[0.9]"
              style={{ objectPosition: "center 39%" }}
            />
          </div>

          <div ref={adultRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
            {adultClasses.map((classItem, i) => (
              <article
                key={classItem.name}
                className={`bg-parchment p-8 border-t-2 border-transparent hover:border-volt transition-all duration-700 ease-out ${adultVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <p className="text-volt text-[12px] tracking-[0.2em] uppercase mb-3">{classItem.level}</p>
                <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">{classItem.name}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{classItem.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 bg-parchment p-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="text-volt text-[12px] tracking-[0.2em] uppercase mb-3">Friday Night UTR Matchplay</p>
              <h3 className="text-[20px] font-light tracking-[-0.01em] mb-3">Verified singles matches for juniors and adults.</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72]">
                Friday nights alternate between juniors 18 and under and adults 19+. Registration closes Wednesday night, draws post Thursday at 1:00 PM, and matches use Fast 4 scoring with opponents near each player's UTR level.
              </p>
            </div>
            <a
              href={COURT_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Register
            </a>
          </div>
        </div>
      </section>

      {/* Court Booking */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={bookingRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${bookingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Court Booking</p>
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
                <span className="text-volt-bright text-[16px] font-light">$21.14 + tax</span>
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
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={leagueRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.35fr] gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${leagueVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">USTA & SACT</p>
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
                <p className="text-volt text-[12px] tracking-[0.2em] uppercase mb-3">{item.label}</p>
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
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
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
