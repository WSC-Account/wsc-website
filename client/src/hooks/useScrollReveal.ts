import { useEffect, useRef, useState } from "react";

interface ScrollRevealOptions {
  /** Fraction of element visible before triggering (0–1). Default 0.15 */
  threshold?: number;
  /** Root margin string, e.g. "0px 0px -60px 0px". Default "-40px" */
  rootMargin?: string;
  /** Only trigger once. Default true */
  once?: boolean;
}

/**
 * Lightweight scroll-reveal hook powered by IntersectionObserver.
 * Returns a ref to attach and a boolean `isVisible`.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = "0px 0px -40px 0px", once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

/**
 * Hook for staggered children reveals.
 * Returns a ref for the parent container and an array of visibility states per child index.
 */
export function useStaggerReveal(
  count: number,
  options: ScrollRevealOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 120, threshold = 0.1, rootMargin = "0px 0px -40px 0px", once = true } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(() => {
    if (typeof window === "undefined") return new Array(count).fill(true);
    const revealImmediately = !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return new Array(count).fill(revealImmediately);
  });
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleItems(new Array(count).fill(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          // Stagger each child
          for (let i = 0; i < count; i++) {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * staggerDelay);
          }
          if (once) observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [count, staggerDelay, threshold, rootMargin, once]);

  return { containerRef, visibleItems };
}
