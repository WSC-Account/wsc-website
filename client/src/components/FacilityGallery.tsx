/**
 * FacilityGallery — Full-width immersive photo gallery
 * Masonry-style layout with hover overlays and lightbox-style interaction
 * Used on homepage and about page for visual impact
 */
import { useState } from "react";

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  span?: "wide" | "tall" | "normal";
}

interface FacilityGalleryProps {
  images: GalleryImage[];
  title?: string;
  eyebrow?: string;
  dark?: boolean;
}

export default function FacilityGallery({
  images,
  title = "Our Campus",
  eyebrow = "Gallery",
  dark = false,
}: FacilityGalleryProps) {
  const [activeImg, setActiveImg] = useState<number | null>(null);

  const bgClass = dark ? "bg-dark-bg" : "bg-parchment-mid";
  const eyebrowClass = dark ? "text-volt-bright" : "text-volt";
  const titleClass = dark ? "text-parchment" : "text-ink";
  const captionBg = "bg-dark-bg/80 backdrop-blur-sm";

  return (
    <section className={`${bgClass} px-6 lg:px-14 py-20 lg:py-28`}>
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-10 lg:mb-14">
          <p className={`${eyebrowClass} text-[13px] tracking-[0.22em] uppercase mb-4`}>
            {eyebrow}
          </p>
          <h2 className={`${titleClass} text-[clamp(28px,3vw,46px)] font-light tracking-[-0.02em] leading-[1.1]`}>
            {title}
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[3px] lg:gap-1">
          {images.map((img, i) => {
            const spanClass =
              img.span === "wide"
                ? "col-span-2 row-span-1"
                : img.span === "tall"
                ? "col-span-1 row-span-2"
                : "col-span-1 row-span-1";

            const aspectClass =
              img.span === "wide"
                ? "aspect-[2.2/1]"
                : img.span === "tall"
                ? "aspect-[1/1.8]"
                : "aspect-square";

            return (
              <div
                key={i}
                className={`${spanClass} relative group overflow-hidden cursor-pointer`}
                onMouseEnter={() => setActiveImg(i)}
                onMouseLeave={() => setActiveImg(null)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={1800}
                  height={1200}
                  className={`w-full h-full object-cover ${aspectClass} transition-all duration-700 ease-out ${
                    activeImg === i
                      ? "scale-[1.04] brightness-[0.6]"
                      : "brightness-[0.85] saturate-[0.8]"
                  }`}
                  loading="lazy"
                />

                {/* Hover caption overlay */}
                <div
                  className={`absolute inset-0 flex items-end p-5 lg:p-6 transition-opacity duration-400 ${
                    activeImg === i ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className={`${captionBg} px-4 py-3 max-w-full`}>
                    <p className="text-parchment text-[13px] lg:text-[14px] font-light tracking-[-0.01em] leading-[1.5]">
                      {img.caption}
                    </p>
                  </div>
                </div>

                {/* Subtle corner accent on hover */}
                <div
                  className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-volt-bright transition-opacity duration-300 ${
                    activeImg === i ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
