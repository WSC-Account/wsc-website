import fs from "fs/promises";
import path from "path";
import { createHash, randomUUID } from "crypto";
import { ServerClient } from "postmark";
import type { WebsiteFormType } from "../shared/form-contracts.js";
import type {
  FormSubmission,
  FormDependencies,
  EmailDeliveryResult,
  ConstantContactSyncResult,
} from "./form-types.js";
import { requestJson } from "./form-http.js";
import { cleanString, cleanEmailHeader, isRecord } from "./form-validation.js";

export const sendPostmarkEmail: FormDependencies["sendEmail"] = (
  token,
  message
) => new ServerClient(token, { timeout: 10 }).sendEmail(message);

export const SUPPORT_EMAIL = "info@woodinvillesportsclub.com";

const FITNESS_ASSESSMENT_EMAIL = "camostad@woodinvillesportsclub.com";

const GOLF_LESSONS_EMAIL = "tier1golf@woodinvillesportsclub.com";

const GOLF_LESSONS_EMAIL_ALIASES = new Set([
  normalizeRecipient(GOLF_LESSONS_EMAIL),
  normalizeRecipient("tier1golf@woodinvillesportsclun.com"),
]);

export async function syncNewsletterWithConstantContact(
  submission: FormSubmission,
  dependencies: FormDependencies
): Promise<ConstantContactSyncResult> {
  const provider = "constant_contact" as const;

  if (submission.formType !== "newsletter_signup") {
    return { status: "skipped", provider };
  }

  const listIds = resolveConstantContactListIds(submission);
  if (!listIds.length) {
    return { status: "not_configured", provider };
  }

  let signupAttempted = false;
  try {
    const accessToken = await getConstantContactAccessToken(dependencies);
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

    signupAttempted = true;
    const response = await requestJson(
      "https://api.cc.email/v3/contacts/sign_up_form",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      },
      dependencies.fetch,
      dependencies.timeoutMs
    );

    const responseBody = response.body;
    if (!response.ok) {
      return {
        status: "failed",
        provider,
        listIds,
        error: formatApiError(response.status, responseBody),
      };
    }

    const contactId = cleanString(responseBody.contact_id, 80);
    if (!contactId)
      throw new Error("Newsletter provider did not confirm the contact.");
    return {
      status: "synced",
      provider,
      listIds,
      contactId,
      action: cleanString(responseBody.action, 40),
    };
  } catch (error) {
    return {
      status: signupAttempted ? "unknown" : "failed",
      provider,
      listIds,
      error:
        error instanceof Error
          ? error.message
          : "Unknown Constant Contact sync error.",
    };
  }
}

async function getConstantContactAccessToken(dependencies: FormDependencies) {
  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID?.trim();
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET?.trim();
  const tokenKey = `constant-contact:token:${createHash("sha256")
    .update(clientId || "default")
    .digest("hex")}`;
  const load = async () =>
    (await dependencies.store.get<ConstantContactTokenCache>(tokenKey)) ||
    (!process.env.VERCEL && !dependencies.store.durable
      ? await readConstantContactTokenCache()
      : null);
  let cachedToken = await load();
  if (cachedToken?.accessToken && cachedToken.expiresAt > Date.now() + 60_000)
    return cachedToken.accessToken;
  const envAccessToken = process.env.CONSTANT_CONTACT_ACCESS_TOKEN?.trim();
  const configuredRefreshToken =
    process.env.CONSTANT_CONTACT_REFRESH_TOKEN?.trim();
  if (
    !clientId ||
    !clientSecret ||
    !(cachedToken?.refreshToken || configuredRefreshToken)
  )
    return envAccessToken || "";

  const owner = randomUUID();
  const lockKey = `lock:${tokenKey}`;
  if (!(await dependencies.store.lock(lockKey, owner, 60))) {
    throw new Error(
      "Newsletter authentication is being refreshed. Please retry shortly."
    );
  }
  try {
    // Another request may have refreshed while this request was acquiring the lock.
    cachedToken = await load();
    if (cachedToken?.accessToken && cachedToken.expiresAt > Date.now() + 60_000)
      return cachedToken.accessToken;
    const refreshToken = cachedToken?.refreshToken || configuredRefreshToken!;
    const body = new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });
    const response = await requestJson(
      "https://authz.constantcontact.com/oauth2/default/v1/token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body,
      },
      dependencies.fetch,
      dependencies.timeoutMs
    );
    if (!response.ok)
      throw new Error(`Newsletter authentication failed (${response.status}).`);
    const accessToken = cleanString(response.body.access_token, 2_000);
    const nextRefreshToken =
      cleanString(response.body.refresh_token, 2_000) || refreshToken;
    const expiresIn = Number(response.body.expires_in);
    if (!accessToken || !Number.isFinite(expiresIn) || expiresIn <= 0) {
      throw new Error(
        "Newsletter authentication returned an invalid token expiry."
      );
    }
    const cache = {
      accessToken,
      refreshToken: nextRefreshToken,
      expiresAt: Date.now() + expiresIn * 1_000,
    };
    await dependencies.store.set(tokenKey, cache, 180 * 86_400);
    if (!process.env.VERCEL && !dependencies.store.durable)
      await writeConstantContactTokenCache(cache);
    return accessToken;
  } finally {
    await dependencies.store
      .unlock(lockKey, owner)
      .catch(() =>
        console.error("Newsletter token lock could not be released.")
      );
  }
}

export async function sendNotificationEmail(
  submission: FormSubmission,
  dependencies: FormDependencies
): Promise<EmailDeliveryResult> {
  const serverToken = process.env.POSTMARK_SERVER_TOKEN?.trim();
  const to = resolveNotificationRecipients(submission.formType);
  const provider = "postmark" as const;
  const from = cleanEmailHeader(
    process.env.FORM_ALERT_FROM || process.env.FORM_EMAIL_FROM || ""
  );
  const messageStream = cleanPostmarkMessageStream(
    process.env.POSTMARK_MESSAGE_STREAM || "outbound"
  );

  if (!serverToken) {
    console.warn(
      "POSTMARK_SERVER_TOKEN is not configured; no notification email was sent."
    );
    return { status: "not_configured", provider, to };
  }

  if (!to.length || !from) {
    console.warn(
      "FORM_ALERT_TO or FORM_ALERT_FROM is not configured; no notification email was sent."
    );
    return { status: "not_configured", provider, to };
  }

  const emailBody = buildEmailBody(submission);

  try {
    const result = await dependencies.sendEmail(serverToken, {
      From: from,
      To: to.join(","),
      ReplyTo: submission.email,
      Subject: submission.subject,
      TextBody: emailBody.text,
      HtmlBody: emailBody.html,
      MessageStream: messageStream,
      Attachments: submission.attachments.map(attachment => ({
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

    if (!result.MessageID)
      return {
        status: "unknown",
        provider,
        to,
        error: "Email provider did not confirm a message ID.",
      };
    return { status: "sent", provider, to, id: result.MessageID };
  } catch (error) {
    return {
      status:
        typeof (error as { statusCode?: unknown })?.statusCode === "number" &&
        Number((error as { statusCode: number }).statusCode) > 0
          ? "failed"
          : "unknown",
      provider,
      to,
      error:
        error instanceof Error
          ? error.message
          : "Unknown email delivery error.",
    };
  }
}

function buildEmailBody(submission: FormSubmission) {
  const metadataLines = Object.entries(submission.metadata).map(
    ([key, value]) => `${labelize(key)}: ${value ?? ""}`
  );
  const lines = [
    `Title: ${submission.subject}`,
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
    .map(line => (line ? `<p>${escapeHtml(line)}</p>` : "<br>"))
    .join("")}</div>`;

  return { text, html };
}

function parseRecipients(value: string) {
  return value
    .split(",")
    .map(recipient => cleanEmailHeader(recipient))
    .filter(Boolean);
}

export function resolveNotificationRecipients(formType: WebsiteFormType) {
  const configuredRecipients = parseRecipients(
    process.env.FORM_ALERT_TO || process.env.FORM_EMAIL_TO || SUPPORT_EMAIL
  );
  const baseRecipients = uniqueRecipients(
    configuredRecipients.filter(
      recipient =>
        !GOLF_LESSONS_EMAIL_ALIASES.has(normalizeRecipient(recipient))
    )
  );
  const recipients = baseRecipients.length ? baseRecipients : [SUPPORT_EMAIL];

  if (formType === "golf_lesson") {
    recipients.push(GOLF_LESSONS_EMAIL);
  }

  if (formType === "free_fitness_assessment") {
    recipients.push(FITNESS_ASSESSMENT_EMAIL);
  }

  return uniqueRecipients(recipients);
}

function uniqueRecipients(recipients: string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const recipient of recipients) {
    const key = normalizeRecipient(recipient);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(recipient);
  }

  return unique;
}

function normalizeRecipient(value: string) {
  const cleaned = cleanEmailHeader(value);
  const bracketedEmail = cleaned.match(/<([^<>]+)>$/)?.[1];
  return (bracketedEmail || cleaned).trim().toLowerCase();
}

function labelize(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function cleanPostmarkMessageStream(value: string) {
  return (
    cleanEmailHeader(value)
      .replace(/[^a-zA-Z0-9._-]/g, "")
      .slice(0, 40) || "outbound"
  );
}

function resolveConstantContactListIds(submission: FormSubmission) {
  const listIds = new Set(
    parseListIds(process.env.CONSTANT_CONTACT_LIST_IDS || "")
  );
  const interestMap = parseConstantContactInterestMap();
  const selectedInterests = cleanString(submission.metadata.interests, 1_000)
    .split(",")
    .map(interest => interest.trim())
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

    return Object.entries(parsed).reduce<Record<string, string[]>>(
      (map, [interest, rawListIds]) => {
        const cleanInterest = cleanString(interest, 160);
        if (!cleanInterest) return map;

        if (Array.isArray(rawListIds)) {
          const listIds = rawListIds.flatMap(value =>
            parseListIds(String(value))
          );
          if (listIds.length) map[cleanInterest] = listIds;
          return map;
        }

        const listIds = parseListIds(String(rawListIds));
        if (listIds.length) map[cleanInterest] = listIds;
        return map;
      },
      {}
    );
  } catch {
    console.error("CONSTANT_CONTACT_INTEREST_LIST_MAP must be valid JSON.");
    return {};
  }
}

function parseListIds(value: string) {
  return value
    .split(/[,\s]+/)
    .map(listId => cleanString(listId, 80))
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
    const rawCache = await fs.readFile(
      getConstantContactTokenCachePath(),
      "utf8"
    );
    const parsed = JSON.parse(rawCache);
    if (!isRecord(parsed)) return null;

    const accessToken = cleanString(parsed.accessToken, 2_000);
    const refreshToken = cleanString(parsed.refreshToken, 2_000);
    const expiresAt =
      typeof parsed.expiresAt === "number" ? parsed.expiresAt : 0;

    if (!accessToken || !refreshToken || !expiresAt) return null;
    return { accessToken, refreshToken, expiresAt };
  } catch {
    return null;
  }
}

async function writeConstantContactTokenCache(
  cache: ConstantContactTokenCache
) {
  const cachePath = getConstantContactTokenCachePath();
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, `${JSON.stringify(cache)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
}

function getConstantContactTokenCachePath() {
  return (
    process.env.CONSTANT_CONTACT_TOKEN_CACHE_FILE?.trim() ||
    (process.env.VERCEL
      ? "/tmp/wsc-constant-contact-token.json"
      : path.resolve(process.cwd(), "data", "constant-contact-token.json"))
  );
}

function formatApiError(status: number, body: Record<string, unknown>) {
  const message =
    cleanString(body.error_description, 500) || cleanString(body.error, 500);
  if (message) return `${status} ${message}`;
  if (Array.isArray(body.response)) {
    const messages = body.response
      .flatMap(item => {
        if (!isRecord(item)) return [];
        return (
          cleanString(item.error_message, 500) || cleanString(item.message, 500)
        );
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
