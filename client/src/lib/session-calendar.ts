// Single source for the published WSC calendar and seasonal messaging.
// Keep approximate dates as display text; never invent an opening day.
export interface Session {
  name: string;
  yearNote?: string;
  sessionDrop: string;
  autoEnroll: string;
  start: string;
  end: string;
  duration: string;
  blackout: string;
}

export const sessions: Session[] = [
  {
    name: "Fall 1",
    sessionDrop: "August 3, 2026",
    autoEnroll: "August 17, 2026",
    start: "August 31, 2026",
    end: "October 4, 2026",
    duration: "5 weeks",
    blackout: "Labor Day, September 7",
  },
  {
    name: "Fall 2",
    sessionDrop: "September 7, 2026",
    autoEnroll: "September 14, 2026",
    start: "October 5, 2026",
    end: "November 8, 2026",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Fall 3",
    sessionDrop: "October 12, 2026",
    autoEnroll: "October 19, 2026",
    start: "November 9, 2026",
    end: "December 20, 2026",
    duration: "6 weeks",
    blackout: "Thanksgiving, November 26",
  },
  {
    name: "Winter Break Camps",
    sessionDrop: "November 17, 2026",
    autoEnroll: "N/A",
    start: "December 21, 2026",
    end: "January 3, 2027",
    duration: "2 weeks",
    blackout: "Christmas / New Year",
  },
  {
    name: "Winter 1",
    yearNote: "2027",
    sessionDrop: "December 7, 2026",
    autoEnroll: "December 14, 2026",
    start: "January 4, 2027",
    end: "February 7, 2027",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Winter 2",
    yearNote: "2027",
    sessionDrop: "January 11, 2027",
    autoEnroll: "January 18, 2027",
    start: "February 8, 2027",
    end: "March 14, 2027",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Winter 3",
    yearNote: "2027",
    sessionDrop: "February 15, 2027",
    autoEnroll: "February 22, 2027",
    start: "March 15, 2027",
    end: "April 18, 2027",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Spring 1",
    yearNote: "2027",
    sessionDrop: "March 22, 2027",
    autoEnroll: "March 29, 2027",
    start: "April 19, 2027",
    end: "May 23, 2027",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Spring 2",
    yearNote: "2027",
    sessionDrop: "April 26, 2027",
    autoEnroll: "May 3, 2027",
    start: "May 24, 2027",
    end: "June 27, 2027",
    duration: "5 weeks",
    blackout: "None",
  },
  {
    name: "Summer",
    yearNote: "2027",
    sessionDrop: "Mid-January 2027",
    autoEnroll: "N/A",
    start: "June 28, 2027",
    end: "August 29, 2027",
    duration: "9 weeks",
    blackout: "July 4",
  },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function calendarDay(value: string): string | undefined {
  const match = /^(\w+) (\d{1,2}), (\d{4})$/.exec(value);
  if (!match || !months.includes(match[1])) return undefined;
  return `${match[3]}-${String(months.indexOf(match[1]) + 1).padStart(2, "0")}-${match[2].padStart(2, "0")}`;
}

export function pacificDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find(p => p.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function sessionStatus(session: Session, today: string) {
  if (today > calendarDay(session.end)!)
    return { label: "Past", tone: "muted" };
  if (today >= calendarDay(session.start)!)
    return { label: "In session", tone: "active" };
  const drop = calendarDay(session.sessionDrop);
  if (drop && today >= drop)
    return { label: "Registration open", tone: "active" };
  return { label: "Upcoming", tone: "future" };
}

// These detailed pages describe only 2026. Future summers must never revive them.
export const summer2026 = { start: "2026-06-29", end: "2026-08-30" };
export function summer2026Available(today: string) {
  return today <= summer2026.end;
}
export function summer2026Headline(today: string) {
  if (today > summer2026.end) return "Summer 2026 Has Ended";
  if (today >= "2026-08-24") return "One Week Left of Summer!";
  return today >= summer2026.start
    ? "Summer Training Is Underway"
    : "Summer Training & Camps 2026";
}

export function seasonalState(today: string, calendar: Session[] = sessions) {
  const ordered = [...calendar].sort((a, b) =>
    calendarDay(a.start)!.localeCompare(calendarDay(b.start)!)
  );
  const current = ordered.find(
    s => calendarDay(s.start)! <= today && today <= calendarDay(s.end)!
  );
  const next = ordered.find(s => calendarDay(s.start)! > today);
  const open = ordered.find(
    s =>
      calendarDay(s.start)! > today &&
      sessionStatus(s, today).label === "Registration open"
  );
  const focus = open ?? current ?? next;
  const title = open
    ? `${open.name} Registration Is Open`
    : current
      ? `${current.name} Is in Session`
      : next
        ? `${next.name} Starts ${next.start}`
        : "Explore WSC Programs";
  const currentText = current
    ? `${current.name} is in session through ${current.end}.`
    : "";
  const nextText = next
    ? `${next.name} begins ${next.start}. ${
        sessionStatus(next, today).label === "Registration open"
          ? "Registration is open in CourtReserve."
          : calendarDay(next.sessionDrop)
            ? `Registration opens ${next.sessionDrop}.`
            : `Registration timing: ${next.sessionDrop}. Check CourtReserve for availability.`
      }`
    : "";
  return {
    current,
    next,
    open,
    focus,
    title,
    description:
      [currentText, nextText].filter(Boolean).join(" ") ||
      "New session dates will be posted here. Explore Tier 1 Tennis and Golf and check CourtReserve for availability.",
    badge: current ? `${current.name} · In Session` : "WSC Programs",
    ctaLabel: open ? `Register for ${open.name}` : "View Session Calendar",
    ctaHref: open
      ? "https://app.courtreserve.com/Online/Portal/Index/6689"
      : "/sessions",
    external: Boolean(open),
    showSummer2026: summer2026Available(today),
  };
}
