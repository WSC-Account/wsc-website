/*
 * 4B Design — About WSC Page
 * Real content from WSC website crawl
 */
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import ResponsiveImage from "@/components/ResponsiveImage";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/campus-dome.webp";
const VISION_IMAGES = [
  {
    src: "/images/wsc/tennis-player.webp",
    alt: "Tennis athlete training at Woodinville Sports Club",
    label: "Practice the craft",
    className: "col-span-2 md:col-span-1 md:row-span-2 min-h-[360px] md:min-h-[560px]",
    imageClassName: "object-[center_24%]",
  },
  {
    src: "/images/wsc/golf-practice-area.webp",
    alt: "Golf short game practice grounds at Woodinville Sports Club",
    label: "Expand the grounds",
    className: "min-h-[220px] md:min-h-[278px]",
    imageClassName: "object-[center_44%]",
  },
  {
    src: "/images/wsc/apl-training.webp",
    alt: "Athletes training in the Athletic Performance Lab at Woodinville Sports Club",
    label: "Build the athlete",
    className: "min-h-[220px] md:min-h-[278px]",
    imageClassName: "object-[center_35%]",
  },
] as const;

const VISION_PILLARS = [
  "Tennis",
  "Golf",
  "Athletic Performance",
] as const;

export default function About() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.about} />
      <StructuredData schemas={[
        getBreadcrumbSchema([
          { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
          { name: "About", url: "https://www.woodinvillesportsclub.com/about" },
        ]),
      ]} />
      <PageHero
        eyebrow="About WSC"
        headline="Elevating Athletic Excellence Since 1976."
        subtitle="Where passion meets performance, and community thrives through sport."
        image={HERO_IMG}
        imagePosition="center top"
        avoidHeaderCrop
      />

      {/* Story */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Our Story</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
              From a modest<br />tennis facility<br />to a premier campus.
            </h2>
          </div>
          <div>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Welcome to Woodinville Sports Club — a dedicated <strong>training facility</strong> where passion meets performance and community thrives through sport. For over four decades, we've been the heart of athletic pursuit in the Pacific Northwest, fostering a legacy of excellence that continues to shape the future of sports and fitness in our region.
            </p>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Founded in 1976, Woodinville Sports Club began as a modest tennis facility with a big dream: to create a space where athletes of all levels could come together, challenge themselves, and grow. As our community evolved, so did we. Today, we stand as a premier <strong>multi-sport training campus</strong>, offering world-class facilities for tennis, golf, pickleball, and comprehensive fitness programs — all anchored by <strong>Tier 1 Sports</strong>, one of the nation's leading developmental programs.
            </p>
            <div className="border-l-2 border-volt pl-6 py-4">
              <p className="text-ink-mid text-[15px] leading-[1.7] italic">
                "Woodinville Sports Club: Where every swing, serve, and step is an opportunity to rise higher."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-dark-bg px-6 lg:px-14 py-24 lg:py-28 overflow-hidden">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.95fr_1.25fr] gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Where We're Going</p>
            <h2 className="text-parchment text-[clamp(28px,3.2vw,48px)] font-light tracking-[-0.025em] leading-[1.08] mb-6">
              A multi-sport training ground built for athletes, by athletes.
            </h2>
            <p className="text-parchment/80 text-[16px] leading-[1.82] mb-6">
              We are building WSC into a true training ground for athletes across sports. A place where people can show up, feel comfortable, and put in the daily work required to sharpen their craft.
            </p>
            <p className="text-parchment/80 text-[16px] leading-[1.82] mb-8">
              The vision is bigger than one court, one range, or one gym. We are building an environment where tennis players, golfers, strength athletes, juniors, adults, coaches, and families can train with purpose and grow together.
            </p>
            <div className="border-l-2 border-volt-bright pl-6 py-4 mb-10">
              <p className="text-parchment text-[clamp(22px,2.4vw,34px)] font-light tracking-[-0.02em] leading-[1.15] mb-3">
                For Athletes, By Athletes.
              </p>
              <p className="text-parchment/70 text-[14px] leading-[1.72]">
                Built from the ground up, brick by brick, step by step.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1px] bg-parchment/10">
              {VISION_PILLARS.map((pillar) => (
                <div key={pillar} className="bg-dark-mid px-5 py-4">
                  <p className="text-volt-bright text-[12px] tracking-[0.16em] uppercase">{pillar}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[3px]">
            {VISION_IMAGES.map((image) => (
              <figure key={image.src} className={`relative overflow-hidden ${image.className}`}>
                <ResponsiveImage
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover brightness-[0.72] saturate-[0.72] ${image.imageClassName}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(22,19,16,0.72)] via-[rgba(22,19,16,0.12)] to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                  <p className="text-parchment text-[13px] tracking-[0.18em] uppercase">{image.label}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Court Scheduling Note */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-12 lg:py-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-center">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-volt shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase font-medium">Court Scheduling</p>
            </div>
            <p className="text-ink-mid text-[15px] leading-[1.75]">
              As a training-focused facility, court time at WSC is prioritized for academy programming through Tier 1 Sports. Recreational and member play is welcome and available — we recommend checking <a href="https://app.courtreserve.com/Online/Portal/Index/6689" target="_blank" rel="noopener noreferrer" className="text-volt hover:text-ink transition-colors duration-200 underline">CourtReserve</a> for current availability or calling us at <a href="tel:4254871090" className="text-volt hover:text-ink transition-colors duration-200 underline">(425) 487-1090</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Elevate Philosophy */}
      <section className="bg-dark-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-6">The Elevate Experience</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light leading-[1.1] tracking-[-0.02em] mb-6">
            Elevation in every discipline.
          </h2>
          <p className="text-parchment/80 text-[15px] leading-[1.8] max-w-[640px] mb-14">
            At Woodinville Sports Club, we believe in the power of elevation — not just in sports, but in life. Our "Elevate" philosophy permeates everything we do.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
            {[
              {
                name: "Elevate Performance",
                desc: "For the ambitious athletes pushing their limits. Structured training, competitive programs, and measurable development across tennis, golf, and athletic performance.",
              },
              {
                name: "Elevate Development",
                desc: "Nurturing the next generation of sports enthusiasts. Junior programs that shape future champions through progressive skill building and age-appropriate training.",
              },
              {
                name: "Elevate Fitness",
                desc: "Empowering every member to reach their peak health. Comprehensive gym facilities, group S&C classes, and personalized training for all levels.",
              },
            ].map((e, i) => (
              <div key={i} className="bg-dark-bg p-8 lg:p-10 border-t-2 border-transparent hover:border-volt-bright transition-colors duration-300">
                <h3 className="text-parchment text-[20px] font-light tracking-[-0.01em] mb-3">{e.name}</h3>
                <p className="text-parchment/80 text-[14px] leading-[1.72]">{e.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-parchment/75 text-[14px] leading-[1.72] max-w-[640px] mt-10">
            Whether you're a seasoned competitor, a family looking for active fun, or someone rediscovering the joy of sports, we have a program designed to elevate your game and your well-being.
          </p>
        </div>
      </section>

      {/* Facilities */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Our Facilities</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            A 67-acre training campus in the heart of Woodinville.
          </h2>
          <p className="text-ink-mid text-[16px] leading-[1.82] mb-14 max-w-[680px]">
            Our campus is purpose-built for athlete development. Every court, bay, and training space is designed to support structured programming — from junior development through elite competition. Facility access is managed through CourtReserve to balance academy training with member, guest, and program play.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { val: "8+1", label: "Indoor & Outdoor Tennis Courts" },
              { val: "23+", label: "Covered Driving Bays with Toptracer" },
              { val: "4", label: "Uneekor Golf Simulators" },
              { val: "8+", label: "Indoor & Outdoor Pickleball Courts" },
              { val: "2", label: "Fitness & Training Facilities" },
            ].map((f, i) => (
              <div key={i} className="py-6 border-t border-wsc-border">
                <div className="text-volt-bright text-[36px] font-light tracking-[-0.02em] leading-none mb-2">
                  {f.val}
                </div>
                <div className="text-ink-light text-[11px] tracking-[0.14em] uppercase leading-[1.5]">
                  {f.label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-ink-mid text-[14px] leading-[1.72] mt-10">
            Plus a spacious 2.5-acre short-game practice area, grass tees, an 18-hole mini-golf course, and specialized training areas for sport-specific conditioning.
          </p>
        </div>
      </section>

      {/* Community & Expert Guidance */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Community at Our Core</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
              More than<br />a sports club.
            </h2>
          </div>
          <div>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              More than just a sports club, we're a vibrant community hub. Our members don't just train here — they form lifelong friendships, celebrate milestones, and inspire each other to reach new heights. From junior programs that shape future champions to social leagues that bring people together, we're committed to fostering a sense of belonging and shared achievement.
            </p>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Our team of certified coaches and fitness professionals are the backbone of the Woodinville Sports Club experience. With their diverse expertise and passionate approach, they're dedicated to helping you unlock your full potential, regardless of your starting point.
            </p>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-8">
              Whether you're looking to serve your first ace, sink the perfect putt, or simply elevate your overall wellness, Woodinville Sports Club is your launchpad to success. We invite you to become part of our storied legacy and thriving future.
            </p>
            <div className="bg-[#0d1b2a] p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-volt-bright text-[12px] tracking-[0.2em] uppercase mb-1.5">Tier 1 Sports</p>
                <p className="text-white text-[15px] font-light">Discover our world-class developmental programming.</p>
              </div>
              <a
                href="https://www.tier1nw.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-7 py-3 hover:bg-white transition-colors duration-200 shrink-0"
              >
                Explore Tier 1
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Join Us</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Ready to elevate your game?
          </h2>
          <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[480px] mx-auto mb-8">
            Contact us today to learn more about membership options, or book your first visit when you are ready to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href="/membership"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
            >
              View Membership
            </Link>
            <a
              href="https://www.tier1nw.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
            >
              Explore Tier 1 Programs
            </a>
            <Link
              href="/contact"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment/75 text-[12px] tracking-[0.14em] uppercase hover:text-parchment transition-colors duration-200"
            >
              Book a Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
