/*
 * Privacy Policy Page
 * Comprehensive data privacy policy covering GDPR, CCPA, cookies,
 * third-party services, data collection, and user rights.
 * Design matches Accessibility page structure (PageHero + alternating sections).
 */
import PageHero from "@/components/PageHero";
import { Link } from "wouter";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/campus-dome.webp";

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">{children}</p>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
      {children}
    </h2>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5 text-ink-mid text-[15px] leading-[1.82]">{children}</div>;
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-ink text-[18px] font-light tracking-[-0.01em] mt-8 mb-3">{children}</h3>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 my-4">
      {items.map((item, i) => (
        <li key={i} className="text-ink-mid text-[14px] leading-[1.72] flex items-start gap-3">
          <span className="text-volt text-[10px] mt-1.5">—</span> {item}
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-parchment-mid p-8 my-8">
      {children}
    </div>
  );
}

function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 bg-parchment border-l-2 border-volt my-6">
      {children}
    </div>
  );
}

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.privacy} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Privacy Policy", url: "https://www.woodinvillesportsclub.com/privacy" },
      ])]} />
      <PageHero
        eyebrow="Privacy Policy"
        headline="Your Privacy Matters."
        subtitle="Woodinville Sports Club is committed to protecting your personal information and being transparent about how we collect, use, and share your data."
        image={HERO_IMG}
      />

      {/* 1. Overview */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Overview</SectionEyebrow>
          <SectionHeading>Privacy Policy.</SectionHeading>
          <Prose>
            <p>
              <strong className="text-ink font-normal">Effective Date: March 4, 2026</strong>
            </p>
            <p>
              This Privacy Policy describes how Woodinville Sports Club ("WSC," "we," "us," or "our") collects, uses, discloses, and protects your personal information when you visit our website at{" "}
              <strong className="text-ink font-normal">woodinvillesportsclub.com</strong>{" "}
              (the "Site"), use our services, or interact with us in any way.
            </p>
            <p>
              We are committed to protecting your privacy and handling your data in an open and transparent manner. This policy applies to all visitors, members, and users of our website and services, regardless of location.
            </p>
            <p>
              By using our Site, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with our practices, please do not use our Site.
            </p>
          </Prose>
        </div>
      </section>

      {/* 2. Information We Collect */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Data Collection</SectionEyebrow>
          <SectionHeading>Information we collect.</SectionHeading>
          <Prose>
            <SubHeading>Information You Provide Directly</SubHeading>
            <p>
              We collect information that you voluntarily provide to us when you interact with our Site or services. This includes:
            </p>
            <BulletList items={[
              "Contact information (name, email address, phone number, mailing address) when you fill out a contact form, request a tour, or inquire about membership",
              "Account information when you create an account through our booking platform (CourtReserve)",
              "Payment information when you purchase memberships, book courts, or register for programs (processed securely through third-party payment processors)",
              "Communication records when you email us, call us, or submit feedback through our website",
              "Newsletter subscription details when you sign up for our email communications",
              "Program registration information including participant names, ages, skill levels, and emergency contacts",
            ]} />

            <SubHeading>Information Collected Automatically</SubHeading>
            <p>
              When you visit our Site, certain information is collected automatically through cookies and similar technologies:
            </p>
            <BulletList items={[
              "Device information including browser type, operating system, screen resolution, and device identifiers",
              "Usage data such as pages visited, time spent on pages, click patterns, and navigation paths",
              "Network information including IP address, approximate geographic location (city/region level), and internet service provider",
              "Referral data including the website or search engine that directed you to our Site",
              "Performance data including page load times and any errors encountered",
            ]} />

            <SubHeading>Information from Third Parties</SubHeading>
            <p>
              We may receive information about you from third-party services that we integrate with, including CourtReserve (our booking platform), social media platforms (when you interact with our social media content), and analytics providers.
            </p>
          </Prose>
        </div>
      </section>

      {/* 3. Cookies */}
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Cookies &amp; Tracking</SectionEyebrow>
          <SectionHeading>How we use cookies.</SectionHeading>
          <Prose>
            <p>
              Cookies are small text files stored on your device when you visit our Site. We use cookies and similar technologies to improve your experience, analyze usage patterns, and support our marketing efforts.
            </p>

            <InfoBox>
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-5">Cookie Categories</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-ink text-[14px] font-medium">Necessary Cookies</span>
                    <span className="text-volt text-[12px] tracking-[0.12em] uppercase">Always Active</span>
                  </div>
                  <p className="text-ink-mid text-[14px] leading-[1.72]">
                    Essential for the Site to function properly. These cookies enable core features such as page navigation, security, accessibility preferences (high-contrast mode), and cookie consent storage. Without these cookies, the Site cannot function as intended. These cookies do not collect personally identifiable information.
                  </p>
                </div>

                <div className="border-t border-ink/10 pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-ink text-[14px] font-medium">Analytics Cookies</span>
                    <span className="text-ink-mid text-[10px] tracking-[0.12em] uppercase">Optional</span>
                  </div>
                  <p className="text-ink-mid text-[14px] leading-[1.72]">
                    Help us understand how visitors interact with our Site by collecting anonymous usage data. This includes information about which pages are visited most frequently, how visitors navigate between pages, and whether users encounter any errors. All data collected by analytics cookies is aggregated and anonymous. We use this information to improve our Site's performance and content.
                  </p>
                </div>

                <div className="border-t border-ink/10 pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-ink text-[14px] font-medium">Marketing Cookies</span>
                    <span className="text-ink-mid text-[10px] tracking-[0.12em] uppercase">Optional</span>
                  </div>
                  <p className="text-ink-mid text-[14px] leading-[1.72]">
                    Used to deliver relevant advertisements and measure campaign effectiveness across platforms. These cookies may track your browsing activity across different websites to build a profile of your interests and show you relevant content. Marketing cookies are set by our advertising partners and require your explicit consent.
                  </p>
                </div>
              </div>
            </InfoBox>

            <SubHeading>Managing Your Cookie Preferences</SubHeading>
            <p>
              When you first visit our Site, a cookie consent banner will appear allowing you to accept all cookies, decline non-essential cookies, or manage your preferences for each category. You can change your cookie preferences at any time by clearing your browser cookies and revisiting the Site, which will trigger the consent banner again.
            </p>
            <p>
              You can also control cookies through your browser settings. Most browsers allow you to block or delete cookies, though this may affect your experience on our Site. For more information on managing cookies in your browser, visit your browser's help documentation.
            </p>
          </Prose>
        </div>
      </section>

      {/* 4. How We Use Your Information */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Data Usage</SectionEyebrow>
          <SectionHeading>How we use your information.</SectionHeading>
          <Prose>
            <p>
              We use the information we collect for the following purposes:
            </p>
            <BulletList items={[
              "To provide and maintain our services, including processing memberships, court bookings, and program registrations",
              "To communicate with you about your account, bookings, programs, and respond to your inquiries",
              "To send you newsletters, promotional materials, and updates about WSC programs and events (with your consent)",
              "To improve our Site's functionality, content, and user experience based on usage patterns and feedback",
              "To analyze Site traffic and usage trends to make data-driven improvements",
              "To protect the security and integrity of our Site and services",
              "To comply with legal obligations and enforce our terms of service",
              "To facilitate payment processing through secure third-party payment providers",
            ]} />

            <HighlightBox>
              <p className="text-ink-mid text-[14px] leading-[1.7]">
                <strong className="text-ink font-normal">Legal Basis for Processing (GDPR):</strong> We process your personal data based on one or more of the following legal grounds: your consent, the performance of a contract with you, our legitimate business interests, or compliance with a legal obligation.
              </p>
            </HighlightBox>
          </Prose>
        </div>
      </section>

      {/* 5. Third-Party Services */}
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Third Parties</SectionEyebrow>
          <SectionHeading>Third-party services.</SectionHeading>
          <Prose>
            <p>
              We work with trusted third-party service providers to operate our Site and deliver our services. These providers may have access to your personal information only to perform specific tasks on our behalf and are obligated to protect your data.
            </p>

            <InfoBox>
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-5">Service Providers</h3>
              <div className="space-y-5">
                <div>
                  <span className="text-ink text-[14px] font-medium">CourtReserve</span>
                  <p className="text-ink-mid text-[13px] leading-[1.72] mt-1">
                    Our online booking and membership management platform. When you book courts, register for programs, or manage your membership, your data is processed by CourtReserve under their own privacy policy.
                  </p>
                </div>
                <div className="border-t border-ink/10 pt-4">
                  <span className="text-ink text-[14px] font-medium">Tier 1 Sports</span>
                  <p className="text-ink-mid text-[13px] leading-[1.72] mt-1">
                    Our elite developmental programming partner. If you enroll in Tier 1 programs, relevant registration and participant information may be shared with Tier 1 coaching staff.
                  </p>
                </div>
                <div className="border-t border-ink/10 pt-4">
                  <span className="text-ink text-[14px] font-medium">Payment Processors</span>
                  <p className="text-ink-mid text-[13px] leading-[1.72] mt-1">
                    We use industry-standard payment processors to handle financial transactions. We do not store credit card numbers or full payment details on our servers. All payment data is encrypted and processed in compliance with PCI DSS standards.
                  </p>
                </div>
                <div className="border-t border-ink/10 pt-4">
                  <span className="text-ink text-[14px] font-medium">Analytics Providers</span>
                  <p className="text-ink-mid text-[13px] leading-[1.72] mt-1">
                    We may use analytics services, including Vercel Web Analytics, to understand how visitors use our Site. These services collect anonymous, aggregated data and are only activated if you consent to analytics cookies.
                  </p>
                </div>
                <div className="border-t border-ink/10 pt-4">
                  <span className="text-ink text-[14px] font-medium">Email Service Providers</span>
                  <p className="text-ink-mid text-[13px] leading-[1.72] mt-1">
                    If you subscribe to our newsletter or communications, your email address and name are shared with our email service provider to deliver those communications. You can unsubscribe at any time.
                  </p>
                </div>
              </div>
            </InfoBox>

            <p>
              We do not sell, rent, or trade your personal information to third parties for their own marketing purposes. We may share anonymized, aggregated data that cannot be used to identify you.
            </p>
          </Prose>
        </div>
      </section>

      {/* 6. Data Retention & Security */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Security</SectionEyebrow>
          <SectionHeading>Data retention and security.</SectionHeading>
          <Prose>
            <SubHeading>Data Retention</SubHeading>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. Specifically:
            </p>
            <BulletList items={[
              "Account and membership data is retained for the duration of your active membership and for up to 3 years after cancellation for administrative and legal purposes",
              "Contact form submissions and communication records are retained for up to 2 years",
              "Newsletter subscription data is retained until you unsubscribe",
              "Analytics data is retained in anonymized, aggregated form and does not contain personally identifiable information",
              "Cookie consent preferences are stored locally on your device and are not retained on our servers",
            ]} />

            <SubHeading>Security Measures</SubHeading>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <BulletList items={[
              "SSL/TLS encryption for all data transmitted between your browser and our servers",
              "Secure, encrypted storage for any personal data held on our systems",
              "Regular security assessments and updates to our infrastructure",
              "Access controls limiting employee access to personal data on a need-to-know basis",
              "PCI DSS-compliant payment processing through certified third-party providers",
            ]} />

            <HighlightBox>
              <p className="text-ink-mid text-[14px] leading-[1.7]">
                <strong className="text-ink font-normal">Important:</strong> While we take reasonable steps to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to protecting your data to the best of our ability.
              </p>
            </HighlightBox>
          </Prose>
        </div>
      </section>

      {/* 7. Your Rights */}
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Your Rights</SectionEyebrow>
          <SectionHeading>Your privacy rights.</SectionHeading>
          <Prose>
            <p>
              Depending on your location, you may have certain rights regarding your personal information. We are committed to honoring these rights for all users, regardless of jurisdiction.
            </p>

            <InfoBox>
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-5">Rights Under GDPR (European Economic Area)</h3>
              <BulletList items={[
                "Right of Access — You have the right to request a copy of the personal data we hold about you",
                "Right to Rectification — You can request correction of inaccurate or incomplete personal data",
                "Right to Erasure — You can request deletion of your personal data under certain circumstances",
                "Right to Restrict Processing — You can request that we limit how we use your data",
                "Right to Data Portability — You can request your data in a structured, machine-readable format",
                "Right to Object — You can object to our processing of your personal data for certain purposes, including direct marketing",
                "Right to Withdraw Consent — Where processing is based on consent, you can withdraw it at any time without affecting the lawfulness of prior processing",
              ]} />
            </InfoBox>

            <InfoBox>
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-5">Rights Under CCPA (California Residents)</h3>
              <BulletList items={[
                "Right to Know — You have the right to know what personal information we collect, use, disclose, and sell",
                "Right to Delete — You can request deletion of personal information we have collected from you",
                "Right to Opt-Out — You have the right to opt out of the sale of your personal information (note: we do not sell personal information)",
                "Right to Non-Discrimination — We will not discriminate against you for exercising any of your CCPA rights",
              ]} />
            </InfoBox>

            <SubHeading>How to Exercise Your Rights</SubHeading>
            <p>
              To exercise any of these rights, please contact us using the information provided below. We will respond to your request within 30 days (or within the timeframe required by applicable law). We may need to verify your identity before processing your request.
            </p>
          </Prose>
        </div>
      </section>

      {/* 8. Children's Privacy */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Children's Privacy</SectionEyebrow>
          <SectionHeading>Information about minors.</SectionHeading>
          <Prose>
            <p>
              WSC offers programs for children and young athletes. We take the privacy of minors seriously and comply with the Children's Online Privacy Protection Act (COPPA) and other applicable regulations.
            </p>
            <BulletList items={[
              "Our website is not directed at children under 13, and we do not knowingly collect personal information from children under 13 through our Site without parental consent",
              "Program registration for minors is completed by a parent or legal guardian, who provides the necessary information on behalf of the child",
              "Parents and guardians can review, update, or request deletion of their child's information at any time by contacting us",
              "We do not use children's personal information for marketing purposes",
            ]} />
            <p>
              If you believe we have inadvertently collected personal information from a child under 13 without proper consent, please contact us immediately so we can take appropriate action.
            </p>
          </Prose>
        </div>
      </section>

      {/* 9. Updates & Contact */}
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Updates</SectionEyebrow>
          <SectionHeading>Changes to this policy.</SectionHeading>
          <Prose>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make material changes, we will notify you by updating the "Effective Date" at the top of this policy and, where appropriate, providing additional notice through our Site or via email.
            </p>
            <p>
              We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
            </p>
          </Prose>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Contact Us</SectionEyebrow>
          <SectionHeading>Questions about your privacy.</SectionHeading>
          <Prose>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
          </Prose>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px] mt-8">
            <div className="bg-parchment p-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Email</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
                Send us a detailed description of your privacy question or data request. Please include your name and any relevant account details.
              </p>
              <a
                href="mailto:info@woodinvillesportsclub.com?subject=Privacy%20Policy%20Inquiry"
                className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
              >
                info@woodinvillesportsclub.com
              </a>
            </div>
            <div className="bg-parchment p-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Mail</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
                You may also send written requests to our physical address. Please allow additional time for postal delivery.
              </p>
              <p className="text-ink text-[12px] tracking-[0.12em] uppercase leading-[1.8]">
                Woodinville Sports Club<br />
                Attn: Privacy<br />
                15327 140th Pl NE<br />
                Woodinville, WA 98072
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-parchment border-l-2 border-volt">
            <p className="text-ink-mid text-[14px] leading-[1.7]">
              <strong className="text-ink font-normal">Response time:</strong> We aim to respond to all privacy-related inquiries within 30 days. For requests under GDPR or CCPA, we will respond within the timeframe required by applicable law. If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority.
            </p>
          </div>

          <p className="text-ink-mid text-[13px] mt-8">
            This Privacy Policy was last updated on March 4, 2026.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Learn More</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Your trust is important to us.
          </h2>
          <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[480px] mx-auto mb-8">
            We are committed to transparency and protecting your personal information at every step.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href="/contact"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Link
              href="/accessibility"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
