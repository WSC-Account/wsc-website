import { lazy, Suspense, type ComponentType } from "react";
import { useDeferredMount } from "@/hooks/useDeferredMount";

const Analytics = lazy(() => import("./Analytics"));
const BackToTop = lazy(() => import("./BackToTop"));
const AccessibilityToggle = lazy(() => import("./AccessibilityToggle"));
const CookieConsent = lazy(() => import("./CookieConsent"));
const Toaster = lazy(() => import("@/components/ui/sonner").then((module) => ({ default: module.Toaster })));

function DeferredComponent({ component: Component, delayMs }: { component: ComponentType; delayMs: number }) {
  const ready = useDeferredMount(delayMs);
  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
}

export default function DeferredAppServices() {
  return (
    <>
      <DeferredComponent component={Toaster} delayMs={250} />
      <DeferredComponent component={Analytics} delayMs={600} />
      <DeferredComponent component={BackToTop} delayMs={700} />
      <DeferredComponent component={AccessibilityToggle} delayMs={700} />
      <DeferredComponent component={CookieConsent} delayMs={1200} />
    </>
  );
}
