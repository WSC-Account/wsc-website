import assert from "node:assert/strict";
import test from "node:test";

import { isRecoverableChunkLoadError } from "../client/src/components/ErrorBoundary";

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
