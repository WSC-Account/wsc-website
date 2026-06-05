import PageHero from "@/components/PageHero";
import { MemberCancellationForm } from "@/components/InquiryForms";
import SEOHead from "@/components/SEOHead";

const HERO_IMG = "/images/wsc/campus-dome.webp";

export default function MemberCancellationFormPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Membership Cancellation Request"
        description="Submit a Woodinville Sports Club membership cancellation request."
        path="/member-request"
      />
      <PageHero
        eyebrow="Membership Request"
        headline="Membership Cancellation Requests."
        subtitle="Send your request to the WSC team so we can review your account and follow up."
        image={HERO_IMG}
        imagePosition="center top"
        avoidHeaderCrop
      />
      <section className="bg-parchment px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[860px] mx-auto">
          <MemberCancellationForm source="/member-request" />
        </div>
      </section>
    </div>
  );
}
