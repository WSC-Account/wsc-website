import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  robots?: "index, follow" | "noindex, follow";
}

const BASE_URL = "https://www.woodinvillesportsclub.com";
const DEFAULT_IMAGE = "/images/wsc/campus-dome.webp";
const SITE_NAME = "Woodinville Sports Club";

function absoluteUrl(value: string) {
  return value.startsWith("http") ? value : `${BASE_URL}${value}`;
}

/**
 * Sets per-page <title>, meta description, canonical URL, and OG/Twitter tags.
 * Cleans up on unmount by restoring defaults.
 */
export default function SEOHead({ title, description, path, image, robots = "index, follow" }: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${BASE_URL}${path}`;
    const ogImage = absoluteUrl(image || DEFAULT_IMAGE);

    // Title
    document.title = fullTitle;

    // Helper to set or create a meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Meta description
    setMeta("name", "description", description);
    setMeta("name", "robots", robots);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);

    // Twitter
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);
    setMeta("name", "twitter:card", "summary_large_image");

    // Cleanup: restore homepage defaults on unmount
    return () => {
      document.title = `${SITE_NAME} | Tennis, Golf, Pickleball & Athletic Performance | Woodinville, WA`;
      setMeta("name", "description", "Woodinville Sports Club is a 67-acre campus for tennis, golf, pickleball, gym, APL training, camps, events, and family programs in Woodinville, WA.");
      setMeta("name", "robots", "index, follow");
      if (canonical) canonical.setAttribute("href", `${BASE_URL}/`);
      setMeta("property", "og:url", `${BASE_URL}/`);
      setMeta("property", "og:title", `Woodinville Sports Campus | ${SITE_NAME}`);
      setMeta("property", "og:description", "Woodinville Sports Club is a 67-acre campus for tennis, golf, pickleball, gym, APL training, camps, events, and family programs in Woodinville, WA.");
      setMeta("property", "og:image", absoluteUrl(DEFAULT_IMAGE));
      setMeta("name", "twitter:title", `Woodinville Sports Campus | ${SITE_NAME}`);
      setMeta("name", "twitter:description", "Woodinville Sports Club is a 67-acre campus for tennis, golf, pickleball, gym, APL training, camps, events, and family programs in Woodinville, WA.");
      setMeta("name", "twitter:image", absoluteUrl(DEFAULT_IMAGE));
    };
  }, [title, description, path, image, robots]);

  return null;
}
