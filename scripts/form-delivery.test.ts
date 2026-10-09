import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  createFormSubmissionHandler,
  type FormDependencies,
} from "../server/form-submissions.ts";
import {
  MemoryFormStore,
  RedisFormStore,
  type FormStore,
} from "../server/form-store.ts";
import { ProviderTimeoutError, requestJson } from "../server/form-http.ts";

const keys = [
  "VERCEL",
  "FORM_SUBMISSIONS_DIR",
  "FORM_WEBHOOK_URL",
  "POSTMARK_SERVER_TOKEN",
  "FORM_ALERT_TO",
  "FORM_EMAIL_TO",
  "FORM_ALERT_FROM",
  "FORM_EMAIL_FROM",
  "CONSTANT_CONTACT_ACCESS_TOKEN",
  "CONSTANT_CONTACT_REFRESH_TOKEN",
  "CONSTANT_CONTACT_CLIENT_ID",
  "CONSTANT_CONTACT_CLIENT_SECRET",
  "CONSTANT_CONTACT_LIST_IDS",
  "CONSTANT_CONTACT_INTEREST_LIST_MAP",
  "CONSTANT_CONTACT_TOKEN_CACHE_FILE",
];
const original = new Map(keys.map(key => [key, process.env[key]]));
let directory: string;

beforeEach(async () => {
  for (const key of keys) delete process.env[key];
  directory = await mkdtemp(path.join(tmpdir(), "wsc-delivery-test-"));
  process.env.VERCEL = "1";
  process.env.FORM_SUBMISSIONS_DIR = directory;
  process.env.POSTMARK_SERVER_TOKEN = "test-token-never-sent";
  process.env.FORM_ALERT_FROM = "website@example.test";
  process.env.FORM_ALERT_TO = "staff@example.test";
});

afterEach(async () => {
  await rm(directory, { recursive: true, force: true });
  for (const key of keys) {
    const value = original.get(key);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

const contact = {
  formType: "contact",
  source: "/contact",
  name: "Visitor",
  email: "visitor@example.test",
  message: "Membership question",
};
const newsletter = {
  formType: "newsletter_signup",
  source: "/newsletter-signup",
  email: "visitor@example.test",
};

function durableStore(): FormStore {
  const memory = new MemoryFormStore();
  return {
    durable: true,
    get: memory.get.bind(memory),
    set: memory.set.bind(memory),
    lock: memory.lock.bind(memory),
    unlock: memory.unlock.bind(memory),
    increment: memory.increment.bind(memory),
  };
}

function harness(overrides: Partial<FormDependencies> = {}) {
  let sends = 0;
  const handler = createFormSubmissionHandler({
    store: new MemoryFormStore(),
    fetch: async () => {
      throw new Error("Unexpected provider request in offline test");
    },
    sendEmail: async () => {
      sends++;
      return { MessageID: `test-email-${sends}` };
    },
    timeoutMs: 15,
    ...overrides,
  });
  return {
    sends: () => sends,
    async submit(
      body: unknown = contact,
      key = "test-idempotency-key",
      ip = "203.0.113.10"
    ) {
      let responseBody = "";
      const headers: Record<string, string> = {};
      const response = {
        statusCode: 200,
        setHeader(name: string, value: string) {
          headers[name.toLowerCase()] = value;
          return this;
        },
        end(chunk: string) {
          responseBody += chunk;
        },
      };
      const request = {
        method: "POST",
        body,
        socket: { remoteAddress: "127.0.0.1" },
        headers: { "idempotency-key": key, "x-forwarded-for": ip },
      };
      await handler(
        request as unknown as IncomingMessage,
        response as unknown as ServerResponse
      );
      return {
        status: response.statusCode,
        body: JSON.parse(responseBody),
        headers,
      };
    },
  };
}

test("serverless scratch files never support a false saved assurance", async () => {
  delete process.env.POSTMARK_SERVER_TOKEN;
  const response = await harness().submit();
  assert.equal(response.status, 502);
  assert.equal(response.body.recorded, true);
  assert.equal(response.body.durable, false);
  assert.equal(response.body.accepted, false);
  assert.match(response.body.error, /has not been delivered/);
  assert.doesNotMatch(response.body.error, /saved/);
});

test("durable storage is acknowledged even if staff email is unavailable", async () => {
  delete process.env.POSTMARK_SERVER_TOKEN;
  const store = durableStore();
  const response = await harness({ store }).submit();
  assert.equal(response.status, 502);
  assert.equal(response.body.durable, true);
  assert.equal(response.body.accepted, true);
  assert.match(response.body.error, /saved/);
  const record = await store.get<{ email: string }>(
    `submission:${response.body.id}`
  );
  assert.equal(record?.email, contact.email);
});

test("a hanging optional webhook times out without blocking staff notification", async () => {
  process.env.FORM_WEBHOOK_URL = "https://webhook.example.test/forms";
  const app = harness({
    fetch: async () => await new Promise<Response>(() => {}),
  });
  const started = Date.now();
  const response = await app.submit();
  assert.equal(response.status, 200);
  assert.equal(response.body.durable, false);
  assert.equal(app.sends(), 1);
  assert.ok(Date.now() - started < 1_000);
});

test("webhook acknowledgement is tracked independently from email failure", async () => {
  process.env.FORM_WEBHOOK_URL = "https://webhook.example.test/forms";
  delete process.env.POSTMARK_SERVER_TOKEN;
  let webhookKey = "";
  const app = harness({
    fetch: async (_url, init) => {
      webhookKey = new Headers(init?.headers).get("Idempotency-Key") || "";
      return new Response(null, { status: 204 });
    },
  });
  const response = await app.submit();
  assert.equal(response.status, 502);
  assert.equal(response.body.durable, true);
  assert.equal(webhookKey, response.body.id);
});

test("retry resumes failed webhook recording without duplicating the local record", async () => {
  process.env.FORM_WEBHOOK_URL = "https://webhook.example.test/forms";
  const webhookKeys: string[] = [];
  let emailAttempts = 0;
  const app = harness({
    fetch: async (_url, init) => {
      webhookKeys.push(new Headers(init?.headers).get("Idempotency-Key") || "");
      return new Response(null, {
        status: webhookKeys.length === 1 ? 503 : 204,
      });
    },
    sendEmail: async () => {
      if (++emailAttempts === 1)
        throw Object.assign(new Error("Unavailable"), { statusCode: 503 });
      return { MessageID: "recovered-email" };
    },
  });
  const first = await app.submit();
  assert.equal(first.status, 502);
  assert.equal(first.body.recorded, true);
  assert.equal(first.body.durable, false);
  const retry = await app.submit();
  assert.equal(retry.status, 200);
  assert.equal(retry.body.durable, true);
  assert.equal(retry.body.id, first.body.id);
  assert.deepEqual(webhookKeys, [first.body.id, first.body.id]);
  assert.equal(emailAttempts, 2);
  const replay = await app.submit();
  assert.deepEqual(replay.body, retry.body);
  assert.equal(webhookKeys.length, 2);
  assert.equal(emailAttempts, 2);
  const records = (
    await readFile(path.join(directory, "submissions.jsonl"), "utf8")
  )
    .trim()
    .split("\n");
  assert.equal(records.length, 1);
});

test("retry of a failed email preserves a confirmed webhook acknowledgement", async () => {
  process.env.FORM_WEBHOOK_URL = "https://webhook.example.test/forms";
  let webhookAttempts = 0;
  let emailAttempts = 0;
  const app = harness({
    fetch: async () => {
      webhookAttempts++;
      return new Response(null, { status: 204 });
    },
    sendEmail: async () => {
      if (++emailAttempts === 1)
        throw Object.assign(new Error("Unavailable"), { statusCode: 503 });
      return { MessageID: "recovered-email" };
    },
  });
  assert.equal((await app.submit()).status, 502);
  assert.equal((await app.submit()).status, 200);
  assert.equal(webhookAttempts, 1);
  assert.equal(emailAttempts, 2);
});

test("shared idempotency replays success across handler instances without resending", async () => {
  const store = durableStore();
  const firstApp = harness({ store });
  const secondApp = harness({ store });
  const first = await firstApp.submit();
  const retry = await secondApp.submit();
  assert.equal(first.status, 200);
  assert.deepEqual(first.body, retry.body);
  assert.equal(firstApp.sends(), 1);
  assert.equal(secondApp.sends(), 0);
  const records = (
    await readFile(path.join(directory, "submissions.jsonl"), "utf8")
  )
    .trim()
    .split("\n");
  assert.equal(records.length, 1);
  assert.equal(
    (await secondApp.submit({ ...contact, message: "Changed request" })).status,
    409
  );
});

test("an in-flight duplicate does not start a second provider request", async () => {
  let finish!: (result: { MessageID: string }) => void;
  let started!: () => void;
  const ready = new Promise<void>(resolve => {
    started = resolve;
  });
  const app = harness({
    sendEmail: async () => {
      started();
      return new Promise(resolve => {
        finish = resolve;
      });
    },
  });
  const first = app.submit();
  await ready;
  const retry = await app.submit();
  assert.equal(retry.status, 409);
  assert.equal(retry.headers["retry-after"], "3");
  finish({ MessageID: "delivered-once" });
  assert.equal((await first).status, 200);
});

test("a known provider rejection can be retried with the original request ID", async () => {
  let attempts = 0;
  const app = harness({
    sendEmail: async () => {
      if (++attempts === 1)
        throw Object.assign(new Error("Unavailable"), { statusCode: 503 });
      return { MessageID: "recovered" };
    },
  });
  const first = await app.submit();
  const retry = await app.submit();
  assert.equal(first.status, 502);
  assert.equal(first.body.retryable, true);
  assert.equal(retry.status, 200);
  assert.equal(first.body.id, retry.body.id);
  assert.equal(attempts, 2);
});

test("a lost provider response does not cause a blind duplicate on retry", async () => {
  let sends = 0;
  const app = harness({
    sendEmail: async () => {
      sends++;
      throw new Error("Connection reset after send");
    },
  });
  const first = await app.submit();
  const retry = await app.submit();
  assert.equal(first.body.emailStatus, "unknown");
  assert.equal(first.body.status, "pending");
  assert.equal(first.body.retryable, false);
  assert.match(first.body.error, /reference/);
  assert.equal(retry.body.id, first.body.id);
  assert.equal(sends, 1);
});

test("newsletter without automatic integration reports a manual request", async () => {
  const response = await harness().submit(newsletter);
  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
  assert.equal(response.body.status, "partial");
  assert.equal(response.body.emailed, true);
  assert.equal(response.body.constantContactStatus, "not_configured");
});

test("newsletter retries only the failed integration, not the successful email", async () => {
  process.env.CONSTANT_CONTACT_ACCESS_TOKEN = "offline-test-access-token";
  process.env.CONSTANT_CONTACT_LIST_IDS = "test-list";
  let attempts = 0;
  const app = harness({
    fetch: async () => {
      attempts++;
      return attempts === 1
        ? Response.json({ error: "Unavailable" }, { status: 503 })
        : Response.json({ contact_id: "test-contact", action: "updated" });
    },
  });
  const first = await app.submit(newsletter);
  const retry = await app.submit(newsletter);
  assert.equal(first.status, 502);
  assert.equal(first.body.emailed, true);
  assert.equal(retry.status, 200);
  assert.equal(retry.body.constantContactStatus, "synced");
  assert.equal(app.sends(), 1);
  assert.equal(attempts, 2);
});

test("shared token cache survives new handler instances and parses numeric string expiry", async () => {
  process.env.CONSTANT_CONTACT_CLIENT_ID = "test-client";
  process.env.CONSTANT_CONTACT_CLIENT_SECRET = "test-secret";
  process.env.CONSTANT_CONTACT_REFRESH_TOKEN = "test-original-refresh";
  process.env.CONSTANT_CONTACT_LIST_IDS = "test-list";
  const store = durableStore();
  let refreshes = 0;
  const fetchImplementation: typeof fetch = async url => {
    if (String(url).includes("/token")) {
      refreshes++;
      return Response.json({
        access_token: "new-access",
        refresh_token: "new-refresh",
        expires_in: "3600",
      });
    }
    return Response.json({ contact_id: "test-contact", action: "updated" });
  };
  assert.equal(
    (await harness({ store, fetch: fetchImplementation }).submit(newsletter))
      .status,
    200
  );
  assert.equal(
    (
      await harness({ store, fetch: fetchImplementation }).submit(
        { ...newsletter, email: "another@example.test" },
        "other-request-key"
      )
    ).status,
    200
  );
  assert.equal(refreshes, 1);
});

test("simultaneous newsletter requests cannot refresh the same OAuth token twice", async () => {
  process.env.CONSTANT_CONTACT_CLIENT_ID = "test-client";
  process.env.CONSTANT_CONTACT_CLIENT_SECRET = "test-secret";
  process.env.CONSTANT_CONTACT_REFRESH_TOKEN = "test-original-refresh";
  process.env.CONSTANT_CONTACT_LIST_IDS = "test-list";
  const store = durableStore();
  let refreshed!: (response: Response) => void;
  let started!: () => void;
  const ready = new Promise<void>(resolve => {
    started = resolve;
  });
  let refreshes = 0;
  const fetchImplementation: typeof fetch = async url => {
    if (String(url).includes("/token")) {
      refreshes++;
      started();
      return new Promise(resolve => {
        refreshed = resolve;
      });
    }
    return Response.json({ contact_id: "test-contact", action: "updated" });
  };
  const first = harness({
    store,
    fetch: fetchImplementation,
    timeoutMs: 1_000,
  }).submit(newsletter);
  await ready;
  const other = harness({ store, fetch: fetchImplementation });
  const otherPayload = { ...newsletter, email: "other@example.test" };
  const concurrent = await other.submit(otherPayload, "concurrent-request");
  assert.equal(concurrent.status, 502);
  assert.equal(concurrent.body.constantContactStatus, "failed");
  assert.equal(refreshes, 1);
  refreshed(
    Response.json({
      access_token: "new-access",
      refresh_token: "new-refresh",
      expires_in: 3600,
    })
  );
  assert.equal((await first).status, 200);
  assert.equal(
    (await other.submit(otherPayload, "concurrent-request")).status,
    200
  );
  assert.equal(refreshes, 1);
  assert.equal(other.sends(), 1);
});

test("server rate limits count requests across handlers sharing storage", async () => {
  const store = durableStore();
  for (let index = 0; index < 5; index++) {
    const response = await harness({ store }).submit(
      contact,
      `unique-request-${index}`
    );
    assert.equal(response.status, 200);
  }
  const blocked = await harness({ store }).submit(
    contact,
    "unique-request-next"
  );
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers["retry-after"], "600");
  // A retry of an existing request does not spend the email's allowance again.
  assert.equal(
    (await harness({ store }).submit(contact, "unique-request-0")).status,
    200
  );
});

test("shared storage failure prevents an uncoordinated provider send", async () => {
  const store = durableStore();
  store.increment = async () => {
    throw new Error("Storage offline");
  };
  const app = harness({ store });
  assert.equal((await app.submit()).status, 503);
  assert.equal(app.sends(), 0);
});

test("standalone clients cannot bypass the IP allowance by forging forwarding headers", async () => {
  delete process.env.VERCEL;
  const app = harness();
  for (let index = 0; index < 20; index++) {
    const response = await app.submit(
      { ...contact, email: `visitor-${index}@example.test` },
      `request-key-${index}`,
      `203.0.113.${index}`
    );
    assert.equal(response.status, 200);
  }
  const blocked = await app.submit(
    { ...contact, email: "last@example.test" },
    "blocked-request-key",
    "203.0.113.99"
  );
  assert.equal(blocked.status, 429);
  assert.equal(app.sends(), 20);
});

test("resume validation rejects executables and spoofed PDF contents", async () => {
  const application = {
    ...contact,
    formType: "career_application",
    phone: "425-555-0100",
    metadata: { department: "Tennis" },
  };
  for (const name of ["resume.exe", "resume.pdf"]) {
    const response = await harness().submit({
      ...application,
      attachments: [
        {
          name,
          contentType: "application/pdf",
          contentBase64: Buffer.from("not a resume").toString("base64"),
        },
      ],
    });
    assert.equal(response.status, 400);
  }
  const validPdf = {
    name: "resume.pdf",
    contentType: "application/octet-stream",
    contentBase64: Buffer.from("%PDF-1.7 test").toString("base64"),
  };
  assert.equal(
    (await harness().submit({ ...contact, attachments: [validPdf] })).status,
    400
  );
  assert.equal(
    (await harness().submit({ ...application, attachments: [validPdf] }))
      .status,
    200
  );
});

test("provider deadlines cover an indefinitely streaming response body", async () => {
  const fetchImplementation: typeof fetch = async () =>
    new Response(new ReadableStream({ start() {} }));
  await assert.rejects(
    requestJson("https://example.test", {}, fetchImplementation, 10),
    ProviderTimeoutError
  );
});

test("Redis REST adapter uses atomic leases and fixed-window counters", async () => {
  const commands: unknown[][] = [];
  const values = new Map<string, string>();
  const store = new RedisFormStore(
    "https://redis.example.test",
    "offline-test-token",
    async (_url, init) => {
      assert.equal(
        new Headers(init?.headers).get("Authorization"),
        "Bearer offline-test-token"
      );
      const command = JSON.parse(String(init?.body)) as Array<string | number>;
      commands.push(command);
      const [operation, key, value] = command;
      let result: unknown = null;
      if (operation === "GET") result = values.get(String(key)) ?? null;
      if (operation === "SET") {
        if (!command.includes("NX") || !values.has(String(key))) {
          values.set(String(key), String(value));
          result = "OK";
        }
      }
      if (operation === "EVAL") result = 1;
      return Response.json({ result });
    }
  );
  await store.set("attempt:1", { id: "one" }, 60);
  assert.deepEqual(await store.get("attempt:1"), { id: "one" });
  assert.equal(await store.lock("lock:1", "owner", 60), true);
  assert.equal(await store.lock("lock:1", "other-owner", 60), false);
  await store.unlock("lock:1", "owner");
  assert.equal(await store.increment("rate:1", 600), 1);
  assert.match(String(commands.at(-2)?.[1]), /GET.*ARGV\[1\].*DEL/);
  assert.match(String(commands.at(-1)?.[1]), /INCR.*EXPIRE/);
});

test("Redis SET requires an explicit acknowledgement before claiming a durable write", async () => {
  for (const result of [null, false, 1, ""]) {
    const store = new RedisFormStore(
      "https://redis.example.test",
      "offline-test-token",
      async () => Response.json({ result })
    );
    await assert.rejects(
      store.set("submission:1", { id: "one" }, 60),
      /did not acknowledge the write/
    );
  }
});
