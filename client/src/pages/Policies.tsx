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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HERO_IMG = "/images/wsc/campus-dome.webp";

/* ── Shared UI ────────────────────────────────────────────── */

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

type AgreementBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "notice"; text: string };

const MEMBERSHIP_AGREEMENT_SECTIONS: {
  id: string;
  title: string;
  summary: string;
  blocks: AgreementBlock[];
}[] = [
  {
    id: "release",
    title: "Release of liability, assumption of risk, indemnity, and communications consent",
    summary: "Risk acceptance, indemnity, equipment liability, and marketing communications consent.",
    blocks: [
      {
        type: "paragraph",
        text: "RELEASE OF LIABILITY AND ASSUMPTION OF RISK - INDEMNITY - COMMUNICATIONS CONSENT",
      },
      {
        type: "paragraph",
        text: "Using the WSC facilities, services, or activities involves the risk of injury to you or your guest, whether you or someone else causes it. Specific risks vary from one activity to another and the risks range from minor injuries to major injuries, such as catastrophic injuries including death.",
      },
      {
        type: "paragraph",
        text: "In consideration of your acceptance of the benefits under this agreement, you understand and voluntarily accept this risk and agree that WSC, its officers, directors, employees, volunteers, agents and independent contractors will not be liable for any injury, including, without limitation, personal, bodily, or mental injury, economic loss or any damage to you, your spouse, guests, unborn child, or relatives resulting from the negligence of WSC or anyone on WSC behalf or anyone else whether related to exercise or not.",
      },
      {
        type: "paragraph",
        text: "You agree to indemnify, defend and hold WSC harmless against any liability, damages, defense costs, including attorneys' fees, or from any other costs incurred in connection with claims for bodily injury, wrongful death or property damage caused by your negligence or other wrongful acts or omissions.",
      },
      {
        type: "paragraph",
        text: "You further agree to hold harmless, defend and indemnify WSC from all liability, damages, defense costs, including attorneys' fees, or from any other costs incurred in connection with claims for bodily injury, wrongful death or property damage brought by you, your guests, or minors, even if Woodinville Sports Club was negligent.",
      },
      {
        type: "paragraph",
        text: "Further, you understand and acknowledge that Woodinville Sports Club does not manufacture fitness or other equipment at its facilities, but purchases and/or leases equipment. You understand and acknowledge that Woodinville Sports Club is providing recreational services and may not be held liable for defective products.",
      },
      {
        type: "paragraph",
        text: "By signing below, you (1) acknowledge and agree that you have read the foregoing and know of the nature of the activities at Woodinville Sports Club and agree to all terms herein, and (2) give my express consent for Woodinville Sports Club to contact me and send me marketing communications by direct mail, telephone, pre-recorded message, text message, instant message, email and other means.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    summary: "How WSC handles personal information and policy changes.",
    blocks: [
      {
        type: "paragraph",
        text: "At WSC we respect your privacy. We do not share, rent, sell, or otherwise use any personal information you have given us to any third party without your permission, except when required by law, subpoena or other legal process, or in order to protect the safety of the public.",
      },
      {
        type: "paragraph",
        text: "Any information you give us is held with the utmost care and security, and will not be used in ways to which you have not consented. Since this policy may change over time as we modify or expand our services, we suggest that you check from time to time in order to understand how we treat your personal information.",
      },
      {
        type: "paragraph",
        text: "Your use of this website and its services constitute your agreement to the terms of our privacy policy. If we decide to change those policies, we will post those changes on this page so that you are always aware of what personal information we collect, how we use it and under what circumstances we disclose it. Your continued use of this website and its services constitute your agreement to any such changes.",
      },
      {
        type: "paragraph",
        text: "We will not collect any personal information about individuals except when specifically and knowingly provided by such individuals. We will use this information in order to customize and enhance the services we offer to customers.",
      },
      {
        type: "paragraph",
        text: "Examples of such information are: name, age, gender, business, home or postal address, e-mail address, phone numbers, and travel preferences. We may share non-personal aggregate, or summary, information regarding customers with partners or other third parties, but we do not sell or share any information at the individual customer level.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment terms, defaults, and billing company",
    summary: "EFT authorization, late payments, collection costs, and billing-company changes.",
    blocks: [
      { type: "heading", text: "Payment Terms" },
      {
        type: "paragraph",
        text: "Member/Passholder agrees to make timely payment of ALL fees associated with their Member/Passholder agreement including on account retail payments. All payments will be done through Electronic Funds Transfer (EFT) from Member/Passholders financial account (Credit/Debit Card, Checking/Savings Account). Payment for Member/Passholder agreement dues and fees will be charged on join date and reoccurring based on type of Member/Passholder agreement or access pass. It is the responsibility of the Member/Passholder to keep ALL account information accurate and current.",
      },
      { type: "heading", text: "Default and Late Payments" },
      {
        type: "paragraph",
        text: "Should Member/Passholder default on any payment obligation as called for in this agreement, WSC will have the right to declare the entire remaining balance due and payable and Member/Passholder agrees to pay allowable interest, and all costs of collection, including but not limited to collection agency fees, court costs, and attorney fees.",
      },
      {
        type: "paragraph",
        text: "A default occurs when any payment due under this Agreement is more than ten (10) days late. Should any monthly payment become more than ten (10) days past due, Member/Passholder will be charged a late fee. An additional service fee may be charged for any check, draft, credit card, or order returned for insufficient funds or any other reason.",
      },
      {
        type: "paragraph",
        text: "If the Member/Passholder is paying monthly dues by Electronic Funds Transfer (EFT), WSC's Designated Billing Company, Caliber Labs, LLC, reserves the right to draft via EFT all amounts owed by the Member/Passholder including any and all late fees and service fees subject to appropriate State and Federal Law.",
      },
      { type: "heading", text: "Right to Change Designated Billing Company" },
      {
        type: "paragraph",
        text: "WSC hereby reserves the right to change the Designated Billing Company at their discretion and without warning. If such a change is made, the full terms and conditions of this Agreement will continue to apply and Member/Passholder agrees to authorize the new Designated Billing Company to continue drafting Member/Passholder's account.",
      },
    ],
  },
  {
    id: "maintenance",
    title: "Facility maintenance and holder notice",
    summary: "Temporary closures, possible maintenance charges, and holder notice.",
    blocks: [
      {
        type: "paragraph",
        text: "WSC may be temporarily closed for periods of up to two (2) weeks each year for maintenance purposes. WSC reserves the right to add an annual facility maintenance charge of up to, but no greater than, $150 per Member/Passholder agreement account (does not apply to free accounts).",
      },
      {
        type: "paragraph",
        text: "If a Facility Maintenance Charge is implemented in the future, Member/Passholder will be given a minimum of a sixty (60) day notice of the amount owed and due date. Member/Passholder authorizes the Designated Billing Company to automatically draft this amount along with the Member/Passholder's regular Member/Passholder agreement dues.",
      },
      {
        type: "notice",
        text: "NOTICE: ANY HOLDER OF THIS AGREEMENT IS SUBJECT TO ALL CLAIMS AND DEFENSES WHICH THE DEBTOR COULD ASSERT AGAINST THE SELLER OF GOODS OR SERVICES OBTAINED PURSUANT HERETO OR WITH THE PROCEEDS HEREOF, RECOVERY HEREUNDER BY THE DEBTOR SHALL NOT EXCEED AMOUNTS PAID BY THE DEBTOR HEREUNDER.",
      },
    ],
  },
  {
    id: "obligations",
    title: "Member/Passholder obligations",
    summary: "Payment, conduct, collection, check-in, and ongoing financial obligations.",
    blocks: [
      {
        type: "bullets",
        items: [
          "Member/Passholder agrees to abide by all WSC policies, follow the directions of the staff regarding safety and security issues, and to treat the staff and other Member/Passholders with courtesy.",
          "Member/Passholder agrees to pay monthly dues on time, including notifying WSC promptly if banking or credit card information used for automatic payment changes, or to be charged a declined payment fee and/or a late fee per delinquent payment.",
          "WSC Management reserves the right to increase late penalty amount with 60 day notice to Member/Passholder agreement.",
          "Member/Passholder agrees to pay all costs of collection incurred by the holder of this agreement if Member/Passholder's account becomes more than sixty (60) days past due.",
          "Member/Passholder agrees to continue to fulfill the financial obligation of this agreement except as allowed via Disability or Death as outlined below.",
          "Member/Passholders are required to check in with the front desk using their provided WSC QR Code or valid photo ID.",
        ],
      },
    ],
  },
  {
    id: "disability",
    title: "Membership/Passholder agreement disability",
    summary: "Temporary disability freezes, senior freezes, permanent disability, and freeze fees.",
    blocks: [
      {
        type: "paragraph",
        text: "If Member/Passholder becomes temporarily disabled, Member/Passholder may freeze their account for up to three (3) months. The request must be made in writing and WSC may require proof of the disability and a written physician note verifying that the Member/Passholder is not physically able to use the facilities of WSC.",
      },
      {
        type: "paragraph",
        text: "A medical issue is the only circumstance where a non-senior Member/Passholder can freeze their account and must be accompanied with appropriate information from the doctor or medical facility (nature of injury, approx. recovery time). Senior Member/Passholders are allowed one freeze (up to 120 consecutive days) per calendar year. A monthly administrative fee outlined in the WSC Member/Passholder agreement Guide will be charged to all freezes.",
      },
      {
        type: "paragraph",
        text: "If Member/Passholder is permanently disabled, Member/Passholder may cancel this Agreement with the standard 30 day notice to cancel Member/Passholder agreement in writing. If account is currently frozen for medical reasons and it is determined that Member/Passholder is permanently disabled, the 30 day minimum notice can be waived.",
      },
      {
        type: "paragraph",
        text: "If Member/Passholder's account is frozen for any reason, Member/Passholder will be assessed a fee as outlined in the WSC Member/Passholder agreement Guide. Regular payments and time will be added to the end of the existing Member/Passholder agreement term (if applicable).",
      },
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation policies",
    summary: "Written notice, refund window, email cancellation, nonrefundable items, death/disability, and WSC cancellation rights.",
    blocks: [
      {
        type: "paragraph",
        text: "Member/Passholder's accounts will continue to accrue monthly Member/Passholder agreement fees until explicitly cancelled by the Member/Passholder. Member/Passholder understands that WSC will under no circumstance automatically cancel an account on behalf of the Member/Passholder and that the Member/Passholder is responsible for giving appropriate written notice to WSC. Member/Passholder's account must be current before any cancellation will take effect.",
      },
      {
        type: "paragraph",
        text: "Member/Passholder may cancel their Member/Passholder agreement and receive a full refund within three (3) business days of signing this Agreement by providing a written notice and returning all access cards to WSC. If access cards are not returned, WSC will deduct the cost of the cards from the refund.",
      },
      {
        type: "notice",
        text: "CANCEL@WOODINVILLESPORTSCLUB.COM. In the event the Member/Passholders next scheduled billing date is less than 30 days from the submission date they WILL be billed the full amount of their dues per the terms outlined in their contract. Any payments due prior to cancellation taking effect will still be due and payable.",
      },
      {
        type: "paragraph",
        text: "Annual fees, prepaid dues, programming, lessons, and punch cards will not be refunded regardless of illness, injury or personal circumstance.",
      },
      {
        type: "paragraph",
        text: "If Member/Passholder dies or becomes totally and permanently disabled, Member/Passholder or Member/Passholder's estate may cancel this Agreement by providing a written request and certifiable proof of disability or death. For permanent disability, Member/Passholder's doctor must provide certification of the disability and state that the Member/Passholder is unable to use any of WSC's facilities. Any pre-paid dues remaining will not be refunded.",
      },
      {
        type: "paragraph",
        text: "WSC reserves the right to cancel or suspend the Member/Passholder agreement of any person for any reason. If such cancellation or suspension is made due to violation of WSC policies, violation of terms of this Agreement, or due to damage rendered by Member/Passholder or Member/Passholder's guests, Member/Passholder will remain responsible for the financial obligations of this Agreement, as well as a $25.00 cancellation fee. In the case where the facility or its contents are damaged, Member/Passholder is also responsible for any repair or replacement thereof.",
      },
      {
        type: "paragraph",
        text: "To cancel for any of the above reasons, Member/Passholder is to send or deliver a written notice to WSC or to the Designated Billing Company, and remit payment for any past due balances.",
      },
    ],
  },
  {
    id: "club-policies",
    title: "Summary of club policies",
    summary: "Facility access, account use, suspension, commercial activity, dress code, conduct, disputes, lockers, photos, and communications.",
    blocks: [
      {
        type: "bullets",
        items: [
          "WSC reserves the right to refuse service to anyone.",
          "Member/Passholder, by executing this Agreement, does hereby join WSC and such agreement entitles the Member/Passholder to use the facilities. The Member/Passholder is entitled to use the facility only and Member/Passholder is required to provide Member/Passholder's own athletic equipment and clothes. The Member/Passholder may be subject to additional charges for and including, but not limited to, tennis courts, lessons, and personal training. The Member/Passholder may also be charged for purchases through the use of their account number.",
          "Member/Passholder must present upon entering WSC his/her QR Code in the WSC CourtReserve mobile application. Member/Passholder agrees that Member/Passholder may be denied access to WSC without his/her Member/Passholder agreement card. If a Member/Passholder QR Code is not provided, Member/Passholder agrees to show driver's license or other valid state or federal ID.",
          "Member/Passholder agrees to abide by all Member/Passholder agreement regulations of WSC. Member/Passholder agrees to comply with stated and customary rules for participation and use of equipment. Unless cancelled as provided in this Agreement, Member/Passholder will be responsible for all payments due and owing under this Agreement, even if Member/Passholder does not use WSC's facilities and services. However, in the event of death or disability, liability for fees will terminate as of the date of death or disability.",
          "If Member/Passholder violates this Agreement and the terms contained therein or any of the rules and regulations for use of the facility, WSC may suspend the Member/Passholder's right to use the facility until such time as the Member/Passholder provides WSC with reasonable assurance of future compliance. During the period of any such suspension, the Member/Passholder shall not be entitled to a credit for any prepayment of dues or other fees due or paid pursuant to this Member/Passholder agreement Agreement. Additionally, Member/Passholder may be assessed an account suspension fee not to exceed $10/month. In the event Member/Passholder continues to violate the terms of this Agreement or the rules and regulations governing the facility, the Member/Passholder's Member/Passholder agreement may be terminated by WSC, and the balance of the Agreement declared due and payable in full immediately.",
          "Member/Passholder agrees that he/she shall not engage in any type of commercial or business activity while using the facilities unless allowed by WSC Management. Member/Passholder shall not act as a trainer for any other Member/Passholders or guests and any acts which constitute such business activities are strictly forbidden. If Member/Passholder engages in such commercial or business activities Member/Passholder's Member/Passholder agreement shall be subject to immediate cancellation and the balance of this Agreement declared due and payable in full immediately.",
          "Member/Passholder agrees that Member/Passholder shall abide by WSC dress code at all times while in the facility. Member/Passholder must wear a shirt or top at all times. Flip-flops or bare feet are not allowed in WSC.",
          "Member/Passholder agrees that he/she will not use loud or profane language upon WSC premises nor will Member/Passholder molest, badger, assault or harass other WSC Member/Passholders, guests or employees. If Member/Passholder engages in such behavior, Member/Passholder's Member/Passholder agreement shall be subject to immediate cancellation, and the balance of this Agreement declared due and payable in full immediately.",
          "Member/Passholder understands that WSC prohibits the use of any drugs or steroids and Member/Passholder agrees not to use any drugs or steroids on WSC premises. Member/Passholder acknowledges and is aware that steroids can cause numerous physical, mental, and emotional problems relating to physical maturity and growth and may cause heart disease, strokes, liver dysfunction, sterility and infertility, and many other adverse health problems. Member/Passholder recognizes and acknowledges that there are serious criminal and civil penalties for the illegal possession, sale, use, trading, or exchange of steroids and no such activity is allowed upon WSC premises.",
          "Member/Passholder agrees that if he/she fails to use WSC facilities that this failure shall not release the Member/Passholder from the obligation to make all payments required by the terms of this Member/Passholder Agreement.",
          "Member/Passholder agrees that all disputes (except small claims under $1,000) will be settled by binding arbitration before a single arbitrator under the authority of the Federal Arbitration Act, conducted by and in accordance with the rules and procedures of the American Arbitration Association. The arbitration will take place in the county in which this WSC is located unless otherwise agreed. The decision of the arbitrator will be final and binding on all parties and may be enforced by a judgment entered upon the arbitration award by any state or Federal court in this state.",
          "Should this Agreement be placed in the hands of an attorney for the violation of any provision contained herein, the parties agree that WSC shall be entitled to recover all costs and expenses resulting there from, including a reasonable amount as attorney's fees.",
          "Both Member/Passholder and WSC hereby agree that the whole agreement between the parties relating to the subject matter hereof is contained in this Agreement and shall supersede any prior understandings, arrangements, commitments, or undertakings of the parties, whether written or oral, express, or implied.",
          "This Agreement may not be amended or modified except by an instrument in writing executed by the parties hereto.",
          "Member/Passholder authorizes WSC, and Caliber Labs, LLC. to contact Member/Passholder by e-mail or telephone.",
          "Lockers are for day use only and Member/Passholders are responsible for providing their own lock. Contents on lockers left overnight will be removed at the end of the business day. WSC is not responsible for any lost or stolen items.",
          "WSC may take images or videos of Member/Passholders and guests for marketing or social media purposes. If you do not wish to have images taken by WSC, please let the team Member/Passholder know, so that you can opt out. By your continued use of WSC's premises and services, including participation in the class, you irrevocably consent to and grant WSC the exclusive, worldwide, perpetual, royalty-free and otherwise unlimited right to use, copy, modify, distribute, publicly display and perform, publish, transmit, remove, retain, and repurpose the images for any purpose in any media or form of communication, without additional consent and without compensation, including but not limited to WSC's commercial and promotional use on its corporate or employee social media sites.",
        ],
      },
    ],
  },
  {
    id: "safety",
    title: "Safety notices",
    summary: "Guest access, QR codes, personal training, equipment, panic alarms, behavior, and age requirements.",
    blocks: [
      {
        type: "bullets",
        items: [
          "WSC Member/Passholders are welcome to bring friends, family Member/Passholders and co-workers to enjoy the facilities. Payment of applicable guest fee required before using the facility, unless otherwise posted. An individual can be a guest up to the limit outlined in the WSC Member/Passholder Agreement Guide. If this policy is violated, at the sole discretion of the facility management, the Member/Passholder may be charged a guest fee and/or have their Member/Passholder Agreement suspended or canceled, the balance of this Agreement declared due and payable in full immediately and be assessed a penalty of up to $250.00. Member/Passholders may not allow anyone else to use their QR Code and must alert WSC immediately if it is lost or stolen. Violating this policy carries the same penalties as violating the guest policy.",
          "Member/Passholders who do not have their QR Code or valid state/federal ID may not be allowed into the facility during non-staffed hours, nor should they expect for anyone else to let them into the facility.",
          "Personal training services provided in this facility may be provided either by employees or by independent contractors operating their own business. Regardless, all payments for personal training services are to be made to WSC (unless otherwise arranged with WSC Management), who will then pay the trainers as the services are provided.",
          "All Member/Passholders have access to a free orientation to the facility and the proper use of its equipment. It is the Member/Passholder's responsibility to request this orientation.",
          "It is each Member/Passholder's individual responsibility to wipe down the equipment and re-rack the weights the Member/Passholder has used.",
          "Member/Passholders are hereby required to use the safety features of the equipment. If a Member/Passholder is unsure of how to use a machine, the Member/Passholder should obtain instructions from the staff or personal trainers.",
          "Member/Passholders are responsible for understanding how to operate the panic alarms and agree to use them only in case of an emergency.",
          "Horseplay, vulgar language, abuse of the equipment, working out while intoxicated, or other inappropriate behavior will not be tolerated and may result in the suspension or cancellation of the offending Member/Passholder's Member/Passholder agreement, and the balance of this Agreement being declared due and payable in full immediately.",
          "This WSC has a strict age requirement policy. Please see WSC Member/Passholder agreement Guide for more details.",
        ],
      },
    ],
  },
  {
    id: "acknowledgement",
    title: "Policy updates and acknowledgement",
    summary: "WSC modification rights, current guide location, and account-creation acknowledgement.",
    blocks: [
      {
        type: "paragraph",
        text: "WSC retains the right to modify these policies without warning. Reasonable rules and regulations may be posted in the Member/Passholder agreement Guide or at WSC from time to time and all Member/Passholders shall be subject to strict compliance therewith. The most current copy of the WSC Member/Passholder agreement Guide can be found at WSC or at WSC's website.",
      },
      {
        type: "notice",
        text: "By submitting the creation of this account, Member/Passholder acknowledges receipt and agrees to terms outlined in this Member/Passholder agreement Agreement.",
      },
    ],
  },
];

function AgreementBlockView({ block }: { block: AgreementBlock }) {
  if (block.type === "heading") {
    return <h4 className="text-ink text-[14px] tracking-[0.12em] uppercase font-medium pt-3">{block.text}</h4>;
  }

  if (block.type === "bullets") {
    return <BulletList items={block.items} />;
  }

  if (block.type === "notice") {
    return (
      <div className="bg-parchment border-l-2 border-volt px-5 py-4 text-ink text-[13px] leading-[1.72]">
        {block.text}
      </div>
    );
  }

  return <p>{block.text}</p>;
}

function MembershipAgreementAccordion() {
  return (
    <Accordion
      type="multiple"
      defaultValue={["release"]}
      className="border border-ink/10 bg-parchment-mid"
    >
      {MEMBERSHIP_AGREEMENT_SECTIONS.map((section) => (
        <AccordionItem key={section.id} value={section.id} className="border-ink/10">
          <AccordionTrigger className="px-5 sm:px-6 py-5 hover:no-underline">
            <span className="flex flex-col gap-1.5">
              <span className="text-ink text-[15px] sm:text-[16px] font-normal tracking-[-0.01em] leading-[1.35]">
                {section.title}
              </span>
              <span className="text-ink-light text-[12px] leading-[1.55] font-normal">
                {section.summary}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 sm:px-6 pb-7">
            <div className="space-y-4 text-ink-mid text-[14px] leading-[1.78]">
              {section.blocks.map((block, i) => (
                <AgreementBlockView key={i} block={block} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
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
          <SectionHeading>Full membership agreement form.</SectionHeading>
          <p className="text-ink-mid text-[15px] leading-[1.78] mb-8">
            Open each section below to review the complete WSC Member/Passholder agreement language.
          </p>
          <MembershipAgreementAccordion />
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
              "Driving range (more than 23 covered bays with Toptracer) open to members and public",
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
          <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Questions?</p>
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
