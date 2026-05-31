type ImageDimensions = {
  width: number;
  height: number;
};

const DEFAULT_IMAGE_DIMENSIONS: ImageDimensions = {
  width: 1800,
  height: 1200,
};

const WSC_IMAGE_DIMENSIONS = {
  "/images/wsc/apl-training.webp": { width: 1185, height: 1800 },
  "/images/wsc/campus-dome.webp": { width: 1800, height: 1202 },
  "/images/wsc/campus-sunset.webp": { width: 1800, height: 1038 },
  "/images/wsc/contact-campus.webp": { width: 1800, height: 1200 },
  "/images/wsc/fitness-center-hero.webp": { width: 600, height: 350 },
  "/images/wsc/golf-instructors-swing-lab.webp": { width: 768, height: 1024 },
  "/images/wsc/golf-practice-area.webp": { width: 1800, height: 1200 },
  "/images/wsc/golf-range-aerial.webp": { width: 1800, height: 1170 },
  "/images/wsc/golf-range-baskets.webp": { width: 1800, height: 1350 },
  "/images/wsc/golf-range-field.webp": { width: 1350, height: 1800 },
  "/images/wsc/golf-range-sunset.webp": { width: 1800, height: 1350 },
  "/images/wsc/gym-floor.webp": { width: 1800, height: 1350 },
  "/images/wsc/gym-main.webp": { width: 1800, height: 1350 },
  "/images/wsc/junior-golf-academy-group.webp": { width: 1800, height: 1200 },
  "/images/wsc/pickleball-action.webp": { width: 1800, height: 1200 },
  "/images/wsc/pickleball-dome.webp": { width: 1800, height: 1149 },
  "/images/wsc/pickleball-ready-position.webp": { width: 1200, height: 1800 },
  "/images/wsc/pickleball-serve-action.webp": { width: 1200, height: 1800 },
  "/images/wsc/pickleball-tournament-finalists.webp": { width: 1800, height: 1200 },
  "/images/wsc/pickleball-tournament-podium.webp": { width: 1800, height: 1200 },
  "/images/wsc/pickleball-tournament-winners.webp": { width: 1800, height: 1200 },
  "/images/wsc/racket-stringing.webp": { width: 1500, height: 1245 },
  "/images/wsc/summer-camp.webp": { width: 1388, height: 1667 },
  "/images/wsc/swing-lab-junior-practice.webp": { width: 768, height: 1024 },
  "/images/wsc/swing-lab-private-lesson.webp": { width: 768, height: 1024 },
  "/images/wsc/swing-lab-simulators.webp": { width: 1800, height: 1350 },
  "/images/wsc/tennis-courts.webp": { width: 1800, height: 1218 },
  "/images/wsc/tennis-player.webp": { width: 1800, height: 1200 },
} as const satisfies Record<string, ImageDimensions>;

const RESPONSIVE_MAX_DIMENSIONS = [900, 1200] as const;

function imageSlug(src: string) {
  const match = src.match(/^\/images\/wsc\/([^/]+)\.webp$/);
  return match?.[1];
}

function responsiveVariant(src: string, maxDimension: (typeof RESPONSIVE_MAX_DIMENSIONS)[number], format: "webp" | "avif") {
  const slug = imageSlug(src);
  if (!slug) return src;
  return `/images/wsc/responsive/${slug}-${maxDimension}.${format}`;
}

function fullAvifVariant(src: string) {
  const slug = imageSlug(src);
  if (!slug) return src;
  return `/images/wsc/responsive/${slug}-full.avif`;
}

function variantWidthForMaxDimension(src: string, maxDimension: number) {
  const { width, height } = imageDimensionsFor(src);
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  return Math.round(width * scale);
}

function buildSrcSet(candidates: { src: string; width: number }[]) {
  const byWidth = new Map<number, string>();

  for (const candidate of candidates) {
    if (!candidate.src || candidate.width <= 0) continue;
    byWidth.set(candidate.width, `${candidate.src} ${candidate.width}w`);
  }

  return Array.from(byWidth.entries())
    .sort(([a], [b]) => a - b)
    .map(([, candidate]) => candidate)
    .join(", ");
}

export function imageDimensionsFor(src: string): ImageDimensions {
  return WSC_IMAGE_DIMENSIONS[src as keyof typeof WSC_IMAGE_DIMENSIONS] ?? DEFAULT_IMAGE_DIMENSIONS;
}

export function responsiveWebpSrcSet(src: string) {
  if (!src.endsWith(".webp")) return undefined;
  const original = imageDimensionsFor(src);

  return buildSrcSet([
    ...RESPONSIVE_MAX_DIMENSIONS.map((maxDimension) => ({
      src: responsiveVariant(src, maxDimension, "webp"),
      width: variantWidthForMaxDimension(src, maxDimension),
    })),
    { src, width: original.width },
  ]);
}

export function responsiveAvifSrcSet(src: string) {
  if (!src.endsWith(".webp")) return undefined;
  const original = imageDimensionsFor(src);

  return buildSrcSet([
    ...RESPONSIVE_MAX_DIMENSIONS.map((maxDimension) => ({
      src: responsiveVariant(src, maxDimension, "avif"),
      width: variantWidthForMaxDimension(src, maxDimension),
    })),
    { src: fullAvifVariant(src), width: original.width },
  ]);
}
