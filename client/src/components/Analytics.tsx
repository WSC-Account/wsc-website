import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const CONSENT_STORAGE_KEY = "wsc-cookie-consent";
const ANALYTICS_SCRIPT_ID = "wsc-analytics-script";
const GA4_SCRIPT_ID = "wsc-ga4-script";
const GTM_SCRIPT_ID = "wsc-gtm-script";
const GTM_CONTAINER_ID = import.meta.env.VITE_GTM_CONTAINER_ID || "GTM-PKPNJDFR";
const GA4_MEASUREMENT_ID =
  import.meta.env.NEXT_PUBLIC_GA_ID || import.meta.env.VITE_GA4_MEASUREMENT_ID || "G-S6448TRP0T";

function hasAnalyticsConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { analytics?: boolean };
    return parsed.analytics === true;
  } catch {
    return false;
  }
}

function removeAnalyticsScript() {
  document.getElementById(ANALYTICS_SCRIPT_ID)?.remove();
  document.getElementById(GA4_SCRIPT_ID)?.remove();
  document.getElementById(GTM_SCRIPT_ID)?.remove();
}

function isConfigured(value: string) {
  return value.length > 0 && !value.includes("REPLACE_ME") && !value.includes("PLACEHOLDER");
}

export default function Analytics() {
  const [location] = useLocation();
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const lastGa4PageView = useRef<string | null>(null);

  useEffect(() => {
    const syncConsent = () => setAnalyticsAllowed(hasAnalyticsConsent());

    syncConsent();
    window.addEventListener("wsc-cookie-consent-changed", syncConsent);

    return () => {
      window.removeEventListener("wsc-cookie-consent-changed", syncConsent);
    };
  }, []);

  useEffect(() => {
    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
    const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

    const syncAnalytics = () => {
      if (!endpoint || !websiteId) {
        return;
      }

      if (!hasAnalyticsConsent()) {
        removeAnalyticsScript();
        return;
      }

      if (document.getElementById(ANALYTICS_SCRIPT_ID)) {
        return;
      }

      const script = document.createElement("script");
      script.id = ANALYTICS_SCRIPT_ID;
      script.defer = true;
      script.src = `${endpoint.replace(/\/$/, "")}/umami`;
      script.dataset.websiteId = websiteId;
      document.body.appendChild(script);
    };

    const syncGa4 = () => {
      if (!analyticsAllowed || !isConfigured(GA4_MEASUREMENT_ID)) {
        document.getElementById(GA4_SCRIPT_ID)?.remove();
        return;
      }

      if (document.getElementById(GA4_SCRIPT_ID)) return;

      window.dataLayer = window.dataLayer || [];
      window.gtag =
        window.gtag ||
        function gtag() {
          window.dataLayer.push(arguments);
        };
      window.gtag("js", new Date());
      window.gtag("config", GA4_MEASUREMENT_ID, {
        page_path: location,
        page_location: window.location.href,
        page_title: document.title,
      });
      lastGa4PageView.current = location;

      const script = document.createElement("script");
      script.id = GA4_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
      document.body.appendChild(script);
    };

    const syncGtm = () => {
      if (!analyticsAllowed || !isConfigured(GTM_CONTAINER_ID)) {
        document.getElementById(GTM_SCRIPT_ID)?.remove();
        return;
      }

      if (document.getElementById(GTM_SCRIPT_ID)) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

      const script = document.createElement("script");
      script.id = GTM_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
      document.body.appendChild(script);
    };

    if (!analyticsAllowed) {
      removeAnalyticsScript();
      return;
    }

    syncAnalytics();
    syncGtm();
    syncGa4();
  }, [analyticsAllowed, location]);

  useEffect(() => {
    if (!analyticsAllowed || !isConfigured(GA4_MEASUREMENT_ID)) return;
    if (typeof window.gtag !== "function") return;
    if (lastGa4PageView.current === location) return;

    window.gtag("config", GA4_MEASUREMENT_ID, {
      page_path: location,
      page_location: window.location.href,
      page_title: document.title,
    });
    lastGa4PageView.current = location;
  }, [analyticsAllowed, location]);

  if (!analyticsAllowed) return null;

  return (
    <VercelAnalytics
      mode={import.meta.env.DEV ? "development" : "production"}
      path={location}
      route={location}
    />
  );
}
