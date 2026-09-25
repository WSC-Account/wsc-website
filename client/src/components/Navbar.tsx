/*
 * 4B Design: Dark nav bar (#161310), Inter 500 logo, 12px uppercase links
 * Volt-bright CTA button, subtle border-bottom on nav-inner
 * Simplified primary navigation with program and fitness sub-navigation.
 */
import { Link, useLocation } from "wouter";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { ChevronDown, Menu, X, Phone } from "lucide-react";
import { useSessionCalendar } from "@/hooks/useSessionCalendar";

const COURT_RESERVE_URL =
  "https://app.courtreserve.com/Online/Portal/Index/6689";

const membershipLinks = [
  { href: "/membership#membership-options", label: "Membership Options" },
  { href: "/passes", label: "Court & Range Access Pass" },
  { href: "/member-request", label: "Cancellation Request" },
];

const navLinks = [
  {
    href: "/tennis",
    label: "Tennis",
    children: [
      { href: "/tennis#junior-tennis", label: "Junior Tennis" },
      { href: "/tennis#adult-tennis", label: "Adult Tennis" },
    ],
  },
  {
    href: "/golf",
    label: "Golf",
    children: [
      { href: "/golf/driving-range", label: "Driving Range" },
      { href: "/golf#swing-lab", label: "Golf Simulators" },
      { href: "/golf-coaching", label: "Golf Lessons" },
    ],
  },
  { href: "/pickleball", label: "Pickleball" },
  {
    href: "/gym",
    label: "Fitness",
    children: [
      { href: "/gym#fitness-memberships", label: "Gym Memberships" },
      { href: "/gym#personal-training", label: "Personal Training" },
      { href: "/fitness", label: "Athletic Performance Lab" },
    ],
  },
  {
    href: "/sessions",
    label: "Programs",
    children: [
      { href: "/sessions", label: "Program Calendar" },
      { href: "/summer", label: "Summer Training & Camps" },
      { href: "/tennis/summer-tennis", label: "Tennis Tournaments" },
      { href: "/golf/tournaments", label: "Golf Tournaments" },
      { href: "/events", label: "Private Events" },
    ],
  },
  { href: "/membership", label: "Membership", children: membershipLinks },
];

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const season = useSessionCalendar();
  const visibleNavLinks = navLinks.map(link => ({
    ...link,
    children: link.children?.filter(
      child =>
        season.showSummer2026 ||
        (child.href !== "/summer" && child.href !== "/tennis/summer-tennis")
    ),
  }));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<
    string | null
  >(null);
  const navRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuId = "mobile-navigation-menu";

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setExpandedMobileSection(null);
  };

  const getHeaderOffset = () =>
    navRef.current?.getBoundingClientRect().height ?? 0;

  const scrollToHashTarget = (hash: string, attempt = 0) => {
    const target = document.getElementById(hash);
    const headerHeight = getHeaderOffset();

    if (target) {
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({
        top: Math.max(targetTop, 0),
        left: 0,
        behavior: "auto",
      });
      return true;
    }

    if (attempt < 30) {
      window.setTimeout(() => scrollToHashTarget(hash, attempt + 1), 50);
    }

    return false;
  };

  const scrollToHashLink = (href: string) => {
    const url = new URL(href, window.location.origin);
    const hash = url.hash.slice(1);

    if (!hash) return;

    const targetPath = url.pathname;
    const targetHref = `${targetPath}#${hash}`;

    if (targetPath !== window.location.pathname) {
      setLocation(targetPath);
      window.setTimeout(() => {
        window.history.pushState(null, "", targetHref);
        scrollToHashTarget(hash);
      }, 50);
      return;
    }

    window.history.pushState(null, "", targetHref);
    scrollToHashTarget(hash);
  };

  const handleHashLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.includes("#")) return;

    event.preventDefault();
    scrollToHashLink(href);
  };

  useLayoutEffect(() => {
    const root = document.documentElement;
    const nav = navRef.current;
    if (!nav) return;

    const updateHeaderHeight = () => {
      root.style.setProperty(
        "--site-header-height",
        `${nav.getBoundingClientRect().height}px`
      );
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

  useEffect(() => {
    setMobileOpen(false);
    setExpandedMobileSection(null);
  }, [location]);

  useEffect(() => {
    if (!mobileOpen) return;

    const menu = mobileMenuRef.current;
    if (!menu) return;

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusableItems = () =>
      [
        mobileToggleRef.current,
        ...Array.from(menu.querySelectorAll<HTMLElement>(focusableSelector)),
      ].filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement && element.getClientRects().length > 0
      );
    const previousBodyOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
        requestAnimationFrame(() => mobileToggleRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;

      const focusableItems = getFocusableItems();
      const firstItem = focusableItems[0];
      const lastItem = focusableItems.at(-1);
      if (!firstItem || !lastItem) return;

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    const focusFrame = requestAnimationFrame(() =>
      getFocusableItems()[0]?.focus()
    );

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Skip to main content — WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-volt-bright focus:text-dark-bg focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to main content
      </a>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-dark-bg"
        aria-label="Main navigation"
      >
        <div ref={navRef}>
          <div className="flex items-center justify-between px-6 py-3.5 lg:px-14 lg:py-3 border-b border-white/[0.08]">
            <Link
              href="/"
              className="flex items-center no-underline"
              aria-label="Woodinville Sports Club home"
            >
              <img
                src="/logo-small.png"
                alt="Woodinville Sports Club"
                width={240}
                height={120}
                loading="eager"
                className="block h-8 w-auto object-contain sm:h-9"
              />
            </Link>

            {/* Desktop links */}
            <ul className="hidden lg:flex gap-9 list-none">
              {visibleNavLinks.map(link => {
                const isActive =
                  location === link.href ||
                  link.children?.some(child => location === child.href);

                return (
                  <li
                    key={link.href}
                    className={link.children ? "relative group" : undefined}
                  >
                    <Link
                      href={link.href}
                      aria-current={location === link.href ? "page" : undefined}
                      className={`text-[12px] tracking-[0.1em] uppercase no-underline transition-colors duration-200 py-2 ${
                        isActive
                          ? "text-parchment font-medium"
                          : "text-parchment/75 hover:text-parchment"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="absolute left-1/2 top-full z-[55] min-w-[240px] -translate-x-1/2 pt-4 opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
                        <ul className="list-none bg-dark-bg border border-parchment/15 shadow-xl">
                          {link.children.map(child => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={event =>
                                  handleHashLinkClick(event, child.href)
                                }
                                aria-current={
                                  location === child.href ? "page" : undefined
                                }
                                className={`block px-5 py-3 text-[11px] tracking-[0.1em] uppercase no-underline transition-colors duration-200 ${
                                  location === child.href
                                    ? "bg-parchment/10 text-parchment"
                                    : "text-parchment/75 hover:bg-parchment/10 hover:text-parchment"
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Primary desktop action */}
            <a
              href={COURT_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex text-[12px] tracking-[0.1em] uppercase no-underline text-dark-bg bg-volt-bright px-6 py-3 min-h-[44px] items-center hover:bg-parchment transition-colors duration-200"
            >
              Book / Register
            </a>

            {/* Mobile hamburger */}
            <button
              ref={mobileToggleRef}
              type="button"
              className="lg:hidden text-parchment min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() =>
                mobileOpen ? closeMobileMenu() : setMobileOpen(true)
              }
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              aria-controls={mobileMenuId}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            ref={mobileMenuRef}
            id={mobileMenuId}
            className="lg:hidden overflow-y-auto overscroll-contain bg-dark-bg border-t border-white/[0.08] px-6 py-6"
            style={{
              height: "calc(100dvh - var(--site-header-height, 130px))",
            }}
            aria-label="Mobile navigation menu"
          >
            <ul className="flex flex-col gap-5 list-none">
              {visibleNavLinks.map(link => {
                const isActive =
                  location === link.href ||
                  link.children?.some(child => location === child.href);
                const submenuId = `mobile-submenu-${link.label.toLowerCase().replace(/\s+/g, "-")}`;
                const isExpanded = expandedMobileSection === link.href;

                return (
                  <li key={link.href}>
                    <div className="flex items-center gap-3">
                      <Link
                        href={link.href}
                        aria-current={
                          location === link.href ? "page" : undefined
                        }
                        className={`block flex-1 py-2 text-[13px] tracking-[0.1em] uppercase no-underline ${
                          isActive
                            ? "text-parchment font-medium"
                            : "text-parchment/75"
                        }`}
                        onClick={closeMobileMenu}
                      >
                        {link.label}
                      </Link>
                      {link.children && (
                        <button
                          type="button"
                          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-parchment/70"
                          aria-expanded={isExpanded}
                          aria-controls={submenuId}
                          aria-label={`${isExpanded ? "Hide" : "Show"} ${link.label} submenu`}
                          onClick={() =>
                            setExpandedMobileSection(
                              isExpanded ? null : link.href
                            )
                          }
                        >
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </div>
                    {link.children && isExpanded && (
                      <ul
                        id={submenuId}
                        className="list-none mt-2 ml-4 pl-4 border-l border-parchment/15 space-y-2"
                      >
                        {link.children.map(child => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={
                                location === child.href ? "page" : undefined
                              }
                              className={`text-[12px] tracking-[0.1em] uppercase no-underline py-2 block ${
                                location === child.href
                                  ? "text-parchment font-medium"
                                  : "text-parchment/65"
                              }`}
                              onClick={event => {
                                closeMobileMenu();
                                handleHashLinkClick(event, child.href);
                              }}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              <li className="mt-2">
                <a
                  href={COURT_RESERVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-[12px] tracking-[0.1em] uppercase no-underline text-dark-bg bg-volt-bright px-6 py-3 min-h-[44px] inline-flex items-center justify-center"
                  onClick={closeMobileMenu}
                >
                  Book / Register
                </a>
              </li>
              <li className="mt-1">
                <a
                  href="tel:+14254871090"
                  className="flex items-center gap-1.5 text-parchment/70 text-[11px] tracking-[0.1em] uppercase no-underline"
                >
                  <Phone size={11} />
                  (425) 487-1090
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
