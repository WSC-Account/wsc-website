type TrackingEnvironment = {
  NEXT_PUBLIC_GA_ID?: string;
  VITE_GA4_MEASUREMENT_ID?: string;
};

export function resolveAnalyticsMeasurementId(env: TrackingEnvironment) {
  const id = (
    env.NEXT_PUBLIC_GA_ID ||
    env.VITE_GA4_MEASUREMENT_ID ||
    "G-S6448TRP0T"
  ).trim();
  // An explicitly invalid value disables Analytics routing. Never omit send_to
  // and fall back to Google's default group, which includes linked Ads accounts.
  return /^G-[A-Z0-9]+$/.test(id) && !/REPLACE|PLACEHOLDER/.test(id)
    ? id
    : null;
}

export const GA4_MEASUREMENT_ID = resolveAnalyticsMeasurementId({
  NEXT_PUBLIC_GA_ID: import.meta.env?.NEXT_PUBLIC_GA_ID,
  VITE_GA4_MEASUREMENT_ID: import.meta.env?.VITE_GA4_MEASUREMENT_ID,
});
