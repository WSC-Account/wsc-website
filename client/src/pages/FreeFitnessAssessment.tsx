import { useCallback, useState } from "react";
import ResponsiveImage from "@/components/ResponsiveImage";
import StructuredData, { getBreadcrumbSchema, getServiceSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import FreeAssessmentModal, { trackAssessmentCtaClick } from "@/components/FreeAssessmentModal";

const HERO_IMG = "/images/wsc/fitness-center-hero.webp";
const COACHING_IMG = "/images/wsc/apl-training.webp";
const OUTCOME_IMG = "/images/wsc/gym-functional-zone.webp";

const PAGE_URL = "https://www.woodinvillesportsclub.com/free-fitness-assessment";

const summaryBlocks = [
  { value: "Free", label: "Fitness Assessment" },
  { value: "Adults + Kids", label: "Built around the individual" },
  { value: "7 Foundational Movements", label: "A practical movement baseline" },
];

const conversationPoints = [
  "Training goals",
  "Training history",
  "Current activity",
  "Previous or ongoing injuries",
  "Areas you want to improve",
];

const movementPoints = [
  "Seated Thoracic Rotation",
  "Overhead Shoulder Flexion",
  "Goblet Squat",
  "Reverse Lunge",
  "Lateral Lunge",
  "Push-Up",
  "Single-Arm Dumbbell Row",
];

const focusPoints = ["Strength", "Mobility", "Stability", "Movement control", "Training consistency"];

const outcomePoints = [
  "How you currently move",
  "Areas you already do well",
  "Areas that could improve",
  "What your training should prioritize",
  "How structured strength and conditioning could help you progress",
];

const adultPoints = [
  "Get stronger",
  "Move better",
  "Return to structured training",
  "Improve mobility",
  "Better understand their current movement",
  "Build a more purposeful training plan",
];

const kidPoints = [
  "Build a better physical foundation",
  "Improve strength and movement quality",
  "Support athletic development",
  "Establish useful baseline information",
  "Develop better movement habits",
  "Train with greater structure and purpose",
];

const movementScreen = [
  { category: "Thoracic Rotation", movement: "Seated Thoracic Rotation" },
  { category: "Shoulder Mobility", movement: "Overhead Shoulder Flexion" },
  { category: "Squat", movement: "Goblet Squat" },
  { category: "Linear Lower Body", movement: "Reverse Lunge" },
  { category: "Lateral Lower Body", movement: "Lateral Lunge" },
  { category: "Upper Body Push", movement: "Push-Up" },
  { category: "Upper Body Pull", movement: "Single-Arm Dumbbell Row" },
];

const processSteps = [
  { step: "1", title: "Submit the form", detail: "Tell us a little about yourself." },
  {
    step: "2",
    title: "We contact you",
    detail: "A member of our fitness team will help coordinate your assessment.",
  },
  {
    step: "3",
    title: "Complete your assessment",
    detail: "Come into Woodinville Sports Club and establish your baseline.",
  },
];

export default function FreeFitnessAssessment() {
  const [formOpen, setFormOpen] = useState(false);

  const openForm = useCallback((location: string) => {
    trackAssessmentCtaClick(location);
    setFormOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-parchment">
      <SEOHead
        title="Free Fitness Assessment in Woodinville"
        description="Claim a free fitness assessment at Woodinville Sports Club. Establish a movement baseline, identify areas to improve, and get clearer direction for your training. Available for adults and kids."
        path="/free-fitness-assessment"
        image={HERO_IMG}
      />
      <StructuredData
        schemas={[
          getBreadcrumbSchema([
            { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
            { name: "Free Fitness Assessment", url: PAGE_URL },
          ]),
          getServiceSchema({
            name: "Free Fitness Assessment",
            description:
              "A free fitness and movement assessment at Woodinville Sports Club in Woodinville, Washington. Establish a movement baseline, identify areas to improve, and get clearer direction for strength and conditioning training.",
            url: PAGE_URL,
            serviceType: "Fitness assessment, movement screening, and strength and conditioning consultation",
            image: HERO_IMG,
            audience: "Adults and kids in Woodinville, Washington interested in coached fitness and performance training",
          }),
        ]}
      />

      <FreeAssessmentModal open={formOpen} onOpenChange={setFormOpen} />

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-dark-bg px-6 py-[120px] text-parchment lg:px-14 lg:py-[150px]">
        <ResponsiveImage
          src={HERO_IMG}
          alt="Strength and conditioning training floor at Woodinville Sports Club in Woodinville, Washington"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover saturate-[0.7] brightness-[0.4]"
          style={{ objectPosition: "center 50%" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,19,16,0.9),rgba(22,19,16,0.72),rgba(22,19,16,0.4))]" />
        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="max-w-[760px]">
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt-bright">
              WSC Fitness &amp; Performance
            </p>
            <h1 className="mb-6 text-[clamp(40px,6.4vw,76px)] font-light leading-[1.03] tracking-[-0.02em]">
              Free Fitness Assessment
            </h1>
            <p className="mb-6 max-w-[620px] text-[clamp(18px,2vw,22px)] font-light leading-[1.5] text-parchment/92">
              Understand how you move. Know what to work on. Train with more purpose.
            </p>
            <p className="mb-8 max-w-[620px] text-[16px] leading-[1.75] text-parchment/78">
              Get a baseline look at your movement, identify areas that may need improvement, and
              learn what you should focus on to make your training more effective. Available for
              adults and kids at Woodinville Sports Club in Woodinville, Washington.
            </p>

            <div className="mb-9 inline-flex items-center gap-3 border border-volt/50 bg-white/[0.06] px-5 py-3 backdrop-blur-sm">
              <span className="text-[12px] uppercase tracking-[0.18em] text-volt-bright">
                Adults &amp; Kids
              </span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => openForm("hero")}
                className="inline-flex min-h-[68px] items-center justify-center bg-volt-bright px-10 py-5 text-[13px] uppercase tracking-[0.14em] text-dark-bg transition-colors duration-200 hover:bg-parchment-dark"
              >
                Claim Your Free Assessment
              </button>
              <a
                href="#what-happens"
                className="inline-flex min-h-[68px] items-center justify-center px-2 text-[13px] uppercase tracking-[0.14em] text-parchment/85 no-underline transition-colors duration-200 hover:text-volt-bright"
              >
                See What's Included ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK PROOF / SUMMARY STRIP */}
      <section className="bg-parchment px-6 py-10 lg:px-14 lg:py-12">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-[3px] md:grid-cols-3">
          {summaryBlocks.map((block) => (
            <div key={block.label} className="bg-parchment-mid p-8 text-center md:text-left">
              <p className="mb-2 text-[clamp(24px,2.6vw,34px)] font-light leading-[1.1] tracking-[-0.02em] text-volt-bright">
                {block.value}
              </p>
              <p className="text-[13px] uppercase tracking-[0.14em] text-ink-mid">{block.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHAT IS A FREE FITNESS ASSESSMENT? */}
      <section className="bg-parchment px-6 py-20 lg:px-14 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:items-center">
          <div>
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt">
              What Is A Free Fitness Assessment?
            </p>
            <h2 className="mb-6 text-[clamp(26px,3vw,42px)] font-light leading-[1.12] tracking-[-0.02em]">
              Know Your Starting Point
            </h2>
            <div className="space-y-5 text-[16px] leading-[1.78] text-ink-mid">
              <p>Good training starts with understanding the person doing the training.</p>
              <p>
                Our Free Fitness Assessment gives our fitness team a baseline understanding of your
                goals, training history, and how you move before recommending what you should focus
                on next.
              </p>
              <p>
                The goal isn't to put you through a random workout. It's to understand where you are
                today so your training can have a clearer purpose.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openForm("know_your_starting_point")}
              className="mt-9 inline-flex min-h-[64px] items-center justify-center bg-volt-bright px-9 py-4 text-[12px] uppercase tracking-[0.14em] text-dark-bg transition-colors duration-200 hover:bg-parchment-dark"
            >
              Claim Your Free Assessment
            </button>
          </div>
          <ResponsiveImage
            src={COACHING_IMG}
            alt="A WSC coach guiding an athlete through strength training at the Athletic Performance Lab in Woodinville"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover brightness-[0.85] saturate-[0.85] lg:aspect-[4/4.4]"
          />
        </div>
      </section>

      {/* 4. HOW THE ASSESSMENT WORKS */}
      <section
        id="what-happens"
        className="scroll-mt-[var(--site-header-height,130px)] bg-dark-mid px-6 py-20 text-parchment lg:px-14 lg:py-24"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 border-b border-white/12 pb-8">
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt-bright">
              How The Assessment Works
            </p>
            <h2 className="text-[clamp(26px,3vw,42px)] font-light leading-[1.12] tracking-[-0.02em]">
              What Happens During Your Assessment
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-[3px] lg:grid-cols-3">
            <article className="bg-white/[0.05] p-8 lg:p-10">
              <p className="mb-5 text-[40px] font-light leading-none text-volt-bright">01</p>
              <h3 className="mb-4 text-[22px] font-light tracking-[-0.01em]">We Learn About You</h3>
              <p className="mb-6 text-[15px] leading-[1.75] text-parchment/78">
                Start with a brief conversation about:
              </p>
              <ul className="mb-6 space-y-2.5">
                {conversationPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-[15px] leading-[1.6] text-parchment/85">
                    <span className="mt-[9px] h-[3px] w-[3px] shrink-0 bg-volt-bright" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-[14px] leading-[1.7] text-parchment/65">
                This information helps the coach appropriately tailor the assessment to you.
              </p>
            </article>

            <article className="bg-white/[0.05] p-8 lg:p-10">
              <p className="mb-5 text-[40px] font-light leading-none text-volt-bright">02</p>
              <h3 className="mb-4 text-[22px] font-light tracking-[-0.01em]">We See How You Move</h3>
              <p className="mb-6 text-[15px] leading-[1.75] text-parchment/78">
                You will perform a series of foundational movements across different planes of
                motion. The assessment may include:
              </p>
              <ul className="mb-6 space-y-2.5">
                {movementPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-[15px] leading-[1.6] text-parchment/85">
                    <span className="mt-[9px] h-[3px] w-[3px] shrink-0 bg-volt-bright" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-[14px] leading-[1.7] text-parchment/65">
                Most movements involve approximately 10-20 repetitions depending on the movement and
                the individual. The coach may modify the assessment based on information provided in
                the initial questionnaire.
              </p>
            </article>

            <article className="bg-white/[0.05] p-8 lg:p-10">
              <p className="mb-5 text-[40px] font-light leading-none text-volt-bright">03</p>
              <h3 className="mb-4 text-[22px] font-light tracking-[-0.01em]">
                We Identify What To Work On
              </h3>
              <p className="mb-6 text-[15px] leading-[1.75] text-parchment/78">
                After seeing how you move, the coach can identify areas that may benefit from
                additional:
              </p>
              <ul className="mb-6 space-y-2.5">
                {focusPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-[15px] leading-[1.6] text-parchment/85">
                    <span className="mt-[9px] h-[3px] w-[3px] shrink-0 bg-volt-bright" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-[14px] leading-[1.7] text-parchment/65">
                The purpose is to help create a clearer direction for a structured strength and
                conditioning program.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 5. OUTCOME */}
      <section className="bg-parchment px-6 py-20 lg:px-14 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:items-center">
          <ResponsiveImage
            src={OUTCOME_IMG}
            alt="Functional training zone used for movement assessments at Woodinville Sports Club"
            loading="lazy"
            className="order-2 aspect-[16/11] w-full object-cover brightness-[0.85] saturate-[0.85] lg:order-1"
          />
          <div className="order-1 lg:order-2">
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt">Your Outcome</p>
            <h2 className="mb-6 text-[clamp(26px,3vw,42px)] font-light leading-[1.12] tracking-[-0.02em]">
              Leave With A Clearer Training Direction
            </h2>
            <p className="mb-6 text-[16px] leading-[1.78] text-ink-mid">
              You should walk away from your assessment understanding:
            </p>
            <ul className="mb-8 space-y-3">
              {outcomePoints.map((point) => (
                <li key={point} className="flex gap-3 text-[16px] leading-[1.65] text-ink-mid">
                  <span className="mt-[10px] h-[3px] w-[3px] shrink-0 bg-volt" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mb-9 border-l-2 border-volt-bright bg-parchment-mid p-6 text-[clamp(18px,2vw,22px)] font-light leading-[1.45] tracking-[-0.01em]">
              Stop guessing what you should be working on. Start with a baseline.
            </p>
            <button
              type="button"
              onClick={() => openForm("outcome")}
              className="inline-flex min-h-[64px] items-center justify-center bg-volt-bright px-9 py-4 text-[12px] uppercase tracking-[0.14em] text-dark-bg transition-colors duration-200 hover:bg-parchment-dark"
            >
              Get My Free Assessment
            </button>
          </div>
        </div>
      </section>

      {/* 6. ADULTS + KIDS */}
      <section className="bg-parchment px-6 pb-20 lg:px-14 lg:pb-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 border-b border-wsc-border pb-8">
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt">Who It's For</p>
            <h2 className="text-[clamp(26px,3vw,42px)] font-light leading-[1.12] tracking-[-0.02em]">
              Built For Adults &amp; Kids
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-[3px] lg:grid-cols-2">
            <article className="bg-parchment-mid p-8 lg:p-10">
              <h3 className="mb-6 text-[24px] font-light tracking-[-0.01em]">Adults</h3>
              <p className="mb-5 text-[15px] leading-[1.7] text-ink-light">
                For adults who want to:
              </p>
              <ul className="space-y-3">
                {adultPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-[16px] leading-[1.6] text-ink-mid">
                    <span className="mt-[10px] h-[3px] w-[3px] shrink-0 bg-volt" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>

            <article className="bg-parchment-mid p-8 lg:p-10">
              <h3 className="mb-6 text-[24px] font-light tracking-[-0.01em]">Kids</h3>
              <p className="mb-5 text-[15px] leading-[1.7] text-ink-light">For kids who want to:</p>
              <ul className="space-y-3">
                {kidPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-[16px] leading-[1.6] text-ink-mid">
                    <span className="mt-[10px] h-[3px] w-[3px] shrink-0 bg-volt" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <p className="mt-6 max-w-[860px] text-[14px] leading-[1.75] text-ink-light">
            For more advanced kids or athletes, additional performance testing such as force-plate or
            timing-gate data may be incorporated when appropriate.
          </p>
        </div>
      </section>

      {/* 7. MOVEMENT ASSESSMENT VISUAL */}
      <section className="bg-dark-mid px-6 py-20 text-parchment lg:px-14 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 border-b border-white/12 pb-8">
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt-bright">
              Movement Screening
            </p>
            <h2 className="text-[clamp(26px,3vw,42px)] font-light leading-[1.12] tracking-[-0.02em]">
              The Foundational Movement Screen
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-[3px] sm:grid-cols-2 lg:grid-cols-4">
            {movementScreen.map((item) => (
              <article key={item.category} className="bg-white/[0.05] p-7">
                <p className="mb-3 text-[12px] uppercase tracking-[0.16em] text-volt-bright">
                  {item.category}
                </p>
                <p className="text-[18px] font-light leading-[1.35] tracking-[-0.01em]">
                  {item.movement}
                </p>
              </article>
            ))}
            <article className="flex flex-col justify-center bg-volt-bright p-7 text-dark-bg">
              <p className="text-[15px] leading-[1.6]">
                A structured movement baseline — not a sales consultation.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 8. SIMPLE PROCESS */}
      <section className="bg-parchment px-6 py-20 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 border-b border-wsc-border pb-8">
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt">How To Claim</p>
            <h2 className="text-[clamp(26px,3vw,42px)] font-light leading-[1.12] tracking-[-0.02em]">
              Claiming Your Assessment Is Simple
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-[3px] md:grid-cols-3">
            {processSteps.map((item) => (
              <article key={item.step} className="bg-parchment-mid p-8 lg:p-10">
                <p className="mb-5 text-[32px] font-light leading-none text-volt-bright">
                  {item.step}
                </p>
                <h3 className="mb-3 text-[20px] font-light tracking-[-0.01em]">{item.title}</h3>
                <p className="text-[15px] leading-[1.7] text-ink-mid">{item.detail}</p>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openForm("process")}
            className="mt-10 inline-flex min-h-[64px] w-full items-center justify-center bg-volt-bright px-9 py-4 text-[12px] uppercase tracking-[0.14em] text-dark-bg transition-colors duration-200 hover:bg-parchment-dark sm:w-auto"
          >
            Claim My Free Assessment
          </button>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="bg-dark-bg px-6 py-20 text-parchment lg:px-14 lg:py-28">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt-bright">
            Free Fitness Assessment
          </p>
          <h2 className="mb-7 text-[clamp(30px,4.4vw,56px)] font-light leading-[1.08] tracking-[-0.02em]">
            Start With A Baseline
          </h2>
          <p className="mx-auto mb-4 max-w-[640px] text-[16px] leading-[1.78] text-parchment/80">
            Whether you're trying to perform better, get stronger, move better, or simply train with
            more direction, your first step is understanding where you are today.
          </p>
          <p className="mb-10 text-[17px] font-light text-volt-bright">
            Your fitness assessment is free.
          </p>

          <button
            type="button"
            onClick={() => openForm("final")}
            className="inline-flex min-h-[72px] w-full items-center justify-center bg-volt-bright px-12 py-5 text-[13px] uppercase tracking-[0.14em] text-dark-bg transition-colors duration-200 hover:bg-parchment-dark sm:w-auto"
          >
            Claim Your Free Fitness Assessment
          </button>

          <div className="mt-10 border-t border-white/12 pt-8">
            <p className="text-[14px] uppercase tracking-[0.16em] text-parchment/85">
              Woodinville Sports Club
            </p>
            <p className="mt-1.5 text-[14px] text-parchment/60">Woodinville, Washington</p>
          </div>
        </div>
      </section>
    </div>
  );
}
