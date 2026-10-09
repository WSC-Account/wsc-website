import type { ImgHTMLAttributes } from "react";
import { imageDimensionsFor, responsiveAvifSrcSet, responsiveWebpSrcSet } from "@/lib/responsive-image";

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes"> & {
  src: string;
  sizes?: string;
  pictureClassName?: string;
  media?: string;
};

export default function ResponsiveImage({
  src,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  pictureClassName = "block",
  media,
  width,
  height,
  ...imageProps
}: ResponsiveImageProps) {
  const dimensions = imageDimensionsFor(src);
  const avif = responsiveAvifSrcSet(src);
  const webp = responsiveWebpSrcSet(src);

  const image = (
    <img
      src={media ? "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" : src}
      width={width ?? dimensions.width}
      height={height ?? dimensions.height}
      {...imageProps}
    />
  );

  if (!avif && !webp && !media) return image;

  return (
    <picture className={pictureClassName}>
      {avif && <source type="image/avif" media={media} srcSet={avif} sizes={sizes} />}
      {webp && <source type="image/webp" media={media} srcSet={webp} sizes={sizes} />}
      {media && <source media={media} srcSet={src} />}
      {image}
    </picture>
  );
}
