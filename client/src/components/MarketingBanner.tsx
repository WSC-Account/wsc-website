/**
 * Marketing Banner — Sits between the contact top bar and main nav.
 * LIGHT background so it POPS against the dark nav and top bar.
 * Tier 1 Sports messaging front and center.
 *
 * MOBILE-FIRST: Stacks vertically on small screens, horizontal on sm+.
 * TO UPDATE: Change the DEFAULT values below. That's it.
 */
import { useState } from "react";
import { X, ArrowRight, Star } from "lucide-react";
import { Link } from "wouter";

/* ─── DEFAULT BANNER CONTENT (edit here to update site-wide) ─── */
const DEFAULTS = {
  badge: "Tier 1 Sports",
  headline: "Home to World-Class Programming",
  description:
    "Tier 1 is one of the leading developmental programs in the country — now in tennis, golf, and athletic performance at WSC.",
  ctaLabel: "Explore Tier 1 Programs",
  ctaHref: "https://www.tier1nw.com",
  external: true,
};

interface MarketingBannerProps {
  badge?: string;
  headline?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  external?: boolean;
}

export default function MarketingBanner({
  badge = DEFAULTS.badge,
  headline = DEFAULTS.headline,
  description = DEFAULTS.description,
  ctaLabel = DEFAULTS.ctaLabel,
  ctaHref = DEFAULTS.ctaHref,
  external = DEFAULTS.external,
}: MarketingBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const ctaContent = (
    <span className="inline-flex items-center gap-1.5 bg-[#161310] text-white px-4 sm:px-5 py-2 text-[10px] sm:text-[11px] tracking-[0.14em] uppercase font-medium hover:bg-volt-bright hover:text-dark-bg transition-colors duration-200 whitespace-nowrap">
      {ctaLabel}
      <ArrowRight size={12} />
    </span>
  );

  return (
    <div className="relative bg-gradient-to-r from-[#e8dfd4] via-[#f2ece4] to-[#e8dfd4]">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-volt-bright to-transparent" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-14 py-2.5 sm:py-3">
        {/* Dismiss button — mobile only (absolute top-right so it doesn't crowd content) */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="sm:hidden absolute top-2.5 right-3 text-[#161310]/30 hover:text-[#161310]/70 transition-colors duration-200 p-1 z-10"
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>

        {/* Layout: stacked on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 pr-8 sm:pr-0">
          {/* Left: badge + text content */}
          <div className="flex items-start sm:items-center gap-3 lg:gap-6 min-w-0">
            {/* Badge — hidden on mobile, shown on sm+ */}
            {badge && (
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-volt-bright/20 text-[#161310] text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 border border-volt/40 shrink-0 whitespace-nowrap">
                <Star size={9} className="text-volt fill-volt" />
                {badge}
              </span>
            )}
            <div className="min-w-0">
              {/* Mobile-only inline badge */}
              <p className="sm:hidden text-[#161310]/60 text-[9px] tracking-[0.16em] uppercase mb-0.5 flex items-center gap-1">
                <Star size={8} className="text-volt fill-volt" />
                {badge}
              </p>
              <p className="text-[#161310] text-[12px] sm:text-[13px] md:text-[14px] font-medium tracking-[-0.01em] leading-tight">
                {headline}
              </p>
              {description && (
                <p className="hidden md:block text-[#161310]/70 text-[11px] tracking-[0.02em] mt-0.5 truncate">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right: CTA + dismiss */}
          <div className="flex items-center gap-3 shrink-0">
            {external ? (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                {ctaContent}
              </a>
            ) : (
              <Link href={ctaHref} className="no-underline">
                {ctaContent}
              </Link>
            )}
            {/* Desktop dismiss — visible on sm+ only */}
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="hidden sm:block text-[#161310]/30 hover:text-[#161310]/70 transition-colors duration-200 p-1"
              aria-label="Dismiss banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#161310]/10" />
    </div>
  );
}
