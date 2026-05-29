/*
 * Structured Data (JSON-LD) Component
 * Injects schema.org structured data into the page head for SEO.
 * Supports: LocalBusiness, SportsActivityLocation, Organization, WebSite, BreadcrumbList
 */

/* ─── Base Organization Schema ─── */
const WSC_ORGANIZATION = {
  "@type": "Organization",
  name: "Woodinville Sports Club",
  legalName: "Woodinville Sports Club",
  url: "https://www.woodinvillesportsclub.com",
  logo: "https://www.woodinvillesportsclub.com/logo.png",
  sameAs: [
    "https://www.instagram.com/woodinvillesportsclub",
    "https://www.tier1nw.com",
  ],
};

/* ─── Address ─── */
const WSC_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "15327 140th Pl NE",
  addressLocality: "Woodinville",
  addressRegion: "WA",
  postalCode: "98072",
  addressCountry: "US",
};

/* ─── Geo Coordinates ─── */
const WSC_GEO = {
  "@type": "GeoCoordinates",
  latitude: 47.7543,
  longitude: -122.1635,
};

/* ─── Opening Hours ─── */
const WSC_HOURS = [
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "06:00", closes: "23:00" },
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "07:00", closes: "22:00" },
];

/* ─── Main LocalBusiness + SportsActivityLocation Schema ─── */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "LocalBusiness"],
    "@id": "https://www.woodinvillesportsclub.com/#organization",
    name: "Woodinville Sports Club",
    legalName: "Woodinville Sports Club",
    alternateName: "WSC",
    description:
      "A 67-acre hybrid performance campus in Woodinville, WA offering world-class tennis, golf, pickleball, and athletic performance training. Home to Tier 1 Sports — one of the nation's leading developmental programs.",
    url: "https://www.woodinvillesportsclub.com",
    telephone: "+1-425-487-1090",
    email: "info@woodinvillesportsclub.com",
    image: [
      "https://www.woodinvillesportsclub.com/images/wsc/campus-dome.webp",
      "https://www.woodinvillesportsclub.com/images/wsc/tennis-courts.webp",
    ],
    logo: "https://www.woodinvillesportsclub.com/logo.png",
    address: WSC_ADDRESS,
    geo: WSC_GEO,
    openingHoursSpecification: WSC_HOURS,
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card",
    foundingDate: "1976",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: WSC_GEO,
      geoRadius: "30 mi",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "WSC Programs & Services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Tennis Programs",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tier 1 Tennis Academy", description: "Elite junior tennis training led by former world-ranked professionals" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Adult Tennis Classes", description: "Group and private tennis instruction for adults of all levels" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Court Rental", description: "8 indoor tennis courts and 1 outdoor tennis court available for booking" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Golf Programs",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tier 1 Golf Academy", description: "Junior and adult golf instruction with WGTF Master Certified coaching" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Driving Range", description: "More than 23 covered bays with free Toptracer technology, open to the public" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Swing Lab Golf Simulators", description: "4 Uneekor simulators capturing 24 data points with 2,000+ courses" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Fitness & Performance",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Athletic Performance Lab", description: "Elite strength and conditioning training for youth and adult athletes" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Gym & Fitness Center", description: "Full-service gym with cardio, weights, and group fitness classes" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Pickleball",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pickleball at The Dome", description: "Open play 7 days a week, private court rentals, and classes for all levels" } },
          ],
        },
      ],
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Tennis Courts", value: "8 indoor courts and 1 outdoor court" },
      { "@type": "LocationFeatureSpecification", name: "Covered Driving Bays", value: "More than 23 bays with free Toptracer" },
      { "@type": "LocationFeatureSpecification", name: "Golf Simulators", value: "4 Uneekor Swing Lab simulators" },
      { "@type": "LocationFeatureSpecification", name: "Pickleball Dome", value: "Open play 7 days a week" },
      { "@type": "LocationFeatureSpecification", name: "Athletic Performance Lab", value: "Dedicated S&C training center" },
      { "@type": "LocationFeatureSpecification", name: "Short Game Area", value: "2.5-acre practice area" },
      { "@type": "LocationFeatureSpecification", name: "Campus Size", value: "67 acres" },
      { "@type": "LocationFeatureSpecification", name: "Parking", value: "Free on-site parking" },
    ],
    sameAs: [
      "https://www.instagram.com/woodinvillesportsclub",
      "https://www.tier1nw.com",
    ],
  };
}

/* ─── WebSite Schema (for sitelinks search box) ─── */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Woodinville Sports Club",
    alternateName: "WSC",
    url: "https://www.woodinvillesportsclub.com",
    publisher: {
      "@id": "https://www.woodinvillesportsclub.com/#organization",
    },
  };
}

/* ─── Breadcrumb Schema ─── */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/* ─── SportsEvent Schema (for Summer Camps) ─── */
export function getSummerCampSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "WSC Summer Training Camp 2026",
    description:
      "Summer training programs in Tennis, Golf, and Adventure Club camps for ages 3–18. June 29 – August 30, 2026.",
    startDate: "2026-06-29",
    endDate: "2026-08-30",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Woodinville Sports Club",
      address: WSC_ADDRESS,
      geo: WSC_GEO,
    },
    organizer: {
      "@type": "Organization",
      name: "Woodinville Sports Club",
      url: "https://www.woodinvillesportsclub.com",
    },
    offers: {
      "@type": "Offer",
      url: "https://www.woodinvillesportsclub.com/summer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
    typicalAgeRange: "3-18",
  };
}

/* ─── Contact Page Schema ─── */
export function getContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Woodinville Sports Club",
    description: "Get in touch with WSC for membership inquiries, tour scheduling, program information, and general questions.",
    url: "https://www.woodinvillesportsclub.com/contact",
    mainEntity: {
      "@type": ["SportsActivityLocation", "LocalBusiness"],
      "@id": "https://www.woodinvillesportsclub.com/#organization",
      name: "Woodinville Sports Club",
      legalName: "Woodinville Sports Club",
      telephone: "+1-425-487-1090",
      email: "info@woodinvillesportsclub.com",
      image: "https://www.woodinvillesportsclub.com/images/wsc/contact-campus.webp",
      address: WSC_ADDRESS,
      geo: WSC_GEO,
      openingHoursSpecification: WSC_HOURS,
      sameAs: [
        "https://www.instagram.com/woodinvillesportsclub",
        "https://www.tier1nw.com",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+1-425-487-1090",
          contactType: "customer service",
          areaServed: "US",
          availableLanguage: "English",
          hoursAvailable: WSC_HOURS,
        },
        {
          "@type": "ContactPoint",
          telephone: "+1-425-485-7319",
          contactType: "reservations",
          areaServed: "US",
          availableLanguage: "English",
          description: "Golf Desk — driving range, Swing Lab, and golf program inquiries",
        },
      ],
    },
  };
}

/* ─── FAQ Schema (for About page) ─── */
export function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What sports does Woodinville Sports Club offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WSC offers tennis (8 indoor courts and 1 outdoor court), golf (more than 23 covered driving bays with Toptracer, 4 Swing Lab simulators, and a 2.5-acre short game area), pickleball (The Dome with open play 7 days a week), and athletic performance training (APL Training Center and full-service gym).",
        },
      },
      {
        "@type": "Question",
        name: "What is Tier 1 Sports?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tier 1 Sports is one of the nation's leading developmental programs in tennis, golf, and athletic performance. Based at WSC, Tier 1 develops athletes from first swing to collegiate and professional ranks with world-class coaching.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Woodinville Sports Club located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WSC is located at 15327 140th Pl NE, Woodinville, WA 98072. The 67-acre campus is in the heart of Woodinville in the Pacific Northwest.",
        },
      },
      {
        "@type": "Question",
        name: "What are the hours of operation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WSC is open Monday through Friday from 6:00 AM to 9:00 PM, Saturday from 7:00 AM to 8:00 PM, and Sunday from 7:00 AM to 6:00 PM.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a membership to use the facilities?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WSC offers both membership and non-member options. The driving range is open to the public. Court bookings, classes, and programs are available to members with various annual and monthly membership tiers. Contact the front desk at (425) 487-1090 for membership information.",
        },
      },
      {
        "@type": "Question",
        name: "Does WSC offer summer camps for kids?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, WSC offers summer training programs from June 29 to August 30, 2026, including Tennis Academy, Golf Academy, and Adventure Club (a multi-sport camp) for ages 3–18.",
        },
      },
    ],
  };
}

/* ─── Component to inject JSON-LD into the page ─── */
interface StructuredDataProps {
  schemas: Record<string, unknown>[];
}

export default function StructuredData({ schemas }: StructuredDataProps) {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
