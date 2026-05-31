import { Link } from "wouter";
import { ArrowRight, BookOpen } from "lucide-react";
import PageHero from "@/components/PageHero";
import ResponsiveImage from "@/components/ResponsiveImage";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";
import { BLOG_CATEGORIES, BLOG_POSTS, type BlogPost } from "@/lib/blog-data";

const HERO_IMG = "/images/wsc/campus-sunset.webp";

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <article className={`bg-parchment-mid ${featured ? "grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]" : ""}`}>
      <Link href={`/post/${post.slug}`} className="block overflow-hidden no-underline">
        <ResponsiveImage
          src={post.image}
          alt={`${post.category} resource from Woodinville Sports Club`}
          loading="lazy"
          className={`w-full object-cover grayscale-[0.12] ${featured ? "h-full min-h-[320px]" : "aspect-[16/10]"}`}
        />
      </Link>
      <div className={featured ? "p-8 lg:p-12 flex flex-col justify-center" : "p-7"}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
          <Link
            href={`/blog/categories/${post.categorySlug}`}
            className="text-volt text-[12px] tracking-[0.2em] uppercase no-underline hover:text-ink transition-colors duration-200"
          >
            {post.category}
          </Link>
          <span className="text-ink-light text-[12px]">{post.readTime}</span>
        </div>
        <h2 className={`${featured ? "text-[clamp(28px,3vw,42px)]" : "text-[22px]"} font-light tracking-[-0.02em] leading-[1.14] mb-4`}>
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
  );
}

export default function Blog() {
  const [featuredPost, ...otherPosts] = BLOG_POSTS;

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.blog} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Blog & Resources", url: "https://www.woodinvillesportsclub.com/blog" },
      ])]} />

      <PageHero
        eyebrow="Blog & Resources"
        headline="Guides for training, booking, camps, and club life."
        subtitle="Helpful WSC resources for members, families, golfers, tennis players, and neighbors around the Eastside."
        image={HERO_IMG}
      />

      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-10 lg:gap-16 items-start mb-14">
            <div>
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Resource Library</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-6">
                Practical answers from the WSC campus.
              </h2>
              <p className="text-ink-mid text-[16px] leading-[1.82]">
                These articles preserve the useful local guides from the former site and refresh them for the custom WSC experience.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[3px]">
              {BLOG_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/categories/${category.slug}`}
                  className="bg-parchment-mid p-6 no-underline hover:bg-white transition-colors duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen size={17} className="text-volt" />
                    <h3 className="text-ink text-[17px] font-light tracking-[-0.01em]">{category.label}</h3>
                  </div>
                  <p className="text-ink-mid text-[13px] leading-[1.65]">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <BlogCard post={featuredPost} featured />
        </div>
      </section>

      <section className="bg-parchment-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
            <div>
              <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">All Resources</p>
              <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
                Latest WSC guides.
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase no-underline text-ink hover:text-volt transition-colors duration-200"
            >
              Ask a Question
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[3px]">
            {otherPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
