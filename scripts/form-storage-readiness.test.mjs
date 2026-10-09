import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { inspectFormStorage, storageReport } from "./check-form-storage.mjs";

test("an absent shared store warns locally and fails a required shared-store gate", () => {
  const local = inspectFormStorage({});
  assert.equal(local.ok, true);
  assert.equal(local.mode, "local");
  const release = inspectFormStorage({ VERCEL: "1" }, { requireShared: true });
  assert.equal(release.ok, false);
  assert.ok(release.warnings.some(message => message.includes("temporary")));
});

test("partial, malformed, and insecure storage settings fail without exposing values", () => {
  for (const env of [
    { FORM_REDIS_REST_TOKEN: "test-secret-do-not-print" },
    {
      FORM_REDIS_REST_URL: "not-a-url",
      FORM_REDIS_REST_TOKEN: "test-secret-do-not-print",
    },
    {
      FORM_REDIS_REST_URL: "http://example.invalid",
      FORM_REDIS_REST_TOKEN: "test-secret-do-not-print",
    },
    {
      FORM_REDIS_REST_URL:
        "https://user:test-secret-do-not-print@example.invalid",
      FORM_REDIS_REST_TOKEN: "test-secret-do-not-print",
    },
    {
      FORM_REDIS_REST_URL:
        "https://example.invalid?token=test-secret-do-not-print",
      FORM_REDIS_REST_TOKEN: "test-secret-do-not-print",
    },
    {
      FORM_REDIS_REST_URL: "https://example.invalid",
      FORM_REDIS_REST_TOKEN: "your-token",
    },
  ]) {
    const result = inspectFormStorage(env);
    assert.equal(result.ok, false);
    assert.equal(result.mode, "invalid");
    assert.doesNotMatch(
      storageReport(result),
      /test-secret-do-not-print|example\.invalid|your-token/
    );
  }
});

test("KV aliases and primary-variable precedence match runtime configuration", () => {
  assert.equal(
    inspectFormStorage({
      KV_REST_API_URL: "https://example.invalid",
      KV_REST_API_TOKEN: "valid-test-token",
    }).mode,
    "shared"
  );
  const primary = inspectFormStorage({
    FORM_REDIS_REST_URL: "http://invalid.example",
    FORM_REDIS_REST_TOKEN: "valid-test-token",
    KV_REST_API_URL: "https://example.invalid",
    KV_REST_API_TOKEN: "valid-fallback-token",
  });
  assert.equal(primary.ok, false);
  assert.match(
    storageReport(
      inspectFormStorage({
        FORM_WEBHOOK_URL: "https://private.example/webhook",
      })
    ),
    /does not provide shared retry coordination/
  );
});

test("isolated newsletter utilities cannot rotate shared credentials through a local cache", () => {
  const denyNetwork =
    "data:text/javascript," +
    encodeURIComponent(`
    import http from 'node:http'; import https from 'node:https';
    const deny = () => { throw new Error('Unexpected network request'); };
    globalThis.fetch = deny; http.request = deny; https.request = deny; http.get = deny; https.get = deny;
  `);
  for (const [script, flag] of [
    ["./check-constant-contact-setup.mjs", "--refresh-token"],
    ["./check-constant-contact-setup.mjs", "--sync-test"],
    ["./smoke-test-form-delivery.mjs", "--constant-contact"],
    ["./smoke-test-form-delivery.mjs", "--sync-constant-contact"],
  ]) {
    const result = spawnSync(
      process.execPath,
      [
        "--import",
        "tsx",
        "--import",
        denyNetwork,
        fileURLToPath(new URL(script, import.meta.url)),
        flag,
      ],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          FORM_REDIS_REST_URL: "https://example.invalid",
          FORM_REDIS_REST_TOKEN: "secret-must-stay-hidden",
        },
      }
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /cannot coordinate shared credentials/);
    assert.doesNotMatch(
      result.stdout + result.stderr,
      /secret-must-stay-hidden|Unexpected network request/
    );
  }
});
