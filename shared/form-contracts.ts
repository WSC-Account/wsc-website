/** Public request/response shapes shared by browser clients and form handlers. */
export const WEBSITE_FORM_TYPES = [
  "contact",
  "free_fitness_assessment",
  "golf_lesson",
  "newsletter_signup",
  "member_cancellation",
  "personal_training",
  "private_event",
  "career_application",
] as const;

export type WebsiteFormType = (typeof WEBSITE_FORM_TYPES)[number];

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

export type WebsiteEmailStatus =
  | "sent"
  | "not_configured"
  | "failed"
  | "unknown"
  | "skipped";
export type WebsiteNewsletterStatus =
  | "synced"
  | "not_configured"
  | "skipped"
  | "failed"
  | "unknown";

export type WebsiteFormResult = {
  ok?: boolean;
  success?: boolean;
  error?: string;
  accepted?: boolean;
  id?: string;
  retryable?: boolean;
  status?: "completed" | "partial" | "pending" | "failed";
  recorded?: boolean;
  durable?: boolean;
  emailed?: boolean;
  emailStatus?: WebsiteEmailStatus;
  emailId?: string;
  constantContactStatus?: WebsiteNewsletterStatus;
  constantContactAction?: string;
};
