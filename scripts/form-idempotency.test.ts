import assert from "node:assert/strict";
import test from "node:test";
import {
  createFormRequestCache,
  FORM_REQUEST_CACHE_KEY,
  FORM_REQUEST_TTL_MS,
  MAX_PENDING_FORM_REQUESTS,
} from "../client/src/lib/form-idempotency";

function storageFixture() {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
  return { values, storage: () => storage };
}

const body = JSON.stringify({
  email: "private@example.com",
  name: "Private Visitor",
  message: "Personal request",
  attachments: [{ contentBase64: "cHJpdmF0ZSByZXN1bWU=" }],
});

test("reloads reuse unchanged pending requests without persisting any plaintext form data", async () => {
  const fixture = storageFixture();
  const first = await createFormRequestCache(fixture).claim(
    "contact:/contact?private",
    body
  );
  const reloaded = await createFormRequestCache(fixture).claim(
    "contact:/contact?private",
    body
  );
  assert.equal(reloaded.key, first.key);
  const raw = fixture.values.get(FORM_REQUEST_CACHE_KEY)!;
  for (const privateValue of [
    "private@example.com",
    "Private Visitor",
    "Personal request",
    "cHJpdmF0ZSByZXN1bWU=",
    "/contact",
    "contact:",
  ]) {
    assert.equal(raw.includes(privateValue), false);
  }
  assert.deepEqual(Object.keys(JSON.parse(raw)[0]).sort(), [
    "createdAt",
    "expiresAt",
    "fingerprint",
    "key",
    "scopeFingerprint",
  ]);
  assert.match(first.fingerprint, /^[a-f0-9]{64}$/);
});

test("changed payloads replace the pending key for that form while other forms retain theirs", async () => {
  const fixture = storageFixture();
  const cache = createFormRequestCache(fixture);
  const original = await cache.claim("contact", body);
  const unrelated = await cache.claim("newsletter", body);
  const changed = await cache.claim("contact", `${body} `);
  assert.notEqual(changed.key, original.key);
  assert.equal((await cache.claim("newsletter", body)).key, unrelated.key);
  assert.notEqual((await cache.claim("contact", body)).key, original.key);
});

test("expiry is fixed at 24 hours and pruning survives a new document", async () => {
  const fixture = storageFixture();
  let time = 1_000_000;
  const options = { ...fixture, now: () => time };
  const original = await createFormRequestCache(options).claim("contact", body);
  time += FORM_REQUEST_TTL_MS - 1;
  const retry = await createFormRequestCache(options).claim("contact", body);
  assert.equal(retry.key, original.key);
  assert.equal(retry.expiresAt, original.expiresAt);
  time += 1;
  const expired = await createFormRequestCache(options).claim("contact", body);
  assert.notEqual(expired.key, original.key);
  assert.equal(
    JSON.parse(fixture.values.get(FORM_REQUEST_CACHE_KEY)!).length,
    1
  );
});

test("successful requests clear persistence without clearing a newer edited request", async () => {
  const fixture = storageFixture();
  const cache = createFormRequestCache(fixture);
  const original = await cache.claim("contact", body);
  const edited = await cache.claim("contact", `${body} `);
  cache.complete(original);
  assert.equal(
    (await createFormRequestCache(fixture).claim("contact", `${body} `)).key,
    edited.key
  );
  cache.complete(edited);
  assert.equal(fixture.values.has(FORM_REQUEST_CACHE_KEY), false);
  assert.notEqual(
    (await createFormRequestCache(fixture).claim("contact", `${body} `)).key,
    edited.key
  );
});

test("restricted storage access or writes retain retry keys in memory", async () => {
  for (const failure of ["get", "set"]) {
    const cache = createFormRequestCache({
      storage: () => {
        if (failure === "get") throw new Error("Storage blocked");
        return {
          getItem: () => null,
          setItem: () => {
            throw new Error("Quota exceeded");
          },
          removeItem: () => {},
        };
      },
    });
    const original = await cache.claim("contact", body);
    assert.equal((await cache.claim("contact", body)).key, original.key);
    cache.complete(original);
    assert.notEqual((await cache.claim("contact", body)).key, original.key);
  }
});

test("the cache is bounded and rejects corrupt or extra persisted fields", async () => {
  const fixture = storageFixture();
  fixture.values.set(FORM_REQUEST_CACHE_KEY, "not JSON");
  let time = 1_000;
  const cache = createFormRequestCache({ ...fixture, now: () => time++ });
  for (let i = 0; i < MAX_PENDING_FORM_REQUESTS + 3; i++)
    await cache.claim(`surface-${i}`, body);
  const entries = JSON.parse(fixture.values.get(FORM_REQUEST_CACHE_KEY)!);
  assert.equal(entries.length, MAX_PENDING_FORM_REQUESTS);
  entries[0].unwantedEmail = "private@example.com";
  fixture.values.set(FORM_REQUEST_CACHE_KEY, JSON.stringify(entries));
  await cache.claim("another-surface", body);
  assert.equal(
    fixture.values.get(FORM_REQUEST_CACHE_KEY)!.includes("private@example.com"),
    false
  );
});
