/*
 * Accessibility Toggle — High Contrast Mode
 * Floating button that toggles high-contrast CSS class on <html>
 * Persists preference in localStorage
 */
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AccessibilityToggle() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wsc-high-contrast");
    if (stored === "true") {
      setHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }
  }, []);

  const toggle = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.documentElement.classList.add("high-contrast");
      localStorage.setItem("wsc-high-contrast", "true");
    } else {
      document.documentElement.classList.remove("high-contrast");
      localStorage.setItem("wsc-high-contrast", "false");
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed right-4 top-[calc(var(--site-header-height,130px)+1rem)] z-40 flex h-11 w-11 items-center justify-center border border-parchment/15 bg-dark-bg/90 text-parchment shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 hover:border-parchment/30 hover:bg-dark-mid lg:bottom-[4.5rem] lg:right-6 lg:top-auto"
      aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
      title={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
    >
      {highContrast ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}
