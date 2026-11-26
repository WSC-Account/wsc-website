import { Link } from "wouter";
import { ExternalLink } from "lucide-react";
import UtilityPageHeader from "@/components/UtilityPageHeader";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEO } from "@/lib/seo-data";
import { calendarDay, formatClubDay, scheduleRecordedOn, sessions, sessionStatus, type Session } from "@/lib/session-calendar";
import { COURT_RESERVE_PORTAL_URL } from "@/lib/booking-links";
import { useSessionCalendar } from "@/hooks/useSessionCalendar";

function SessionList({ entries, today, expandFirst = false }: { entries: Session[]; today: string; expandFirst?: boolean }) {
  return (
    <Accordion type="single" collapsible defaultValue={expandFirst ? entries[0]?.start : undefined} className="border border-ink/15 bg-parchment-mid">
      {entries.map((session) => {
        const status = sessionStatus(session, today);
        const registrationDay = calendarDay(session.sessionDrop);
        const registrationLabel = !registrationDay
          ? "Estimated registration opening"
          : registrationDay <= today ? "Registration opened" : "Registration opens";
        return (
          <AccordionItem key={session.start} value={session.start} className="border-ink/15">
            <AccordionTrigger className="items-center px-5 py-5 hover:no-underline sm:px-6">
              <span className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-2 text-left">
                <span>
                  <span className="flex flex-wrap items-center gap-2.5">
                    <span className="text-lg font-medium leading-tight text-ink">
                      {session.name}{session.yearNote && ` (${session.yearNote})`}
                    </span>
                    <span className={`border px-2.5 py-0.5 text-xs font-medium ${status.tone === "active" ? "border-volt-bright bg-volt-bright text-dark-bg" : "border-ink/20 text-ink-mid"}`}>
                      {status.label}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-sm font-normal text-ink-mid">{session.start} to {session.end}</span>
                </span>
                <span className="text-sm font-normal text-ink-mid">{session.duration}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 sm:px-6">
              <dl className="grid gap-x-6 gap-y-4 border-t border-ink/15 pt-4 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-ink-mid">{registrationLabel}</dt>
                  <dd className="mt-1 text-base text-ink">{session.sessionDrop}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-mid">Automatic enrollment</dt>
                  <dd className="mt-1 text-base text-ink">{session.autoEnroll === "N/A" ? "Does not apply" : session.autoEnroll}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-mid">Class breaks</dt>
                  <dd className="mt-1 text-base text-ink">{session.blackout === "None" ? "None scheduled" : session.blackout}</dd>
                </div>
              </dl>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default function Sessions() {
  const season = useSessionCalendar();
  const currentAndUpcoming = sessions.filter(session => calendarDay(session.end)! >= season.today);
  const past = sessions.filter(session => calendarDay(session.end)! < season.today).reverse();

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.sessions} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Session Dates", url: "https://www.woodinvillesportsclub.com/sessions" },
      ])]} />

      <UtilityPageHeader
        eyebrow="Published club calendar"
        headline="Session dates and registration"
        subtitle="Find when classes start, when registration opens and which holidays affect your session. CourtReserve lists individual class times and available spots."
      />

      <section className="bg-parchment px-6 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto grid max-w-[1440px] items-start gap-12 lg:grid-cols-[0.8fr_1.3fr] lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-medium text-accent-on-light">
              Session status on <time dateTime={season.today}>{formatClubDay(season.today)}</time> (Pacific time)
            </p>
            <h2 className="mb-4 text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] tracking-[-0.02em]">
              {season.title}
            </h2>
            <p className="mb-6 max-w-prose text-base leading-relaxed text-ink-mid">{season.description}</p>
            <a
              href={COURT_RESERVE_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 bg-volt-bright px-5 py-3 text-sm font-semibold text-dark-bg no-underline transition-colors hover:bg-parchment-dark"
            >
              {season.open ? season.ctaLabel : "Check class availability"} in CourtReserve
              <ExternalLink size={15} aria-hidden="true" />
            </a>
            <p className="mt-5 text-sm leading-relaxed text-ink-mid">
              Unsure which class fits? <Link href="/contact" className="font-medium text-ink underline underline-offset-4">Ask the front desk</Link>.
            </p>
          </div>
          <div>
            {currentAndUpcoming.length > 0 ? (
              <>
                <h2 className="text-2xl font-medium tracking-tight text-ink">Current and upcoming sessions</h2>
                <p className="mb-4 mt-1 text-sm text-ink-mid">Club schedule recorded <time dateTime={scheduleRecordedOn}>{formatClubDay(scheduleRecordedOn)}</time>. Dates run through {currentAndUpcoming[currentAndUpcoming.length - 1].end}.</p>
                <SessionList key={currentAndUpcoming[0].start} entries={currentAndUpcoming} today={season.today} expandFirst />
              </>
            ) : past.length > 0 && (
              <p className="text-sm text-ink-mid">
                The latest published session ended {past[0].end}. Club schedule recorded <time dateTime={scheduleRecordedOn}>{formatClubDay(scheduleRecordedOn)}</time>.
              </p>
            )}
            {past.length > 0 && (
              <details className="mt-5 border-t border-ink/15">
                <summary className="cursor-pointer py-4 text-base font-medium text-ink">
                  Past sessions ({past.length})
                </summary>
                <SessionList entries={past} today={season.today} />
              </details>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
