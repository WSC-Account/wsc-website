import { Link } from "wouter";
import { CalendarDays, Clock, ExternalLink, RefreshCw, ShieldX } from "lucide-react";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEO } from "@/lib/seo-data";
import { sessions, sessionStatus } from "@/lib/session-calendar";
import { useSessionCalendar } from "@/hooks/useSessionCalendar";

const HERO_IMG = "/images/wsc/campus-dome.webp";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";

function getSessionValue(name: string, start: string) {
  return `${name}-${start}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function Sessions() {
  const season = useSessionCalendar();
  const sessionRows = sessions.map((session) => {
    const status = sessionStatus(session, season.today);
    const displayName = session.yearNote ? `${session.name} (${session.yearNote})` : session.name;
    return {
      ...session,
      displayName,
      status,
      value: getSessionValue(session.name, session.start),
    };
  });
  const defaultOpenSession =
    sessionRows.find((session) => session.status.tone === "active") ??
    sessionRows.find((session) => session.status.tone === "future") ??
    sessionRows[sessionRows.length - 1];

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.sessions} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Session Dates", url: "https://www.woodinvillesportsclub.com/sessions" },
      ])]} />

      <PageHero
        eyebrow="WSC Session Calendar"
        headline="Mark your calendar."
        subtitle="Current WSC programming session dates, session drop windows, auto-enroll timing, and blackout notes for tennis, golf, pickleball, fitness, camps, and summer programs."
        image={HERO_IMG}
      />

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.75fr_1.45fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Programming Calendar</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
              {season.title}
            </h2>
            <p className="text-ink-mid text-[15px] leading-[1.8] mb-8">
              {season.description}
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

          <Accordion
            type="single"
            collapsible
            defaultValue={defaultOpenSession?.value}
            className="border border-ink/10 bg-parchment-mid"
          >
            {sessionRows.map((session) => (
              <AccordionItem key={session.value} value={session.value} className="border-ink/10">
                <AccordionTrigger className="px-5 py-5 hover:no-underline sm:px-6 lg:px-8">
                  <span className="grid flex-1 grid-cols-1 gap-4 text-left md:grid-cols-[minmax(170px,1fr)_minmax(190px,0.9fr)_minmax(120px,0.55fr)] md:items-center">
                    <span>
                      <span className="mb-2 flex flex-wrap items-center gap-3">
                        <span className="text-[18px] font-light leading-[1.2] tracking-[-0.01em] text-ink">
                          {session.displayName}
                        </span>
                        <span
                          className={`text-[10px] tracking-[0.16em] uppercase px-3 py-1 border ${
                            session.status.tone === "active"
                              ? "text-dark-bg bg-volt-bright border-volt-bright"
                              : session.status.tone === "future"
                                ? "text-volt border-volt/40"
                                : "text-ink-light border-ink/10"
                          }`}
                        >
                          {session.status.label}
                        </span>
                      </span>
                      <span className="block text-[12px] leading-[1.55] text-ink-light">
                        {session.duration}
                      </span>
                    </span>

                    <span className="text-[13px] leading-[1.55] text-ink-mid">
                      {session.start} - {session.end}
                    </span>

                    <span className="text-[12px] leading-[1.55] text-ink-light md:text-right">
                      Drop: <span className="text-ink-mid">{session.sessionDrop}</span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-6 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 gap-4 border-t border-ink/10 pt-5 sm:grid-cols-2 lg:grid-cols-5">
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
