import PageHero from "@/components/PageHero";
import { PersonalTrainingRequestForm } from "@/components/InquiryForms";
import SEOHead from "@/components/SEOHead";

const HERO_IMG = "/images/wsc/apl-training.webp";

export default function PersonalTrainingFormPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Personal Training Request"
        description="Request personal training at Woodinville Sports Club."
        path="/personal-training-interest-form"
      />
      <PageHero
        eyebrow="Personal Training"
        headline="Personal Training Interest Form."
        subtitle="Tell us about your goals, schedule, and training needs so the WSC team can follow up."
        image={HERO_IMG}
      />
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[920px] mx-auto">
          <PersonalTrainingRequestForm source="/personal-training-interest-form" />
        </div>
      </section>
    </div>
  );
}
