/*
 * Policies & Terms Page — Merged tabbed page combining:
 *   Tab 1: Club Policies (membership, court booking, cancellation, facility, fees)
 *   Tab 2: Terms of Service (legal terms, liability, conduct, website usage)
 * Design: Scandinavian minimalism, alternating parchment sections.
 */
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/campus-dome.webp";

/* ── Shared UI ────────────────────────────────────────────── */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">{children}</p>;
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

function FeeTable({ rows }: { rows: { item: string; fee: string }[] }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-[14px]">
        <thead>
          <tr className="border-b border-ink/10">
            <th className="text-left text-ink text-[12px] tracking-[0.1em] uppercase py-3 pr-4 font-medium">Item</th>
            <th className="text-right text-ink text-[12px] tracking-[0.1em] uppercase py-3 font-medium">Fee</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-ink/5">
              <td className="text-ink-mid py-3 pr-4">{row.item}</td>
              <td className="text-ink text-right py-3 font-medium whitespace-nowrap">{row.fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NumberedItem({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5 items-start my-6">
      <span className="text-volt text-[28px] font-light leading-none mt-0.5 shrink-0 w-8 text-right">{number}</span>
      <div>
        <h4 className="text-ink text-[15px] font-medium mb-2">{title}</h4>
        <div className="text-ink-mid text-[14px] leading-[1.72]">{children}</div>
      </div>
    </div>
  );
}

/* ── Quick-nav anchor links ───────────────────────────────── */
const POLICY_SECTIONS = [
  { id: "membership", label: "Membership" },
  { id: "court-booking", label: "Court Booking" },
  { id: "cancellation", label: "Cancellations" },
  { id: "classes", label: "Classes" },
  { id: "guest", label: "Guests" },
  { id: "court-usage", label: "Court Rules" },
  { id: "facility", label: "Facility" },
  { id: "pricing", label: "Fees" },
];

const TERMS_SECTIONS = [
  { id: "terms-overview", label: "Overview" },
  { id: "terms-membership", label: "Membership" },
  { id: "terms-facility", label: "Facility Usage" },
  { id: "terms-booking", label: "Booking" },
  { id: "terms-liability", label: "Liability" },
  { id: "terms-conduct", label: "Conduct" },
  { id: "terms-programs", label: "Programs" },
  { id: "terms-website", label: "Website" },
  { id: "terms-legal", label: "Legal" },
];

function QuickNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-parchment border-b border-ink/8">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="lg:hidden w-full flex items-center justify-between px-6 py-4 text-ink text-[13px] tracking-[0.08em] uppercase font-medium bg-transparent border-none cursor-pointer"
        aria-expanded={open}
        aria-controls="policies-quick-nav"
      >
        Jump to Section
        <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div id="policies-quick-nav" className={`${open ? "block" : "hidden"} lg:block max-w-[1440px] mx-auto px-6 lg:px-14`}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-0 py-3 lg:py-0 overflow-x-auto">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              className="text-ink-mid text-[12px] tracking-[0.08em] uppercase no-underline hover:text-ink transition-colors duration-200 px-3 lg:px-4 py-2.5 whitespace-nowrap"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Tab Content: Club Policies ─────────────────────────── */
function ClubPoliciesContent() {
  return (
    <>
      <QuickNav sections={POLICY_SECTIONS} />

      {/* 1. Membership Agreement */}
      <section id="membership" className="bg-parchment px-6 lg:px-14 py-24 lg:py-28 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Membership Agreement</SectionEyebrow>
          <SectionHeading>Membership terms.</SectionHeading>
          <Prose>
            <p>
              The WSC Membership Agreement was last updated on <strong className="text-ink font-normal">January 1, 2024</strong>. WSC retains the right to modify policies without warning.
            </p>
            <SubHeading>Assumption of Risk & Liability Waiver</SubHeading>
            <p>
              Using WSC facilities, services, or activities involves the risk of injury, ranging from minor to catastrophic injuries including death. By becoming a member, you voluntarily accept this risk and agree that WSC, its officers, directors, employees, volunteers, agents, and independent contractors will not be liable for any injury. You agree to indemnify, defend, and hold WSC harmless against any liability, damages, defense costs, or attorney's fees incurred in connection with claims for bodily injury, wrongful death, or property damage.
            </p>
            <SubHeading>Payment Terms</SubHeading>
            <p>
              All payments are processed through Electronic Funds Transfer (EFT) from your financial account (credit/debit card or checking/savings account). Payment is charged on the join date and recurs based on membership type. It is the member's responsibility to keep all account information accurate and current.
            </p>
            <SubHeading>Default & Late Payments</SubHeading>
            <p>
              A default occurs when any payment is more than ten (10) days late. A late fee will be charged for payments more than 10 days past due. WSC reserves the right to declare the entire remaining balance due and payable, and the member agrees to pay all costs of collection, including agency fees, court costs, and attorney fees.
            </p>
            <SubHeading>Disability & Account Freeze</SubHeading>
            <BulletList items={[
              "Temporary disability: account may be frozen for up to 3 months with written request and physician note",
              "Medical issues are the only circumstance for account freeze",
              "Permanent disability: may cancel with standard 30-day notice",
              "During a freeze, a fee will be assessed as outlined in the agreement",
            ]} />
            <SubHeading>Member Obligations</SubHeading>
            <p>
              Members agree to abide by all WSC policies, follow staff directions regarding safety and security, treat staff and other members with courtesy, pay monthly dues on time, and notify WSC promptly if payment information changes.
            </p>
            <SubHeading>Dispute Resolution</SubHeading>
            <p>
              All disputes (except small claims under $1,000) will be settled by binding arbitration before a single arbitrator under the Federal Arbitration Act, conducted by the American Arbitration Association.
            </p>
          </Prose>
        </div>
      </section>

      {/* 2. Court Booking */}
      <section id="court-booking" className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Court Booking</SectionEyebrow>
          <SectionHeading>Reservation policies.</SectionHeading>
          <Prose>
            <SubHeading>Online Booking</SubHeading>
            <p>
              Online booking reservations open daily at 8:00 AM through CourtReserve, with a 7-day booking window. Members may select a duration of 30, 60, or 90 minutes per session.
            </p>
            <InfoBox>
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-5">Key Booking Rules</h3>
              <div className="space-y-5">
                <div>
                  <span className="text-ink text-[14px] font-medium">Three-Reservation Limit</span>
                  <p className="text-ink-mid text-[14px] leading-[1.72] mt-1">
                    Members are limited to 3 active reservations within any rolling 7-day period.
                  </p>
                </div>
                <div className="border-t border-ink/10 pt-5">
                  <span className="text-ink text-[14px] font-medium">Single Court Rule</span>
                  <p className="text-ink-mid text-[14px] leading-[1.72] mt-1">
                    Members can only book one court at a time — no side-by-side bookings.
                  </p>
                </div>
                <div className="border-t border-ink/10 pt-5">
                  <span className="text-ink text-[14px] font-medium">No 30-Minute Gaps</span>
                  <p className="text-ink-mid text-[14px] leading-[1.72] mt-1">
                    The system will not allow bookings that create 30-minute gaps between reservations.
                  </p>
                </div>
              </div>
            </InfoBox>
            <SubHeading>Check-In Process</SubHeading>
            <p>
              All members and guests must check in at the front desk or by using the CourtReserve App before going to court. Failure to check in or provide complete participant information will result in a full court fee.
            </p>
            <SubHeading>USTA Team Reservations</SubHeading>
            <p>
              Visiting teams can only reserve warmup courts the day of the match. Home teams can reserve their warmup court up to 7 days in advance. USTA fees are $21 + tax per court and include a can of Babolat balls.
            </p>
          </Prose>
        </div>
      </section>

      {/* 3. Cancellation Policies */}
      <section id="cancellation" className="bg-parchment px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Cancellations</SectionEyebrow>
          <SectionHeading>Cancellation policies.</SectionHeading>
          <Prose>
            <SubHeading>Membership Cancellation</SubHeading>
            <BulletList items={[
              "Accounts continue to accrue monthly fees until explicitly canceled by the member",
              "Members may cancel and receive a full refund within 3 business days of signing",
              "To cancel, email CANCEL@WOODINVILLESPORTSCLUB.COM with 30 days' notice",
              "Annual fees, prepaid dues, and punch cards will not be refunded",
            ]} />
            <SubHeading>Court Cancellation</SubHeading>
            <HighlightBox>
              <p className="text-ink text-[15px] leading-[1.72]">
                <strong className="font-medium">24-hour notice</strong> is required for court cancellation to receive a balance credit. Members are responsible for all no-show or late-canceled court fees.
              </p>
            </HighlightBox>
            <SubHeading>Class & Program Cancellation</SubHeading>
            <HighlightBox>
              <p className="text-ink text-[15px] leading-[1.72]">
                <strong className="font-medium">7-day notice</strong> is required for cancellation of classes, clinics, and camps to receive a balance credit. No makeup classes are offered.
              </p>
            </HighlightBox>
            <SubHeading>Private Lesson Cancellation</SubHeading>
            <p>
              Private lessons must be canceled at least 24 hours in advance, or you will be charged the full lesson fee. Contact your coach directly to cancel.
            </p>
          </Prose>
        </div>
      </section>

      {/* 4. Classes & Packages */}
      <section id="classes" className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Classes & Packages</SectionEyebrow>
          <SectionHeading>Program policies.</SectionHeading>
          <Prose>
            <SubHeading>Class Requirements</SubHeading>
            <p>
              All participants in classes, clinics, and private lessons must have a valid WSC Pass or Membership.
            </p>
            <SubHeading>Waitlist Policy</SubHeading>
            <HighlightBox>
              <p className="text-ink text-[15px] leading-[1.72]">
                By joining a waitlist, you agree to be <strong className="font-medium">automatically added to the class and charged</strong> when a spot becomes available.
              </p>
            </HighlightBox>
            <SubHeading>Package Policy</SubHeading>
            <InfoBox>
              <div className="space-y-4">
                <div>
                  <span className="text-ink text-[14px] font-medium">Expiration</span>
                  <p className="text-ink-mid text-[14px] leading-[1.72] mt-1">
                    Packages expire 31 days after purchase. Unused classes do not roll over.
                  </p>
                </div>
                <div className="border-t border-ink/10 pt-4">
                  <span className="text-ink text-[14px] font-medium">Class Cancellations within a Package</span>
                  <p className="text-ink-mid text-[14px] leading-[1.72] mt-1">
                    Cancel more than 48 hours in advance to return the class to your package balance.
                  </p>
                </div>
                <div className="border-t border-ink/10 pt-4">
                  <span className="text-ink text-[14px] font-medium">No Refunds on Packages</span>
                  <p className="text-ink-mid text-[14px] leading-[1.72] mt-1">
                    Once purchased, no account credits or refunds are offered.
                  </p>
                </div>
              </div>
            </InfoBox>
            <SubHeading>Private Lessons</SubHeading>
            <BulletList items={[
              "Private instruction by unauthorized coaches is strictly prohibited",
              "Schedule directly with WSC teaching staff through CourtReserve",
              "Arrive 10–15 minutes before your lesson and check in at the front desk",
            ]} />
          </Prose>
        </div>
      </section>

      {/* 5. Guest Policies */}
      <section id="guest" className="bg-parchment px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Guest Policies</SectionEyebrow>
          <SectionHeading>Bringing guests.</SectionHeading>
          <Prose>
            <p>
              WSC members are welcome to bring guests. Payment of the applicable guest fee is required before using the facility, and the member must be present.
            </p>
            <FeeTable rows={[
              { item: "Tennis Guest Fee", fee: "$10 + tax / guest / reservation" },
              { item: "Pickleball Guest Fee", fee: "$5 + tax / guest / reservation" },
            ]} />
            <SubHeading>Age Restrictions</SubHeading>
            <BulletList items={[
              "Members up to 12 years of age: direct supervision of parent or guardian required",
              "Members ages 15–17: unsupervised with written parental consent",
              "Golf: members 12 and above may use unsupervised",
            ]} />
          </Prose>
        </div>
      </section>

      {/* 6. Court Usage Rules */}
      <section id="court-usage" className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Court Usage</SectionEyebrow>
          <SectionHeading>Court rules & equipment.</SectionHeading>
          <Prose>
            <SubHeading>Equipment Restrictions</SubHeading>
            <p>
              Outside ball machines and ball hoppers are prohibited on WSC courts. Rental baskets of Babolat balls are available for $15 + tax. The Playmate Smash ball machine remains available for rent on courts #7 and #8.
            </p>
            <SubHeading>Footwear Requirements</SubHeading>
            <p>
              Court shoes specifically designed for tennis or pickleball must be worn on court — no sneakers or running shoes.
            </p>
          </Prose>
        </div>
      </section>

      {/* 7. Facility & Safety */}
      <section id="facility" className="bg-parchment px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Facility & Safety</SectionEyebrow>
          <SectionHeading>Facility rules & safety notices.</SectionHeading>
          <Prose>
            <SubHeading>Facility Maintenance</SubHeading>
            <p>
              WSC may be temporarily closed for up to two (2) weeks each year for maintenance purposes.
            </p>
            <SubHeading>Lockers</SubHeading>
            <p>
              Lockers are for day use only. Members are responsible for providing their own lock. WSC is not responsible for lost or stolen items.
            </p>
            <SubHeading>Equipment & Orientation</SubHeading>
            <BulletList items={[
              "Free orientation to the facility and equipment available upon request",
              "Members must wipe down equipment and re-rack weights after use",
              "Use safety features of equipment; obtain instructions from staff if unsure",
            ]} />
            <SubHeading>Code of Conduct</SubHeading>
            <BulletList items={[
              "No loud or profane language on WSC premises",
              "No harassment, assault, or intimidation — results in immediate cancellation",
              "No commercial or business activity without WSC Management approval",
              "No drugs or steroids on WSC premises",
            ]} />
          </Prose>
        </div>
      </section>

      {/* 8. Fees & Pricing */}
      <section id="pricing" className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Fees & Pricing</SectionEyebrow>
          <SectionHeading>Current fee schedule.</SectionHeading>
          <Prose>
            <p>
              Effective January 1, 2025. Pricing is no longer tax inclusive. WSC reserves the right to update fees with appropriate notice.
            </p>
            <FeeTable rows={[
              { item: "Court Time (per 30 minutes)", fee: "$21.14 + tax" },
              { item: "Tennis Guest Fee (per reservation)", fee: "$10 + tax" },
              { item: "Pickleball Guest Fee (per reservation)", fee: "$5 + tax" },
              { item: "Ball Basket Rental (Babolat)", fee: "$15 + tax" },
              { item: "USTA Team Fee (per court, includes balls)", fee: "$21 + tax" },
              { item: "New Member Initiation Fee (one-time)", fee: "$50 + tax" },
            ]} />
            <HighlightBox>
              <p className="text-ink text-[15px] leading-[1.72]">
                <strong className="font-medium">Questions about fees?</strong> Contact the front desk at{" "}
                <a href="tel:+14254871090" className="text-volt no-underline hover:underline">(425) 487-1090</a> or email{" "}
                <a href="mailto:info@woodinvillesportsclub.com" className="text-volt no-underline hover:underline">info@woodinvillesportsclub.com</a>.
              </p>
            </HighlightBox>
          </Prose>
        </div>
      </section>
    </>
  );
}

/* ── Tab Content: Terms of Service ──────────────────────── */
function TermsContent() {
  return (
    <>
      <QuickNav sections={TERMS_SECTIONS} />

      {/* 1. Overview */}
      <section id="terms-overview" className="bg-parchment px-6 lg:px-14 py-24 lg:py-28 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Overview</SectionEyebrow>
          <SectionHeading>Terms of Service.</SectionHeading>
          <Prose>
            <p>
              <strong className="text-ink font-normal">Effective Date: March 4, 2026</strong>
            </p>
            <p>
              These Terms of Service ("Terms") govern your use of the Woodinville Sports Club ("WSC") website at <strong className="text-ink font-normal">woodinvillesportsclub.com</strong>, our facilities at 15327 140th Pl NE, Woodinville, WA 98072, and all related services, programs, memberships, and activities.
            </p>
            <p>
              By accessing our Site, purchasing a membership, booking a facility, or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. These Terms are supplementary to any additional program-specific terms provided during registration.
            </p>
          </Prose>
        </div>
      </section>

      {/* 2. Membership */}
      <section id="terms-membership" className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Membership</SectionEyebrow>
          <SectionHeading>Membership agreements.</SectionHeading>
          <Prose>
            <SubHeading>Membership Types</SubHeading>
            <p>
              WSC offers several membership tiers, including the Family All-Access Pass (monthly), Court & Range Access Pass (annual), and Class Registration Pass (annual). Complete details are on our{" "}
              <Link href="/membership" className="text-ink underline underline-offset-4 decoration-volt">Membership page</Link>.
            </p>
            <SubHeading>Enrollment & Eligibility</SubHeading>
            <BulletList items={[
              "Members must be at least 18 years of age to enter into a membership agreement",
              "All applications are subject to approval by WSC management",
              "Accurate personal information must be provided at enrollment",
              "Access credentials provided through CourtReserve",
            ]} />
            <SubHeading>Fees & Payment</SubHeading>
            <BulletList items={[
              "Fees consist of a one-time initiation fee plus recurring dues",
              "All fees are in U.S. dollars and subject to applicable taxes",
              "WSC may adjust fees with 30 days' written notice",
              "Failed payments: 7-day grace period before access suspension",
            ]} />
            <SubHeading>Cancellation & Suspension</SubHeading>
            <BulletList items={[
              "Monthly memberships: 30 days' written notice required",
              "Annual memberships: non-refundable after first 14 days",
              "Temporary freeze available for medical reasons (up to 90 days/year)",
            ]} />
            <HighlightBox>
              <p className="text-ink-mid text-[14px] leading-[1.7]">
                <strong className="text-ink font-normal">Membership transferability:</strong> Memberships are non-transferable and may not be shared, sold, or assigned to another individual.
              </p>
            </HighlightBox>
          </Prose>
        </div>
      </section>

      {/* 3. Facility Usage */}
      <section id="terms-facility" className="bg-parchment px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Facility Rules</SectionEyebrow>
          <SectionHeading>Facility usage policies.</SectionHeading>
          <Prose>
            <SubHeading>General Facility Rules</SubHeading>
            <BulletList items={[
              "Check in at the front desk or via CourtReserve upon arrival",
              "Appropriate athletic attire and non-marking shoes required",
              "WSC is not liable for lost, stolen, or damaged personal property",
              "No smoking, vaping, or tobacco products on property",
              "Pets not allowed (except certified ADA service animals)",
            ]} />
            <SubHeading>Tennis Courts</SubHeading>
            <BulletList items={[
              "Court reservations required through CourtReserve; walk-on subject to availability",
              "Proper tennis shoes with non-marking soles required",
              "Ball machines available during designated hours",
            ]} />
            <SubHeading>Golf Facilities</SubHeading>
            <BulletList items={[
              "Driving range (23 covered bays with Toptracer) open to members and public",
              "Swing Lab simulators must be reserved in advance; cancellation within 4 hours may incur a fee",
              "Proper golf attire and footwear required",
            ]} />
            <SubHeading>Pickleball at The Dome</SubHeading>
            <BulletList items={[
              "Open play 7 days a week; private court rentals via CourtReserve",
              "Non-marking indoor court shoes required",
            ]} />
            <SubHeading>Athletic Performance Lab & Gym</SubHeading>
            <BulletList items={[
              "Access requires active membership with gym privileges",
              "Wipe down equipment after each use",
              "Members under 16 must be accompanied by an adult",
            ]} />
          </Prose>
        </div>
      </section>

      {/* 4. Booking & Cancellation */}
      <section id="terms-booking" className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Reservations</SectionEyebrow>
          <SectionHeading>Booking & cancellation policies.</SectionHeading>
          <Prose>
            <SubHeading>Booking Platform</SubHeading>
            <p>
              All reservations, registrations, and enrollments are managed through CourtReserve. Members are responsible for maintaining accurate account information.
            </p>
            <SubHeading>Cancellation Policy</SubHeading>
            <InfoBox>
              <div className="space-y-5">
                <NumberedItem number="1" title="Court Reservations (Tennis, Pickleball)">
                  <p>Cancel at least 12 hours before reserved time. Three consecutive no-shows within 30 days may result in booking restrictions.</p>
                </NumberedItem>
                <div className="border-t border-ink/10" />
                <NumberedItem number="2" title="Swing Lab Simulators">
                  <p>Cancel at least 4 hours before reserved time. Late cancellations charged full rental fee.</p>
                </NumberedItem>
                <div className="border-t border-ink/10" />
                <NumberedItem number="3" title="Classes & Group Programs">
                  <p>Cancel at least 24 hours before class start time. Waitlisted participants notified automatically.</p>
                </NumberedItem>
                <div className="border-t border-ink/10" />
                <NumberedItem number="4" title="Summer Camps & Multi-Week Programs">
                  <p>Full refund up to 14 days before start. 50% refund within 14 days. No refunds after program begins.</p>
                </NumberedItem>
              </div>
            </InfoBox>
            <SubHeading>Inclement Weather</SubHeading>
            <p>
              WSC may close facilities or cancel outdoor activities without prior notice in severe weather. Affected reservations will be credited or rescheduled. Indoor facilities operate on normal schedule regardless of weather.
            </p>
          </Prose>
        </div>
      </section>

      {/* 5. Liability */}
      <section id="terms-liability" className="bg-parchment px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Liability</SectionEyebrow>
          <SectionHeading>Assumption of risk & liability waiver.</SectionHeading>
          <Prose>
            <SubHeading>Assumption of Risk</SubHeading>
            <p>
              Participation in sports and fitness activities at WSC involves inherent risks of physical injury. By using WSC facilities or participating in any program, you voluntarily assume all risks associated with such activities.
            </p>
            <HighlightBox>
              <p className="text-ink text-[15px] font-medium mb-3">Waiver and Release of Liability</p>
              <p className="text-ink-mid text-[14px] leading-[1.72]">
                In consideration of being permitted to use the facilities, you agree to release, waive, and discharge WSC, its officers, directors, employees, and affiliates from any and all liability arising out of your participation, to the fullest extent permitted by Washington State law (RCW 4.24.210).
              </p>
            </HighlightBox>
            <SubHeading>Minors</SubHeading>
            <p>
              For participants under 18, a parent or legal guardian must sign the liability waiver on behalf of the minor.
            </p>
            <SubHeading>Medical Conditions</SubHeading>
            <p>
              Members are responsible for disclosing any medical conditions that may affect their ability to safely participate. Consult your physician before engaging in physical activity at WSC.
            </p>
          </Prose>
        </div>
      </section>

      {/* 6. Code of Conduct */}
      <section id="terms-conduct" className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Conduct</SectionEyebrow>
          <SectionHeading>Code of conduct.</SectionHeading>
          <Prose>
            <p>
              WSC is committed to maintaining a safe, respectful, and inclusive environment for all members, guests, staff, and visitors.
            </p>
            <SubHeading>Expected Behavior</SubHeading>
            <BulletList items={[
              "Treat all members, guests, staff, and visitors with courtesy and respect",
              "Follow all posted rules and instructions from WSC staff",
              "Supervise children at all times; children under 12 must be accompanied by an adult",
              "Report unsafe conditions or incidents to staff immediately",
            ]} />
            <SubHeading>Prohibited Conduct</SubHeading>
            <BulletList items={[
              "Harassment, bullying, intimidation, or discrimination of any kind",
              "Physical altercations, threats of violence, or aggressive behavior",
              "Use of illegal substances on WSC property",
              "Unauthorized solicitation or commercial activity",
            ]} />
            <HighlightBox>
              <p className="text-ink-mid text-[14px] leading-[1.7]">
                <strong className="text-ink font-normal">Enforcement:</strong> Violations may result in verbal warning, written warning, temporary suspension, or permanent termination of membership, at WSC management's sole discretion.
              </p>
            </HighlightBox>
          </Prose>
        </div>
      </section>

      {/* 7. Programs & Tier 1 */}
      <section id="terms-programs" className="bg-parchment px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Programs</SectionEyebrow>
          <SectionHeading>Programs & Tier 1 Sports.</SectionHeading>
          <Prose>
            <SubHeading>Program Registration</SubHeading>
            <p>
              Registration for all programs is managed through CourtReserve. Availability, schedules, and pricing are subject to change. In the event of a cancellation by WSC, registered participants will receive a full refund or credit.
            </p>
            <SubHeading>Tier 1 Sports</SubHeading>
            <p>
              WSC is home to Tier 1 Sports, one of the nation's leading developmental programs. Tier 1 programs may have additional terms and fee structures. Enrollment is subject to evaluation by Tier 1 coaching staff.
            </p>
            <SubHeading>Summer Camps</SubHeading>
            <p>
              Summer training programs (Tennis Academy, Golf Academy, Adventure Club) are available for ages 3–18. Parents must complete all required registration forms, medical disclosures, and liability waivers before the first day.
            </p>
          </Prose>
        </div>
      </section>

      {/* 8. Website Terms */}
      <section id="terms-website" className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Website</SectionEyebrow>
          <SectionHeading>Website usage terms.</SectionHeading>
          <Prose>
            <SubHeading>Intellectual Property</SubHeading>
            <p>
              All content on the WSC website is the property of Woodinville Sports Club and is protected by U.S. and international copyright and trademark laws. You may not reproduce or distribute any content without prior written consent.
            </p>
            <SubHeading>Third-Party Links</SubHeading>
            <p>
              Our Site may contain links to third-party websites including CourtReserve and Tier 1 Sports. WSC does not endorse or assume responsibility for third-party content.
            </p>
            <SubHeading>Disclaimer of Warranties</SubHeading>
            <p>
              The Site and all content are offered on an "as is" and "as available" basis without warranties of any kind. WSC does not warrant that the Site will be uninterrupted, error-free, or secure.
            </p>
            <SubHeading>Limitation of Liability</SubHeading>
            <p>
              To the fullest extent permitted by law, WSC shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the Site.
            </p>
          </Prose>
        </div>
      </section>

      {/* 9. General Legal */}
      <section id="terms-legal" className="bg-parchment px-6 lg:px-14 py-20 lg:py-24 scroll-mt-[180px]">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Legal</SectionEyebrow>
          <SectionHeading>General provisions.</SectionHeading>
          <Prose>
            <SubHeading>Governing Law</SubHeading>
            <p>
              These Terms shall be governed by the laws of the State of Washington. Legal proceedings shall be brought exclusively in King County, Washington courts.
            </p>
            <SubHeading>Dispute Resolution</SubHeading>
            <p>
              Before initiating legal proceedings, you agree to first attempt informal resolution by contacting{" "}
              <a href="mailto:info@woodinvillesportsclub.com" className="text-ink underline underline-offset-4 decoration-volt">info@woodinvillesportsclub.com</a>.
              If unresolved within 30 days, either party may pursue binding arbitration through the AAA in King County, Washington.
            </p>
            <SubHeading>Severability</SubHeading>
            <p>
              If any provision is found invalid, the remaining provisions continue in full force and effect.
            </p>
            <SubHeading>Changes to These Terms</SubHeading>
            <p>
              WSC reserves the right to modify these Terms at any time. Material changes will be communicated at least 30 days before taking effect.
            </p>
            <SubHeading>Force Majeure</SubHeading>
            <p>
              WSC shall not be liable for failure to perform due to circumstances beyond its reasonable control, including natural disasters, pandemics, government orders, or acts of terrorism.
            </p>
          </Prose>
          <p className="text-ink-mid text-[13px] mt-8">
            These Terms of Service were last updated on March 4, 2026.
          </p>
        </div>
      </section>
    </>
  );
}

/* ── Main Page ────────────────────────────────────────────── */

export default function Policies() {
  const [activeTab, setActiveTab] = useState<"policies" | "terms">("policies");

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.policies} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Policies & Terms", url: "https://www.woodinvillesportsclub.com/policies" },
      ])]} />
      <PageHero
        eyebrow="Policies & Terms"
        headline="Policies & Terms."
        subtitle="Everything you need to know about membership, facility rules, legal terms, and fees at Woodinville Sports Club."
        image={HERO_IMG}
      />

      {/* Tab Switcher */}
      <div className="bg-dark-bg sticky top-[130px] z-30 border-b border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-14 flex" role="group" aria-label="Policy content">
          <button
            type="button"
            aria-pressed={activeTab === "policies"}
            onClick={() => setActiveTab("policies")}
            className={`text-[12px] tracking-[0.12em] uppercase py-4 px-6 border-b-2 transition-colors duration-200 bg-transparent cursor-pointer ${
              activeTab === "policies"
                ? "text-parchment border-volt-bright font-medium"
                : "text-parchment/70 border-transparent hover:text-parchment/80"
            }`}
          >
            Club Policies
          </button>
          <button
            type="button"
            aria-pressed={activeTab === "terms"}
            onClick={() => setActiveTab("terms")}
            className={`text-[12px] tracking-[0.12em] uppercase py-4 px-6 border-b-2 transition-colors duration-200 bg-transparent cursor-pointer ${
              activeTab === "terms"
                ? "text-parchment border-volt-bright font-medium"
                : "text-parchment/70 border-transparent hover:text-parchment/80"
            }`}
          >
            Terms of Service
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "policies" ? <ClubPoliciesContent /> : <TermsContent />}

      {/* CTA */}
      <section className="bg-dark-bg px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Questions?</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            We're here to help.
          </h2>
          <p className="text-parchment/80 text-[15px] leading-[1.72] mb-10 max-w-[500px] mx-auto">
            If you have questions about any of our policies or terms, please don't hesitate to reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="text-[12px] tracking-[0.1em] uppercase no-underline text-dark-bg bg-volt-bright px-8 py-4 hover:bg-parchment transition-colors duration-200 inline-block"
            >
              Contact Us
            </Link>
            <Link
              href="/faq"
              className="text-[12px] tracking-[0.1em] uppercase no-underline text-parchment border border-parchment/30 px-8 py-4 hover:bg-parchment/10 transition-colors duration-200 inline-block"
            >
              View FAQ
            </Link>
          </div>
          <p className="text-parchment/70 text-[12px] mt-8">
            Policies last updated September 14, 2025. Terms last updated March 4, 2026.
          </p>
        </div>
      </section>
    </div>
  );
}
