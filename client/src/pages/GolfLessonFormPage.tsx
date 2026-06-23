import PageHero from "@/components/PageHero";
import { GolfLessonInquiryForm } from "@/components/InquiryForms";
import SEOHead from "@/components/SEOHead";

const HERO_IMG = "/images/wsc/swing-lab-simulators.webp";

export default function GolfLessonFormPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Golf Lessons Inquiry"
        description="Request a golf lesson or golf assessment at Woodinville Sports Club."
        path="/golf-coaching"
      />
      <PageHero
        eyebrow="Golf Lessons"
        headline="Golf Lessons Inquiry."
        subtitle="Share your skill level, goals, and contact details so WSC golf staff can match you with the right lesson path."
        image={HERO_IMG}
      />
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[860px] mx-auto">
          <div className="mb-8 border border-volt-bright/25 bg-volt-bright/[0.08] px-5 py-4">
            <p className="text-parchment/82 text-[13px] leading-[1.7]">
              Private golf lessons require an active membership with class registration privileges or a Class Registration Pass before booking.
            </p>
          </div>
          <GolfLessonInquiryForm source="/golf-coaching" />
        </div>
      </section>
    </div>
  );
}
