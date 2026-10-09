import type {
  WebsiteFormPayload,
  WebsiteFormResult,
  WebsiteFormType,
} from "@shared/form-contracts";
import { formRequestCache } from "./form-idempotency";
import { marketingAttributionMetadata } from "./marketing-attribution";
import { trackAnalyticsEvent, trackAdvertisingConversion } from "./tracking";

const FREE_FITNESS_ASSESSMENT_CONVERSION_ID =
  "AW-18217215416/ouj7CNbhquccELjL0u5D";

export type {
  WebsiteFormAttachment,
  WebsiteFormPayload,
  WebsiteFormResult,
  WebsiteFormType,
} from "@shared/form-contracts";

export function newsletterSubmissionMessage(result: WebsiteFormResult) {
  return result.constantContactStatus === "synced"
    ? "Thanks, you're on the WSC newsletter list."
    : "We received your signup request. Our team will add you to the newsletter list.";
}

export class FormSubmissionError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "FormSubmissionError";
    this.status = status;
  }
}

export async function submitWebsiteForm(payload: WebsiteFormPayload) {
  const attribution = marketingAttributionMetadata();
  const trackedPayload = Object.keys(attribution).length
    ? {
        ...payload,
        metadata: {
          ...payload.metadata,
          ...attribution,
        },
      }
    : payload;

  const body = JSON.stringify(trackedPayload);
  const pending = await formRequestCache.claim(
    `${payload.formType}:${payload.source}`,
    body
  );
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": pending.key,
    },
    body,
  });

  let result: WebsiteFormResult = {};

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok || (!result.ok && !result.success)) {
    throw new FormSubmissionError(
      result.error ||
        "We could not submit the form right now. Please try again.",
      response.status
    );
  }

  formRequestCache.complete(pending);
  trackFormSubmit(payload);

  return result;
}

function trackFormSubmit(payload: WebsiteFormPayload) {
  trackAnalyticsEvent("form_submit", {
    form_name: payload.formName || labelForFormType(payload.formType),
    form_type: payload.formType,
    source: payload.source,
  });

  if (payload.formType === "free_fitness_assessment") {
    trackAdvertisingConversion(FREE_FITNESS_ASSESSMENT_CONVERSION_ID);
  }
}

function labelForFormType(formType: WebsiteFormType) {
  if (formType === "contact") return "Contact Form";
  if (formType === "free_fitness_assessment") return "Free Fitness Assessment";
  if (formType === "golf_lesson") return "Golf Lessons Inquiry";
  if (formType === "member_cancellation")
    return "Membership Cancellation Requests";
  if (formType === "personal_training")
    return "Personal Training Interest Form";
  if (formType === "private_event") return "Private Events Inquiry";
  if (formType === "career_application") return "Careers Application Form";
  return "Newsletter Signup";
}
