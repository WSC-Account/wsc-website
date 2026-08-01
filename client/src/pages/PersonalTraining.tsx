import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import ResponsiveImage from "@/components/ResponsiveImage";
import StructuredData, { getBreadcrumbSchema, getServiceSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/fitness-center-hero.webp";
const TRAINING_IMG = "/images/wsc/gym-functional-zone.webp";

const trainerFocusAreas = [
  "Strength & form",
  "Mobility & movement",
  "Confidence in the gym",
  "Accountability",
];

const trainingFit = [
  {
    title: "Build a repeatable routine",
    desc: "Get a plan you can follow around your schedule, training history, and comfort level in the gym.",
  },
  {
    title: "Train with better form",
    desc: "Work with a trained eye on movement quality, safer progressions, and equipment setup.",
  },
  {
    title: "Stay accountable",
    desc: "Use regular sessions to keep momentum, adjust your plan, and stay connected to your goals.",
  },
];

export default function PersonalTraining() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.personalTraining} image={HERO_IMG} />
      <StructuredData schemas={[
        getBreadcrumbSchema([
          { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
          { name: "Personal Training", url: "https://www.woodinvillesportsclub.com/personal-training" },
        ]),
        getServiceSchema({
          name: "Personal Training at Woodinville Sports Club",
          description: SEO.personalTraining.description,
          url: "https://www.woodinvillesportsclub.com/personal-training",
          serviceType: "Personal training, strength training, mobility coaching, and gym accountability",
          image: HERO_IMG,
          audience: "Adults and members seeking one-on-one fitness coaching",
        }),
      ]} />
      <PageHero
        eyebrow="Personal Training"
        headline="Train with a plan."
        subtitle="One-on-one personal training at Woodinville Sports Club for strength, mobility, form, accountability, and a fitness routine that fits real life."
        image={HERO_IMG}
        imagePosition="center 48%"
      />

      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Get Matched</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-8">
              Start with your goals, then we match the trainer.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8 max-w-[560px]">
              Tell us what you are working toward and the WSC fitness team will follow up about the right trainer, schedule, and next step.
            </p>
            <Link
              href="/personal-training-interest-form"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Request Personal Training
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
            {trainingFit.map((item) => (
              <article key={item.title} className="bg-parchment-mid p-8">
                <h3 className="text-[19px] font-light leading-[1.28] mb-4">{item.title}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="trainers" className="bg-dark-mid px-6 lg:px-14 py-24 lg:py-28 scroll-mt-[var(--site-header-height,130px)]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-center">
          <ResponsiveImage
            src={TRAINING_IMG}
            alt="WSC functional training space for personal training"
            loading="lazy"
            className="w-full aspect-[4/3] object-cover brightness-[0.82] saturate-[0.85]"
          />

          <div>
            <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-6">Trainer Roster</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light leading-[1.1] mb-6">
              Meet the trainers.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.8] mb-8 max-w-[560px]">
              This page is ready for WSC trainer profiles, including names, focus areas, credentials, short bios, approved headshots, and booking paths.
            </p>

            <div className="bg-dark-bg p-8 lg:p-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                  <p className="text-volt-bright text-[12px] tracking-[0.2em] uppercase mb-3">Profiles Coming Soon</p>
                  <h3 className="text-parchment text-[22px] font-light leading-[1.25]">WSC Personal Training Team</h3>
                </div>
                <Link
                  href="/personal-training-interest-form"
                  className="inline-block text-center text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-6 py-3 hover:bg-volt hover:border-volt transition-colors duration-200"
                >
                  Request a Match
                </Link>
              </div>
              <p className="text-parchment/78 text-[14px] leading-[1.72] mb-7">
                Send the trainer names, roles, specialties, short bios, and approved photos when ready, and these profile slots can become individual trainer cards.
              </p>
              <div className="flex flex-wrap gap-3">
                {trainerFocusAreas.map((item) => (
                  <span key={item} className="text-[11px] tracking-[0.1em] uppercase text-parchment/75 border border-parchment/20 px-4 py-2">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[920px] mx-auto text-center">
          <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Next Step</p>
          <h2 className="text-[clamp(26px,3vw,42px)] font-light leading-[1.15] mb-5">
            Tell us what kind of training you need.
          </h2>
          <p className="text-ink-mid text-[15px] leading-[1.75] max-w-[560px] mx-auto mb-8">
            Share your goals, schedule, and any injury notes so the WSC team can follow up with the right personal training path.
          </p>
          <Link
            href="/personal-training-interest-form"
            className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
          >
            Request Personal Training
          </Link>
        </div>
      </section>
    </div>
  );
}
