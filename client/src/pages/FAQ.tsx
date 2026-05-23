/*
 * FAQ Page — Common questions extracted from WSC club policies,
 * membership agreement, court booking, and facility rules.
 * Accordion-style Q&A organized by category.
 */
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/campus-dome.webp";

/* ── FAQ Data ────────────────────────────────────────────── */

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQ_CATEGORIES = [
  { id: "membership", label: "Membership" },
  { id: "booking", label: "Court Booking" },
  { id: "cancellation", label: "Cancellations" },
  { id: "classes", label: "Classes & Lessons" },
  { id: "guests", label: "Guests & Access" },
  { id: "facility", label: "Facility & Rules" },
  { id: "fees", label: "Fees & Pricing" },
];

const FAQS: FAQItem[] = [
  // Membership
  {
    category: "membership",
    q: "How do I become a member at WSC?",
    a: "You can sign up for a membership through CourtReserve or by visiting the front desk. A one-time initiation fee of $50 + tax is assessed at the start of membership, including for returning customers previously enrolled with passes or memberships.",
  },
  {
    category: "membership",
    q: "How do I cancel my membership?",
    a: "To cancel, email CANCEL@WOODINVILLESPORTSCLUB.COM. You may cancel and receive a full refund within 3 business days of signing by providing written notice and returning all access cards. If the cancellation date is less than 30 days from the next billing date, you will be billed the full amount of dues per contract terms. Accounts continue to accrue monthly fees until explicitly canceled — WSC will not automatically cancel any membership.",
  },
  {
    category: "membership",
    q: "Can I freeze my membership?",
    a: "Account freezes are only available for medical reasons. Temporary disability allows a freeze of up to 3 months with a written request and physician note. A fee will be assessed during the freeze period, and regular payments and time will be added to the end of the existing term.",
  },
  {
    category: "membership",
    q: "What happens if my payment is late?",
    a: "A default occurs when any payment is more than 10 days late. A late fee will be charged, and an additional service fee may apply for returned checks, drafts, or credit cards. WSC reserves the right to declare the entire remaining balance due and payable, including collection costs, agency fees, court costs, and attorney fees.",
  },
  {
    category: "membership",
    q: "Am I still obligated to pay if I don't use the facilities?",
    a: "Yes. Members who fail to use WSC facilities are not released from the obligation to make all payments required by the membership agreement.",
  },
  {
    category: "membership",
    q: "Is there a liability waiver?",
    a: "Yes. By becoming a member, you voluntarily accept the risk of injury (ranging from minor to catastrophic, including death) and agree that WSC, its officers, directors, employees, volunteers, agents, and independent contractors will not be liable for any injury. You agree to indemnify, defend, and hold WSC harmless against any related claims.",
  },

  // Court Booking
  {
    category: "booking",
    q: "How do I book a court?",
    a: "Courts are booked online through CourtReserve. Reservations open daily at 8:00 AM with a 7-day booking window. You can select a duration of 30, 60, or 90 minutes per session.",
  },
  {
    category: "booking",
    q: "How many courts can I reserve at once?",
    a: "Members are limited to 3 active reservations within any rolling 7-day period. You can only book one court at a time — no side-by-side bookings. The system also prevents bookings that create 30-minute gaps between reservations to eliminate dead time.",
  },
  {
    category: "booking",
    q: "Do I need to check in before playing?",
    a: "Yes. All members and guests must check in at the front desk or via the CourtReserve App before going to court. Failure to check in or provide complete participant information will result in a full court fee. Window drive-up check-in is no longer available — you must enter the building.",
  },
  {
    category: "booking",
    q: "Is recreational court usage available?",
    a: "WSC is primarily a training facility. Court time is prioritized for academy programming through Tier 1 Sports. Recreational and member play is welcome — just check CourtReserve for current availability or call the front desk at (425) 487-1090.",
  },
  {
    category: "booking",
    q: "How do USTA team reservations work?",
    a: "Visiting teams can only reserve warmup courts the day of the match. Home teams can reserve their warmup court up to 7 days in advance by the WSC captain. USTA fees for home and visiting teams are $21 + tax per court and include a can of Babolat balls from the retail shop.",
  },

  // Cancellations
  {
    category: "cancellation",
    q: "What is the court cancellation policy?",
    a: "24-hour notice is required for court cancellation (regardless of illness, injury, or personal circumstance) to receive a balance credit. Members are responsible for all no-show or late-canceled court fees and may not book new courts until outstanding fees are paid. Cancellations may not be used to circumvent booking rules.",
  },
  {
    category: "cancellation",
    q: "What is the class/program cancellation policy?",
    a: "7-day notice is required for cancellation of classes, clinics, and camps (regardless of illness, injury, or personal circumstance) to receive a balance credit. No makeup classes are offered under any circumstances.",
  },
  {
    category: "cancellation",
    q: "What is the private lesson cancellation policy?",
    a: "Private lessons must be canceled at least 24 hours in advance, or you will be charged the full lesson fee regardless of the reason. Credit will only be issued as a balance credit on your WSC account. Contact your coach directly to cancel.",
  },
  {
    category: "cancellation",
    q: "What is the summer camp cancellation policy?",
    a: "Summer camp cancellations require 7-day notice to receive a balance credit. If WSC must cancel a camp or event, all registered participants will be notified as soon as possible via email, phone, or text. Registration is not finalized until payment is received.",
  },
  {
    category: "cancellation",
    q: "Are refunds available for prepaid dues or packages?",
    a: "No. Annual fees, prepaid dues, programming, lessons, and punch cards will not be refunded regardless of illness, injury, or personal circumstance. Funds may be returned as balance credits only when allowed by policy.",
  },

  // Classes & Lessons
  {
    category: "classes",
    q: "Do I need a membership to take classes?",
    a: "Yes. All participants in classes, clinics, and private lessons must have a valid WSC Pass or Membership. This includes participants from both WSC programs and authorized guest coaches.",
  },
  {
    category: "classes",
    q: "How do class packages work?",
    a: "Packages expire 31 days after purchase. Unused classes do not roll over — once the package expires, any remaining unbooked classes are forfeited. If you cancel a class more than 48 hours in advance, the class is returned to your package balance. No refunds are offered on packages once purchased.",
  },
  {
    category: "classes",
    q: "How do I book a private lesson?",
    a: "Schedule directly with WSC teaching staff through CourtReserve. For instructor requests, email info@woodinvillesportsclub.com. Arrive 10–15 minutes before your lesson and check in at the front desk. Private instruction by unauthorized coaches is strictly prohibited.",
  },
  {
    category: "classes",
    q: "What happens if I join a class waitlist?",
    a: "By joining a waitlist, you agree to be automatically added to the class and charged when a spot becomes available, without prior notification. Make sure you're prepared to attend before joining a waitlist.",
  },

  // Guests & Access
  {
    category: "guests",
    q: "Can I bring a guest to WSC?",
    a: "Yes. Members are welcome to bring friends, family, and co-workers. The guest fee for tennis is $10 + tax per guest per court reservation, and for pickleball it's $5 + tax. The member must be present, and payment is required before using the facility. If the guest doesn't pay, the booking member is responsible.",
  },
  {
    category: "guests",
    q: "What happens if I violate the guest policy?",
    a: "At the sole discretion of facility management, the member may be charged a guest fee and/or have their membership suspended or canceled, with the balance declared due and payable in full immediately, and be assessed a penalty of up to $250.00.",
  },
  {
    category: "guests",
    q: "Are there age restrictions for using the facility?",
    a: "Members up to 12 years of age are only permitted under the direct supervision of a parent or legal guardian. Members ages 15–17 are permitted unsupervised with written consent of a parent or guardian. Participation with WSC coaches is allowed for all age ranges. Golf may be used by members 12 and above unsupervised.",
  },
  {
    category: "guests",
    q: "Can someone else use my access card?",
    a: "No. Members may not allow anyone else to use their access card and must alert WSC immediately if it is lost or stolen. All CourtReserve accounts must include current photos of all users associated with the account.",
  },

  // Facility & Rules
  {
    category: "facility",
    q: "What shoes are required on court?",
    a: "Court shoes specifically designed for tennis or pickleball must be worn — no sneakers or running shoes. This is for player safety and to prevent damage to court surfaces. Court shoes provide the extra grip and stability needed for quick lateral movements.",
  },
  {
    category: "facility",
    q: "Can I bring my own ball machine?",
    a: "No. Outside ball machines and ball hoppers are prohibited on WSC courts. Rental baskets of Babolat balls are available for $15 + tax. The Playmate Smash ball machine remains available for rent on courts #7 and #8.",
  },
  {
    category: "facility",
    q: "Is there a dress code?",
    a: "Yes. Members must abide by the WSC dress code at all times. A shirt or top must be worn at all times, and proper footwear for the environment being used is required.",
  },
  {
    category: "facility",
    q: "Are lockers available?",
    a: "Lockers are for day use only. Members must provide their own lock. Contents of lockers left overnight will be removed at the end of the business day. WSC is not responsible for any lost or stolen items.",
  },
  {
    category: "facility",
    q: "Does WSC close for maintenance?",
    a: "WSC may be temporarily closed for periods of up to two weeks each year for maintenance purposes. If a Facility Maintenance Charge is implemented in the future, members will be given a minimum of 60 days' notice.",
  },
  {
    category: "facility",
    q: "Can I opt out of photos and videos?",
    a: "Yes. WSC may take images or videos of members and guests for marketing or social media purposes. To opt out, email info@woodinvillesportsclub.com.",
  },

  // Fees & Pricing
  {
    category: "fees",
    q: "How much does court time cost?",
    a: "Court time is $21.14 + tax per 30-minute increment. You can book 30, 60, or 90 minutes. There are no separate rates for singles and doubles.",
  },
  {
    category: "fees",
    q: "What is the new member initiation fee?",
    a: "The one-time initiation fee is $50 + tax, assessed at the start of membership. This applies to new members and returning customers previously enrolled with passes or memberships.",
  },
  {
    category: "fees",
    q: "How much are guest fees?",
    a: "Tennis guest fees are $10 + tax per guest per court reservation. Pickleball guest fees are $5 + tax per guest per court reservation. Members can pay at the time of booking through CourtReserve.",
  },
  {
    category: "fees",
    q: "Are prices tax inclusive?",
    a: "No. As of 2025, pricing for events and classes is no longer tax inclusive. All listed fees are before applicable taxes. WSC reserves the right to update fees with appropriate notice.",
  },
  {
    category: "fees",
    q: "How are disputes resolved?",
    a: "All disputes (except small claims under $1,000) are settled by binding arbitration before a single arbitrator under the Federal Arbitration Act, conducted by the American Arbitration Association in the county where WSC is located. The decision is final and binding.",
  },
];

/* ── Accordion Item ──────────────────────────────────────── */

function AccordionItem({ item, itemId, isOpen, onToggle }: { item: FAQItem; itemId: string; isOpen: boolean; onToggle: () => void }) {
  const questionId = `faq-question-${itemId}`;
  const answerId = `faq-answer-${itemId}`;

  return (
    <div className="border-b border-ink/8">
      <button
        type="button"
        id={questionId}
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 px-1 text-left bg-transparent border-none cursor-pointer group"
        aria-expanded={isOpen}
        aria-controls={answerId}
      >
        <span className={`text-[15px] leading-[1.55] transition-colors duration-200 ${isOpen ? "text-ink font-medium" : "text-ink-mid group-hover:text-ink"}`}>
          {item.q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 mt-0.5 text-ink-light transition-transform duration-300 ${isOpen ? "rotate-180 text-volt" : ""}`}
        />
      </button>
      <div
        id={answerId}
        role="region"
        aria-labelledby={questionId}
        aria-hidden={!isOpen}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 pb-5" : "max-h-0 opacity-0"}`}
      >
        <p className="text-ink-mid text-[14px] leading-[1.78] px-1 pr-10">
          {item.a}
        </p>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const filteredFAQs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.faq} />
      <StructuredData schemas={[
        getBreadcrumbSchema([
          { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
          { name: "FAQ", url: "https://www.woodinvillesportsclub.com/faq" },
        ]),
        faqSchema,
      ]} />

      <PageHero
        eyebrow="Frequently Asked Questions"
        headline="Quick Answers."
        subtitle="Find answers to the most common questions about membership, court booking, cancellations, and facility policies."
        image={HERO_IMG}
      />

      {/* Search + Category Filter */}
      <section className="bg-parchment border-b border-ink/8 sticky top-[130px] z-30">
        <div className="max-w-[900px] mx-auto px-6 lg:px-14 py-5">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-parchment-mid text-ink text-[14px] pl-11 pr-4 py-3 border border-ink/10 focus:border-volt focus:outline-none transition-colors duration-200 placeholder:text-ink-light"
              aria-label="Search frequently asked questions"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={activeCategory === "all"}
              onClick={() => { setActiveCategory("all"); setOpenItems(new Set()); }}
              className={`text-[11px] tracking-[0.1em] uppercase px-4 py-2 border transition-all duration-200 cursor-pointer ${
                activeCategory === "all"
                  ? "bg-dark-bg text-volt-bright border-dark-bg"
                  : "bg-transparent text-ink-mid border-ink/15 hover:border-ink/30"
              }`}
            >
              All ({FAQS.length})
            </button>
            {FAQ_CATEGORIES.map((cat) => {
              const count = FAQS.filter((f) => f.category === cat.id).length;
              return (
                <button
                  type="button"
                  key={cat.id}
                  aria-pressed={activeCategory === cat.id}
                  onClick={() => { setActiveCategory(cat.id); setOpenItems(new Set()); }}
                  className={`text-[11px] tracking-[0.1em] uppercase px-4 py-2 border transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-dark-bg text-volt-bright border-dark-bg"
                      : "bg-transparent text-ink-mid border-ink/15 hover:border-ink/30"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-parchment px-6 lg:px-14 py-16 lg:py-20">
        <div className="max-w-[900px] mx-auto">
          {filteredFAQs.length > 0 ? (
            <>
              <p className="text-ink-light text-[13px] tracking-[0.06em] mb-8" role="status" aria-live="polite">
                Showing {filteredFAQs.length} of {FAQS.length} questions
                {activeCategory !== "all" && (
                  <> in <span className="text-ink font-medium">{FAQ_CATEGORIES.find(c => c.id === activeCategory)?.label}</span></>
                )}
                {searchQuery && (
                  <> matching "<span className="text-ink font-medium">{searchQuery}</span>"</>
                )}
              </p>
              <div>
                {filteredFAQs.map((faq, i) => {
                  const globalIndex = FAQS.indexOf(faq);
                  return (
                    <AccordionItem
                      key={globalIndex}
                      item={faq}
                      itemId={`faq-${globalIndex}`}
                      isOpen={openItems.has(globalIndex)}
                      onToggle={() => toggleItem(globalIndex)}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-ink-mid text-[18px] font-light mb-3">No matching questions found.</p>
              <p className="text-ink-light text-[14px] mb-6">
                Try a different search term or browse all categories.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="text-[12px] tracking-[0.1em] uppercase text-volt border border-volt px-6 py-2.5 bg-transparent cursor-pointer hover:bg-volt hover:text-dark-bg transition-colors duration-200"
              >
                Show All Questions
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-16 lg:py-20">
        <div className="max-w-[900px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-parchment p-8">
              <p className="text-volt text-[11px] tracking-[0.18em] uppercase mb-3">Need More Detail?</p>
              <h3 className="text-ink text-[22px] font-light tracking-[-0.01em] mb-3">
                Read the full policies.
              </h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-6">
                Our comprehensive Club Policies page has the complete details on every rule, fee, and guideline.
              </p>
              <Link
                href="/policies"
                className="text-[12px] tracking-[0.1em] uppercase no-underline text-dark-bg bg-volt-bright px-6 py-3 hover:bg-parchment-dark transition-colors duration-200 inline-block"
              >
                View Club Policies
              </Link>
            </div>
            <div className="bg-parchment p-8">
              <p className="text-volt text-[11px] tracking-[0.18em] uppercase mb-3">Still Have Questions?</p>
              <h3 className="text-ink text-[22px] font-light tracking-[-0.01em] mb-3">
                We're here to help.
              </h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-6">
                Our front desk staff is trained to assist with all policy-related inquiries. Don't hesitate to reach out.
              </p>
              <div className="space-y-2">
                <p className="text-ink text-[14px]">
                  <span className="text-ink-light">Phone:</span>{" "}
                  <a href="tel:+14254871090" className="text-volt no-underline hover:underline">(425) 487-1090</a>
                </p>
                <p className="text-ink text-[14px]">
                  <span className="text-ink-light">Email:</span>{" "}
                  <a href="mailto:info@woodinvillesportsclub.com" className="text-volt no-underline hover:underline">info@woodinvillesportsclub.com</a>
                </p>
                <Link
                  href="/contact"
                  className="text-[12px] tracking-[0.1em] uppercase no-underline text-ink border border-ink/20 px-6 py-3 hover:bg-ink hover:text-parchment transition-colors duration-200 inline-block mt-4"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
