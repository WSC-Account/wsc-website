import fs from "node:fs/promises";
import path from "node:path";
import { BLOG_CATEGORIES, BLOG_POSTS } from "../../client/src/lib/blog-data";
import { pageRoutes } from "./route-metadata";

const BASE_URL = "https://www.woodinvillesportsclub.com";
const PUBLIC_DIR = path.resolve("client/public");

type SitemapRoute = {
  path: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
};

function normalizeUrl(routePath: string) {
  return `${BASE_URL}${routePath === "/" ? "/" : routePath}`;
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function main() {
  const lastmod = new Date().toISOString().slice(0, 10);

  const routes: SitemapRoute[] = [
    ...pageRoutes.flatMap(route => route.sitemap ? [{ path: route.path, ...route.sitemap }] : []),
    ...BLOG_CATEGORIES.map(category => ({
      path: `/blog/categories/${category.slug}`,
      changefreq: "monthly" as const,
      priority: "0.6",
    })),
    ...BLOG_POSTS.map(post => ({
      path: `/post/${post.slug}`,
      changefreq: "monthly" as const,
      priority: "0.6",
    })),
  ];

  const uniqueRoutes = Array.from(
    new Map(routes.map(route => [route.path, route])).values()
  );

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueRoutes
    .map(
      route => `  <url>
    <loc>${xmlEscape(normalizeUrl(route.path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join("\n")}\n</urlset>\n`;

  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  await fs.writeFile(path.join(PUBLIC_DIR, "robots.txt"), robots, "utf8");
  await fs.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), sitemap, "utf8");

  console.log(
    `Generated robots.txt and sitemap.xml with ${uniqueRoutes.length} public URL(s)`
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
