import React from "react";
import HomeHero from "./HomeHero";
import {
  COURT_RESERVE_PORTAL_URL,
  TIER_1_TENNIS_URL,
} from "../lib/booking-links";

const links = [
  { href: "/tennis", label: "Tennis" },
  { href: TIER_1_TENNIS_URL, label: "Tier 1 Tennis" },
  { href: "/membership", label: "Membership" },
  { href: "/contact", label: "Contact" },
];

// Build-only navigation has no closed menus or controls that require JavaScript.
// The application replaces this shell once it is ready.
export default function HomeFallback() {
  return (
    <div className="home-page min-h-screen font-normal">
      <header className="bg-dark-bg text-parchment">
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-between gap-6 border-b border-white/[0.08] px-6 py-3.5 lg:px-14 lg:py-3"
        >
          <a href="/" aria-label="Woodinville Sports Club home">
            <img
              src="/logo-small.png"
              alt="Woodinville Sports Club"
              width={240}
              height={120}
              className="block h-8 w-auto object-contain sm:h-9"
            />
          </a>
          <div className="hidden items-center gap-6 lg:flex">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="py-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-parchment no-underline hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href={COURT_RESERVE_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center bg-volt-bright px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-dark-bg no-underline hover:bg-parchment lg:px-6"
          >
            Book / Register
          </a>
        </nav>
      </header>
      <main id="main-content">
        <HomeHero headerOffset={false} />
        <nav
          aria-label="Explore the club"
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 bg-parchment px-6 py-8"
        >
          {links.map(link => (
            <a key={link.href} href={link.href} className="home-text-link">
              {link.label}
            </a>
          ))}
        </nav>
      </main>
    </div>
  );
}
