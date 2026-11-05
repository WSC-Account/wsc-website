import fs from "node:fs";
import path from "node:path";

const publicDir = path.resolve("dist/public");

function htmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

if (!fs.existsSync(publicDir)) {
  throw new Error(`Missing built public directory at ${publicDir}`);
}

let stylesheetCount = 0;
let movedScriptCount = 0;

for (const filePath of htmlFiles(publicDir)) {
  const html = fs.readFileSync(filePath, "utf8");
  const scripts = [];
  let nextHtml = html.replace(
    /\s{4}<script type="module" crossorigin src="[^"]+"><\/script>\n/g,
    match => {
      movedScriptCount += 1;
      scripts.push(match.trim());
      return "";
    }
  );

  // The homepage now renders the real shared hero before React starts. Keep
  // its small stylesheet blocking so that useful initial HTML never flashes
  // unstyled. Other route shells keep their existing inline-style behavior.
  if (filePath !== path.join(publicDir, "index.html")) {
    nextHtml = nextHtml.replace(
      /<link\s+([^>]*?)rel="stylesheet"([^>]*?href="[^"]+\.css"[^>]*?)>/g,
      (_match, beforeRel, afterRel) => {
        stylesheetCount += 1;
        const attrs = `${beforeRel}${afterRel}`.replace(/\s+/g, " ").trim();
        const fallback = `<link rel="stylesheet" ${attrs}>`;
        return `<link rel="preload" ${attrs} as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript>${fallback}</noscript>`;
      }
    );
  }

  if (scripts.length > 0) {
    nextHtml = nextHtml.replace(
      "</body>",
      `    ${scripts.join("\n    ")}\n  </body>`
    );
  }

  fs.writeFileSync(filePath, nextHtml);
}

if (stylesheetCount === 0) {
  throw new Error("No stylesheet links found to defer in built HTML files");
}

console.log(
  `Deferred ${stylesheetCount} built stylesheet link(s) and moved ${movedScriptCount} module script(s) in ${publicDir}`
);
