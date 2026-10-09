import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { execFile } from "node:child_process";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import ts from "typescript";
import { checkVercelBundle } from "./check-vercel-bundle.mjs";

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "wsc-bundle-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "functions/api/contact.func"), {
    recursive: true,
  });
  await mkdir(path.join(root, "functions/api/forms.func"), { recursive: true });
  return root;
}

test("the bundle guard permits runtime modules and public assets", async t => {
  const root = await fixture(t);
  await mkdir(
    path.join(root, "functions/api/forms.func/node_modules/package/data"),
    { recursive: true }
  );
  await mkdir(path.join(root, "static/images"), { recursive: true });
  const result = await checkVercelBundle(root);
  assert.deepEqual(result.violations, []);
  assert.equal(result.functions.length, 2);
});

test("the bundle guard rejects local data, env files, and reports without reading contents", async t => {
  const root = await fixture(t);
  await mkdir(path.join(root, "functions/api/forms.func/data"));
  await writeFile(
    path.join(root, "functions/api/contact.func/.env.local"),
    "fixture-only"
  );
  await mkdir(path.join(root, "static/outputs"), { recursive: true });
  const result = await checkVercelBundle(root);
  assert.deepEqual(result.violations, [
    "functions/api/contact.func/.env.local",
    "functions/api/forms.func/data",
    "static/outputs",
  ]);
});

test("the bundle guard checks symlinked function directories", async t => {
  const root = await fixture(t);
  const external = await mkdtemp(path.join(os.tmpdir(), "wsc-bundle-linked-"));
  t.after(() => rm(external, { recursive: true, force: true }));
  await mkdir(path.join(external, "data"));
  await rm(path.join(root, "functions/api/contact.func"), { recursive: true });
  await symlink(external, path.join(root, "functions/api/contact.func"));
  assert.deepEqual((await checkVercelBundle(root)).violations, [
    "functions/api/contact.func/data",
  ]);
});

test("the bundle guard refuses missing API functions or missing build output", async t => {
  const root = await fixture(t);
  await rm(path.join(root, "functions"), { recursive: true });
  assert.equal((await checkVercelBundle(root)).violations.length, 2);
  await assert.rejects(checkVercelBundle(path.join(root, "not-built")), {
    code: "ENOENT",
  });
});

test("compiled API modules load in native Node without a TypeScript import loader", async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), "wsc-api-runtime-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');
  await symlink(path.resolve("node_modules"), path.join(root, "node_modules"));
  for (const directory of ["api", "server", "shared"]) {
    await mkdir(path.join(root, directory));
    for (const name of await readdir(directory)) {
      if (!name.endsWith(".ts") || name === "index.ts") continue;
      const source = await readFile(path.join(directory, name), "utf8");
      const { outputText } = ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
      });
      await writeFile(
        path.join(root, directory, name.replace(/\.ts$/, ".js")),
        outputText
      );
    }
  }
  const { stdout } = await promisify(execFile)(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
    import assert from "node:assert/strict";
    for (const name of ["contact", "forms"]) {
      const { default: handler } = await import("./api/" + name + ".js");
      const response = { statusCode: 0, setHeader() {}, end() {} };
      await handler({ method: "OPTIONS", headers: {} }, response);
      assert.equal(response.statusCode, 204);
    }
    console.log("Both compiled API modules loaded and handled OPTIONS.");
  `,
    ],
    { cwd: root, env: { PATH: process.env.PATH, VERCEL: "1" }, timeout: 10_000 }
  );
  assert.match(stdout, /Both compiled API modules loaded/);
});
