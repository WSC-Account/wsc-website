import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import SEOHead from "@/components/SEOHead";
import { useSessionCalendar } from "@/hooks/useSessionCalendar";
import { SEO } from "@/lib/seo-data";

export default function PastSummerPage({
  tournaments = false,
}: {
  tournaments?: boolean;
}) {
  const season = useSessionCalendar();
  return (
    <>
      <SEOHead {...(tournaments ? SEO.summerTennis : SEO.summer)} />
      <PageHero
        eyebrow="Summer 2026 · Completed"
        headline={
          tournaments
            ? "Summer 2026 Tournaments Have Ended"
            : "Summer 2026 Has Ended"
        }
        subtitle="Explore current programs and the published calendar for upcoming sessions."
        image="/images/wsc/campus-dome.webp"
      />
      <section className="max-w-[1440px] mx-auto px-6 lg:px-14 py-16">
        <p className="text-volt-bright text-sm mb-3">{season.badge}</p>
        <h2 className="text-3xl mb-4">{season.title}</h2>
        <p className="text-muted-foreground max-w-3xl mb-8">
          {season.description}
        </p>
        <div className="flex flex-wrap gap-6">
          <Link href="/sessions" className="text-volt-bright underline">
            View Session Calendar
          </Link>
          <Link href="/tennis" className="text-volt-bright underline">
            Tier 1 Tennis
          </Link>
          <Link href="/golf" className="text-volt-bright underline">
            Tier 1 Golf
          </Link>
        </div>
      </section>
    </>
  );
}
