import fs from "node:fs/promises";
import path from "node:path";
import { BLOG_CATEGORIES, BLOG_POSTS } from "../../client/src/lib/blog-data";
import { responsiveAvifSrcSet, responsiveWebpSrcSet } from "../../client/src/lib/responsive-image";
import { SEO } from "../../client/src/lib/seo-data";

const SITE_NAME = "Woodinville Sports Club";
const BASE_URL = "https://www.woodinvillesportsclub.com";
const DIST_DIR = path.resolve("dist/public");
const DEFAULT_IMAGE = "/images/wsc/campus-dome.webp";

type StaticRoute = {
  path: string;
  title: string;
  description: string;
  image: string;
  eyebrow: string;
  headline: string;
  subtitle: string;
};

const pageImages: Record<string, string> = {
  "/": "/images/wsc/golf-range-aerial.webp",
  "/tennis": "/images/wsc/tennis-courts.webp",
  "/golf": "/images/wsc/golf-practice-area.webp",
  "/gym": "/images/wsc/gym-main.webp",
  "/pickleball": "/images/wsc/pickleball-dome.webp",
  "/summer": "/images/wsc/summer-camp.webp",
  "/membership": "/images/wsc/campus-dome.webp",
  "/sessions": "/images/wsc/campus-sunset.webp",
  "/events": "/images/wsc/contact-campus.webp",
  "/food-trucks": "/images/wsc/campus-sunset.webp",
  "/careers": "/images/wsc/apl-training.webp",
  "/blog": "/images/wsc/campus-dome.webp",
  "/about": "/images/wsc/campus-sunset.webp",
  "/contact": "/images/wsc/contact-campus.webp",
  "/pro-shop": "/images/wsc/racket-stringing.webp",
  "/policies": "/images/wsc/tennis-player.webp",
  "/privacy": "/images/wsc/campus-dome.webp",
  "/faq": "/images/wsc/campus-dome.webp",
  "/accessibility": "/images/wsc/campus-dome.webp",
};

const categoryImages: Record<string, string> = {
  golf: "/images/wsc/golf-practice-area.webp",
  tennis: "/images/wsc/tennis-courts.webp",
  summer: "/images/wsc/summer-camp.webp",
  fitness: "/images/wsc/gym-floor.webp",
  membership: "/images/wsc/campus-dome.webp",
  policies: "/images/wsc/tennis-player.webp",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absoluteUrl(value: string) {
  return value.startsWith("http") ? value : `${BASE_URL}${value}`;
}

function fullTitle(title: string) {
  return `${title} | ${SITE_NAME}`;
}

function routeOutputPath(routePath: string) {
  if (routePath === "/") return path.join(DIST_DIR, "index.html");
  if (routePath === "/404") return path.join(DIST_DIR, "404.html");
  return path.join(DIST_DIR, `${routePath.replace(/^\//, "")}.html`);
}

function staticShell(route: StaticRoute) {
  const image = escapeHtml(route.image);
  const avif = responsiveAvifSrcSet(route.image);
  const webp = responsiveWebpSrcSet(route.image);
  return `<div id="root"><section style="position:relative;min-height:100vh;background:#161310;color:#efe7d7;display:flex;align-items:flex-end;overflow:hidden;padding:150px 24px 64px;box-sizing:border-box;font-family:Inter,ui-sans-serif,system-ui,sans-serif;"><picture style="position:absolute;inset:0;display:block;"><source type="image/avif" srcset="${escapeHtml(avif ?? "")}" sizes="100vw"><source type="image/webp" srcset="${escapeHtml(webp ?? "")}" sizes="100vw"><img src="${image}" alt="${escapeHtml(route.headline)} at Woodinville Sports Club" width="1800" height="1200" loading="eager" fetchpriority="high" decoding="async" style="width:100%;height:100%;object-fit:cover;filter:saturate(.62) brightness(.46);"></picture><div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(22,19,16,.78),rgba(22,19,16,.48),rgba(22,19,16,.16));"></div><div style="position:relative;z-index:1;max-width:760px;"><p style="margin:0 0 20px;color:#83b7ff;font-size:11px;letter-spacing:.22em;text-transform:uppercase;">${escapeHtml(route.eyebrow)}</p><h1 style="margin:0 0 22px;color:#efe7d7;font-size:clamp(40px,8vw,76px);font-weight:300;line-height:1.06;letter-spacing:0;">${escapeHtml(route.headline)}</h1><p style="margin:0;max-width:560px;color:rgba(239,231,215,.82);font-size:16px;line-height:1.72;">${escapeHtml(route.subtitle)}</p></div></section></div>`;
}

function replaceMeta(html: string, route: StaticRoute) {
  const title = escapeHtml(fullTitle(route.title));
  const description = escapeHtml(route.description);
  const canonical = `${BASE_URL}${route.path === "/" ? "/" : route.path}`;
  const image = absoluteUrl(route.image);
  const avif = responsiveAvifSrcSet(route.image);
  const preloadHref = avif ? avif.split(" ")[0] : route.image;
  const preloadSrcset = avif ? ` imagesrcset="${escapeHtml(avif)}" imagesizes="100vw" type="image/avif"` : "";

  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`)
    .replace("</head>", `    <link rel="preload" as="image" href="${preloadHref}"${preloadSrcset} fetchpriority="high" />\n  </head>`)
    .replace('<div id="root"></div>', staticShell(route));
}

function baseRoutes(): StaticRoute[] {
  return Object.values(SEO).map((entry) => ({
    path: entry.path,
    title: entry.title,
    description: entry.description,
    image: pageImages[entry.path] ?? DEFAULT_IMAGE,
    eyebrow: entry.path === "/" ? "Woodinville, Washington" : entry.title,
    headline: entry.path === "/" ? "Level Up Your Game at WSC." : entry.title,
    subtitle: entry.description,
  }));
}

function blogRoutes(): StaticRoute[] {
  return [
    ...BLOG_CATEGORIES.map((category) => ({
      path: `/blog/categories/${category.slug}`,
      title: category.seoTitle,
      description: category.description,
      image: categoryImages[category.slug] ?? DEFAULT_IMAGE,
      eyebrow: "Blog Resources",
      headline: category.seoTitle,
      subtitle: category.description,
    })),
    ...BLOG_POSTS.map((post) => ({
      path: `/post/${post.slug}`,
      title: post.seoTitle,
      description: post.description,
      image: post.image,
      eyebrow: post.category,
      headline: post.title,
      subtitle: post.excerpt,
    })),
  ];
}

async function main() {
  const baseHtml = await fs.readFile(path.join(DIST_DIR, "index.html"), "utf8");
  const routes: StaticRoute[] = [
    ...baseRoutes(),
    ...blogRoutes(),
    {
      path: "/404",
      title: "Page Not Found on WSC Website",
      description:
        "The page you requested was not found. Return to WSC home, explore tennis, golf, gym, pickleball, membership, or contact the club for help now.",
      image: DEFAULT_IMAGE,
      eyebrow: "404",
      headline: "Page Not Found",
      subtitle: "Use the main navigation to return to Woodinville Sports Club programs, membership, contact information, or campus resources.",
    },
  ];

  for (const route of routes) {
    const outPath = routeOutputPath(route.path);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, replaceMeta(baseHtml, route), "utf8");
  }

  await fs.writeFile(
    path.join(DIST_DIR, "route-html-manifest.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), routes: routes.map((route) => route.path) }, null, 2)}\n`,
    "utf8",
  );

  console.log(`Generated ${routes.length} route-specific HTML shell(s)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
