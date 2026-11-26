import { trackAdvertisingConversion } from "@/lib/tracking";
/*
 * 4B Design - Athletic Performance Lab Page
 * Covers: purpose, offerings, coaches, registration paths
 */
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import ResponsiveImage from "@/components/ResponsiveImage";
import { FreeFitnessAssessmentForm } from "@/components/InquiryForms";
import StructuredData, { getBreadcrumbSchema, getServiceSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const PERF_IMG = "/images/wsc/apl-adult-group.webp";
const TRAINING_IMG = "/images/wsc/apl-strength-stability.webp";
const COACH_JORDY_IMG = "/images/wsc/jordy-champagne.png";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Events/List/6689/C7BR91B9SH6689";
const TIER1_APL_URL = "https://www.tier1nw.com/apl";
const CLASS_PASS_DISCLOSURE = "Your membership must include class registration. The Class Registration Pass costs $50 per year plus tax. Class fees are separate.";
const COURT_RESERVE_CONVERSION_ID = "AW-18217215416/-Y8cCL7y9-McELjL0u5D";

function reportCourtReserveConversion() {
  // Tracking must leave navigation, new tabs and modifier clicks to the browser.
  trackAdvertisingConversion(COURT_RESERVE_CONVERSION_ID, {
    value: 1.0,
    currency: "USD",
  });
}

const offerings = [
  {
    title: "Group Strength & Conditioning",
    audience: "Youth and adults",
    desc: "Small-group sessions that build strength, speed, power, agility, endurance, and better movement habits through structured coaching.",
  },
  {
    title: "Speed School",
    audience: "Youth athletes",
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
      { program: "Intro to Tennis Fitness for Red Ball", ages: "Ages 7+" },
      { program: "Athletic Development for Orange and Green Ball", ages: "Ages 9 to 12" },
      { program: "Athletic Development for Yellow Ball and Junior Academy", ages: "Ages 12+" },
      { program: "Elite Athletic Development for After School Academy", ages: "After School Academy" },
      { program: "Elite Athletic Development for Yellow Ball and Junior Academy", ages: "Ages 12+" },
      { program: "APL Lower Body Strength & Power", ages: "Youth" },
      { program: "APL Push, Pull & Upper Body", ages: "Youth" },
      { program: "Speed School", ages: "Competitive juniors" },
      { program: "Intro to Speed School", ages: "Junior athletes" },
    ],
  },
  {
    title: "Adult Programs",
    rows: [
      { program: "Tennis Performance & Longevity", ages: "Adults" },
      { program: "APL Adult Athletic Performance", ages: "Adults" },
      { program: "HIIT Adult Fitness Class", ages: "Adults" },
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
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.apl} image={PERF_IMG} />
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
        headline="Strength and conditioning"
        subtitle="Youth athletes, adults and teams train with coaches in the Athletic Performance Lab. Find a group class or request a free assessment to plan your training."
        actions={[
          { label: "Find a class", href: "#class-schedule" },
          { label: "Request Free Assessment", href: "#free-fitness-assessment" },
        ]}
        image={PERF_IMG}
        imagePosition="center 55%"
        avoidHeaderCrop
        overlayClassName="bg-gradient-to-r from-dark-bg/80 via-dark-bg/45 to-dark-bg/15"
      />

      <section id="class-schedule" className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">Group training</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-6">
              Find a youth or adult class
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Use this guide to find a program by age or training group. For the current dates, age requirements, prices and available places, check each class in CourtReserve.
            </p>
            <p className="text-ink text-[14px] leading-[1.65] mb-8 border-l-2 border-volt pl-5">
              {CLASS_PASS_DISCLOSURE}
            </p>
            <a
              href={COURT_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={reportCourtReserveConversion}
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Check current times in CourtReserve
            </a>
          </div>

          <div className="min-w-0 space-y-8">
            {classSections.map((section) => (
              <div key={section.title} className="bg-parchment">
                <div className="px-5 py-4 border-b border-ink/10">
                  <h3 className="text-[18px] font-light leading-[1.25]">{section.title}</h3>
                </div>
                <table className="w-full table-fixed border-collapse text-left">
                  <caption className="sr-only">{section.title} and eligible training groups</caption>
                  <thead>
                    <tr className="bg-parchment-dark/45 text-xs text-ink-mid sm:text-sm">
                      <th scope="col" className="w-2/3 px-3 py-3 sm:px-5">Program</th>
                      <th scope="col" className="px-2 py-3 sm:px-3">Who can join</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map(row => (
                      <tr key={row.program} className="border-t border-ink/10 align-top text-sm leading-relaxed text-ink-mid">
                        <th scope="row" className="px-3 py-4 font-normal text-ink sm:px-5">{row.program}</th>
                        <td className="px-2 py-4 sm:px-3">{row.ages}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="free-fitness-assessment" className="scroll-mt-[var(--site-header-height,130px)] bg-parchment px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="fitness-interest-form-heading">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:items-start">
          <div>
            <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">For new and returning athletes</p>
            <h2 id="fitness-interest-form-heading" className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-5">
              Free Fitness Assessment
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.75] max-w-[620px] mb-6">
              Meet with a certified strength and conditioning coach for 30 to 45 minutes to discuss your goals and decide where to start. Send your request here. The team will contact you within two business days to schedule a time.
            </p>
          </div>
          <div className="bg-parchment-mid border border-wsc-border p-6 lg:p-8">
            <p className="text-ink-light text-[12px] leading-[1.6] mb-5">* Indicates required question</p>
            <FreeFitnessAssessmentForm source="/fitness#free-fitness-assessment" />
          </div>
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">Who It's For</p>
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
                onClick={reportCourtReserveConversion}
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
              >
                Browse & Register
              </a>
            </div>
          </div>
          <ResponsiveImage
            src={TRAINING_IMG}
            alt="Athlete working on strength and stability with a resistance band in the WSC Athletic Performance Lab"
            loading="lazy"
            className="w-full aspect-[3/2] object-cover"
          />
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-[720px] mb-14">
            <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">Offerings</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-6">
              Training options for athletes, teams, and adults.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82]">
              Compare programs by who they serve and what you will work on. For individual coaching, you can request a personal trainer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
            {offerings.map((item) => (
              <article key={item.title} className="bg-parchment-mid p-8 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <p className="text-accent-on-light text-[12px] tracking-[0.2em] uppercase mb-3">{item.audience}</p>
                <h3 className="text-[20px] font-light leading-[1.25] mb-4">{item.title}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{item.desc}</p>
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
          <p className="text-accent-on-light text-[13px] tracking-[0.22em] uppercase mb-5">Get Started</p>
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
              onClick={reportCourtReserveConversion}
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
