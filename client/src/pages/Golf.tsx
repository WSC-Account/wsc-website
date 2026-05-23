/*
 * 4B Design — Golf Page
 * Real content from WSC website crawl
 * Tier 1 Sports branding
 * Scroll reveal animations for consistent UX
 */
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import Tier1Banner from "@/components/Tier1Banner";
import FullWidthImage from "@/components/FullWidthImage";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import { useFormProtection } from "@/hooks/useFormProtection";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";
import { submitWebsiteForm } from "@/lib/forms";

const GOLF_IMG = "/images/wsc/golf-practice-area.webp";
const GOLF_SUNSET = "/images/wsc/campus-sunset.webp";
const SIM_BAY_IMG = "/images/wsc/swing-lab-simulators.webp";
const SIM_SCREEN_IMG = "/images/wsc/swing-lab-simulators.webp";
const SIM_LOUNGE_IMG = "/images/wsc/swing-lab-simulators.webp";

const SKILL_LEVELS = [
  "Beginner — Never played or just starting",
  "Novice — Played a few times, learning basics",
  "Intermediate — Comfortable on the course, working on consistency",
  "Advanced — Low handicap, competitive play",
  "Junior — Youth player (under 18)",
];

const GOLF_TRAINING_GROUNDS = [
  {
    name: "Putting Grounds",
    desc: "Dedicated putting surfaces for pace control, start-line work, and pre-round warmups.",
  },
  {
    name: "Chipping Area",
    desc: "Open short-game space for touch shots, trajectories, wedges, and recovery practice.",
  },
  {
    name: "Driving Range",
    desc: "23 covered bays with Toptracer, plus grass tees when seasonal conditions allow.",
  },
  {
    name: "Turf Putting Green",
    desc: "A durable all-weather turf green for repeatable reps and focused practice sessions.",
  },
];

function PrivateLessonForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skillLevel: "",
    experience: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { honeypotProps, validateSubmission } = useFormProtection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateSubmission();
    if (!check.valid) {
      if (check.reason === "honeypot" || check.reason === "too_fast") {
        toast.success("Lesson request submitted! Our golf staff will contact you within 1–2 business days.");
        setForm({ name: "", email: "", phone: "", skillLevel: "", experience: "" });
        return;
      }
      if (check.reason === "rate_limited") {
        toast.error("Please wait a moment before submitting another request.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await submitWebsiteForm({
        formType: "golf_lesson",
        source: "/golf",
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Golf lesson request from ${form.name}`,
        message: form.experience || "No additional goals provided.",
        metadata: {
          skillLevel: form.skillLevel,
        },
      });

      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", skillLevel: "", experience: "" });
      toast.success("Lesson request submitted! Our golf staff will contact you within 1-2 business days.");
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      toast.error("We could not send your lesson request right now. Please try again or email info@woodinvillesportsclub.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-dark-bg border border-parchment/15 px-4 py-3 text-[14px] text-parchment placeholder:text-parchment/75 focus:border-volt-bright focus:outline-none transition-colors duration-200";
  const labelClass = "block text-parchment/70 text-[11px] tracking-[0.14em] uppercase mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="lesson-name" className={labelClass}>Full Name *</label>
        <input
          id="lesson-name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your full name"
          className={inputClass}
          required
          autoComplete="name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="lesson-email" className={labelClass}>Email *</label>
          <input
            id="lesson-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@email.com"
            className={inputClass}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="lesson-phone" className={labelClass}>Phone</label>
          <input
            id="lesson-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(425) 555-0100"
            className={inputClass}
            autoComplete="tel"
          />
        </div>
      </div>

      <div>
        <label htmlFor="lesson-skill" className={labelClass}>Skill Level *</label>
        <select
          id="lesson-skill"
          value={form.skillLevel}
          onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}
          className={`${inputClass} appearance-none cursor-pointer ${!form.skillLevel ? "text-parchment/75" : ""}`}
          required
        >
          <option value="" disabled>Select your skill level</option>
          {SKILL_LEVELS.map((level) => (
            <option key={level} value={level} className="text-parchment bg-dark-bg">
              {level}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="lesson-experience" className={labelClass}>Tell Us About Your Goals</label>
        <textarea
          id="lesson-experience"
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
          rows={4}
          placeholder="What are you hoping to improve? Any prior experience, upcoming events, or specific goals?"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Honeypot — invisible to humans, bots fill it */}
      <input {...honeypotProps} />
      <button
        type="submit"
        disabled={isSubmitting || submitted}
        className={`text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 transition-colors duration-200 ${
          isSubmitting || submitted
            ? "bg-parchment/20 text-parchment/70 cursor-default"
            : "bg-volt-bright text-dark-bg hover:bg-parchment hover:text-dark-bg"
        }`}
      >
        {isSubmitting ? "Sending..." : submitted ? "Request Submitted" : "Submit Lesson Request"}
      </button>

      <p className="text-parchment/75 text-[12px] leading-[1.6]">
        Our golf staff will review your request and reach out within 1–2 business days to schedule your lesson.
      </p>
    </form>
  );
}

export default function Golf() {
  // Scroll-reveal hooks
  const { ref: rangeRef, isVisible: rangeVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: swingLabRef, isVisible: swingLabVisible } = useScrollReveal({ threshold: 0.08 });
  const { containerRef: simGalleryRef, visibleItems: simGalleryVisible } = useStaggerReveal(3, { staggerDelay: 140, threshold: 0.1 });
  const { ref: academyRef, isVisible: academyVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: pricingRef, isVisible: pricingVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: whyRef, isVisible: whyVisible } = useScrollReveal({ threshold: 0.1 });
  const { containerRef: coachesRef, visibleItems: coachesVisible } = useStaggerReveal(2, { staggerDelay: 160, threshold: 0.1 });
  const { ref: accessRef, isVisible: accessVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: formRef, isVisible: formVisible } = useScrollReveal({ threshold: 0.08 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.golf} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Golf", url: "https://www.woodinvillesportsclub.com/golf" },
      ])]} />
      <PageHero
        eyebrow="WSC Golf Training Grounds"
        headline="The PNW's Golf Training Grounds."
        subtitle="Practice all day on expansive golf grounds built for real improvement: putting grounds, chipping area, 23-bay driving range, turf putting green, grass tees, and Swing Lab simulators."
        image={GOLF_IMG}
      />

      {/* Golf Training Grounds */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={rangeRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${rangeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">WSC Golf Training Grounds</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              Expansive golf grounds<br />for all-day practice.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              WSC is the golf training grounds of the Pacific Northwest: a large, open practice environment where golfers can work through the full game instead of just hitting a quick bucket. Come for the range, stay for putting, chipping, turf green reps, and focused short-game work.
            </p>
            <p className="text-ink-mid text-[14px] leading-[1.72] mb-6">
              The driving range is open to the public, and the grounds include 23 covered driving bays with free Toptracer, seasonal grass tees, putting grounds, a chipping area, turf putting green, and a 2.5-acre short-game training area.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { val: "Public", label: "Range Access" },
                { val: "2.5", label: "Acre Short Game" },
                { val: "23", label: "Covered Bays" },
              ].map((m, i) => (
                <div key={i} className="py-4 border-t border-wsc-border">
                  <div className="text-volt-bright text-[28px] font-light tracking-[-0.02em] leading-none mb-1">
                    {m.val}
                  </div>
                  <div className="text-ink-light text-[11px] tracking-[0.14em] uppercase">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          <img
            src={GOLF_IMG}
            alt="Covered golf driving range at Woodinville Sports Club"
            width={1800}
            height={1200}
            loading="lazy"
            className="w-full aspect-[4/3] object-cover saturate-[0.55] brightness-[0.85]"
          />
        </div>

        <div className="max-w-[1440px] mx-auto mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[3px]">
          {GOLF_TRAINING_GROUNDS.map((ground) => (
            <article key={ground.name} className="bg-parchment-mid p-7 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
              <h3 className="text-[20px] font-light tracking-[-0.01em] mb-3">{ground.name}</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72]">{ground.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Swing Lab */}
      <section className="bg-dark-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={swingLabRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${swingLabVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-6">Now Open</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light leading-[1.1] tracking-[-0.02em] mb-6">
              Swing Lab<br />Golf Simulators.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.8] max-w-[420px] mb-6">
              Four professional-grade Uneekor simulators with GSPRO software. 24 data points captured in real time, providing feedback on every aspect of your swing and ball flight. Over 2,000 high-quality, user-created courses.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "Members can reserve simulators in CourtReserve",
                "Used for indoor private lessons and Tier 1 Golf Academy classes",
                "Compete in stroke, scramble, stableford, match play, best ball, or alt shot",
                "Tables, seating and TVs",
                "Coming soon: Tournaments through Simulator Golf Tour (SGT)",
              ].map((item, i) => (
                <li key={i} className="text-parchment/80 text-[13px] leading-[1.72] flex items-start gap-2">
                  <span className="text-volt-bright text-[10px] mt-1">—</span> {item}
                </li>
              ))}
            </ul>
            <a
              href="https://app.courtreserve.com/Online/Portal/Index/6689"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-7 py-3 hover:bg-volt hover:border-volt transition-colors duration-200"
            >
              Book a Simulator
            </a>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-6 mb-10">
              {[
                { val: "4", label: "Simulators" },
                { val: "24", label: "Data Points" },
                { val: "2,000+", label: "Courses" },
                { val: "Uneekor", label: "Technology" },
              ].map((m, i) => (
                <div key={i} className="py-6 border-t border-parchment/[0.1]">
                  <div className="text-volt-bright text-[32px] font-light tracking-[-0.02em] leading-none mb-2">
                    {m.val}
                  </div>
                  <div className="text-parchment/70 text-[11px] tracking-[0.14em] uppercase leading-[1.5]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-dark-bg p-6 border-l-2 border-volt-bright">
              <p className="text-volt-bright text-[11px] tracking-[0.18em] uppercase mb-2">Trial Access</p>
              <p className="text-parchment/80 text-[14px] leading-[1.72]">
                Trial golf simulator access is available for $20 + tax. Trial members can book simulator sessions at regular rates with a 7-day booking window and may upgrade at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Simulator photo gallery */}
        <div ref={simGalleryRef} className="max-w-[1440px] mx-auto mt-14 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { src: SIM_BAY_IMG, alt: "Golfer using Uneekor simulator with swing data overlay", caption: "Uneekor launch monitors capture 24 data points per swing" },
            { src: SIM_SCREEN_IMG, alt: "Simulator screen with virtual course and analytics", caption: "2,000+ photorealistic courses with real-time feedback" },
            { src: SIM_LOUNGE_IMG, alt: "Multiple simulator bays in the Swing Lab lounge", caption: "Four professional-grade bays with lounge seating" },
          ].map((img, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden transition-all duration-700 ease-out ${simGalleryVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                width={1800}
                height={1350}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white text-[12px] tracking-[0.04em] px-5 pb-5">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tier 1 Golf Academy */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={academyRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${academyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Tier 1 Golf Academy</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            Registration is open.
          </h2>
          <p className="text-ink-mid text-[16px] leading-[1.82] mb-14 max-w-[680px]">
            Classes for youth and adults of all levels, from first swing to elite golfers. Led by WGTF Master Certified Coach, Daniel Jarvie. Outdoor instruction on the range; indoor instruction in WSC's new Swing Lab indoor golf simulators.
          </p>

          <div className="space-y-0">
            {[
              {
                tag: "Youth",
                name: "Junior Academy",
                desc: "After-school academy for ages 7–18, including Foundations for ages 7–9. Includes indoor training in Swing Lab simulators.",
              },
              {
                tag: "Adults",
                name: "Adult Clinics",
                desc: "Golf clinics for men and women. Private lessons for adults. Range and simulator-based instruction.",
              },
              {
                tag: "Director",
                name: "Led by Daniel Jarvie",
                desc: "WGTF Master Certified Coach and Director of Golf. Expert instruction combining range work with simulator technology. Full-time youth academy launching later in 2026.",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-4 lg:gap-12 items-baseline py-8 border-b border-wsc-border"
              >
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase">{p.tag}</p>
                <div>
                  <h3 className="text-[20px] font-light tracking-[-0.01em] mb-2">{p.name}</h3>
                  <p className="text-ink-mid text-[14px] leading-[1.72]">{p.desc}</p>
                </div>
                <a
                  href="https://app.courtreserve.com/Online/Portal/Index/6689"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
                >
                  Register
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Range Pricing */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={pricingRef}
          className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${pricingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Range Pricing</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-14">
            Open to the public.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px] mb-8">
            {[
              { name: "Small Bucket", detail: "~45 balls", price: "$10 + tax" },
              { name: "Medium Bucket", detail: "~75 balls", price: "$12 + tax" },
              { name: "Large Bucket", detail: "~100 balls", price: "$14 + tax" },
            ].map((p, i) => (
              <div key={i} className="bg-parchment-mid p-8 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-1">{p.name}</h3>
                <p className="text-ink-light text-[13px] mb-3">{p.detail}</p>
                <p className="text-volt-bright text-[24px] font-light mb-4">{p.price}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            <div className="bg-parchment-mid p-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Punch Card Discounts</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">10% discount when you buy punch cards.</p>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-wsc-border">
                  <span className="text-ink-mid text-[14px]">10 Medium Buckets</span>
                  <span className="text-volt-bright text-[16px] font-light">$108 + tax</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-ink-mid text-[14px]">10 Large Buckets</span>
                  <span className="text-volt-bright text-[16px] font-light">$126 + tax</span>
                </div>
              </div>
            </div>
            <div className="bg-parchment-mid p-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Mini-Golf</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">18-hole mini-golf course on the property.</p>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-wsc-border">
                  <span className="text-ink-mid text-[14px]">Kids (under 12)</span>
                  <span className="text-volt-bright text-[16px] font-light">$8 + tax</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-ink-mid text-[14px]">Adults</span>
                  <span className="text-volt-bright text-[16px] font-light">$10 + tax</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width visual break */}
      <FullWidthImage
        src={GOLF_SUNSET}
        alt="WSC driving range at golden hour"
        caption="Driving range open to the public, plus putting grounds, chipping area, and turf putting green."
        subcaption="Golf Training Grounds"
        height="medium"
      />

      {/* Why WSC Golf */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={whyRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${whyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Why WSC Golf</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
              Built for real<br />practice days.
            </h2>
          </div>
          <div>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
              WSC Golf Training Grounds gives players room to practice the way golf actually works: full swings, wedges, chips, putting speed, and repeatable reps across a large outdoor campus. It is a golf training destination in Woodinville for anyone who wants to settle in and work on their game.
            </p>
            <p className="text-ink-mid text-[16px] leading-[1.82]">
              Swing Lab indoor simulators, Tier 1 Golf Academy, and private instruction add coaching and technology to the grounds, making WSC a complete training home for beginners, juniors, adults, and competitive players throughout the Pacific Northwest.
            </p>
          </div>
        </div>
      </section>

      {/* Coaching Staff */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-14">
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Our Coaches</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
              Expert instruction<br />at every level.
            </h2>
          </div>

          <div ref={coachesRef} className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {[
              {
                name: "Daniel Jarvie",
                title: "Director of Golf & Tier 1 Golf Academy",
                credential: "WGTF Master Certified Coach",
                philosophy: "Former Seattle Junior Champion and Division I player at University of Washington. 30+ years of professional teaching, coaching, and playing experience. Former Director of Instruction and College Coach who taught golf schools for legendary PGA Tour coach Jimmy Ballard.",
              },
              {
                name: "Stella Kim",
                title: "WSC Golf Instructor",
                credential: "LPGA-Certified Teaching Professional, TPI Level 1 & 2",
                philosophy: "Nearly two decades of experience with a supportive, detail-oriented teaching style. Graduate of Professional Golf Career College (2014). Taught in Southern California, New York, and Korea before joining WSC in Seattle.",
              },
            ].map((coach, i) => (
              <div
                key={i}
                className={`bg-parchment-mid p-8 lg:p-10 transition-all duration-700 ease-out ${coachesVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <div className="w-16 h-16 rounded-full bg-dark-bg/10 flex items-center justify-center mb-6">
                  <span className="text-volt text-[20px] font-light">{coach.name.charAt(0)}</span>
                </div>
                <h3 className="text-[18px] font-light tracking-[-0.01em] mb-1">{coach.name}</h3>
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-1.5">{coach.title}</p>
                <p className="text-ink-mid text-[11px] tracking-[0.08em] uppercase mb-5">{coach.credential}</p>
                <p className="text-ink-mid text-[14px] leading-[1.72] italic">"{coach.philosophy}"</p>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* Private Lesson Interest Form */}
      <section className="bg-dark-mid px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={formRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 transition-all duration-700 ease-out ${formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Info side */}
          <div>
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Private Lessons</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.1] mb-6">
              Request a<br />private lesson.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.8] mb-8 max-w-[420px]">
              Interested in one-on-one instruction? Fill out the form and our golf staff will reach out to match you with the right coach for your goals and skill level.
            </p>
            <div className="space-y-5">
              {[
                { label: "Personalized Instruction", desc: "Tailored to your swing, goals, and schedule" },
                { label: "Range & Simulator", desc: "Lessons on the range or in our Swing Lab bays" },
                { label: "All Skill Levels", desc: "From first-time golfers to competitive players" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-volt-bright text-[10px] mt-1.5">—</span>
                  <div>
                    <p className="text-parchment text-[14px] font-medium mb-0.5">{item.label}</p>
                    <p className="text-parchment/70 text-[13px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form side */}
          <PrivateLessonForm />
        </div>
      </section>

      {/* Court & Range Access Pass Benefits */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div
          ref={accessRef}
          className={`max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${accessVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Member Benefits</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
              Court & Range<br />Access Pass.            </h2>
          </div>
          <div>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
              Our $120/year Court & Range Access Pass unlocks exclusive golf benefits alongside court booking privileges. Save on range sessions and enjoy perks across the campus.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { benefit: "7-Day Advance Booking", detail: "Reserve golf simulators up to 7 days in advance" },
                { benefit: "$4 Off Range Buckets", detail: "Discount on every bucket purchase at the driving range" },
                { benefit: "Mini-Golf Discounts", detail: "Reduced rates on our 18-hole mini-golf course" },
                { benefit: "Beverage Discounts", detail: "Discounts on all beverages at the range" },
                { benefit: "Golf Happy Hour", detail: "Access to exclusive golf happy hour sessions" },
              ].map((b, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-wsc-border">
                  <span className="text-ink text-[14px]">{b.benefit}</span>
                  <span className="text-ink-mid text-[14px] text-right max-w-[280px]">{b.detail}</span>
                </div>
              ))}
            </div>
            <Link
              href="/membership"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              View All Membership Options
            </Link>
          </div>
        </div>
      </section>

      {/* Tier 1 compact banner */}
      <Tier1Banner variant="compact" />

      {/* CTA */}
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div
          ref={ctaRef}
          className={`max-w-[1440px] mx-auto text-center transition-all duration-700 ease-out ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Get Started</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Train all day at WSC.
          </h2>
          <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[480px] mx-auto mb-8">
            Visit the Golf Training Grounds for range work, putting, chipping, turf green reps, Swing Lab simulators, and Tier 1 Golf Academy.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href="/membership"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
            >
              View Membership
            </Link>
            <a
              href="https://app.courtreserve.com/Online/Portal/Index/6689"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
            >
              Private Lesson Inquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
