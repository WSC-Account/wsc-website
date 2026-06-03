import { useEffect, useState } from "react";

export function useDeferredMount(delayMs: number) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idleCallback = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1));
    const cancelIdleCallback = window.cancelIdleCallback ?? window.clearTimeout;
    let delayTimer = 0;

    const idleId = idleCallback(() => {
      delayTimer = window.setTimeout(() => setReady(true), delayMs);
    });

    return () => {
      cancelIdleCallback(idleId);
      window.clearTimeout(delayTimer);
    };
  }, [delayMs]);

  return ready;
}
