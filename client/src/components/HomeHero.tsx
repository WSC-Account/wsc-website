import React, { type ElementType } from "react";
import { ChevronRight } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";

export const HOME_HERO_TITLE = ["Train in", "Woodinville."] as const;
export const HOME_HERO_SUBTITLE =
  "Adult classes, junior programs from age 3, and Tier 1 academy training.";

export const heroCollageImages = [
  {
    src: "/images/wsc/tennis-junior-backhand.webp",
    alt: "Junior tennis player practicing a backhand at Woodinville Sports Club",
    tile: "lead",
    position: "center 68%",
    sizes: "(min-width: 1024px) 42vw, 50vw",
  },
  {
    src: "/images/wsc/tennis-adult-clinic.webp",
    alt: "Adult tennis player working with a coach at Woodinville Sports Club",
    tile: "adult",
    position: "center 35%",
    sizes: "25vw",
  },
  {
    src: "/images/wsc/summer-camp.webp",
    alt: "Golf swing practice at Woodinville Sports Club",
    tile: "camp",
    position: "center 32%",
    sizes: "(min-width: 1024px) 17vw, 25vw",
  },
  {
    src: "/images/wsc/golf-practice-area.webp",
    alt: "Golf driving range at Woodinville Sports Club",
    tile: "golf",
    position: "center",
    sizes: "(min-width: 1024px) 17vw, 25vw",
  },
  {
    src: "/images/wsc/apl-training.webp",
    alt: "Athletic Performance Lab training at Woodinville Sports Club",
    tile: "fitness",
    position: "center 20%",
    sizes: "(min-width: 1024px) 17vw, 25vw",
  },
  {
    src: "/images/wsc/pickleball-dome.webp",
    alt: "Pickleball in the WSC dome",
    tile: "pickleball",
    position: "center",
    sizes: "(min-width: 1024px) 17vw, 25vw",
  },
  {
    src: "/images/wsc/swing-lab-simulators.webp",
    alt: "Swing Lab indoor golf simulators at Woodinville Sports Club",
    tile: "simulators",
    position: "center",
    sizes: "25vw",
  },
];

// Render the same hero at build time and in the app. Native anchors keep the
// initial HTML useful; Home supplies Wouter's Link for client navigation.
export default function HomeHero({
  linkComponent: Link = "a",
  headerOffset = true,
}: {
  linkComponent?: ElementType;
  headerOffset?: boolean;
}) {
  return (
    <section
      className={
        headerOffset
          ? "bg-dark-bg pt-[var(--site-header-height,130px)]"
          : "bg-dark-bg"
      }
      aria-labelledby="home-title"
    >
      <div className="home-hero relative isolate overflow-hidden">
        <div className="home-hero-collage">
          {heroCollageImages.map((tile, index) => (
            <div
              key={tile.tile}
              className={`home-hero-tile home-hero-tile--${tile.tile}`}
            >
              <ResponsiveImage
                src={tile.src}
                alt={tile.alt}
                sizes={tile.sizes}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                pictureClassName="block h-full w-full"
                className="h-full w-full object-cover"
                style={{ objectPosition: tile.position }}
              />
            </div>
          ))}
        </div>
        <div
          className="home-hero-shade absolute inset-0 -z-10"
          aria-hidden="true"
        />
        <div className="home-hero-copy mx-auto w-full max-w-[1440px] px-6 py-9 sm:py-12 lg:px-14 lg:py-20">
          <h1
            id="home-title"
            className="max-w-[560px] text-[clamp(42px,5vw,72px)] font-light leading-[1.04] tracking-[-0.035em] text-parchment"
          >
            {HOME_HERO_TITLE[0]}
            <br />
            {HOME_HERO_TITLE[1]}
          </h1>
          <p className="mt-5 max-w-[360px] text-[17px] leading-[1.6] text-parchment">
            {HOME_HERO_SUBTITLE}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/tennis/adult"
              className="home-button bg-volt-bright text-dark-bg hover:bg-parchment"
            >
              Adult Tennis <ChevronRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/tennis#junior-tennis"
              className="home-button border border-parchment/70 text-parchment hover:bg-parchment hover:text-ink"
            >
              Junior Tennis
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
