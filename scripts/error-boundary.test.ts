import assert from "node:assert/strict";
import test from "node:test";

import { claimChunkReload, isRecoverableChunkLoadError } from "../client/src/components/ErrorBoundary";

test("chunk recovery permits one reload across document mounts and expires safely", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
  assert.equal(claimChunkReload(storage, "/faq", 1_000_000), true);
  assert.equal(claimChunkReload(storage, "/faq", 1_000_001), false);
  assert.equal(claimChunkReload(storage, "/tennis", 1_000_001), true);
  assert.equal(claimChunkReload(storage, "/faq", 1_300_001), true);
});

test("chunk recovery does not reload when the marker cannot be persisted", () => {
  assert.equal(claimChunkReload({
    getItem: () => null,
    setItem: () => { throw new Error("Storage blocked"); },
  }, "/faq"), false);
});

test("detects failed dynamic imports as recoverable chunk load errors", () => {
  assert.equal(
    isRecoverableChunkLoadError(
      new TypeError(
        "Failed to fetch dynamically imported module: https://www.woodinvillesportsclub.com/assets/Summer-eVgyob52.js",
      ),
    ),
    true,
  );
});

test("does not classify normal render errors as chunk load errors", () => {
  assert.equal(isRecoverableChunkLoadError(new Error("Cannot read properties of undefined")), false);
});
