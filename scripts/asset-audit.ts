import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import postcss from "postcss";
import {
  responsiveAvifSrcSet,
  responsiveWebpSrcSet,
} from "../client/src/lib/responsive-image";

const DEFAULT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const SITE_ORIGIN = "https://www.woodinvillesportsclub.com";
const IMAGE_EXTENSION = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i;

function walk(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(filename) : [filename];
  });
}

export function localImageUrl(value: string) {
  if (!value.startsWith("/") && !value.startsWith("https://")) return null;
  try {
    const url = new URL(value, SITE_ORIGIN);
    if (url.origin !== SITE_ORIGIN || !IMAGE_EXTENSION.test(url.pathname))
      return null;
    return decodeURIComponent(url.pathname);
  } catch {
    return null;
  }
}

const decodeAttribute = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const srcSetUrls = (value: string) =>
  value
    .split(",")
    .map(candidate => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);

/** Read attributes structurally, including quoted '>' characters; ignore raw script/style content. */
export function htmlImageReferences(html: string): string[] {
  const references: string[] = [];
  let cursor = 0;
  while ((cursor = html.indexOf("<", cursor)) !== -1) {
    if (html.startsWith("<!--", cursor)) {
      const end = html.indexOf("-->", cursor + 4);
      cursor = end === -1 ? html.length : end + 3;
      continue;
    }
    const match = /^<([a-z][a-z0-9:-]*)\b/i.exec(html.slice(cursor));
    if (!match) {
      cursor++;
      continue;
    }
    const tag = match[1].toLowerCase();
    cursor += match[0].length;
    const attributes: Record<string, string> = {};
    while (cursor < html.length && html[cursor] !== ">") {
      if (/\s|\//.test(html[cursor])) {
        cursor++;
        continue;
      }
      const start = cursor;
      while (cursor < html.length && !/[\s=>]/.test(html[cursor])) cursor++;
      const name = html.slice(start, cursor).toLowerCase();
      while (/\s/.test(html[cursor] ?? "")) cursor++;
      let value = "";
      if (html[cursor] === "=") {
        cursor++;
        while (/\s/.test(html[cursor] ?? "")) cursor++;
        const quote =
          html[cursor] === '"' || html[cursor] === "'" ? html[cursor++] : "";
        const valueStart = cursor;
        while (
          cursor < html.length &&
          (quote ? html[cursor] !== quote : !/[\s>]/.test(html[cursor]))
        )
          cursor++;
        value = html.slice(valueStart, cursor);
        if (quote && html[cursor] === quote) cursor++;
      }
      if (name) attributes[name] = decodeAttribute(value);
      if (cursor === start) cursor++; // Keep malformed attributes from stalling the inventory.
    }
    cursor++;
    if (tag === "script" || tag === "style") {
      const end = html.toLowerCase().indexOf(`</${tag}`, cursor);
      cursor = end === -1 ? html.length : end;
      continue;
    }
    if (tag === "img" || tag === "source") {
      if (attributes.src) references.push(attributes.src);
      if (attributes.srcset) references.push(...srcSetUrls(attributes.srcset));
    } else if (
      tag === "link" &&
      (attributes.as === "image" || attributes.rel?.includes("icon"))
    ) {
      if (attributes.href) references.push(attributes.href);
      if (attributes.imagesrcset)
        references.push(...srcSetUrls(attributes.imagesrcset));
    } else if (
      tag === "meta" &&
      /^(?:og:image|twitter:image)$/.test(
        attributes.property || attributes.name || ""
      )
    ) {
      if (attributes.content) references.push(attributes.content);
    }
  }
  return references;
}

export function auditAssets(root = DEFAULT_ROOT, requireBuild = false) {
  const publicDirectory = path.join(root, "client/public");
  const buildDirectory = path.join(root, "dist/public");
  const references = new Map<string, Set<string>>();
  const buildReferences = new Map<string, Set<string>>();
  const dynamicReferences: {
    file: string;
    line: number;
    expression: string;
  }[] = [];
  const sourceFiles = new Set<string>();
  const add = (value: string, origin: string, built = false) => {
    const url = localImageUrl(value);
    if (!url) return;
    const collection = built ? buildReferences : references;
    if (!collection.has(url)) collection.set(url, new Set());
    collection.get(url)!.add(origin);
  };
  const compilerOptions: ts.CompilerOptions = {
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
    baseUrl: root,
    paths: { "@/*": ["client/src/*"], "@shared/*": ["shared/*"] },
    allowJs: true,
    resolveJsonModule: true,
  };
  const queue = [
    "client/src/main.tsx",
    "scripts/seo-audit/generate-static-route-html.ts",
    "scripts/seo-audit/generate-public-seo-files.ts",
  ]
    .map(filename => path.join(root, filename))
    .filter(filename => fs.existsSync(filename));
  const enqueue = (specifier: string, containingFile: string) => {
    const resolved = ts.resolveModuleName(
      specifier,
      containingFile,
      compilerOptions,
      ts.sys
    ).resolvedModule?.resolvedFileName;
    const relativeFile = specifier.startsWith(".")
      ? path.resolve(path.dirname(containingFile), specifier)
      : "";
    const filename =
      resolved || (fs.existsSync(relativeFile) ? relativeFile : "");
    if (
      filename.startsWith(`${root}${path.sep}`) &&
      !filename.includes(`${path.sep}node_modules${path.sep}`)
    )
      queue.push(filename);
  };

  while (queue.length) {
    const filename = queue.pop()!;
    if (sourceFiles.has(filename)) continue;
    sourceFiles.add(filename);
    const relative = path.relative(root, filename);
    const source = fs.readFileSync(filename, "utf8");
    if (filename.endsWith(".css")) {
      postcss.parse(source).walkDecls(declaration => {
        for (const match of declaration.value.matchAll(
          /url\(\s*(["']?)(.*?)\1\s*\)/g
        ))
          add(match[2], relative);
      });
      continue;
    }
    if (filename.endsWith(".json")) {
      const values = (value: unknown) => {
        if (typeof value === "string") add(value, relative);
        else if (value && typeof value === "object")
          Object.values(value).forEach(values);
      };
      values(JSON.parse(source));
      continue;
    }
    const tree = ts.createSourceFile(
      filename,
      source,
      ts.ScriptTarget.Latest,
      true
    );
    const visit = (node: ts.Node) => {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        enqueue(node.moduleSpecifier.text, filename);
      }
      if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          (ts.isIdentifier(node.expression) &&
            node.expression.text === "require"))
      ) {
        if (node.arguments[0] && ts.isStringLiteral(node.arguments[0]))
          enqueue(node.arguments[0].text, filename);
      }
      if (ts.isStringLiteralLike(node)) {
        // A dimensions-registry key describes an image but is not a rendered reference.
        const propertyName =
          ts.isPropertyAssignment(node.parent) && node.parent.name === node;
        const origin = `${relative}:${tree.getLineAndCharacterOfPosition(node.getStart()).line + 1}`;
        if (
          !(propertyName && relative === "client/src/lib/responsive-image.ts")
        )
          add(node.text, origin);
        const attribute = ts.isJsxExpression(node.parent)
          ? node.parent.parent
          : node.parent;
        const name = ts.isJsxAttribute(attribute)
          ? attribute.name.getText()
          : ts.isPropertyAssignment(attribute)
            ? attribute.name.getText().replace(/["']/g, "")
            : "";
        if (/^(?:srcset|imagesrcset)$/i.test(name))
          for (const value of srcSetUrls(node.text)) add(value, origin);
      }
      if (
        ts.isTemplateExpression(node) &&
        node.head.text.includes("/images/") &&
        relative !== "client/src/lib/responsive-image.ts"
      ) {
        dynamicReferences.push({
          file: relative,
          line: tree.getLineAndCharacterOfPosition(node.getStart()).line + 1,
          expression: node.getText().slice(0, 180),
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(tree);
  }

  const manifestFile = path.join(root, "shared/route-metadata.json");
  if (fs.existsSync(manifestFile)) {
    for (const entry of Object.values(
      JSON.parse(fs.readFileSync(manifestFile, "utf8"))
    ) as { image?: string; staticShell?: boolean }[]) {
      if (entry.staticShell && entry.image)
        add(entry.image, "shared/route-metadata.json");
    }
  }
  const sourceHtml = path.join(root, "client/index.html");
  if (fs.existsSync(sourceHtml))
    for (const value of htmlImageReferences(
      fs.readFileSync(sourceHtml, "utf8")
    ))
      add(value, "client/index.html");
  // Browsers and external clients may request the conventional favicon without an HTML reference.
  if (fs.existsSync(path.join(publicDirectory, "favicon.ico")))
    add("/favicon.ico", "implicit browser favicon endpoint");

  // Use the application's actual candidate selection, including portrait widths and duplicate-width removal.
  for (const url of [...references.keys()]) {
    if (!/^\/images\/wsc\/[^/]+\.webp$/.test(url)) continue;
    for (const srcset of [
      responsiveWebpSrcSet(url),
      responsiveAvifSrcSet(url),
    ]) {
      for (const variant of srcSetUrls(srcset || ""))
        add(variant, `responsive variants of ${url}`);
    }
  }
  const htmlFiles = walk(buildDirectory).filter(filename =>
    filename.endsWith(".html")
  );
  for (const filename of htmlFiles) {
    for (const value of htmlImageReferences(fs.readFileSync(filename, "utf8")))
      add(value, path.relative(root, filename), true);
  }
  const missing = [
    ...[...references]
      .filter(([url]) => !fs.existsSync(path.join(publicDirectory, url)))
      .map(([url, from]) => ({ url, location: "source", from: [...from] })),
    ...[...buildReferences]
      .filter(([url]) => !fs.existsSync(path.join(buildDirectory, url)))
      .map(([url, from]) => ({ url, location: "build", from: [...from] })),
  ];
  const images = walk(publicDirectory)
    .filter(filename => IMAGE_EXTENSION.test(filename))
    .map(filename => ({
      url: `/${path.relative(publicDirectory, filename).split(path.sep).join("/")}`,
      bytes: fs.statSync(filename).size,
      hash: createHash("sha256")
        .update(fs.readFileSync(filename))
        .digest("hex"),
    }));
  const hashes = new Map<string, typeof images>();
  for (const image of images)
    hashes.set(image.hash, [...(hashes.get(image.hash) || []), image]);
  const duplicates = [...hashes.values()]
    .filter(group => group.length > 1)
    .map(group => ({
      urls: group.map(image => image.url),
      redundantBytes: group[0].bytes * (group.length - 1),
    }));
  const unreferencedCandidates = images
    .filter(
      image => !references.has(image.url) && !buildReferences.has(image.url)
    )
    .map(({ url, bytes }) => ({ url, bytes }));
  return {
    generatedAt: new Date().toISOString(),
    sourceModules: sourceFiles.size,
    generatedHtmlFiles: htmlFiles.length,
    buildRequiredButMissing: requireBuild && htmlFiles.length === 0,
    missing,
    dynamicReferences,
    imageCount: images.length,
    imageBytes: images.reduce((sum, image) => sum + image.bytes, 0),
    unreferencedCandidates,
    unreferencedBytes: unreferencedCandidates.reduce(
      (sum, image) => sum + image.bytes,
      0
    ),
    duplicates,
    duplicateBytes: duplicates.reduce(
      (sum, group) => sum + group.redundantBytes,
      0
    ),
    notes: [
      "Unreferenced URLs are review candidates, not safe deletions: external consumers are not observable locally.",
      "Responsive candidates are conservatively retained for every referenced WSC WebP image, even when a caller uses a plain img.",
      "Dynamic references are listed for manual review. JavaScript execution, externally supplied URLs, and remote assets are not validated.",
      "Built HTML is checked when available; run after a fresh build for release validation. Built bundles are not executed.",
      "Unused and duplicate byte totals overlap and must not be added.",
    ],
  };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log(
      "tsx scripts/asset-audit.ts [--check] [--require-build] [--report=output/asset-audit.json]\nChecks local source/manifest/responsive/build image references. Never deletes files or calls external services."
    );
  } else {
    if (
      args.some(
        arg =>
          !["--check", "--require-build"].includes(arg) &&
          !arg.startsWith("--report=")
      ) ||
      args.includes("--report=")
    ) {
      console.error(
        "Unknown or empty option. Run with --help for supported options."
      );
      process.exitCode = 1;
    } else {
      const result = auditAssets(
        DEFAULT_ROOT,
        args.includes("--require-build")
      );
      const reportPath = args
        .find(arg => arg.startsWith("--report="))
        ?.slice("--report=".length);
      if (reportPath) {
        fs.mkdirSync(path.dirname(path.resolve(reportPath)), {
          recursive: true,
        });
        fs.writeFileSync(reportPath, `${JSON.stringify(result, null, 2)}\n`);
      }
      console.log(
        `Asset check: ${result.imageCount} public images; ${result.sourceModules} source modules; ${result.generatedHtmlFiles} built HTML files; ${result.missing.length} missing references.`
      );
      console.log(
        `Review candidates: ${result.unreferencedCandidates.length} unreferenced images (${result.unreferencedBytes} bytes); ${result.duplicates.length} duplicate groups (${result.duplicateBytes} redundant bytes). Totals overlap.`
      );
      if (result.dynamicReferences.length) {
        console.warn(
          `${result.dynamicReferences.length} dynamic image expression(s) need manual review:`
        );
        for (const item of result.dynamicReferences)
          console.warn(
            `[dynamic] ${item.file}:${item.line} ${item.expression}`
          );
      }
      for (const item of result.missing)
        console.error(
          `[missing ${item.location}] ${item.url} from ${item.from.join(", ")}`
        );
      if (result.buildRequiredButMissing)
        console.error(
          "[missing build] Run pnpm build before release asset validation."
        );
      if (result.missing.length || result.buildRequiredButMissing)
        process.exitCode = 1;
    }
  }
}
