import PageHero from "@/components/PageHero";
import { GolfLessonInquiryForm } from "@/components/InquiryForms";
import SEOHead from "@/components/SEOHead";
import { ArrowUpRight } from "lucide-react";

const HERO_IMG = "/images/wsc/swing-lab-simulators.webp";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";
const TIER1_GOLF_URL = "https://www.tier1nw.com/golf";
const TIER1_GOLF_EMAIL = "Tier1golf@woodinvillesportsclub.com";

const JUNIOR_GOLF_PATHWAY = [
  {
    title: "Intro to Golf",
    ages: "Ages 4–6",
    description:
      "A play-based introduction for WSC's youngest golfers. Putting-green and turf games build coordination, safety, and a love for the sport, with no experience or equipment required.",
  },
  {
    title: "Golf Club",
    ages: "Ages 7–9 & 10–12",
    description:
      "Entry-level and intermediate juniors develop grip, stance, putting, chipping, and full-swing fundamentals through the Operation 36 skill ladder. Separate age bands, team play, and periodic evaluations keep players engaged and guide progression.",
  },
  {
    title: "Tier 1 High Performance",
    ages: "Ages 10+ · Approval Required",
    description:
      "An advanced track for dedicated athletes pursuing tournament, high school, or collegiate golf. Data-driven simulator training develops mechanics, course strategy, and mental preparation, with entry through coach approval or assessment.",
  },
];

export default function GolfLessonFormPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="WSC Golf Academy & Junior Golf Programs"
        description="Explore the WSC Golf Academy junior pathway from Intro to Golf through approval-only High Performance, or request a private golf lesson."
        path="/golf-coaching"
      />
      <PageHero
        eyebrow="Golf Lessons"
        headline="Golf Lessons & Junior Programs."
        subtitle="Explore the WSC Golf Academy pathway, register for a program in CourtReserve, or request help finding the right private-lesson option."
        image={HERO_IMG}
      />

      <section className="bg-dark-bg px-6 lg:px-14 py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">WSC Golf Academy</p>
            <h2 className="text-parchment text-[clamp(32px,4vw,58px)] font-light tracking-[-0.03em] leading-[1.02] mb-7">
              Junior Golf<br />Pathway.
            </h2>
            <p className="text-parchment/76 text-[15px] leading-[1.8] max-w-[460px]">
              A clear junior pathway from first swings to structured skill development and an approval-only performance track.
            </p>

            <div className="grid grid-cols-2 gap-[1px] bg-parchment/10 border border-parchment/10 mt-9">
              {[
                { value: "03", label: "Pathway Stages" },
                { value: "4+", label: "Starting Age" },
                { value: "Op 36", label: "Skill Development" },
                { value: "HP", label: "Coach Approval" },
              ].map((item) => (
                <div key={item.label} className="bg-dark-mid px-5 py-5">
                  <p className="text-parchment text-[28px] font-light tracking-[-0.03em] leading-none mb-2">{item.value}</p>
                  <p className="text-parchment/60 text-[10px] tracking-[0.16em] uppercase leading-[1.45]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="space-y-3">
              {JUNIOR_GOLF_PATHWAY.map((program, index) => (
                <article key={`${program.title}-${program.ages}`} className="border border-parchment/12 bg-white/[0.045] px-6 py-6 lg:px-8 lg:py-7">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-parchment text-[clamp(22px,2.3vw,32px)] font-light tracking-[-0.02em] leading-[1.08]">
                        {program.title}
                        <span className="block sm:inline text-parchment/62 text-[14px] sm:text-[16px] tracking-normal ml-0 sm:ml-3 mt-1 sm:mt-0">
                          ({program.ages})
                        </span>
                      </h3>
                      <p className="text-parchment/70 text-[13px] leading-[1.75] mt-4 max-w-[820px]">{program.description}</p>
                    </div>
                    <span className="text-parchment/50 text-[10px] tracking-[0.22em] shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 border border-volt-bright/25 bg-volt-bright/[0.08] p-6 lg:p-7">
              <p className="text-volt-bright text-[11px] tracking-[0.2em] uppercase mb-3">Choose your next step</p>
              <p className="text-parchment/76 text-[14px] leading-[1.75] max-w-[900px]">
                Current WSC members can see live availability and register in CourtReserve. For help choosing a level, invitation-only placement, or deeper academy information, visit Tier 1 Golf or email the golf team.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-6">
                <a
                  href={COURT_RESERVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-7 py-3.5 hover:bg-parchment transition-colors duration-200"
                >
                  Register in CourtReserve
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
                </a>
                <a
                  href={TIER1_GOLF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-7 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
                >
                  More Details at Tier 1
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
                </a>
              </div>
              <p className="text-parchment/68 text-[13px] leading-[1.7] mt-5">
                Placement questions? Email{" "}
                <a href={`mailto:${TIER1_GOLF_EMAIL}`} className="text-volt-bright no-underline border-b border-volt-bright/40 pb-[2px]">
                  {TIER1_GOLF_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[860px] mx-auto">
          <div className="mb-8">
            <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-4">Private Lessons</p>
            <h2 className="text-parchment text-[clamp(28px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.1] mb-4">
              Request one-on-one instruction.
            </h2>
            <p className="text-parchment/76 text-[14px] leading-[1.75] max-w-[680px]">
              Share your skill level, goals, and preferred schedule below. WSC golf staff will follow up and match you with the right coach and lesson setting.
            </p>
          </div>
          <div className="mb-8 border border-volt-bright/25 bg-volt-bright/[0.08] px-5 py-4">
            <p className="text-parchment/82 text-[13px] leading-[1.7]">
              Private golf lessons require an active membership with class registration privileges or a Class Registration Pass before booking.
            </p>
          </div>
          <GolfLessonInquiryForm source="/golf-coaching" />
        </div>
      </section>
    </div>
  );
}
