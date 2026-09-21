import { useEffect, useState } from "react";
import { pacificDay, seasonalState } from "@/lib/session-calendar";

// Re-evaluate in Pacific time on open tabs and after sleep/backgrounding.
export function useSessionCalendar() {
  const [today, setToday] = useState(() => pacificDay());
  useEffect(() => {
    const refresh = () => setToday(pacificDay());
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return { today, ...seasonalState(today) };
}
