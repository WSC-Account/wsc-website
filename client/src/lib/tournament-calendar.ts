import { pacificDay } from "./session-calendar";

export type TournamentStatus = "Past" | "Upcoming" | "In progress" | "TBD";

export type TournamentAgeGroup = "8-11" | "12-13" | "14-18";
export type TournamentAgeFilter = "all" | TournamentAgeGroup;

export function matchesTournamentAge(ageGroups: readonly TournamentAgeGroup[] | null, filter: TournamentAgeFilter) {
  return filter === "all" || Boolean(ageGroups?.includes(filter));
}

export type TournamentDates = {
  startDate: string;
  endDate: string;
  statusOverride?: "TBD";
};

function isCalendarDay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function tournamentState(event: TournamentDates, today = pacificDay()) {
  if (![event.startDate, event.endDate, today].every(isCalendarDay) || event.endDate < event.startDate) {
    throw new RangeError("Tournament dates must be valid ISO calendar days with endDate on or after startDate.");
  }

  // Unconfirmed details stay TBD, but an expired placeholder must leave the upcoming list.
  const status: TournamentStatus = event.statusOverride === "TBD"
    ? "TBD"
    : today < event.startDate
      ? "Upcoming"
      : today > event.endDate
        ? "Past"
        : "In progress";

  return { status, showInUpcoming: today <= event.endDate };
}
