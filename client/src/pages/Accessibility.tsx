/*
 * Accessibility Statement Page
 * WCAG 2.2 AA accessibility statement and contact information
 */
import PageHero from "@/components/PageHero";
import { Link } from "wouter";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/campus-dome.webp";

export default function Accessibility() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.accessibility} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Accessibility", url: "https://www.woodinvillesportsclub.com/accessibility" },
      ])]} />
      <PageHero
        eyebrow="Accessibility"
        headline="Our Commitment to Accessibility."
        subtitle="Woodinville Sports Club is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone."
        image={HERO_IMG}
      />

      {/* Statement */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[800px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Accessibility Statement</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
            Web Content Accessibility Guidelines (WCAG) 2.2
          </h2>

          <div className="space-y-6 text-ink-mid text-[16px] leading-[1.82]">
            <p>
              Woodinville Sports Club strives to ensure that its website is accessible to people with disabilities. Our website aims to conform to the{" "}
              <strong className="text-ink font-normal">Web Content Accessibility Guidelines (WCAG) 2.2 Level AA</strong>, published by the World Wide Web Consortium (W3C), where those guidelines apply to our content and functionality.
            </p>

            <p>
              We have taken the following measures to ensure accessibility of our website:
            </p>

            <div className="bg-parchment-mid p-8 my-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-5">Accessibility Features</h3>
              <ul className="space-y-3">
                {[
                  "Semantic HTML structure with proper heading hierarchy for screen reader navigation",
                  "ARIA landmarks (main, navigation, footer) to help assistive technology users orient themselves",
                  "Skip-to-content link for keyboard users to bypass repetitive navigation",
                  "Color contrast designed around WCAG Level AA contrast targets",
                  "Descriptive alt text on all meaningful images",
                  "Properly associated form labels for all input fields",
                  "Keyboard-accessible navigation and interactive elements",
                  "Pinch-to-zoom enabled on all mobile devices",
                  "Reduced motion support for users who prefer minimal animation",
                  "Visible focus indicators for keyboard navigation",
                  "Minimum 44x44px touch targets for interactive elements",
                ].map((item, i) => (
                  <li key={i} className="text-ink-mid text-[14px] leading-[1.72] flex items-start gap-3">
                    <span className="text-volt text-[10px] mt-1.5">—</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <p>
              We welcome your feedback on the accessibility of the Woodinville Sports Club website. If you encounter any accessibility barriers or have suggestions for improvement, please let us know.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Report a Barrier</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
            Contact us about accessibility.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            <div className="bg-parchment p-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Email</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
                Send us a detailed description of the accessibility issue you encountered, including the page URL and the assistive technology you were using.
              </p>
              <a
                href="mailto:info@woodinvillesportsclub.com?subject=Website%20Accessibility%20Feedback"
                className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
              >
                info@woodinvillesportsclub.com
              </a>
            </div>
            <div className="bg-parchment p-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Phone</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
                Call our front desk and ask to speak with someone about website accessibility. We are available during regular business hours.
              </p>
              <a
                href="tel:+14254871090"
                className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
              >
                (425) 487-1090
              </a>
            </div>
          </div>

          <div className="mt-8 p-6 bg-parchment border-l-2 border-volt">
            <p className="text-ink-mid text-[14px] leading-[1.7]">
              <strong className="text-ink font-normal">Response time:</strong> We aim to respond to accessibility feedback within 5 business days and to resolve reported issues within 30 days. If you need immediate assistance accessing any information on our website, please call us and we will be happy to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Compliance</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
            Standards and guidelines.
          </h2>

          <div className="space-y-6 text-ink-mid text-[16px] leading-[1.82]">
            <p>
              This website aims to conform to <strong className="text-ink font-normal">WCAG 2.2 Level AA</strong>. The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities, including those with visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.
            </p>
            <p>
              Compliance with these guidelines also helps make web content more usable for all users. For more information about WCAG, visit the{" "}
              <a
                href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-volt border-b border-volt/50 no-underline hover:text-volt-bright transition-colors duration-200"
              >
                W3C Web Accessibility Initiative
              </a>.
            </p>
            <p>
              This statement was last updated on May 2, 2026.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Visit Us</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Everyone is welcome at WSC.
          </h2>
          <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[480px] mx-auto mb-8">
            Our campus is designed to be welcoming and accessible to all visitors, members, and athletes.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href="/contact"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Link
              href="/about"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
            >
              About WSC
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
