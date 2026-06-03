/*
 * 4B Design: Dark footer (#161310), 4-column grid
 * Real content from WSC website crawl
 * Added: Quick Links column with Court Reserve and Tier 1
 */
import { Link } from "wouter";

const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";
const TIER1_URL = "https://www.tier1nw.com";

export default function Footer() {
  return (
    <footer className="bg-dark-bg px-6 lg:px-14 py-16" aria-label="Site footer">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-12 max-w-[1440px] mx-auto">
        {/* Brand */}
        <div>
          <div className="text-parchment text-[13px] tracking-[0.14em] uppercase font-medium mb-2">
            Woodinville Sports Club
          </div>
          <div className="text-volt-bright text-[12px] mb-5">
            Woodinville, Washington — Pacific Northwest
          </div>
          <p className="text-parchment/70 text-[13px] leading-[1.7] max-w-[260px] mb-4">
            A hybrid performance campus for tennis, golf, and athletic development. Serving the Woodinville community since 1976.
          </p>
          <a
            href="https://www.instagram.com/woodinvillesportsclub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-parchment/75 text-[12px] no-underline hover:text-parchment transition-colors duration-200"
          >
            @woodinvillesportsclub
          </a>
        </div>

        {/* Campus */}
        <div>
          <div className="text-volt-bright text-[13px] tracking-[0.18em] uppercase font-medium mb-5">
            Campus
          </div>
          <ul className="list-none space-y-2.5">
            {[
              { href: "/tennis", label: "Tennis" },
              { href: "/golf", label: "Golf" },
              { href: "/gym", label: "Fitness Center" },
              { href: "/fitness", label: "Athletic Performance Lab" },
              { href: "/pickleball", label: "Pickleball" },
              { href: "/summer", label: "Summer Training" },
              { href: "/pro-shop", label: "Pro Shop" },
              { href: "/events", label: "Private Events" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <div className="text-volt-bright text-[13px] tracking-[0.18em] uppercase font-medium mb-5">
            Quick Links
          </div>
          <ul className="list-none space-y-2.5">
            <li>
              <Link
                href="/sessions"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                2026 Session Dates
              </Link>
            </li>
            <li>
              <a
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Book a Court
              </a>
            </li>
            <li>
              <a
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Book a Simulator
              </a>
            </li>
            <li>
              <Link
                href="/membership"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Membership
              </Link>
            </li>
            <li>
              <Link
                href="/member-request"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Membership Cancellation Form
              </Link>
            </li>
            <li>
              <Link
                href="/personal-training-interest-form"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Personal Training Request
              </Link>
            </li>
            <li>
              <Link
                href="/golf-coaching"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Book Golf Lessons
              </Link>
            </li>
            <li>
              <Link
                href="/newsletter-signup"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Newsletter Signup
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Blog & Resources
              </Link>
            </li>
            <li>
              <a
                href={TIER1_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
            >
              Tier 1 Performance NW
            </a>
          </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="text-volt-bright text-[13px] tracking-[0.18em] uppercase font-medium mb-5">
            Contact
          </div>
          <ul className="list-none space-y-2.5">
            <li>
              <Link
                href="/about"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                About WSC
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/careers"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                href="/accessibility"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Accessibility
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/policies"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                Policies & Terms
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-parchment/75 text-[13px] no-underline hover:text-parchment transition-colors duration-200"
              >
                FAQ
              </Link>
            </li>
            <li className="pt-4 border-t border-parchment/[0.06]">
              <p className="text-volt-bright text-[12px] tracking-[0.14em] uppercase mb-2">Facility Hours</p>
              <div className="space-y-1 mb-3">
                <p className="text-parchment/70 text-[12px]">Tennis: Weekdays 6AM-11PM, Weekends 7AM-10PM</p>
                <p className="text-parchment/70 text-[12px]">Gym: Weekdays 6AM-11PM, Weekends 7AM-10PM</p>
                <p className="text-parchment/70 text-[12px]">Golf: Everyday 9AM-10PM</p>
              </div>
            </li>
            <li>
              <p className="text-parchment/70 text-[12px] leading-relaxed">
                15327 140th Pl NE<br />
                Woodinville, WA 98072
              </p>
              <p className="text-parchment/70 text-[12px] mt-2">
                Front Desk:{" "}
                <a href="tel:+14254871090" className="text-parchment/75 no-underline hover:text-parchment transition-colors duration-200">
                  (425) 487-1090
                </a>
                <br />
                Golf Desk:{" "}
                <a href="tel:+14254857319" className="text-parchment/75 no-underline hover:text-parchment transition-colors duration-200">
                  (425) 485-7319
                </a>
              </p>
              <a
                href="mailto:info@woodinvillesportsclub.com"
                className="text-parchment/70 text-[12px] no-underline hover:text-parchment transition-colors duration-200 mt-2 inline-block"
              >
                info@woodinvillesportsclub.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-14 pt-8 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-parchment/70 text-[11px] tracking-[0.1em] uppercase">
            &copy; {new Date().getFullYear()} Woodinville Sports Club. All rights reserved.
          </p>
          <span className="text-parchment/70 text-[10px] tracking-[0.12em] uppercase">
            Woodinville, WA
          </span>
        </div>
      </div>
    </footer>
  );
}
