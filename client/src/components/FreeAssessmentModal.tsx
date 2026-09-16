import { useEffect, useState } from "react";
import { FreeFitnessAssessmentForm } from "@/components/InquiryForms";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { trackMarketingEvent } from "@/lib/marketing-attribution";

export const FREE_ASSESSMENT_SOURCE = "/free-fitness-assessment";

/**
 * Fired when any primary CTA on the landing page is clicked. This is an
 * engagement signal only - the completed form submission is the conversion.
 */
export function trackAssessmentCtaClick(location: string) {
  trackMarketingEvent("free_assessment_cta_click", {
    cta_location: location,
    source: FREE_ASSESSMENT_SOURCE,
  });
}

export default function FreeAssessmentModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  // Opening the form is tracked separately from submitting it so the Google Ads
  // conversion stays tied to completed leads only.
  useEffect(() => {
    if (!open) return;
    trackMarketingEvent("free_assessment_form_open", {
      source: FREE_ASSESSMENT_SOURCE,
    });
  }, [open]);

  // Reset back to the form once the modal has fully closed, so a returning
  // visitor does not reopen to a stale confirmation screen.
  useEffect(() => {
    if (open) return;
    const timer = setTimeout(() => setSubmitted(false), 250);
    return () => clearTimeout(timer);
  }, [open]);

  const handleSuccess = () => {
    setSubmitted(true);
    trackMarketingEvent("free_assessment_submit", {
      source: FREE_ASSESSMENT_SOURCE,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92dvh] max-w-[calc(100%-1rem)] overflow-y-auto rounded-none border-wsc-border bg-parchment p-0 text-ink sm:max-w-[620px]"
      >
        {submitted ? (
          <div className="p-6 sm:p-10">
            <DialogTitle className="mb-4 text-[clamp(26px,4vw,38px)] font-light leading-[1.1] tracking-[-0.02em]">
              You're In.
            </DialogTitle>
            <DialogDescription className="text-[16px] leading-[1.75] text-ink-mid">
              We've received your Free Fitness Assessment request. A member of the WSC fitness team
              will be in touch to help schedule your assessment.
            </DialogDescription>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-8 inline-flex min-h-[56px] w-full items-center justify-center bg-volt-bright px-8 py-4 text-[12px] uppercase tracking-[0.14em] text-dark-bg transition-colors duration-200 hover:bg-parchment-dark"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-6 sm:p-10">
            <p className="mb-3 text-[13px] uppercase tracking-[0.22em] text-volt">
              WSC Fitness &amp; Performance
            </p>
            <DialogTitle className="mb-4 text-[clamp(24px,3.4vw,32px)] font-light leading-[1.12] tracking-[-0.02em]">
              Claim Your Free Fitness Assessment
            </DialogTitle>
            <DialogDescription className="mb-2 text-[15px] leading-[1.7] text-ink-mid">
              Tell us a little about yourself and our fitness team will follow up to schedule your
              assessment.
            </DialogDescription>
            <p className="mb-7 text-[12px] leading-[1.6] text-ink-light">
              * Indicates required question
            </p>
            <FreeFitnessAssessmentForm
              source={FREE_ASSESSMENT_SOURCE}
              buttonLabel="Claim My Free Assessment"
              note="Free, with no commitment required. We will reach out within 2 business days."
              onSuccess={handleSuccess}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
