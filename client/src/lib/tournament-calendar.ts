import { pacificDay } from "./session-calendar";

export type TournamentStatus = "Completed" | "Upcoming" | "In progress" | "TBD";

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
        ? "Completed"
        : "In progress";

  return { status, showInUpcoming: today <= event.endDate };
}
