import { readFileSync } from "node:fs";
import { SEO } from "../../client/src/lib/seo-data";

type RouteMetadata = {
  image: string;
  staticShell: boolean;
  sitemap: false | { changefreq: "weekly" | "monthly" | "yearly"; priority: string };
  utilityHeader?: { eyebrow: string; headline: string };
};

export const routeMetadata = JSON.parse(
  readFileSync(new URL("../../shared/route-metadata.json", import.meta.url), "utf8")
) as Record<keyof typeof SEO, RouteMetadata>;

// SEO owns canonical paths and indexability; the manifest owns build-only presentation and inclusion.
export const pageRoutes = (Object.keys(SEO) as (keyof typeof SEO)[]).map(key => ({
  key,
  ...SEO[key],
  ...routeMetadata[key],
}));
