import { useEffect } from "react";
import {
  captureMarketingAttribution,
  trackMarketingEvent,
} from "@/lib/marketing-attribution";

function linkLabel(link: HTMLAnchorElement) {
  return link.textContent?.replace(/\s+/g, " ").trim().slice(0, 100) || "Unlabeled link";
}

export default function MarketingAttribution() {
  useEffect(() => {
    captureMarketingAttribution();

    const trackLinkClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a");
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.href;
      const common = {
        link_text: linkLabel(link),
        link_url: href,
        page_path: window.location.pathname,
      };

      if (href.startsWith("tel:")) {
        trackMarketingEvent("contact_click", { ...common, contact_method: "phone" });
        return;
      }

      if (href.startsWith("mailto:")) {
        trackMarketingEvent("contact_click", { ...common, contact_method: "email" });
        return;
      }

      if (link.hostname === "app.courtreserve.com") {
        trackMarketingEvent("booking_click", { ...common, booking_provider: "CourtReserve" });
        if (common.page_path === "/membership" || /membership|join/i.test(common.link_text)) {
          trackMarketingEvent("membership_click", { ...common, membership_action: "start_courtreserve" });
        }
        return;
      }

      if (link.hostname === window.location.hostname && link.pathname === "/membership") {
        trackMarketingEvent("membership_click", { ...common, membership_action: "view_options" });
        return;
      }

      if (link.hostname && link.hostname !== window.location.hostname) {
        trackMarketingEvent("outbound_click", common);
      }
    };

    document.addEventListener("click", trackLinkClick);
    return () => document.removeEventListener("click", trackLinkClick);
  }, []);

  return null;
}
