#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));

export function hasSharedFormStorage(env) {
  return [
    "FORM_REDIS_REST_URL",
    "FORM_REDIS_REST_TOKEN",
    "KV_REST_API_URL",
    "KV_REST_API_TOKEN",
  ].some(key => env[key]?.trim());
}

// Report configuration state only. Never include endpoints, tokens, or env values
// in diagnostics; this command is safe to paste into a deployment checklist.
export function inspectFormStorage(env, { requireShared = false } = {}) {
  const url = env.FORM_REDIS_REST_URL?.trim() || env.KV_REST_API_URL?.trim();
  const token =
    env.FORM_REDIS_REST_TOKEN?.trim() || env.KV_REST_API_TOKEN?.trim();
  const serverless = Boolean(env.VERCEL);
  const errors = [];
  const warnings = [];
  let mode = "local";

  if (url || token) {
    mode = "invalid";
    if (!url || !token) {
      errors.push(
        "Shared storage needs both a Redis REST URL and token; partial configuration prevents form processing."
      );
    } else {
      try {
        const parsed = new URL(url);
        if (
          parsed.protocol !== "https:" ||
          parsed.username ||
          parsed.password ||
          parsed.search ||
          parsed.hash
        ) {
          errors.push(
            "Use an HTTPS Redis REST endpoint without embedded credentials, query parameters, or a fragment."
          );
        } else {
          mode = "shared";
        }
      } catch {
        errors.push("The Redis REST endpoint is not a valid URL.");
      }
      if (/^(?:your[-_]|replace[-_]?me|placeholder)/i.test(token)) {
        mode = "invalid";
        errors.push("The Redis REST token still appears to be a placeholder.");
      }
    }
  } else {
    const message =
      "Shared storage is not configured; rate limits, request deduplication, and OAuth refresh coordination are per process.";
    (requireShared ? errors : warnings).push(message);
  }

  if (mode !== "shared") {
    warnings.push(
      serverless
        ? "Vercel JSONL files are temporary and cannot provide durable submission records."
        : "Local JSONL records require a persistent host volume; this check cannot verify that volume."
    );
    if (
      env.CONSTANT_CONTACT_CLIENT_ID?.trim() &&
      env.CONSTANT_CONTACT_CLIENT_SECRET?.trim()
    ) {
      warnings.push(
        "Rotating newsletter credentials need shared storage when multiple instances serve requests."
      );
    }
  }
  if (env.FORM_WEBHOOK_URL?.trim()) {
    warnings.push(
      "A recording webhook does not provide shared retry coordination; verify its retention and idempotency behavior separately."
    );
  }
  return { ok: errors.length === 0, mode, serverless, errors, warnings };
}

export function storageReport(result) {
  return [
    "WSC form storage configuration check (offline)",
    `[info] Storage mode: ${result.mode}; target: ${result.serverless ? "Vercel" : "standalone/local"}.`,
    ...result.errors.map(message => `[error] ${message}`),
    ...result.warnings.map(message => `[warning] ${message}`),
    ...(result.mode === "shared"
      ? ["[ok] Shared storage variables are present and structurally valid."]
      : []),
    "[info] No network request was made. Credentials, service capacity, retention, and deployed environment values have not been verified.",
  ].join("\n");
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(
      "Usage: pnpm forms:storage-check [--require-shared] [--env-file=path]\nChecks configuration offline, without printing secrets or contacting services.\nDefaults to .env and .env.local; process environment takes precedence. An explicit file replaces those defaults."
    );
    return;
  }
  if (
    args.some(
      arg => arg !== "--require-shared" && !arg.startsWith("--env-file=")
    )
  ) {
    console.error("Unknown option. Run with --help for supported options.");
    process.exitCode = 1;
    return;
  }
  const explicitFile = args
    .find(arg => arg.startsWith("--env-file="))
    ?.slice("--env-file=".length);
  if (explicitFile === "") throw new Error("Missing environment file.");
  const files = explicitFile
    ? [path.resolve(explicitFile)]
    : [".env", ".env.local"].map(file => path.join(PROJECT_ROOT, file));
  const fileEnv = {};
  for (const file of files) {
    if (existsSync(file))
      Object.assign(fileEnv, parseEnv(readFileSync(file, "utf8")));
    else if (explicitFile) throw new Error("Environment file not found.");
  }
  const result = inspectFormStorage(
    { ...fileEnv, ...process.env },
    { requireShared: args.includes("--require-shared") }
  );
  console.log(storageReport(result));
  process.exitCode = result.ok ? 0 : 1;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    main();
  } catch {
    console.error(
      "Could not read the environment configuration. Check the file path and format; no values were printed."
    );
    process.exitCode = 1;
  }
}
