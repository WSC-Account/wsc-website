export type CookieConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

export const CONSENT_STORAGE_KEY = "wsc-cookie-consent";
export const CONSENT_CHANGED_EVENT = "wsc-cookie-consent-changed";
export const OPEN_COOKIE_PREFERENCES_EVENT = "wsc-open-cookie-preferences";
const DENIED = { analytics: false, marketing: false };
let temporaryConsent: CookieConsentState | null = null;
let preferencesRequested = false;

export function readStoredConsent(): CookieConsentState | null {
  if (typeof window === "undefined") return null;
  if (temporaryConsent) return temporaryConsent;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.analytics !== "boolean" ||
      typeof parsed?.marketing !== "boolean"
    )
      return null;
    return {
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      timestamp: typeof parsed.timestamp === "string" ? parsed.timestamp : "",
    };
  } catch {
    return null;
  }
}

export function getCookieConsent() {
  return readStoredConsent() ?? DENIED;
}

export function canUseGoogleTracking(consent = getCookieConsent()) {
  // The published Google tags link Analytics and Ads destinations. Until those
  // account settings are separated and verified, loading either tag can start
  // both products. Keep the visitor's choices independent for other services.
  return consent.analytics && consent.marketing;
}

export function googleConsentSettings(
  consent: Pick<CookieConsentState, "analytics" | "marketing">
) {
  const googleAllowed = canUseGoogleTracking(consent);
  return {
    analytics_storage: googleAllowed ? "granted" : "denied",
    ad_storage: googleAllowed ? "granted" : "denied",
    ad_user_data: googleAllowed ? "granted" : "denied",
    ad_personalization: googleAllowed ? "granted" : "denied",
  };
}

export function applyGoogleConsent(consent = getCookieConsent()) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try {
      window.gtag("consent", "update", googleConsentSettings(consent));
    } catch {
      /* Preferences still apply if the SDK fails. */
    }
  }
}

export function saveCookieConsent(
  preferences: Pick<CookieConsentState, "analytics" | "marketing">
) {
  const previous = getCookieConsent();
  const consent: CookieConsentState = {
    ...preferences,
    necessary: true,
    timestamp: new Date().toISOString(),
  };
  let persisted = false;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    temporaryConsent = null;
    persisted = true;
  } catch {
    // Storage restrictions must not prevent a visitor from choosing preferences.
    temporaryConsent = consent;
  }
  applyGoogleConsent(consent);
  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGED_EVENT, { detail: consent })
  );
  return (
    persisted &&
    ((previous.analytics && !consent.analytics) ||
      (previous.marketing && !consent.marketing))
  );
}

export function openCookiePreferences() {
  preferencesRequested = true;
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
}

export function consumeCookiePreferencesRequest() {
  const requested = preferencesRequested;
  preferencesRequested = false;
  return requested;
}
