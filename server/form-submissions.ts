import fs from "fs/promises";
import { randomUUID } from "crypto";
import { ServerClient } from "postmark";
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import path from "path";

type WebsiteFormType =
  | "contact"
  | "golf_lesson"
  | "newsletter_signup"
  | "member_cancellation"
  | "personal_training"
  | "private_event"
  | "career_application";

type WebsiteFormAttachment = {
  name: string;
  contentType: string;
  contentBase64: string;
};

type WebsiteFormPayload = {
  formType?: unknown;
  source?: unknown;
  email?: unknown;
  name?: unknown;
  fullName?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  comments?: unknown;
  formName?: unknown;
  companyWebsite?: unknown;
  website?: unknown;
  website_url?: unknown;
  metadata?: unknown;
  attachments?: unknown;
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
  attachments: WebsiteFormAttachment[];
  request: RequestContext;
};

type EmailDeliveryResult = {
  status: "sent" | "not_configured" | "failed";
  provider: "postmark";
  to: string[];
  id?: string;
  error?: string;
};

type ConstantContactSyncResult = {
  status: "synced" | "not_configured" | "skipped" | "failed";
  provider: "constant_contact";
  contactId?: string;
  action?: string;
  listIds?: string[];
  error?: string;
};

type FormProcessingResult = {
  id: string;
  recorded: boolean;
  email: EmailDeliveryResult;
  constantContact?: ConstantContactSyncResult;
};

type RequestWithBody = IncomingMessage & {
  body?: unknown;
};

const SUPPORT_EMAIL = "Info@woodinvillesportsclub.com";
const VALID_FORM_TYPES = new Set<WebsiteFormType>([
  "contact",
  "golf_lesson",
  "newsletter_signup",
  "member_cancellation",
  "personal_training",
  "private_event",
  "career_application",
]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 5_500_000;
const MAX_ATTACHMENT_BYTES = 2_500_000;

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

    if (isHoneypotSubmission(payload)) {
      sendJson(res, 200, {
        ok: true,
        success: true,
        recorded: false,
        emailed: false,
        emailStatus: "skipped",
      });
      return;
    }

    const result = await processFormSubmission(payload, getRequestContext(req.headers));

    if (result.constantContact?.status === "failed") {
      console.error("Constant Contact newsletter sync failed", result.constantContact.error);
      sendJson(res, 502, {
        ok: false,
        recorded: result.recorded,
        emailed: result.email.status === "sent",
        emailStatus: result.email.status,
        constantContactStatus: result.constantContact.status,
        error: `Your submission was saved, but we could not add you to the newsletter list. Please try again or email ${SUPPORT_EMAIL}.`,
      });
      return;
    }

    if (result.email.status !== "sent") {
      if (result.email.status === "not_configured") {
        console.error(
          "Form email notification is not configured. Set POSTMARK_SERVER_TOKEN, FORM_ALERT_TO, and FORM_ALERT_FROM before accepting submissions.",
        );
      } else {
        console.error("Form email notification failed", result.email.error);
      }
      sendJson(res, 502, {
        ok: false,
        recorded: result.recorded,
        emailed: false,
        emailStatus: result.email.status,
        error: `Your submission was saved, but the email notification could not be sent. Please try again or email ${SUPPORT_EMAIL}.`,
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      id: result.id,
      recorded: result.recorded,
      emailed: result.email.status === "sent",
      emailStatus: result.email.status,
      emailId: result.email.id,
      constantContactStatus: result.constantContact?.status,
      constantContactAction: result.constantContact?.action,
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
  const constantContact = await syncNewsletterWithConstantContact(submission);
  const email = await sendNotificationEmail(submission);

  return {
    id: submission.id,
    recorded: true,
    email,
    constantContact,
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
  const name = cleanString(payload.name, 180) || cleanString(payload.fullName, 180);
  const phone = cleanString(payload.phone, 80);
  const subject = cleanString(payload.subject, 180);
  const message = cleanString(payload.message, 5_000) || cleanString(payload.comments, 5_000);
  const metadata = cleanMetadata(payload.metadata);
  const attachments = cleanAttachments(payload.attachments);
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

  if (formType === "golf_lesson" && (!name || !metadata.skillLevel)) {
    throw new HttpError(400, "Please include your name and skill level.");
  }

  if (
    formType === "member_cancellation" &&
    (!name || !phone || !metadata.reason || !message || !metadata.improvements)
  ) {
    throw new HttpError(400, "Please include your contact information and cancellation details.");
  }

  if (formType === "personal_training" && (!name || !phone)) {
    throw new HttpError(400, "Please include your name and phone number.");
  }

  if (formType === "career_application" && (!name || !phone || !metadata.department)) {
    throw new HttpError(400, "Please include your contact information and department interest.");
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
    attachments,
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

async function syncNewsletterWithConstantContact(submission: FormSubmission): Promise<ConstantContactSyncResult> {
  const provider = "constant_contact" as const;

  if (submission.formType !== "newsletter_signup") {
    return { status: "skipped", provider };
  }

  const listIds = resolveConstantContactListIds(submission);
  if (!listIds.length) {
    return { status: "not_configured", provider };
  }

  try {
    const accessToken = await getConstantContactAccessToken();
    if (!accessToken) {
      return { status: "not_configured", provider, listIds };
    }

    const { firstName, lastName } = splitContactName(submission);
    const body: Record<string, unknown> = {
      email_address: submission.email,
      list_memberships: listIds,
    };

    if (firstName) body.first_name = firstName;
    if (lastName) body.last_name = lastName;

    const response = await fetch("https://api.cc.email/v3/contacts/sign_up_form", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseBody = await readJsonResponse(response);
    if (!response.ok) {
      return {
        status: "failed",
        provider,
        listIds,
        error: formatApiError(response.status, responseBody),
      };
    }

    return {
      status: "synced",
      provider,
      listIds,
      contactId: cleanString(responseBody.contact_id, 80),
      action: cleanString(responseBody.action, 40),
    };
  } catch (error) {
    return {
      status: "failed",
      provider,
      listIds,
      error: error instanceof Error ? error.message : "Unknown Constant Contact sync error.",
    };
  }
}

async function getConstantContactAccessToken() {
  const cachedToken = await readConstantContactTokenCache();
  if (cachedToken?.accessToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const envAccessToken = process.env.CONSTANT_CONTACT_ACCESS_TOKEN?.trim();
  const refreshToken = cachedToken?.refreshToken || process.env.CONSTANT_CONTACT_REFRESH_TOKEN?.trim();
  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID?.trim();
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET?.trim();

  if (!refreshToken || !clientId || !clientSecret) {
    return envAccessToken || "";
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://authz.constantcontact.com/oauth2/default/v1/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body,
  });
  const responseBody = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(`Constant Contact token refresh failed: ${formatApiError(response.status, responseBody)}`);
  }

  const accessToken = cleanString(responseBody.access_token, 2_000);
  const nextRefreshToken = cleanString(responseBody.refresh_token, 2_000) || refreshToken;
  const expiresIn = typeof responseBody.expires_in === "number" ? responseBody.expires_in : 86_400;

  if (!accessToken) {
    throw new Error("Constant Contact token refresh did not return an access token.");
  }

  await writeConstantContactTokenCache({
    accessToken,
    refreshToken: nextRefreshToken,
    expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1_000,
  });

  return accessToken;
}

async function sendNotificationEmail(submission: FormSubmission): Promise<EmailDeliveryResult> {
  const serverToken = process.env.POSTMARK_SERVER_TOKEN?.trim();
  const to = parseRecipients(process.env.FORM_ALERT_TO || process.env.FORM_EMAIL_TO || "");
  const provider = "postmark" as const;
  const from = cleanEmailHeader(process.env.FORM_ALERT_FROM || process.env.FORM_EMAIL_FROM || "");
  const messageStream = cleanPostmarkMessageStream(process.env.POSTMARK_MESSAGE_STREAM || "outbound");

  if (!serverToken) {
    console.warn("POSTMARK_SERVER_TOKEN is not configured; form submission was recorded but no email was sent.");
    return { status: "not_configured", provider, to };
  }

  if (!to.length || !from) {
    console.warn("FORM_ALERT_TO or FORM_ALERT_FROM is not configured; form submission was recorded but no email was sent.");
    return { status: "not_configured", provider, to };
  }

  const emailBody = buildEmailBody(submission);
  const postmark = new ServerClient(serverToken);

  try {
    const result = await postmark.sendEmail({
      From: from,
      To: to.join(","),
      ReplyTo: submission.email,
      Subject: submission.subject,
      TextBody: emailBody.text,
      HtmlBody: emailBody.html,
      MessageStream: messageStream,
      Attachments: submission.attachments.map((attachment) => ({
        Name: attachment.name,
        Content: attachment.contentBase64,
        ContentType: attachment.contentType,
        ContentID: attachment.name,
      })),
      Metadata: {
        submissionId: submission.id,
        formType: submission.formType,
      },
    });

    return { status: "sent", provider, to, id: result.MessageID };
  } catch (error) {
    return {
      status: "failed",
      provider,
      to,
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

function cleanAttachments(value: unknown): WebsiteFormAttachment[] {
  if (!Array.isArray(value)) return [];

  return value.slice(0, 1).flatMap((rawAttachment) => {
    if (!isRecord(rawAttachment)) return [];

    const name = cleanString(rawAttachment.name, 180).replace(/[\\/:*?"<>|]/g, "-");
    const contentType = cleanString(rawAttachment.contentType, 120) || "application/octet-stream";
    const contentBase64 = cleanString(rawAttachment.contentBase64, 4_000_000).replace(/\s/g, "");

    if (!name || !contentBase64 || !/^[a-zA-Z0-9+/]+={0,2}$/.test(contentBase64)) return [];

    const estimatedBytes = Math.floor((contentBase64.length * 3) / 4);
    if (estimatedBytes > MAX_ATTACHMENT_BYTES) {
      throw new HttpError(413, "Resume attachments must be smaller than 2.5 MB.");
    }

    return [{ name, contentType, contentBase64 }];
  });
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").trim().slice(0, maxLength);
}

function fallbackSubject(formType: WebsiteFormType, name: string) {
  if (formType === "contact") return `Website inquiry from ${name || "WSC website"}`;
  if (formType === "golf_lesson") return `Golf lesson inquiry from ${name || "WSC website"}`;
  if (formType === "member_cancellation") return `Membership cancellation request from ${name || "WSC website"}`;
  if (formType === "personal_training") return `Personal training request from ${name || "WSC website"}`;
  if (formType === "private_event") return `Private event inquiry from ${name || "WSC website"}`;
  if (formType === "career_application") return `Career application from ${name || "WSC website"}`;
  return "WSC newsletter signup";
}

function parseRecipients(value: string) {
  return value
    .split(",")
    .map((recipient) => cleanEmailHeader(recipient))
    .filter(Boolean);
}

function firstHeader(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHoneypotSubmission(value: unknown) {
  if (!isRecord(value)) return false;
  return Boolean(
    cleanString(value.companyWebsite, 200) ||
      cleanString(value.website, 200) ||
      cleanString(value.website_url, 200),
  );
}

function labelize(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function cleanEmailHeader(value: string) {
  let next = value.replace(/\\r|\\n/g, "").replace(/[\r\n]/g, "").trim();

  for (let index = 0; index < 2; index += 1) {
    if (
      (next.startsWith('"') && next.endsWith('"')) ||
      (next.startsWith("'") && next.endsWith("'"))
    ) {
      next = next.slice(1, -1).replace(/\\r|\\n/g, "").replace(/[\r\n]/g, "").trim();
    }
  }

  return next;
}

function cleanPostmarkMessageStream(value: string) {
  return cleanEmailHeader(value).replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 40) || "outbound";
}

function resolveConstantContactListIds(submission: FormSubmission) {
  const listIds = new Set(parseListIds(process.env.CONSTANT_CONTACT_LIST_IDS || ""));
  const interestMap = parseConstantContactInterestMap();
  const selectedInterests = cleanString(submission.metadata.interests, 1_000)
    .split(",")
    .map((interest) => interest.trim())
    .filter(Boolean);

  for (const interest of selectedInterests) {
    for (const listId of interestMap[interest] || []) {
      listIds.add(listId);
    }
  }

  return Array.from(listIds);
}

function parseConstantContactInterestMap() {
  const rawMap = process.env.CONSTANT_CONTACT_INTEREST_LIST_MAP?.trim();
  if (!rawMap) return {} as Record<string, string[]>;

  try {
    const parsed = JSON.parse(rawMap);
    if (!isRecord(parsed)) return {};

    return Object.entries(parsed).reduce<Record<string, string[]>>((map, [interest, rawListIds]) => {
      const cleanInterest = cleanString(interest, 160);
      if (!cleanInterest) return map;

      if (Array.isArray(rawListIds)) {
        const listIds = rawListIds.flatMap((value) => parseListIds(String(value)));
        if (listIds.length) map[cleanInterest] = listIds;
        return map;
      }

      const listIds = parseListIds(String(rawListIds));
      if (listIds.length) map[cleanInterest] = listIds;
      return map;
    }, {});
  } catch {
    console.error("CONSTANT_CONTACT_INTEREST_LIST_MAP must be valid JSON.");
    return {};
  }
}

function parseListIds(value: string) {
  return value
    .split(/[,\s]+/)
    .map((listId) => cleanString(listId, 80))
    .filter(Boolean);
}

function splitContactName(submission: FormSubmission) {
  const metadataFirstName = cleanString(submission.metadata.firstName, 80);
  const metadataLastName = cleanString(submission.metadata.lastName, 80);
  if (metadataFirstName || metadataLastName) {
    return { firstName: metadataFirstName, lastName: metadataLastName };
  }

  const parts = submission.name.split(/\s+/).filter(Boolean);
  return {
    firstName: cleanString(parts[0] || "", 80),
    lastName: cleanString(parts.slice(1).join(" "), 80),
  };
}

type ConstantContactTokenCache = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

async function readConstantContactTokenCache(): Promise<ConstantContactTokenCache | null> {
  try {
    const rawCache = await fs.readFile(getConstantContactTokenCachePath(), "utf8");
    const parsed = JSON.parse(rawCache);
    if (!isRecord(parsed)) return null;

    const accessToken = cleanString(parsed.accessToken, 2_000);
    const refreshToken = cleanString(parsed.refreshToken, 2_000);
    const expiresAt = typeof parsed.expiresAt === "number" ? parsed.expiresAt : 0;

    if (!accessToken || !refreshToken || !expiresAt) return null;
    return { accessToken, refreshToken, expiresAt };
  } catch {
    return null;
  }
}

async function writeConstantContactTokenCache(cache: ConstantContactTokenCache) {
  const cachePath = getConstantContactTokenCachePath();
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, `${JSON.stringify(cache)}\n`, { encoding: "utf8", mode: 0o600 });
}

function getConstantContactTokenCachePath() {
  return (
    process.env.CONSTANT_CONTACT_TOKEN_CACHE_FILE?.trim() ||
    (process.env.VERCEL
      ? "/tmp/wsc-constant-contact-token.json"
      : path.resolve(process.cwd(), "data", "constant-contact-token.json"))
  );
}

async function readJsonResponse(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  if (!text) return {};

  try {
    const parsed = JSON.parse(text);
    return isRecord(parsed) ? parsed : { response: parsed };
  } catch {
    return { response: text.slice(0, 500) };
  }
}

function formatApiError(status: number, body: Record<string, unknown>) {
  const message = cleanString(body.error_description, 500) || cleanString(body.error, 500);
  if (message) return `${status} ${message}`;
  if (Array.isArray(body.response)) {
    const messages = body.response
      .flatMap((item) => {
        if (!isRecord(item)) return [];
        return cleanString(item.error_message, 500) || cleanString(item.message, 500);
      })
      .filter(Boolean);
    if (messages.length) return `${status} ${messages.join("; ")}`;
  }
  return `${status} ${JSON.stringify(body).slice(0, 500)}`;
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
