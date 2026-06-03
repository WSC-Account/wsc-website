#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ServerClient } from "postmark";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
const MESSAGE_STREAM_RE = /^[A-Za-z0-9._-]{1,40}$/;

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
const sendTest = args.has("--send-test");
const useTestApiToken = args.has("--test-api-token");
const issues = [];

const configuredServerToken = clean(env.POSTMARK_SERVER_TOKEN);
const serverToken = useTestApiToken ? "POSTMARK_API_TEST" : configuredServerToken;
const formAlertTo = clean(env.FORM_ALERT_TO || env.FORM_EMAIL_TO);
const formAlertFrom = clean(env.FORM_ALERT_FROM || env.FORM_EMAIL_FROM);
const messageStream = clean(env.POSTMARK_MESSAGE_STREAM) || "outbound";
const testRecipient = clean(argValues.get("--to") || env.POSTMARK_TEST_TO);

console.log("WSC Postmark setup check");
console.log(`Loaded env files: ${loadedFilesLabel(env.__loadedFiles)}`);

if (!useTestApiToken) {
  requireConfigured("POSTMARK_SERVER_TOKEN", configuredServerToken, { secret: true });
}
requireConfigured("FORM_ALERT_TO", formAlertTo);
requireConfigured("FORM_ALERT_FROM", formAlertFrom);

const recipients = parseRecipients(formAlertTo);
const fromEmail = extractEmail(formAlertFrom);

if (!useTestApiToken && serverToken && looksLikePlaceholder(serverToken)) {
  issues.push("POSTMARK_SERVER_TOKEN still looks like a placeholder.");
}

if (formAlertTo && !recipients.length) {
  issues.push("FORM_ALERT_TO must include at least one email address.");
}

const invalidRecipients = recipients.filter((recipient) => !EMAIL_RE.test(recipient));
if (invalidRecipients.length) {
  issues.push(`FORM_ALERT_TO has invalid recipient address(es): ${invalidRecipients.join(", ")}`);
}

if (formAlertFrom && hasHeaderInjection(formAlertFrom)) {
  issues.push("FORM_ALERT_FROM cannot include line breaks.");
}

if (formAlertFrom && (!fromEmail || !EMAIL_RE.test(fromEmail))) {
  issues.push("FORM_ALERT_FROM must be an email address or display name with an email in angle brackets.");
}

if (!MESSAGE_STREAM_RE.test(messageStream)) {
  issues.push("POSTMARK_MESSAGE_STREAM must be 1-40 letters, numbers, dots, underscores, or hyphens.");
}

if (sendTest) {
  if (!testRecipient) {
    issues.push("POSTMARK_TEST_TO or --to=email@example.com is required with --send-test.");
  } else if (!EMAIL_RE.test(testRecipient)) {
    issues.push("POSTMARK_TEST_TO must be a valid email address.");
  }
}

if (issues.length) {
  for (const issue of issues) {
    console.error(`[error] ${issue}`);
  }
  process.exit(1);
}

new ServerClient(serverToken);
if (useTestApiToken) {
  console.log("[ok] Using Postmark's POSTMARK_API_TEST token. The API request will be validated but not delivered.");
} else {
  console.log(`[ok] POSTMARK_SERVER_TOKEN is set (${serverToken.length} chars).`);
}
console.log(`[ok] FORM_ALERT_TO has ${recipients.length} recipient${recipients.length === 1 ? "" : "s"}.`);
console.log(`[ok] FORM_ALERT_FROM is formatted for Postmark sender verification.`);
console.log(`[ok] POSTMARK_MESSAGE_STREAM is ${messageStream}.`);

if (!sendTest) {
  console.log("[info] Dry run only. No email was sent.");
  console.log("[info] After Postmark approves the account, run: pnpm postmark:check -- --send-test --to=you@example.com");
  process.exit(0);
}

try {
  const client = new ServerClient(serverToken);
  const result = await client.sendEmail({
    From: formAlertFrom,
    To: testRecipient,
    Subject: "WSC Postmark readiness test",
    TextBody:
      "This is a WSC website Postmark readiness test. If you received this, the website notification sender is working.",
    HtmlBody:
      "<p>This is a WSC website Postmark readiness test. If you received this, the website notification sender is working.</p>",
    ReplyTo: fromEmail,
    MessageStream: messageStream,
    Tag: "wsc-postmark-check",
    Metadata: {
      source: "scripts/check-postmark-setup.mjs",
    },
  });

  console.log(`[ok] Test email accepted by Postmark. MessageID: ${result.MessageID}`);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown Postmark error.";
  console.error(`[error] Postmark test send failed: ${message}`);
  process.exit(1);
}

function loadEnvironment() {
  const loadedFiles = [];
  const fileEnv = {};

  for (const fileName of [".env", ".env.local"]) {
    const filePath = path.join(PROJECT_ROOT, fileName);
    if (!fs.existsSync(filePath)) continue;

    Object.assign(fileEnv, parseEnvFile(filePath));
    loadedFiles.push(fileName);
  }

  return {
    ...fileEnv,
    ...process.env,
    __loadedFiles: loadedFiles,
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

function requireConfigured(key, value, options = {}) {
  if (!value) {
    issues.push(`${key} is required.`);
    return;
  }

  if (options.secret) return;

  if (looksLikePlaceholder(value)) {
    issues.push(`${key} still looks like a placeholder.`);
  }
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseRecipients(value) {
  return clean(value)
    .split(",")
    .map((recipient) => extractEmail(recipient))
    .filter(Boolean);
}

function extractEmail(value) {
  const cleanValue = clean(value);
  const match = cleanValue.match(/<([^<>]+)>/);
  return clean(match ? match[1] : cleanValue);
}

function hasHeaderInjection(value) {
  return /[\r\n]/.test(value);
}

function looksLikePlaceholder(value) {
  return /^(your-|example|changeme|todo|replace-me)/i.test(clean(value));
}

function loadedFilesLabel(files) {
  return files.length ? files.join(", ") : "none";
}

function printHelp() {
  console.log(`Usage:
  pnpm postmark:check
  pnpm postmark:check -- --send-test --test-api-token --to=Info@woodinvillesportsclub.com
  pnpm postmark:check -- --send-test --to=you@example.com

Required env:
  POSTMARK_SERVER_TOKEN
  FORM_ALERT_TO
  FORM_ALERT_FROM

Optional env:
  POSTMARK_MESSAGE_STREAM=outbound
  POSTMARK_TEST_TO=you@example.com
`);
}
