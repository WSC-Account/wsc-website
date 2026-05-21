/**
 * FullWidthImage — Edge-to-edge immersive image section
 * Used as visual breaks between content sections for dramatic impact.
 * Optional overlay text for context.
 */

interface FullWidthImageProps {
  src: string;
  alt: string;
  caption?: string;
  subcaption?: string;
  height?: "short" | "medium" | "tall";
  overlay?: "light" | "dark" | "none";
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  imagePosition?: string;
}

const FULL_WIDTH_IMAGE_POSITIONS: Record<string, string> = {
  "/images/wsc/apl-training.webp": "center 12%",
  "/images/wsc/summer-camp.webp": "center 32%",
  "/images/wsc/tennis-courts.webp": "25% 24%",
  "/images/wsc/tennis-player.webp": "center 24%",
};

export default function FullWidthImage({
  src,
  alt,
  caption,
  subcaption,
  height = "medium",
  overlay = "dark",
  ctaLabel,
  ctaHref,
  ctaExternal = false,
  imagePosition = FULL_WIDTH_IMAGE_POSITIONS[src] ?? "center",
}: FullWidthImageProps) {
  const heightClass =
    height === "short"
      ? "h-[35vh] lg:h-[40vh]"
      : height === "tall"
      ? "h-[60vh] lg:h-[75vh]"
      : "h-[45vh] lg:h-[55vh]";

  const overlayClass =
    overlay === "dark"
      ? "bg-gradient-to-t from-[rgba(22,19,16,0.7)] via-[rgba(22,19,16,0.2)] to-[rgba(22,19,16,0.1)]"
      : overlay === "light"
      ? "bg-gradient-to-t from-[rgba(255,255,255,0.5)] via-transparent to-transparent"
      : "";

  return (
    <section className={`relative ${heightClass} overflow-hidden`}>
      <img
        src={src}
        alt={alt}
        width={1800}
        height={1200}
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ objectPosition: imagePosition }}
        loading="lazy"
      />
      {overlay !== "none" && <div className={`absolute inset-0 ${overlayClass}`} />}
      {(caption || subcaption) && (
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 lg:px-14 pb-8 lg:pb-12">
          <div className="max-w-[1440px] mx-auto">
            {subcaption && (
              <p className="text-parchment/70 text-[10px] tracking-[0.2em] uppercase mb-2">
                {subcaption}
              </p>
            )}
            {caption && (
              <p className="text-parchment text-[clamp(18px,2.2vw,28px)] font-light tracking-[-0.02em] leading-[1.2] max-w-[600px]">
                {caption}
              </p>
            )}
            {ctaLabel && ctaHref && (
              ctaExternal ? (
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-7 py-3 hover:bg-parchment transition-colors duration-200"
                >
                  {ctaLabel}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </a>
              ) : (
                <a
                  href={ctaHref}
                  className="inline-flex items-center gap-2 mt-5 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-7 py-3 hover:bg-parchment transition-colors duration-200"
                >
                  {ctaLabel}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </a>
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
}
