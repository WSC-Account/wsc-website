/*
 * 4B Design — WSC Fitness Center Page
 * Covers: Main Gym, Weight Room, Functional Training, Amenities, Hours
 */
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import ResponsiveImage from "@/components/ResponsiveImage";
import StructuredData, { getBreadcrumbSchema, getServiceSchema } from "@/components/StructuredData";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const GYM_HERO = "/images/wsc/fitness-center-hero.webp";
const GYM_MAIN = "/images/wsc/gym-main-interior.webp";
const GYM_WEIGHTS = "/images/wsc/gym-training-tools.webp";
const GYM_FUNCTIONAL = "/images/wsc/gym-functional-zone.webp";

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
      <StructuredData schemas={[
        getBreadcrumbSchema([
          { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
          { name: "Fitness Center", url: "https://www.woodinvillesportsclub.com/gym" },
        ]),
        getServiceSchema({
          name: "Fitness Center Memberships and Personal Training",
          description: SEO.gym.description,
          url: "https://www.woodinvillesportsclub.com/gym",
          serviceType: "Gym membership, fitness center access, and personal training",
          image: GYM_HERO,
          audience: "Adults seeking independent workouts or personal training",
        }),
      ]} />
      <PageHero
        eyebrow="Fitness Center"
        headline="Fitness memberships that fit real life."
        subtitle="Train in a clean, accessible gym with flexible fitness memberships, cardio equipment, free weights, dedicated strength space, sauna access, locker rooms, and personal training with world-class instructors."
        image={GYM_HERO}
        imagePosition="center 48%"
      />

      <section className="bg-dark-bg px-6 lg:px-14 py-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-8">
          {[
            { val: "Fitness", label: "Memberships" },
            { val: "6am-11pm", label: "Weekday Access" },
            { val: "7am-10pm", label: "Weekend Access" },
            { val: "1:1", label: "Personal Training" },
          ].map((m, i) => (
            <div key={i} className={`pr-10 ${i < 3 ? "lg:border-r border-parchment/[0.08]" : ""}`}>
              <div className="text-volt-bright text-[clamp(24px,2.8vw,36px)] font-light leading-none mb-2">
                {m.val}
              </div>
              <div className="text-parchment/75 text-[11px] tracking-[0.14em] uppercase leading-[1.5]">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-12 border-b border-ink/10">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-[680px]">
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-4">Fitness Memberships</p>
            <h2 className="text-[clamp(24px,2.4vw,34px)] font-light leading-[1.18] mb-4">
              A clean, accessible gym for consistent training.
            </h2>
            <p className="text-ink-mid text-[15px] leading-[1.75]">
              WSC fitness memberships are built for members who want a reliable place to train, recover, and get expert help when they want it.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/membership"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Explore Fitness Memberships
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

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={mainGymRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${mainGymVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <ResponsiveImage
                src={GYM_MAIN}
                alt="WSC main gym with strength equipment, benches, and tree-lined windows"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Main Gym</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-8">
                Clean, accessible,<br />ready when you are.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
                The WSC Fitness Center is a bright, well-kept training space with flexible hours and the equipment members use every day: cardio machines, free weights, strength stations, and open room for a complete workout.
              </p>
              <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
                It is built to feel approachable without feeling basic, giving new gym members and experienced lifters a clean place to train with confidence.
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
                Strength training<br />without intimidation.
              </h2>
              <p className="text-parchment/80 text-[15px] leading-[1.8] max-w-[420px] mb-6">
                The weight room gives members serious tools in a welcoming environment, including power racks, Olympic lifting platforms, a full dumbbell range, cable machines, and kettlebells.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Power Racks", "Olympic Platforms", "Dumbbells", "Cable Machines", "Kettlebells"].map((item) => (
                  <span key={item} className="text-[11px] tracking-[0.1em] uppercase text-parchment/75 border border-parchment/20 px-4 py-2">{item}</span>
                ))}
              </div>
            </div>
            <ResponsiveImage
              src={GYM_WEIGHTS}
              alt="WSC kettlebells, medicine balls, and strength training tools"
              loading="lazy"
              className="w-full aspect-[4/3] object-cover object-center"
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
              <ResponsiveImage
                src={GYM_FUNCTIONAL}
                alt="WSC functional training area with turf, kettlebells, and strength equipment"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Functional Training</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-8">
                Room to move,<br />stretch, and reset.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
                The functional training zone supports dynamic warm-ups, mobility work, circuits, conditioning, and recovery with open space, suspension trainers, medicine balls, resistance bands, and recovery tools.
              </p>
              <p className="text-ink-mid text-[16px] leading-[1.82]">
                Whether you are building a repeatable routine, returning to training, or adding variety to your week, the space adapts to the way you like to move.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.4fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Personal Training</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light leading-[1.15] mb-8">
              World-class instructors,<br />personal plans.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Work one-on-one with experienced WSC instructors who can help you build strength, improve mobility, train with better form, and create a plan that fits your schedule.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/personal-training-interest-form"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
              >
                Request Personal Training
              </Link>
              <Link
                href="/membership"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-ink border border-ink/20 px-8 py-3.5 hover:bg-ink/5 transition-colors duration-200"
              >
                Explore Memberships
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {[
              {
                q: "Who is it for?",
                a: "Personal training is available for all fitness levels, from first-time gym members to experienced athletes refining a routine.",
              },
              {
                q: "What do trainers help with?",
                a: "WSC instructors can support strength training, mobility, form, accountability, confidence, and sustainable workout planning.",
              },
              {
                q: "Do I need gym experience?",
                a: "No. Your trainer meets you where you are and builds a plan around your goals, comfort level, and available training time.",
              },
              {
                q: "How do I start?",
                a: "Submit a personal training request and the WSC fitness team will follow up about your goals, availability, and next steps.",
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
            Clean, useful amenities<br />for daily members.
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
                Accessible hours<br />for busy schedules.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] max-w-[420px]">
                The WSC Fitness Center operates on extended hours so members can train before work, after school, or later in the evening. Gym access requires an active membership with gym privileges.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { day: "Monday - Friday", hours: "6:00 AM - 11:00 PM" },
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
            Choose a fitness membership and start training.
          </h2>
          <p className="text-ink-mid text-[15px] leading-[1.75] max-w-[520px] mx-auto mb-8">
            Fitness memberships include gym access, sauna access, locker rooms, and the option to add personal training with WSC instructors.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/membership"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Explore Memberships
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
