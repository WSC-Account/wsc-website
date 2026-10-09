import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { auditAssets, htmlImageReferences, localImageUrl } from "./asset-audit";

function fixture(t: { after: (cleanup: () => void) => void }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wsc-asset-audit-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (filename: string, content = filename) => {
    const target = path.join(root, filename);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  };
  return { root, write };
}

test("HTML inventory reads image attributes and metadata, ignoring comments and raw scripts", () => {
  const refs = htmlImageReferences(`
    <!-- <img src="/comment.webp"> -->
    <script>const markup = '<img src="/script.webp">';</script>
    <style>.unused { background: url('/style.webp'); }</style>
    <img alt="one > zero" src="/photo.webp?x=1&amp;y=2" srcset="/small.webp 400w, /large.webp 900w">
    <source srcset='/image.avif 1x, /image-2.avif 2x'>
    <link rel="preload" as="image" href="/hero.webp" imagesrcset="/hero-small.webp 400w, /hero-large.webp 900w">
    <link rel="icon" href="/icon.svg"><meta property="og:image" content="/share.webp">
    <meta name="twitter:image" content="https://www.woodinvillesportsclub.com/twitter.webp">
    <a href="/not-an-image.webp">Download</a>
  `);
  assert.deepEqual(refs, [
    "/photo.webp?x=1&y=2",
    "/small.webp",
    "/large.webp",
    "/image.avif",
    "/image-2.avif",
    "/hero.webp",
    "/hero-small.webp",
    "/hero-large.webp",
    "/icon.svg",
    "/share.webp",
    "https://www.woodinvillesportsclub.com/twitter.webp",
  ]);
  assert.equal(localImageUrl(refs[0]), "/photo.webp");
  assert.equal(localImageUrl("https://external.example/photo.webp"), null);
  assert.equal(localImageUrl("//external.example/photo.webp"), null);
  assert.equal(localImageUrl("data:image/png;base64,abc"), null);
  assert.equal(localImageUrl("/photo%20name.webp#cropped"), "/photo name.webp");
});

test("reachable source, responsive candidates, manifest, and built HTML missing images are reported", t => {
  const { root, write } = fixture(t);
  write(
    "client/src/main.tsx",
    'import "@/page"; import "./lib/responsive-image"; import "./styles.css";'
  );
  write(
    "client/src/page.tsx",
    `
    // /comment-only.webp
    const image = "/images/wsc/fixture.webp";
    const remote = "https://external.example/remote.webp";
    export const view = <img src="/missing-source.png" srcSet={"/small.png 400w, /large.png 900w"} />;
    const dynamic = \`/images/\${name}.webp\`;
  `
  );
  write(
    "client/src/lib/responsive-image.ts",
    'const dimensions = { "/registry-only.webp": { width: 900, height: 600 } };'
  );
  write(
    "client/src/styles.css",
    ".hero { background-image: url('/css.png'); }"
  );
  write(
    "client/src/unreachable.ts",
    'export const image = "/orphan-module.png";'
  );
  write(
    "shared/route-metadata.json",
    JSON.stringify({ page: { image: "/metadata.png", staticShell: true } })
  );
  write("client/public/images/wsc/fixture.webp");
  write("client/public/images/wsc/responsive/fixture-720.webp");
  write("client/public/small.png");
  write("client/public/large.png");
  write("client/public/css.png");
  write(
    "dist/public/index.html",
    '<img src="/missing-build.webp"><source srcset="/missing-built.avif 800w"><meta property="og:image" content="/built-meta.png">'
  );
  const result = auditAssets(root, true);
  assert.equal(result.buildRequiredButMissing, false);
  assert.equal(result.generatedHtmlFiles, 1);
  assert.equal(result.sourceModules, 4);
  assert.equal(result.dynamicReferences.length, 1);
  assert.match(result.dynamicReferences[0].expression, /\$\{name\}/);
  const missingSource = result.missing
    .filter(item => item.location === "source")
    .map(item => item.url);
  assert.deepEqual(
    missingSource.sort(),
    [
      "/missing-source.png",
      "/metadata.png",
      "/images/wsc/responsive/fixture-900.webp",
      "/images/wsc/responsive/fixture-1200.webp",
      "/images/wsc/responsive/fixture-720.avif",
      "/images/wsc/responsive/fixture-900.avif",
      "/images/wsc/responsive/fixture-1200.avif",
      "/images/wsc/responsive/fixture-full.avif",
    ].sort()
  );
  assert.deepEqual(
    result.missing
      .filter(item => item.location === "build")
      .map(item => item.url)
      .sort(),
    ["/built-meta.png", "/missing-build.webp", "/missing-built.avif"]
  );
});

test("inventory retains implicit favicon and reports byte-identical review candidates without deleting", t => {
  const { root, write } = fixture(t);
  write("client/src/main.tsx", 'const image = "/used.png";');
  write("client/public/used.png", "same bytes");
  write("client/public/copy.png", "same bytes");
  write("client/public/orphan.png", "different bytes");
  write("client/public/favicon.ico", "icon bytes");
  const result = auditAssets(root, true);
  assert.equal(result.buildRequiredButMissing, true);
  assert.equal(result.missing.length, 0);
  assert.deepEqual(
    result.unreferencedCandidates.map(image => image.url),
    ["/copy.png", "/orphan.png"]
  );
  assert.equal(result.duplicates.length, 1);
  assert.equal(result.duplicateBytes, Buffer.byteLength("same bytes"));
  assert.equal(
    result.unreferencedBytes,
    Buffer.byteLength("same bytesdifferent bytes")
  );
  assert.ok(fs.existsSync(path.join(root, "client/public/copy.png")));
});
