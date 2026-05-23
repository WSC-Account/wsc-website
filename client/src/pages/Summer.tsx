/*
 * 4B Design — Summer Training Page
 * Real schedules from WSC sub-pages, organized by program + age group
 * Blue accent: #3899EC via volt/volt-bright tokens
 */
import { useState, useRef, type KeyboardEvent } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Clock, Users, MapPin, Sun, Zap, Trophy, Calendar, ArrowRight, Globe } from "lucide-react";
import StructuredData, { getSummerCampSchema, getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/campus-dome.webp";
const TENNIS_IMG = "/images/wsc/summer-camp.webp";
const GOLF_IMG = "/images/wsc/golf-practice-area.webp";
const PERF_IMG = "/images/wsc/apl-training.webp";
const COURT_RESERVE_URL = "https://app.courtreserve.com/Online/Portal/Index/6689";

/* ─── Program Explorer Types ─── */
type ProgramKey = "tennis" | "golf" | "adventure";

const PROGRAMS: Record<ProgramKey, {
  name: string;
  ages: string;
  icon: typeof Trophy;
  desc: string;
  features: string[];
  image: string;
  levels: { name: string; ages: string }[];
  contact: string;
}> = {
  tennis: {
    name: "Tennis",
    ages: "Ages 3–18",
    icon: Trophy,
    desc: "Tier 1 Academy and Core (formerly RPM) tracks for ages 3–18. Tier 1 Academy requires coach approval (Core does not). Includes daily APL athletic development training.",
    features: [
      "8 indoor climate-controlled courts",
      "Former world-ranked, D1, and professional coaches",
      "Academy and recreational pathways",
      "Daily APL athletic development integrated",
    ],
    image: TENNIS_IMG,
    levels: [
      { name: "JumpStart", ages: "Ages 3–5" },
      { name: "Red Ball", ages: "Ages 5–8" },
      { name: "Orange Ball", ages: "Ages 9–10" },
      { name: "Green Ball", ages: "Ages 10–12" },
      { name: "Yellow Ball", ages: "Ages 12+" },
      { name: "Academy Pathway", ages: "Ages 7–18 (Coach Approval)" },
    ],
    contact: "Tier1@woodinvillesportsclub.com",
  },
  golf: {
    name: "Golf",
    ages: "Ages 7–18",
    icon: Sun,
    desc: "Tier 1 Golf Academy training for beginners to advanced golfers ages 7–18. Access to our driving range, practice greens, new indoor golf simulators, and putt-putt course. Includes daily APL athletic development training.",
    features: [
      "23-bay covered driving range with Toptracer",
      "NEW Swing Lab indoor golf simulators",
      "WGTF Master-certified Director of Golf, Daniel Jarvie",
      "Daily APL athletic development integrated",
    ],
    image: GOLF_IMG,
    levels: [
      { name: "Golf Club", ages: "Ages 7–14 (Beginner/Rec)" },
      { name: "Academy Foundations", ages: "Ages 7–9" },
      { name: "Jr. Academy Prep", ages: "Ages 10–12" },
      { name: "Junior Academy", ages: "Ages 13–15" },
      { name: "HS Academy", ages: "Ages 16–18" },
    ],
    contact: "Tier1Golf@woodinvillesportsclub.com",
  },
  adventure: {
    name: "Adventure Club",
    ages: "Ages 5–12",
    icon: Zap,
    desc: "Explores a different region of the world each week for 9 weeks, introducing professional tennis and golf legends while building athletic skills through games, activities, and team challenges. Two age groups: 5–8 and 9–12.",
    features: [
      "Multi-sport exploration across 67 acres",
      "A different world region each week for 9 weeks",
      "Learn about pro athletes from around the world",
      "Access to courts, range, and grass fields",
    ],
    image: PERF_IMG,
    levels: [
      { name: "Explorers", ages: "Ages 5–8" },
      { name: "Adventurers", ages: "Ages 9–12" },
    ],
    contact: "info@woodinvillesportsclub.com",
  },
};

const REGISTRATION_STEPS = [
  {
    title: "Choose your membership",
    text: "All summer training participants need a WSC membership. The minimum required option is a Class Registration Pass, while other tiers unlock gym access, court booking, range discounts, and beverage discounts.",
  },
  {
    title: "Purchase through CourtReserve",
    text: "Use CourtReserve to purchase the membership, create your account, and sign the required waiver during checkout.",
  },
  {
    title: "Pick your sessions",
    text: "Browse by Tennis, Golf, or Adventure Club, or use the class finder in CourtReserve to filter by class type, level, and half-day or full-day options.",
  },
  {
    title: "Finalize details",
    text: "Select the dates that work for your family, complete checkout, and enter your child's age and t-shirt size so the team can prepare for their first day.",
  },
];

/* ─── Schedule Data — Real times from WSC sub-pages ─── */
type ScheduleKey = string;

interface ScheduleBlock {
  time: string;
  activity: string;
  type: "sport" | "apl" | "break" | "fun";
}

interface ScheduleGroup {
  program: ProgramKey;
  label: string;
  subtitle: string;
  ageNote: string;
  schedule: ScheduleBlock[];
}

const SCHEDULES: Record<ScheduleKey, ScheduleGroup> = {
  // ── TENNIS ──
  "tennis-core-half-am": {
    program: "tennis",
    label: "Core Half-Day AM",
    subtitle: "JumpStart · Red · Orange · Green · ½-Day Yellow",
    ageNote: "Ages 3–12+",
    schedule: [
      { time: "9:00 AM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "10:00 AM", activity: "Tennis Training", type: "sport" },
      { time: "12:00 PM", activity: "Dismissal", type: "break" },
    ],
  },
  "tennis-core-half-bundle": {
    program: "tennis",
    label: "Core AM + PM Bundle",
    subtitle: "Morning Tennis + Afternoon Golf or Adventure Club",
    ageNote: "Ages 3–12+",
    schedule: [
      { time: "9:00 AM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "10:00 AM", activity: "Tennis Training", type: "sport" },
      { time: "12:00 PM", activity: "Lunch", type: "break" },
      { time: "1:00 PM", activity: "Golf or Adventure Club", type: "fun" },
      { time: "4:00 PM", activity: "Training Ends", type: "break" },
    ],
  },
  "tennis-yellow-full": {
    program: "tennis",
    label: "Core Yellow Full Day",
    subtitle: "Full-day tennis for ages 12+",
    ageNote: "Ages 12+",
    schedule: [
      { time: "9:00 AM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "10:00 AM", activity: "Tennis Training", type: "sport" },
      { time: "12:00 PM", activity: "Lunch", type: "break" },
      { time: "1:00 PM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "2:00 PM", activity: "Tennis Training", type: "sport" },
      { time: "4:00 PM", activity: "Training Ends", type: "break" },
    ],
  },
  "tennis-academy-half": {
    program: "tennis",
    label: "Academy Half-Day",
    subtitle: "Tier 1 Academy AM + PM Bundle option",
    ageNote: "Ages 7–18 (Coach Approval)",
    schedule: [
      { time: "9:00 AM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "10:00 AM", activity: "Academy Tennis Training", type: "sport" },
      { time: "12:00 PM", activity: "Lunch", type: "break" },
      { time: "1:00 PM", activity: "Golf or Adventure Club (Bundle)", type: "fun" },
      { time: "4:00 PM", activity: "Training Ends", type: "break" },
    ],
  },

  // ── GOLF ──
  "golf-club-half-am": {
    program: "golf",
    label: "Golf Club Half-Day AM",
    subtitle: "AM Golf + PM Bundle (Adventure Club or Tennis)",
    ageNote: "Ages 7–14",
    schedule: [
      { time: "9:00 AM", activity: "Golf Skills Training", type: "sport" },
      { time: "11:00 AM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "12:00 PM", activity: "Lunch", type: "break" },
      { time: "1:00 PM", activity: "Adventure Club or Core Tennis", type: "fun" },
      { time: "4:00 PM", activity: "Training Ends", type: "break" },
    ],
  },
  "golf-club-half-pm": {
    program: "golf",
    label: "Golf Club Half-Day PM",
    subtitle: "AM Bundle (Adventure Club or Tennis) + PM Golf",
    ageNote: "Ages 7–14",
    schedule: [
      { time: "9:00 AM", activity: "Adventure Club or Core Tennis", type: "fun" },
      { time: "12:00 PM", activity: "Lunch", type: "break" },
      { time: "1:00 PM", activity: "Golf Skills Training", type: "sport" },
      { time: "3:00 PM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "4:00 PM", activity: "Training Ends", type: "break" },
    ],
  },
  "golf-club-full": {
    program: "golf",
    label: "Golf Club Full Day",
    subtitle: "Full-day golf for beginners and recreational golfers",
    ageNote: "Ages 7–14",
    schedule: [
      { time: "9:00 AM", activity: "Golf Skills Training", type: "sport" },
      { time: "11:00 AM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "12:00 PM", activity: "Lunch", type: "break" },
      { time: "1:00 PM", activity: "Golf Skills Training", type: "sport" },
      { time: "3:00 PM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "4:00 PM", activity: "Training Ends", type: "break" },
    ],
  },
  "golf-academy-half": {
    program: "golf",
    label: "Academy Half-Day AM",
    subtitle: "AM Golf Academy + PM Adventure Club or Tennis",
    ageNote: "Ages 7–18 (Foundations → HS Academy)",
    schedule: [
      { time: "9:00 AM", activity: "Academy Golf Skills", type: "sport" },
      { time: "11:00 AM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "12:00 PM", activity: "Lunch", type: "break" },
      { time: "1:00 PM", activity: "Adventure Club or Core Tennis*", type: "fun" },
      { time: "4:00 PM", activity: "Training Ends", type: "break" },
    ],
  },
  "golf-academy-full": {
    program: "golf",
    label: "Academy Full Day",
    subtitle: "Full-day competitive golf training",
    ageNote: "Ages 7–18 (Foundations → HS Academy)",
    schedule: [
      { time: "9:00 AM", activity: "Academy Golf Skills", type: "sport" },
      { time: "11:00 AM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "12:00 PM", activity: "Lunch", type: "break" },
      { time: "1:00 PM", activity: "Academy Golf Skills", type: "sport" },
      { time: "3:00 PM", activity: "Athletic Development (APL)", type: "apl" },
      { time: "4:00 PM", activity: "Training Ends", type: "break" },
    ],
  },

  // ── ADVENTURE CLUB ──
  "adventure-half-am": {
    program: "adventure",
    label: "Adventure Club AM",
    subtitle: "AM Adventure + PM Bundle (Golf or Tennis)",
    ageNote: "Ages 5–12 (groups: 5–8 & 9–12)",
    schedule: [
      { time: "9:00 AM", activity: "Adventure Club", type: "fun" },
      { time: "12:00 PM", activity: "Lunch", type: "break" },
      { time: "1:00 PM", activity: "Bundle: Golf or Tennis", type: "sport" },
      { time: "4:00 PM", activity: "Club Ends", type: "break" },
    ],
  },
  "adventure-half-pm": {
    program: "adventure",
    label: "Adventure Club PM",
    subtitle: "AM Bundle (Golf or Tennis) + PM Adventure",
    ageNote: "Ages 5–12 (groups: 5–8 & 9–12)",
    schedule: [
      { time: "9:00 AM", activity: "Bundle: Golf or Tennis", type: "sport" },
      { time: "12:00 PM", activity: "Lunch", type: "break" },
      { time: "1:00 PM", activity: "Adventure Club", type: "fun" },
      { time: "4:00 PM", activity: "Club Ends", type: "break" },
    ],
  },
  "adventure-full": {
    program: "adventure",
    label: "Adventure Club Full Day",
    subtitle: "Full-day multi-sport exploration",
    ageNote: "Ages 5–12 (groups: 5–8 & 9–12)",
    schedule: [
      { time: "9:00 AM", activity: "Adventure Club", type: "fun" },
      { time: "12:00 PM", activity: "Lunch", type: "break" },
      { time: "1:00 PM", activity: "Adventure Club", type: "fun" },
      { time: "4:00 PM", activity: "Club Ends", type: "break" },
    ],
  },
};

/* ─── Adventure Club 9-Week World Tour ─── */
interface WeekTheme {
  week: number;
  dates: string;
  region: string;
  flag: string;
  tennisLegend: string;
  golfLegend: string;
  activities: string[];
  color: string;
}

const ADVENTURE_WEEKS: WeekTheme[] = [
  {
    week: 1,
    dates: "Jun 29 – Jul 3",
    region: "Australia & Oceania",
    flag: "\ud83c\udde6\ud83c\uddfa",
    tennisLegend: "Rod Laver",
    golfLegend: "Greg Norman",
    activities: ["Boomerang relay", "Cricket fundamentals", "Outback obstacle course", "Aboriginal art"],
    color: "bg-amber-500",
  },
  {
    week: 2,
    dates: "Jul 6 – Jul 10",
    region: "Japan & East Asia",
    flag: "\ud83c\uddef\ud83c\uddf5",
    tennisLegend: "Naomi Osaka",
    golfLegend: "Hideki Matsuyama",
    activities: ["Martial arts basics", "Sumo balance games", "Origami & calligraphy", "Ninja agility course"],
    color: "bg-red-500",
  },
  {
    week: 3,
    dates: "Jul 13 – Jul 17",
    region: "United Kingdom & Ireland",
    flag: "\ud83c\uddec\ud83c\udde7",
    tennisLegend: "Andy Murray",
    golfLegend: "Rory McIlroy",
    activities: ["Football (soccer) skills", "Rugby tag games", "Castle siege relay", "Highland games"],
    color: "bg-blue-500",
  },
  {
    week: 4,
    dates: "Jul 20 – Jul 24",
    region: "Spain & Mediterranean",
    flag: "\ud83c\uddea\ud83c\uddf8",
    tennisLegend: "Rafael Nadal",
    golfLegend: "Jon Rahm",
    activities: ["Futsal tournament", "Flamenco rhythm games", "Paella team cook-off", "Bull run relay"],
    color: "bg-orange-500",
  },
  {
    week: 5,
    dates: "Jul 27 – Jul 31",
    region: "Brazil & South America",
    flag: "\ud83c\udde7\ud83c\uddf7",
    tennisLegend: "Gustavo Kuerten",
    golfLegend: "Angel Cabrera",
    activities: ["Capoeira movement", "Samba relay races", "Rainforest expedition", "Beach volleyball"],
    color: "bg-green-500",
  },
  {
    week: 6,
    dates: "Aug 3 – Aug 7",
    region: "France & Western Europe",
    flag: "\ud83c\uddeb\ud83c\uddf7",
    tennisLegend: "Jo-Wilfried Tsonga",
    golfLegend: "Victor Perez",
    activities: ["Pétanque (bocce) tournament", "Tour de France relay", "Fencing basics", "Crêpe team challenge"],
    color: "bg-indigo-500",
  },
  {
    week: 7,
    dates: "Aug 10 – Aug 14",
    region: "Kenya & East Africa",
    flag: "\ud83c\uddf0\ud83c\uddea",
    tennisLegend: "Angela Okutoyi",
    golfLegend: "Diksha Dagar",
    activities: ["Distance running games", "Safari scavenger hunt", "Drum circle rhythms", "Maasai jumping contest"],
    color: "bg-yellow-600",
  },
  {
    week: 8,
    dates: "Aug 17 – Aug 21",
    region: "India & South Asia",
    flag: "\ud83c\uddee\ud83c\uddf3",
    tennisLegend: "Sania Mirza",
    golfLegend: "Anirban Lahiri",
    activities: ["Cricket match day", "Kabaddi tag games", "Bollywood dance relay", "Holi color run"],
    color: "bg-teal-500",
  },
  {
    week: 9,
    dates: "Aug 24 – Aug 28",
    region: "USA — Pacific Northwest",
    flag: "\ud83c\uddfa\ud83c\uddf8",
    tennisLegend: "Serena Williams",
    golfLegend: "Fred Couples",
    activities: ["All-star tournament day", "PNW nature hike", "Summer awards ceremony", "Final celebration"],
    color: "bg-volt-bright",
  },
];

/* ─── Group schedules by program ─── */
const SCHEDULE_KEYS_BY_PROGRAM: Record<ProgramKey, ScheduleKey[]> = {
  tennis: ["tennis-core-half-am", "tennis-core-half-bundle", "tennis-yellow-full", "tennis-academy-half"],
  golf: ["golf-club-half-am", "golf-club-half-pm", "golf-club-full", "golf-academy-half", "golf-academy-full"],
  adventure: ["adventure-half-am", "adventure-half-pm", "adventure-full"],
};

/* ─── Style maps ─── */
const typeColors: Record<string, string> = {
  sport: "bg-volt-bright/20 text-volt-bright border-volt-bright/30",
  apl: "bg-parchment/10 text-parchment/80 border-parchment/20",
  break: "bg-parchment/10 text-parchment/75 border-parchment/15",
  fun: "bg-volt/20 text-volt-bright border-volt/30",
};

const typeLabels: Record<string, string> = {
  sport: "SPORT",
  apl: "APL",
  break: "BREAK / MEAL",
  fun: "BUNDLE / ADV.",
};

/* ─── Component ─── */
export default function Summer() {
  const [activeProgram, setActiveProgram] = useState<ProgramKey>("tennis");
  const [activeSchedule, setActiveSchedule] = useState<ScheduleKey>("tennis-core-half-am");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const program = PROGRAMS[activeProgram];
  const scheduleKeys = SCHEDULE_KEYS_BY_PROGRAM[activeProgram];
  const schedule = SCHEDULES[activeSchedule];

  function switchProgram(key: ProgramKey) {
    setActiveProgram(key);
    setActiveSchedule(SCHEDULE_KEYS_BY_PROGRAM[key][0]);
  }

  function moveTabFocus<T extends string>(
    event: KeyboardEvent<HTMLDivElement>,
    keys: T[],
    activeKey: T,
    activate: (key: T) => void,
    tabId: (key: T) => string,
  ) {
    const currentIndex = keys.indexOf(activeKey);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % keys.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + keys.length) % keys.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = keys.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextKey = keys[nextIndex];
    activate(nextKey);
    requestAnimationFrame(() => document.getElementById(tabId(nextKey))?.focus());
  }

  function toggleAdventureWeek(week: number) {
    setExpandedWeek((current) => (current === week ? null : week));
  }

  function handleAdventureWeekKeyDown(event: KeyboardEvent<HTMLDivElement>, week: number) {
    const target = event.target as HTMLElement;
    if (target.closest("a, button, input, select, textarea")) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleAdventureWeek(week);
    }
  }

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.summer} />
      <StructuredData schemas={[
        getSummerCampSchema(),
        getBreadcrumbSchema([
          { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
          { name: "Summer Training", url: "https://www.woodinvillesportsclub.com/summer" },
        ]),
      ]} />

      {/* Hero — Full bleed with overlay */}
      <section className="relative overflow-hidden pt-[var(--site-header-height,130px)]">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Summer camp activities at Woodinville Sports Club"
            width={1800}
            height={1202}
            loading="eager"
            className="w-full h-full object-cover brightness-[0.44] saturate-[0.78]"
            style={{ objectPosition: "center 8%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(22,19,16,0.75)] via-[rgba(22,19,16,0.45)] to-transparent" />
        </div>
        <div className="hero-safe-content relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-14 pb-16 lg:pb-20 pt-10 min-h-[85vh] flex flex-col justify-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="hero-eyebrow text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">
              Summer Training @ WSC
            </p>
            <h1 className="hero-title text-parchment text-[clamp(36px,5.5vw,72px)] font-light tracking-[-0.03em] leading-[1.05] mb-5">
              Join Us for an<br />Epic Summer.
            </h1>
            <p className="hero-subtitle text-parchment/70 text-[17px] leading-[1.7] max-w-[520px] mb-8">
              Train where high-performance athletes train. Ages 3–18 on our 67-acre campus, June 29 – August 30.
            </p>
            <div className="hero-actions flex flex-wrap gap-4">
              <Link
                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
              >
                Register Now <ChevronRight size={14} />
              </Link>
              <a
                href="#sample-days"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-parchment/20 px-8 py-3.5 hover:border-volt-bright transition-colors duration-200"
              >
                See Sample Days <Calendar size={14} />
              </a>
            </div>
          </motion.div>

          {/* Quick Stats Strip */}
          <motion.div
            className="hero-stats mt-12 grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-parchment/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { label: "Programs", value: "3", detail: "Tennis · Golf · Adventure" },
              { label: "Ages", value: "3–18", detail: "All skill levels" },
              { label: "Duration", value: "9 Weeks", detail: "June 29 – Aug 30" },
              { label: "Campus", value: "67 Acres", detail: "Woodinville, WA" },
            ].map((s, i) => (
              <div key={i} className="bg-dark-bg/80 backdrop-blur-sm px-5 py-4">
                <p className="text-volt-bright text-[22px] font-light tracking-[-0.01em]">{s.value}</p>
                <p className="text-parchment/75 text-[11px] tracking-[0.12em] uppercase mt-0.5">{s.label}</p>
                <p className="text-parchment/70 text-[11px] mt-1">{s.detail}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Registration Banner */}
      <section className="bg-volt-bright px-6 lg:px-14 py-5">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-dark-bg text-[12px] tracking-[0.14em] uppercase font-medium">
              Summer Registration Open
            </span>
            <span className="text-dark-bg/60 text-[13px]">
              Tennis, Golf, and Adventure Club programs run June 29 - August 30, 2026
            </span>
          </div>
          <Link
            href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
            className="text-dark-bg text-[11px] tracking-[0.14em] uppercase no-underline border border-dark-bg/30 px-5 py-2 hover:bg-dark-bg hover:text-volt-bright transition-colors duration-200"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* Interactive Program Explorer */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Programs</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Three tracks. One campus.
          </h2>
          <p className="text-ink-mid text-[15px] leading-[1.75] max-w-[560px] mb-12">
            Choose your path — or bundle them together for a multi-sport summer experience.
          </p>

          {/* Program Tabs */}
          <div
            className="flex gap-[3px] mb-10"
            role="tablist"
            aria-label="Summer training programs"
            onKeyDown={(event) => moveTabFocus(
              event,
              Object.keys(PROGRAMS) as ProgramKey[],
              activeProgram,
              switchProgram,
              (key) => `summer-program-tab-${key}`,
            )}
          >
            {(Object.keys(PROGRAMS) as ProgramKey[]).map((key) => {
              const p = PROGRAMS[key];
              const isActive = activeProgram === key;
              return (
                <button
                  type="button"
                  key={key}
                  id={`summer-program-tab-${key}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="summer-program-panel"
                  onClick={() => switchProgram(key)}
                  className={`flex-1 py-4 px-5 text-left transition-all duration-300 ${
                    isActive ? "bg-dark-bg" : "bg-parchment-mid hover:bg-parchment-dark"
                  }`}
                >
                  <p className={`text-[12px] tracking-[0.14em] uppercase mb-1 ${
                    isActive ? "text-volt-bright" : "text-ink-light"
                  }`}>
                    {p.ages}
                  </p>
                  <p className={`text-[18px] font-light tracking-[-0.01em] ${
                    isActive ? "text-parchment" : "text-ink"
                  }`}>
                    {p.name}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Program Detail */}
          <div
            id="summer-program-panel"
            role="tabpanel"
            aria-labelledby={`summer-program-tab-${activeProgram}`}
            aria-live="polite"
            aria-atomic="true"
          >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProgram}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-[3px]"
            >
              <div className="bg-dark-bg p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <program.icon size={18} className="text-volt-bright" />
                    <span className="text-volt-bright text-[11px] tracking-[0.18em] uppercase">
                      {program.name} — {program.ages}
                    </span>
                  </div>
                  <p className="text-parchment/70 text-[15px] leading-[1.8] mb-8">
                    {program.desc}
                  </p>

                  {/* Age Group Levels */}
                  <p className="text-parchment/70 text-[10px] tracking-[0.16em] uppercase mb-3">Levels & Age Groups</p>
                  <div className="grid grid-cols-2 gap-[2px] mb-8">
                    {program.levels.map((lvl, i) => (
                      <div key={i} className="bg-dark-mid px-4 py-3">
                        <p className="text-parchment text-[13px] font-light">{lvl.name}</p>
                        <p className="text-parchment/70 text-[11px] mt-0.5">{lvl.ages}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {program.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-volt-bright text-[8px] mt-2">●</span>
                        <p className="text-parchment/75 text-[14px] leading-[1.65]">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-10">
                  <Link
                    href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
                  >
                    Register for {program.name} <ChevronRight size={14} />
                  </Link>
                  <a
                    href={`mailto:${program.contact}`}
                    className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase no-underline text-parchment/70 border border-parchment/15 px-6 py-3.5 hover:border-volt-bright hover:text-parchment transition-colors duration-200"
                  >
                    Questions? Email Us
                  </a>
                </div>
              </div>
              <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img
                  src={program.image}
                  alt={`${program.name} summer program at Woodinville Sports Club`}
                  width={1800}
                  height={1200}
                  loading="lazy"
                  className="w-full h-full object-cover brightness-[0.8] saturate-[0.85]"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-bg/80 to-transparent p-6">
                  <p className="text-parchment/70 text-[12px] tracking-[0.1em] uppercase">
                    <MapPin size={12} className="inline mr-1.5 -mt-0.5" />
                    67-acre campus · Woodinville, WA
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══ Interactive Sample Day Schedules ═══ */}
      <section id="sample-days" className="bg-dark-bg px-6 lg:px-14 py-24 lg:py-28 scroll-mt-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12 lg:gap-16">
            {/* Left: Program + Schedule Selector */}
            <div>
              <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Sample Day Schedules</p>
              <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.1] mb-4">
                What does a<br />day look like?
              </h2>
              <p className="text-parchment/75 text-[14px] leading-[1.75] mb-8">
                Select a program and schedule option to see the real daily structure. Every option includes APL athletic development.
              </p>

              {/* Program Filter Tabs */}
              <div
                className="flex gap-[2px] mb-4"
                role="tablist"
                aria-label="Sample day program filter"
                onKeyDown={(event) => moveTabFocus(
                  event,
                  Object.keys(PROGRAMS) as ProgramKey[],
                  activeProgram,
                  switchProgram,
                  (key) => `sample-program-tab-${key}`,
                )}
              >
                {(Object.keys(PROGRAMS) as ProgramKey[]).map((key) => {
                  const isActive = activeProgram === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      id={`sample-program-tab-${key}`}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="sample-schedule-panel"
                      onClick={() => switchProgram(key)}
                      className={`flex-1 py-2.5 text-[11px] tracking-[0.12em] uppercase transition-all duration-300 ${
                        isActive
                          ? "bg-volt-bright text-dark-bg"
                          : "bg-dark-mid text-parchment/75 hover:text-parchment/80"
                      }`}
                    >
                      {PROGRAMS[key].name}
                    </button>
                  );
                })}
              </div>

              {/* Schedule Options for Selected Program */}
              <div className="space-y-[2px]" role="group" aria-label="Schedule options">
                {scheduleKeys.map((key) => {
                  const s = SCHEDULES[key];
                  const isActive = activeSchedule === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      aria-pressed={isActive}
                      aria-label={`Show ${s.label} schedule`}
                      onClick={() => setActiveSchedule(key)}
                      className={`w-full text-left px-5 py-4 transition-all duration-300 flex items-center justify-between ${
                        isActive
                          ? "bg-dark-mid border-l-2 border-volt-bright"
                          : "bg-dark-bg hover:bg-dark-mid border-l-2 border-transparent"
                      }`}
                    >
                      <div>
                        <p className={`text-[14px] font-light ${
                          isActive ? "text-parchment" : "text-parchment/70"
                        }`}>
                          {s.label}
                        </p>
                        <p className={`text-[11px] mt-0.5 ${
                          isActive ? "text-volt-bright/70" : "text-parchment/70"
                        }`}>
                          {s.ageNote}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`transition-all duration-300 ${
                          isActive ? "text-volt-bright translate-x-0" : "text-parchment/70 -translate-x-1"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-8 flex gap-3 flex-wrap">
                {Object.entries(typeLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      key === "sport" ? "bg-volt-bright/60" :
                      key === "apl" ? "bg-parchment/40" :
                      key === "fun" ? "bg-volt/40" :
                      "bg-parchment/15"
                    }`} />
                    <span className="text-parchment/70 text-[10px] tracking-[0.1em] uppercase">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Timeline */}
            <div
              id="sample-schedule-panel"
              role="tabpanel"
              aria-labelledby={`sample-program-tab-${activeProgram}`}
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSchedule}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-[2px]"
                >
                  {/* Day Header */}
                  <div className="bg-dark-mid px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-parchment text-[20px] font-light tracking-[-0.01em]">
                          {schedule.label}
                        </h3>
                        <p className="text-parchment/70 text-[13px] mt-1">{schedule.subtitle}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-volt-bright text-[12px] tracking-[0.1em] uppercase">{PROGRAMS[schedule.program].name}</p>
                        <p className="text-parchment/70 text-[11px] mt-0.5">{schedule.ageNote}</p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Timeline */}
                  <div className="relative">
                    {schedule.schedule.map((block, i) => {
                      const isLast = i === schedule.schedule.length - 1;
                      return (
                        <motion.div
                          key={`${activeSchedule}-${i}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.06 }}
                          className="relative flex"
                        >
                          {/* Time Column */}
                          <div className="w-[100px] shrink-0 flex flex-col items-center py-4">
                            <span className="text-parchment/75 text-[13px] font-light tabular-nums">
                              {block.time}
                            </span>
                            {!isLast && (
                              <div className={`flex-1 w-[1px] mt-2 ${
                                block.type === "sport" ? "bg-volt-bright/30" :
                                block.type === "apl" ? "bg-parchment/15" :
                                block.type === "fun" ? "bg-volt/25" :
                                "bg-parchment/8"
                              }`} />
                            )}
                          </div>

                          {/* Activity Block */}
                          <div className={`flex-1 border-l-2 ${typeColors[block.type]} px-6 py-4 bg-dark-mid/50 hover:bg-dark-mid transition-colors duration-200`}>
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-parchment text-[15px] font-light leading-[1.5]">
                                  {block.activity}
                                </p>
                              </div>
                              <span className={`text-[9px] tracking-[0.14em] uppercase px-2.5 py-1 border ${typeColors[block.type]} shrink-0`}>
                                {typeLabels[block.type]}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Day Footer */}
                  <div className="bg-dark-mid/30 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-parchment/70 text-[12px]">
                        <Users size={12} className="inline mr-1.5 -mt-0.5" />
                        All times from WSC summer program pages. Actual times may vary slightly.
                      </p>
                      {schedule.program === "golf" && activeSchedule === "golf-academy-half" && (
                        <p className="text-parchment/70 text-[11px] mt-1">
                          * PM bundle: Tier 1 Core Orange or Green tennis
                        </p>
                      )}
                    </div>
                    <Link
                      href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-6 py-2.5 hover:bg-parchment transition-colors duration-200 shrink-0"
                    >
                      Register <ChevronRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Coaching */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Elite Coaching & Facilities</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
              The same coaches.<br />Year-round excellence.
            </h2>
          </div>
          <div>
            <p className="text-ink-mid text-[16px] leading-[1.82] mb-6">
              The same elite coaching staff that trains our athletes year-round. Plus, state-of-the-art facilities, including professional-grade courts, new indoor golf simulators, and Athletic Performance Lab.
            </p>
            <ul className="space-y-3">
              {[
                "Former world-ranked, D1, and professional tennis coaches",
                "NEW Tier 1 Golf Academy, led by WGTF Master-certified Director of Golf, Daniel Jarvie",
                "Athletic Performance Lab training led by NASM-Certified Director of Performance, Coach Dom — who has trained pro, Olympic, and D1 athletes",
              ].map((item, i) => (
                <li key={i} className="text-ink-mid text-[14px] leading-[1.72] flex items-start gap-2.5">
                  <span className="text-volt text-[10px] mt-1.5">—</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Flexible Options */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Flexible Options</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-12">
            Build the summer that fits your athlete.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
            {[
              {
                icon: Clock,
                title: "Half-Day Sessions",
                desc: "Morning (9am–12pm) or afternoon (1pm–4pm). Perfect for younger athletes or those who want to focus on a single sport.",
              },
              {
                icon: Zap,
                title: "Full-Day Bundles",
                desc: "Pair a half-day of Tennis or Golf with Adventure Club, or split between Tennis and Golf. Discounted bundle pricing available.",
              },
              {
                icon: Calendar,
                title: "Single-Day Drop-Ins",
                desc: "Registration opens 4 weeks prior to each camp date. Try a day before committing to a full week.",
              },
            ].map((opt, i) => (
              <div key={i} className="bg-parchment p-8 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <opt.icon size={20} className="text-volt mb-4" />
                <h3 className="text-[18px] font-light tracking-[-0.01em] mb-3">{opt.title}</h3>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{opt.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-ink-light text-[13px] mt-8">
            For bundles, email{" "}
            <a href="mailto:info@woodinvillesportsclub.com" className="text-volt underline underline-offset-2">
              info@woodinvillesportsclub.com
            </a>{" "}
            (include your t-shirt size and the classes you wish to bundle) and we can get you registered.
          </p>
        </div>
      </section>

      {/* Registration Instructions */}
      <section id="registration-instructions" className="bg-parchment px-6 lg:px-14 py-24 lg:py-28 scroll-mt-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.5fr] gap-12 lg:gap-20 items-start">
            <div>
              <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Registration Instructions</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-5">
                Start with your membership, then choose sessions.
              </h2>
              <p className="text-ink-mid text-[15px] leading-[1.78] mb-5">
                Every summer training participant needs an active WSC membership before registration. The Class Registration Pass is the minimum required option, and higher membership tiers can add gym access, court booking, and range benefits.
              </p>
              <p className="text-ink-light text-[13px] leading-[1.7] mb-8">
                Current WSC members can skip straight to session selection. New families should create their CourtReserve account, complete the waiver, and then select the weeks that fit their athlete.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={COURT_RESERVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-7 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
                >
                  Open CourtReserve <ChevronRight size={14} />
                </Link>
                <Link
                  href="/membership"
                  className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline text-ink border border-wsc-border px-7 py-3.5 hover:border-volt transition-colors duration-200"
                >
                  View Memberships
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[3px]">
              {REGISTRATION_STEPS.map((step, i) => (
                <div key={step.title} className="bg-parchment-mid p-7 lg:p-8">
                  <div className="w-9 h-9 bg-dark-bg text-volt-bright text-[13px] font-light flex items-center justify-center mb-5">
                    {i + 1}
                  </div>
                  <h3 className="text-ink text-[19px] font-light tracking-[-0.01em] mb-3">{step.title}</h3>
                  <p className="text-ink-mid text-[14px] leading-[1.72]">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px] mt-12">
            <div className="bg-dark-bg p-7 lg:p-8">
              <p className="text-volt-bright text-[11px] tracking-[0.18em] uppercase mb-4">New to WSC</p>
              <p className="text-parchment/80 text-[14px] leading-[1.72]">
                Choose a membership, complete checkout in CourtReserve, sign the waiver, and then register for Tennis, Golf, Adventure Club, or a bundled full-day schedule.
              </p>
            </div>
            <div className="bg-dark-bg p-7 lg:p-8">
              <p className="text-volt-bright text-[11px] tracking-[0.18em] uppercase mb-4">Already a Member</p>
              <p className="text-parchment/80 text-[14px] leading-[1.72]">
                Your membership is already set. Go straight to session selection in CourtReserve and pick the weeks, class level, and half-day or full-day format.
              </p>
            </div>
            <div className="bg-dark-bg p-7 lg:p-8">
              <p className="text-volt-bright text-[11px] tracking-[0.18em] uppercase mb-4">Bundles & Academy</p>
              <p className="text-parchment/80 text-[14px] leading-[1.72]">
                For AM/PM bundles, email{" "}
                <a href="mailto:info@woodinvillesportsclub.com" className="text-volt-bright underline underline-offset-2">
                  info@woodinvillesportsclub.com
                </a>
                . Tier 1 Tennis Academy requires coach approval; Core Tennis does not.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 9-Week Adventure Club World Tour Calendar ═══ */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
            {/* Left: Intro */}
            <div className="lg:sticky lg:top-28">
              <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Adventure Club</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
                9 weeks.<br />9 regions.<br />One world tour.
              </h2>
              <p className="text-ink-mid text-[15px] leading-[1.75] mb-6">
                Every week, Adventure Club kids (ages 5–12) explore a different region of the world — learning about tennis and golf legends, playing region-inspired games, and building athletic skills through team challenges.
              </p>
              <p className="text-ink-light text-[13px] leading-[1.7] mb-8">
                Click any week to see the featured legends and activities. Two age groups: Explorers (5–8) and Adventurers (9–12).
              </p>
              <div className="flex items-center gap-3 text-ink-light text-[12px]">
                <Globe size={16} className="text-volt" />
                <span>June 29 – August 30, 2026</span>
              </div>
            </div>

            {/* Right: Calendar Grid */}
            <div ref={calendarRef} className="space-y-[3px]">
              {ADVENTURE_WEEKS.map((w) => {
                const isExpanded = expandedWeek === w.week;
                return (
                  <motion.div
                    key={w.week}
                    layout
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-controls={isExpanded ? `adventure-week-${w.week}-details` : undefined}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} week ${w.week}: ${w.region}`}
                    className="bg-parchment-mid overflow-hidden cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
                    onClick={() => toggleAdventureWeek(w.week)}
                    onKeyDown={(event) => handleAdventureWeekKeyDown(event, w.week)}
                  >
                    {/* Week Header Row */}
                    <div className="flex items-center gap-4 px-6 py-5 hover:bg-parchment-dark transition-colors duration-200">
                      {/* Week Number */}
                      <div className={`w-10 h-10 flex items-center justify-center text-[13px] font-light shrink-0 ${
                        isExpanded ? "bg-volt-bright text-dark-bg" : "bg-parchment text-ink-light"
                      } transition-colors duration-300`}>
                        {w.week}
                      </div>

                      {/* Flag + Region */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[20px]">{w.flag}</span>
                          <div>
                            <p className={`text-[16px] font-light tracking-[-0.01em] ${
                              isExpanded ? "text-ink" : "text-ink"
                            }`}>
                              {w.region}
                            </p>
                            <p className="text-ink-light text-[12px] mt-0.5">{w.dates}</p>
                          </div>
                        </div>
                      </div>

                      {/* Legends Preview (collapsed) */}
                      <div className="hidden md:flex items-center gap-4 text-[12px] text-ink-light shrink-0">
                        <span className="flex items-center gap-1.5">
                          <Trophy size={11} className="text-volt" />
                          {w.tennisLegend}
                        </span>
                        <span className="text-wsc-border">|</span>
                        <span className="flex items-center gap-1.5">
                          <Sun size={11} className="text-volt" />
                          {w.golfLegend}
                        </span>
                      </div>

                      {/* Expand Arrow */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                        <ArrowRight size={16} className={`${
                          isExpanded ? "text-volt-bright" : "text-ink-light group-hover:text-ink"
                        } transition-colors duration-200`} />
                      </motion.div>
                    </div>

                    {/* Expanded Detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          id={`adventure-week-${w.week}-details`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
                              {/* Tennis Legend */}
                              <div className="bg-parchment p-5">
                                <p className="text-volt text-[10px] tracking-[0.16em] uppercase mb-2">Tennis Legend</p>
                                <p className="text-ink text-[18px] font-light tracking-[-0.01em] mb-1">{w.tennisLegend}</p>
                                <p className="text-ink-light text-[12px]">Featured athlete of the week</p>
                              </div>

                              {/* Golf Legend */}
                              <div className="bg-parchment p-5">
                                <p className="text-volt text-[10px] tracking-[0.16em] uppercase mb-2">Golf Legend</p>
                                <p className="text-ink text-[18px] font-light tracking-[-0.01em] mb-1">{w.golfLegend}</p>
                                <p className="text-ink-light text-[12px]">Featured athlete of the week</p>
                              </div>

                              {/* Activities */}
                              <div className="bg-parchment p-5">
                                <p className="text-volt text-[10px] tracking-[0.16em] uppercase mb-2">Sample Activities</p>
                                <ul className="space-y-1.5">
                                  {w.activities.map((a, i) => (
                                    <li key={i} className="text-ink-mid text-[13px] flex items-start gap-2">
                                      <span className="text-volt text-[8px] mt-1.5">●</span>
                                      {a}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Register CTA for this week */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-wsc-border">
                              <p className="text-ink-light text-[12px]">
                                Week {w.week} · {w.dates} · Ages 5–12
                              </p>
                              <Link
                                href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase no-underline text-volt hover:text-ink transition-colors duration-200"
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                              >
                                Register for Week {w.week} <ChevronRight size={12} />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Full Summer CTA */}
              <div className="bg-dark-bg px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-[3px]">
                <div>
                  <p className="text-parchment text-[15px] font-light">Register for the full 9-week world tour</p>
                  <p className="text-parchment/75 text-[12px] mt-1">Full-day, half-day, and bundle options are available through CourtReserve</p>
                </div>
                <Link
                  href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200 shrink-0"
                >
                  Register Now <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APL Athletic Development */}
      <section className="bg-dark-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-6">APL Athletic Development</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light leading-[1.1] tracking-[-0.02em] mb-6">
              Building complete<br />athletes.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.8] mb-6">
              Athletic development focuses on helping athletes move better, get stronger, faster, and more coordinated so they can perform with confidence and stay healthy. Our goal is to build well-rounded athletes who can train, compete, and succeed across any sport.
            </p>
            <p className="text-parchment/80 text-[15px] leading-[1.8]">
              Athletes work on key areas such as basic movement skills, strength, speed, balance, and coordination through age-appropriate training. Sessions emphasize proper technique and body control to reduce injury risk while supporting long-term physical development.
            </p>
            <Link
              href="/gym"
              className="inline-flex items-center gap-2 text-parchment text-[12px] tracking-[0.12em] uppercase no-underline border-b border-volt-bright pb-[3px] mt-8 hover:text-volt-bright transition-colors duration-200"
            >
              Learn more about APL <ChevronRight size={12} />
            </Link>
          </div>
          <div className="relative">
            <img
              src={PERF_IMG}
              alt="Athletic Performance Lab training for summer athletes at WSC"
              width={1185}
              height={1800}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover brightness-[0.7] saturate-[0.8]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-[2px]">
              {[
                { label: "Movement", value: "Skills" },
                { label: "Strength", value: "& Speed" },
                { label: "Injury", value: "Prevention" },
              ].map((s, i) => (
                <div key={i} className="bg-dark-bg/70 backdrop-blur-sm px-3 py-3 text-center">
                  <p className="text-volt-bright text-[13px] font-light">{s.value}</p>
                  <p className="text-parchment/70 text-[9px] tracking-[0.12em] uppercase mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Registration is Open</p>
          <h2 className="text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            Build your summer schedule.
          </h2>
          <p className="text-ink-mid text-[15px] leading-[1.75] max-w-[480px] mx-auto mb-3">
            Summer registration is open for Tennis, Golf, and Adventure Club programs. Bundles can pair a half-day of Adventure Club with Golf Club or Core Tennis for a full-day multi-sport experience.
          </p>
          <p className="text-ink-light text-[12px] mb-8">For bundle help, email info@woodinvillesportsclub.com.</p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href={COURT_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment-dark transition-colors duration-200"
            >
              Register Now <ChevronRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-ink border border-wsc-border px-8 py-3.5 hover:border-volt transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
