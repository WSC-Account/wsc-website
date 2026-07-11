import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { after, before, test } from "node:test";
import type {
  IncomingHttpHeaders,
  IncomingMessage,
  ServerResponse,
} from "node:http";
import { handleFormSubmissionRequest } from "../server/form-submissions.ts";

const MANAGED_ENV_KEYS = [
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
] as const;

const originalEnv = new Map(
  MANAGED_ENV_KEYS.map(key => [key, process.env[key]])
);
let submissionsDirectory = "";

before(async () => {
  submissionsDirectory = await mkdtemp(path.join(tmpdir(), "wsc-form-tests-"));
  for (const key of MANAGED_ENV_KEYS) delete process.env[key];
  process.env.FORM_SUBMISSIONS_DIR = submissionsDirectory;
});

after(async () => {
  for (const key of MANAGED_ENV_KEYS) {
    const value = originalEnv.get(key);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  await rm(submissionsDirectory, { recursive: true, force: true });
});

class MockResponse {
  statusCode = 200;
  headers = new Map<string, string | number | readonly string[]>();
  body = "";

  setHeader(name: string, value: string | number | readonly string[]) {
    this.headers.set(name.toLowerCase(), value);
    return this;
  }

  end(chunk?: string | Buffer) {
    if (chunk) this.body += chunk.toString();
    return this;
  }

  json() {
    return this.body ? JSON.parse(this.body) : undefined;
  }
}

function requestWithBody(
  method: string,
  body?: unknown,
  headers: IncomingHttpHeaders = {}
) {
  return { method, body, headers } as IncomingMessage & { body?: unknown };
}

function requestWithRawBody(method: string, rawBody: string) {
  const request = Readable.from([rawBody]) as IncomingMessage & {
    body?: unknown;
  };
  request.method = method;
  request.headers = {};
  return request;
}

async function submit(request: IncomingMessage & { body?: unknown }) {
  const response = new MockResponse();
  await handleFormSubmissionRequest(
    request,
    response as unknown as ServerResponse
  );
  return response;
}

test("OPTIONS requests advertise supported methods without processing a form", async () => {
  const response = await submit(requestWithBody("OPTIONS"));

  assert.equal(response.statusCode, 204);
  assert.equal(response.headers.get("allow"), "POST, OPTIONS");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.body, "");
});

test("non-POST requests are rejected", async () => {
  const response = await submit(requestWithBody("GET"));

  assert.equal(response.statusCode, 405);
  assert.deepEqual(response.json(), {
    ok: false,
    error: "Method not allowed.",
  });
});

test("malformed and empty JSON bodies receive a helpful error", async () => {
  for (const rawBody of ["", "{not-json"]) {
    const response = await submit(requestWithRawBody("POST", rawBody));
    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.json(), {
      ok: false,
      error: "Please submit the form again.",
    });
  }
});

test("spam honeypot submissions appear successful but are not recorded", async () => {
  const response = await submit(
    requestWithBody("POST", {
      formType: "contact",
      source: "/contact",
      name: "Spam Bot",
      email: "bot@example.com",
      message: "Buy something",
      companyWebsite: "https://spam.example",
    })
  );

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    ok: true,
    success: true,
    recorded: false,
    emailed: false,
    emailStatus: "skipped",
  });
  await assert.rejects(
    readFile(path.join(submissionsDirectory, "submissions.jsonl"))
  );
});

test("invalid form types and email addresses are rejected before recording", async () => {
  const invalidPayloads = [
    {
      formType: "unknown",
      source: "/contact",
      name: "Visitor",
      email: "visitor@example.com",
      message: "Hello",
      expected: "Please choose a valid form.",
    },
    {
      formType: "contact",
      source: "/contact",
      name: "Visitor",
      email: "not-an-email",
      message: "Hello",
      expected: "Please enter a valid email address.",
    },
  ];

  for (const { expected, ...payload } of invalidPayloads) {
    const response = await submit(requestWithBody("POST", payload));
    assert.equal(response.statusCode, 400);
    assert.equal(response.json().error, expected);
  }
});

test("each high-information form enforces its required fields", async () => {
  const cases = [
    ["contact", {}, "Please include your name and message."],
    [
      "golf_lesson",
      { name: "Visitor" },
      "Please include your name and skill level.",
    ],
    [
      "member_cancellation",
      { name: "Visitor" },
      "Please include your contact information and cancellation details.",
    ],
    [
      "personal_training",
      { name: "Visitor" },
      "Please include your name and phone number.",
    ],
    [
      "career_application",
      { name: "Visitor", phone: "425-555-0100" },
      "Please include your contact information and department interest.",
    ],
  ] as const;

  for (const [formType, fields, expected] of cases) {
    const response = await submit(
      requestWithBody("POST", {
        formType,
        source: "/test",
        email: "visitor@example.com",
        ...fields,
      })
    );
    assert.equal(response.statusCode, 400, formType);
    assert.equal(response.json().error, expected, formType);
  }
});

test("a valid form is normalized and recorded even when email is not configured", async () => {
  const response = await submit(
    requestWithBody(
      "POST",
      {
        formType: "contact",
        source: "  /contact  ",
        name: "  Jane Visitor  ",
        email: "  JANE@EXAMPLE.COM  ",
        message: "  I would like membership information.  ",
        formName: "Contact Form",
        metadata: { campaign: "summer", ignoredObject: { unsafe: true } },
      },
      {
        "x-forwarded-for": "203.0.113.5, 10.0.0.1",
        "user-agent": "WSC test browser",
        referer: "https://example.test/contact",
      }
    )
  );

  assert.equal(response.statusCode, 502);
  assert.equal(response.json().recorded, true);
  assert.equal(response.json().emailStatus, "not_configured");

  const records = (
    await readFile(path.join(submissionsDirectory, "submissions.jsonl"), "utf8")
  )
    .trim()
    .split("\n")
    .map(line => JSON.parse(line));
  assert.equal(records.length, 1);
  assert.equal(records[0].name, "Jane Visitor");
  assert.equal(records[0].email, "jane@example.com");
  assert.equal(records[0].source, "/contact");
  assert.equal(records[0].message, "I would like membership information.");
  assert.equal(
    records[0].subject,
    "WSC Contact Form - Message from Jane Visitor"
  );
  assert.deepEqual(records[0].metadata, {
    campaign: "summer",
    formName: "Contact Form",
  });
  assert.deepEqual(records[0].request, {
    ip: "203.0.113.5",
    userAgent: "WSC test browser",
    referer: "https://example.test/contact",
  });
});

test("oversized resume attachments are rejected before recording", async () => {
  const oversizedBase64 = Buffer.alloc(2_500_001).toString("base64");
  const response = await submit(
    requestWithBody("POST", {
      formType: "career_application",
      source: "/careers",
      name: "Jane Visitor",
      email: "jane@example.com",
      phone: "425-555-0100",
      metadata: { department: "Fitness" },
      attachments: [
        {
          name: "resume.pdf",
          contentType: "application/pdf",
          contentBase64: oversizedBase64,
        },
      ],
    })
  );

  assert.equal(response.statusCode, 413);
  assert.equal(
    response.json().error,
    "Resume attachments must be smaller than 2.5 MB."
  );
});
