/**
 * Centralized SEO metadata for all pages.
 * Each entry maps to a route and provides title, description, and path.
 */
export const SEO = {
  home: {
    title: "Woodinville Sports Campus",
    description:
      "Woodinville Sports Club is a 67-acre campus for tennis, golf, pickleball, gym, APL training, camps, events, and family programs in Woodinville, WA.",
    path: "/",
  },
  tennis: {
    title: "Tennis Programs & Courts",
    description:
      "Book 8 indoor tennis courts, Tier 1 junior training, adult classes, private lessons, USTA teams, and CourtReserve access at Woodinville Sports Club.",
    path: "/tennis",
  },
  golf: {
    title: "Golf Range & Swing Lab Simulators",
    description:
      "Practice at 23 covered golf bays with Toptracer, 4 Swing Lab simulators, short-game space, mini-golf, lessons, and Tier 1 Golf Academy in Woodinville.",
    path: "/golf",
  },
  gym: {
    title: "Gym & Athletic Performance",
    description:
      "Train in WSC's gym with weights, functional space, sauna, locker rooms, APL strength classes, speed training, personal training, and all-access plans.",
    path: "/gym",
  },
  pickleball: {
    title: "Pickleball Courts & Open Play",
    description:
      "Play indoor pickleball at The Dome with open play, private court rentals, DUPR ladders, tournaments, beginner classes, and member booking options.",
    path: "/pickleball",
  },
  summer: {
    title: "Summer Training & Camps 2026",
    description:
      "Plan 2026 summer training at WSC with tennis, golf, Adventure Club, half-day and full-day bundles, weekly sessions, and programs for ages 3-18.",
    path: "/summer",
  },
  membership: {
    title: "Membership Plans & Pricing",
    description:
      "Compare WSC membership plans for families, couples, individuals, court booking, range access, class registration, gym use, and golf simulator benefits.",
    path: "/membership",
  },
  sessions: {
    title: "2026 Session Dates Calendar",
    description:
      "View WSC's 2026 programming session dates, registration windows, start dates, end dates, and summer schedules for tennis, golf, camps, and classes.",
    path: "/sessions",
  },
  events: {
    title: "Private Events & Venue Rentals",
    description:
      "Host private events at WSC in Woodinville Wine Country, including weddings, birthdays, corporate outings, family celebrations, sports parties and cabin rentals.",
    path: "/events",
  },
  foodTrucks: {
    title: "Food Trucks & Campus Dining",
    description:
      "Woodinville Sports Club hosts rotating local food trucks on campus. Grab dinner before golf, tennis, pickleball, fitness, or private events.",
    path: "/food-trucks",
  },
  careers: {
    title: "Careers at WSC Sports Campus",
    description:
      "Explore WSC careers in tennis, golf, fitness, operations, youth camps, events, front desk service, and athletic programming in Woodinville, WA.",
    path: "/careers",
  },
  blog: {
    title: "Blog & Resource Guides Hub",
    description:
      "Read Woodinville Sports Club resources for tennis, golf, fitness, summer camps, membership, court booking, and active families around the Eastside.",
    path: "/blog",
  },
  about: {
    title: "About WSC 67-Acre Campus",
    description:
      "Learn about WSC's 67-acre Woodinville campus, founded in 1979 and built for tennis, golf, pickleball, fitness, private events, camps, and community programs.",
    path: "/about",
  },
  contact: {
    title: "Contact, Hours & Directions",
    description:
      "Contact WSC at (425) 487-1090, find hours and directions, or visit 15327 140th Pl NE in Woodinville for tennis, golf, gym, and pickleball help.",
    path: "/contact",
  },
  proShop: {
    title: "Pro Shop Gear & Equipment",
    description:
      "Visit the WSC Pro Shop for tennis rackets, golf equipment, pickleball paddles, athletic apparel, accessories, expert staff, and stringing services.",
    path: "/pro-shop",
  },
  policies: {
    title: "Club Policies & Terms of Service",
    description:
      "Review WSC membership policies, facility rules, code of conduct, cancellation terms, guest policies, court booking guidelines, and member agreement details.",
    path: "/policies",
  },
  privacy: {
    title: "Privacy Policy & Data Use",
    description:
      "Woodinville Sports Club's privacy policy covering data collection, usage, cookies, and your rights. Learn how we protect your personal information.",
    path: "/privacy",
  },
  faq: {
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions about Woodinville Sports Club membership, pricing, court booking, facility hours, cancellation policies, and guest access.",
    path: "/faq",
  },
  accessibility: {
    title: "Accessibility Statement Info",
    description:
      "Learn about WSC's digital accessibility commitment, WCAG compliance efforts, inclusive website updates, and how to request help or accommodations.",
    path: "/accessibility",
  },
} as const;
