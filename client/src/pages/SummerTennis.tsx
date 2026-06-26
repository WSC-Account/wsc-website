import { CalendarDays, ExternalLink, Trophy } from "lucide-react";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/tennis-courts.webp";

type TournamentLink = {
  label: string;
  href: string;
};

type Tournament = {
  week: string;
  dates: string;
  title: string;
  time?: string;
  links: TournamentLink[];
};

const tournaments: Tournament[] = [
  {
    week: "WSC Summer Week 1",
    dates: "Fri 7/3",
    title: "ROG USTA Friday",
    time: "4:00-7:00pm",
    links: [
      {
        label: "Red Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/497e4e09-01d0-4344-9b0f-fe296bb37823",
      },
      {
        label: "Orange / Green Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/0faeaa08-af71-4d4a-9c5d-2ca80b5e89cb",
      },
    ],
  },
  {
    week: "WSC Summer Week 2",
    dates: "Wed 7/8 - Sun 7/12",
    title: "Prize Money Open",
    links: [
      {
        label: "USTA Registration",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/players/2DD9FDBE-8508-4DFC-8CD4-99C1F4C115DD",
      },
    ],
  },
  {
    week: "WSC Summer Week 3",
    dates: "Fri 7/17 - Sun 7/19",
    title: "Green Ball UTR Circuit Qualifier",
    links: [
      {
        label: "UTR Registration",
        href: "https://app.utrsports.net/events/367009",
      },
    ],
  },
  {
    week: "WSC Summer Week 4",
    dates: "Fri 7/24",
    title: "ROG USTA Friday",
    time: "4:00-7:00pm",
    links: [
      {
        label: "Red Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/c9fab333-3c01-49d4-a2db-c3fc1ed9aa36",
      },
      {
        label: "Orange / Green Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/561d343e-d3fa-41c0-903b-58c2ae16d635",
      },
    ],
  },
  {
    week: "WSC Summer Week 5",
    dates: "Fri 7/31 - Sun 8/2",
    title: "UTR Junior CQ Tournament + ROG USTA",
    time: "ROG Sunday 2:00-5:00pm",
    links: [
      {
        label: "Red Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/1d0a359b-6b46-40ee-a741-30fbb3fe3b33",
      },
      {
        label: "Orange / Green Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/5d2c31ce-3e63-4f01-9db7-a6036f41861c",
      },
      {
        label: "UTR Registration",
        href: "https://app.utrsports.net/events/367012",
      },
    ],
  },
  {
    week: "WSC Summer Week 6",
    dates: "Fri 8/7",
    title: "ROG USTA Friday",
    time: "4:00-7:00pm",
    links: [
      {
        label: "Red Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/f386d90d-5aae-4855-8d7a-0362ae375026",
      },
      {
        label: "Orange / Green Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/b7cbc2f4-a6ef-4708-95f1-5e1081effa51",
      },
    ],
  },
  {
    week: "WSC Summer Week 7",
    dates: "Fri 8/14",
    title: "ROG USTA Friday",
    time: "4:00-7:00pm",
    links: [
      {
        label: "Red Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/dff25f68-d19a-42b6-a5fd-d4ce4d45401e",
      },
      {
        label: "Orange / Green Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/f6133e25-e6d9-460f-aba9-1ef4613504c3",
      },
    ],
  },
  {
    week: "WSC Summer Week 8",
    dates: "Fri 8/21 - Sun 8/23",
    title: "UTR Junior CQ Tournament + ROG USTA",
    time: "ROG Sunday 2:00-5:00pm",
    links: [
      {
        label: "Red Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/7474c941-01ba-4dd0-8318-fd3bb7efb09f",
      },
      {
        label: "Orange / Green Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/2bc17cea-a08e-40a4-b558-94d33d2f1431",
      },
      {
        label: "UTR Registration",
        href: "https://app.utrsports.net/events/367015?t=7",
      },
    ],
  },
  {
    week: "WSC Summer Week 9",
    dates: "Fri 8/28 - Sun 8/30",
    title: "Green Ball UTR CQ Tournament + ROG USTA",
    time: "ROG Sunday 2:00-5:00pm",
    links: [
      {
        label: "Red Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/d66cf78d-3f2c-40c8-b779-76e671f72ace",
      },
      {
        label: "Orange / Green Ball",
        href: "https://playtennis.usta.com/Competitions/woodinvillesportsclub/Tournaments/Overview/e3d7cc84-12ed-4962-8f8a-edc37877837c",
      },
      {
        label: "UTR Registration",
        href: "https://app.utrsports.net/events/367022",
      },
    ],
  },
];

function RegistrationLink({ link }: { link: TournamentLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[42px] items-center gap-2 border border-ink/15 px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-ink no-underline transition-colors duration-200 hover:border-volt hover:bg-volt hover:text-dark-bg"
    >
      {link.label}
      <ExternalLink size={13} aria-hidden="true" />
    </a>
  );
}

export default function SummerTennis() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.summerTennis} image={HERO_IMG} />
      <StructuredData
        schemas={[
          getBreadcrumbSchema([
            { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
            { name: "Tennis", url: "https://www.woodinvillesportsclub.com/tennis" },
            { name: "Summer Tennis", url: "https://www.woodinvillesportsclub.com/tennis/summer-tennis" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Summer Tennis"
        headline="Tournament Schedule."
        subtitle="A simple view of WSC summer tournament dates and registration links for Red, Orange, Green, USTA, UTR, and open events."
        image={HERO_IMG}
      />

      <section className="bg-parchment px-6 py-18 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="mb-4 text-[13px] uppercase tracking-[0.22em] text-volt">July - August 2026</p>
              <h2 className="text-[clamp(28px,3vw,42px)] font-light leading-[1.15] tracking-[-0.02em]">
                Register by event.
              </h2>
            </div>
            <p className="max-w-[620px] text-[15px] leading-[1.75] text-ink-mid lg:justify-self-end">
              Use the links below for official registration and event details. Tournament listings can change, so the
              linked USTA and UTR pages are the source for final draws, deadlines, and event-specific requirements.
            </p>
          </div>

          <div className="overflow-hidden border border-ink/10 bg-parchment-mid">
            {tournaments.map((event) => (
              <article
                key={`${event.week}-${event.dates}`}
                className="grid grid-cols-1 gap-5 border-b border-ink/10 p-6 last:border-b-0 md:grid-cols-[220px_1fr] lg:p-7"
              >
                <div>
                  <p className="mb-2 flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-volt">
                    <CalendarDays size={15} aria-hidden="true" />
                    {event.dates}
                  </p>
                  <p className="text-[12px] uppercase tracking-[0.1em] text-ink-light">{event.week}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-[20px] font-light tracking-[-0.01em] text-ink">{event.title}</h3>
                  {event.time && <p className="mb-4 text-[14px] leading-[1.6] text-ink-mid">{event.time}</p>}
                  <div className="flex flex-wrap gap-2">
                    {event.links.map((link) => (
                      <RegistrationLink key={`${event.week}-${link.label}`} link={link} />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-mid px-6 py-16 text-parchment lg:px-14">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 text-[12px] uppercase tracking-[0.2em] text-volt-bright">Questions</p>
            <h2 className="text-[26px] font-light tracking-[-0.01em]">Need help choosing the right event?</h2>
          </div>
          <a
            href="mailto:info@woodinvillesportsclub.com"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-volt-bright px-6 py-3 text-[12px] uppercase tracking-[0.1em] text-dark-bg no-underline transition-colors duration-200 hover:bg-parchment"
          >
            <Trophy size={15} aria-hidden="true" />
            Email WSC
          </a>
        </div>
      </section>
    </div>
  );
}
