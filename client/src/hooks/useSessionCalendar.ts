import { useSyncExternalStore } from "react";
import { pacificDay, seasonalState } from "@/lib/session-calendar";

const listeners = new Set<() => void>();
let stop: (() => void) | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    const refresh = () => listeners.forEach(notify => notify());
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    stop = () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      stop?.();
      stop = undefined;
    }
  };
}

// All seasonal surfaces share one timer; snapshots are stable throughout the day.
export function useSessionCalendar() {
  const today = useSyncExternalStore(subscribe, pacificDay, pacificDay);
  return { today, ...seasonalState(today) };
}
