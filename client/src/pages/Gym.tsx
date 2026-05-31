/*
 * 4B Design — WSC Fitness Center Page
 * Covers: Main Gym, Weight Room, Functional Training, Amenities, Hours
 */
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const FITNESS_CENTER_HERO = "/images/wsc/fitness-center-hero.webp";
const GYM_HERO = "/images/wsc/gym-main.webp";
const GYM_WEIGHTS = FITNESS_CENTER_HERO;
const GYM_FUNCTIONAL = "/images/wsc/gym-floor.webp";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";

export default function Gym() {
  const { ref: mainGymRef, isVisible: mainGymVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: weightRef, isVisible: weightVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: functionalRef, isVisible: functionalVisible } = useScrollReveal({ threshold: 0.08 });
  const { containerRef: amenitiesRef, visibleItems: amenitiesVisible } = useStaggerReveal(6, { staggerDelay: 100, threshold: 0.06 });
  const { ref: hoursRef, isVisible: hoursVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.gym} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Fitness Center", url: "https://www.woodinvillesportsclub.com/gym" },
      ])]} />
      <PageHero
        eyebrow="Fitness Center"
        headline="Your Gym. Your Goals."
        subtitle="Train in a full-service fitness center with cardio equipment, free weights, dedicated strength space, functional training tools, sauna access, and locker rooms on WSC's 67-acre campus."
        image={FITNESS_CENTER_HERO}
        imagePosition="center 52%"
      />

      <section className="bg-dark-bg px-6 lg:px-14 py-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-8">
          {[
            { val: "67", label: "Acre Campus" },
            { val: "6am", label: "Weekday Open" },
            { val: "7am", label: "Weekend Open" },
            { val: "10pm", label: "Daily Close" },
          ].map((m, i) => (
            <div key={i} className={`pr-10 ${i < 3 ? "lg:border-r border-parchment/[0.08]" : ""}`}>
              <div className="text-volt-bright text-[36px] font-light leading-none mb-2">
                {m.val}
              </div>
              <div className="text-parchment/75 text-[11px] tracking-[0.14em] uppercase leading-[1.5]">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={mainGymRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${mainGymVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={GYM_HERO}
                alt="WSC Main Gym with cardio machines and tree-lined views"
                width={1800}
                height={1350}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Main Gym</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-8">
                Full-service strength<br />and cardio.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
                The WSC Fitness Center is a clean, updated space with flexible hours and top-notch equipment, including free weights, cardio machines, power lifting stations, and room for everyday training.
              </p>
              <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
                Floor-to-ceiling windows overlook the tree-lined property, creating a training environment that feels focused, bright, and connected to the campus around it.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Treadmills", "Ellipticals", "Rowing Machines", "Stationary Bikes", "Free Weights"].map((item) => (
                  <span key={item} className="text-[11px] tracking-[0.1em] uppercase text-ink-mid border border-ink/15 px-4 py-2">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={weightRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${weightVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-6">Weight Room</p>
              <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light leading-[1.1] mb-6">
                Built for serious<br />strength training.
              </h2>
              <p className="text-parchment/80 text-[15px] leading-[1.8] max-w-[420px] mb-6">
                Our dedicated weight room features power racks, Olympic lifting platforms, a full dumbbell range, cable machines, and kettlebells for members building strength with intention.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Power Racks", "Olympic Platforms", "Dumbbells", "Cable Machines", "Kettlebells"].map((item) => (
                  <span key={item} className="text-[11px] tracking-[0.1em] uppercase text-parchment/75 border border-parchment/20 px-4 py-2">{item}</span>
                ))}
              </div>
            </div>
            <img
              src={GYM_WEIGHTS}
              alt="WSC main gym with cardio machines, free weights, and strength equipment"
              width={600}
              height={350}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={functionalRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${functionalVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={GYM_FUNCTIONAL}
                alt="WSC functional training area with strength equipment"
                width={1800}
                height={1350}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Functional Training</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-8">
                Move better.<br />Train with purpose.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
                The functional training zone supports dynamic warm-ups, mobility work, circuits, and conditioning with open space, suspension trainers, medicine balls, resistance bands, and recovery tools.
              </p>
              <p className="text-ink-mid text-[16px] leading-[1.82]">
                Whether you are building a repeatable routine, returning to training, or adding variety to your workouts, the space adapts to the way you like to move.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.4fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Free Fitness Assessment</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-8">
              Expert guidance for WSC gym members.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Get expert insight into your current routine, goals, and next steps with a complimentary 30-45 minute assessment from a certified WSC trainer.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
              >
                Book Your Assessment
              </a>
              <Link
                href="/personal-training-interest-form"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-ink border border-ink/20 px-8 py-3.5 hover:bg-ink/5 transition-colors duration-200"
              >
                Request Personal Training
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {[
              {
                q: "What is included?",
                a: "A trainer will review your routine, discuss goals, identify opportunities for improvement, and provide personalized recommendations.",
              },
              {
                q: "Is it complimentary?",
                a: "Yes. The assessment is included for WSC gym members with no obligation or long-term commitment required.",
              },
              {
                q: "Do I need gym experience?",
                a: "No. The session is designed for all fitness levels, from first-time gym users to experienced members.",
              },
              {
                q: "What happens after?",
                a: "You will receive guidance based on your goals. If useful, the coaching team can recommend next steps.",
              },
            ].map((item) => (
              <article key={item.q} className="bg-parchment-mid p-8">
                <h3 className="text-[18px] font-light mb-3">{item.q}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Amenities</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-14">
            Everything you need,<br />all under one roof.
          </h2>
          <div ref={amenitiesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
            {[
              { title: "Sauna", desc: "Unwind after your workout in the dry sauna. Available to members with gym access during regular facility hours." },
              { title: "Locker Rooms", desc: "Clean, well-maintained locker rooms with showers, changing areas, and secure storage for your belongings." },
              { title: "Stretching Area", desc: "A dedicated stretching and recovery zone with foam rollers, yoga mats, and resistance bands." },
              { title: "Pro Shop", desc: "Pick up essentials, apparel, accessories, and sport gear conveniently located on campus." },
              { title: "Free Parking", desc: "Ample free parking right at the facility. Pull up, check in, and train." },
              { title: "Wi-Fi", desc: "Complimentary high-speed Wi-Fi throughout the facility so you can stream music or track workouts." },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`bg-parchment-mid p-8 border-t-2 border-transparent hover:border-volt transition-all duration-700 ease-out ${amenitiesVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <h3 className="text-[20px] font-light mb-3">{item.title}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={hoursRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${hoursVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Fitness Center Hours</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-8">
                Open early.<br />Close late.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] max-w-[420px]">
                The WSC Fitness Center operates on extended hours to fit your schedule. Gym access requires an active membership with gym privileges.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { day: "Monday - Friday", hours: "6:00 AM - 10:00 PM" },
                { day: "Saturday - Sunday", hours: "7:00 AM - 10:00 PM" },
              ].map((item) => (
                <div key={item.day} className="flex items-center justify-between py-4 border-b border-ink/10">
                  <span className="text-[15px] font-light">{item.day}</span>
                  <span className="text-ink-mid text-[15px]">{item.hours}</span>
                </div>
              ))}
              <p className="text-ink-mid/85 text-[13px] leading-[1.7] pt-4">
                Hours may vary on holidays. Please check the front desk or CourtReserve for holiday schedules.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={ctaRef}
          className={`max-w-[1440px] mx-auto text-center transition-all duration-700 ease-out ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Get Started</p>
          <h2 className="text-[clamp(26px,3vw,42px)] font-light leading-[1.15] mb-4">
            Ready to train at WSC?
          </h2>
          <p className="text-ink-mid text-[15px] leading-[1.75] max-w-[520px] mx-auto mb-8">
            All-Access memberships include full gym, sauna, and locker room access. Join the WSC community today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/membership"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Become a Member
            </Link>
            <Link
              href="/contact"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-ink border border-ink/20 px-8 py-3.5 hover:bg-ink/5 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
