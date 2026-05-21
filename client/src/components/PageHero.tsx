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
}

export default function PageHero({ eyebrow, headline, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative min-h-[60vh] lg:min-h-[70vh] bg-dark-bg flex items-end overflow-hidden pt-[130px]">
      <picture className="absolute inset-0 block">
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
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(22,19,16,0.71)] via-[rgba(22,19,16,0.45)] to-[rgba(22,19,16,0.15)]" />
      <div className="relative z-10 px-6 lg:px-14 pb-16 lg:pb-20 max-w-[1440px] w-full mx-auto">
        <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">
          {eyebrow}
        </p>
        <h1 className="text-parchment text-[clamp(36px,5vw,64px)] font-light leading-[1.08] tracking-[-0.025em] mb-5 max-w-[700px]">
          {headline}
        </h1>
        {subtitle && (
          <p className="text-parchment/80 text-[16px] leading-[1.72] max-w-[500px]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
