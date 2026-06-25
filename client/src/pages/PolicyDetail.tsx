import PageHero from "@/components/PageHero";
import SEOHead from "@/components/SEOHead";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { Link, useLocation } from "wouter";

const HERO_IMG = "/images/wsc/campus-dome.webp";

type DetailBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "notice"; text: string }
  | { type: "fees"; rows: { item: string; fee: string }[] };

type DetailSection = {
  eyebrow: string;
  heading: string;
  blocks: DetailBlock[];
};

type PolicyDetail = {
  slug: string;
  title: string;
  eyebrow: string;
  headline: string;
  description: string;
  sections: DetailSection[];
};

const POLICY_DETAILS: Record<string, PolicyDetail> = {
  "booking-policies-expanded": {
    slug: "booking-policies-expanded",
    title: "Booking Policies Expanded",
    eyebrow: "Court Booking",
    headline: "Booking Policies Expanded.",
    description:
      "Expanded Woodinville Sports Club court booking policies covering CourtReserve, reservation limits, check-in, cancellations, guests, and court usage.",
    sections: [
      {
        eyebrow: "Online Booking",
        heading: "Reservation access and booking windows.",
        blocks: [
          {
            type: "paragraph",
            text: "Online booking reservations open daily at 8:00 AM through CourtReserve, with a 7-day booking window. Members may select a duration of 30, 60, or 90 minutes per session.",
          },
          {
            type: "bullets",
            items: [
              "Members are limited to 3 active reservations within any rolling 7-day period. Active reservations include any current bookings within the next seven days.",
              "Members can only book one court at a time. Side-by-side bookings are not permitted.",
              "The booking system will not allow reservations that create 30-minute gaps between court times.",
              "Court time is charged in 30-minute increments. Current listed court time is $21.14 + tax per 30 minutes.",
            ],
          },
          {
            type: "notice",
            text: "These rules are intended to keep prime court times available to more members and prevent defensive booking practices.",
          },
        ],
      },
      {
        eyebrow: "Check-In",
        heading: "Front desk and CourtReserve check-in.",
        blocks: [
          {
            type: "paragraph",
            text: "All members and guests must check in at the front desk or by using the CourtReserve App before going to court. Failure to check in or provide complete participant information will result in a full court fee.",
          },
          {
            type: "paragraph",
            text: "Window drive-up check-in is no longer available. Members and guests must enter the building and use a QR code, verify identity, or check in through the CourtReserve App.",
          },
        ],
      },
      {
        eyebrow: "Cancellations",
        heading: "Court cancellation standards.",
        blocks: [
          {
            type: "paragraph",
            text: "A 24-hour notice is required for court cancellation, regardless of illness, injury, or personal circumstance, to receive a balance credit on the account.",
          },
          {
            type: "bullets",
            items: [
              "Members are responsible for all no-show or late-canceled court fees.",
              "Members may not book new courts until any outstanding late-canceled fees are paid.",
              "Cancellations may not be used as a workaround to avoid court booking rules and restrictions.",
              "Members who engage in cancellation patterns to avoid compliance with the intent of the policy risk account suspension.",
            ],
          },
        ],
      },
      {
        eyebrow: "Guests",
        heading: "Guest fees and responsibility.",
        blocks: [
          {
            type: "paragraph",
            text: "WSC members are welcome to bring friends, family members, and co-workers to enjoy the facilities. Payment of the applicable guest fee is required before using the facility, and the member must be present.",
          },
          {
            type: "fees",
            rows: [
              { item: "Tennis Guest Fee", fee: "$10 + tax / guest / court reservation" },
              { item: "Pickleball Guest Fee", fee: "$5 + tax / guest / court reservation" },
            ],
          },
          {
            type: "paragraph",
            text: "Members can pay the guest fee at the time of booking through CourtReserve. If the guest does not pay, the member who made the booking will be responsible for the guest fee.",
          },
        ],
      },
      {
        eyebrow: "Court Usage",
        heading: "Equipment, shoes, and court standards.",
        blocks: [
          {
            type: "bullets",
            items: [
              "Outside ball machines and ball hoppers are prohibited on WSC courts.",
              "Rental baskets of Babolat balls are available for $15 + tax.",
              "The Playmate Smash ball machine remains available for rent on courts #7 and #8.",
              "Court shoes specifically designed for tennis or pickleball must be worn on court. Sneakers and running shoes are not permitted.",
              "A shirt or top must be worn at all times, and proper footwear for the environment being used is required.",
            ],
          },
        ],
      },
    ],
  },
  "membership-policies-expanded": {
    slug: "membership-policies-expanded",
    title: "Membership Policies Expanded",
    eyebrow: "Membership Policies",
    headline: "Membership Policies Expanded.",
    description:
      "Expanded Woodinville Sports Club membership policies covering agreement terms, payments, cancellations, freezes, guests, account access, and conduct.",
    sections: [
      {
        eyebrow: "Agreement",
        heading: "Membership terms and current guide.",
        blocks: [
          {
            type: "paragraph",
            text: "The WSC Membership Agreement was last updated on January 1, 2024. WSC retains the right to modify policies without warning. The most current copy of the Membership Guide can be found at WSC or on the WSC website.",
          },
          {
            type: "paragraph",
            text: "Using WSC facilities, services, or activities involves the risk of injury, ranging from minor to catastrophic injuries including death. By becoming a member, you voluntarily accept this risk and agree that WSC, its officers, directors, employees, volunteers, agents, and independent contractors will not be liable for any injury.",
          },
        ],
      },
      {
        eyebrow: "Payment",
        heading: "Dues, EFT, and defaults.",
        blocks: [
          {
            type: "paragraph",
            text: "All payments are processed through Electronic Funds Transfer from the member's financial account, including credit card, debit card, checking account, or savings account. Payment is charged on the join date and recurs based on membership type.",
          },
          {
            type: "bullets",
            items: [
              "A joining or rejoining fee is assessed at the start of membership, including for returning customers previously enrolled with passes or memberships.",
              "It is the member's responsibility to keep all account information accurate and current.",
              "A default occurs when any payment is more than ten days late.",
              "Late fees may be charged for payments more than 10 days past due.",
              "An additional service fee may be charged for any returned check, draft, or credit card.",
              "WSC reserves the right to declare the entire remaining balance due and payable and collect allowable collection costs.",
            ],
          },
        ],
      },
      {
        eyebrow: "Cancellation",
        heading: "Membership cancellation policy.",
        blocks: [
          {
            type: "bullets",
            items: [
              "Accounts continue to accrue monthly fees until explicitly canceled by the member. WSC will not automatically cancel any membership.",
              "Members may cancel and receive a full refund within 3 business days of signing by providing written notice and returning all access cards.",
              "To cancel, email CANCEL@WOODINVILLESPORTSCLUB.COM.",
              "If the cancellation date is less than 30 days from the next billing date, the member will be billed the full amount of dues per contract terms.",
              "Annual fees, prepaid dues, programming, lessons, and punch cards will not be refunded regardless of illness, injury, or personal circumstance.",
              "Funds may be returned as balance credits only when allowed.",
              "WSC reserves the right to cancel or suspend any membership for any reason. If due to policy violations, the member remains responsible for all financial obligations.",
            ],
          },
        ],
      },
      {
        eyebrow: "Freezes",
        heading: "Disability and account freeze terms.",
        blocks: [
          {
            type: "bullets",
            items: [
              "Temporary disability: account may be frozen for up to 3 months with a written request and physician note.",
              "Medical issues are the only circumstance for account freeze unless a senior freeze applies.",
              "Permanent disability: membership may be canceled with the standard 30-day written notice.",
              "If an account is already frozen for medical reasons and permanent disability is determined, the 30-day notice may be waived.",
              "During a freeze, a fee will be assessed as outlined in the agreement, and regular payments and time will be added to the end of the existing term.",
            ],
          },
        ],
      },
      {
        eyebrow: "Guests & Access",
        heading: "Guest policy, account photos, and access cards.",
        blocks: [
          {
            type: "paragraph",
            text: "Members may bring guests when the member is present and the applicable guest fee is paid before use of the facility.",
          },
          {
            type: "notice",
            text: "If the guest policy is violated, at the sole discretion of facility management, the member may be charged a guest fee and/or have membership suspended or canceled, with the balance declared due and payable in full immediately, and may be assessed a penalty of up to $250.00.",
          },
          {
            type: "paragraph",
            text: "Members may not allow anyone else to use their access card and must alert WSC immediately if it is lost or stolen. All CourtReserve accounts must include current photos of all users associated with the account.",
          },
        ],
      },
      {
        eyebrow: "Conduct",
        heading: "Member obligations and conduct rules.",
        blocks: [
          {
            type: "bullets",
            items: [
              "Members agree to abide by all WSC policies and follow staff directions regarding safety and security.",
              "Members agree to treat staff and other members with courtesy.",
              "Members who fail to use WSC facilities are not released from the obligation to make all payments required by the agreement.",
              "No loud or profane language is permitted on WSC premises.",
              "No harassment, assault, or intimidation of other members, guests, or employees is permitted.",
              "No commercial or business activity is permitted while using facilities unless allowed by WSC Management.",
              "No drugs or steroids are permitted on WSC premises.",
            ],
          },
        ],
      },
    ],
  },
  "usta-policies-expanded": {
    slug: "usta-policies-expanded",
    title: "USTA Policies Expanded",
    eyebrow: "USTA",
    headline: "USTA Policies Expanded.",
    description:
      "Expanded Woodinville Sports Club USTA team policies covering captain requirements, warm-up courts, match timing, fees, and cancellations.",
    sections: [
      {
        eyebrow: "Team Eligibility",
        heading: "Captain and membership requirements.",
        blocks: [
          {
            type: "paragraph",
            text: "WSC welcomes USTA teams. Captains must hold at least a Class Registration Pass, and at least one captain per team must have a valid WSC membership.",
          },
          {
            type: "paragraph",
            text: "Team play remains subject to WSC facility policies, CourtReserve account requirements, front desk check-in, guest policies, and staff direction.",
          },
        ],
      },
      {
        eyebrow: "Reservations",
        heading: "Warm-up court reservations.",
        blocks: [
          {
            type: "paragraph",
            text: "Visiting teams can only reserve warmup courts the day of the match. Home teams can reserve their warmup court up to 7 days in advance by the WSC captain.",
          },
          {
            type: "paragraph",
            text: "Home captains with booking privileges may reserve warm-up courts up to 7 days in advance. Visiting teams may book within 24 hours by calling the front desk.",
          },
        ],
      },
      {
        eyebrow: "Fees",
        heading: "Team court fees and balls.",
        blocks: [
          {
            type: "fees",
            rows: [
              { item: "USTA Team Fee", fee: "$21 + tax per court" },
              { item: "Included", fee: "One can of Babolat balls" },
            ],
          },
          {
            type: "paragraph",
            text: "USTA fees for home and visiting teams are $21 + tax per court and include a can of Babolat balls from the retail shop.",
          },
        ],
      },
      {
        eyebrow: "Match Timing",
        heading: "Match length and overflow.",
        blocks: [
          {
            type: "paragraph",
            text: "League matches typically run 90 minutes. Matches beyond 95 minutes must continue on an overflow court or be scheduled for completion later.",
          },
          {
            type: "paragraph",
            text: "Teams must communicate match cancellations at least 24 hours before the scheduled match time. Late defaults may be responsible for the full court cost.",
          },
        ],
      },
    ],
  },
  "cups-policies-expanded": {
    slug: "cups-policies-expanded",
    title: "Cups Policies Expanded",
    eyebrow: "Seattle Area Cup Tennis",
    headline: "Cups Policies Expanded.",
    description:
      "Expanded Woodinville Sports Club Seattle Area Cup Tennis policies covering team access, warm-up courts, fees, timing, and cancellation expectations.",
    sections: [
      {
        eyebrow: "Team Tennis",
        heading: "Seattle Area Cup Tennis at WSC.",
        blocks: [
          {
            type: "paragraph",
            text: "WSC welcomes Seattle Area Cup Tennis teams. Captains must hold at least a Class Registration Pass, and at least one captain per team must have a valid WSC membership.",
          },
          {
            type: "paragraph",
            text: "Cup team play remains subject to WSC facility policies, CourtReserve account requirements, front desk check-in, guest policies, and staff direction.",
          },
        ],
      },
      {
        eyebrow: "Reservations",
        heading: "Warm-up courts and scheduling.",
        blocks: [
          {
            type: "paragraph",
            text: "Home captains with booking privileges may reserve warm-up courts up to 7 days in advance. Visiting teams may book within 24 hours by calling the front desk.",
          },
          {
            type: "paragraph",
            text: "Teams should confirm match scheduling, warm-up needs, and any overflow-court requirements with the WSC front desk when match logistics differ from standard league use.",
          },
        ],
      },
      {
        eyebrow: "Fees",
        heading: "Team fees and payment.",
        blocks: [
          {
            type: "paragraph",
            text: "Home and visiting teams pay $21 + tax per person in one lump-sum payment at the front desk.",
          },
          {
            type: "notice",
            text: "If a team has a different league-specific billing arrangement, captains should confirm it with WSC staff before the match date.",
          },
        ],
      },
      {
        eyebrow: "Match Timing",
        heading: "Match length and cancellation expectations.",
        blocks: [
          {
            type: "paragraph",
            text: "League matches typically run 90 minutes. Matches beyond 95 minutes must continue on an overflow court or be scheduled for completion later.",
          },
          {
            type: "paragraph",
            text: "Teams must communicate match cancellations at least 24 hours before the scheduled match time. Late defaults may be responsible for the full court cost.",
          },
        ],
      },
    ],
  },
};

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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 my-4">
      {items.map((item, i) => (
        <li key={i} className="text-ink-mid text-[14px] leading-[1.72] flex items-start gap-3">
          <span className="text-volt text-[10px] mt-1.5">-</span> {item}
        </li>
      ))}
    </ul>
  );
}

function FeeTable({ rows }: { rows: { item: string; fee: string }[] }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-[14px]">
        <thead>
          <tr className="border-b border-ink/10">
            <th className="text-left text-ink text-[12px] tracking-[0.1em] uppercase py-3 pr-4 font-medium">Item</th>
            <th className="text-right text-ink text-[12px] tracking-[0.1em] uppercase py-3 font-medium">Detail</th>
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

function renderBlock(block: DetailBlock, index: number) {
  if (block.type === "paragraph") {
    return <p key={index}>{block.text}</p>;
  }

  if (block.type === "bullets") {
    return <BulletList key={index} items={block.items} />;
  }

  if (block.type === "fees") {
    return <FeeTable key={index} rows={block.rows} />;
  }

  return (
    <div key={index} className="p-6 bg-parchment border-l-2 border-volt my-6">
      <p className="text-ink text-[15px] leading-[1.72]">{block.text}</p>
    </div>
  );
}

function PolicyNotFound() {
  return (
    <div className="min-h-screen bg-parchment px-6 lg:px-14 py-32">
      <div className="max-w-[800px] mx-auto">
        <SectionEyebrow>Policies</SectionEyebrow>
        <SectionHeading>Policy page not found.</SectionHeading>
        <p className="text-ink-mid text-[15px] leading-[1.82] mb-8">
          The policy detail page you requested could not be found.
        </p>
        <Link
          href="/policies"
          className="text-[12px] tracking-[0.1em] uppercase no-underline text-dark-bg bg-volt-bright px-8 py-4 hover:bg-ink hover:text-parchment transition-colors duration-200 inline-block"
        >
          Back to Policies
        </Link>
      </div>
    </div>
  );
}

export default function PolicyDetail() {
  const [location] = useLocation();
  const parts = location.split("/").filter(Boolean);
  const slug = parts[parts.length - 1] ?? "";
  const policy = POLICY_DETAILS[slug];

  if (!policy) {
    return <PolicyNotFound />;
  }

  const path = `/policies/${policy.slug}`;

  return (
    <div className="min-h-screen">
      <SEOHead title={policy.title} description={policy.description} path={path} image={HERO_IMG} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Policies & Terms", url: "https://www.woodinvillesportsclub.com/policies" },
        { name: policy.title, url: `https://www.woodinvillesportsclub.com${path}` },
      ])]} />
      <PageHero
        eyebrow={policy.eyebrow}
        headline={policy.headline}
        subtitle={policy.description}
        image={HERO_IMG}
      />

      <section className="bg-parchment px-6 lg:px-14 py-16 lg:py-20">
        <div className="max-w-[800px] mx-auto">
          <Link
            href="/policies#court-booking"
            className="text-ink text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt pb-[3px]"
          >
            Back to Policies
          </Link>
          <p className="text-ink-mid text-[13px] leading-[1.72] mt-8">
            Expanded policy copy restored from WSC's prior website policy crawl and current site policy references. For final enforcement questions, confirm with WSC staff.
          </p>
        </div>
      </section>

      {policy.sections.map((section, index) => (
        <section
          key={section.heading}
          className={`${index % 2 === 0 ? "bg-parchment-mid" : "bg-parchment"} px-6 lg:px-14 py-20 lg:py-24`}
        >
          <div className="max-w-[800px] mx-auto">
            <SectionEyebrow>{section.eyebrow}</SectionEyebrow>
            <SectionHeading>{section.heading}</SectionHeading>
            <div className="space-y-5 text-ink-mid text-[15px] leading-[1.82]">
              {section.blocks.map(renderBlock)}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-dark-bg px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Need Help?</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
            Ask the front desk.
          </h2>
          <p className="text-parchment/80 text-[15px] leading-[1.72] mb-10 max-w-[520px] mx-auto">
            Staff can confirm the current policy, fee, or booking process before you reserve, register, or bring a guest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+14254871090"
              className="text-[12px] tracking-[0.1em] uppercase no-underline text-dark-bg bg-volt-bright px-8 py-4 hover:bg-parchment transition-colors duration-200 inline-block"
            >
              Call Front Desk
            </a>
            <Link
              href="/contact"
              className="text-[12px] tracking-[0.1em] uppercase no-underline text-parchment border border-parchment/30 px-8 py-4 hover:bg-parchment/10 transition-colors duration-200 inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
