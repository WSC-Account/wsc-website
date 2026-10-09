import { readdir, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const excludedRoots = new Set([
  "data",
  "output",
  "outputs",
  "coverage",
  "test-results",
  "playwright-report",
  ".playwright-cli",
  ".playwright-mcp",
  ".scrape",
]);

/** Inspect filenames only: this guard never reads runtime records or credentials. */
export async function checkVercelBundle(directory = ".vercel/output") {
  const root = path.resolve(directory);
  const functions = new Set();
  const violations = [];

  async function walk(directoryPath, ancestors = new Set()) {
    const resolved = await realpath(directoryPath);
    if (ancestors.has(resolved))
      throw new Error("Build output contains a directory cycle.");
    const nextAncestors = new Set([...ancestors, resolved]);
    for (const entry of await readdir(directoryPath, { withFileTypes: true })) {
      const filePath = path.join(directoryPath, entry.name);
      const relative = path.relative(root, filePath).split(path.sep).join("/");
      const functionMatch = relative.match(
        /^functions\/(.+\.func)(?:\/(.*))?$/
      );
      if (functionMatch) functions.add(functionMatch[1]);
      const bundlePath =
        functionMatch?.[2] ?? relative.replace(/^static\//, "");
      const firstSegment = bundlePath.split("/")[0];
      if (excludedRoots.has(firstSegment) || firstSegment.startsWith(".env")) {
        violations.push(relative);
        continue;
      }
      const isDirectory =
        entry.isDirectory() ||
        (entry.isSymbolicLink() && (await stat(filePath)).isDirectory());
      if (isDirectory) await walk(filePath, nextAncestors);
    }
  }

  await walk(root);
  for (const required of ["api/contact.func", "api/forms.func"]) {
    if (!functions.has(required))
      violations.push(`Missing required function: ${required}`);
  }
  return { functions: [...functions].sort(), violations: violations.sort() };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    const result = await checkVercelBundle(process.argv[2]);
    if (result.violations.length) {
      console.error(
        "Vercel bundle check failed. Do not deploy this prebuilt output:"
      );
      for (const violation of result.violations)
        console.error(`- ${violation}`);
      process.exitCode = 1;
    } else {
      console.log(
        `Vercel bundle check passed for ${result.functions.length} functions; no local data, environment files, or report artifacts found.`
      );
    }
  } catch (error) {
    console.error(
      `Vercel bundle check failed: ${error instanceof Error ? error.message : "unable to inspect output"}`
    );
    process.exitCode = 1;
  }
}
