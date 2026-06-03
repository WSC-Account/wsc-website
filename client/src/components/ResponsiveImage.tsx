import type { ImgHTMLAttributes } from "react";
import { imageDimensionsFor, responsiveAvifSrcSet, responsiveWebpSrcSet } from "@/lib/responsive-image";

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes"> & {
  src: string;
  sizes?: string;
  pictureClassName?: string;
};

export default function ResponsiveImage({
  src,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  pictureClassName = "block",
  width,
  height,
  ...imageProps
}: ResponsiveImageProps) {
  const dimensions = imageDimensionsFor(src);
  const avif = responsiveAvifSrcSet(src);
  const webp = responsiveWebpSrcSet(src);

  const image = (
    <img
      src={src}
      width={width ?? dimensions.width}
      height={height ?? dimensions.height}
      {...imageProps}
    />
  );

  if (!avif && !webp) return image;

  return (
    <picture className={pictureClassName}>
      {avif && <source type="image/avif" srcSet={avif} sizes={sizes} />}
      {webp && <source type="image/webp" srcSet={webp} sizes={sizes} />}
      {image}
    </picture>
  );
}
