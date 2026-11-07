const intro = "Intro to Tennis";
const technique = "Technique & Live Ball";
const patterns = "Patterns & Point Play";

export const adultClasses = [
  {
    name: intro,
    level: "Beginner",
    desc: "For players with little to no tennis experience. Covers the five basic strokes, grips, and footwork.",
  },
  {
    name: "Co-ed Doubles Strategy Clinic",
    level: "NTRP 2.5-3.0",
    desc: "Net play, positioning, shot selection, movement patterns, communication, and match-play readiness.",
  },
  {
    name: "Shot Spotlight",
    level: "UTR 1.0-3.5",
    desc: "A weekly deep dive into one featured shot, focused on form, execution, and repetition.",
  },
  {
    name: patterns,
    level: "NTRP 2.5 advanced-3.5",
    desc: "Fast-paced rallying, player-fed points, consistency work, and competitive pattern training.",
  },
  {
    name: technique,
    level: "NTRP 2.5 advanced-3.5",
    desc: "Coach-fed technical instruction followed by champion/challenger style live-ball play.",
  },
  {
    name: "Small Group Intensives",
    level: "UTR 1.0–5.5+",
    desc: "High-repetition training for players who want a harder, more focused class format.",
  },
];

export const ADULT_CLASS_DETAILS =
  "Adult classes meet weekly, with drop-ins opening one week prior when available. Pricing varies by class length and session duration, typically $45-$75 + tax per class or $225-$325 + tax per 5-week session. Coaches evaluate new players and may suggest level adjustments.";

type ClassTime = {
  name: string;
  time: string;
  event: string;
};

// Fall 3 schedule verified against CourtReserve's Adult Tennis Programming listings.
export const fallAdultSchedule = {
  label: "Fall 3 · Nov 9–Dec 20, 2026",
  end: "2026-12-20",
  days: [
    {
      day: "Monday",
      classes: [
        {
          name: technique,
          time: "10:00–11:30 AM",
          event: "KKVAIY76689600?resId=62154029",
        },
        {
          name: intro,
          time: "8:00–9:30 PM",
          event: "W9W8NRC6689798?resId=62149954",
        },
        {
          name: "Small Group Intensives UTR 5.5+",
          time: "8:00–9:30 PM",
          event: "LMRLSJH6689214?resId=62154640",
        },
        {
          name: technique,
          time: "8:00–9:30 PM",
          event: "VHM6T5U6689358?resId=62154006",
        },
        {
          name: technique,
          time: "9:30–11:00 PM",
          event: "ZOP8WNR6689647?resId=62153987",
        },
      ],
    },
    {
      day: "Tuesday",
      classes: [
        {
          name: patterns,
          time: "8:00–9:30 PM",
          event: "J94JAT86689652?resId=62154515",
        },
      ],
    },
    {
      day: "Wednesday",
      classes: [
        {
          name: technique,
          time: "10:00–11:30 AM",
          event: "TGC6MK56689141?resId=62154234",
        },
        {
          name: technique,
          time: "11:30 AM–1:00 PM",
          event: "GZ8SCXZ6689624?resId=62154212",
        },
        {
          name: intro,
          time: "8:00–9:30 PM",
          event: "JT54IEK6689165?resId=62149974",
        },
        {
          name: "Small Group Intensives UTR 3.5–5.5",
          time: "8:00–9:30 PM",
          event: "QEOV8346689354?resId=62154653",
        },
        {
          name: technique,
          time: "8:00–9:30 PM",
          event: "G6TMHF86689652?resId=62154054",
        },
      ],
    },
    {
      day: "Thursday",
      classes: [
        {
          name: patterns,
          time: "8:00–9:30 PM",
          event: "GF9SYMS668978?resId=62154529",
        },
        {
          name: "Small Group Intensives UTR 1–3.5",
          time: "8:00–9:30 PM",
          event: "P6VZWS56689127?resId=62154672",
        },
      ],
    },
    {
      day: "Saturday",
      classes: [
        {
          name: technique,
          time: "10:00–11:30 AM",
          event: "Z45YMWD6689340?resId=62154270",
        },
        {
          name: intro,
          time: "2:00–3:30 PM",
          event: "I8U669U6689552?resId=62150043",
        },
        {
          name: patterns,
          time: "2:00–3:30 PM",
          event: "16ESCNX6689688?resId=62154554",
        },
      ],
    },
  ] satisfies { day: string; classes: ClassTime[] }[],
  spotlight: [
    {
      date: "Nov 10",
      name: "Forehand",
      time: "10:00–11:30 AM",
      event: "GGO9KKH6689140?resId=62154995",
    },
    {
      date: "Nov 17",
      name: "Backhand",
      time: "10:00–11:30 AM",
      event: "7C6KUEO6689336?resId=62155043",
    },
    {
      date: "Nov 24",
      name: "Slice",
      time: "11:30 AM–1:00 PM",
      event: "3UMFZUX6689813?resId=62155088",
    },
    {
      date: "Dec 1",
      name: "Serve & Return",
      time: "11:30 AM–1:00 PM",
      event: "TST2CEG6689252?resId=62155097",
    },
    {
      date: "Dec 8",
      name: "Volley & Overheads",
      time: "11:30 AM–1:00 PM",
      event: "O87Y8TJ6689414?resId=62155108",
    },
    {
      date: "Dec 15",
      name: "Serve & Return",
      time: "11:30 AM–1:00 PM",
      event: "1M3FSEW668990?resId=62155179",
    },
  ] satisfies (ClassTime & { date: string })[],
};
