import fs from "fs/promises";
import { createHash, randomUUID } from "crypto";
import type { IncomingHttpHeaders, ServerResponse } from "http";
import path from "path";
import type { WebsiteFormResult } from "../shared/form-contracts.js";
import { requestJson } from "./form-http.js";
import { configuredFormStore } from "./form-store.js";
import type {
  RequestContext,
  RequestWithBody,
  FormSubmission,
  FormDependencies,
  EmailDeliveryResult,
  ConstantContactSyncResult,
} from "./form-types.js";
import {
  HttpError,
  normalizePayload,
  readJsonBody,
  isRecord,
  isHoneypotSubmission,
} from "./form-validation.js";
import {
  SUPPORT_EMAIL,
  sendPostmarkEmail,
  sendNotificationEmail,
  syncNewsletterWithConstantContact,
  resolveNotificationRecipients,
} from "./form-providers.js";

export type { FormDependencies } from "./form-types.js";

type FormProcessingResult = {
  id: string;
  recorded: boolean;
  durable: boolean;
  email: EmailDeliveryResult;
  constantContact?: ConstantContactSyncResult;
};

type SubmissionProgress = {
  fingerprint: string;
  id: string;
  submittedAt: string;
  recorded: boolean;
  durable: boolean;
  webhookRecorded?: boolean;
  email?: EmailDeliveryResult;
  constantContact?: ConstantContactSyncResult;
};

const IDEMPOTENCY_SECONDS = 86_400;

const RECORD_RETENTION_SECONDS = 30 * 86_400;

const REQUEST_LOCK_SECONDS = 180;

const RATE_WINDOW_SECONDS = 600;

const RATE_LIMIT_PER_IP = 20;

const RATE_LIMIT_PER_EMAIL = 5;

/** Overrides make provider and storage failure cases testable without live requests. */
export function createFormSubmissionHandler(
  overrides: Partial<FormDependencies> = {}
) {
  return async function handler(req: RequestWithBody, res: ServerResponse) {
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
      const normalized = normalizePayload(payload);
      const dependencies: FormDependencies = {
        store: overrides.store ?? configuredFormStore(),
        fetch: overrides.fetch ?? fetch,
        timeoutMs: overrides.timeoutMs ?? 10_000,
        sendEmail: overrides.sendEmail ?? sendPostmarkEmail,
      };
      const forwardedIp = firstHeader(req.headers["x-forwarded-for"])
        ?.split(",")[0]
        ?.trim();
      // Only trust forwarded addresses on Vercel; a standalone client can forge them.
      const ip = process.env.VERCEL ? forwardedIp : req.socket?.remoteAddress;
      const count = await dependencies.store.increment(
        `rate:ip:${hash(ip || "unknown")}`,
        RATE_WINDOW_SECONDS
      );
      if (count > RATE_LIMIT_PER_IP) {
        throw new HttpError(
          429,
          "Too many requests. Please wait a few minutes before trying again.",
          RATE_WINDOW_SECONDS
        );
      }
      const idempotencyKey = firstHeader(req.headers["idempotency-key"]);
      if (idempotencyKey && !/^[a-zA-Z0-9:_-]{8,200}$/.test(idempotencyKey)) {
        throw new HttpError(400, "Please reload the form and try again.");
      }
      const result = await processFormSubmission(
        normalized,
        getRequestContext(req.headers),
        idempotencyKey || randomUUID(),
        dependencies
      );
      const subscribed = result.constantContact?.status === "synced";
      const emailed = result.email.status === "sent";
      const manualNewsletter =
        normalized.formType === "newsletter_signup" &&
        result.constantContact?.status === "not_configured" &&
        emailed;
      const complete =
        normalized.formType === "newsletter_signup"
          ? subscribed || manualNewsletter
          : emailed;
      const uncertain =
        result.email.status === "unknown" ||
        result.constantContact?.status === "unknown";
      const accepted = result.durable || emailed || subscribed;
      let error: string | undefined;
      if (!complete) {
        if (uncertain) {
          error = `We could not confirm delivery. Please email ${SUPPORT_EMAIL} with reference ${result.id} before submitting again.`;
        } else if (normalized.formType === "newsletter_signup" && emailed) {
          error = `Our team received your signup request, but automatic newsletter signup failed. Please try again or email ${SUPPORT_EMAIL}.`;
        } else {
          error = `${result.durable ? "Your request was saved, but the notification could not be sent." : "Your request has not been delivered."} Please try again or email ${SUPPORT_EMAIL}.`;
        }
      }
      sendJson(res, complete ? 200 : 502, {
        ok: complete,
        accepted,
        status: complete
          ? manualNewsletter
            ? "partial"
            : "completed"
          : uncertain
            ? "pending"
            : accepted
              ? "partial"
              : "failed",
        id: result.id,
        recorded: result.recorded,
        durable: result.durable,
        emailed,
        emailStatus: result.email.status,
        emailId: result.email.id,
        constantContactStatus: result.constantContact?.status,
        constantContactAction: result.constantContact?.action,
        retryable: !complete && !uncertain,
        ...(error ? { error } : {}),
      });
    } catch (error) {
      const statusCode = error instanceof HttpError ? error.statusCode : 503;
      if (error instanceof HttpError && error.retryAfter)
        res.setHeader("Retry-After", String(error.retryAfter));
      if (!(error instanceof HttpError))
        console.error(
          "Form processing unavailable",
          error instanceof Error ? error.name : "Unknown error"
        );
      sendJson(res, statusCode, {
        ok: false,
        error:
          error instanceof HttpError
            ? error.message
            : "We could not submit the form right now. Please try again.",
      });
    }
  };
}

export const handleFormSubmissionRequest = createFormSubmissionHandler();

async function processFormSubmission(
  payload: ReturnType<typeof normalizePayload>,
  request: RequestContext,
  idempotencyKey: string,
  dependencies: FormDependencies
): Promise<FormProcessingResult> {
  const { store } = dependencies;
  const key = `attempt:${hash(idempotencyKey)}`;
  const lockKey = `lock:${key}`;
  const owner = randomUUID();
  if (!(await store.lock(lockKey, owner, REQUEST_LOCK_SECONDS))) {
    throw new HttpError(
      409,
      "This request is already being processed. Please wait a moment before trying again.",
      3
    );
  }
  try {
    const fingerprint = hash(stableJson(payload));
    let progress = await store.get<SubmissionProgress>(key);
    if (progress && progress.fingerprint !== fingerprint) {
      throw new HttpError(
        409,
        "This request has changed. Please reload the form before sending it again."
      );
    }
    if (!progress) {
      const count = await store.increment(
        `rate:email:${hash(payload.email)}`,
        RATE_WINDOW_SECONDS
      );
      if (count > RATE_LIMIT_PER_EMAIL) {
        throw new HttpError(
          429,
          "Too many requests for this email. Please wait a few minutes before trying again.",
          RATE_WINDOW_SECONDS
        );
      }
      progress = {
        fingerprint,
        id: randomUUID(),
        submittedAt: new Date().toISOString(),
        recorded: false,
        durable: false,
      };
      await store.set(key, progress, IDEMPOTENCY_SECONDS);
    }
    const submission: FormSubmission = {
      ...payload,
      id: progress.id,
      submittedAt: progress.submittedAt,
      request,
    };
    if (
      !progress.recorded ||
      (process.env.FORM_WEBHOOK_URL?.trim() && !progress.webhookRecorded)
    ) {
      Object.assign(
        progress,
        await recordSubmission(submission, dependencies, progress)
      );
      await store.set(key, progress, IDEMPOTENCY_SECONDS);
    }
    if (submission.formType !== "newsletter_signup") {
      progress.constantContact = {
        status: "skipped",
        provider: "constant_contact",
      };
    } else if (
      !progress.constantContact ||
      ["failed", "not_configured"].includes(progress.constantContact.status)
    ) {
      // Save an in-flight marker before calling providers. After a crash or timeout,
      // never silently resend an operation whose acceptance cannot be determined.
      progress.constantContact = {
        status: "unknown",
        provider: "constant_contact",
      };
      await store.set(key, progress, IDEMPOTENCY_SECONDS);
      progress.constantContact = await syncNewsletterWithConstantContact(
        submission,
        dependencies
      );
      await store.set(key, progress, IDEMPOTENCY_SECONDS);
    }
    if (
      !progress.email ||
      ["failed", "not_configured"].includes(progress.email.status)
    ) {
      progress.email = {
        status: "unknown",
        provider: "postmark",
        to: resolveNotificationRecipients(submission.formType),
      };
      await store.set(key, progress, IDEMPOTENCY_SECONDS);
      progress.email = await sendNotificationEmail(submission, dependencies);
      await store.set(key, progress, IDEMPOTENCY_SECONDS);
    }
    if (progress.email.status !== "sent") {
      console.error("Form email was not confirmed", {
        submissionId: submission.id,
        status: progress.email.status,
      });
    }
    if (
      progress.constantContact?.status === "failed" ||
      progress.constantContact?.status === "unknown"
    ) {
      console.error("Newsletter signup was not confirmed", {
        submissionId: submission.id,
        status: progress.constantContact.status,
      });
    }
    if (store.durable) {
      await store.set(
        `submission:${submission.id}`,
        { ...submission, delivery: progress },
        RECORD_RETENTION_SECONDS
      );
    }
    return {
      id: progress.id,
      recorded: progress.recorded,
      durable: progress.durable,
      email: progress.email!,
      constantContact: progress.constantContact,
    };
  } finally {
    await store.unlock(lockKey, owner).catch(() => {
      // The bounded lease still expires if storage drops out after provider delivery.
      console.error("Form request lock could not be released.");
    });
  }
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (isRecord(value))
    return `{${Object.keys(value)
      .sort()
      .map(key => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`;
  return JSON.stringify(value);
}

async function recordSubmission(
  submission: FormSubmission,
  dependencies: FormDependencies,
  prior: Pick<SubmissionProgress, "recorded" | "durable" | "webhookRecorded">
) {
  let recorded = prior.recorded;
  let durable = prior.durable;
  let webhookRecorded = prior.webhookRecorded ?? false;
  if (!recorded && dependencies.store.durable) {
    await dependencies.store.set(
      `submission:${submission.id}`,
      submission,
      RECORD_RETENTION_SECONDS
    );
    recorded = true;
    durable = true;
  }
  // A retry of an unacknowledged webhook must not append the same local record.
  if (!prior.recorded) {
    const directory =
      process.env.FORM_SUBMISSIONS_DIR?.trim() ||
      (process.env.VERCEL
        ? "/tmp/wsc-form-submissions"
        : path.resolve(process.cwd(), "data", "form-submissions"));
    try {
      await fs.mkdir(directory, { recursive: true });
      await fs.appendFile(
        path.join(directory, "submissions.jsonl"),
        `${JSON.stringify(submission)}\n`,
        "utf8"
      );
      recorded = true;
      // On Vercel local disk is scratch space even when a custom path is set.
      durable ||= !process.env.VERCEL;
    } catch {
      console.error("Local form record could not be written.");
    }
  }

  const webhookUrl = process.env.FORM_WEBHOOK_URL?.trim();
  if (webhookUrl && !webhookRecorded) {
    try {
      const response = await requestJson(
        webhookUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": submission.id,
          },
          body: JSON.stringify(submission),
        },
        dependencies.fetch,
        dependencies.timeoutMs
      );
      if (response.ok) {
        recorded = true;
        durable = true;
        webhookRecorded = true;
      } else {
        console.error(`Form recording webhook failed with ${response.status}.`);
      }
    } catch {
      console.error("Form recording webhook did not acknowledge the request.");
    }
  }
  return { recorded, durable, webhookRecorded };
}

function getRequestContext(headers: IncomingHttpHeaders): RequestContext {
  return {
    ip: firstHeader(headers["x-forwarded-for"])?.split(",")[0]?.trim(),
    userAgent: firstHeader(headers["user-agent"]),
    referer: firstHeader(headers.referer),
  };
}

function firstHeader(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function sendJson(
  res: ServerResponse,
  statusCode: number,
  body: WebsiteFormResult
) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}
