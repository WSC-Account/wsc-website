import { Link } from "wouter";
import { imageDimensionsFor, responsiveAvifSrcSet, responsiveWebpSrcSet } from "@/lib/responsive-image";

interface PageHeroProps {
  eyebrow: string;
  headline: string;
  subtitle?: string;
  actions?: ReadonlyArray<{ label: string; href: string }>;
  image: string;
  imagePosition?: string;
  avoidHeaderCrop?: boolean;
  overlayClassName?: string;
}

const HERO_IMAGE_POSITIONS: Record<string, string> = {
  "/images/wsc/apl-training.webp": "center 12%",
  "/images/wsc/summer-camp.webp": "center 32%",
  "/images/wsc/tennis-adult-clinic.webp": "center 24%",
  "/images/wsc/tennis-courts.webp": "25% 24%",
  "/images/wsc/tennis-core-group.webp": "center 35%",
  "/images/wsc/tennis-player.webp": "center 12%",
};

export default function PageHero({
  eyebrow,
  headline,
  subtitle,
  actions,
  image,
  imagePosition = HERO_IMAGE_POSITIONS[image] ?? "center",
  avoidHeaderCrop = false,
  overlayClassName = actions ? "bg-gradient-to-r from-black/85 via-black/55 to-black/10" : "bg-gradient-to-t from-[rgba(22,19,16,0.42)] via-[rgba(22,19,16,0.18)] to-[rgba(22,19,16,0.04)]",
}: PageHeroProps) {
  const imageLayerClass = avoidHeaderCrop
    ? "absolute inset-x-0 bottom-0 top-[var(--site-header-height,130px)] block"
    : "absolute inset-0 block";
  const imageDimensions = imageDimensionsFor(image);

  return (
    <section className="relative bg-dark-bg overflow-hidden pt-[var(--site-header-height,130px)]">
      <picture className={imageLayerClass}>
        <source
          type="image/avif"
          srcSet={responsiveAvifSrcSet(image)}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={responsiveWebpSrcSet(image)}
          sizes="100vw"
        />
        <img
          src={image}
          alt={actions ? "" : `${eyebrow} at Woodinville Sports Club`}
          width={imageDimensions.width}
          height={imageDimensions.height}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center saturate-[0.95] brightness-[0.94]"
          style={{ objectPosition: imagePosition }}
        />
      </picture>
      <div className={`${imageLayerClass} ${overlayClassName}`} />
      <div className={actions
            ? "page-hero-copy hero-safe-content relative z-10 px-6 lg:px-14 py-10 lg:py-14 max-w-[1440px] w-full mx-auto min-h-[min(52svh,32rem)] lg:min-h-[min(58svh,37rem)] flex flex-col justify-end"
            : "hero-safe-content relative z-10 px-6 lg:px-14 pb-16 lg:pb-20 pt-10 max-w-[1440px] w-full mx-auto min-h-[60vh] lg:min-h-[70vh] flex flex-col justify-end"}>
        <p className={actions
            ? "hero-eyebrow text-parchment text-[13px] font-medium tracking-[0.15em] uppercase mb-4"
            : "hero-eyebrow text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5"}>
          {eyebrow}
        </p>
        <h1 className={actions
            ? "hero-title max-w-[700px] text-white text-[clamp(32px,5vw,64px)] font-light leading-[1.08] tracking-[-0.025em]"
            : "hero-title max-w-[320px] text-parchment text-[clamp(32px,5vw,64px)] font-light leading-[1.08] tracking-[-0.025em] mb-5 sm:max-w-[700px]"}>
          {headline}
        </h1>
        {subtitle && (
          <p className={actions
            ? "hero-subtitle mt-4 max-w-[54ch] text-white text-[16px] font-normal leading-[1.6]"
            : "hero-subtitle max-w-[320px] text-parchment/80 text-[16px] leading-[1.72] sm:max-w-[500px]"}>
            {subtitle}
          </p>
        )}
        {actions && actions.length > 0 && (
          <div className="hero-actions mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            {actions.map(({ label, href }, index) => {
              const className = index === 0
                ? "home-button bg-volt-bright text-dark-bg hover:bg-white"
                : "inline-flex min-h-11 items-center text-[15px] font-medium text-white underline underline-offset-4 hover:text-parchment";
              if (href.startsWith("/")) {
                return <Link key={href} href={href} className={className}>{label}</Link>;
              }
              return <a key={href} href={href} className={className}>{label}</a>;
            })}
          </div>
        )}
      </div>
    </section>
  );
}
