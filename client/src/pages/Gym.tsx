/*
 * 4B Design — WSC Gym & APL Page (Merged)
 * Covers: Main Gym, Weight Room, Functional Training, APL Training Center,
 * Group S&C Classes, Monthly Packages, Amenities, Hours
 * Scroll reveal animations for consistent UX
 */
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const GYM_HERO = "/images/wsc/gym-main.webp";
const GYM_WEIGHTS = "/images/wsc/gym-floor.webp";
const GYM_FUNCTIONAL = "/images/wsc/apl-training.webp";
const PERF_IMG = "/images/wsc/gym-main.webp";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";

export default function Gym() {
  // Scroll-reveal hooks
  const { ref: mainGymRef, isVisible: mainGymVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: weightRef, isVisible: weightVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: functionalRef, isVisible: functionalVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: aplRef, isVisible: aplVisible } = useScrollReveal({ threshold: 0.08 });
  const { containerRef: classesRef, visibleItems: classesVisible } = useStaggerReveal(7, { staggerDelay: 100, threshold: 0.06 });
  const { containerRef: packagesRef, visibleItems: packagesVisible } = useStaggerReveal(3, { staggerDelay: 140, threshold: 0.1 });
  const { containerRef: amenitiesRef, visibleItems: amenitiesVisible } = useStaggerReveal(6, { staggerDelay: 100, threshold: 0.06 });
  const { ref: hoursRef, isVisible: hoursVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.gym} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Gym & APL", url: "https://www.woodinvillesportsclub.com/gym" },
      ])]} />
      <PageHero
        eyebrow="Gym & Athletic Performance Lab"
        headline="Your Gym. Your Goals."
        subtitle="Two training facilities on one campus — a full-service gym for cardio and strength, plus an elite Athletic Performance Lab for structured S&C coaching. Whether you train solo or with a coach, WSC has the space and equipment to match your ambition."
        image={GYM_HERO}
      />

      {/* Overview Stats */}
      <section className="bg-dark-bg px-6 lg:px-14 py-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-5 gap-y-8">
          {[
            { val: "2", label: "Training Facilities" },
            { val: "67", label: "Acre Campus" },
            { val: "6am", label: "Early Open" },
            { val: "S&C", label: "Group Classes" },
            { val: "4/8/∞", label: "Monthly Packages" },
          ].map((m, i) => (
            <div key={i} className={`pr-10 ${i < 4 ? "lg:border-r border-parchment/[0.08]" : ""}`}>
              <div className="text-volt-bright text-[36px] font-light tracking-[-0.03em] leading-none mb-2">
                {m.val}
              </div>
              <div className="text-parchment/75 text-[11px] tracking-[0.14em] uppercase leading-[1.5]">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Gym Section */}
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
              <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Main Gym</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
                Full-service strength<br />and cardio.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
                Our Main Gym is a clean and updated space with flexible hours and top-notch equipment, including free weights, cardio machines, power lifting stations, and a dynamic functional training area.
              </p>
              <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
                Enjoy views of the beautiful tree-lined property while you work out. Floor-to-ceiling windows overlook our 67-acre campus, creating an atmosphere that's as inspiring as it is functional.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Treadmills", "Ellipticals", "Rowing Machines", "Stationary Bikes", "Free Weights"].map((e) => (
                  <span key={e} className="text-[11px] tracking-[0.1em] uppercase text-ink-mid border border-ink/15 px-4 py-2">{e}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weight Room — Dark */}
      <section className="bg-dark-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={weightRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${weightVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-6">Weight Room</p>
              <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light leading-[1.1] tracking-[-0.02em] mb-6">
                Built for serious<br />strength training.
              </h2>
              <p className="text-parchment/80 text-[15px] leading-[1.8] max-w-[420px] mb-6">
                Our dedicated weight room features power racks, Olympic lifting platforms, a full dumbbell range, cable machines, and kettlebells. Whether you're training for competition or general fitness, you'll find the equipment you need.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Power Racks", "Olympic Platforms", "Dumbbells", "Cable Machines", "Kettlebells"].map((e) => (
                  <span key={e} className="text-[11px] tracking-[0.1em] uppercase text-parchment/75 border border-parchment/20 px-4 py-2">{e}</span>
                ))}
              </div>
            </div>
            <img
              src={GYM_WEIGHTS}
              alt="WSC weight room with power racks and Olympic lifting platforms"
              width={1800}
              height={1350}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Functional Training */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={functionalRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${functionalVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={GYM_FUNCTIONAL}
                alt="WSC functional training area with turf, TRX, and battle ropes"
                width={1800}
                height={1350}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Functional Training</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
                Move better.<br />Perform better.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
                Our functional training zone features an open turf area for agility drills, TRX suspension trainers, battle ropes, medicine balls, and foam rollers. It's the perfect space for dynamic warm-ups, mobility work, and sport-specific conditioning.
              </p>
              <p className="text-ink-mid text-[16px] leading-[1.82]">
                Whether you're preparing for a match, recovering from a workout, or building foundational movement patterns, this space adapts to your training needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── APL TRAINING CENTER ── */}
      <section id="apl" className="bg-dark-bg px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={aplRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${aplVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16">
            <div>
              <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-6">Athletic Performance Lab</p>
              <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light leading-[1.1] tracking-[-0.02em] mb-6">
                Where champions<br />are built.
              </h2>
              <p className="text-parchment/80 text-[15px] leading-[1.8] max-w-[420px] mb-6">
                Our new Athletic Performance Lab (APL) Training Center is a dedicated space for elite strength and conditioning. Small-group classes, sport-specific programming, and expert coaching for youth and adult athletes.
              </p>
              <p className="text-parchment/80 text-[15px] leading-[1.8] max-w-[420px] mb-8">
                The goal of our APL training program is to develop more well-rounded athletes — improving strength, speed, power, agility, and endurance through structured programming.
              </p>
              <a
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-7 py-3 hover:bg-volt hover:border-volt transition-colors duration-200"
              >
                Browse S&C Classes
              </a>
            </div>
            <img
              src={PERF_IMG}
              alt="APL Training Center at WSC"
              width={1185}
              height={1800}
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
                <div className="text-volt-bright text-[40px] font-light tracking-[-0.03em] leading-none mb-2">
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

      {/* APL Class Listings */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">APL Group Classes</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            Our all-new lineup of<br />S&C classes.
          </h2>
          <p className="text-ink-mid text-[16px] leading-[1.82] mb-14 max-w-[680px]">
            Training sessions benefit athletes of all levels and are tailored to your sport, improving strength, speed, power, agility, and endurance. Browse our APL Group Strength & Conditioning classes for kids and adults.
          </p>

          <div ref={classesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
            {[
              {
                name: "APL Intro to Fitness",
                who: "Youth",
                desc: "Foundation-level class introducing young athletes to proper movement patterns, body awareness, and basic strength training in a supportive environment.",
                times: ["Wednesdays: 5:30-6:00 PM"],
              },
              {
                name: "APL Build",
                who: "Youth",
                desc: "Progressive strength and conditioning class focused on building athletic foundations — core stability, coordination, and functional movement.",
                times: ["Mon-Thu: 6:30-7:00 PM"],
              },
              {
                name: "APL Ignite",
                who: "Youth",
                desc: "High-intensity training for developing athletes. Emphasis on explosive power, speed development, and sport-specific conditioning.",
                times: ["Mon-Thu: 6:00-6:30 PM"],
              },
              {
                name: "APL Push, Pull & Upper Body",
                who: "Youth / Adult",
                desc: "Targeted upper body strength session covering pressing, pulling, and shoulder stability exercises for balanced athletic development.",
                times: ["Tue & Thu: 5:00-6:00 PM", "Tue & Thu: 7:00-8:00 PM"],
              },
              {
                name: "APL Lower Body Strength & Power",
                who: "Youth / Adult",
                desc: "Focused lower body training — squats, deadlifts, plyometrics, and single-leg work to build leg strength, power, and injury resilience.",
                times: ["Mon & Wed: 5:00-6:00 PM", "Mon & Wed: 7:00-8:00 PM"],
              },
              {
                name: "APL Speed School",
                who: "Ages 12–18",
                desc: "Sprint mechanics, acceleration drills, agility ladder work, and change-of-direction training for competitive young athletes.",
                times: ["Saturdays: 10:30-11:30 AM"],
              },
              {
                name: "Adult Athletic Performance",
                who: "Adults",
                desc: "Structured strength and conditioning for adults. Improve functional fitness, build lean muscle, and enhance overall athletic performance.",
                times: ["Tuesdays: 6:30-7:30 PM", "Thursdays: 6:30-7:30 PM"],
              },
            ].map((c, i) => (
              <div
                key={i}
                className={`bg-parchment-mid p-8 border-t-2 border-transparent hover:border-volt transition-all duration-700 ease-out ${classesVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-3">{c.who}</p>
                <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">{c.name}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72] mb-5">{c.desc}</p>
                <div className="space-y-1.5 pt-4 border-t border-wsc-border">
                  {c.times.map((time) => (
                    <p key={time} className="text-ink text-[12px] leading-[1.6]">{time}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={COURT_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Browse & Register
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

          <div ref={packagesRef} className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
            {[
              { name: "4 Classes/Month", desc: "One session per week. Ideal for supplementing sport-specific training with structured S&C work." },
              { name: "8 Classes/Month", desc: "Two sessions per week. The standard for consistent athletic development and measurable progress." },
              { name: "Unlimited", desc: "Full access to all group S&C classes. For the dedicated athlete committed to peak performance." },
            ].map((c, i) => (
              <div
                key={i}
                className={`bg-parchment p-8 border-t-2 border-transparent hover:border-volt transition-all duration-700 ease-out ${packagesVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-3">{c.name}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72] mb-5">{c.desc}</p>
                <a
                  href={COURT_RESERVE_URL}
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

      {/* Personal & Team Training */}
      <section className="bg-dark-bg px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.35fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-6">Personal Training</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light leading-[1.1] tracking-[-0.02em] mb-6">
              Performance-based training for youth and adults.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.8] max-w-[520px]">
              The Athletic Performance Lab offers one-on-one training for competitive athletes and anyone who wants to move, feel, and perform better. Sessions are built around assessment, data-driven metrics, and measurable progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            <div className="bg-dark-mid p-8 lg:p-10">
              <p className="text-volt-bright text-[10px] tracking-[0.2em] uppercase mb-3">Youth & Adult Athletes</p>
              <h3 className="text-parchment text-[20px] font-light tracking-[-0.01em] mb-4">Sport-specific personal training</h3>
              <p className="text-parchment/80 text-[14px] leading-[1.72] mb-6">
                Build speed, power, endurance, confidence, and injury resilience through programming tailored to your sport and goals.
              </p>
              <a
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt-bright pb-[3px]"
              >
                Request Training
              </a>
            </div>
            <div className="bg-dark-mid p-8 lg:p-10">
              <p className="text-volt-bright text-[10px] tracking-[0.2em] uppercase mb-3">Team Training</p>
              <h3 className="text-parchment text-[20px] font-light tracking-[-0.01em] mb-4">Youth club and school teams</h3>
              <p className="text-parchment/80 text-[14px] leading-[1.72] mb-6">
                WSC's Performance Training Team is available for sport and conditioning sessions for youth athletic clubs and school athletic departments.
              </p>
              <a
                href="mailto:dgraham@woodinvillesportsclub.com"
                className="text-parchment text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt-bright pb-[3px]"
              >
                Email Don Graham
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Complimentary Fitness Assessment */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.4fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Free Fitness Assessment</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              Expert guidance for WSC gym members.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Get expert insight into your current routine, performance goals, and next steps with a complimentary 30-45 minute assessment from a certified WSC trainer.
            </p>
            <a
              href={COURT_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Book Your Assessment
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {[
              {
                q: "What is included?",
                a: "A trainer will evaluate your current approach, discuss goals, identify opportunities for improvement, and provide personalized recommendations.",
              },
              {
                q: "Is it really complimentary?",
                a: "Yes. The assessment is included for WSC gym members with no obligation or long-term commitment required.",
              },
              {
                q: "Do I need gym experience?",
                a: "No. The session is designed for all fitness levels, from first-time gym users to experienced athletes.",
              },
              {
                q: "What happens after?",
                a: "You will receive guidance based on your goals. If useful, the coaching team may recommend personal training or coaching options.",
              },
            ].map((item) => (
              <article key={item.q} className="bg-parchment-mid p-8">
                <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">{item.q}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Amenities</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-14">
            Everything you need,<br />all under one roof.
          </h2>
          <div ref={amenitiesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
            {[
              { title: "Sauna", desc: "Unwind after your workout in our dry sauna. Available to all members with gym access during regular facility hours." },
              { title: "Locker Rooms", desc: "Clean, well-maintained locker rooms with showers, changing areas, and secure storage for your belongings." },
              { title: "Stretching Area", desc: "A dedicated stretching and recovery zone with foam rollers, yoga mats, and resistance bands." },
              { title: "Pro Shop", desc: "Pick up essentials — grips, strings, balls, apparel, and accessories — conveniently located on campus." },
              { title: "Free Parking", desc: "Ample free parking right at the facility. No meters, no garages — just pull up and train." },
              { title: "Wi-Fi", desc: "Complimentary high-speed Wi-Fi throughout the facility so you can stream music, track workouts, or stay connected." },
            ].map((a, i) => (
              <div
                key={i}
                className={`bg-parchment-mid p-8 border-t-2 border-transparent hover:border-volt transition-all duration-700 ease-out ${amenitiesVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-3">{a.title}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={hoursRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${hoursVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Gym Hours</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
                Open early.<br />Close late.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82] max-w-[420px]">
                The WSC Gym operates on extended hours to fit your schedule. Whether you're an early riser or prefer evening sessions, we've got you covered.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { day: "Monday – Friday", hours: "6:00 AM – 10:00 PM" },
                { day: "Saturday – Sunday", hours: "7:00 AM – 10:00 PM" },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-ink/10">
                  <span className="text-[15px] font-light">{h.day}</span>
                  <span className="text-ink-mid text-[15px]">{h.hours}</span>
                </div>
              ))}
              <p className="text-ink-mid/85 text-[13px] leading-[1.7] pt-4">
                Hours may vary on holidays. Please check the front desk or CourtReserve for holiday schedules. Gym access requires an active membership with gym privileges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={ctaRef}
          className={`max-w-[1440px] mx-auto text-center transition-all duration-700 ease-out ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Get Started</p>
          <h2 className="text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Ready to train at WSC?
          </h2>
          <p className="text-ink-mid text-[15px] leading-[1.75] max-w-[520px] mx-auto mb-8">
            All-Access memberships include full gym, APL Training Center, sauna, and locker room access. Join the WSC community today.
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
