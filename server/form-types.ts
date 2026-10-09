import type { IncomingMessage } from "http";
import type { ServerClient } from "postmark";
import type {
  WebsiteFormType,
  WebsiteFormAttachment,
  WebsiteEmailStatus,
  WebsiteNewsletterStatus,
} from "../shared/form-contracts.js";
import type { FetchImplementation } from "./form-http.js";
import type { FormStore } from "./form-store.js";

export type RequestContext = {
  ip?: string;
  userAgent?: string;
  referer?: string;
};

export type FormSubmission = {
  id: string;
  submittedAt: string;
  formType: WebsiteFormType;
  source: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  metadata: Record<string, string | number | boolean | null>;
  attachments: WebsiteFormAttachment[];
  request: RequestContext;
};

export type EmailDeliveryResult = {
  status: Exclude<WebsiteEmailStatus, "skipped">;
  provider: "postmark";
  to: string[];
  id?: string;
  error?: string;
};

export type ConstantContactSyncResult = {
  status: WebsiteNewsletterStatus;
  provider: "constant_contact";
  contactId?: string;
  action?: string;
  listIds?: string[];
  error?: string;
};

export type RequestWithBody = IncomingMessage & {
  body?: unknown;
};

export type PostmarkMessage = Parameters<ServerClient["sendEmail"]>[0];

export type FormDependencies = {
  store: FormStore;
  fetch: FetchImplementation;
  sendEmail: (
    token: string,
    message: PostmarkMessage
  ) => Promise<{ MessageID: string }>;
  timeoutMs: number;
};
