import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { GA4_MEASUREMENT_ID } from "@/lib/tracking-config";
import {
  applyGoogleConsent,
  canUseGoogleTracking,
  CONSENT_CHANGED_EVENT,
  CONSENT_STORAGE_KEY,
  getCookieConsent,
  googleConsentSettings,
} from "@/lib/consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GTM_CONTAINER_ID =
  import.meta.env.VITE_GTM_CONTAINER_ID || "GTM-PKPNJDFR";
const GOOGLE_ADS_ID = "AW-18217215416";

function configured(value: string) {
  return (
    value.length > 0 &&
    !value.includes("REPLACE_ME") &&
    !value.includes("PLACEHOLDER")
  );
}

function addScript(id: string, src: string, websiteId?: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  if (websiteId) script.dataset.websiteId = websiteId;
  document.body.appendChild(script);
}

export default function Analytics() {
  const [location] = useLocation();
  const [consent, setConsent] = useState(getCookieConsent);
  const gaConfigured = useRef(false);
  const adsConfigured = useRef(false);
  const lastPageView = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => setConsent(getCookieConsent());
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    const syncOtherTab = (event: StorageEvent) => {
      if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) return;
      applyGoogleConsent();
      window.location.reload();
    };
    window.addEventListener("storage", syncOtherTab);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
      window.removeEventListener("storage", syncOtherTab);
    };
  }, []);

  useEffect(() => {
    if (GA4_MEASUREMENT_ID) {
      (window as unknown as Record<string, unknown>)[
        `ga-disable-${GA4_MEASUREMENT_ID}`
      ] = !canUseGoogleTracking(consent);
    }
    // Public Google configuration currently links Analytics to Ads and Ads to
    // Analytics. Script-level product gating alone cannot separate them.
    if (!canUseGoogleTracking(consent)) {
      applyGoogleConsent(consent);
      return;
    }

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag(
        "consent",
        "default",
        googleConsentSettings({ analytics: false, marketing: false })
      );
      window.gtag("js", new Date());
    }
    applyGoogleConsent(consent);
    addScript(
      "wsc-google-script",
      `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID || GOOGLE_ADS_ID}`
    );

    if (consent.analytics && GA4_MEASUREMENT_ID && !gaConfigured.current) {
      window.gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false });
      gaConfigured.current = true;
    }
    if (consent.marketing && !adsConfigured.current) {
      window.gtag("config", GOOGLE_ADS_ID);
      adsConfigured.current = true;
    }
    // The shared Google gate above also covers advertising tags inside GTM.
    if (
      consent.marketing &&
      configured(GTM_CONTAINER_ID) &&
      !document.getElementById("wsc-gtm-script")
    ) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      addScript(
        "wsc-gtm-script",
        `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`
      );
    }
  }, [consent.analytics, consent.marketing]);

  useEffect(() => {
    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
    const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
    if (consent.analytics && endpoint && websiteId) {
      addScript(
        "wsc-analytics-script",
        `${endpoint.replace(/\/$/, "")}/umami`,
        websiteId
      );
    }
  }, [consent.analytics]);

  useEffect(() => {
    if (
      !canUseGoogleTracking(consent) ||
      !GA4_MEASUREMENT_ID ||
      typeof window.gtag !== "function"
    )
      return;
    if (lastPageView.current === location) return;
    window.gtag("event", "page_view", {
      send_to: GA4_MEASUREMENT_ID,
      page_path: location,
      // Do not forward campaign identifiers when marketing consent is declined.
      page_location: consent.marketing
        ? window.location.href
        : `${window.location.origin}${location}`,
      page_title: document.title,
    });
    lastPageView.current = location;
  }, [consent.analytics, consent.marketing, location]);

  return consent.analytics ? (
    <VercelAnalytics
      mode={import.meta.env.DEV ? "development" : "production"}
      path={location}
      route={location}
      beforeSend={event => {
        const current = getCookieConsent();
        if (!current.analytics) return null;
        if (current.marketing) return event;
        const url = new URL(event.url);
        return { ...event, url: `${url.origin}${url.pathname}` };
      }}
    />
  ) : null;
}
