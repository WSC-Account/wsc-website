import { FreeFitnessAssessmentForm } from "@/components/InquiryForms";
import ResponsiveImage from "@/components/ResponsiveImage";
import StructuredData, { getBreadcrumbSchema, getServiceSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";

const HERO_IMG = "/images/wsc/gym-main.webp";
const TRAINING_IMG = "/images/wsc/apl-training.webp";

export default function FreeFitnessAssessment() {
  return (
    <div className="min-h-screen bg-parchment">
      <SEOHead
        title="Free Fitness Assessment - Woodinville Sports Club"
        description="Book a complimentary 30-45 minute fitness assessment with a certified WSC strength and conditioning coach. No commitment required."
        path="/free-fitness-assessment"
      />
      <StructuredData schemas={[
        getBreadcrumbSchema([
          { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
          { name: "Free Fitness Assessment", url: "https://www.woodinvillesportsclub.com/free-fitness-assessment" },
        ]),
        getServiceSchema({
          name: "Free Fitness Assessment",
          description: "Complimentary 30-45 minute fitness assessment with a certified WSC strength and conditioning coach.",
          url: "https://www.woodinvillesportsclub.com/free-fitness-assessment",
          serviceType: "Fitness assessment and strength and conditioning consultation",
          image: HERO_IMG,
          audience: "Adults, athletes, and families interested in coached fitness at Woodinville Sports Club",
        }),
      ]} />

      <section className="relative overflow-hidden bg-dark-bg px-6 py-[132px] text-parchment lg:px-14 lg:py-[150px]">
        <ResponsiveImage
          src={HERO_IMG}
          alt="Woodinville Sports Club fitness training space"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover saturate-[0.7] brightness-[0.42]"
          style={{ objectPosition: "center 54%" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,19,16,0.86),rgba(22,19,16,0.68),rgba(22,19,16,0.34))]" />
        <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_0.82fr] lg:gap-16 lg:items-start">
          <div className="max-w-[680px]">
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt-bright">Woodinville Sports Club</p>
            <h1 className="mb-6 text-[clamp(38px,6vw,72px)] font-light leading-[1.05] tracking-[-0.02em]">
              Free Fitness Assessment - WSC
            </h1>
            <p className="mb-8 max-w-[600px] text-[17px] leading-[1.75] text-parchment/84">
              Interested in a complimentary 30-45 minute fitness assessment with one of our certified S&C coaches? Fill out this form and we'll reach out within 2 business days to schedule your session. No commitment required.
            </p>
            <div className="grid max-w-[720px] grid-cols-1 gap-[3px] sm:grid-cols-3">
              {["Complimentary assessment", "Certified S&C coaches", "No commitment required"].map((item) => (
                <div key={item} className="bg-white/[0.07] p-5 backdrop-blur-sm">
                  <p className="text-[12px] uppercase tracking-[0.14em] leading-[1.45] text-parchment/82">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-parchment p-6 text-ink shadow-2xl lg:p-8">
            <p className="mb-2 text-[13px] uppercase tracking-[0.22em] text-volt">Request Your Assessment</p>
            <p className="mb-6 text-[12px] leading-[1.6] text-ink-light">* Indicates required question</p>
            <FreeFitnessAssessmentForm source="/free-fitness-assessment" />
          </div>
        </div>
      </section>

      <section className="bg-parchment px-6 py-20 lg:px-14 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:items-center">
          <div>
            <p className="mb-5 text-[13px] uppercase tracking-[0.22em] text-volt">What To Expect</p>
            <h2 className="mb-6 text-[clamp(26px,3vw,42px)] font-light leading-[1.12] tracking-[-0.02em]">
              A coach-led starting point for your training.
            </h2>
            <p className="text-[16px] leading-[1.78] text-ink-mid">
              Your assessment helps the WSC team understand your goals, schedule, and training needs before matching you with the right next step.
            </p>
          </div>
          <ResponsiveImage
            src={TRAINING_IMG}
            alt="Athletes training in the Athletic Performance Lab at Woodinville Sports Club"
            loading="lazy"
            className="aspect-[16/10] w-full object-cover brightness-[0.82] saturate-[0.82]"
          />
        </div>
      </section>
    </div>
  );
}
