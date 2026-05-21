import fs from "node:fs/promises";
import path from "node:path";
import { BLOG_CATEGORIES, BLOG_POSTS } from "../../client/src/lib/blog-data";
import { SEO } from "../../client/src/lib/seo-data";

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
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function main() {
  const lastmod = new Date().toISOString().slice(0, 10);

  const routes: SitemapRoute[] = [
    { path: SEO.home.path, changefreq: "weekly", priority: "1.0" },
    { path: SEO.tennis.path, changefreq: "monthly", priority: "0.8" },
    { path: SEO.golf.path, changefreq: "monthly", priority: "0.8" },
    { path: SEO.gym.path, changefreq: "monthly", priority: "0.8" },
    { path: SEO.pickleball.path, changefreq: "monthly", priority: "0.8" },
    { path: SEO.summer.path, changefreq: "monthly", priority: "0.8" },
    { path: SEO.membership.path, changefreq: "monthly", priority: "0.7" },
    { path: SEO.sessions.path, changefreq: "weekly", priority: "0.7" },
    { path: SEO.events.path, changefreq: "monthly", priority: "0.6" },
    { path: SEO.foodTrucks.path, changefreq: "weekly", priority: "0.5" },
    { path: SEO.careers.path, changefreq: "monthly", priority: "0.5" },
    { path: SEO.blog.path, changefreq: "weekly", priority: "0.7" },
    ...BLOG_CATEGORIES.map((category) => ({
      path: `/blog/categories/${category.slug}`,
      changefreq: "monthly" as const,
      priority: "0.6",
    })),
    ...BLOG_POSTS.map((post) => ({
      path: `/post/${post.slug}`,
      changefreq: "monthly" as const,
      priority: "0.6",
    })),
    { path: SEO.about.path, changefreq: "monthly", priority: "0.6" },
    { path: SEO.contact.path, changefreq: "monthly", priority: "0.6" },
    { path: SEO.proShop.path, changefreq: "monthly", priority: "0.7" },
    { path: SEO.faq.path, changefreq: "monthly", priority: "0.7" },
    { path: SEO.policies.path, changefreq: "monthly", priority: "0.6" },
    { path: SEO.privacy.path, changefreq: "yearly", priority: "0.3" },
    { path: SEO.accessibility.path, changefreq: "yearly", priority: "0.3" },
  ];

  const uniqueRoutes = Array.from(new Map(routes.map((route) => [route.path, route])).values());

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueRoutes
    .map(
      (route) => `  <url>
    <loc>${xmlEscape(normalizeUrl(route.path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join("\n")}\n</urlset>\n`;

  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  await fs.writeFile(path.join(PUBLIC_DIR, "robots.txt"), robots, "utf8");
  await fs.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), sitemap, "utf8");

  console.log(`Generated robots.txt and sitemap.xml with ${uniqueRoutes.length} public URL(s)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
