/*
 * Terms of Service Page
 * Comprehensive terms covering membership agreements, liability waivers,
 * facility usage rules, booking policies, code of conduct, and general legal terms.
 * Design matches Privacy and Accessibility page structure (PageHero + alternating sections).
 */
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { Link } from "wouter";

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

export default function Terms() {
  return (
    <div className="min-h-screen">
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Terms of Service", url: "https://www.woodinvillesportsclub.com/terms" },
      ])]} />
      <PageHero
        eyebrow="Terms of Service"
        headline="Terms &amp; Conditions."
        subtitle="Please review these terms carefully before using our facilities, services, or website. By accessing WSC, you agree to be bound by these terms."
        image={HERO_IMG}
      />

      {/* 1. Overview & Acceptance */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Overview</SectionEyebrow>
          <SectionHeading>Terms of Service.</SectionHeading>
          <Prose>
            <p>
              <strong className="text-ink font-normal">Effective Date: March 4, 2026</strong>
            </p>
            <p>
              These Terms of Service ("Terms") govern your use of the Woodinville Sports Club ("WSC," "we," "us," or "our") website at{" "}
              <strong className="text-ink font-normal">woodinvillesportsclub.com</strong>{" "}
              (the "Site"), our facilities located at 15327 140th Pl NE, Woodinville, WA 98072, and all related services, programs, memberships, and activities offered by WSC.
            </p>
            <p>
              By accessing our Site, purchasing a membership, booking a facility, registering for a program, or otherwise using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not use our Site or services.
            </p>
            <p>
              These Terms are supplementary to any additional program-specific terms, policies, or agreements provided during registration.
            </p>
          </Prose>
        </div>
      </section>

      {/* 2. Membership Agreements */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Membership</SectionEyebrow>
          <SectionHeading>Membership agreements.</SectionHeading>
          <Prose>
            <SubHeading>Membership Types</SubHeading>
            <p>
              WSC offers several membership tiers, including the Family All-Access Pass (monthly), Court &amp; Range Access Pass (annual), and Class Registration Pass (annual). Each membership tier provides different levels of access to our facilities and services. Complete membership details, including pricing and benefits, are available on our{" "}
              <Link href="/membership" className="text-ink underline underline-offset-4 decoration-volt">Membership page</Link>.
            </p>

            <SubHeading>Enrollment &amp; Eligibility</SubHeading>
            <BulletList items={[
              "Members must be at least 18 years of age to enter into a membership agreement. Minors (under 18) may be included on a family membership under the supervision of an adult member",
              "All membership applications are subject to approval by WSC management. WSC reserves the right to decline any application at its sole discretion",
              "Accurate and complete personal information must be provided at the time of enrollment, including full name, address, phone number, email, and emergency contact information",
              "Each member will receive access credentials through CourtReserve, our booking and membership management platform",
            ]} />

            <SubHeading>Fees &amp; Payment</SubHeading>
            <BulletList items={[
              "Membership fees consist of a one-time initiation fee plus recurring monthly or annual dues, depending on the membership tier selected",
              "All fees are quoted in U.S. dollars and are subject to applicable state and local taxes",
              "Monthly memberships are billed automatically on the same date each month via the payment method on file. Annual memberships are billed in full at the time of enrollment or renewal",
              "WSC reserves the right to adjust membership fees with 30 days' written notice. Continued use of the facilities after the effective date of a fee change constitutes acceptance of the new fees",
              "Failed payments will result in a 7-day grace period. If payment is not received within the grace period, access to facilities may be suspended until the account is brought current",
            ]} />

            <SubHeading>Cancellation &amp; Suspension</SubHeading>
            <BulletList items={[
              "Monthly memberships may be cancelled with 30 days' written notice. The membership will remain active through the end of the current billing cycle",
              "Annual memberships are non-refundable after the first 14 days from the date of purchase. Within the first 14 days, members may request a full refund minus any usage charges",
              "WSC may suspend or terminate a membership at any time for violation of these Terms, the Code of Conduct, or for non-payment of fees. In cases of termination for cause, no refund will be issued",
              "Members may request a temporary freeze of their membership for medical reasons (with documentation) for up to 90 days per calendar year. Frozen memberships are not billed during the freeze period",
            ]} />

            <HighlightBox>
              <p className="text-ink-mid text-[14px] leading-[1.7]">
                <strong className="text-ink font-normal">Membership transferability:</strong> Memberships are non-transferable and may not be shared, sold, or assigned to another individual. Each membership is tied to the named member(s) on the account.
              </p>
            </HighlightBox>
          </Prose>
        </div>
      </section>

      {/* 3. Facility Usage */}
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Facility Rules</SectionEyebrow>
          <SectionHeading>Facility usage policies.</SectionHeading>
          <Prose>
            <SubHeading>General Facility Rules</SubHeading>
            <BulletList items={[
              "All members and guests must check in at the front desk or via the CourtReserve app upon arrival",
              "Appropriate athletic attire and footwear are required in all activity areas. Non-marking shoes are mandatory on all indoor court surfaces",
              "Personal belongings are the sole responsibility of the owner. WSC is not liable for lost, stolen, or damaged personal property",
              "Smoking, vaping, and the use of tobacco products are prohibited on all WSC property, including parking areas",
              "Alcohol consumption is permitted only in designated areas and during authorized events. Outside alcohol is not permitted on the premises",
              "Pets are not allowed on WSC property, with the exception of certified service animals as defined by the Americans with Disabilities Act (ADA)",
              "Photography and video recording for commercial purposes require prior written authorization from WSC management",
            ]} />

            <SubHeading>Tennis Courts</SubHeading>
            <BulletList items={[
              "Court reservations are required and can be made through CourtReserve. Walk-on play is subject to availability",
              "Courts are reserved in 60-minute or 90-minute blocks depending on the time of day and court type",
              "Players must vacate the court promptly at the end of their reserved time to allow the next reservation to begin",
              "Proper tennis shoes with non-marking soles are required on all indoor courts. Running shoes, sandals, and street shoes are not permitted",
              "Ball machines are available for member use during designated hours. Members must clean up all balls after use",
            ]} />

            <SubHeading>Golf Facilities</SubHeading>
            <BulletList items={[
              "The driving range (more than 23 covered bays with Toptracer) is open to both members and the general public during posted hours",
              "Range balls are included with bay rental. Members receive priority bay access during peak hours",
              "The 2.5-acre short game area is available to members and program participants. Proper golf attire and footwear are required",
              "Swing Lab golf simulators (4 Uneekor bays) must be reserved in advance through CourtReserve. Cancellations within 4 hours of the reservation may incur a cancellation fee",
              "Food and beverages are permitted in the Swing Lab lounge area only. No food or drinks near simulator equipment",
            ]} />

            <SubHeading>Pickleball at The Dome</SubHeading>
            <BulletList items={[
              "Open play is available 7 days a week during posted hours. Court assignments during open play are managed on a rotating basis",
              "Private court rentals must be booked in advance through CourtReserve",
              "Non-marking indoor court shoes are required. Outdoor shoes are not permitted on the court surface",
              "Players are expected to follow standard pickleball etiquette, including calling lines fairly and rotating courts during open play",
            ]} />

            <SubHeading>Athletic Performance Lab &amp; Gym</SubHeading>
            <BulletList items={[
              "Access to the APL Training Center and gym facilities requires an active membership with gym privileges (Family All-Access Pass or equivalent)",
              "Members must wipe down equipment after each use with the provided sanitizing supplies",
              "Personal trainers not affiliated with WSC are not permitted to conduct training sessions on the premises without prior authorization",
              "The sauna and locker room facilities are available to members with gym access. Proper hygiene and attire are required at all times",
              "Members under 16 must be accompanied by an adult member in the gym and weight room areas",
            ]} />
          </Prose>
        </div>
      </section>

      {/* 4. Booking & Cancellation */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Reservations</SectionEyebrow>
          <SectionHeading>Booking &amp; cancellation policies.</SectionHeading>
          <Prose>
            <SubHeading>Booking Platform</SubHeading>
            <p>
              All facility reservations, class registrations, and program enrollments are managed through CourtReserve. By using CourtReserve, you also agree to their terms of service and privacy policy. Members are responsible for maintaining accurate account information and securing their login credentials.
            </p>

            <SubHeading>Cancellation Policy</SubHeading>
            <InfoBox>
              <div className="space-y-5">
                <NumberedItem number="1" title="Court Reservations (Tennis, Pickleball)">
                  <p>Cancellations must be made at least 12 hours before the reserved time. Late cancellations or no-shows may result in a fee equal to the court rental rate. Three consecutive no-shows within a 30-day period may result in temporary booking restrictions.</p>
                </NumberedItem>
                <div className="border-t border-ink/10" />
                <NumberedItem number="2" title="Swing Lab Simulators">
                  <p>Cancellations must be made at least 4 hours before the reserved time. Late cancellations will be charged the full simulator rental fee. Members receive a 5% discount on simulator bookings.</p>
                </NumberedItem>
                <div className="border-t border-ink/10" />
                <NumberedItem number="3" title="Classes &amp; Group Programs">
                  <p>Cancellations must be made at least 24 hours before the class start time. Late cancellations may forfeit the class credit or session fee. Waitlisted participants will be notified automatically if a spot opens.</p>
                </NumberedItem>
                <div className="border-t border-ink/10" />
                <NumberedItem number="4" title="Summer Camps &amp; Multi-Week Programs">
                  <p>Full refunds are available up to 14 days before the program start date. Cancellations within 14 days of the start date will receive a 50% refund. No refunds are issued after the program has begun, except in cases of documented medical emergency.</p>
                </NumberedItem>
              </div>
            </InfoBox>

            <SubHeading>Inclement Weather</SubHeading>
            <p>
              In the event of severe weather or unsafe conditions, WSC reserves the right to close facilities or cancel outdoor activities without prior notice. Affected reservations will be credited to the member's account or rescheduled at no additional charge. Indoor facilities (tennis courts, Swing Lab, APL, The Dome) operate on their normal schedule regardless of weather conditions.
            </p>
          </Prose>
        </div>
      </section>

      {/* 5. Liability Waiver & Assumption of Risk */}
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Liability</SectionEyebrow>
          <SectionHeading>Assumption of risk &amp; liability waiver.</SectionHeading>
          <Prose>
            <SubHeading>Assumption of Risk</SubHeading>
            <p>
              Participation in sports, fitness, and recreational activities at WSC involves inherent risks of physical injury, including but not limited to sprains, fractures, concussions, heat-related illness, cardiac events, and in rare cases, permanent disability or death. By using WSC facilities or participating in any WSC program, you voluntarily assume all risks associated with such activities.
            </p>
            <p>
              You acknowledge that the risk of injury from the activities involved in these programs is significant, including the potential for permanent paralysis and death, and that you are voluntarily participating in these activities with knowledge of the danger involved.
            </p>

            <HighlightBox>
              <p className="text-ink text-[15px] font-medium mb-3">Waiver and Release of Liability</p>
              <p className="text-ink-mid text-[14px] leading-[1.72]">
                In consideration of being permitted to use the facilities and participate in the programs and activities of Woodinville Sports Club, you agree to the following:
              </p>
            </HighlightBox>

            <BulletList items={[
              "You hereby release, waive, discharge, and covenant not to sue Woodinville Sports Club and its officers, directors, employees, agents, coaches, volunteers, and affiliates (collectively, the \"Released Parties\") from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, or injury, including death, that may be sustained by you or your property while participating in any WSC activity or using any WSC facility",
              "This release applies regardless of whether such loss, damage, or injury is caused by the negligence of the Released Parties or otherwise, to the fullest extent permitted by Washington State law (RCW 4.24.210)",
              "You agree to indemnify and hold harmless the Released Parties from any loss, liability, damage, or costs, including attorney's fees, that they may incur due to your participation in WSC activities or your use of WSC facilities, whether caused by your negligence or otherwise",
              "You consent to receive medical treatment that may be deemed advisable in the event of injury, accident, or illness during participation in WSC activities, and you agree that such treatment will be at your own expense",
            ]} />

            <SubHeading>Minors</SubHeading>
            <p>
              For participants under the age of 18, a parent or legal guardian must sign the liability waiver and assumption of risk agreement on behalf of the minor. The parent or guardian assumes all risks on behalf of the minor and agrees to the terms of the waiver as described above. Parents and guardians are responsible for ensuring that minors comply with all WSC rules and policies.
            </p>

            <SubHeading>Medical Conditions</SubHeading>
            <p>
              Members and participants are responsible for disclosing any medical conditions, allergies, or physical limitations that may affect their ability to safely participate in activities. WSC staff and coaches are not medical professionals and cannot provide medical advice. If you have any concerns about your ability to participate, consult your physician before engaging in any physical activity at WSC.
            </p>

            <SubHeading>Property Damage</SubHeading>
            <p>
              WSC is not responsible for loss, theft, or damage to personal property, including vehicles, brought onto WSC premises. Members and guests are advised not to leave valuables unattended. Lockers are available for temporary storage during visits but are not intended for overnight use. WSC reserves the right to remove items from lockers that are left overnight.
            </p>
          </Prose>
        </div>
      </section>

      {/* 6. Code of Conduct */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Conduct</SectionEyebrow>
          <SectionHeading>Code of conduct.</SectionHeading>
          <Prose>
            <p>
              WSC is committed to maintaining a safe, respectful, and inclusive environment for all members, guests, staff, and visitors. All individuals on WSC property are expected to adhere to the following standards of conduct:
            </p>

            <SubHeading>Expected Behavior</SubHeading>
            <BulletList items={[
              "Treat all members, guests, staff, coaches, and visitors with courtesy and respect at all times",
              "Follow all posted rules, signage, and instructions from WSC staff and coaches",
              "Maintain appropriate noise levels in all areas. Excessive noise, profanity, or disruptive behavior is not tolerated",
              "Supervise children at all times. Children under 12 must be accompanied by an adult member in all facility areas",
              "Report any unsafe conditions, equipment malfunctions, or incidents to WSC staff immediately",
              "Respect the property of WSC and other members. Vandalism or intentional damage to facilities or equipment will result in immediate membership termination and financial liability",
            ]} />

            <SubHeading>Prohibited Conduct</SubHeading>
            <BulletList items={[
              "Harassment, bullying, intimidation, or discrimination of any kind based on race, color, religion, sex, national origin, age, disability, sexual orientation, or gender identity",
              "Physical altercations, threats of violence, or aggressive behavior toward any individual on WSC property",
              "Use of illegal substances on WSC property. Members or guests who appear to be under the influence of drugs or alcohol may be asked to leave immediately",
              "Unauthorized solicitation, advertising, or commercial activity on WSC premises",
              "Unauthorized access to restricted areas, staff-only zones, or facilities outside of posted operating hours",
              "Tampering with, misusing, or damaging WSC equipment, technology systems, or property",
            ]} />

            <HighlightBox>
              <p className="text-ink-mid text-[14px] leading-[1.7]">
                <strong className="text-ink font-normal">Enforcement:</strong> Violations of the Code of Conduct may result in verbal warning, written warning, temporary suspension of membership privileges, or permanent termination of membership, at the sole discretion of WSC management. Serious violations may be reported to law enforcement.
              </p>
            </HighlightBox>
          </Prose>
        </div>
      </section>

      {/* 7. Programs & Tier 1 */}
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Programs</SectionEyebrow>
          <SectionHeading>Programs &amp; Tier 1 Sports.</SectionHeading>
          <Prose>
            <SubHeading>Program Registration</SubHeading>
            <p>
              Registration for all WSC programs, classes, clinics, and camps is managed through CourtReserve. Program availability, schedules, and pricing are subject to change. WSC reserves the right to cancel or modify programs due to insufficient enrollment, instructor availability, or other operational considerations. In the event of a program cancellation by WSC, registered participants will receive a full refund or credit.
            </p>

            <SubHeading>Tier 1 Sports</SubHeading>
            <p>
              WSC is home to Tier 1 Sports, one of the nation's leading developmental programs in tennis, golf, and athletic performance. Tier 1 programs may have additional terms, requirements, and fee structures beyond standard WSC membership. Enrollment in Tier 1 programs is subject to evaluation and acceptance by Tier 1 coaching staff.
            </p>
            <p>
              Tier 1 participants agree to comply with all Tier 1 program-specific policies, including attendance requirements, training schedules, and competition commitments. Additional waivers and agreements may be required for Tier 1 program participation.
            </p>

            <SubHeading>Summer Camps</SubHeading>
            <p>
              WSC summer training programs (Tennis Academy, Golf Academy, Adventure Club) are available for participants ages 3–18. Registration, payment, and cancellation for summer camps are governed by the booking and cancellation policies outlined in Section 4 of these Terms. Parents and guardians must complete all required registration forms, medical disclosures, and liability waivers before the first day of camp.
            </p>
          </Prose>
        </div>
      </section>

      {/* 8. Website Terms */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Website</SectionEyebrow>
          <SectionHeading>Website usage terms.</SectionHeading>
          <Prose>
            <SubHeading>Intellectual Property</SubHeading>
            <p>
              All content on the WSC website, including text, graphics, logos, images, photographs, videos, audio, software, and the overall design and layout, is the property of Woodinville Sports Club and is protected by U.S. and international copyright, trademark, and intellectual property laws. The WSC name, logo, and all related marks are trademarks of Woodinville Sports Club.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any content from this Site without the prior written consent of WSC, except for personal, non-commercial use such as printing a page for your own reference.
            </p>

            <SubHeading>User Submissions</SubHeading>
            <p>
              Any information, feedback, suggestions, or other materials you submit to WSC through the Site (including contact form submissions and email communications) become the property of WSC. We may use such submissions for any purpose without compensation or attribution to you, subject to our{" "}
              <Link href="/privacy" className="text-ink underline underline-offset-4 decoration-volt">Privacy Policy</Link>.
            </p>

            <SubHeading>Third-Party Links</SubHeading>
            <p>
              Our Site may contain links to third-party websites, including CourtReserve, Tier 1 Sports, and social media platforms. These links are provided for convenience only. WSC does not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party website. You access third-party sites at your own risk.
            </p>

            <SubHeading>Disclaimer of Warranties</SubHeading>
            <p>
              The Site and all content, materials, and services provided through the Site are offered on an "as is" and "as available" basis without warranties of any kind, either express or implied. WSC disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. WSC does not warrant that the Site will be uninterrupted, error-free, secure, or free of viruses or other harmful components.
            </p>

            <SubHeading>Limitation of Liability</SubHeading>
            <p>
              To the fullest extent permitted by applicable law, WSC and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Site or any content or services obtained through the Site.
            </p>
          </Prose>
        </div>
      </section>

      {/* 9. General Legal */}
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Legal</SectionEyebrow>
          <SectionHeading>General provisions.</SectionHeading>
          <Prose>
            <SubHeading>Governing Law</SubHeading>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Washington, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the state or federal courts located in King County, Washington, and you consent to the personal jurisdiction of such courts.
            </p>

            <SubHeading>Dispute Resolution</SubHeading>
            <p>
              Before initiating any legal proceedings, you agree to first attempt to resolve any dispute with WSC through informal negotiation by contacting us at{" "}
              <a href="mailto:info@woodinvillesportsclub.com" className="text-ink underline underline-offset-4 decoration-volt">info@woodinvillesportsclub.com</a>.
              If the dispute cannot be resolved informally within 30 days, either party may pursue resolution through binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, conducted in King County, Washington.
            </p>

            <SubHeading>Severability</SubHeading>
            <p>
              If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its original intent.
            </p>

            <SubHeading>Entire Agreement</SubHeading>
            <p>
              These Terms, together with our{" "}
              <Link href="/privacy" className="text-ink underline underline-offset-4 decoration-volt">Privacy Policy</Link>{" "}
              and any additional agreements entered into at the time of membership enrollment or program registration, constitute the entire agreement between you and WSC regarding the use of our Site and services.
            </p>

            <SubHeading>Changes to These Terms</SubHeading>
            <p>
              WSC reserves the right to modify these Terms at any time. Material changes will be communicated to members via email or through a notice on our Site at least 30 days before the changes take effect. Your continued use of our Site or services after the effective date of any changes constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.
            </p>

            <SubHeading>Force Majeure</SubHeading>
            <p>
              WSC shall not be liable for any failure or delay in performing its obligations under these Terms due to circumstances beyond its reasonable control, including but not limited to natural disasters, pandemics, government orders, utility failures, labor disputes, or acts of terrorism.
            </p>
          </Prose>
        </div>
      </section>

      {/* 10. Contact */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto">
          <SectionEyebrow>Contact Us</SectionEyebrow>
          <SectionHeading>Questions about these terms.</SectionHeading>
          <Prose>
            <p>
              If you have any questions or concerns about these Terms of Service, please contact us using the information below:
            </p>
          </Prose>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px] mt-8">
            <div className="bg-parchment p-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Email</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
                For general inquiries about these terms or your membership agreement.
              </p>
              <a
                href="mailto:info@woodinvillesportsclub.com?subject=Terms%20of%20Service%20Inquiry"
                className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
              >
                info@woodinvillesportsclub.com
              </a>
            </div>
            <div className="bg-parchment p-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Phone</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
                Speak with our front desk team about membership, bookings, or facility policies.
              </p>
              <a
                href="tel:+14254871090"
                className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
              >
                (425) 487-1090
              </a>
            </div>
            <div className="bg-parchment p-8">
              <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">Mail</h3>
              <p className="text-ink-mid text-[14px] leading-[1.72] mb-4">
                Written correspondence and formal legal notices.
              </p>
              <p className="text-ink text-[12px] tracking-[0.12em] uppercase leading-[1.8]">
                Woodinville Sports Club<br />
                Attn: Legal<br />
                15327 140th Pl NE<br />
                Woodinville, WA 98072
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-parchment border-l-2 border-volt">
            <p className="text-ink-mid text-[14px] leading-[1.7]">
              <strong className="text-ink font-normal">Important:</strong> These Terms of Service are provided for informational purposes and reflect WSC's standard policies. For specific membership agreements, liability waivers, and program-specific terms, please refer to the documents provided at the time of enrollment. In the event of any conflict between these online Terms and a signed membership agreement, the signed agreement shall prevail.
            </p>
          </div>

          <p className="text-ink-mid text-[13px] mt-8">
            These Terms of Service were last updated on March 4, 2026.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Get Started</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Ready to join WSC?
          </h2>
          <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[480px] mx-auto mb-8">
            Explore membership options, schedule a tour, or contact us with any questions about our facilities and programs.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href="/membership"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
            >
              Membership
            </Link>
            <Link
              href="/contact"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
