/*
 * 4B Design — Stringing & Pro Shop Page
 * WSC on-site stringing services, racquet accessories, apparel, and golf gear
 */
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const PROSHOP_HERO = "/images/wsc/racket-stringing.webp";
const STRINGING_IMG = "/images/wsc/racket-stringing.webp";

const STRING_OPTIONS = [
  {
    category: "Recreational",
    description: "Includes stringing service labor and a set of recreational-tier strings.",
    price: "$40-$50 + tax",
  },
  {
    category: "Performance",
    description: "Includes stringing service labor and a set of performance-tier strings.",
    price: "$50-$60 + tax",
  },
  {
    category: "Premium",
    description: "Includes stringing service labor and a set of premium-tier strings.",
    price: "$60 or more + tax",
  },
];

const SHOP_CATEGORIES = [
  {
    title: "Tennis Racquets",
    description: "Ask the front desk about current racket support, stringing needs, and available tennis equipment on campus.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="10" cy="10" r="7" />
        <line x1="15" y1="15" x2="22" y2="22" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Pickleball Paddles",
    description: "Check with WSC staff for current pickleball paddle, ball, and accessory availability.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="6" y="2" width="12" height="16" rx="6" />
        <line x1="12" y1="18" x2="12" y2="23" strokeLinecap="round" strokeWidth={2} />
      </svg>
    ),
  },
  {
    title: "Golf Accessories",
    description: "Pick up or ask about golf essentials for the range, mini-golf, and Swing Lab simulator sessions.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="18" r="4" />
        <line x1="12" y1="2" x2="12" y2="14" strokeLinecap="round" strokeWidth={2} />
        <path d="M12 2 L18 6 L12 10" />
      </svg>
    ),
  },
  {
    title: "Apparel & Footwear",
    description: "Contact the front desk for current WSC merchandise, apparel, and court footwear guidance.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 20h18M5 20V8l7-5 7 5v12" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    title: "Grips & Accessories",
    description: "Ask about grips, dampeners, bags, and other court accessories when you drop off your racket.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2v20M2 12h20" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Training Aids",
    description: "WSC staff can point you toward available training tools and facility resources for your sport.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

export default function ProShop() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.proShop} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Pro Shop", url: "https://www.woodinvillesportsclub.com/pro-shop" },
      ])]} />
      <PageHero
        eyebrow="On-Site Pro Shop"
        headline="Stringing & Pro Shop"
        subtitle="Expert racquet stringing, premium equipment, and everything you need for tennis, pickleball, and golf — all under one roof."
        image={PROSHOP_HERO}
      />

      {/* Stringing Services — Hero Section */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Expert Stringing</p>
              <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
                Professional racquet<br />stringing services.
              </h2>
              <p className="text-ink-mid text-[15px] leading-[1.75] mb-6">
                The right tennis string tension can make all the difference in your performance on the court. Swing by the WSC front desk with your racket to get started, and our team will help route it through the stringing process.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Evaluation of your racket, preferred tension, and string type",
                  "String selection based on playing style and performance needs",
                  "Precise stringing on professional tennis racket stringing machines",
                  "Quality assurance inspection before the racket is returned",
                  "Bring your own strings or have your string selection ready at drop-off",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-volt mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-ink-mid text-[14px] leading-[1.6]">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-dark-bg text-parchment px-7 py-3.5 text-[13px] tracking-[0.08em] uppercase no-underline hover:bg-dark-bg/90 transition-colors duration-200"
                >
                  Drop Off a Racquet
                </Link>
                <a
                  href="tel:+14254871090"
                  className="inline-flex items-center gap-2 border border-wsc-border text-dark-bg px-7 py-3.5 text-[13px] tracking-[0.08em] uppercase no-underline hover:bg-dark-bg/5 transition-colors duration-200"
                >
                  Call Front Desk
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="overflow-hidden">
                <img
                  src={STRINGING_IMG}
                  alt="Professional racquet stringing machine at WSC Pro Shop with string spools and tools"
                  width={1500}
                  height={1245}
                  loading="lazy"
                  className="w-full h-[420px] lg:h-[520px] object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-volt text-dark-bg px-6 py-3">
                <p className="text-[11px] tracking-[0.16em] uppercase font-medium">Front Desk Drop-Off</p>
                <p className="text-[13px] mt-0.5">Bring your racket to WSC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* String Options */}
      <section className="bg-dark-bg px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">String Selection</p>
          <h2 className="text-parchment text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            Choose the right tier<br />for your game.
          </h2>
          <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[640px] mb-14">
            Each tier includes stringing service labor and a set of strings. Bring your own strings or have your string selection decided and ready to share with the front desk when you drop off your racket.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STRING_OPTIONS.map((option, i) => (
              <div key={i} className="border border-white/[0.08] p-8 hover:border-volt-bright/30 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-volt-bright text-[11px] tracking-[0.18em] uppercase font-medium">0{i + 1}</span>
                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>
                <h3 className="text-parchment text-[20px] font-light tracking-[-0.01em] mb-2">{option.category}</h3>
                <p className="text-volt-bright text-[22px] font-light mb-4">{option.price}</p>
                <p className="text-parchment/80 text-[14px] leading-[1.6]">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Shop Categories */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Shop the Pro Shop</p>
          <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            Everything for your game,<br />all in one place.
          </h2>
          <p className="text-ink-mid text-[15px] leading-[1.75] max-w-[640px] mb-14">
            The WSC Pro Shop carries equipment, apparel, and accessories for tennis, pickleball, and golf. Our knowledgeable staff can help you find exactly what you need.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SHOP_CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className="group border border-wsc-border p-8 hover:border-volt/40 hover:bg-white/40 transition-all duration-300"
              >
                <div className="text-volt mb-5">{cat.icon}</div>
                <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">{cat.title}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.7]">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Quick Reference */}
      <section className="bg-[#f0ece4] px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
            <div>
              <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Stringing Pricing</p>
              <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
                Transparent pricing,<br />no surprises.
              </h2>
              <p className="text-ink-mid text-[15px] leading-[1.75] mb-6">
                Current WSC stringing tiers include both stringing service labor and a set of strings. Final price depends on the selected tier and string choice.
              </p>
              <p className="text-ink-mid/85 text-[13px] leading-[1.6] italic">
                Bring your racket to the front desk with your own strings or with your preferred string selection ready.
              </p>
            </div>

            <div className="border border-wsc-border bg-white/60">
              <div className="grid grid-cols-[1fr_auto] border-b border-wsc-border">
                <div className="p-5 text-[11px] tracking-[0.16em] uppercase text-ink-mid font-medium">Tier</div>
                <div className="p-5 text-[11px] tracking-[0.16em] uppercase text-ink-mid font-medium text-right">Price</div>
              </div>
              {STRING_OPTIONS.map((row, i) => (
                <div key={row.category} className={`grid grid-cols-[1fr_auto] ${i < STRING_OPTIONS.length - 1 ? "border-b border-wsc-border" : ""}`}>
                  <div className="p-5">
                    <p className="text-[14px] text-dark-bg">{row.category}</p>
                    <p className="text-[12px] text-ink-mid mt-1">{row.description}</p>
                  </div>
                  <div className="p-5 text-[14px] text-dark-bg font-medium text-right whitespace-nowrap">{row.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Drop-Off CTA */}
      <section className="bg-dark-bg px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Visit Us</p>
          <h2 className="text-parchment text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            Drop off at the front desk.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[720px] mx-auto mb-10">
            <div className="border border-white/[0.08] p-6">
              <p className="text-parchment/70 text-[11px] tracking-[0.16em] uppercase mb-2">Tennis & Gym</p>
              <p className="text-parchment text-[18px] font-light">Weekdays 6 AM - 11 PM</p>
            </div>
            <div className="border border-white/[0.08] p-6">
              <p className="text-parchment/70 text-[11px] tracking-[0.16em] uppercase mb-2">Tennis & Gym</p>
              <p className="text-parchment text-[18px] font-light">Weekends 7 AM - 10 PM</p>
            </div>
            <div className="border border-white/[0.08] p-6">
              <p className="text-parchment/70 text-[11px] tracking-[0.16em] uppercase mb-2">Golf</p>
              <p className="text-parchment text-[18px] font-light">Everyday 9 AM - 10 PM</p>
            </div>
          </div>
          <p className="text-parchment/75 text-[14px] leading-[1.7] max-w-[540px] mx-auto mb-10">
            Located inside the main clubhouse at Woodinville Sports Club. Bring your racket to the front desk with your preferred string choice or your own strings.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-volt text-dark-bg px-8 py-3.5 text-[13px] tracking-[0.08em] uppercase no-underline font-medium hover:bg-volt-bright transition-colors duration-200"
            >
              Contact Pro Shop
            </Link>
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 border border-parchment/30 text-parchment px-8 py-3.5 text-[13px] tracking-[0.08em] uppercase no-underline hover:border-parchment/50 transition-colors duration-200"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
