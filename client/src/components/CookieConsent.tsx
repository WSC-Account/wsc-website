/*
 * Cookie Consent Banner — GDPR / CCPA Compliant
 * Full-width bottom banner with accept, decline, and manage preferences.
 * Persists consent state in localStorage. Shows only once until cleared.
 * Design: dark bg matching WSC footer, volt-bright accent, minimal type.
 */
import { useState, useEffect, useCallback } from "react";
import { X, Cookie, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = "wsc-cookie-consent";

function getStoredConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

function storeConsent(consent: ConsentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(
    new CustomEvent("wsc-cookie-consent-changed", { detail: consent }),
  );
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Small delay so the banner doesn't flash on initial load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = useCallback((consent: ConsentState) => {
    storeConsent(consent);
    setVisible(false);
  }, []);

  const acceptAll = () => {
    dismiss({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
  };

  const declineAll = () => {
    dismiss({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
  };

  const savePreferences = () => {
    dismiss({
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    });
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed bottom-3 left-3 right-3 z-[60] animate-in slide-in-from-bottom duration-500 lg:left-auto lg:right-6 lg:w-[min(430px,calc(100vw-48px))]"
    >
      <div className="border border-white/[0.08] bg-dark-bg/[0.97] shadow-2xl backdrop-blur-md">
        <div className="px-4 py-3.5 sm:px-5 lg:py-4">
          {/* Main row */}
          <div className="flex flex-col gap-3">
            {/* Icon + Text */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-dark-mid border border-white/[0.06] shrink-0 mt-0.5">
                <Cookie size={18} className="text-volt-bright" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="pr-9 text-parchment text-[13px] font-light leading-[1.45] mb-1 lg:text-[14px] lg:leading-[1.55]">
                  We use cookies to improve the site and understand traffic.
                </p>
                <p className="hidden text-parchment/70 text-[12px] leading-[1.6]">
                  By clicking "Accept All," you consent to our use of cookies. You can manage your preferences or decline non-essential cookies.{" "}
                  <Link
                    href="/policies#privacy"
                    className="text-volt-bright/80 no-underline hover:text-volt-bright transition-colors duration-200 border-b border-volt-bright/30 pb-[1px]"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 sm:gap-3">
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-parchment/80 text-[11px] tracking-[0.1em] uppercase no-underline hover:text-parchment transition-colors duration-200 flex items-center gap-1.5 min-h-[40px] px-2 sm:min-h-[44px]"
                aria-expanded={expanded}
                aria-controls={expanded ? "cookie-preferences" : undefined}
              >
                Manage
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
              <button
                type="button"
                onClick={declineAll}
                className="text-[11px] tracking-[0.12em] uppercase text-parchment border border-parchment/25 px-4 py-2 min-h-[40px] hover:bg-parchment/10 transition-colors duration-200 sm:min-h-[44px] sm:px-5 sm:py-2.5"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="text-[11px] tracking-[0.12em] uppercase text-dark-bg bg-volt-bright px-5 py-2 min-h-[40px] hover:bg-parchment transition-colors duration-200 sm:min-h-[44px] sm:px-6 sm:py-2.5"
              >
                Accept All
              </button>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={declineAll}
              className="absolute top-2 right-2 text-parchment/80 hover:text-parchment transition-colors duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Close cookie banner and decline non-essential cookies"
            >
              <X size={16} />
            </button>
          </div>

          {/* Expanded preferences panel */}
          {expanded && (
            <div
              id="cookie-preferences"
              className="mt-4 pt-4 border-t border-white/[0.06] lg:mt-6 lg:pt-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6">
                {/* Necessary — always on */}
                <div className="bg-dark-mid p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-parchment text-[12px] tracking-[0.1em] uppercase">Necessary</span>
                    <span className="text-volt-bright text-[12px] tracking-[0.12em] uppercase">Always On</span>
                  </div>
                  <p className="text-parchment/70 text-[12px] leading-[1.65]">
                    Essential cookies that enable core site functionality like navigation, security, and accessibility preferences.
                  </p>
                </div>

                {/* Analytics */}
                <div className="bg-dark-mid p-5">
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="cookie-analytics" className="text-parchment text-[12px] tracking-[0.1em] uppercase cursor-pointer">
                      Analytics
                    </label>
                    <button
                      type="button"
                      id="cookie-analytics"
                      role="switch"
                      aria-checked={analytics}
                      aria-label="Allow analytics cookies"
                      onClick={() => setAnalytics(!analytics)}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                        analytics ? "bg-volt-bright" : "bg-parchment/20"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-parchment transition-transform duration-200 ${
                          analytics ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-parchment/70 text-[12px] leading-[1.65]">
                    Help us understand how visitors interact with our website by collecting anonymous usage data.
                  </p>
                </div>

                {/* Marketing */}
                <div className="bg-dark-mid p-5">
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="cookie-marketing" className="text-parchment text-[12px] tracking-[0.1em] uppercase cursor-pointer">
                      Marketing
                    </label>
                    <button
                      type="button"
                      id="cookie-marketing"
                      role="switch"
                      aria-checked={marketing}
                      aria-label="Allow marketing cookies"
                      onClick={() => setMarketing(!marketing)}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                        marketing ? "bg-volt-bright" : "bg-parchment/20"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-parchment transition-transform duration-200 ${
                          marketing ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-parchment/70 text-[12px] leading-[1.65]">
                    Used to deliver relevant advertisements and track campaign effectiveness across platforms.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={savePreferences}
                  className="text-[11px] tracking-[0.12em] uppercase text-dark-bg bg-volt-bright px-6 py-2.5 min-h-[44px] hover:bg-parchment transition-colors duration-200"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
