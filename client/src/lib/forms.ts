import { marketingAttributionMetadata } from "./marketing-attribution";

export type WebsiteFormType =
  | "contact"
  | "golf_lesson"
  | "newsletter_signup"
  | "member_cancellation"
  | "personal_training"
  | "private_event"
  | "career_application";

export type WebsiteFormAttachment = {
  name: string;
  contentType: string;
  contentBase64: string;
};

export type WebsiteFormPayload = {
  formType: WebsiteFormType;
  source: string;
  email: string;
  name?: string;
  phone?: string;
  subject?: string;
  message?: string;
  formName?: string;
  companyWebsite?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
  attachments?: WebsiteFormAttachment[];
};

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

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trackedPayload),
  });

  let result: { ok?: boolean; success?: boolean; error?: string } = {};

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok || (!result.ok && !result.success)) {
    throw new FormSubmissionError(
      result.error || "We could not submit the form right now. Please try again.",
      response.status,
    );
  }

  trackFormSubmit(payload);

  return result;
}

function trackFormSubmit(payload: WebsiteFormPayload) {
  if (typeof window === "undefined") return;

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;

  gtag("event", "form_submit", {
    form_name: payload.formName || labelForFormType(payload.formType),
    form_type: payload.formType,
    source: payload.source,
  });
}

function labelForFormType(formType: WebsiteFormType) {
  if (formType === "contact") return "Contact Form";
  if (formType === "golf_lesson") return "Golf Lessons Inquiry";
  if (formType === "member_cancellation") return "Membership Cancellation Requests";
  if (formType === "personal_training") return "Personal Training Interest Form";
  if (formType === "private_event") return "Private Events Inquiry";
  if (formType === "career_application") return "Careers Application Form";
  return "Newsletter Signup";
}
