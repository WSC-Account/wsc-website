import { Link } from "wouter";
import { Dumbbell, Flag, GraduationCap, Megaphone, Send, Trophy } from "lucide-react";
import PageHero from "@/components/PageHero";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";

const HERO_IMG = "/images/wsc/apl-training.webp";

const departments = [
  {
    icon: Trophy,
    name: "Tennis",
    roles: "Teaching professionals, assistant instructors, and tournament coordinators.",
    mission: "High-quality instruction and skill development at every level, with social and competitive opportunities in a welcoming tennis environment.",
  },
  {
    icon: Megaphone,
    name: "Operations",
    roles: "Front desk, IT services, human resources, accounting, membership sales, and marketing.",
    mission: "Clean, friendly, community-forward service that keeps the campus running and helps members feel informed and supported.",
  },
  {
    icon: GraduationCap,
    name: "Camps & Youth Activities",
    roles: "Camp counselors, academic enrichment, after-school classes, community outreach, and day-care.",
    mission: "Safe, fun, educational programming that supports physical, academic, and social growth for families.",
  },
  {
    icon: Dumbbell,
    name: "Fitness",
    roles: "Fitness instructors, personal trainers, physical therapy, massage therapy, nutrition, and mental performance.",
    mission: "Personalized wellness, mobility, longevity, and athletic development in a supportive performance environment.",
  },
  {
    icon: Flag,
    name: "Golf",
    roles: "Teaching professionals, assistant instructors, and grounds and maintenance.",
    mission: "High-quality golf instruction and skill development for players of every level, from social players to competitive athletes.",
  },
];

export default function Careers() {
  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.careers} />
      <StructuredData schemas={[getBreadcrumbSchema([
        { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
        { name: "Careers", url: "https://www.woodinvillesportsclub.com/careers" },
      ])]} />

      <PageHero
        eyebrow="Careers at WSC"
        headline="Help build the athletic home of the PNW."
        subtitle="Woodinville Sports Club is looking for people who care about sport, service, youth development, fitness, and creating a respectful place for members to grow."
        image={HERO_IMG}
      />

      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.75fr_1.45fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-volt text-[11px] tracking-[0.22em] uppercase mb-5">Working at WSC</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-8">
              A supportive place for athletic and personal goals.
            </h2>
            <p className="text-ink-mid text-[16px] leading-[1.82]">
              WSC aims to be a destination where everyone in the Pacific Northwest can pursue athletic and personal goals in a supportive, respectful environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
            {departments.map((department) => (
              <article key={department.name} className="bg-parchment-mid p-8 border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <department.icon size={24} className="text-volt mb-5" />
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-3">{department.name}</h3>
                <p className="text-ink text-[13px] leading-[1.65] mb-4">{department.roles}</p>
                <p className="text-ink-mid text-[14px] leading-[1.72]">{department.mission}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="text-volt-bright text-[11px] tracking-[0.22em] uppercase mb-5">Apply Today</p>
            <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
              Tell us where you would like to contribute.
            </h2>
            <p className="text-parchment/80 text-[15px] leading-[1.75] max-w-[620px]">
              The legacy application collected contact details, department interest, availability, resume upload, authorization to work in the United States, and sponsorship needs. Use the contact page to start the application conversation.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-8 py-3.5 hover:bg-parchment transition-colors duration-200"
          >
            Contact WSC
            <Send size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
