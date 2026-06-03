#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleFormSubmissionRequest } from "../server/form-submissions.ts";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_TO = "Info@woodinvillesportsclub.com";
const TEST_TOKEN = "POSTMARK_API_TEST";
const args = new Set(process.argv.slice(2));
const argValues = new Map(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--") && arg.includes("="))
    .map((arg) => {
      const [key, ...rest] = arg.split("=");
      return [key, rest.join("=")];
    }),
);

if (args.has("--help") || args.has("-h")) {
  printHelp();
  process.exit(0);
}

const env = loadEnvironment();
const deliver = args.has("--deliver");
const syncConstantContact = args.has("--constant-contact") || args.has("--sync-constant-contact");
const requestedForm = clean(argValues.get("--form"));
const targetRecipient = clean(argValues.get("--to") || env.FORM_ALERT_TO || env.FORM_EMAIL_TO || DEFAULT_TO);
const from = clean(argValues.get("--from") || env.FORM_ALERT_FROM || env.FORM_EMAIL_FROM || `WSC Website <${DEFAULT_TO}>`);
const messageStream = clean(argValues.get("--message-stream") || env.POSTMARK_MESSAGE_STREAM) || "outbound";
const serverToken = deliver ? clean(env.POSTMARK_SERVER_TOKEN) : TEST_TOKEN;
const submissionDir = fs.mkdtempSync(path.join(os.tmpdir(), "wsc-form-smoke-"));
const allPayloads = buildPayloads();
const payloads = requestedForm ? allPayloads.filter((payload) => payload.formType === requestedForm) : allPayloads;

const issues = [];
if (deliver && !serverToken) issues.push("POSTMARK_SERVER_TOKEN is required with --deliver.");
if (!targetRecipient) issues.push("FORM_ALERT_TO or --to is required.");
if (!from) issues.push("FORM_ALERT_FROM or --from is required.");
if (requestedForm && !payloads.length) {
  issues.push(`Unknown --form value "${requestedForm}".`);
}

if (issues.length) {
  for (const issue of issues) console.error(`[error] ${issue}`);
  process.exit(1);
}

process.env.POSTMARK_SERVER_TOKEN = serverToken;
process.env.POSTMARK_MESSAGE_STREAM = messageStream;
process.env.FORM_ALERT_TO = targetRecipient;
process.env.FORM_ALERT_FROM = from;
process.env.FORM_SUBMISSIONS_DIR = submissionDir;
delete process.env.FORM_WEBHOOK_URL;

if (!syncConstantContact) {
  for (const key of [
    "CONSTANT_CONTACT_CLIENT_ID",
    "CONSTANT_CONTACT_CLIENT_SECRET",
    "CONSTANT_CONTACT_REFRESH_TOKEN",
    "CONSTANT_CONTACT_ACCESS_TOKEN",
    "CONSTANT_CONTACT_LIST_IDS",
    "CONSTANT_CONTACT_INTEREST_LIST_MAP",
    "CONSTANT_CONTACT_TOKEN_CACHE_FILE",
  ]) {
    delete process.env[key];
  }
}

console.log("WSC form delivery smoke test");
console.log(`Recipient: ${targetRecipient}`);
console.log(`Message stream: ${messageStream}`);
console.log(`Submission log: ${submissionDir}`);

if (deliver) {
  console.log(`[warn] --deliver is enabled. This sends ${payloads.length} real email${payloads.length === 1 ? "" : "s"}.`);
} else {
  console.log("[info] Using POSTMARK_API_TEST. Postmark validates each email payload but does not deliver messages.");
}
if (syncConstantContact) {
  console.log("[warn] Constant Contact sync is enabled. Newsletter smoke payloads can create or update real contacts.");
} else {
  console.log("[info] Constant Contact sync is disabled for this smoke run.");
}

let failures = 0;

for (const payload of payloads) {
  const result = await submit(payload);

  if (result.statusCode !== 200 || !result.body?.ok || result.body?.emailStatus !== "sent") {
    failures += 1;
    console.error(
      `[error] ${payload.formType} failed with HTTP ${result.statusCode}: ${JSON.stringify(result.body)}`,
    );
    continue;
  }

  console.log(`[ok] ${payload.formType} accepted by /api/contact and Postmark (${result.body.id}).`);
}

if (failures) {
  console.error(`[error] ${failures} form smoke test${failures === 1 ? "" : "s"} failed.`);
  process.exit(1);
}

console.log("[ok] Every selected website form type was accepted for delivery to the configured WSC inbox.");

function buildPayloads() {
  const base = {
    name: "WSC Postmark Smoke Test",
    email: "website-test@woodinvillesportsclub.com",
    phone: "425-487-1090",
    message: "Automated Postmark smoke test. No customer action is required.",
  };

  return [
    {
      ...base,
      formType: "contact",
      source: "/contact",
      subject: "Postmark smoke test: contact",
    },
    {
      ...base,
      formType: "newsletter_signup",
      source: "/",
      subject: "Postmark smoke test: newsletter signup",
      metadata: {
        interests: "Tennis updates, Golf updates, Summer camp updates",
      },
    },
    {
      ...base,
      formType: "golf_lesson",
      source: "/golf",
      subject: "Postmark smoke test: golf lesson",
      metadata: {
        skillLevel: "Intermediate",
        preferredProgram: "Private lesson",
        preferredDays: "Weekdays",
      },
    },
    {
      ...base,
      formType: "member_cancellation",
      source: "/member-request",
      subject: "Postmark smoke test: member cancellation",
      metadata: {
        reason: "Smoke test",
        improvements: "Smoke test only",
        wantsFollowUp: false,
      },
    },
    {
      ...base,
      formType: "personal_training",
      source: "/personal-training-interest-form",
      subject: "Postmark smoke test: personal training",
      metadata: {
        traineeType: "Adult",
        trainingGoals: "Strength and mobility",
        smallGroupInterest: "Yes",
      },
    },
    {
      ...base,
      formType: "private_event",
      source: "/events",
      subject: "Postmark smoke test: private event",
      metadata: {
        eventType: "Corporate event",
        guestCount: 12,
        preferredDate: "2026-06-15",
      },
    },
    {
      ...base,
      formType: "career_application",
      source: "/careers",
      subject: "Postmark smoke test: career application",
      metadata: {
        department: "Fitness Center",
        legalAuthorization: true,
        sponsorshipRequired: false,
      },
    },
  ];
}

async function submit(payload) {
  return await new Promise((resolve) => {
    const req = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        referer: `https://www.woodinvillesportsclub.com${payload.source}`,
        "user-agent": "wsc-postmark-smoke-test",
      },
      body: payload,
    };

    const headers = {};
    const res = {
      statusCode: 200,
      setHeader(name, value) {
        headers[name.toLowerCase()] = value;
      },
      end(body) {
        resolve({
          statusCode: this.statusCode,
          headers,
          body: parseJson(body),
        });
      },
    };

    void handleFormSubmissionRequest(req, res);
  });
}

function loadEnvironment() {
  const fileEnv = {};

  for (const fileName of [".env", ".env.local"]) {
    const filePath = path.join(PROJECT_ROOT, fileName);
    if (!fs.existsSync(filePath)) continue;
    Object.assign(fileEnv, parseEnvFile(filePath));
  }

  return {
    ...fileEnv,
    ...process.env,
  };
}

function parseEnvFile(filePath) {
  const values = {};
  const contents = fs.readFileSync(filePath, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const normalized = trimmed.startsWith("export ") ? trimmed.slice("export ".length).trim() : trimmed;
    const match = normalized.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;

    values[match[1]] = parseEnvValue(match[2]);
  }

  return values;
}

function parseEnvValue(rawValue) {
  const value = rawValue.trim();
  if (!value) return "";

  const quote = value[0];
  if ((quote === `"` || quote === "'") && value.endsWith(quote)) {
    const unquoted = value.slice(1, -1);
    return quote === `"`
      ? unquoted.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\"/g, `"`)
      : unquoted;
  }

  return value.replace(/\s+#.*$/, "").trim();
}

function parseJson(value) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return { raw: String(value ?? "") };
  }
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function printHelp() {
  console.log(`Usage:
  pnpm postmark:smoke-forms
  pnpm postmark:smoke-forms -- --to=Info@woodinvillesportsclub.com
  pnpm postmark:smoke-forms -- --deliver --form=contact
  pnpm postmark:smoke-forms -- --constant-contact --form=newsletter_signup
  pnpm postmark:smoke-forms -- --deliver

Default behavior uses Postmark's POSTMARK_API_TEST token, which validates the email API payloads without delivering messages. Use --deliver only after Postmark has approved the account and the sender is verified.
Constant Contact sync is disabled by default so test payloads do not enter the live newsletter list. Use --constant-contact only when you deliberately want to test the live Constant Contact integration.
`);
}
