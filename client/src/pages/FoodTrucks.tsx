import { Link } from "wouter";
import { Instagram, Mail, Utensils } from "lucide-react";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/campus-sunset.webp";

const trucks = [
  {
    name: "Anthony's",
    desc: "Fresh Northwest seafood, including fish tacos, fish and chips, seafood bowls, and more.",
  },
  {
    name: "Jessica's Unique Bite Burgers",
    desc: "Made-to-order burgers with a Mexican twist, including vegetarian and gluten-free options.",
  },
  {
    name: "Stanford's",
    desc: "Classic American food built around traditional ingredients and layered flavors.",
  },
  {
    name: "Isidro's",
    desc: "Street food from Zacapu, Michoacan, Mexico, using fresh ingredients and traditional techniques.",
  },
  {
    name: "Now Make Me a Sandwich",
    desc: "Artisan sandwiches made to order with locally sourced ingredients.",
  },
  {
    name: "El Koreano",
    desc: "Korean-Mexican fusion food with bold flavors and fresh local ingredients.",
  },
  {
    name: "Tabassum",
    desc: "Uzbek food specializing in Central Asian samsas - savory meat and veggie hand pies with flaky crusts.",
  },
];

export default function FoodTrucks() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.foodTrucks} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Food Trucks", url: "https://www.woodinvillesportsclub.com/food-trucks" },
      ])]} />

      <PageHero
        eyebrow="Food Trucks"
        headline="Dinner before practice."
        subtitle="WSC hosts rotating local food trucks on campus, making it easy to grab food before the range, open pickleball, tennis, or a family night out."
        image={HERO_IMG}
      />

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.4fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Rotating Schedule</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              Follow WSC for the latest truck calendar.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              The live-site calendar includes rotating truck dates that change over time, so the replacement site keeps the evergreen vendor information here and sends guests to WSC social updates for the latest schedule.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/woodinvillesportsclub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
              >
                <Instagram size={14} />
                Follow Updates
              </a>
              <a
                href="mailto:shenson@woodinvillesportsclub.com"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline text-ink border border-ink/20 px-8 py-3.5 hover:bg-ink/5 transition-colors duration-200"
              >
                <Mail size={14} />
                Bring a Truck
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {trucks.map((truck) => (
              <article key={truck.name} className="bg-parchment-mid p-8 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <Utensils size={22} className="text-volt mb-5" />
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-3">{truck.name}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{truck.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Make a Night of It</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
              Food, range balls, courts, and community.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[620px]">
              Pair dinner with the driving range, mini-golf, tennis, pickleball, or a private event on campus.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
          >
            Contact WSC
          </Link>
        </div>
      </section>
    </div>
  );
}
