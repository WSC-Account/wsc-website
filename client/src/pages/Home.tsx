/*
 * 4B Design — Home Page (Simplified)
 * Removed duplicate Swing Lab gallery, Tier 1 Golf Academy detail, and APL Performance section.
 * These are now compact teasers linking to their respective pages.
 */
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Instagram, Calendar, Clock, MapPin, ChevronRight, Quote } from "lucide-react";
import { toast } from "sonner";
import InstagramFeed from "@/components/InstagramFeed";
import FacilityGallery from "@/components/FacilityGallery";
import Tier1Banner from "@/components/Tier1Banner";
import FullWidthImage from "@/components/FullWidthImage";
import StructuredData, { getLocalBusinessSchema, getWebSiteSchema, getFAQSchema } from "@/components/StructuredData";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import { useFormProtection } from "@/hooks/useFormProtection";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";
import { responsiveAvifSrcSet, responsiveWebpSrcSet } from "@/lib/responsive-image";
import { submitWebsiteForm } from "@/lib/forms";

const TENNIS_IMG = "/images/wsc/tennis-courts.webp";
const GOLF_IMG = "/images/wsc/golf-practice-area.webp";
const PERF_IMG = "/images/wsc/gym-main.webp";
const PICKLE_IMG = "/images/wsc/pickleball-dome.webp";

/* Generated gallery images */
const GALLERY_TENNIS = "/images/wsc/tennis-player.webp";
const GALLERY_GOLF = "/images/wsc/campus-sunset.webp";
const GALLERY_YOUTH = "/images/wsc/apl-training.webp";
const GALLERY_AERIAL = "/images/wsc/golf-range-aerial.webp";

/* Real facility photos */
const SWINGLAB_IMG = "/images/wsc/swing-lab-simulators.webp";
const TENNIS_LESSON_IMG = "/images/wsc/tennis-player.webp";
const FITNESS_TRAINING_IMG = "/images/wsc/apl-training.webp";
const SUMMER_KIDS_IMG = "/images/wsc/summer-camp.webp";

const heroCollageImages = [
  {
    src: GALLERY_AERIAL,
    alt: "Aerial view of the Woodinville Sports Club golf range and campus",
    width: 1800,
    height: 1170,
    objectPosition: "center",
    className: "col-span-2 row-span-2 lg:col-span-4 lg:row-span-6",
  },
  {
    src: TENNIS_LESSON_IMG,
    alt: "Tennis player training at Woodinville Sports Club",
    width: 1800,
    height: 1200,
    objectPosition: "center 12%",
    imageClassName: "lg:translate-y-[22%]",
    className: "col-span-1 row-span-2 lg:col-span-3 lg:row-span-3",
  },
  {
    src: SUMMER_KIDS_IMG,
    alt: "Kids participating in summer camp at Woodinville Sports Club",
    width: 1388,
    height: 1667,
    objectPosition: "center 32%",
    className: "col-span-1 row-span-2 lg:col-span-2 lg:row-span-3",
  },
  {
    src: TENNIS_IMG,
    alt: "Indoor tennis courts at Woodinville Sports Club",
    width: 1800,
    height: 1218,
    objectPosition: "25% 24%",
    imageClassName: "lg:translate-y-[28%]",
    className: "col-span-1 row-span-2 lg:col-span-3 lg:row-span-3",
  },
  {
    src: GOLF_IMG,
    alt: "Golf practice range at Woodinville Sports Club",
    width: 1800,
    height: 1200,
    objectPosition: "center",
    className: "col-span-1 row-span-2 lg:col-span-3 lg:row-span-3",
  },
  {
    src: FITNESS_TRAINING_IMG,
    alt: "Athletic performance training at Woodinville Sports Club",
    width: 1185,
    height: 1800,
    objectPosition: "center 12%",
    className: "hidden lg:block lg:col-span-2 lg:row-span-3",
  },
  {
    src: SWINGLAB_IMG,
    alt: "Swing Lab golf simulators at Woodinville Sports Club",
    width: 1800,
    height: 1350,
    objectPosition: "center",
    className: "hidden lg:block lg:col-span-3 lg:row-span-3",
  },
];

const metrics = [
  { label: "Indoor Tennis Courts", val: "8", unit: "climate controlled" },
  { label: "Covered Driving Bays", val: "23", unit: "with free Toptracer" },
  { label: "Founded", val: "1979", unit: "" },
  { label: "Campus Acres", val: "67", unit: "" },
];

const thisWeekItems = [
  {
    icon: Calendar,
    tag: "Registration",
    title: "Spring 2 Registration Is Open",
    desc: "Spring 2 starts May 25, 2026 and runs through June 28. Register through CourtReserve for tennis, pickleball, golf, and APL programming.",
    date: "Starts May 25",
    time: "",
  },
  {
    icon: Clock,
    tag: "New Program",
    title: "Tier 1 Golf Foundations (Ages 7-9)",
    desc: "Junior golf pathways now include Foundations for ages 7-9, Adult Golf Clinics, private lessons, and Swing Lab simulator training.",
    date: "Ongoing",
    time: "",
  },
  {
    icon: Calendar,
    tag: "Summer",
    title: "Summer 2026 Registration Is Open",
    desc: "Summer training programs are live: Tennis, Golf, and Adventure Club camps for ages 3-18. Early registration recommended.",
    date: "June 29 - Aug 30",
    time: "",
  },
];

const disciplines = [
  {
    num: "01",
    tag: "Tennis",
    name: "Tier 1 Tennis",
    desc: "World-class tennis academy for junior players bound for the collegiate and professional ranks. Junior tennis classes for ages 3 and up, with pathways for recreational and elite development.",
    detail: "8 indoor climate-controlled courts. UTR matchplay. Adult group classes and tournaments.",
    img: TENNIS_IMG,
    href: "/tennis",
    stat: "8 Indoor Courts",
  },
  {
    num: "02",
    tag: "Golf",
    name: "Tier 1 Golf Academy",
    desc: "Scenic driving range with 23 covered bays, free Toptracer technology, grass tees and a 2.5-acre short-game practice area. Tier 1 Golf Academy for youth and adults.",
    detail: "4 Swing Lab simulators capturing 24 data points. Expert coaching for juniors and adults.",
    img: GOLF_IMG,
    href: "/golf",
    stat: "23 Covered Bays",
  },
  {
    num: "03",
    tag: "Performance",
    name: "Gym & Athletic Performance Lab",
    desc: "Full-service gym plus elite-level strength and conditioning training for youth and adult athletes in the dedicated APL Training Center.",
    detail: "Small-group S&C classes. Monthly packages of 4, 8, or unlimited sessions.",
    img: PERF_IMG,
    href: "/gym",
    stat: "Youth & Adult",
  },
  {
    num: "04",
    tag: "Pickleball",
    name: "The Dome",
    desc: "Play the nation's fastest-growing sport in our iconic dome. Open play 7 days a week, private court rentals, and classes for all levels.",
    detail: "Four major tournaments per year in partnership with Pickleball is Great (PIG).",
    img: PICKLE_IMG,
    href: "/pickleball",
    stat: "Open 7 Days",
  },
];

const dayAtWSC = [
  {
    time: "8:00 AM",
    title: "Drop the kids at Junior Tennis",
    desc: "Your kids head to the courts with their coaches — the same faces they've trained with all year.",
    location: "Indoor Tennis Courts",
  },
  {
    time: "8:30 AM",
    title: "Hit the APL for a workout",
    desc: "Strength circuit in the Training Center, or a solo session in the main gym. Your call.",
    location: "Athletic Performance Lab",
  },
  {
    time: "10:00 AM",
    title: "Grab a bucket at the range",
    desc: "23 covered bays, Toptracer on every one. Work on your swing with the Cascades in the background.",
    location: "Driving Range",
  },
  {
    time: "11:30 AM",
    title: "Pick up the kids, head to the dome",
    desc: "The whole family walks over for open play. No reservation needed — just show up and play.",
    location: "Pickleball Dome",
  },
  {
    time: "12:30 PM",
    title: "Cool down and head home",
    desc: "Four hours of training, three sports, one campus. That's a Saturday at WSC.",
    location: "Campus",
  },
];

const testimonials = [
  {
    quote: "My kids started in Adventure Club and now they're in the tennis academy full time. This place became our second home. The coaches know our kids by name.",
    name: "Sarah M.",
    role: "Family All-Access Member since 2019",
  },
  {
    quote: "I joined for the driving range. I stayed for the community. Saturday mornings here — hitting balls, grabbing coffee, running into neighbors — it's the best part of my week.",
    name: "David L.",
    role: "Individual All-Access Member",
  },
  {
    quote: "As a competitive junior player, the Tier 1 program pushed my game to a level I didn't think was possible. Coach Filipp and the team genuinely care about every athlete.",
    name: "Maya K.",
    role: "Tier 1 Tennis Academy, Age 16",
  },
];

const galleryImages = [
  { src: GALLERY_AERIAL, alt: "WSC campus aerial view", caption: "67 acres of world-class athletic facilities in the heart of Woodinville", span: "wide" as const },
  { src: TENNIS_IMG, alt: "Indoor tennis courts", caption: "8 climate-controlled indoor tennis courts", span: "normal" as const },
  { src: SWINGLAB_IMG, alt: "Swing Lab simulators", caption: "Swing Lab — 4 Uneekor simulators with 24 data points", span: "normal" as const },
  { src: GALLERY_TENNIS, alt: "Tennis match in action", caption: "Tier 1 Tennis — training future champions", span: "normal" as const },
  { src: GALLERY_YOUTH, alt: "Youth athletic training", caption: "APL youth strength and conditioning", span: "normal" as const },
  { src: GALLERY_GOLF, alt: "Driving range at sunset", caption: "23 covered bays with free Toptracer technology", span: "wide" as const },
  { src: PICKLE_IMG, alt: "Pickleball dome", caption: "The Dome — open play 7 days a week", span: "normal" as const },
  { src: FITNESS_TRAINING_IMG, alt: "Fitness training", caption: "Full-service gym and APL Training Center", span: "normal" as const },
];

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeDayStep, setActiveDayStep] = useState(0);

  // Scroll-reveal hooks
  const { containerRef: disciplineRef, visibleItems: disciplineVisible } = useStaggerReveal(4, { staggerDelay: 140, threshold: 0.08 });
  const { ref: summerRef, isVisible: summerVisible } = useScrollReveal({ threshold: 0.15 });
  const { ref: swingLabRef, isVisible: swingLabVisible } = useScrollReveal({ threshold: 0.12 });
  const { ref: tier1GolfRef, isVisible: tier1GolfVisible } = useScrollReveal({ threshold: 0.12 });
  const { ref: dayRef, isVisible: dayVisible } = useScrollReveal({ threshold: 0.08 });
  const { containerRef: testimonialRef, visibleItems: testimonialVisible } = useStaggerReveal(3, { staggerDelay: 160, threshold: 0.1 });
  const { ref: membershipRef, isVisible: membershipVisible } = useScrollReveal({ threshold: 0.1 });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const { honeypotProps: newsletterHoneypotProps, validateSubmission: validateNewsletterSubmission } = useFormProtection(1);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const check = validateNewsletterSubmission();
    if (!check.valid) {
      if (check.reason === "honeypot" || check.reason === "too_fast") {
        setNewsletterStatus("Thank you for subscribing.");
        setNewsletterEmail("");
        return;
      }
      if (check.reason === "rate_limited") {
        setNewsletterStatus("Please wait a moment before subscribing again.");
        return;
      }
    }

    setIsNewsletterSubmitting(true);
    try {
      await submitWebsiteForm({
        formType: "newsletter_signup",
        source: "/",
        email: newsletterEmail,
        subject: "WSC newsletter signup",
        metadata: {
          signupLocation: "home_newsletter",
        },
      });

      setNewsletterStatus("Thank you for subscribing.");
      setNewsletterEmail("");
      toast.success("Thanks, you're on the WSC newsletter list.");
    } catch {
      setNewsletterStatus("We could not subscribe you right now. Please try again.");
      toast.error("We could not subscribe you right now. Please try again.");
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.home} />
      <StructuredData schemas={[getLocalBusinessSchema(), getWebSiteSchema(), getFAQSchema()]} />

      {/* ── HERO ── */}
      <section className="relative min-h-screen bg-dark-bg flex flex-col justify-end overflow-hidden pt-[130px]">
        <div
          className="absolute inset-0 grid grid-cols-2 grid-rows-6 gap-px bg-dark-bg lg:grid-cols-12"
          aria-hidden="true"
        >
          {heroCollageImages.map((tile, index) => (
            <div key={tile.src} className={`relative overflow-hidden ${tile.className}`}>
              <picture className="block h-full w-full">
                <source
                  type="image/avif"
                  srcSet={responsiveAvifSrcSet(tile.src)}
                  sizes={index === 0 ? "(min-width: 1024px) 34vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                />
                <source
                  type="image/webp"
                  srcSet={responsiveWebpSrcSet(tile.src)}
                  sizes={index === 0 ? "(min-width: 1024px) 34vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                />
                <img
                  src={tile.src}
                  alt={tile.alt}
                  width={tile.width}
                  height={tile.height}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  className={`h-full w-full object-cover saturate-[0.72] brightness-[0.68] contrast-[1.05] lg:scale-[1.02] ${tile.imageClassName ?? ""}`}
                  style={{ objectPosition: tile.objectPosition }}
                />
              </picture>
              <div className="absolute inset-0 bg-dark-bg/5" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(22,19,16,0.6)] via-[rgba(22,19,16,0.44)] to-[rgba(22,19,16,0.14)] lg:via-[rgba(22,19,16,0.28)] lg:to-[rgba(22,19,16,0.05)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(22,19,16,0.6)] via-[rgba(22,19,16,0.14)] to-[rgba(22,19,16,0.04)]" />

        <div className="relative z-10 px-6 lg:px-14 pb-0 max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.7fr)] gap-10 lg:gap-16 items-end">
          <div className="pb-16 lg:pb-20">
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-7">
              Woodinville, Washington — Pacific Northwest
            </p>
            <h1 className="text-parchment text-[clamp(40px,5.2vw,76px)] font-light leading-[1.06] tracking-[-0.025em] mb-7">
              Level Up Your<br className="hidden lg:block" />
              {" "}Game at WSC.
            </h1>
            <p className="text-parchment/75 text-[16px] leading-[1.72] max-w-[440px] mb-5">
              The definitive destination in the Pacific Northwest for athletes and families seeking unparalleled sports training, holistic development, and a thriving community.
            </p>
            <p className="text-parchment/80 text-[13px] leading-[1.65] max-w-[440px] mb-8">
              Home to <strong className="text-parchment/80 font-normal">Tier 1 Sports</strong> — one of the nation's leading developmental programs in tennis, golf, and athletic performance.
            </p>
            <div className="flex flex-wrap gap-5 items-center">
              <Link
                href="/membership"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
              >
                Become a Member
              </Link>
              <a
                href="https://www.tier1nw.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright/50 px-7 py-3.5 hover:bg-volt-bright/10 hover:border-volt-bright transition-colors duration-200"
              >
                Explore Tier 1 Programs
                <ChevronRight size={13} />
              </a>
              <a
                href="https://app.courtreserve.com/Online/Portal/Index/6689"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] tracking-[0.14em] uppercase no-underline text-parchment/80 hover:text-parchment transition-colors duration-200"
              >
                Schedule a Tour
              </a>
            </div>
          </div>

          <div className="pb-12 lg:pb-20">
            <div className="border border-parchment/[0.1] bg-dark-bg/45 px-5 backdrop-blur-[2px] sm:px-8">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className={`flex justify-between gap-5 items-baseline py-5 sm:py-6 ${
                    i < metrics.length - 1 ? "border-b border-parchment/[0.08]" : ""
                  }`}
                >
                  <span className="text-parchment/75 text-[12px] tracking-[0.12em] uppercase">
                    {m.label}
                  </span>
                  <span className="text-right">
                    <span className="text-volt-bright text-[32px] font-light tracking-[-0.02em] leading-none">
                      {m.val}
                    </span>
                    {m.unit && (
                      <span className="text-parchment/70 text-[12px] tracking-[0.1em] uppercase ml-2">
                        {m.unit}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── THIS WEEK AT WSC ── */}
      <section className="bg-dark-bg border-t border-parchment/[0.08] px-6 lg:px-14 py-14 lg:py-16">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full bg-volt-bright animate-pulse" />
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase">
              This Week at WSC
            </p>
          </div>
          <h2 className="sr-only">This Week at WSC</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-parchment/[0.06]">
            {thisWeekItems.map((item, i) => (
              <div
                key={i}
                className="bg-dark-bg p-7 lg:p-8 group hover:bg-dark-mid transition-colors duration-300"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <item.icon size={14} className="text-volt-bright" />
                  <span className="text-volt-bright text-[10px] tracking-[0.2em] uppercase">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-parchment text-[17px] font-light tracking-[-0.01em] mb-2.5">
                  {item.title}
                </h3>
                <p className="text-parchment/75 text-[13px] leading-[1.65] mb-4">
                  {item.desc}
                </p>
                <div className="text-parchment/70 text-[11px] tracking-[0.08em] uppercase">
                  {item.date}{item.time && ` · ${item.time}`}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7">
            <Link
              href="/sessions"
              className="text-parchment/70 hover:text-parchment text-[12px] tracking-[0.14em] uppercase no-underline border-b border-volt-bright pb-[3px] transition-colors duration-200"
            >
              View 2026 Session Dates
            </Link>
          </div>
        </div>
      </section>

      {/* ── TIER 1 SPORTS — Full Banner ── */}
      <Tier1Banner variant="full" />

      {/* ── FULL-WIDTH VISUAL BREAK — Campus ── */}
      <FullWidthImage
        src={GALLERY_AERIAL}
        alt="WSC campus from above"
        caption="67 acres of athletic excellence in the Pacific Northwest."
        subcaption="Woodinville, Washington"
        height="tall"
      />

      {/* ── ABOUT ── */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">The Club</p>
            <h2 className="text-[clamp(28px,3vw,44px)] font-light leading-[1.12] tracking-[-0.02em]">
              Elevate Your Game.<br />Enrich Your Life.
            </h2>
          </div>
          <div>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-9">
              Helping every athlete grow their game, their community, and their potential. For over four decades, Woodinville Sports Club has been the heart of athletic pursuit in the Pacific Northwest, fostering a legacy of excellence that continues to shape the future of sports and fitness in our region.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-wsc-border">
              <div>
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-2">Memberships</p>
                <p className="text-ink-mid text-[14px] leading-[1.72]">
                  Annual and monthly membership options for court booking, class registration, golf, and fitness.
                </p>
              </div>
              <div>
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-2">Training</p>
                <p className="text-ink-mid text-[14px] leading-[1.72]">
                  Private and group training in tennis, fitness, and golf from expert coaches for athletes of all ages and levels.
                </p>
              </div>
              <div>
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-2">Facilities</p>
                <p className="text-ink-mid text-[14px] leading-[1.72]">
                  Eight indoor tennis courts, pickleball courts, comprehensive fitness facilities, and golf driving range on a scenic historic property.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCIPLINES — Interactive Cards ── */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-14 pb-8 border-b border-wsc-border">
            <div>
              <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Campus Programs</p>
              <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15]">
                World-class facilities.<br />Expert coaching.
              </h2>
            </div>
            <Link
              href="/about"
              className="text-ink-mid text-[12px] tracking-[0.12em] uppercase no-underline border-b border-wsc-border pb-[3px] mt-6 lg:mt-0"
            >
              About WSC
            </Link>
          </div>

          {/* 2-column layout for bigger cards */}
          <div ref={disciplineRef} className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {disciplines.map((d, i) => (
              <div
                key={d.num}
                className={`bg-parchment group overflow-hidden cursor-pointer relative transition-all duration-700 ease-out ${
                  disciplineVisible[i]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="overflow-hidden relative">
                  <img
                    src={d.img}
                    alt={`${d.name} facilities at Woodinville Sports Club`}
                    width={1800}
                    height={1200}
                    loading="lazy"
                    className={`w-full aspect-[16/10] object-cover transition-all duration-[650ms] ease-out ${
                      hoveredCard === i
                        ? "scale-[1.06] saturate-[0.7] brightness-[0.75]"
                        : "saturate-[0.55] brightness-[0.85]"
                    }`}
                  />
                  {/* Hover overlay with stat */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      hoveredCard === i ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="bg-dark-bg/80 backdrop-blur-sm px-5 py-3">
                      <span className="text-volt-bright text-[13px] tracking-[0.12em] uppercase font-light">
                        {d.stat}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-7 pb-9">
                  <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-2.5">
                    {d.num} — {d.tag}
                  </p>
                  <h3 className="text-[22px] font-light tracking-[-0.01em] mb-3">{d.name}</h3>
                  <p className="text-ink-mid text-[14px] leading-[1.72] mb-2">{d.desc}</p>
                  {/* Expanded detail on hover */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      hoveredCard === i ? "max-h-[80px] opacity-100 mb-5" : "max-h-0 opacity-0 mb-0"
                    }`}
                  >
                    <p className="text-ink text-[13px] leading-[1.65] pt-2">{d.detail}</p>
                  </div>
                  <Link
                    href={d.href}
                    className="inline-flex items-center gap-1.5 text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px] group-hover:text-volt transition-colors duration-200"
                  >
                    Explore {d.tag}
                    <ChevronRight
                      size={12}
                      className={`transition-transform duration-300 ${
                        hoveredCard === i ? "translate-x-1" : ""
                      }`}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Summer Training — standalone */}
          <div
            ref={summerRef}
            className={`mt-[3px] bg-parchment p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 transition-all duration-700 ease-out ${
              summerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="max-w-[600px]">
              <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-2.5">05 — Summer Training</p>
              <h3 className="text-[22px] font-light tracking-[-0.01em] mb-3">Summer Training Camp</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72]">
                Our year-round Tennis and Golf Academy programs continue throughout the summer with the same amazing coaches our kids know and love. Plus Adventure Club, a multi-sport offering where kids learn about athletes from around the world. Ages 3–18, June 29 – August 30.
              </p>
            </div>
            <Link
              href="/summer"
              className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-mid hover:text-ink transition-colors duration-200 shrink-0"
            >
              Explore Summer
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH VISUAL BREAK — Tennis Action ── */}
      <FullWidthImage
        src={GALLERY_TENNIS}
        alt="Indoor tennis match at WSC"
        caption="Train with former world-ranked professionals and D1 standouts."
        subcaption="Tier 1 Tennis Academy"
        height="medium"
        ctaLabel="Explore Tier 1 Tennis"
        ctaHref="https://www.tier1nw.com"
        ctaExternal
      />

      {/* ── YOUR DAY AT WSC ── */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div ref={dayRef} className="max-w-[1440px] mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 transition-all duration-800 ease-out ${dayVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {/* Left: intro */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Experience</p>
              <h2 className="text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15] mb-5">
                Your Saturday<br />at WSC.
              </h2>
              <p className="text-ink-mid text-[15px] leading-[1.75] mb-8">
                One campus. Three sports. A full morning of training for the whole family — and you never leave the property. Here's what a typical Saturday looks like.
              </p>
              <a
                href="https://app.courtreserve.com/Online/Portal/Index/6689"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-mid hover:text-ink transition-colors duration-200"
              >
                Book Your First Visit
              </a>
            </div>

            {/* Right: timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[18px] top-4 bottom-4 w-[1px] bg-wsc-border hidden lg:block" />

              <div className="space-y-2">
                {dayAtWSC.map((step, i) => (
                  <button
                    type="button"
                    key={i}
                    aria-expanded={activeDayStep === i}
                    aria-controls={`day-at-wsc-step-${i}`}
                    onClick={() => setActiveDayStep(i)}
                    className={`relative w-full text-left lg:pl-14 p-6 lg:p-8 transition-all duration-400 ${
                      activeDayStep === i
                        ? "bg-parchment-mid"
                        : "hover:bg-parchment-mid/50"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-[12px] top-9 w-[13px] h-[13px] rounded-full border-2 transition-colors duration-300 hidden lg:block ${
                        activeDayStep === i
                          ? "bg-volt-bright border-volt-bright"
                          : "bg-parchment border-wsc-border"
                      }`}
                    />

                    <div className="flex items-start gap-4 lg:gap-6">
                      <div className="shrink-0 w-[72px]">
                        <span
                          className={`text-[13px] tracking-[0.06em] font-light transition-colors duration-300 ${
                            activeDayStep === i ? "text-volt" : "text-ink-mid"
                          }`}
                        >
                          {step.time}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span
                          className={`block text-[18px] font-light tracking-[-0.01em] mb-1.5 transition-colors duration-300 ${
                            activeDayStep === i ? "text-ink" : "text-ink/85"
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          id={`day-at-wsc-step-${i}`}
                          className={`overflow-hidden transition-all duration-500 ease-out ${
                            activeDayStep === i ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <span className="block text-ink-mid text-[14px] leading-[1.72] mb-2">
                            {step.desc}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={11} className="text-volt" />
                            <span className="text-volt text-[11px] tracking-[0.12em] uppercase">
                              {step.location}
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FACILITY GALLERY — Immersive Photo Grid ── */}
      <FacilityGallery
        images={galleryImages}
        title="Our Campus."
        eyebrow="67 Acres"
        dark
      />

      {/* ── SWING LAB + TIER 1 GOLF — Compact Teasers ── */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[3px]">
            {/* Swing Lab Teaser */}
            <div
              ref={swingLabRef}
              className={`bg-parchment overflow-hidden group transition-all duration-700 ease-out ${swingLabVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="overflow-hidden">
                <img
                  src={SWINGLAB_IMG}
                  alt="Swing Lab Golf Simulators at WSC"
                  width={1800}
                  height={1350}
                  loading="lazy"
                  className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-3">Now Open</p>
                <h3 className="text-[22px] font-light tracking-[-0.01em] mb-3">Swing Lab Golf Simulators</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72] mb-5">
                  Four professional-grade Uneekor simulators capturing 24 data points in real time. Over 2,000 courses. Train with the same precision technology used by tour professionals.
                </p>
                <Link
                  href="/golf"
                  className="inline-flex items-center gap-1.5 text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px] group-hover:text-volt transition-colors duration-200"
                >
                  Learn More on Golf Page
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>

            {/* Tier 1 Golf Teaser */}
            <div
              ref={tier1GolfRef}
              className={`bg-parchment overflow-hidden group transition-all duration-700 ease-out delay-150 ${tier1GolfVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="overflow-hidden">
                <img
                  src={GOLF_IMG}
                  alt="Tier 1 Golf Academy at WSC"
                  width={1800}
                  height={1200}
                  loading="lazy"
                  className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-3">Tier 1 Golf Academy</p>
                <h3 className="text-[22px] font-light tracking-[-0.01em] mb-3">Junior & Adult Golf Programs</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72] mb-5">
                  Classes for all levels, from first swing to elite golfers. Junior Academy for ages 7–18. Led by WGTF Master Certified Coach, Daniel Jarvie. Full-time youth academy launching in 2026.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <a
                    href="https://www.tier1nw.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px] group-hover:text-volt transition-colors duration-200"
                  >
                    Explore Tier 1 Golf
                    <ChevronRight size={12} />
                  </a>
                  <Link
                    href="/golf"
                    className="text-ink-mid text-[12px] tracking-[0.12em] uppercase no-underline hover:text-ink transition-colors duration-200"
                  >
                    Full Golf Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH VISUAL BREAK — Golf Sunset ── */}
      <FullWidthImage
        src={GALLERY_GOLF}
        alt="WSC driving range at golden hour"
        caption="23 covered bays with free Toptracer. Open to the public."
        subcaption="Driving Range"
        height="medium"
        ctaLabel="Explore Golf"
        ctaHref="/golf"
      />

      {/* ── MEMBER TESTIMONIALS ── */}
      <section className="bg-dark-bg px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-14">
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Community</p>
            <h2 className="text-parchment text-[clamp(26px,2.8vw,40px)] font-light tracking-[-0.02em] leading-[1.15]">
              Why they stay.
            </h2>
          </div>

          <div ref={testimonialRef} className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-parchment/[0.06]">
            {testimonials.map((t, i) => (
              <div key={i} className={`bg-dark-bg p-8 lg:p-10 group transition-all duration-700 ease-out ${testimonialVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                <Quote size={20} className="text-volt-bright/40 mb-6" />
                <p className="text-parchment/80 text-[15px] leading-[1.75] mb-8 font-light italic">
                  "{t.quote}"
                </p>
                <div className="border-t border-parchment/[0.08] pt-5">
                  <p className="text-parchment text-[14px] font-light mb-1">{t.name}</p>
                  <p className="text-parchment/75 text-[11px] tracking-[0.1em] uppercase">
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH VISUAL BREAK — Summer Kids ── */}
      <FullWidthImage
        src={SUMMER_KIDS_IMG}
        alt="Summer camp kids at WSC"
        caption="Summer Training Camp — ages 3 to 18, June 29 through August 30."
        subcaption="Summer 2026"
        height="short"
      />

      {/* ── MEMBERSHIP — Experience-First ── */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div ref={membershipRef} className={`max-w-[1440px] mx-auto transition-all duration-800 ease-out ${membershipVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Aspirational lead */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-end mb-6">
            <div>
              <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Membership</p>
              <h2 className="text-[clamp(26px,2.6vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
                Train Without Limits.
              </h2>
            </div>
            <p className="text-ink-mid text-[15px] leading-[1.75]">
              Strength training. Court sports. Golf. Recovery. All under one roof. Choose the membership that fits your goals.
            </p>
          </div>

          {/* Experience description */}
          <div className="bg-parchment-mid p-8 lg:p-10 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
              {[
                { label: "Book Courts", desc: "Reserve tennis, pickleball, and simulator time online — anytime, from anywhere." },
                { label: "Train Daily", desc: "Full gym access, APL Training Center, group S&C classes, and personal training." },
                { label: "Play Year-Round", desc: "Indoor courts and covered bays mean weather never cancels your plans." },
                { label: "Belong", desc: "Tournaments, social events, and a community of athletes who push each other." },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-2">{item.label}</p>
                  <p className="text-ink-mid text-[13px] leading-[1.65]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px] mb-8">
            {[
              {
                type: "Monthly",
                name: "Family All-Access",
                price: "$100/mo",
                desc: "All household individuals — two adults max plus kids 17 and under. Includes class registration, court and range access, strength and fitness facilities, sauna and locker rooms.",
              },
              {
                type: "Monthly",
                name: "Individual All-Access",
                price: "$40/mo",
                desc: "One 18+ individual. Full campus access including class registration, court and range access, strength and fitness facilities, sauna and locker rooms.",
              },
              {
                type: "Annual",
                name: "Court & Range Access",
                price: "$120/yr",
                desc: "Two 18+ individuals plus household. Enables court booking and class registration. Golf simulator booking with 7-day window, $4 off range buckets, and mini-golf discounts.",
              },
            ].map((m, i) => (
              <div
                key={i}
                className="bg-parchment-mid p-8 lg:p-10 border-t-2 border-transparent hover:border-volt transition-colors duration-300"
              >
                <p className="text-volt text-[10px] tracking-[0.2em] uppercase mb-3.5">{m.type}</p>
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-1">{m.name}</h3>
                <p className="text-volt-bright text-[18px] font-light mb-4">{m.price}</p>
                <p className="text-ink-mid text-[14px] leading-[1.7] mb-6">{m.desc}</p>
                <Link
                  href="/membership"
                  className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
                >
                  View All Options
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="https://app.courtreserve.com/Online/Portal/Index/6689"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-10 py-3.5 hover:bg-parchment-mid hover:text-ink transition-colors duration-200"
            >
              Start Your Membership
            </a>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER SIGNUP ── */}
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-28">
        <div className="max-w-[640px] mx-auto text-center">
          <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Stay Connected</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Get the WSC Newsletter.
          </h2>
          <p className="text-parchment/75 text-[15px] leading-[1.75] mb-8">
            Weekly schedules, open play times, registration deadlines, and member-only updates — delivered to your inbox every Monday.
          </p>
          <form onSubmit={handleNewsletterSubmit}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address for newsletter subscription"
                disabled={isNewsletterSubmitting}
                className="flex-1 bg-dark-bg border border-parchment/[0.15] px-5 py-3 text-[14px] text-parchment placeholder:text-parchment/70 focus:border-volt-bright focus:outline-none transition-colors"
              />
              <input {...newsletterHoneypotProps} />
              <button
                type="submit"
                disabled={isNewsletterSubmitting}
                className={`text-[12px] tracking-[0.14em] uppercase px-8 py-3 transition-colors duration-200 font-medium ${
                  isNewsletterSubmitting
                    ? "bg-parchment/25 text-parchment/70 cursor-default"
                    : "bg-volt-bright text-dark-bg hover:bg-parchment"
                }`}
              >
                {isNewsletterSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            <p
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {newsletterStatus}
            </p>
            <p className="text-parchment/75 text-[11px] leading-[1.6] mt-4">
              Unsubscribe at any time. See our{" "}
              <Link href="/privacy" className="text-parchment/70 underline hover:text-parchment transition-colors">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </section>

      {/* ── INSTAGRAM FEED ── */}
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-5 mb-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-3">Follow Us</p>
              <h2 className="text-[clamp(22px,2.4vw,32px)] font-light tracking-[-0.02em] leading-[1.15]">
                @woodinvillesportsclub
              </h2>
            </div>
            <a
              href="https://www.instagram.com/woodinvillesportsclub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start text-[12px] tracking-[0.12em] uppercase no-underline text-ink border border-wsc-border px-6 py-2.5 hover:border-volt hover:text-volt transition-colors duration-200 sm:self-auto"
            >
              <Instagram size={14} />
              Follow on Instagram
            </a>
          </div>
          <InstagramFeed />
        </div>
      </section>
    </div>
  );
}
