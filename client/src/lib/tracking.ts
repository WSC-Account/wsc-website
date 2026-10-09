import { canUseGoogleTracking } from "./consent";
import { GA4_MEASUREMENT_ID } from "./tracking-config";

type EventParameters = Record<string, unknown>;

export function trackAnalyticsEvent(name: string, parameters: EventParameters) {
  if (
    typeof window === "undefined" ||
    !canUseGoogleTracking() ||
    !GA4_MEASUREMENT_ID ||
    typeof window.gtag !== "function"
  )
    return false;
  try {
    window.gtag("event", name, { ...parameters, send_to: GA4_MEASUREMENT_ID });
    return true;
  } catch {
    return false; // Tracking must never change a completed customer action.
  }
}

export function trackAdvertisingConversion(
  sendTo: string,
  parameters: EventParameters = {}
) {
  if (
    typeof window === "undefined" ||
    !canUseGoogleTracking() ||
    typeof window.gtag !== "function"
  )
    return false;
  try {
    window.gtag("event", "conversion", { ...parameters, send_to: sendTo });
    return true;
  } catch {
    return false;
  }
}
