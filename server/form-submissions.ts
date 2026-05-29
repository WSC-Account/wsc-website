import fs from "fs/promises";
import { randomUUID } from "crypto";
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import path from "path";

type WebsiteFormType = "contact" | "golf_lesson" | "newsletter_signup";

type WebsiteFormPayload = {
  formType?: unknown;
  source?: unknown;
  email?: unknown;
  name?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  metadata?: unknown;
};

type RequestContext = {
  ip?: string;
  userAgent?: string;
  referer?: string;
};

type FormSubmission = {
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
  request: RequestContext;
};

type EmailDeliveryResult = {
  status: "sent" | "not_configured" | "failed";
  provider: "resend";
  to: string[];
  error?: string;
};

type FormProcessingResult = {
  id: string;
  recorded: boolean;
  email: EmailDeliveryResult;
};

type RequestWithBody = IncomingMessage & {
  body?: unknown;
};

const DEFAULT_EMAIL_TO = "Info@woodinvillesportsclub.com";
const VALID_FORM_TYPES = new Set<WebsiteFormType>(["contact", "golf_lesson", "newsletter_signup"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 50_000;

class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

export async function handleFormSubmissionRequest(req: RequestWithBody, res: ServerResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Allow", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const result = await processFormSubmission(payload, getRequestContext(req.headers));

    if (result.email.status !== "sent") {
      if (result.email.status === "not_configured") {
        console.error("Form email notification is not configured. Set RESEND_API_KEY before accepting submissions.");
      } else {
        console.error("Form email notification failed", result.email.error);
      }
      sendJson(res, 502, {
        ok: false,
        recorded: result.recorded,
        emailed: false,
        emailStatus: result.email.status,
        error: "Your submission was saved, but the email notification could not be sent. Please try again or email Info@woodinvillesportsclub.com.",
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      id: result.id,
      recorded: result.recorded,
      emailed: result.email.status === "sent",
      emailStatus: result.email.status,
    });
  } catch (error) {
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    const message =
      error instanceof Error && statusCode < 500
        ? error.message
        : "We could not submit the form right now. Please try again.";

    if (!(error instanceof HttpError)) {
      console.error("Form submission failed", error);
    }

    sendJson(res, statusCode, { ok: false, error: message });
  }
}

async function processFormSubmission(rawPayload: unknown, request: RequestContext): Promise<FormProcessingResult> {
  const payload = normalizePayload(rawPayload);
  const submission: FormSubmission = {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    ...payload,
    request,
  };

  await recordSubmission(submission);
  const email = await sendNotificationEmail(submission);

  return {
    id: submission.id,
    recorded: true,
    email,
  };
}

function normalizePayload(rawPayload: unknown): Omit<FormSubmission, "id" | "submittedAt" | "request"> {
  if (!isRecord(rawPayload)) {
    throw new HttpError(400, "Please submit the form again.");
  }

  const payload = rawPayload as WebsiteFormPayload;
  const formType = cleanString(payload.formType, 80) as WebsiteFormType;
  const source = cleanString(payload.source, 160) || "/";
  const email = cleanString(payload.email, 320).toLowerCase();
  const name = cleanString(payload.name, 180);
  const phone = cleanString(payload.phone, 80);
  const subject = cleanString(payload.subject, 180);
  const message = cleanString(payload.message, 5_000);
  const metadata = cleanMetadata(payload.metadata);

  if (!VALID_FORM_TYPES.has(formType)) {
    throw new HttpError(400, "Please choose a valid form.");
  }

  if (!EMAIL_RE.test(email)) {
    throw new HttpError(400, "Please enter a valid email address.");
  }

  if (formType === "contact" && (!name || !message)) {
    throw new HttpError(400, "Please include your name and message.");
  }

  if (formType === "golf_lesson" && (!name || !metadata.skillLevel)) {
    throw new HttpError(400, "Please include your name and skill level.");
  }

  return {
    formType,
    source,
    name,
    email,
    phone,
    subject: subject || fallbackSubject(formType, name),
    message,
    metadata,
  };
}

async function recordSubmission(submission: FormSubmission) {
  const directory =
    process.env.FORM_SUBMISSIONS_DIR?.trim() ||
    (process.env.VERCEL ? "/tmp/wsc-form-submissions" : path.resolve(process.cwd(), "data", "form-submissions"));

  await fs.mkdir(directory, { recursive: true });
  await fs.appendFile(path.join(directory, "submissions.jsonl"), `${JSON.stringify(submission)}\n`, "utf8");

  const webhookUrl = process.env.FORM_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      console.error(`Form recording webhook failed with ${response.status}`);
    }
  } catch (error) {
    console.error("Form recording webhook failed", error);
  }
}

async function sendNotificationEmail(submission: FormSubmission): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = parseRecipients(process.env.FORM_EMAIL_TO || DEFAULT_EMAIL_TO);
  const provider = "resend" as const;
  const recipients = to.length ? to : [DEFAULT_EMAIL_TO];

  if (!apiKey) {
    console.warn("RESEND_API_KEY is not configured; form submission was recorded but no email was sent.");
    return { status: "not_configured", provider, to: recipients };
  }

  const from = process.env.FORM_EMAIL_FROM?.trim() || "WSC Website <onboarding@resend.dev>";
  const emailBody = buildEmailBody(submission);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: submission.email,
        subject: submission.subject,
        text: emailBody.text,
        html: emailBody.html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        status: "failed",
        provider,
        to: recipients,
        error: `Resend returned ${response.status}: ${errorText.slice(0, 500)}`,
      };
    }

    return { status: "sent", provider, to: recipients };
  } catch (error) {
    return {
      status: "failed",
      provider,
      to: recipients,
      error: error instanceof Error ? error.message : "Unknown email delivery error.",
    };
  }
}

async function readJsonBody(req: RequestWithBody) {
  if (req.body !== undefined) {
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

function getRequestContext(headers: IncomingHttpHeaders): RequestContext {
  return {
    ip: firstHeader(headers["x-forwarded-for"])?.split(",")[0]?.trim(),
    userAgent: firstHeader(headers["user-agent"]),
    referer: firstHeader(headers.referer),
  };
}

function buildEmailBody(submission: FormSubmission) {
  const metadataLines = Object.entries(submission.metadata).map(([key, value]) => `${labelize(key)}: ${value ?? ""}`);
  const lines = [
    `Form: ${labelize(submission.formType)}`,
    `Source: ${submission.source}`,
    `Submitted: ${submission.submittedAt}`,
    submission.name ? `Name: ${submission.name}` : null,
    `Email: ${submission.email}`,
    submission.phone ? `Phone: ${submission.phone}` : null,
    ...metadataLines,
    "",
    submission.message || "No message provided.",
    "",
    `Submission ID: ${submission.id}`,
  ].filter((line): line is string => line !== null);

  const text = lines.join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#151515">${lines
    .map((line) => (line ? `<p>${escapeHtml(line)}</p>` : "<br>"))
    .join("")}</div>`;

  return { text, html };
}

function cleanMetadata(value: unknown): Record<string, string | number | boolean | null> {
  if (!isRecord(value)) return {};

  return Object.entries(value)
    .slice(0, 20)
    .reduce<Record<string, string | number | boolean | null>>((metadata, [key, rawValue]) => {
      const cleanKey = cleanString(key, 80);
      if (!cleanKey) return metadata;

      if (typeof rawValue === "string") {
        metadata[cleanKey] = cleanString(rawValue, 1_000);
      } else if (typeof rawValue === "number" || typeof rawValue === "boolean" || rawValue === null) {
        metadata[cleanKey] = rawValue;
      }

      return metadata;
    }, {});
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").trim().slice(0, maxLength);
}

function fallbackSubject(formType: WebsiteFormType, name: string) {
  if (formType === "contact") return `Website inquiry from ${name || "WSC website"}`;
  if (formType === "golf_lesson") return `Golf lesson request from ${name || "WSC website"}`;
  return "WSC newsletter signup";
}

function parseRecipients(value: string) {
  return value
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

function firstHeader(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function labelize(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}
