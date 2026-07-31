import PageHero from "@/components/PageHero";
import { MemberCancellationForm } from "@/components/InquiryForms";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";

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
          <div className="mb-8 border border-wsc-border bg-parchment-mid p-6 lg:p-7">
            <p className="text-volt text-[12px] tracking-[0.18em] uppercase mb-3">
              Before You Submit
            </p>
            <p className="text-ink-mid text-[15px] leading-[1.75] mb-4">
              Please review the membership policies for cancellation notice, billing timing, freezes, guest access, and account terms before submitting your request.
            </p>
            <Link
              href="/policies/membership-policies-expanded"
              className="inline-flex text-[12px] tracking-[0.14em] uppercase text-volt no-underline border-b border-volt pb-1 hover:text-ink transition-colors duration-200"
            >
              Review Membership Policies
            </Link>
          </div>
          <MemberCancellationForm source="/member-request" />
        </div>
      </section>
    </div>
  );
}
