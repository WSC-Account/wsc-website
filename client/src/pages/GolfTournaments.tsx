import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import SEOHead from "@/components/SEOHead";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/junior-golf-academy-group.webp";
const RANGE_IMG = "/images/wsc/golf-range-field.webp";
const SIM_IMG = "/images/wsc/swing-lab-junior-practice.webp";
const GOLF_EMAIL = "Tier1golf@woodinvillesportsclub.com";

type TournamentStatus = "Completed" | "Upcoming" | "TBD";

type CompetitiveTournament = {
  date: string;
  sortDate: string;
  title: string;
  organizer: string;
  location: string;
  level: string;
  status: TournamentStatus;
  source: string;
};

type RecreationalTournament = {
  title: string;
  timing: string;
  format: string;
  audience: string;
  note: string;
};

const competitiveTournaments: CompetitiveTournament[] = [
  {
    date: "March 20-22, 2026",
    sortDate: "2026-03-20",
    title: "WJGA State Match Play",
    organizer: "WJGA",
    location: "Eagles Pride GC",
    level: "14-18 open event",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "March 28, 2026",
    sortDate: "2026-03-28",
    title: "WJGA Jr. Tour #1",
    organizer: "WJGA",
    location: "Meadow Park GC / Williams Nine",
    level: "8-11 and 12-13 divisions",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "April 18-19, 2026",
    sortDate: "2026-04-18",
    title: "WJGA Western Open",
    organizer: "WJGA",
    location: "Capitol City GC",
    level: "14-18 open event",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "April 25, 2026",
    sortDate: "2026-04-25",
    title: "WJGA Jr. Tour #2",
    organizer: "WJGA",
    location: "Alderbrook GC",
    level: "8-11 and 12-13 divisions",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "April 25-26, 2026",
    sortDate: "2026-04-25",
    title: "WJGA Eastern Open + Junior World Qualifier",
    organizer: "WJGA",
    location: "Veterans Memorial GC",
    level: "14-18 open event / Junior World qualifier",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "May 16, 2026",
    sortDate: "2026-05-16",
    title: "WJGA Jr. Tour #3",
    organizer: "WJGA",
    location: "The Links GC",
    level: "8-11 and 12-13 divisions",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "May 16-17, 2026",
    sortDate: "2026-05-16",
    title: "WJGA Players Open",
    organizer: "WJGA",
    location: "The Links GC",
    level: "14-18 open event",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "May 26, 2026",
    sortDate: "2026-05-26",
    title: "U.S. Girls' Junior Qualifying",
    organizer: "WA Golf / USGA",
    location: "McCormick Woods Golf Club",
    level: "USGA junior championship qualifier",
    status: "Completed",
    source: "https://wagolf.org/compete/usga-qualifying",
  },
  {
    date: "May 26, 2026",
    sortDate: "2026-05-26",
    title: "U.S. Junior Amateur Qualifying",
    organizer: "WA Golf / USGA",
    location: "McCormick Woods Golf Club",
    level: "USGA junior championship qualifier",
    status: "Completed",
    source: "https://wagolf.org/compete/usga-qualifying",
  },
  {
    date: "June 6, 2026",
    sortDate: "2026-06-06",
    title: "WJGA Jr. Tour #4",
    organizer: "WJGA",
    location: "Sun Country GC",
    level: "8-11 and 12-13 divisions",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "June 6-7, 2026",
    sortDate: "2026-06-06",
    title: "Washington State Junior Amateur",
    organizer: "WJGA",
    location: "Yakima Elks G&CC",
    level: "Junior championship",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "June 19, 2026",
    sortDate: "2026-06-19",
    title: "WJGA Jr. Tour #5",
    organizer: "WJGA",
    location: "Tahoma Valley GC",
    level: "8-11 and 12-13 divisions",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "June 22, 2026",
    sortDate: "2026-06-22",
    title: "WJGA District 1 Sub-District 1",
    organizer: "WJGA",
    location: "Walter Hall GC",
    level: "Everett to north border district pathway",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "June 22, 2026",
    sortDate: "2026-06-22",
    title: "WJGA District 2 Sub-District 1",
    organizer: "WJGA",
    location: "Seattle GC",
    level: "Seattle-area district pathway",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "June 25-26, 2026",
    sortDate: "2026-06-25",
    title: "U.S. Kids Golf Northwest State Invitational",
    organizer: "U.S. Kids Golf",
    location: "Wine Valley GC, Walla Walla",
    level: "Regional junior event",
    status: "Completed",
    source: "https://tournaments.uskidsgolf.com/tournaments/state/rental-cars",
  },
  {
    date: "June 25, 2026",
    sortDate: "2026-06-25",
    title: "WJGA District 6 Sub-District 1",
    organizer: "WJGA",
    location: "Riverbend GC",
    level: "South King / East Pierce district pathway",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "June 29, 2026",
    sortDate: "2026-06-29",
    title: "WJGA District 1 Sub-District 2",
    organizer: "WJGA",
    location: "Camaloch GC",
    level: "Everett to north border district pathway",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "June 29, 2026",
    sortDate: "2026-06-29",
    title: "WJGA District 2 Sub-District 2",
    organizer: "WJGA",
    location: "West Seattle GC",
    level: "Seattle-area district pathway",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "June 29, 2026",
    sortDate: "2026-06-29",
    title: "WJGA District 6 Sub-District 2",
    organizer: "WJGA",
    location: "North Shore GC",
    level: "South King / East Pierce district pathway",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "June 30, 2026",
    sortDate: "2026-06-30",
    title: "WJGA Joel Dahmen Invitational",
    organizer: "WJGA",
    location: "Oakbrook GC",
    level: "Invitational",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "July 3-4, 2026",
    sortDate: "2026-07-03",
    title: "U.S. Kids Golf Washington State Invitational",
    organizer: "U.S. Kids Golf",
    location: "Gamble Sands, Brewster",
    level: "State junior event",
    status: "Completed",
    source: "https://tournaments.uskidsgolf.com/tournaments/state/rental-cars",
  },
  {
    date: "July 6, 2026",
    sortDate: "2026-07-06",
    title: "WJGA District 2 Sub-District 3",
    organizer: "WJGA",
    location: "Snoqualmie Falls GC",
    level: "Seattle-area district pathway",
    status: "Completed",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "July 9, 2026",
    sortDate: "2026-07-09",
    title: "WJGA District 1 Sub-District 3",
    organizer: "WJGA",
    location: "Bellingham G&CC",
    level: "Everett to north border district pathway",
    status: "Upcoming",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "July 9, 2026",
    sortDate: "2026-07-09",
    title: "WJGA District 6 Sub-District 3",
    organizer: "WJGA",
    location: "Allenmore GC",
    level: "South King / East Pierce district pathway",
    status: "Upcoming",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "July 13-14, 2026",
    sortDate: "2026-07-13",
    title: "WJGA District 1 Championship",
    organizer: "WJGA",
    location: "Avalon Golf Links",
    level: "District championship",
    status: "Upcoming",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "July 13-14, 2026",
    sortDate: "2026-07-13",
    title: "WJGA District 2 Championship",
    organizer: "WJGA",
    location: "Echo Falls GC",
    level: "Seattle-area district championship",
    status: "Upcoming",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "July 13-14, 2026",
    sortDate: "2026-07-13",
    title: "WJGA District 6 Championship",
    organizer: "WJGA",
    location: "High Cedars GC",
    level: "South King / East Pierce district championship",
    status: "Upcoming",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "July 21-22, 2026",
    sortDate: "2026-07-21",
    title: "WJGA Cup",
    organizer: "WJGA",
    location: "Lakeview G&CC",
    level: "All ages",
    status: "Upcoming",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "August 4-6, 2026",
    sortDate: "2026-08-04",
    title: "WJGA State Championship",
    organizer: "WJGA",
    location: "Manito G&CC / Latah Creek GC / Esmeralda GC",
    level: "State championship",
    status: "Upcoming",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
  {
    date: "August 10-14, 2026",
    sortDate: "2026-08-10",
    title: "PNGA Junior Boys' Amateur",
    organizer: "PNGA",
    location: "Vandal Golf Course",
    level: "Regional junior championship",
    status: "Upcoming",
    source: "https://thepnga.org/championships/",
  },
  {
    date: "August 10-14, 2026",
    sortDate: "2026-08-10",
    title: "PNGA Junior Girls' Amateur",
    organizer: "PNGA",
    location: "Vandal Golf Course",
    level: "Regional junior championship",
    status: "Upcoming",
    source: "https://thepnga.org/championships/",
  },
  {
    date: "November 11, 2026",
    sortDate: "2026-11-11",
    title: "WJGA Turkey Shoot",
    organizer: "WJGA",
    location: "TBD",
    level: "Season-end junior event",
    status: "TBD",
    source: "https://www.wjga.net/tournaments/complete-wjga-schedule/",
  },
];

const recreationalTournaments: RecreationalTournament[] = [
  {
    title: "Friday Night Toptracer Challenge",
    timing: "Club event idea",
    format: "Simulator or range leaderboard",
    audience: "Members, families, and casual golfers",
    note: "Low-pressure scoring night built around Toptracer games, closest-to-pin, and short leaderboard windows.",
  },
  {
    title: "Parent-Junior Scramble",
    timing: "Club event idea",
    format: "Two-player scramble",
    audience: "Academy families and WSC members",
    note: "A community bridge between junior golf development and WSC family programming.",
  },
  {
    title: "Short-Game Shootout",
    timing: "Club event idea",
    format: "Putting, chipping, and wedge stations",
    audience: "Adults, juniors, and mixed groups",
    note: "Uses WSC's practice grounds without needing full-course access or a full tournament day.",
  },
  {
    title: "Member-Guest Range Classic",
    timing: "Club event idea",
    format: "Team points across range, short game, and simulator challenges",
    audience: "Members introducing guests to WSC golf",
    note: "A conversion-friendly event that shows the full training grounds experience.",
  },
];

const sortedCompetitiveTournaments = [...competitiveTournaments].sort((a, b) =>
  a.sortDate.localeCompare(b.sortDate),
);

const upcomingTournaments = sortedCompetitiveTournaments.filter((event) => event.status !== "Completed");
const featuredUpcomingTournaments = upcomingTournaments.slice(0, 6);

const pathwayCards = [
  {
    title: "New to tournament golf",
    kicker: "Start here",
    copy: "Use WSC practice, Swing Lab lessons, and low-pressure club events before jumping into travel-heavy junior schedules.",
  },
  {
    title: "Ready for junior events",
    kicker: "Next step",
    copy: "Review WJGA, U.S. Kids Golf, WA Golf, and PNGA options with a coach so the event fits age, scores, and goals.",
  },
  {
    title: "Need placement help",
    kicker: "Ask the team",
    copy: "Send the golf team your player's age, recent scores, goals, and travel comfort before registering.",
  },
];

const preparationSteps = [
  "Pick the right level",
  "Confirm registration dates",
  "Plan range and short-game reps",
  "Use Swing Lab feedback",
  "Review with a coach",
];

function StatusBadge({ status }: { status: TournamentStatus }) {
  const classes =
    status === "Upcoming"
      ? "bg-volt-bright text-dark-bg"
      : status === "TBD"
        ? "bg-parchment border border-ink/20 text-ink-mid"
        : "bg-parchment-mid text-ink-light";

  return (
    <span className={`inline-flex items-center px-3 py-1 text-[10px] tracking-[0.14em] uppercase ${classes}`}>
      {status}
    </span>
  );
}

export default function GolfTournaments() {
  const upcomingCount = sortedCompetitiveTournaments.filter((event) => event.status === "Upcoming").length;
  const sourceCount = new Set(sortedCompetitiveTournaments.map((event) => event.organizer)).size;

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.golfTournaments} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Golf", url: "https://www.woodinvillesportsclub.com/golf" },
        { name: "Golf Tournaments", url: "https://www.woodinvillesportsclub.com/golf/tournaments" },
      ])]} />
      <section className="relative bg-dark-bg overflow-hidden pt-[var(--site-header-height,130px)]">
        <ResponsiveImage
          src={HERO_IMG}
          alt="Junior golf academy group with coach at Woodinville Sports Club"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.72] saturate-[0.82]"
          style={{ objectPosition: "center 42%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,7,5,0.86)] via-[rgba(9,7,5,0.28)] to-[rgba(9,7,5,0.1)]" />
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-14 py-16 lg:py-20 min-h-[calc(66vh-var(--site-header-height,130px))] flex flex-col justify-end">
          <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Golf Tournament Pathway</p>
          <h1 className="max-w-[760px] text-parchment text-[clamp(36px,5.2vw,68px)] font-light leading-[1.04] tracking-[-0.025em] mb-5">
            Find the right golf tournament path.
          </h1>
          <p className="max-w-[620px] text-parchment/82 text-[16px] leading-[1.72] mb-8">
            A simple starting point for WSC and Tier 1 Golf families: what to play, when to look, and who to ask before registering.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#upcoming-tournaments"
              className="inline-flex items-center justify-center text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-6 py-3.5 hover:bg-parchment transition-colors duration-200"
            >
              See upcoming events
            </a>
            <a
              href={`mailto:${GOLF_EMAIL}`}
              className="inline-flex items-center justify-center text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-parchment/60 px-6 py-3.5 hover:border-volt-bright hover:text-volt-bright transition-colors duration-200"
            >
              Ask the golf team
            </a>
          </div>
        </div>
      </section>

      <section className="bg-dark-bg px-6 lg:px-14 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-volt-bright text-[12px] tracking-[0.2em] uppercase mb-4">Start here</p>
              <h2 className="text-parchment text-[clamp(30px,3.4vw,48px)] font-light leading-[1.06] mb-5">
                A quick guide before families open a schedule.
              </h2>
              <p className="text-parchment/76 text-[15px] leading-[1.78] max-w-[640px]">
                Tournament calendars can be hard to read cold. Start with the right pathway, check the live source, then ask the golf team when placement or timing is unclear.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[3px]">
              {pathwayCards.map((card) => (
                <article key={card.title} className="bg-dark-mid p-6 border-t-2 border-volt-bright/70">
                  <p className="text-volt-bright text-[11px] tracking-[0.16em] uppercase mb-4">{card.kicker}</p>
                  <h3 className="text-parchment text-[22px] font-light leading-[1.12] mb-4">{card.title}</h3>
                  <p className="text-parchment/68 text-[13px] leading-[1.68]">{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="upcoming-tournaments" className="bg-parchment px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[var(--site-header-height,130px)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-12 lg:gap-20 mb-12">
            <div>
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Upcoming tournaments</p>
              <h2 className="text-[clamp(28px,3.2vw,46px)] font-light leading-[1.08] mb-6">
                The next events families are likely to ask about.
              </h2>
              <p className="text-ink-mid text-[15px] leading-[1.82]">
                Start with upcoming choices, then use the full source list below when you want to plan the whole year.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-[1px] bg-ink/10 self-start">
              {[
                { val: upcomingCount, label: "Upcoming" },
                { val: sortedCompetitiveTournaments.length, label: "Listed Events" },
                { val: sourceCount, label: "Source Groups" },
              ].map((metric) => (
                <div key={metric.label} className="bg-parchment-mid p-5">
                  <p className="text-volt text-[30px] font-light leading-none mb-2">{metric.val}</p>
                  <p className="text-ink-light text-[10px] tracking-[0.14em] uppercase leading-[1.4]">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[3px] mb-12">
            {featuredUpcomingTournaments.map((event) => (
              <article key={`${event.title}-${event.sortDate}-${event.location}`} className="bg-parchment-mid p-7 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-volt text-[12px] tracking-[0.18em] uppercase mb-1">{event.date}</p>
                    <p className="text-ink-light text-[12px]">{event.organizer}</p>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
                <h3 className="text-[24px] font-light leading-[1.14] mb-4">{event.title}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.6] mb-2">{event.location}</p>
                <p className="text-ink-mid text-[14px] leading-[1.65] mb-6">{event.level}</p>
                <a
                  href={event.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] tracking-[0.12em] uppercase no-underline text-volt hover:text-ink"
                >
                  Check live source
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.8} />
                </a>
              </article>
            ))}
          </div>

          <div className="bg-parchment-mid border-l-2 border-volt-bright p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-8">
              <div>
                <p className="text-[12px] tracking-[0.18em] uppercase text-volt mb-3">Before registering</p>
                <h3 className="text-[28px] font-light leading-[1.12]">Use the schedule as a conversation starter.</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {preparationSteps.map((step, index) => (
                  <p key={step} className="text-ink-mid text-[14px] leading-[1.6] border-t border-ink/10 pt-3">
                    <span className="text-volt mr-2">{index + 1}.</span>
                    {step}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <details id="full-schedule" className="mt-10 bg-parchment-mid p-6 lg:p-8 group scroll-mt-[var(--site-header-height,130px)]">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-volt text-[12px] tracking-[0.18em] uppercase mb-2">Full source list</p>
                  <h3 className="text-[28px] font-light leading-[1.12]">View the full 2026 tournament list.</h3>
                </div>
                <span className="inline-flex items-center justify-center text-[11px] tracking-[0.14em] uppercase text-volt border border-volt/40 px-4 py-2 self-start sm:self-center">
                  Open schedule
                </span>
              </div>
            </summary>
            <div className="mt-8 grid grid-cols-1 gap-[2px]">
              {sortedCompetitiveTournaments.map((event) => (
                <article key={`${event.title}-${event.sortDate}-${event.location}`} className="grid grid-cols-1 lg:grid-cols-[150px_1fr_220px_120px] gap-4 bg-parchment p-5 items-start">
                  <div>
                    <p className="text-volt text-[12px] tracking-[0.16em] uppercase mb-1">{event.date}</p>
                    <p className="text-ink-light text-[12px]">{event.organizer}</p>
                  </div>
                  <div>
                    <h4 className="text-[20px] font-light leading-[1.18] mb-2">{event.title}</h4>
                    <p className="text-ink-mid text-[13px] leading-[1.6]">{event.level}</p>
                  </div>
                  <p className="text-ink-mid text-[13px] leading-[1.6]">{event.location}</p>
                  <div className="flex flex-col gap-3 lg:items-end">
                    <StatusBadge status={event.status} />
                    <a
                      href={event.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] tracking-[0.12em] uppercase no-underline text-volt hover:text-ink"
                    >
                      Source
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.8} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </details>
        </div>
      </section>

      <section className="bg-dark-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Tournament Readiness</p>
            <h2 className="text-parchment text-[clamp(28px,3.2vw,46px)] font-light leading-[1.08] mb-6">
              Use WSC as the training base between tournament weeks.
            </h2>
            <p className="text-parchment/78 text-[15px] leading-[1.82] mb-8">
              Competitive players need more than a list of dates. Use the tournament calendar to guide preparation: range work, short game reps, simulator feedback, course strategy, and APL support for speed, strength, and durability.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Range reps", "Short game", "Swing Lab data", "APL support", "Coach planning"].map((item) => (
                <span key={item} className="text-parchment/75 text-[11px] tracking-[0.14em] uppercase border border-parchment/20 px-4 py-2">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveImage
            src={SIM_IMG}
            alt="Junior golfer practicing in a Swing Lab simulator bay at WSC"
            loading="lazy"
            className="w-full aspect-[4/3] object-cover brightness-[0.82] saturate-[0.72]"
            style={{ objectPosition: "center 42%" }}
          />
        </div>
      </section>

      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-12 lg:gap-20 mb-14">
            <div>
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Recreational Tournaments</p>
              <h2 className="text-[clamp(28px,3.2vw,46px)] font-light leading-[1.08] mb-6">
                More ways to compete without the pressure.
              </h2>
              <p className="text-ink-mid text-[15px] leading-[1.82]">
                Not every competitive moment needs to be travel-heavy. These approachable event formats use the range, short-game grounds, and Swing Lab to create local ways for members, families, and newer golfers to compete.
              </p>
            </div>
            <ResponsiveImage
              src={RANGE_IMG}
              alt="WSC golf range and practice grounds"
              loading="lazy"
              className="w-full aspect-[16/9] object-cover brightness-[0.86] saturate-[0.62]"
              style={{ objectPosition: "center 66%" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {recreationalTournaments.map((event) => (
              <article key={event.title} className="bg-parchment p-8 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <p className="text-volt text-[12px] tracking-[0.18em] uppercase mb-4">{event.timing}</p>
                <h3 className="text-[24px] font-light leading-[1.14] mb-4">{event.title}</h3>
                <div className="space-y-2 mb-5">
                  <p className="text-ink-mid text-[14px] leading-[1.6]"><span className="text-ink">Format:</span> {event.format}</p>
                  <p className="text-ink-mid text-[14px] leading-[1.6]"><span className="text-ink">Best for:</span> {event.audience}</p>
                </div>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{event.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-bg px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:items-center">
          <div>
            <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Need placement help?</p>
            <h2 className="text-parchment text-[clamp(28px,3vw,42px)] font-light leading-[1.1] mb-4">
              Ask the golf team before you register.
            </h2>
            <p className="text-parchment/76 text-[15px] leading-[1.75] max-w-[680px]">
              Tournament fit depends on age, scoring average, travel, goals, and whether the event is meant for development, points, qualification, or community experience.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`mailto:${GOLF_EMAIL}`}
              className="inline-flex items-center justify-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
            >
              Email Tier 1 Golf
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
            </a>
            <Link
              href="/golf"
              className="inline-flex items-center justify-center text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
            >
              Back to Golf
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
