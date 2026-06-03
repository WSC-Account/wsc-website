#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const API_BASE = "https://api.cc.email/v3";
const TOKEN_URL = "https://authz.constantcontact.com/oauth2/default/v1/token";
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

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
const refreshToken = args.has("--refresh-token");
const syncTest = args.has("--sync-test");
const testEmail = clean(argValues.get("--email") || env.CONSTANT_CONTACT_TEST_EMAIL);
const firstName = clean(argValues.get("--first-name") || "WSC");
const lastName = clean(argValues.get("--last-name") || "Website Test");
const listIds = parseListIds(env.CONSTANT_CONTACT_LIST_IDS || "");
const interestMap = parseInterestMap(env.CONSTANT_CONTACT_INTEREST_LIST_MAP || "");
const issues = [];

console.log("WSC Constant Contact setup check");
console.log(`Loaded env files: ${loadedFilesLabel(env.__loadedFiles)}`);

requireConfigured("CONSTANT_CONTACT_LIST_IDS", env.CONSTANT_CONTACT_LIST_IDS);

if (!env.CONSTANT_CONTACT_ACCESS_TOKEN && !(env.CONSTANT_CONTACT_CLIENT_ID && env.CONSTANT_CONTACT_CLIENT_SECRET && env.CONSTANT_CONTACT_REFRESH_TOKEN)) {
  issues.push(
    "Configure either CONSTANT_CONTACT_ACCESS_TOKEN or the OAuth refresh set: CONSTANT_CONTACT_CLIENT_ID, CONSTANT_CONTACT_CLIENT_SECRET, and CONSTANT_CONTACT_REFRESH_TOKEN.",
  );
}

if (refreshToken || !env.CONSTANT_CONTACT_ACCESS_TOKEN) {
  requireConfigured("CONSTANT_CONTACT_CLIENT_ID", env.CONSTANT_CONTACT_CLIENT_ID, { secret: true });
  requireConfigured("CONSTANT_CONTACT_CLIENT_SECRET", env.CONSTANT_CONTACT_CLIENT_SECRET, { secret: true });
  requireConfigured("CONSTANT_CONTACT_REFRESH_TOKEN", env.CONSTANT_CONTACT_REFRESH_TOKEN, { secret: true });
}

if (env.CONSTANT_CONTACT_LIST_IDS && !listIds.length) {
  issues.push("CONSTANT_CONTACT_LIST_IDS must include at least one list ID.");
}

if (env.CONSTANT_CONTACT_INTEREST_LIST_MAP && interestMap.error) {
  issues.push(interestMap.error);
}

if (syncTest) {
  if (!testEmail) {
    issues.push("CONSTANT_CONTACT_TEST_EMAIL or --email=test@example.com is required with --sync-test.");
  } else if (!EMAIL_RE.test(testEmail)) {
    issues.push("The Constant Contact sync test email must be a valid email address.");
  }
}

if (issues.length) {
  for (const issue of issues) console.error(`[error] ${issue}`);
  process.exit(1);
}

console.log(`[ok] CONSTANT_CONTACT_LIST_IDS has ${listIds.length} list ID${listIds.length === 1 ? "" : "s"}.`);
if (interestMap.map) {
  console.log(
    `[ok] CONSTANT_CONTACT_INTEREST_LIST_MAP has ${Object.keys(interestMap.map).length} interest mapping${
      Object.keys(interestMap.map).length === 1 ? "" : "s"
    }.`,
  );
}

if (!refreshToken && !syncTest) {
  console.log("[info] Dry run only. No Constant Contact API request was sent.");
  console.log("[info] To validate OAuth and cache a fresh token, run: pnpm constant-contact:check -- --refresh-token");
  console.log(
    "[info] To create or update a deliberate test contact, run: pnpm constant-contact:check -- --sync-test --email=test@example.com",
  );
  process.exit(0);
}

const accessToken = await getAccessToken({ forceRefresh: refreshToken || !env.CONSTANT_CONTACT_ACCESS_TOKEN });
console.log("[ok] Constant Contact access token is available.");

if (!syncTest) {
  process.exit(0);
}

const result = await syncTestContact(accessToken, {
  email: testEmail,
  firstName,
  lastName,
  listIds,
});

console.log(
  `[ok] Test contact was accepted by Constant Contact${result.contact_id ? ` (${result.contact_id})` : ""}.`,
);

async function getAccessToken({ forceRefresh }) {
  const cachedToken = readTokenCache();
  if (!forceRefresh && cachedToken?.accessToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  if (!forceRefresh && env.CONSTANT_CONTACT_ACCESS_TOKEN) {
    return clean(env.CONSTANT_CONTACT_ACCESS_TOKEN);
  }

  const clientId = clean(env.CONSTANT_CONTACT_CLIENT_ID);
  const clientSecret = clean(env.CONSTANT_CONTACT_CLIENT_SECRET);
  const currentRefreshToken = cachedToken?.refreshToken || clean(env.CONSTANT_CONTACT_REFRESH_TOKEN);
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    refresh_token: currentRefreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch(TOKEN_URL, {
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

  const accessToken = clean(responseBody.access_token);
  const nextRefreshToken = clean(responseBody.refresh_token) || currentRefreshToken;
  const expiresIn = typeof responseBody.expires_in === "number" ? responseBody.expires_in : 86_400;

  if (!accessToken) {
    throw new Error("Constant Contact token refresh did not return an access token.");
  }

  writeTokenCache({
    accessToken,
    refreshToken: nextRefreshToken,
    expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1_000,
  });
  console.log(`[ok] Refreshed OAuth token and wrote cache to ${path.relative(PROJECT_ROOT, tokenCachePath())}.`);

  return accessToken;
}

async function syncTestContact(accessToken, contact) {
  const response = await fetch(`${API_BASE}/contacts/sign_up_form`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      email_address: contact.email,
      first_name: contact.firstName,
      last_name: contact.lastName,
      list_memberships: contact.listIds,
    }),
  });
  const responseBody = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(`Constant Contact sync test failed: ${formatApiError(response.status, responseBody)}`);
  }

  return responseBody;
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
  if (!clean(value)) {
    issues.push(`${key} is required.`);
    return;
  }

  if (!options.secret && looksLikePlaceholder(value)) {
    issues.push(`${key} still looks like a placeholder.`);
  }
}

function parseListIds(value) {
  return clean(value)
    .split(/[,\s]+/)
    .map((listId) => clean(listId))
    .filter(Boolean);
}

function parseInterestMap(rawMap) {
  const value = clean(rawMap);
  if (!value) return { map: null };

  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { error: "CONSTANT_CONTACT_INTEREST_LIST_MAP must be a JSON object." };
    }

    const map = {};
    for (const [interest, rawListIds] of Object.entries(parsed)) {
      const ids = Array.isArray(rawListIds)
        ? rawListIds.flatMap((listId) => parseListIds(String(listId)))
        : parseListIds(String(rawListIds));

      if (clean(interest) && ids.length) map[clean(interest)] = ids;
    }

    return { map };
  } catch {
    return { error: "CONSTANT_CONTACT_INTEREST_LIST_MAP must be valid JSON." };
  }
}

function readTokenCache() {
  try {
    const parsed = JSON.parse(fs.readFileSync(tokenCachePath(), "utf8"));
    if (!parsed || typeof parsed !== "object") return null;

    const accessToken = clean(parsed.accessToken);
    const refreshToken = clean(parsed.refreshToken);
    const expiresAt = typeof parsed.expiresAt === "number" ? parsed.expiresAt : 0;

    if (!accessToken || !refreshToken || !expiresAt) return null;
    return { accessToken, refreshToken, expiresAt };
  } catch {
    return null;
  }
}

function writeTokenCache(cache) {
  const cachePath = tokenCachePath();
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, `${JSON.stringify(cache)}\n`, { encoding: "utf8", mode: 0o600 });
}

function tokenCachePath() {
  return clean(env.CONSTANT_CONTACT_TOKEN_CACHE_FILE) || path.join(PROJECT_ROOT, "data", "constant-contact-token.json");
}

async function readJsonResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : { response: parsed };
  } catch {
    return { response: text.slice(0, 500) };
  }
}

function formatApiError(status, body) {
  if (Array.isArray(body)) {
    const messages = body
      .flatMap((item) => (item && typeof item === "object" ? clean(item.error_message || item.message) : []))
      .filter(Boolean);
    if (messages.length) return `${status} ${messages.join("; ")}`;
  }

  const message = clean(body.error_description) || clean(body.error) || clean(body.message);
  if (message) return `${status} ${message}`;
  return `${status} ${JSON.stringify(body).slice(0, 500)}`;
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function looksLikePlaceholder(value) {
  return /^(your-|example|changeme|todo|replace-me)/i.test(clean(value));
}

function loadedFilesLabel(files) {
  return files.length ? files.join(", ") : "none";
}

function printHelp() {
  console.log(`Usage:
  pnpm constant-contact:check
  pnpm constant-contact:check -- --refresh-token
  pnpm constant-contact:check -- --sync-test --email=test@example.com

Required env:
  CONSTANT_CONTACT_LIST_IDS
  CONSTANT_CONTACT_ACCESS_TOKEN

Or OAuth refresh env:
  CONSTANT_CONTACT_CLIENT_ID
  CONSTANT_CONTACT_CLIENT_SECRET
  CONSTANT_CONTACT_REFRESH_TOKEN

Optional env:
  CONSTANT_CONTACT_INTEREST_LIST_MAP='{"Tennis updates":"list-id"}'
  CONSTANT_CONTACT_TOKEN_CACHE_FILE=./data/constant-contact-token.json
  CONSTANT_CONTACT_TEST_EMAIL=test@example.com

Dry run validates local configuration only. --refresh-token calls Constant Contact OAuth and writes a local token cache. --sync-test creates or updates the provided test email in the configured Constant Contact list.
`);
}
