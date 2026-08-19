/*
 * 4B Design - Athletic Performance Lab Page
 * Covers: purpose, offerings, coaches, registration paths
 */
import { useEffect } from "react";
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import ResponsiveImage from "@/components/ResponsiveImage";
import StructuredData, { getBreadcrumbSchema, getServiceSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const PERF_IMG = "/images/wsc/gym-main.webp";
const TRAINING_IMG = "/images/wsc/apl-training.webp";
const COACH_JORDY_IMG = "/images/wsc/jordy-champagne.png";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Events/List/6689/C7BR91B9SH6689";
const TIER1_APL_URL = "https://www.tier1nw.com/apl";
const CLASS_PASS_DISCLOSURE = "A $50/year Class Pass is required to register - get yours in CourtReserve.";
const COURT_RESERVE_CONVERSION_ID = "AW-18217215416/-Y8cCL7y9-McELjL0u5D";

declare global {
  interface Window {
    gtag_report_conversion?: (url?: string) => false;
  }
}

function reportCourtReserveConversion(url?: string) {
  let redirected = false;
  const redirect = () => {
    if (!url || redirected) return;
    redirected = true;
    window.location.href = url;
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: COURT_RESERVE_CONVERSION_ID,
      value: 1.0,
      currency: "USD",
      event_callback: redirect,
    });

    if (url) {
      window.setTimeout(redirect, 700);
    }
  } else {
    redirect();
  }

  return false as const;
}

function gtag_report_conversion(url?: string) {
  return reportCourtReserveConversion(url);
}

const offerings = [
  {
    title: "Group Strength & Conditioning",
    audience: "Youth and adults",
    desc: "Small-group sessions that build strength, speed, power, agility, endurance, and better movement habits through structured coaching.",
  },
  {
    title: "Speed School",
    audience: "Ages 12-18",
    desc: "Sprint mechanics, acceleration, change of direction, footwork, and agility work for athletes who need to move faster with control.",
  },
  {
    title: "Personal Training",
    audience: "Individual athletes",
    desc: "One-on-one performance training built around goals, assessment, accountability, and measurable progress.",
  },
  {
    title: "Team Training",
    audience: "Clubs and schools",
    desc: "Custom sessions for youth clubs, school teams, and groups that want sport-specific conditioning and long-term athlete development.",
  },
  {
    title: "Athletic Assessments",
    audience: "New and current athletes",
    desc: "Coach-led check-ins that help athletes understand movement quality, training needs, and the next step in their development plan.",
  },
  {
    title: "Season Support",
    audience: "In-season athletes",
    desc: "Training support that balances strength, durability, recovery, and workload so athletes can keep competing with confidence.",
  },
];

const classSections = [
  {
    title: "Youth Programs",
    rows: [
      { program: "Intro to Tennis Fitness - Red Ball", days: "Tue & Thu - 5:30-6:00pm", ages: "7+" },
      { program: "Athletic Development - Orange & Green Ball", days: "Tue & Thu - 6:00-6:30pm", ages: "Ages 9-12" },
      { program: "Athletic Development - Yellow Ball & Junior Academy", days: "Mon & Wed - 6:00-6:30pm", ages: "12 & Up" },
      { program: "Elite Athletic Development - After School Academy (ASA)", days: "Mon-Thu - 6:30-7:00pm", ages: "ASA Athletes" },
      { program: "Elite Athletic Development - Yellow Ball & Junior Academy (JA)", days: "Friday - 4:30-5:00pm", ages: "12 & Up" },
      { program: "APL Lower Body Strength & Power", days: "Mon & Wed - 7:00-8:00pm", ages: "Youth" },
      { program: "APL Push, Pull & Upper Body", days: "Tue & Thu - 7:00-8:00pm", ages: "Youth" },
      { program: "Speed School", days: "Saturday - 10:30-11:30am", ages: "Ages 9+" },
      { program: "Intro to Speed School", days: "Saturday - 11:30am-12:30pm", ages: "Ages 9+" },
    ],
  },
  {
    title: "Adult Programs",
    rows: [
      { program: "Tennis Performance & Longevity", days: "Mon & Wed - 8:00-9:00pm", ages: "Adults" },
      { program: "APL Adult Athletic Performance", days: "Tue & Thu - 8:00-9:00pm", ages: "Adults" },
      { program: "HIIT Adult Fitness Class", days: "Friday - 5:00-6:00pm", ages: "Adults" },
      { program: "HIIT Adult Fitness Class", days: "Saturday - 12:30-1:30pm", ages: "Adults" },
    ],
  },
];

const coachHighlights = [
  {
    name: "Jordy Champagne",
    role: "Director of Strength and Conditioning",
    desc: "Jordy leads the Athletic Performance Lab's training standards, athlete development approach, and strength and conditioning programming for youth and adult athletes.",
    image: COACH_JORDY_IMG,
    imageAlt: "Jordy Champagne, Director of Strength and Conditioning",
  },
  {
    name: "Jeff Madden",
    role: "Adult APL Coach",
    desc: "Jeff coaches adult APL classes tied to the current schedule, helping adults build strength, conditioning, durability, and confidence through structured training.",
  },
];

export default function Fitness() {
  useEffect(() => {
    window.gtag_report_conversion = gtag_report_conversion;

    return () => {
      delete window.gtag_report_conversion;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.apl} />
      <StructuredData schemas={[
        getBreadcrumbSchema([
          { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
          { name: "Athletic Performance Lab", url: "https://www.woodinvillesportsclub.com/fitness" },
        ]),
        getServiceSchema({
          name: "Athletic Performance Lab Training",
          description: SEO.apl.description,
          url: "https://www.woodinvillesportsclub.com/fitness",
          serviceType: "Strength and conditioning, speed training, team training, and athletic assessments",
          image: PERF_IMG,
          audience: "Youth athletes, adult athletes, teams, and active adults",
        }),
      ]} />
      <PageHero
        eyebrow="Athletic Performance Lab"
        headline="Where Champions Are Built."
        subtitle="The Athletic Performance Lab is WSC's dedicated coaching program for strength, speed, power, agility, durability, and confident movement for youth and adult athletes."
        image={PERF_IMG}
      />

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Who It's For</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-8">
              Athletes who want to move better, get stronger, and stay ready.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {[
              "Junior athletes building a strong foundation",
              "Competitive players chasing speed, power, and durability",
              "Adults who want coached strength and conditioning",
              "Teams that need structured athletic development",
            ].map((item) => (
              <article key={item} className="bg-parchment-mid p-8 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <h3 className="text-[18px] font-light leading-[1.35]">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-bg px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-6">What It's For</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light leading-[1.1] mb-6">
              A coached path to complete athletic development.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.8] mb-6 max-w-[520px]">
              APL training helps athletes become more well-rounded by improving movement mechanics, strength, power output, agility, conditioning, and body control.
            </p>
            <p className="text-parchment/80 text-[15px] leading-[1.8] mb-8 max-w-[520px]">
              Sessions are designed to support sport performance and long-term health, whether an athlete is preparing for a season, supplementing court or field training, or learning how to train safely.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={event => {
                  event.preventDefault();
                  gtag_report_conversion(COURT_RESERVE_URL);
                }}
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
              >
                Browse & Register
              </a>
            </div>
          </div>
          <ResponsiveImage
            src={TRAINING_IMG}
            alt="Athletes training in the Athletic Performance Lab at WSC"
            loading="lazy"
            className="w-full aspect-[4/3] object-cover brightness-[0.78] saturate-[0.85]"
          />
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-[720px] mb-14">
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Offerings</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-6">
              Training options for athletes, teams, and adults.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82]">
              APL programming gives athletes a clear place to register for coached strength and conditioning without mixing it into the general fitness center experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
            {offerings.map((item) => (
              <article key={item.title} className="bg-parchment-mid p-8 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <p className="text-volt text-[12px] tracking-[0.2em] uppercase mb-3">{item.audience}</p>
                <h3 className="text-[20px] font-light leading-[1.25] mb-4">{item.title}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Class Lineup</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-6">
              Small-group classes with focused outcomes.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Current class options include foundations, strength blocks, speed development, upper-body and lower-body emphasis, and adult athletic performance sessions.
            </p>
            <p className="text-ink text-[14px] leading-[1.65] mb-8 border-l-2 border-volt pl-5">
              {CLASS_PASS_DISCLOSURE}
            </p>
            <a
              href={COURT_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={event => {
                event.preventDefault();
                gtag_report_conversion(COURT_RESERVE_URL);
              }}
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Register in CourtReserve
            </a>
          </div>

          <div className="space-y-8">
            {classSections.map((section) => (
              <div key={section.title} className="bg-parchment">
                <div className="px-5 py-4 border-b border-ink/10">
                  <h3 className="text-[18px] font-light leading-[1.25]">{section.title}</h3>
                </div>
                <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={`${section.title} APL schedule`}>
                  <table className="w-full min-w-[720px] border-collapse text-left">
                    <thead>
                      <tr className="bg-parchment-dark/45">
                        <th scope="col" className="px-5 py-3 text-[11px] tracking-[0.18em] uppercase text-ink-mid font-normal">Program</th>
                        <th scope="col" className="px-5 py-3 text-[11px] tracking-[0.18em] uppercase text-ink-mid font-normal">Days & Time</th>
                        <th scope="col" className="px-5 py-3 text-[11px] tracking-[0.18em] uppercase text-ink-mid font-normal">Ages</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row) => (
                        <tr key={`${section.title}-${row.program}-${row.days}`} className="border-t border-ink/10">
                          <td className="px-5 py-4 text-[15px] leading-[1.4] text-ink">{row.program}</td>
                          <td className="px-5 py-4 text-[14px] leading-[1.45] text-ink-mid">{row.days}</td>
                          <td className="px-5 py-4 text-[14px] leading-[1.45] text-ink-mid">{row.ages}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-[720px] mb-14">
            <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-6">Coaches</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light leading-[1.1] mb-6">
              Led by coaches who know how athletes actually develop.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.8]">
              The lab is built around expert eyes, consistent standards, and programming that connects the weight room to real sport demands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {coachHighlights.map((coach) => (
              <article key={coach.name} className="bg-dark-bg">
                {coach.image ? (
                  <img
                    src={coach.image}
                    alt={coach.imageAlt}
                    width={612}
                    height={408}
                    loading="lazy"
                    className="w-full aspect-[3/2] object-cover grayscale-[0.1] brightness-[0.82] saturate-[0.9]"
                  />
                ) : (
                  <div className="flex aspect-[3/2] items-center justify-center bg-dark-mid border-b border-parchment/10">
                    <span className="text-volt-bright text-[clamp(42px,6vw,72px)] font-light tracking-[0.04em]">JM</span>
                  </div>
                )}
                <div className="p-8 lg:p-10">
                  <p className="text-volt-bright text-[12px] tracking-[0.2em] uppercase mb-3">{coach.role}</p>
                  <h3 className="text-parchment text-[22px] font-light leading-[1.25] mb-4">{coach.name}</h3>
                  <p className="text-parchment/78 text-[14px] leading-[1.72]">{coach.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Get Started</p>
          <h2 className="text-[clamp(26px,3vw,42px)] font-light leading-[1.15] mb-4">
            Register for APL training.
          </h2>
          <p className="text-ink-mid text-[15px] leading-[1.75] max-w-[560px] mx-auto mb-8">
            Browse current classes and registration options in CourtReserve, or visit Tier 1 for deeper program details.
          </p>
          <p className="text-ink text-[14px] leading-[1.65] max-w-[560px] mx-auto mb-8">
            {CLASS_PASS_DISCLOSURE}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={COURT_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={event => {
                event.preventDefault();
                gtag_report_conversion(COURT_RESERVE_URL);
              }}
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Register in CourtReserve
            </a>
            <a
              href={TIER1_APL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-ink border border-ink/20 px-8 py-3.5 hover:bg-ink/5 transition-colors duration-200"
            >
              Tier 1 APL Details
            </a>
            <Link
              href="/membership"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-ink border border-ink/20 px-8 py-3.5 hover:bg-ink/5 transition-colors duration-200"
            >
              Membership Options
            </Link>
            <Link
              href="/personal-training-interest-form"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-ink border border-ink/20 px-8 py-3.5 hover:bg-ink/5 transition-colors duration-200"
            >
              Request Personal Training
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
