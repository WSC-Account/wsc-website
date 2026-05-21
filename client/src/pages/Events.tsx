import { Link } from "wouter";
import { BriefcaseBusiness, Cake, GlassWater, PartyPopper, Trophy, Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/campus-sunset.webp";
const CABIN_IMG = "/images/wsc/campus-dome.webp";
const RANGE_IMG = "/images/wsc/golf-range-aerial.webp";
const COURT_IMG = "/images/wsc/tennis-courts.webp";

const eventTypes = [
  {
    icon: GlassWater,
    title: "Weddings & Rehearsals",
    desc: "Rustic charm, modern convenience, and indoor/outdoor space for celebrations in Woodinville Wine Country.",
  },
  {
    icon: Cake,
    title: "Birthday Parties",
    desc: "Flexible party setups for kids, adults, and families, with sports activities available across the campus.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Corporate Events",
    desc: "Meeting space, team-building activities, networking time, and a campus setting that feels active and memorable.",
  },
  {
    icon: Users,
    title: "Family Celebrations",
    desc: "Reunions, graduations, anniversaries, and private gatherings with room to move between indoor and outdoor areas.",
  },
];

const venues = [
  {
    name: "The Cabin",
    image: CABIN_IMG,
    desc: "Indoor dining, entertainment space, a cozy bar, an outdoor fire pit, and seating for special celebrations.",
  },
  {
    name: "Golf Range & Mini-Golf",
    image: RANGE_IMG,
    desc: "A relaxed setting for birthdays, corporate events, golf outings, Toptracer range play, and 18-hole mini-golf.",
  },
  {
    name: "Tennis & Pickleball",
    image: COURT_IMG,
    desc: "Eight indoor courts plus pickleball options for energetic team-building, casual gatherings, and sports parties.",
  },
];

export default function Events() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.events} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Private Events", url: "https://www.woodinvillesportsclub.com/events" },
      ])]} />

      <PageHero
        eyebrow="Private Events"
        headline="Celebrate at WSC."
        subtitle="Private parties, corporate events, family celebrations, and sports-forward gatherings in the heart of Woodinville Wine Country near the Hollywood District."
        image={HERO_IMG}
      />

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.35fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">What We Offer</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              Event packages built around your group.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82]">
              Event packages can be customized with food and drink, decorations, inflatables, DJs, instructors, tennis or golf activities, outdoor movies, servers, and other add-ons based on the occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {eventTypes.map((item) => (
              <article key={item.title} className="bg-parchment-mid p-8 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <item.icon size={24} className="text-volt mb-5" />
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-3">{item.title}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Venue Options</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-14">
            Choose the right setting.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[3px]">
            {venues.map((venue) => (
              <article key={venue.name} className="bg-parchment">
                <img
                  src={venue.image}
                  alt={`${venue.name} event venue at Woodinville Sports Club`}
                  width={1800}
                  height={1200}
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover saturate-[0.62] brightness-[0.9]"
                />
                <div className="p-8">
                  <h3 className="text-[20px] font-light tracking-[-0.01em] mb-3">{venue.name}</h3>
                  <p className="text-ink-mid text-[14px] leading-[1.72]">{venue.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Plan Your Event</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
              Tell us what you are planning.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[620px]">
              WSC can help shape the right combination of venue, food, service, and sports activities for your group.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
          >
            Get in Touch
            <PartyPopper size={14} />
          </Link>
        </div>
      </section>

      <section className="bg-parchment px-6 lg:px-14 py-16">
        <div className="max-w-[900px] mx-auto text-center">
          <Trophy size={22} className="text-volt mx-auto mb-5" />
          <blockquote className="text-ink-mid text-[18px] lg:text-[22px] leading-[1.65] font-light">
            "Beautiful building, clean, spacious, and great for indoor/outdoor parties. The management team and staff were helpful and accommodating."
          </blockquote>
          <p className="text-ink-light text-[11px] tracking-[0.16em] uppercase mt-5">J. Wong, WA</p>
        </div>
      </section>
    </div>
  );
}
