/*
 * 4B Design — APL Fitness Page
 * Real content from WSC website crawl
 */
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";

const PERF_IMG = "/images/wsc/gym-main.webp";

export default function Fitness() {
  return (
    <div className="min-h-screen">
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "APL Fitness", url: "https://www.woodinvillesportsclub.com/fitness" },
      ])]} />
      <PageHero
        eyebrow="Athletic Performance Lab"
        headline="Where Champions Are Built."
        subtitle="WSC's Athletic Performance Lab is a complete performance ecosystem that integrates elite coaching, cutting-edge facilities and individualized strength and conditioning training, enabling youth and adults to achieve their peak performance potential."
        image={PERF_IMG}
      />

      {/* Two Facilities */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Main Gym</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              Full-service strength<br />and cardio.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82]">
              Our Main Gym is a clean and updated space with flexible hours and top-notch equipment, including free weights, cardio machines, power lifting stations, and a dynamic functional training area. Enjoy views of the beautiful tree-lined property while you work out.
            </p>
          </div>
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">APL Training Center</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              Dedicated S&C<br />for athletes.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82]">
              Our new Athletic Performance Lab (APL) Training Center is a dedicated space for strength and conditioning training for youth and adult athletes. This is where our elite coaching staff hosts small-group strength and conditioning training sessions for athletes striving to reach their maximum performance potential.
            </p>
          </div>
        </div>
      </section>

      {/* Dark: Group S&C */}
      <section className="bg-dark-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16">
            <div>
              <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-6">Group S&C Training</p>
              <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light leading-[1.1] tracking-[-0.02em] mb-6">
                Building more<br />well-rounded athletes.
              </h2>
              <p className="text-parchment/80 text-[15px] leading-[1.8] max-w-[420px] mb-6">
                We've recently launched an all-new lineup of APL Group Strength & Conditioning Classes for kids and adults. Training sessions benefit athletes of all levels and are tailored to your sport, improving strength, speed, power, agility, and endurance.
              </p>
              <p className="text-parchment/80 text-[15px] leading-[1.8] max-w-[420px] mb-8">
                The goal of our APL training program is to develop more well-rounded athletes, giving you the competitive edge to perform at the highest level in your sport.
              </p>
              <a
                href="https://app.courtreserve.com/Online/Portal/Index/6689"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-7 py-3 hover:bg-volt hover:border-volt transition-colors duration-200"
              >
                Browse Classes
              </a>
            </div>
            <img
              src={PERF_IMG}
              alt="Athletic Performance Lab training space at Woodinville Sports Club"
              width={1800}
              height={1350}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover saturate-[0.4] brightness-[0.65]"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-parchment/[0.1] pt-12 gap-y-8">
            {[
              { val: "2", label: "Training Facilities" },
              { val: "S&C", label: "Small Group Classes" },
              { val: "Youth", label: "& Adult Programs" },
              { val: "4/8/∞", label: "Monthly Packages" },
            ].map((m, i) => (
              <div key={i} className={`pr-10 ${i < 3 ? "lg:border-r border-parchment/[0.08]" : ""}`}>
                <div className="text-volt-bright text-[36px] font-light tracking-[-0.03em] leading-none mb-2">
                  {m.val}
                </div>
                <div className="text-parchment/70 text-[11px] tracking-[0.14em] uppercase leading-[1.5]">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Packages */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Flexible Training Packages</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            Monthly packages for<br />more scheduling flexibility.
          </h2>
          <p className="text-ink-mid text-[16px] leading-[1.82] mb-14 max-w-[680px]">
            APL Small Group Classes can be purchased in monthly packages of 4, 8, or unlimited classes. Browse from our range of APL strength and conditioning small group classes for adults and youth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
            {[
              { name: "4 Classes/Month", desc: "One session per week. Ideal for supplementing sport-specific training with structured S&C work." },
              { name: "8 Classes/Month", desc: "Two sessions per week. The standard for consistent athletic development and measurable progress." },
              { name: "Unlimited", desc: "Full access to all group S&C classes. For the dedicated athlete committed to peak performance." },
            ].map((c, i) => (
              <div key={i} className="bg-parchment p-8 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-3">{c.name}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72] mb-5">{c.desc}</p>
                <a
                  href="https://app.courtreserve.com/Online/Portal/Index/6689"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
                >
                  Enquire
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Membership</p>
          <h2 className="text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Explore our membership options.
          </h2>
          <p className="text-ink-mid text-[15px] leading-[1.75] max-w-[480px] mx-auto mb-8">
            Take your fitness to the next level at WSC. All-Access memberships include full gym and APL Training Center access.
          </p>
          <Link
            href="/membership"
            className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
          >
            Become a Member
          </Link>
        </div>
      </section>
    </div>
  );
}
