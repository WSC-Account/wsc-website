/*
 * 4B Design — Membership Page
 * Real content from WSC website crawl
 */
import { useState } from "react";
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/campus-dome.webp";

const tiers = [
  {
    type: "Monthly",
    name: "Family All-Access Pass",
    price: "$100",
    period: "/mo + tax",
    who: "All household individuals (two adults max + kids 17 and under)",
    features: [
      "Includes Class Registration Pass privileges",
      "Includes Court & Range Access Pass privileges",
      "Access to Strength & Fitness Facilities, Sauna and Locker Rooms",
      "5% golf sims discount + 10-day booking window",
      "Initiation plus monthly membership fee required",
      "Membership renews automatically each month",
    ],
  },
  {
    type: "Monthly",
    name: "Couple All-Access Pass",
    price: "$70",
    period: "/mo + tax",
    who: "Two household individuals",
    features: [
      "Includes Class Registration Pass privileges",
      "Includes Court & Range Access Pass privileges",
      "Access to Strength & Fitness, Sauna and Locker Rooms",
      "5% golf sims discount + 10-day booking window",
      "Initiation plus monthly membership fee required",
      "Membership renews automatically each month",
    ],
  },
  {
    type: "Monthly",
    name: "Individual All-Access Pass",
    price: "$40",
    period: "/mo + tax",
    who: "One 18+ individual",
    features: [
      "Includes Class Registration Pass privileges",
      "Includes Court & Range Access Pass privileges",
      "Access to Strength & Fitness Facilities, Sauna and Locker Rooms",
      "5% golf sims discount + 10-day booking window",
      "Initiation plus monthly membership fee required",
      "Membership renews automatically each month",
    ],
  },
  {
    type: "Annual",
    name: "Court & Range Access Pass",
    price: "$120",
    period: "/yr + tax",
    who: "Two 18+ individuals + household",
    features: [
      "Enables court booking & class registration",
      "Class & court fees apply",
      "No access to fitness facilities",
      "7-day advance golf simulator booking window",
      "$4 off golf range buckets",
      "Discounts on mini-golf & all beverages",
      "Access to golf happy hour",
      "Membership auto-renews annually",
    ],
  },
  {
    type: "Annual",
    name: "Class Registration Pass",
    price: "$50",
    period: "/yr + tax",
    who: "Two 18+ individuals + household",
    features: [
      "Enables class registration (Tennis, Pickleball, Events, Camps, Fitness Training)",
      "Class fees apply",
      "Does not allow court booking",
      "No access to fitness facilities, sauna, locker rooms, golf sims, or range discounts",
      "Membership auto-renews annually",
    ],
  },
  {
    type: "Trial",
    name: "Trial Golf Simulators",
    price: "$20",
    period: "+ tax (one-time)",
    who: "One 16+ individual",
    features: [
      "For non-members or Class Access members",
      "Test out golf simulators before committing",
      "Book simulator sessions at regular rates with 7-day window",
      "Bring up to 3 guests per session",
      "Trial members may upgrade at any time",
    ],
  },
];

const FAQ_ITEMS = [
  {
    category: "Pricing & Plans",
    items: [
      {
        q: "What membership options are available?",
        a: "We offer six tiers: Family All-Access ($100/mo), Couple All-Access ($70/mo), Individual All-Access ($40/mo), Court & Range Access ($120/yr), Class Registration ($50/yr), and a Trial Golf Simulators pass ($20 one-time). Monthly memberships include a $50 + tax initiation fee.",
      },
      {
        q: "Is there a discount for families?",
        a: "Yes. The Family All-Access Pass covers all household members (two adults plus kids 17 and under) for $100/month + tax. It includes full access to all facilities, classes, court booking, and golf simulator discounts.",
      },
      {
        q: "What does the Court & Range Access Pass include?",
        a: "For $120/year + tax, you get court booking privileges, 7-day advance golf simulator reservations, $4 off range buckets, mini-golf discounts, beverage discounts, and access to golf happy hour sessions. Class and court fees still apply.",
      },
      {
        q: "Are there any hidden fees?",
        a: "Monthly memberships require a one-time $50 + tax initiation fee. Annual passes have no initiation fee. All listed prices are subject to applicable sales tax. Court booking and class registration fees apply separately based on the activity. All memberships auto-renew until cancelled under the applicable cancellation policy.",
      },
      {
        q: "Can I try the golf simulators before committing to a membership?",
        a: "Absolutely. Our Trial Golf Simulators pass is $20 + tax (one-time) and lets you book simulator sessions at regular rates with a 7-day booking window. You can upgrade to a full membership at any time.",
      },
    ],
  },
  {
    category: "Booking & Access",
    items: [
      {
        q: "How do I book courts and simulators?",
        a: "All bookings are made through CourtReserve, our online reservation platform. You can book tennis courts, pickleball courts, and golf simulators. Court & Range Access Pass holders and All-Access members can book up to 7 days in advance for simulators.",
      },
      {
        q: "Do I need a membership to use the driving range?",
        a: "No. The driving range is open to the public — no membership required. Simply purchase a bucket of balls at the range. Membership holders receive $4 off each bucket.",
      },
      {
        q: "Can I bring guests to the facility?",
        a: "Yes. Guest policies vary by membership tier and activity. All-Access members can bring guests to the gym and fitness areas. Golf simulator trial members may bring up to 3 guests per session under the current trial access rules. Check with the front desk for current guest policies.",
      },
      {
        q: "What are the facility hours?",
        a: "Tennis & Gym: Weekdays 6:00 AM \u2013 11:00 PM, Weekends 7:00 AM \u2013 10:00 PM. Golf Range: Everyday 9:00 AM \u2013 10:00 PM. Pickleball open play runs 7 days a week \u2014 check the schedule for specific session times. Holiday hours may vary.",
      },
    ],
  },
  {
    category: "Cancellations & Changes",
    items: [
      {
        q: "How do I cancel my membership?",
        a: "All memberships auto-renew until cancelled under the applicable cancellation policy. Monthly memberships can be cancelled by contacting the front desk or emailing info@woodinvillesportsclub.com. A 30-day written notice is required. Annual passes are non-refundable once purchased but will not auto-renew if cancelled before the renewal date.",
      },
      {
        q: "Can I upgrade or downgrade my membership?",
        a: "Yes. You can upgrade your membership at any time \u2014 the difference will be prorated. Downgrades take effect at the start of your next billing cycle. Contact the front desk to make changes.",
      },
      {
        q: "What is the cancellation policy for court bookings?",
        a: "Court and simulator reservations can be cancelled up to 24 hours in advance without penalty. Late cancellations or no-shows may result in a fee. Repeated no-shows may affect future booking privileges.",
      },
      {
        q: "Can I freeze my membership temporarily?",
        a: "Monthly All-Access memberships may be frozen for up to 2 months per year for medical reasons or extended travel. A freeze request must be submitted in writing to the front desk. Annual passes cannot be frozen.",
      },
    ],
  },
];

function FAQSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
      <div
        ref={ref}
        className={`max-w-[1440px] mx-auto transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="mb-14 pb-8 border-b border-wsc-border">
          <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Frequently Asked Questions</p>
          <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15]">
            Common questions,<br />clear answers.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {FAQ_ITEMS.map((cat) => (
            <div key={cat.category}>
              <p className="text-volt text-[12px] tracking-[0.2em] uppercase mb-6">{cat.category}</p>
              <div className="space-y-0">
                {cat.items.map((item, i) => {
                  const id = `${cat.category}-${i}`;
                  const safeId = id.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  const questionId = `membership-faq-question-${safeId}`;
                  const answerId = `membership-faq-answer-${safeId}`;
                  const isOpen = openItems.has(id);
                  return (
                    <div key={id} className="border-b border-wsc-border">
                      <button
                        type="button"
                        id={questionId}
                        onClick={() => toggle(id)}
                        className="w-full flex items-start justify-between gap-3 py-4 text-left group"
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                      >
                        <span className="text-ink text-[14px] leading-[1.55] font-normal group-hover:text-volt transition-colors duration-200">
                          {item.q}
                        </span>
                        <svg
                          className={`shrink-0 w-4 h-4 mt-1 text-ink-light transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div
                        id={answerId}
                        role="region"
                        aria-labelledby={questionId}
                        aria-hidden={!isOpen}
                        className={`overflow-hidden transition-all duration-300 ease-out ${
                          isOpen ? "max-h-[400px] opacity-100 pb-4" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-ink-mid text-[13px] leading-[1.72] pr-6">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Membership() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.membership} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Membership", url: "https://www.woodinvillesportsclub.com/membership" },
      ])]} />
      <PageHero
        eyebrow="Membership"
        headline="Train Without Limits."
        subtitle="Strength training. Court sports. Golf. Recovery. All under one roof. Choose the membership that fits your goals."
        image={HERO_IMG}
      />

      {/* Tiers */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-14 pb-8 border-b border-wsc-border">
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Membership Options</p>
            <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15]">
              Six tiers. One campus.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
            {tiers.map((t, i) => (
              <div
                key={i}
                className="bg-parchment-mid p-8 lg:p-10 border-t-2 border-transparent hover:border-volt transition-colors duration-300"
              >
                <p className="text-volt text-[12px] tracking-[0.2em] uppercase mb-3">{t.type}</p>
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-1">{t.name}</h3>
                <div className="mb-2">
                  <span className="text-volt-bright text-[28px] font-light">{t.price}</span>
                  <span className="text-ink-light text-[13px] ml-1">{t.period}</span>
                </div>
                <p className="text-ink-mid text-[13px] mb-5">{t.who}</p>
                <ul className="space-y-2 mb-6">
                  {t.features.map((f, fi) => (
                    <li key={fi} className="text-ink-mid text-[13px] leading-[1.6] flex items-start gap-2">
                      <span className="text-volt text-[10px] mt-1">—</span> {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://app.courtreserve.com/Online/Portal/Index/6689"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
                >
                  Sign Up
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-parchment-mid border-l-2 border-volt">
            <p className="text-ink-mid text-[14px] leading-[1.7] mb-2">
              <span className="text-ink font-normal">All Memberships:</span> Auto-renew until cancelled under the applicable cancellation policy.
            </p>
            <p className="text-ink-mid text-[14px] leading-[1.7] mb-2">
              <span className="text-ink font-normal">Annual Passes:</span> Auto-renew each year.
            </p>
            <p className="text-ink-mid text-[14px] leading-[1.7] mb-2">
              <span className="text-ink font-normal">Monthly Memberships:</span> Require a one-time $50 + tax initiation fee.
            </p>
            <p className="text-ink-light text-[13px]">WSC TAX ID# is 82-3755991</p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[3px]">
          <div className="bg-parchment p-8">
            <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Membership Agreement</h3>
            <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
              Review the full membership agreement including terms, conditions, and cancellation policies.
            </p>
            <Link
              href="/policies#membership"
              className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
            >
              View Agreement
            </Link>
          </div>
          <div className="bg-parchment p-8">
            <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Membership Policies</h3>
            <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
              Review our membership policies including guest policies, code of conduct, and facility rules.
            </p>
            <Link
              href="/policies"
              className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
            >
              View Policies
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Get Started</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Ready to join the campus?
          </h2>
          <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[480px] mx-auto mb-8">
            Contact us to learn more about membership options or to schedule a tour of our facilities.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <a
              href="https://app.courtreserve.com/Online/Portal/Index/6689"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
            >
              Sign Up Now
            </a>
            <Link
              href="/about"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
            >
              About WSC
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
