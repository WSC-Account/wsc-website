/**
 * FacilityGallery — Full-width immersive photo gallery
 * Masonry-style layout with persistent captions for mouse, keyboard, and touch
 * Used on homepage and about page for visual impact
 */
import ResponsiveImage from "@/components/ResponsiveImage";

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
              <figure
                key={i}
                className={`${spanClass} relative group overflow-hidden`}
              >
                <ResponsiveImage
                  src={img.src}
                  alt={img.alt}
                  className={`w-full h-full object-cover ${aspectClass} brightness-[0.85] saturate-[0.8] transition-transform duration-700 ease-out group-hover:scale-[1.04]`}
                  loading="lazy"
                />

                <figcaption className="absolute inset-x-0 bottom-0 p-3 lg:p-6">
                  <div className={`${captionBg} px-4 py-3 max-w-full`}>
                    <p className="text-parchment text-[13px] lg:text-[14px] font-light tracking-[-0.01em] leading-[1.5]">
                      {img.caption}
                    </p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
