import { Link, type RouteComponentProps } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { getBlogCategory, getBlogPost, getRelatedPosts } from "@/lib/blog-data";
import NotFound from "@/pages/NotFound";

function getBlogPostingSchema(post: NonNullable<ReturnType<typeof getBlogPost>>) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `https://www.woodinvillesportsclub.com${post.image}`,
    datePublished: "2026-05-13",
    dateModified: "2026-05-13",
    author: {
      "@type": "Organization",
      name: "Woodinville Sports Club",
      url: "https://www.woodinvillesportsclub.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Woodinville Sports Club",
      logo: {
        "@type": "ImageObject",
        url: "https://www.woodinvillesportsclub.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.woodinvillesportsclub.com/post/${post.slug}`,
    },
  };
}

export default function BlogPost({ params }: RouteComponentProps<{ slug: string }>) {
  const post = getBlogPost(params.slug);

  if (!post) return <NotFound />;

  const category = getBlogCategory(post.categorySlug);
  const relatedPosts = getRelatedPosts(post);
  const postPath = `/post/${post.slug}`;
  const ctaIsExternal = post.cta.href.startsWith("http");

  return (
    <div className="min-h-screen">
      <SEOHead
        title={post.seoTitle}
        description={post.description}
        path={postPath}
        image={post.image}
      />
      <StructuredData schemas={[
        getBreadcrumbSchema([
          { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
          { name: "Blog & Resources", url: "https://www.woodinvillesportsclub.com/blog" },
          { name: category?.label ?? post.category, url: `https://www.woodinvillesportsclub.com/blog/categories/${post.categorySlug}` },
          { name: post.title, url: `https://www.woodinvillesportsclub.com${postPath}` },
        ]),
        getBlogPostingSchema(post),
      ]} />

      <PageHero
        eyebrow={`${post.category} Resource`}
        headline={post.title}
        subtitle={post.excerpt}
        image={post.image}
      />

      <article className="bg-parchment px-6 lg:px-14 py-16 lg:py-20">
        <div className="max-w-[980px] mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase no-underline text-ink hover:text-volt transition-colors duration-200 mb-10"
          >
            <ArrowLeft size={14} />
            All Resources
          </Link>

          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href={`/blog/categories/${post.categorySlug}`}
              className="text-[10px] tracking-[0.18em] uppercase no-underline bg-volt text-parchment px-3 py-2"
            >
              {post.category}
            </Link>
            {post.tags.map((tag) => (
              <span key={tag} className="text-[10px] tracking-[0.14em] uppercase text-ink-mid bg-parchment-mid px-3 py-2">
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[0.7fr_1.3fr] gap-8 md:gap-12 border-y border-ink/10 py-8 mb-12">
            <div>
              <p className="text-ink-light text-[10px] tracking-[0.18em] uppercase mb-2">Updated</p>
              <p className="text-ink text-[15px]">{post.date}</p>
            </div>
            <div>
              <p className="text-ink-light text-[10px] tracking-[0.18em] uppercase mb-2">Summary</p>
              <p className="text-ink-mid text-[16px] leading-[1.8]">{post.description}</p>
            </div>
          </div>

          <div className="space-y-12">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-[clamp(25px,2.6vw,36px)] font-light tracking-[-0.02em] leading-[1.16] mb-5">
                  {section.heading}
                </h2>
                <div className="space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-ink-mid text-[17px] leading-[1.86]">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-6 space-y-3 list-none">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="text-ink text-[15px] leading-[1.7] pl-5 border-l-2 border-volt">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-14 bg-dark-bg px-7 py-8 md:px-10 md:py-10">
            <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-4">Next Step</p>
            <h2 className="text-parchment text-[clamp(24px,2.4vw,34px)] font-light tracking-[-0.02em] leading-[1.16] mb-4">
              {post.cta.text}
            </h2>
            {ctaIsExternal ? (
              <a
                href={post.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-7 py-3.5 hover:bg-parchment transition-colors duration-200"
              >
                {post.cta.label}
                <ArrowRight size={14} />
              </a>
            ) : (
              <Link
                href={post.cta.href}
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-7 py-3.5 hover:bg-parchment transition-colors duration-200"
              >
                {post.cta.label}
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="bg-parchment-mid px-6 lg:px-14 py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
              <div>
                <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Related</p>
                <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15]">
                  More {post.category.toLowerCase()} resources.
                </h2>
              </div>
              <Link
                href={`/blog/categories/${post.categorySlug}`}
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase no-underline text-ink hover:text-volt transition-colors duration-200"
              >
                View Category
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
              {relatedPosts.map((related) => (
                <article key={related.slug} className="bg-parchment p-7">
                  <p className="text-volt text-[12px] tracking-[0.18em] uppercase mb-4">
                    {related.category}
                  </p>
                  <h3 className="text-[21px] font-light tracking-[-0.02em] leading-[1.16] mb-4">
                    <Link href={`/post/${related.slug}`} className="text-ink no-underline hover:text-volt transition-colors duration-200">
                      {related.title}
                    </Link>
                  </h3>
                  <p className="text-ink-mid text-[14px] leading-[1.7] mb-6">{related.excerpt}</p>
                  <Link
                    href={`/post/${related.slug}`}
                    className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase no-underline text-ink hover:text-volt transition-colors duration-200"
                  >
                    Read Resource
                    <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
