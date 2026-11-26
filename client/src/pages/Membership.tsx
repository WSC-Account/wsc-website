/*
 * 4B Design — Membership Page
 * Real content from WSC website crawl
 */
import { useState } from "react";
import { Link } from "wouter";
import UtilityPageHeader from "@/components/UtilityPageHeader";
import StructuredData, {
  getBreadcrumbSchema,
  getServiceSchema,
} from "@/components/StructuredData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";
import { COURT_RESERVE_PORTAL_URL } from "@/lib/booking-links";
import { membershipPasses } from "@/lib/membership-passes";

const HERO_IMG = "/images/wsc/campus-dome.webp";

const FAQ_ITEMS = [
  {
    category: "Pricing & Plans",
    items: [
      {
        q: "What membership options are available?",
        a: "Choose an annual pass for class registration or court booking. Monthly All-Access passes also include the gym and come in individual, couple and family options.",
      },
      {
        q: "Is there a discount for families?",
        a: "Yes. The Family All-Access Pass covers all household members (two adults plus kids 17 and under) for $100/month + tax. The pass includes the gym and lets the family book courts and register for classes. Class and court fees apply separately.",
      },
      {
        q: "What does the Court & Range Access Pass include?",
        a: "For $120/year + tax, you get court booking privileges, 7-day advance golf simulator reservations, $4 off range buckets, mini-golf discounts, beverage discounts, and access to golf happy hour sessions. Class and court fees still apply.",
      },
      {
        q: "Are there any hidden fees?",
        a: "All listed prices are subject to applicable sales tax. Court booking and class registration fees apply separately based on the activity. All memberships auto-renew until cancelled under the applicable cancellation policy.",
      },
    ],
  },
  {
    category: "Booking & Access",
    items: [
      {
        q: "How do I book courts and simulators?",
        a: "All bookings are made through CourtReserve, our online reservation platform. You can book tennis courts, pickleball courts, and golf simulators. Court & Range Access Pass holders can book simulators up to 7 days in advance; All-Access members get a 10-day simulator booking window.",
      },
      {
        q: "Do I need a membership to use the driving range?",
        a: "The range is open to the public. Buy a bucket at the range. Court & Range and All-Access pass holders save $4 per bucket.",
      },
      {
        q: "Can I bring guests to the facility?",
        a: "Yes. Guest policies vary by membership tier and activity. All-Access members can bring guests to the gym and fitness areas. Check with the front desk for current guest policies.",
      },
      {
        q: "What are the facility hours?",
        a: "Tennis and Gym hours are weekdays from 6:00 AM to 11:00 PM and weekends from 7:00 AM to 10:00 PM. Golf hours are everyday from 9:00 AM to 10:00 PM. Pickleball open play runs 7 days a week \u2014 check the schedule for specific session times. Holiday hours may vary.",
      },
    ],
  },
  {
    category: "Cancellations & Changes",
    items: [
      {
        q: "How do I cancel my membership?",
        a: "Use the membership cancellation form to send your request. The membership agreement lists cancel@woodinvillesportsclub.com for written notice. The team will review your account and confirm the effective date.",
        href: "/member-request",
        linkLabel: "Open the membership cancellation form",
      },
      {
        q: "Can I upgrade or downgrade my membership?",
        a: "Yes. You can upgrade your membership at any time \u2014 the difference will be prorated. Downgrades take effect at the start of your next billing cycle. Contact the front desk to make changes.",
      },
      {
        q: "What is the cancellation policy for court bookings?",
        a: "For a court reservation, give at least 24 hours of notice to receive a balance credit. Late cancellations and missed reservations are charged the court fee.",
      },
      {
        q: "Can I freeze my membership temporarily?",
        a: "Contact the front desk to request a freeze. The membership policies explain medical and senior eligibility, documentation, fees and time limits.",
        href: "/policies/membership-policies-expanded",
        linkLabel: "Review freeze terms",
      },
    ],
  },
];

function FAQSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenItems(prev => {
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
          <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15]">
            Membership questions
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {FAQ_ITEMS.map(cat => (
            <div key={cat.category}>
              <p className="text-accent-on-light text-[12px] tracking-[0.2em] uppercase mb-6">
                {cat.category}
              </p>
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
                        <span className="text-ink text-[14px] leading-[1.55] font-normal group-hover:text-accent-on-light transition-colors duration-200">
                          {item.q}
                        </span>
                        <svg
                          className={`shrink-0 w-4 h-4 mt-1 text-ink-light transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <div
                        id={answerId}
                        role="region"
                        aria-labelledby={questionId}
                        aria-hidden={!isOpen}
                        inert={!isOpen}
                        className={`overflow-hidden transition-all duration-300 ease-out ${
                          isOpen
                            ? "max-h-[400px] opacity-100 pb-4"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-ink-mid text-[13px] leading-[1.72] pr-6">
                          {item.a}
                        </p>
                        {"href" in item && item.href ? (
                          <Link
                            href={item.href}
                            className="inline-block mt-3 text-ink text-[12px] tracking-[0.1em] uppercase no-underline border-b border-volt pb-[3px]"
                          >
                            {item.linkLabel}
                          </Link>
                        ) : null}
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
      <StructuredData
        schemas={[
          getBreadcrumbSchema([
            { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
            {
              name: "Membership",
              url: "https://www.woodinvillesportsclub.com/membership",
            },
          ]),
          getServiceSchema({
            name: "Woodinville Sports Club Memberships",
            description: SEO.membership.description,
            url: "https://www.woodinvillesportsclub.com/membership",
            serviceType: "Sports club membership and facility access",
            image: HERO_IMG,
            audience: "Individuals, couples, and families",
          }),
        ]}
      />
      <UtilityPageHeader
        eyebrow="Membership"
        headline="Compare membership passes."
        subtitle="Choose a pass for classes, court reservations or gym access. Visiting the driving range? You can buy a bucket without a pass."
      />

      <section id="membership-options" className="bg-parchment px-6 lg:px-14 py-12 lg:py-16 scroll-mt-[var(--site-header-height,130px)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-6">
            <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15]">
              What would you like to do?
            </h2>
            <p className="mt-3 max-w-[660px] text-ink-mid text-[16px] leading-relaxed">
              Prices below are before tax. Class fees are separate. If your pass includes court booking, you also pay for the court time you reserve.
            </p>
            <nav aria-label="Jump to a membership option" className="mt-4 flex flex-col items-start lg:hidden">
              {membershipPasses.map(pass => (
                <a
                  key={pass.id}
                  href={`#${pass.id}`}
                  className="inline-flex min-h-11 items-center text-[15px] font-medium text-ink underline decoration-volt underline-offset-4"
                >
                  {pass.purpose}
                </a>
              ))}
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {membershipPasses.map(pass => (
              <article id={pass.id} key={pass.id} tabIndex={-1} className="scroll-mt-[var(--site-header-height,130px)] bg-parchment-mid border-t-2 border-wsc-border p-6 lg:p-8">
                <p className="text-accent-on-light text-[14px] font-semibold mb-2">{pass.purpose}</p>
                <h3 className="text-[24px] font-light leading-tight tracking-[-0.02em]">{pass.name}</h3>
                <dl className="mt-5 divide-y divide-wsc-border border-y border-wsc-border">
                  {pass.rates.map(rate => (
                    <div key={rate.label} className="py-3 grid grid-cols-[1fr_auto] items-baseline gap-x-3">
                      <dt className="text-[16px] font-medium">{rate.label}<span className="block mt-1 text-ink-mid text-[14px] font-normal">{rate.eligibility}</span></dt>
                      <dd className="text-right whitespace-nowrap"><span className="text-[23px] font-medium">{rate.price}</span><span className="text-ink-mid text-[14px]"> / {rate.period}</span></dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-5 space-y-2 list-disc pl-5 marker:text-accent-on-light">
                  {pass.features.map(feature => (
                    <li key={feature} className="text-ink-mid text-[15px] leading-relaxed">{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={COURT_RESERVE_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center bg-dark-bg px-6 py-3 text-[15px] font-medium text-parchment no-underline hover:bg-ink-mid">
              Choose a pass in CourtReserve
            </a>
            <p className="text-ink-mid text-[14px]">All passes renew automatically each month or year until cancelled.</p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
          <div className="bg-parchment p-8">
            <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">
              Membership Agreement
            </h3>
            <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
              Review the full membership agreement including terms, conditions,
              and cancellation policies.
            </p>
            <Link
              href="/policies#membership"
              className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
            >
              View Agreement
            </Link>
          </div>
          <div className="bg-parchment p-8">
            <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">
              Membership Policies
            </h3>
            <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
              Find guest, account freeze and facility rules.
            </p>
            <Link
              href="/policies/membership-policies-expanded"
              className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
            >
              View Policies
            </Link>
            <p className="mt-4 text-[13px] text-ink-mid">WSC tax ID is 82-3755991.</p>
          </div>
          <div className="bg-parchment p-8">
            <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">
              Cancellation Request
            </h3>
            <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
              Submit a membership cancellation request so the WSC team can
              review your account and follow up.
            </p>
            <Link
              href="/member-request"
              className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
            >
              Request cancellation
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto text-center">
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Need help choosing a pass?
          </h2>
          <p className="text-parchment/80 text-[16px] leading-relaxed max-w-[480px] mx-auto mb-6">
            Ask the front desk about membership options or a club tour.
          </p>
          <Link href="/contact" className="inline-flex min-h-11 items-center bg-volt-bright text-dark-bg no-underline px-6 py-3 font-medium hover:bg-parchment">
            Contact the front desk
          </Link>
        </div>
      </section>
    </div>
  );
}
