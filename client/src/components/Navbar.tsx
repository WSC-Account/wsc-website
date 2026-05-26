/*
 * 4B Design: Dark nav bar (#161310), Inter 500 logo, 12px uppercase links
 * Volt-bright CTA button, subtle border-bottom on nav-inner
 * Simplified: Fitness Centers is now a single link (no dropdown)
 */
import { Link, useLocation } from "wouter";
import { useLayoutEffect, useRef, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import MarketingBanner from "@/components/MarketingBanner";

const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";

const navLinks = [
  { href: "/tennis", label: "Tennis" },
  { href: "/golf", label: "Golf" },
  { href: "/gym", label: "Fitness Centers" },
  { href: "/pickleball", label: "Pickleball" },
  { href: "/summer", label: "Summer" },
  { href: "/pro-shop", label: "Pro Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuId = "mobile-navigation-menu";

  useLayoutEffect(() => {
    const root = document.documentElement;
    const nav = navRef.current;
    if (!nav) return;

    const updateHeaderHeight = () => {
      root.style.setProperty("--site-header-height", `${nav.getBoundingClientRect().height}px`);
    };

    updateHeaderHeight();

    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(nav);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  return (
    <>
    {/* Skip to main content — WCAG 2.4.1 */}
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-volt-bright focus:text-dark-bg focus:px-4 focus:py-2 focus:text-sm"
    >
      Skip to main content
    </a>
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-dark-bg" aria-label="Main navigation">
      {/* Contact top bar with phone */}
      <div className="bg-dark-mid px-6 lg:px-14 py-1.5 flex items-center justify-between border-b border-white/[0.05]">
        <span className="text-parchment/70 text-[10px] tracking-[0.16em] uppercase">Woodinville Sports Club</span>
        <div className="flex items-center gap-6">
          <a
            href="tel:+14254814686"
            className="hidden sm:flex items-center gap-1.5 text-parchment/70 text-[10px] tracking-[0.1em] uppercase no-underline hover:text-parchment transition-colors duration-200"
          >
            <Phone size={10} />
            (425) 481-4686
          </a>
          <a
            href={COURT_RESERVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-parchment/70 text-[10px] tracking-[0.1em] uppercase no-underline hover:text-parchment transition-colors duration-200"
          >
            CourtReserve
          </a>
        </div>
      </div>

      {/* Marketing Banner — edit MarketingBanner.tsx defaults to update */}
      <MarketingBanner />

      <div className="flex items-center justify-between px-6 lg:px-14 py-5 border-b border-white/[0.08]">
        <Link href="/" className="flex items-center no-underline" aria-label="Woodinville Sports Club home">
          <img
            src="/logo.png"
            alt="Woodinville Sports Club"
            width={1200}
            height={600}
            loading="eager"
            className="block h-9 sm:h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex gap-9 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={location === link.href ? "page" : undefined}
                className={`text-[12px] tracking-[0.1em] uppercase no-underline transition-colors duration-200 py-2 ${
                  location === link.href
                    ? "text-parchment font-medium"
                    : "text-parchment/75 hover:text-parchment"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs — Book Now + Membership */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={COURT_RESERVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] tracking-[0.1em] uppercase no-underline text-parchment border border-parchment/30 px-5 py-3 min-h-[44px] flex items-center hover:bg-parchment/10 transition-colors duration-200"
          >
            Book Now
          </a>
          <Link
            href="/membership"
            className="text-[12px] tracking-[0.1em] uppercase no-underline text-dark-bg bg-volt-bright px-6 py-3 min-h-[44px] flex items-center hover:bg-parchment transition-colors duration-200"
          >
            Membership
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden text-parchment min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls={mobileOpen ? mobileMenuId : undefined}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id={mobileMenuId} className="lg:hidden bg-dark-bg border-t border-white/[0.08] px-6 py-6">
          <ul className="flex flex-col gap-5 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={location === link.href ? "page" : undefined}
                  className={`text-[13px] tracking-[0.1em] uppercase no-underline py-2 block ${
                    location === link.href
                      ? "text-parchment font-medium"
                      : "text-parchment/75"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-3 mt-2">
              <a
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] tracking-[0.1em] uppercase no-underline text-parchment border border-parchment/30 px-5 py-3 min-h-[44px] inline-flex items-center"
                onClick={() => setMobileOpen(false)}
              >
                Book Now
              </a>
              <Link
                href="/membership"
                className="text-[12px] tracking-[0.1em] uppercase no-underline text-dark-bg bg-volt-bright px-6 py-3 min-h-[44px] inline-flex items-center"
                onClick={() => setMobileOpen(false)}
              >
                Membership
              </Link>
            </li>
            <li className="mt-1">
              <a
                href="tel:+14254814686"
                className="flex items-center gap-1.5 text-parchment/70 text-[11px] tracking-[0.1em] uppercase no-underline"
              >
                <Phone size={11} />
                (425) 481-4686
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
    </>
  );
}
