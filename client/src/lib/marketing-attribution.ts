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

export function getMarketingAttribution(): MarketingAttribution | null {
  if (typeof window === "undefined") return null;

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
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, {
    ...parameters,
    ...getMarketingAttribution(),
  });
}

export function marketingAttributionMetadata() {
  const attribution = getMarketingAttribution();
  if (!attribution) return {};

  return Object.fromEntries(
    Object.entries(attribution).map(([key, value]) => [`marketing_${key}`, value]),
  );
}

