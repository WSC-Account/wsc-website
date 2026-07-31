import { useEffect } from "react";
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import ResponsiveImage from "@/components/ResponsiveImage";
import SEOHead from "@/components/SEOHead";
import StructuredData, {
  getBreadcrumbSchema,
  getServiceSchema,
} from "@/components/StructuredData";
import { SEO } from "@/lib/seo-data";
import { MapPin, Phone } from "lucide-react";

const HERO_IMG = "/images/wsc/golf-range-sunset.webp";
const PRACTICE_AREA_IMG = "/images/wsc/golf-practice-area.webp";
const RANGE_BASKETS_IMG = "/images/wsc/golf-range-baskets.webp";
const GRASS_TEES_IMG = "/images/wsc/golf-range-field.webp";
const ADDRESS = "15327 140th Pl NE, Woodinville, WA 98072";
const CALL_URL = "tel:4254871090";
const APPLE_MAPS_URL = `https://maps.apple.com/?address=${encodeURIComponent(ADDRESS)}`;
const GOOGLE_MAPS_URL = `https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`;
const CALL_CONVERSION_ID = "AW-18217215416/mHOlCMSBktYcELjL0u5D";
const DIRECTIONS_CONVERSION_ID = "AW-18217215416/snJaCKvuldYcELjL0u5D";

declare global {
  interface Window {
    gtag_report_conversion?: (url?: string) => false;
    gtag_report_conversion_directions?: (url?: string) => false;
  }
}

function getDirectionsUrl() {
  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";
  const isTouchMac = platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || isTouchMac;

  return isIOS ? APPLE_MAPS_URL : GOOGLE_MAPS_URL;
}

function reportConversion(sendTo: string, url?: string) {
  let redirected = false;
  const redirect = () => {
    if (!url || redirected) return;
    redirected = true;
    window.location.href = url;
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: sendTo,
      event_callback: redirect,
    });

    if (url) {
      window.setTimeout(redirect, 700);
    }
  } else {
    redirect();
  }

  return false as const;
}

function gtag_report_conversion(url?: string) {
  return reportConversion(CALL_CONVERSION_ID, url);
}

function gtag_report_conversion_directions(url?: string) {
  return reportConversion(DIRECTIONS_CONVERSION_ID, url);
}

const priceCards = [
  { name: "Small", detail: "~45 balls", price: "$10" },
  { name: "Medium", detail: "~75 balls", price: "$12" },
  { name: "Large", detail: "~100 balls", price: "$14" },
];

const quickStats = [
  { value: "75", label: "Total Bays" },
  { value: "24+", label: "Covered Bays" },
  { value: "2.5", label: "Short-Game Acres" },
];

const sectionLinks = [
  { href: "#pricing", label: "Pricing" },
  { href: "#toptracer", label: "Toptracer" },
  { href: "#grass-tees", label: "Grass Tees" },
  { href: "#short-game", label: "Short Game" },
  { href: "#facility", label: "Facility" },
  { href: "#memberships", label: "Memberships" },
];

const grassTeeFeatures = [
  "Outdoor grass tee practice",
  "Seasonal availability",
  "Open to the public",
  "Built for full-swing range sessions",
];

const shortGameFeatures = [
  "Putting grounds",
  "Chipping area",
  "Turf putting green",
  "2.5-acre short-game training area",
];

const membershipBenefits = [
  "$4 off every range bucket",
  "$2 off 16 oz beers",
  "$1 off select 12 oz alcoholic beverages",
  "$1 off energy drinks and Gatorade",
];

export default function DrivingRange() {
  useEffect(() => {
    window.gtag_report_conversion = gtag_report_conversion;
    window.gtag_report_conversion_directions =
      gtag_report_conversion_directions;

    return () => {
      delete window.gtag_report_conversion;
      delete window.gtag_report_conversion_directions;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.drivingRange} />
      <StructuredData
        schemas={[
          getBreadcrumbSchema([
            { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
            { name: "Golf", url: "https://www.woodinvillesportsclub.com/golf" },
            {
              name: "Driving Range",
              url: "https://www.woodinvillesportsclub.com/golf/driving-range",
            },
          ]),
          getServiceSchema({
            name: "Driving Range and Golf Training Grounds",
            description: SEO.drivingRange.description,
            url: "https://www.woodinvillesportsclub.com/golf/driving-range",
            serviceType:
              "Public driving range, Toptracer bays, grass tees, and short-game practice",
            image: HERO_IMG,
            audience:
              "Public golfers, families, junior golfers, and adult players",
          }),
        ]}
      />

      <PageHero
        eyebrow="WSC Golf Training Grounds"
        headline="Driving Range & Golf Training Grounds"
        subtitle="75 total bays - 24+ covered with free Toptracer, plus outdoor grass tees - and 2.5 acres of short-game practice space, open to the public in Woodinville."
        image={HERO_IMG}
        imagePosition="center 58%"
      />

      <section className="bg-parchment px-6 lg:px-14 py-10 lg:py-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href={CALL_URL}
            onClick={event => {
              event.preventDefault();
              gtag_report_conversion(CALL_URL);
            }}
            className="inline-flex min-h-[64px] items-center justify-center gap-3 bg-volt-bright px-8 py-4 text-center text-[12px] uppercase tracking-[0.14em] text-dark-bg no-underline transition-colors duration-200 hover:bg-parchment-dark"
          >
            <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
            Call Us
          </a>
          <a
            href={GOOGLE_MAPS_URL}
            onClick={event => {
              event.preventDefault();
              gtag_report_conversion_directions(getDirectionsUrl());
            }}
            className="inline-flex min-h-[64px] items-center justify-center gap-3 border border-volt bg-transparent px-8 py-4 text-center text-[12px] uppercase tracking-[0.14em] text-ink no-underline transition-colors duration-200 hover:bg-parchment-mid"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
            Get Directions
          </a>
        </div>
        <nav
          aria-label="Driving range page sections"
          className="max-w-[1440px] mx-auto mt-6 flex flex-wrap justify-center gap-2"
        >
          {sectionLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-[40px] items-center justify-center border border-wsc-border bg-parchment-mid px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-ink-mid no-underline transition-colors duration-200 hover:border-volt hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </section>

      <section
        id="pricing"
        className="scroll-mt-[var(--site-header-height,130px)] bg-parchment px-6 lg:px-14 py-20 lg:py-24"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-12 border-b border-wsc-border pb-8">
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt">
              Range Hours & Pricing
            </p>
            <h2 className="text-[clamp(26px,2.8vw,40px)] font-light leading-[1.15] tracking-[-0.02em]">
              Open 9am-10pm every day.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-[3px] md:grid-cols-3">
            {priceCards.map(card => (
              <article
                key={card.name}
                className="bg-parchment-mid p-8 transition-colors duration-300 border-t-2 border-transparent hover:border-volt"
              >
                <h3 className="mb-1 text-[20px] font-light tracking-[-0.01em]">
                  {card.name} Bucket
                </h3>
                <p className="mb-3 text-[13px] text-ink-light">{card.detail}</p>
                <p className="text-[28px] font-light text-volt-bright">
                  {card.price}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-[3px] lg:grid-cols-2">
            <div className="bg-parchment-mid p-8">
              <h3 className="mb-4 text-[18px] font-light tracking-[-0.01em]">
                Punch Card Discounts
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between gap-5 border-b border-wsc-border py-2">
                  <span className="text-[14px] text-ink-mid">
                    10 Medium Buckets
                  </span>
                  <span className="text-[16px] font-light text-volt-bright">
                    $108 + tax
                  </span>
                </div>
                <div className="flex justify-between gap-5 py-2">
                  <span className="text-[14px] text-ink-mid">
                    10 Large Buckets
                  </span>
                  <span className="text-[16px] font-light text-volt-bright">
                    $126 + tax
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-parchment-mid p-8">
              <h3 className="mb-4 text-[18px] font-light tracking-[-0.01em]">
                Daily Hours
              </h3>
              <p className="text-[32px] font-light leading-none tracking-[-0.02em] text-volt-bright">
                9am-10pm
              </p>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink-mid">
                Monday through Sunday.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="toptracer"
        className="scroll-mt-[var(--site-header-height,130px)] bg-dark-mid px-6 lg:px-14 py-20 lg:py-24"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:items-center">
          <div>
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt-bright">
              Toptracer Bays
            </p>
            <h2 className="mb-6 text-[clamp(26px,3vw,42px)] font-light leading-[1.1] tracking-[-0.02em] text-parchment">
              Free Toptracer on all 19 covered bays.
            </h2>
            <div className="grid grid-cols-2 gap-[3px]">
              <div className="bg-white/[0.055] p-6">
                <p className="mb-2 text-[34px] font-light leading-none text-volt-bright">
                  19
                </p>
                <p className="text-[11px] uppercase tracking-[0.14em] leading-[1.45] text-parchment/70">
                  Covered Toptracer Bays
                </p>
              </div>
              <div className="bg-white/[0.055] p-6">
                <p className="mb-2 text-[34px] font-light leading-none text-volt-bright">
                  Free
                </p>
                <p className="text-[11px] uppercase tracking-[0.14em] leading-[1.45] text-parchment/70">
                  Included With Buckets
                </p>
              </div>
            </div>
          </div>
          <ResponsiveImage
            src={RANGE_BASKETS_IMG}
            alt="Golf range baskets at Woodinville Sports Club"
            loading="lazy"
            className="w-full aspect-[16/10] object-cover saturate-[0.65] brightness-[0.82]"
            style={{ objectPosition: "center 52%" }}
          />
        </div>
      </section>

      <section
        id="grass-tees"
        className="scroll-mt-[var(--site-header-height,130px)] bg-parchment px-6 lg:px-14 py-20 lg:py-24"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:items-center">
          <div>
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt">
              Grass Tees
            </p>
            <h2 className="mb-8 text-[clamp(26px,2.8vw,40px)] font-light leading-[1.15] tracking-[-0.02em]">
              Seasonal outdoor tees for natural-turf practice.
            </h2>
            <div className="grid grid-cols-1 gap-[3px] sm:grid-cols-2">
              {grassTeeFeatures.map(feature => (
                <div key={feature} className="bg-parchment-mid p-6">
                  <p className="text-[15px] leading-[1.5] text-ink">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveImage
            src={GRASS_TEES_IMG}
            alt="Grass tee practice area at Woodinville Sports Club"
            loading="lazy"
            className="w-full aspect-[16/10] object-cover saturate-[0.68] brightness-[0.9]"
            style={{ objectPosition: "center 52%" }}
          />
        </div>
      </section>

      <section
        id="short-game"
        className="scroll-mt-[var(--site-header-height,130px)] bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:items-center">
          <ResponsiveImage
            src={PRACTICE_AREA_IMG}
            alt="Short-game practice area at Woodinville Sports Club"
            loading="lazy"
            className="w-full aspect-[4/3] object-cover saturate-[0.62] brightness-[0.9]"
            style={{ objectPosition: "center 62%" }}
          />
          <div>
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt">
              Short Game Grounds
            </p>
            <h2 className="mb-8 text-[clamp(26px,2.8vw,40px)] font-light leading-[1.15] tracking-[-0.02em]">
              Room for putting, chipping, and wedge work.
            </h2>
            <div className="grid grid-cols-1 gap-[3px] sm:grid-cols-2">
              {shortGameFeatures.map(feature => (
                <div key={feature} className="bg-parchment p-6">
                  <p className="text-[15px] leading-[1.5] text-ink">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="facility"
        className="scroll-mt-[var(--site-header-height,130px)] bg-parchment px-6 lg:px-14 py-20 lg:py-24"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-12 border-b border-wsc-border pb-8">
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt">
              Facility Overview
            </p>
            <h2 className="text-[clamp(26px,2.8vw,40px)] font-light leading-[1.15] tracking-[-0.02em]">
              Public range access. No membership required.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-[3px] md:grid-cols-3">
            {quickStats.map(stat => (
              <div key={stat.label} className="bg-parchment-mid p-8">
                <p className="mb-2 text-[34px] font-light leading-none tracking-[-0.02em] text-volt-bright">
                  {stat.value}
                </p>
                <p className="text-[11px] uppercase tracking-[0.14em] leading-[1.5] text-ink-light">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-[3px] lg:grid-cols-3">
            {[
              "Covered bays plus outdoor bays",
              "Seasonal grass tees",
              "18-hole mini-golf: $8 kids / $10 adults",
            ].map(item => (
              <div key={item} className="bg-parchment-mid p-7">
                <p className="text-[14px] leading-[1.65] text-ink-mid">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="memberships"
        className="scroll-mt-[var(--site-header-height,130px)] bg-dark-bg px-6 lg:px-14 py-20 lg:py-24"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:items-start">
          <div>
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt-bright">
              Memberships
            </p>
            <h2 className="mb-6 text-[clamp(26px,3vw,42px)] font-light leading-[1.1] tracking-[-0.02em] text-parchment">
              Range perks for members.
            </h2>
            <p className="max-w-[520px] text-[15px] leading-[1.75] text-parchment/76">
              Court & Range Access and All-Access memberships include useful
              savings every time you practice.
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-[3px] sm:grid-cols-2">
              {membershipBenefits.map(benefit => (
                <div
                  key={benefit}
                  className="border border-parchment/10 bg-white/[0.055] p-7"
                >
                  <p className="text-[15px] leading-[1.55] text-parchment/82">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/membership"
              className="mt-8 inline-block bg-volt-bright px-8 py-3.5 text-[12px] uppercase tracking-[0.14em] text-dark-bg no-underline transition-colors duration-200 hover:bg-parchment"
            >
              View Membership Options
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt">
            Visit the Range
          </p>
          <h2 className="mb-8 text-[clamp(26px,3vw,42px)] font-light leading-[1.15] tracking-[-0.02em]">
            Buckets, short game, Toptracer, and grass tees.
          </h2>
          <div className="mx-auto grid max-w-[560px] grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href={CALL_URL}
              onClick={event => {
                event.preventDefault();
                gtag_report_conversion(CALL_URL);
              }}
              className="inline-flex min-h-[52px] items-center justify-center gap-3 bg-volt-bright px-8 py-3.5 text-[12px] uppercase tracking-[0.14em] text-dark-bg no-underline transition-colors duration-200 hover:bg-parchment-dark"
            >
              <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
              Call Us
            </a>
            <a
              href={GOOGLE_MAPS_URL}
              onClick={event => {
                event.preventDefault();
                gtag_report_conversion_directions(getDirectionsUrl());
              }}
              className="inline-flex min-h-[52px] items-center justify-center gap-3 border border-volt bg-transparent px-8 py-3.5 text-[12px] uppercase tracking-[0.14em] text-ink no-underline transition-colors duration-200 hover:bg-parchment-mid"
            >
              <MapPin
                className="h-4 w-4"
                aria-hidden="true"
                strokeWidth={1.8}
              />
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
