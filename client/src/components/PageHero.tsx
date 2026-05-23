/*
 * 4B Design: Dark hero with desaturated bg image, gradient overlay
 * Green eyebrow label, large light headline, dim subtext
 */
import { responsiveAvifSrcSet, responsiveWebpSrcSet } from "@/lib/responsive-image";

interface PageHeroProps {
  eyebrow: string;
  headline: string;
  subtitle?: string;
  image: string;
  imagePosition?: string;
  avoidHeaderCrop?: boolean;
}

const HERO_IMAGE_POSITIONS: Record<string, string> = {
  "/images/wsc/apl-training.webp": "center 12%",
  "/images/wsc/summer-camp.webp": "center 32%",
  "/images/wsc/tennis-courts.webp": "25% 24%",
  "/images/wsc/tennis-player.webp": "center 12%",
};

export default function PageHero({
  eyebrow,
  headline,
  subtitle,
  image,
  imagePosition = HERO_IMAGE_POSITIONS[image] ?? "center",
  avoidHeaderCrop = false,
}: PageHeroProps) {
  const imageLayerClass = avoidHeaderCrop
    ? "absolute inset-x-0 bottom-0 top-[var(--site-header-height,130px)] block"
    : "absolute inset-0 block";

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
          alt={`${eyebrow} at Woodinville Sports Club`}
          width={1800}
          height={1200}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center saturate-[0.38] brightness-[0.44]"
          style={{ objectPosition: imagePosition }}
        />
      </picture>
      <div className={`${imageLayerClass} bg-gradient-to-t from-[rgba(22,19,16,0.71)] via-[rgba(22,19,16,0.45)] to-[rgba(22,19,16,0.15)]`} />
      <div className="hero-safe-content relative z-10 px-6 lg:px-14 pb-16 lg:pb-20 pt-10 max-w-[1440px] w-full mx-auto min-h-[60vh] lg:min-h-[70vh] flex flex-col justify-end">
        <p className="hero-eyebrow text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">
          {eyebrow}
        </p>
        <h1 className="hero-title text-parchment text-[clamp(36px,5vw,64px)] font-light leading-[1.08] tracking-[-0.025em] mb-5 max-w-[700px]">
          {headline}
        </h1>
        {subtitle && (
          <p className="hero-subtitle text-parchment/80 text-[16px] leading-[1.72] max-w-[500px]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
