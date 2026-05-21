/*
 * 4B Design — 404 Not Found Page
 * Branded error page with navigation back to key sections
 */
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";

const quickLinks = [
  { label: "Tennis", href: "/tennis" },
  { label: "Golf", href: "/golf" },
  { label: "Gym & Fitness", href: "/gym" },
  { label: "Pickleball", href: "/pickleball" },
  { label: "Membership", href: "/membership" },
  { label: "Contact Us", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Page Not Found on WSC Website"
        description="The page you requested was not found. Return to WSC home, explore tennis, golf, gym, pickleball, membership, or contact the club for help now."
        path="/404"
      />

      <section className="bg-dark-bg min-h-[80vh] flex items-center px-6 lg:px-14 pt-[130px] pb-20">
        <div className="max-w-[1440px] w-full mx-auto">
          <div className="max-w-[640px]">
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">
              Error 404
            </p>
            <h1 className="text-parchment text-[clamp(48px,8vw,120px)] font-light leading-[1] tracking-[-0.03em] mb-6">
              404
            </h1>
            <p className="text-parchment/80 text-[20px] font-light tracking-[-0.01em] leading-[1.4] mb-3">
              Page not found.
            </p>
            <p className="text-parchment/70 text-[15px] leading-[1.72] mb-10 max-w-[440px]">
              The page you're looking for may have been moved, renamed, or doesn't exist.
              Head back to the homepage or explore one of our programs below.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link
                href="/"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
              >
                Go Home
              </Link>
              <Link
                href="/contact"
                className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>

            <div className="border-t border-parchment/10 pt-8">
              <p className="text-parchment/80 text-[10px] tracking-[0.2em] uppercase mb-4">
                Quick Links
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-parchment/75 text-[13px] no-underline hover:text-volt-bright transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
