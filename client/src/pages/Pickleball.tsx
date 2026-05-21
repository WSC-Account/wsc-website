/*
 * 4B Design — Pickleball Page
 * Updated with full content from live WSC site crawl (April 2026):
 * Private court rental, tournament dates, DUPR ladders, open play guidelines, court capacity
 * Scroll reveal animations for consistent UX
 */
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const PICKLE_IMG = "/images/wsc/pickleball-dome.webp";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";

export default function Pickleball() {
  const { ref: courtsRef, isVisible: courtsVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: scheduleRef, isVisible: scheduleVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: pricingRef, isVisible: pricingVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: rentalRef, isVisible: rentalVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: classesRef, isVisible: classesVisible } = useScrollReveal({ threshold: 0.08 });
  const { containerRef: tournamentsRef, visibleItems: tournamentsVisible } = useStaggerReveal(4, { staggerDelay: 120, threshold: 0.1 });
  const { ref: duprRef, isVisible: duprVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: guidelinesRef, isVisible: guidelinesVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.pickleball} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Pickleball", url: "https://www.woodinvillesportsclub.com/pickleball" },
      ])]} />
      <PageHero
        eyebrow="Pickleball"
        headline="Pickleball at Woodinville Sports Club."
        subtitle="Play the nation's fastest-growing sport in our iconic dome. Open play 7 days a week, private court rentals, classes for all levels, and four major tournaments per year."
        image={PICKLE_IMG}
      />

      {/* Courts & Open Play */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={courtsRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${courtsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Open Play</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              Eight indoor courts.<br />Seven days a week.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Join our daily open play sessions and socialize with other pickleball enthusiasts. Our sessions are designed for players of all skill levels. We've got 8 indoor courts in the dome and 4 outdoor courts in summer.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { val: "8", label: "Indoor Courts" },
                { val: "4", label: "Outdoor (Summer)" },
                { val: "7", label: "Days/Week" },
                { val: "PIG", label: "Tournament Partner" },
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
          <div>
            <img
              src={PICKLE_IMG}
              alt="Indoor pickleball dome courts at Woodinville Sports Club"
              width={1800}
              height={1149}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover saturate-[0.55] brightness-[0.85] mb-6"
            />
            <div className="bg-parchment-mid p-6 border-l-2 border-volt">
              <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-2">Court Capacity</p>
              <div className="space-y-2">
                <p className="text-ink-mid text-[13px] leading-[1.6]">
                  <span className="text-ink font-normal">Court 7 (4 PB courts):</span> Max 16 players, 22 registrants
                </p>
                <p className="text-ink-mid text-[13px] leading-[1.6]">
                  <span className="text-ink font-normal">Courts 7 & 8 (8 PB courts):</span> Max 32 players, 44 registrants
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={scheduleRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${scheduleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Open Play Schedule</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-14">
            Fall / Winter / Spring hours.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px] mb-8">
            <div className="bg-parchment p-8 lg:p-10">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-5">Weekday Schedule</h3>
              <p className="text-ink-light text-[12px] mb-4 italic">September 5 – June 14</p>
              <div className="space-y-3">
                {[
                  { day: "Mon, Wed, Fri", time: "8:00 PM – 11:00 PM", note: "4 courts on Tennis Court 7" },
                  { day: "Wednesdays", time: "Advanced players only", note: "DUPR 3.5+ required" },
                  { day: "Tue, Thu", time: "10:00 AM – 1:00 PM", note: "4 courts on Tennis Court 7" },
                  { day: "Tue, Thu", time: "8:00 PM – 11:00 PM", note: "4 courts on Tennis Court 7" },
                ].map((s, i) => (
                  <div key={i} className="py-3 border-b border-wsc-border">
                    <div className="flex justify-between mb-1">
                      <span className="text-ink text-[14px]">{s.day}</span>
                      <span className="text-ink-mid text-[14px]">{s.time}</span>
                    </div>
                    <span className="text-ink-light text-[12px]">{s.note}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-parchment p-8 lg:p-10">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-5">Weekend Schedule</h3>
              <p className="text-ink-light text-[12px] mb-4 italic">September 5 – June 14</p>
              <div className="space-y-3">
                {[
                  { day: "Saturday", time: "7:00 AM – 9:30 AM", note: "DUPR Ladders" },
                  { day: "Saturday", time: "2:30 PM – 5:00 PM", note: "8 courts" },
                  { day: "Saturday", time: "7:30 PM – 10:00 PM", note: "8 courts" },
                  { day: "Sunday", time: "5:00 PM – 7:30 PM", note: "8 courts on Tennis Courts 7 & 8" },
                ].map((s, i) => (
                  <div key={i} className="py-3 border-b border-wsc-border">
                    <div className="flex justify-between mb-1">
                      <span className="text-ink text-[14px]">{s.day}</span>
                      <span className="text-ink-mid text-[14px]">{s.time}</span>
                    </div>
                    <span className="text-ink-light text-[12px]">{s.note}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-wsc-border">
                <h4 className="text-[16px] font-light tracking-[-0.01em] mb-3">Summer Hours</h4>
                <p className="text-ink-light text-[12px] mb-2 italic">June 15 – September 4</p>
                <p className="text-ink-mid text-[14px] leading-[1.72]">
                  Mon/Wed/Fri 6:00 PM – 9:00 PM on outdoor courts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={pricingRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${pricingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Pricing</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-14">
            Open session pricing.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            <div className="bg-parchment-mid p-8 lg:p-10">
              <h3 className="text-[20px] font-light tracking-[-0.01em] mb-4">Member Pricing</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-wsc-border">
                  <span className="text-ink-mid text-[14px]">Mon–Fri (3 hr session)</span>
                  <span className="text-volt-bright text-[16px] font-light">$18 + tax</span>
                </div>
                <div className="flex justify-between py-3 border-b border-wsc-border">
                  <span className="text-ink-mid text-[14px]">Sat–Sun (2.5 hr session)</span>
                  <span className="text-volt-bright text-[16px] font-light">$15 + tax</span>
                </div>
              </div>
              <p className="text-ink-light text-[12px] mt-4 italic">Members can pre-register for sessions.</p>
            </div>
            <div className="bg-parchment-mid p-8 lg:p-10">
              <h3 className="text-[20px] font-light tracking-[-0.01em] mb-4">Non-Member Pricing</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-wsc-border">
                  <span className="text-ink-mid text-[14px]">Mon–Fri (3 hr session)</span>
                  <span className="text-volt-bright text-[16px] font-light">$23 + tax</span>
                </div>
                <div className="flex justify-between py-3 border-b border-wsc-border">
                  <span className="text-ink-mid text-[14px]">Sat–Sun (2.5 hr session)</span>
                  <span className="text-volt-bright text-[16px] font-light">$20 + tax</span>
                </div>
              </div>
              <p className="text-ink-light text-[12px] mt-4 italic">Non-members are walk-in only.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Private Court Rental */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={rentalRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${rentalVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Private Court Rental</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
              Reserve your<br />own court.
            </h2>
          </div>
          <div>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
              Want a court to yourself? Reserve a private pickleball court for your group. Available during select hours for members and their guests.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-wsc-border">
                <span className="text-ink text-[14px]">Member Court Rental</span>
                <span className="text-volt-bright text-[16px] font-light">$25 + tax / hr</span>
              </div>
              <div className="flex justify-between py-3 border-b border-wsc-border">
                <span className="text-ink text-[14px]">Guest Fee</span>
                <span className="text-ink-mid text-[14px]">$5 + tax / person</span>
              </div>
            </div>
            <div className="bg-parchment p-6 border-l-2 border-volt mb-6">
              <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-2">Available Hours</p>
              <div className="space-y-1.5">
                <p className="text-ink-mid text-[13px] leading-[1.6]">Mon – Thu: 8:00 PM – 11:00 PM</p>
                <p className="text-ink-mid text-[13px] leading-[1.6]">Friday: 7:00 PM – 11:00 PM</p>
                <p className="text-ink-mid text-[13px] leading-[1.6]">Saturday: 8:00 AM – 12:00 PM</p>
              </div>
            </div>
            <a
              href={COURT_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Reserve a Court
            </a>
          </div>
        </div>
      </section>

      {/* Classes */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={classesRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${classesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Instructional Classes</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            Learn and improve.
          </h2>
          <p className="text-ink-mid text-[16px] leading-[1.82] mb-14 max-w-[680px]">
            WSC offers two levels of instructional classes. A Class Registration Pass is required to sign up. No outside coaching is permitted.
          </p>

          <div className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-4 lg:gap-12 items-baseline py-8 border-b border-wsc-border">
              <p className="text-volt text-[10px] tracking-[0.2em] uppercase">Level 2.0</p>
              <div>
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-2">Intro to Pickleball</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72] mb-3">
                  Beginner-friendly class. Master the fundamentals in a supportive, engaging environment.
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Essential grips, stances, and swing techniques",
                    "Scoring systems, serving rules, and gameplay etiquette",
                    "Strategic court positioning",
                    "Real game experience through fun modified matches",
                  ].map((item, i) => (
                    <li key={i} className="text-ink-mid text-[13px] leading-[1.72] flex items-start gap-2">
                      <span className="text-volt text-[10px] mt-1">—</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
              >
                Sign Up
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-4 lg:gap-12 items-baseline py-8 border-b border-wsc-border">
              <p className="text-volt text-[10px] tracking-[0.2em] uppercase">Level 2.5</p>
              <div>
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-2">Advanced Beginner: Developing Skills & Strategy</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72] mb-3">
                  Bridges beginner and intermediate play.
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Improving serves, returns, and shot selection",
                    "Effective doubles strategies",
                    "Building consistency and accuracy",
                    "Applying new techniques in structured gameplay",
                  ].map((item, i) => (
                    <li key={i} className="text-ink-mid text-[13px] leading-[1.72] flex items-start gap-2">
                      <span className="text-volt text-[10px] mt-1">—</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tournaments */}
      <section className="bg-dark-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Tournaments</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
              Four major tournaments per year.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[560px] mx-auto">
              We partner with Pickleball is Great (PIG) to host tournaments. Round Robin format, skills 3.0–5.0 in age events (under 50 and 50+).
            </p>
          </div>

          <div ref={tournamentsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[3px]">
            {[
              { name: "Spring Fling", date: "May 29–31, 2026", season: "Upcoming" },
              { name: "Dominate the Dome", date: "September 2026", season: "Fall" },
              { name: "Holiday Classic", date: "December 2026", season: "Winter" },
              { name: "Shamrock Shootout", date: "Completed March 20–22, 2026", season: "Completed" },
            ].map((t, i) => (
              <div
                key={i}
                className={`bg-dark-bg p-8 border-t-2 border-transparent hover:border-volt-bright transition-all duration-700 ease-out ${tournamentsVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <p className="text-volt-bright text-[10px] tracking-[0.2em] uppercase mb-3">{t.season}</p>
                <h3 className="text-parchment text-[18px] font-light tracking-[-0.01em] mb-2">{t.name}</h3>
                <p className="text-parchment/70 text-[13px]">{t.date}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-dark-bg border-l-2 border-volt-bright">
            <p className="text-parchment/80 text-[14px] leading-[1.7]">
              <span className="text-parchment font-normal">Tournament Contact:</span> Paul Matthewson, Pickleball is Great (PIG)
            </p>
            <p className="text-parchment/70 text-[13px] mt-1">
              <a href="mailto:pickleballisgreat.paul@gmail.com" className="text-volt-bright no-underline hover:text-parchment transition-colors duration-200">
                pickleballisgreat.paul@gmail.com
              </a>
              {" · "}
              <a href="tel:+14258706540" className="text-parchment/70 no-underline hover:text-parchment transition-colors duration-200">
                (425) 870-6540
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* DUPR Ladders */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={duprRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${duprVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">DUPR Ladders</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              Competitive play.<br />Every Saturday.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
              DUPR Ladder sessions run every Saturday from 7:00 AM – 9:30 AM. Players are grouped by skill level for competitive, structured play. Results are tracked through DUPR for official ratings.
            </p>
            <p className="text-ink-mid text-[16px] leading-[1.82]">
              Wednesday evening sessions (8:00 PM – 11:00 PM) are gated for advanced players with a DUPR rating of 3.5 or higher.
            </p>
          </div>
          <div className="space-y-[3px]">
            <div className="bg-parchment p-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Saturday DUPR Ladders</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-wsc-border">
                  <span className="text-ink-mid text-[14px]">Time</span>
                  <span className="text-ink text-[14px]">7:00 AM – 9:30 AM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-wsc-border">
                  <span className="text-ink-mid text-[14px]">Format</span>
                  <span className="text-ink text-[14px]">Grouped by skill level</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-ink-mid text-[14px]">Ratings</span>
                  <span className="text-ink text-[14px]">Tracked via DUPR</span>
                </div>
              </div>
            </div>
            <div className="bg-parchment p-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Wednesday Advanced Play</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-wsc-border">
                  <span className="text-ink-mid text-[14px]">Time</span>
                  <span className="text-ink text-[14px]">8:00 PM – 11:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-ink-mid text-[14px]">Requirement</span>
                  <span className="text-ink text-[14px]">DUPR 3.5+ required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Play Guidelines */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={guidelinesRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${guidelinesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Open Play Guidelines</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            How open play works.
          </h2>
          <p className="text-ink-mid text-[16px] leading-[1.82] mb-14 max-w-[680px]">
            Our open play sessions use a paddle stack waitlist system to ensure fair rotation and maximum court time for all players.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
            {[
              {
                title: "Paddle Stack",
                desc: "Place your paddle in the stack when you arrive. When a court opens, the next paddles in line form the next group. Four paddles per court.",
              },
              {
                title: "Court Rotation",
                desc: "Games are played to 11, win by 2. Losing team rotates off and places paddles back in the stack. Winners stay on for one additional game.",
              },
              {
                title: "Challenge Court",
                desc: "One court is designated as the challenge court. Winners from other courts can challenge the current champions. If you win, you stay; if you lose, you rotate.",
              },
              {
                title: "Skill Grouping",
                desc: "When multiple courts are available, players are encouraged to self-organize by skill level. Staff may assist with grouping during busy sessions.",
              },
              {
                title: "Guest Policy",
                desc: "Non-members are welcome at walk-in rates. A member must be present for guests using the Court Booking Access Pass guest fee.",
              },
              {
                title: "Etiquette",
                desc: "Respect all players and staff. Call your own lines honestly. Keep noise levels reasonable. No outside coaching or instruction is permitted.",
              },
            ].map((g, i) => (
              <div key={i} className="bg-parchment-mid p-8 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">{g.title}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div
          ref={ctaRef}
          className={`max-w-[1440px] mx-auto text-center transition-all duration-700 ease-out ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Get Started</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Ready to play?
          </h2>
          <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[480px] mx-auto mb-8">
            Join our open play sessions, sign up for classes, or reserve a private court. No membership required for open play.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href="/membership"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
            >
              View Membership
            </Link>
            <a
              href={COURT_RESERVE_URL}
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
