import { Link } from "wouter";
import { CalendarDays, Clock, ExternalLink, RefreshCw, ShieldX } from "lucide-react";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/campus-dome.webp";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";

const sessions = [
  {
    name: "Fall 1",
    sessionDrop: "August 3, 2026",
    autoEnroll: "August 17, 2026",
    start: "August 31, 2026",
    end: "October 4, 2026",
    duration: "5 weeks",
    blackout: "Labor Day, September 7",
  },
  {
    name: "Fall 2",
    sessionDrop: "September 7, 2026",
    autoEnroll: "September 14, 2026",
    start: "October 5, 2026",
    end: "November 8, 2026",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Fall 3",
    sessionDrop: "October 12, 2026",
    autoEnroll: "October 19, 2026",
    start: "November 9, 2026",
    end: "December 20, 2026",
    duration: "6 weeks",
    blackout: "Thanksgiving, November 26",
  },
  {
    name: "Winter Break Camps",
    sessionDrop: "November 17, 2026",
    autoEnroll: "N/A",
    start: "December 21, 2026",
    end: "January 3, 2027",
    duration: "2 weeks",
    blackout: "Christmas / New Year",
  },
  {
    name: "Winter 1",
    yearNote: "2027",
    sessionDrop: "December 7, 2026",
    autoEnroll: "December 14, 2026",
    start: "January 4, 2027",
    end: "February 7, 2027",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Winter 2",
    yearNote: "2027",
    sessionDrop: "January 11, 2027",
    autoEnroll: "January 18, 2027",
    start: "February 8, 2027",
    end: "March 14, 2027",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Winter 3",
    yearNote: "2027",
    sessionDrop: "February 15, 2027",
    autoEnroll: "February 22, 2027",
    start: "March 15, 2027",
    end: "April 18, 2027",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Spring 1",
    yearNote: "2027",
    sessionDrop: "March 22, 2027",
    autoEnroll: "March 29, 2027",
    start: "April 19, 2027",
    end: "May 23, 2027",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Spring 2",
    yearNote: "2027",
    sessionDrop: "April 26, 2027",
    autoEnroll: "May 3, 2027",
    start: "May 24, 2027",
    end: "June 27, 2027",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Summer",
    yearNote: "2027",
    sessionDrop: "Mid-January 2027",
    autoEnroll: "N/A",
    start: "June 28, 2027",
    end: "August 29, 2027",
    duration: "9 weeks",
    blackout: "July 4",
  },
];

function dateAtNoon(value: string) {
  return new Date(`${value} 12:00:00`);
}

function getStatus(start: string, end: string, sessionDrop: string) {
  const now = new Date();
  const startsAt = dateAtNoon(start);
  const endsAt = dateAtNoon(end);
  const registrationStartsAt = dateAtNoon(sessionDrop);

  if (now > endsAt) return { label: "Past", tone: "muted" };
  if (now >= startsAt && now <= endsAt) return { label: "In session", tone: "active" };
  if (!Number.isNaN(registrationStartsAt.getTime()) && now >= registrationStartsAt) {
    return { label: "Registration open", tone: "active" };
  }
  return { label: "Upcoming", tone: "future" };
}

export default function Sessions() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.sessions} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Session Dates", url: "https://www.woodinvillesportsclub.com/sessions" },
      ])]} />

      <PageHero
        eyebrow="2026-27 Session Calendar"
        headline="Mark your calendar."
        subtitle="Current WSC programming session dates, session drop windows, auto-enroll timing, and blackout notes for tennis, golf, pickleball, fitness, camps, and summer programs."
        image={HERO_IMG}
      />

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.75fr_1.45fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Programming Calendar</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
              Registration is handled through CourtReserve.
            </h2>
            <p className="text-ink-mid text-[15px] leading-[1.8] mb-8">
              WSC programs run in seasonal sessions. Popular classes fill quickly, so families and members should set reminders for session drops and auto-enroll dates.
            </p>
            <a
              href={COURT_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Open CourtReserve
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="space-y-[3px]">
            {sessions.map((session) => {
              const status = getStatus(session.start, session.end, session.sessionDrop);
              const displayName = session.yearNote ? `${session.name} (${session.yearNote})` : session.name;
              return (
                <article key={displayName} className="bg-parchment-mid p-6 lg:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-[20px] font-light tracking-[-0.01em]">{displayName}</h3>
                      <span
                        className={`text-[10px] tracking-[0.16em] uppercase px-3 py-1 border ${
                          status.tone === "active"
                            ? "text-dark-bg bg-volt-bright border-volt-bright"
                            : status.tone === "future"
                              ? "text-volt border-volt/40"
                              : "text-ink-light border-ink/10"
                        }`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="text-ink-mid text-[14px] leading-[1.72]">
                      Session drop: {session.sessionDrop}. Auto-enroll: {session.autoEnroll}.
                    </p>
                    <p className="text-ink-light text-[13px] leading-[1.72] mt-2">Blackout: {session.blackout}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 md:min-w-[260px]">
                    <div className="flex items-start gap-3">
                      <CalendarDays size={16} className="text-volt mt-0.5 shrink-0" />
                      <div>
                        <p className="text-ink-light text-[10px] tracking-[0.14em] uppercase mb-1">Start</p>
                        <p className="text-ink text-[13px]">{session.start}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CalendarDays size={16} className="text-volt mt-0.5 shrink-0" />
                      <div>
                        <p className="text-ink-light text-[10px] tracking-[0.14em] uppercase mb-1">End</p>
                        <p className="text-ink text-[13px]">{session.end}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RefreshCw size={16} className="text-volt mt-0.5 shrink-0" />
                      <div>
                        <p className="text-ink-light text-[10px] tracking-[0.14em] uppercase mb-1">Auto-Enroll</p>
                        <p className="text-ink text-[13px]">{session.autoEnroll}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-volt mt-0.5 shrink-0" />
                      <div>
                        <p className="text-ink-light text-[10px] tracking-[0.14em] uppercase mb-1">Duration</p>
                        <p className="text-ink text-[13px]">{session.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ShieldX size={16} className="text-volt mt-0.5 shrink-0" />
                      <div>
                        <p className="text-ink-light text-[10px] tracking-[0.14em] uppercase mb-1">Blackout</p>
                        <p className="text-ink text-[13px]">{session.blackout}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Need Help Choosing?</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
              Find the right program before registration opens.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[560px]">
              Explore tennis, golf, pickleball, APL, and summer training pages for program details, then contact the front desk if you need placement guidance.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
          >
            Contact WSC
          </Link>
        </div>
      </section>
    </div>
  );
}
