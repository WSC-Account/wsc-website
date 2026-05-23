import { Link, type RouteComponentProps } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { getBlogCategory, getPostsByCategory } from "@/lib/blog-data";
import NotFound from "@/pages/NotFound";

const CATEGORY_IMAGES: Record<string, string> = {
  golf: "/images/wsc/golf-practice-area.webp",
  tennis: "/images/wsc/tennis-courts.webp",
  summer: "/images/wsc/summer-camp.webp",
  fitness: "/images/wsc/gym-floor.webp",
  membership: "/images/wsc/campus-dome.webp",
  policies: "/images/wsc/tennis-player.webp",
};

export default function BlogCategory({ params }: RouteComponentProps<{ category: string }>) {
  const category = getBlogCategory(params.category);
  const posts = getPostsByCategory(params.category);

  if (!category) return <NotFound />;

  const title = category.seoTitle;
  const path = `/blog/categories/${category.slug}`;

  return (
    <div className="min-h-screen">
      <SEOHead
        title={title}
        description={category.description}
        path={path}
        image={CATEGORY_IMAGES[category.slug]}
      />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Blog & Resources", url: "https://www.woodinvillesportsclub.com/blog" },
        { name: `${category.label} Resources`, url: `https://www.woodinvillesportsclub.com${path}` },
      ])]} />

      <PageHero
        eyebrow={`${category.label} Resources`}
        headline={`${category.label} guides from Woodinville Sports Club.`}
        subtitle={category.description}
        image={CATEGORY_IMAGES[category.slug]}
      />

      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase no-underline text-ink hover:text-volt transition-colors duration-200 mb-10"
          >
            <ArrowLeft size={14} />
            All Resources
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[3px]">
            {posts.map((post) => (
              <article key={post.slug} className="bg-parchment-mid">
                <Link href={`/post/${post.slug}`} className="block overflow-hidden no-underline">
                  <img
                    src={post.image}
                    alt={`${post.category} resource from Woodinville Sports Club`}
                    width={640}
                    height={420}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover grayscale-[0.12]"
                  />
                </Link>
                <div className="p-7">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                    <span className="text-volt text-[12px] tracking-[0.2em] uppercase">
                      {post.category}
                    </span>
                    <span className="text-ink-light text-[12px]">{post.readTime}</span>
                  </div>
                  <h2 className="text-[22px] font-light tracking-[-0.02em] leading-[1.14] mb-4">
                    <Link href={`/post/${post.slug}`} className="text-ink no-underline hover:text-volt transition-colors duration-200">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-ink-mid text-[15px] leading-[1.74] mb-6">{post.excerpt}</p>
                  <Link
                    href={`/post/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase no-underline text-ink hover:text-volt transition-colors duration-200"
                  >
                    Read Resource
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
