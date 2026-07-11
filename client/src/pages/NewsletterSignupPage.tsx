import PageHero from "@/components/PageHero";
import { NewsletterSignupForm } from "@/components/InquiryForms";
import SEOHead from "@/components/SEOHead";

const HERO_IMG = "/images/wsc/contact-campus.webp";

export default function NewsletterSignupPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Newsletter Signup"
        description="Sign up for Woodinville Sports Club email updates."
        path="/newsletter-signup"
        robots="noindex, follow"
      />
      <PageHero
        eyebrow="Email Updates"
        headline="Newsletter Signup."
        subtitle="Choose the WSC updates you want to receive for tennis, golf, fitness, pickleball, summer camps, events, and club news."
        image={HERO_IMG}
      />
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[860px] mx-auto">
          <NewsletterSignupForm source="/newsletter-signup" />
        </div>
      </section>
    </div>
  );
}
