/*
 * 4B Design — Tennis Page
 * Real content from WSC website crawl
 * Tier 1 Sports branding
 * Scroll reveal animations for consistent UX
 */
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import Tier1Banner from "@/components/Tier1Banner";
import FullWidthImage from "@/components/FullWidthImage";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const TENNIS_IMG = "/images/wsc/tennis-courts.webp";
const TENNIS_ACTION = "/images/wsc/tennis-player.webp";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";

const corePathway = [
  {
    name: "JumpStart",
    ages: "Ages 3-5",
    desc: "Hand-eye coordination, fundamental skills, and lots of fun for the youngest players.",
  },
  {
    name: "Red Ball",
    ages: "Ages 5-8",
    desc: "Scaled courts and red balls for basic strokes, movement, confidence, and a love for the game.",
  },
  {
    name: "Orange Ball",
    ages: "Ages 9-10",
    desc: "Orange balls and modified court sizes for technique, footwork, and early strategy.",
  },
  {
    name: "Green Ball",
    ages: "Ages 10-12",
    desc: "Stroke development, tactical awareness, and match play fundamentals on standard court sizes.",
  },
  {
    name: "Yellow Ball",
    ages: "Ages 12+",
    desc: "Full-court training with standard balls, advanced technique, match strategy, and competitive play.",
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

export default function Tennis() {
  // Scroll-reveal hooks
  const { ref: programsRef, isVisible: programsVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: facilitiesRef, isVisible: facilitiesVisible } = useScrollReveal({ threshold: 0.1 });
  const { containerRef: coachesRef, visibleItems: coachesVisible } = useStaggerReveal(3, { staggerDelay: 150, threshold: 0.08 });
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
        image={TENNIS_IMG}
      />

      {/* Programs */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={programsRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${programsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Top-Tier Coaching</p>
          <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15] mb-14">
            Training pathways<br />for every level.
          </h2>

          {/* Tier 1 Performance NW */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-4 lg:gap-12 items-baseline py-8 border-b border-wsc-border">
            <p className="text-volt text-[10px] tracking-[0.2em] uppercase">Elite</p>
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
              href="https://www.tier1nw.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
            >
              Learn More About Tier 1 Performance
            </a>
          </div>

          {/* Tier 1 Core */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-4 lg:gap-12 items-baseline py-8 border-b border-wsc-border">
            <p className="text-volt text-[10px] tracking-[0.2em] uppercase">Juniors</p>
            <div>
              <h3 className="text-[20px] font-light tracking-[-0.01em] mb-1">Tier 1 Core Tennis</h3>
              <p className="text-ink-light text-[11px] tracking-[0.08em] uppercase mb-3">Formerly RPM Tennis</p>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-3">
                Junior tennis classes for ages 3 and up, with pathways for recreational and elite development.
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
              href="https://www.tier1nw.com/tennis/intro-classes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
            >
              Learn More About Tier 1 Core
            </a>
          </div>

          {/* Adult Tennis */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-4 lg:gap-12 items-baseline py-8 border-b border-wsc-border">
            <p className="text-volt text-[10px] tracking-[0.2em] uppercase">Adults</p>
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
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Facilities</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              Eight indoor courts.<br />Climate controlled.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Our indoor tennis facility provides year-round play regardless of Pacific Northwest weather. Professional-grade surfaces, consistent lighting, and a controlled environment for optimal training conditions.
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
          <img
            src={TENNIS_IMG}
            alt="Indoor tennis courts at Woodinville Sports Club"
            width={1800}
            height={1218}
            loading="lazy"
            className="w-full aspect-[4/3] object-cover saturate-[0.55] brightness-[0.85]"
          />
        </div>
      </section>

      {/* Coaching Staff */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-14">
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Our Coaches</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
              Trained by the best.
            </h2>
          </div>

          <div ref={coachesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
            {[
              {
                name: "Filipp Pogostkin",
                title: "Director, Tier 1 Performance NW",
                credential: "Former world-ranked professional",
                philosophy: "Building complete athletes who compete with confidence at the highest levels. Every player deserves a personalized pathway.",
              },
              {
                name: "Coaching Staff",
                title: "Tier 1 Core Tennis",
                credential: "D1 collegiate standouts & certified professionals",
                philosophy: "Making tennis accessible and fun from age 3 through adult. High-repetition, age-appropriate training that builds skills and love for the game.",
              },
              {
                name: "Adult Program Staff",
                title: "Adult Tennis & Matchplay",
                credential: "USPTA & PTR certified coaches",
                philosophy: "Competitive group training, UTR matchplay, and tournament preparation for adult players who want to keep improving.",
              },
            ].map((coach, i) => (
              <div
                key={i}
                className={`bg-parchment-mid p-8 lg:p-10 transition-all duration-700 ease-out ${coachesVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <div className="w-16 h-16 rounded-full bg-dark-bg/10 flex items-center justify-center mb-6">
                  <span className="text-volt text-[20px] font-light">{coach.name.charAt(0)}</span>
                </div>
                <h3 className="text-[18px] font-light tracking-[-0.01em] mb-1">{coach.name}</h3>
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-1.5">{coach.title}</p>
                <p className="text-ink-mid text-[11px] tracking-[0.08em] uppercase mb-5">{coach.credential}</p>
                <p className="text-ink-mid text-[14px] leading-[1.72] italic">"{coach.philosophy}"</p>
              </div>
            ))}
          </div>

          <p className="text-ink-light text-[13px] mt-6 italic">
            Coach headshots and full bios coming soon. Contact us to learn more about our coaching team.
          </p>
        </div>
      </section>

      {/* Tier 1 Core Pathway */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Junior Pathway</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            Red-to-yellow ball development.
          </h2>
          <p className="text-ink-mid text-[16px] leading-[1.82] mb-14 max-w-[720px]">
            Tier 1 Core Tennis, formerly RPM, uses the red-to-yellow ball pathway followed by the USTA. Classes are built for ages 3 and up, with age-appropriate equipment, modified court sizes, and progressive skill development.
          </p>

          <div ref={coreRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[3px]">
            {corePathway.map((level, i) => (
              <article
                key={level.name}
                className={`bg-parchment-mid p-7 transition-all duration-700 ease-out ${coreVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-3">{level.ages}</p>
                <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">{level.name}</h3>
                <p className="text-ink-mid text-[13px] leading-[1.72]">{level.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Adult Class Menu */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Adult Tennis</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            Classes, socials, and matchplay.
          </h2>
          <p className="text-ink-mid text-[16px] leading-[1.82] mb-14 max-w-[720px]">
            Adult classes meet weekly, with drop-ins opening one week prior when available. Pricing varies by class length and session duration, typically $45-$75 + tax per class or $225-$325 + tax per 5-week session. Coaches evaluate new players and may suggest level adjustments.
          </p>

          <div ref={adultRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
            {adultClasses.map((classItem, i) => (
              <article
                key={classItem.name}
                className={`bg-parchment p-8 border-t-2 border-transparent hover:border-volt transition-all duration-700 ease-out ${adultVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-3">{classItem.level}</p>
                <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">{classItem.name}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{classItem.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 bg-parchment p-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-3">Friday Night UTR Matchplay</p>
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
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Court Booking</p>
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
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">USTA & SACT</p>
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
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-3">{item.label}</p>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width visual break */}
      <FullWidthImage
        src={TENNIS_ACTION}
        alt="Tennis match in action at WSC"
        caption="Train with former world-ranked professionals and D1 standouts."
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
          <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Get Started</p>
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
