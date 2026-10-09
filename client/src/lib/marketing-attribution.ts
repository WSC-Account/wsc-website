import { getCookieConsent } from "./consent";
import { trackAnalyticsEvent } from "./tracking";

export type MarketingAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  landing_page: string;
  referrer?: string;
};

const STORAGE_KEY = "wsc-marketing-attribution";
const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
] as const;

export function captureMarketingAttribution() {
  if (typeof window === "undefined") return;
  if (!getCookieConsent().marketing) {
    clearMarketingAttribution();
    return;
  }

  const url = new URL(window.location.href);
  const hasCampaign = CAMPAIGN_KEYS.some((key) => url.searchParams.has(key));
  if (!hasCampaign) return;

  const attribution: MarketingAttribution = {
    landing_page: `${url.pathname}${url.search}${url.hash}`,
  };

  for (const key of CAMPAIGN_KEYS) {
    const value = url.searchParams.get(key)?.trim();
    if (value) attribution[key] = value;
  }

  if (document.referrer) attribution.referrer = document.referrer;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution is helpful, but it should never prevent the site from working.
  }
}

export function clearMarketingAttribution() {
  try { window.sessionStorage.removeItem(STORAGE_KEY); } catch { /* Storage is optional. */ }
}

export function getMarketingAttribution(): MarketingAttribution | null {
  if (typeof window === "undefined" || !getCookieConsent().marketing) return null;

  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    return JSON.parse(value) as MarketingAttribution;
  } catch {
    return null;
  }
}

export function trackMarketingEvent(
  eventName: string,
  parameters: Record<string, string | number | boolean | undefined>,
) {
  const safeParameters = { ...parameters };
  if (!getCookieConsent().marketing && typeof safeParameters.link_url === "string") {
    try {
      const link = new URL(safeParameters.link_url);
      if (link.protocol === "https:" || link.protocol === "http:") {
        safeParameters.link_url = `${link.origin}${link.pathname}`;
      }
    } catch { /* Non-URL event data does not need URL processing. */ }
  }
  trackAnalyticsEvent(eventName, { ...safeParameters, ...getMarketingAttribution() });
}

export function marketingAttributionMetadata() {
  const attribution = getMarketingAttribution();
  if (!attribution) return {};

  return Object.fromEntries(
    Object.entries(attribution).map(([key, value]) => [`marketing_${key}`, value]),
  );
}

