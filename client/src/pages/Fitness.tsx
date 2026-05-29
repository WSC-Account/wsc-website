/*
 * 4B Design - Athletic Performance Lab Page
 * Covers: purpose, offerings, coaches, registration paths
 */
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const PERF_IMG = "/images/wsc/gym-main.webp";
const TRAINING_IMG = "/images/wsc/apl-training.webp";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";
const TIER1_APL_URL = "https://www.tier1nw.com/apl";

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

const classes = [
  "APL Intro to Fitness",
  "APL Build",
  "APL Ignite",
  "APL Push, Pull & Upper Body",
  "APL Lower Body Strength & Power",
  "APL Speed School",
  "Adult Athletic Performance",
];

const coachHighlights = [
  {
    name: "Jordy Champagne",
    role: "Director of Strength and Conditioning",
    desc: "Jordy leads the Athletic Performance Lab's training standards, athlete development approach, and strength and conditioning programming for youth and adult athletes.",
  },
  {
    name: "Zach Brooks",
    role: "Strength and Conditioning Coach",
    desc: "Zach coaches athletes through purposeful strength, speed, power, and movement work that supports tennis, golf, pickleball, field sports, and everyday performance.",
  },
];

export default function Fitness() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.apl} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Athletic Performance Lab", url: "https://www.woodinvillesportsclub.com/fitness" },
      ])]} />
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
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
              >
                Browse & Register
              </a>
              <a
                href={TIER1_APL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
              >
                Explore Tier 1 APL
              </a>
            </div>
          </div>
          <img
            src={TRAINING_IMG}
            alt="Athletes training in the Athletic Performance Lab at WSC"
            width={1800}
            height={1350}
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
            <a
              href={COURT_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Register in CourtReserve
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {classes.map((name) => (
              <article key={name} className="bg-parchment p-7">
                <h3 className="text-[18px] font-light leading-[1.35]">{name}</h3>
              </article>
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
              <article key={coach.name} className="bg-dark-bg p-8 lg:p-10">
                <p className="text-volt-bright text-[12px] tracking-[0.2em] uppercase mb-3">{coach.role}</p>
                <h3 className="text-parchment text-[22px] font-light leading-[1.25] mb-4">{coach.name}</h3>
                <p className="text-parchment/78 text-[14px] leading-[1.72]">{coach.desc}</p>
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
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={COURT_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
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
          </div>
        </div>
      </section>
    </div>
  );
}
