import {
  WEBSITE_FORM_TYPES,
  type WebsiteFormType,
  type WebsiteFormAttachment,
  type WebsiteFormPayload,
} from "../shared/form-contracts.js";
import type { FormSubmission, RequestWithBody } from "./form-types.js";

// External JSON remains untrusted; legacy aliases are accepted only here.
type RawFormPayload = Partial<
  Record<
    | keyof WebsiteFormPayload
    | "fullName"
    | "comments"
    | "website"
    | "website_url",
    unknown
  >
>;
const VALID_FORM_TYPES = new Set<WebsiteFormType>(WEBSITE_FORM_TYPES);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_BODY_BYTES = 5_500_000;

const MAX_ATTACHMENT_BYTES = 2_500_000;

export class HttpError extends Error {
  statusCode: number;
  retryAfter?: number;

  constructor(statusCode: number, message: string, retryAfter?: number) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.retryAfter = retryAfter;
  }
}

export function normalizePayload(
  rawPayload: unknown
): Omit<FormSubmission, "id" | "submittedAt" | "request"> {
  if (!isRecord(rawPayload)) {
    throw new HttpError(400, "Please submit the form again.");
  }

  const payload = rawPayload as RawFormPayload;
  const formType = cleanString(payload.formType, 80) as WebsiteFormType;
  const source = cleanString(payload.source, 160) || "/";
  const email = cleanString(payload.email, 320).toLowerCase();
  const name =
    cleanString(payload.name, 180) || cleanString(payload.fullName, 180);
  const phone = cleanString(payload.phone, 80);
  const message =
    cleanString(payload.message, 5_000) || cleanString(payload.comments, 5_000);
  const metadata = cleanMetadata(payload.metadata);
  const attachments = cleanAttachments(payload.attachments);
  if (attachments.length && formType !== "career_application") {
    throw new HttpError(
      400,
      "Attachments are only accepted with job applications."
    );
  }
  const formName = cleanString(payload.formName, 120);

  if (formName) {
    metadata.formName = formName;
  }

  if (!VALID_FORM_TYPES.has(formType)) {
    throw new HttpError(400, "Please choose a valid form.");
  }

  if (!EMAIL_RE.test(email)) {
    throw new HttpError(400, "Please enter a valid email address.");
  }

  if (formType === "contact" && (!name || !message)) {
    throw new HttpError(400, "Please include your name and message.");
  }

  if (
    formType === "free_fitness_assessment" &&
    (!metadata.assessmentDays || !metadata.preferredTime)
  ) {
    throw new HttpError(
      400,
      "Please include the days and time that work best for your assessment."
    );
  }

  if (formType === "golf_lesson" && (!name || !metadata.skillLevel)) {
    throw new HttpError(400, "Please include your name and skill level.");
  }

  if (formType === "member_cancellation" && (!name || !phone || !message)) {
    throw new HttpError(
      400,
      "Please include your contact information and cancellation details."
    );
  }

  if (formType === "personal_training" && (!name || !phone)) {
    throw new HttpError(400, "Please include your name and phone number.");
  }

  if (
    formType === "career_application" &&
    (!name || !phone || !metadata.department)
  ) {
    throw new HttpError(
      400,
      "Please include your contact information and department interest."
    );
  }

  return {
    formType,
    source,
    name,
    email,
    phone,
    subject: buildNotificationSubject(formType, name, email, metadata),
    message,
    metadata,
    attachments,
  };
}

export async function readJsonBody(req: RequestWithBody) {
  if (req.body !== undefined) {
    if (
      Buffer.byteLength(JSON.stringify(req.body) ?? "", "utf8") > MAX_BODY_BYTES
    ) {
      throw new HttpError(413, "This form submission is too large.");
    }
    return req.body;
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;

    if (totalBytes > MAX_BODY_BYTES) {
      throw new HttpError(413, "This form submission is too large.");
    }

    chunks.push(buffer);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();
  if (!rawBody) {
    throw new HttpError(400, "Please submit the form again.");
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new HttpError(400, "Please submit the form again.");
  }
}

function cleanMetadata(
  value: unknown
): Record<string, string | number | boolean | null> {
  if (!isRecord(value)) return {};

  return Object.entries(value)
    .slice(0, 20)
    .reduce<Record<string, string | number | boolean | null>>(
      (metadata, [key, rawValue]) => {
        const cleanKey = cleanString(key, 80);
        if (!cleanKey) return metadata;

        if (typeof rawValue === "string") {
          metadata[cleanKey] = cleanString(rawValue, 1_000);
        } else if (
          typeof rawValue === "number" ||
          typeof rawValue === "boolean" ||
          rawValue === null
        ) {
          metadata[cleanKey] = rawValue;
        }

        return metadata;
      },
      {}
    );
}

function cleanAttachments(value: unknown): WebsiteFormAttachment[] {
  if (!Array.isArray(value)) return [];

  return value.slice(0, 1).flatMap(rawAttachment => {
    if (!isRecord(rawAttachment)) return [];

    const name = cleanString(rawAttachment.name, 180).replace(
      /[\\/:*?"<>|]/g,
      "-"
    );
    const extension = name.split(".").pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
    const contentType = extension ? contentTypes[extension] : undefined;
    if (!contentType)
      throw new HttpError(400, "Please upload a PDF, DOC, or DOCX resume.");
    const contentBase64 = cleanString(
      rawAttachment.contentBase64,
      4_000_000
    ).replace(/\s/g, "");

    if (
      !name ||
      !contentBase64 ||
      !/^[a-zA-Z0-9+/]+={0,2}$/.test(contentBase64)
    )
      return [];

    const estimatedBytes = Math.floor((contentBase64.length * 3) / 4);
    if (estimatedBytes > MAX_ATTACHMENT_BYTES) {
      throw new HttpError(
        413,
        "Resume attachments must be smaller than 2.5 MB."
      );
    }
    const signature = Buffer.from(contentBase64, "base64").subarray(0, 8);
    const validSignature =
      extension === "pdf"
        ? signature.subarray(0, 5).toString() === "%PDF-"
        : extension === "doc"
          ? signature.toString("hex") === "d0cf11e0a1b11ae1"
          : signature.subarray(0, 4).toString("hex") === "504b0304";
    if (!validSignature)
      throw new HttpError(
        400,
        "The resume file does not match its file type. Please export it as PDF, DOC, or DOCX."
      );

    return [{ name, contentType, contentBase64 }];
  });
}

export function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").trim().slice(0, maxLength);
}

function buildNotificationSubject(
  formType: WebsiteFormType,
  name: string,
  email: string,
  metadata: Record<string, string | number | boolean | null>
) {
  const person = subjectPart(name || email || "WSC website");

  if (formType === "contact")
    return `WSC Contact Form - Message from ${person}`;
  if (formType === "free_fitness_assessment")
    return `WSC Free Fitness Assessment - ${person}`;
  if (formType === "newsletter_signup")
    return `WSC Newsletter Signup - ${person}`;
  if (formType === "member_cancellation")
    return `WSC Membership Cancellation Request - ${person}`;
  if (formType === "personal_training")
    return `WSC Personal Training Request - ${person}`;
  if (formType === "private_event")
    return `WSC Private Event Inquiry - ${person}`;

  if (formType === "golf_lesson") {
    const skillLevel = subjectPart(metadata.skillLevel, 40);
    return skillLevel
      ? `WSC Golf Lesson Inquiry - ${skillLevel} - ${person}`
      : `WSC Golf Lesson Inquiry - ${person}`;
  }

  if (formType === "career_application") {
    const department = subjectPart(metadata.department, 60);
    return department
      ? `WSC Career Application - ${department} - ${person}`
      : `WSC Career Application - ${person}`;
  }

  return `WSC Website Form - ${person}`;
}

function subjectPart(value: unknown, maxLength = 80) {
  return cleanEmailHeader(cleanString(value, maxLength))
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isHoneypotSubmission(value: unknown) {
  if (!isRecord(value)) return false;
  return Boolean(
    cleanString(value.companyWebsite, 200) ||
      cleanString(value.website, 200) ||
      cleanString(value.website_url, 200)
  );
}

export function cleanEmailHeader(value: string) {
  let next = value
    .replace(/\\r|\\n/g, "")
    .replace(/[\r\n]/g, "")
    .trim();

  for (let index = 0; index < 2; index += 1) {
    if (
      (next.startsWith('"') && next.endsWith('"')) ||
      (next.startsWith("'") && next.endsWith("'"))
    ) {
      next = next
        .slice(1, -1)
        .replace(/\\r|\\n/g, "")
        .replace(/[\r\n]/g, "")
        .trim();
    }
  }

  return next;
}
