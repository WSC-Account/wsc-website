import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import SEOHead from "@/components/SEOHead";
import StructuredData, {
  getBreadcrumbSchema,
} from "@/components/StructuredData";
import { SEO } from "@/lib/seo-data";
import { adultClasses, ADULT_CLASS_DETAILS } from "@/lib/adult-tennis";

const PORTAL = "https://app.courtreserve.com/Online/Portal/Index/6689";
const HELP =
  "mailto:cvordale@woodinvillesportsclub.com?subject=Adult%20Tennis%20-%20Class%20Placement";
const button =
  "inline-flex min-h-11 items-center justify-center gap-2 px-6 py-3 text-sm no-underline transition-colors";
const section = "px-6 py-16 lg:px-14 lg:py-24";

export default function AdultTennis() {
  return (
    <div>
      <SEOHead
        {...SEO.adultTennis}
        image="/images/wsc/tennis-adult-clinic.webp"
      />
      <StructuredData
        schemas={[getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Tennis", url: "/tennis" },
          { name: "Adult Tennis", url: SEO.adultTennis.path },
        ])]}
      />

      <section className="bg-dark-bg pt-[var(--site-header-height,130px)] text-parchment">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2">
          <div className="px-6 py-12 lg:px-14 lg:py-20 flex flex-col justify-center">
            <p className="text-volt-bright text-xs tracking-[0.2em] uppercase mb-6">
              Adult Tennis at WSC
            </p>
            <h1 className="text-[clamp(38px,5vw,66px)] font-light leading-[1.08] tracking-[-0.025em] mb-6">
              Your game.
              <br />
              Your people.
              <br />
              Your court.
            </h1>
            <p className="text-parchment/80 text-lg leading-relaxed max-w-lg">
              Start playing, sharpen your skills, or find your next match. Adult
              tennis in Woodinville, from your first lesson to your next
              competitive season.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#classes"
                className={`${button} bg-volt-bright text-dark-bg hover:bg-parchment`}
              >
                Explore adult classes
              </a>
              <a
                href="#get-started"
                className={`${button} border border-parchment/40 text-parchment hover:bg-parchment/10`}
              >
                Help me find my class
              </a>
            </div>
            <p className="mt-8 text-sm text-parchment/65">
              8 indoor courts · Beginner to advanced · Year-round play
            </p>
          </div>
          <ResponsiveImage
            src="/images/wsc/tennis-adult-clinic.webp"
            alt="An adult player practicing with a coach on court at WSC"
            loading="eager"
            fetchPriority="high"
            className="w-full h-[300px] sm:h-[420px] lg:h-full object-cover"
            style={{ objectPosition: "center 55%" }}
          />
        </div>
      </section>

      <section
        className={`${section} bg-parchment`}
        aria-labelledby="pathways-heading"
      >
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-xs tracking-[0.2em] uppercase mb-4">
            Find your starting point
          </p>
          <h2
            id="pathways-heading"
            className="text-3xl lg:text-4xl font-light mb-10"
          >
            There’s a place for your game.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Learn the game",
                text: "New to tennis? Start with the strokes, footwork, and confidence to play. Intro to Tennis welcomes players with little or no experience.",
                href: "#class-0",
                cta: "Find beginner tennis",
              },
              {
                title: "Improve your game",
                text: "Build a more reliable shot, get comfortable at the net, or put your skills into live points. Choose a class around what you want to work on.",
                href: "#classes",
                cta: "Explore training options",
              },
              {
                title: "Play & compete",
                text: "Put your practice into play with UTR singles matches, USTA and Cup team tennis, or a court reservation with your hitting partners.",
                href: "#play",
                cta: "Explore ways to play",
              },
            ].map(path => (
              <article
                key={path.title}
                className="border-t border-wsc-border pt-6 flex flex-col items-start"
              >
                <h3 className="text-2xl font-light mb-4">{path.title}</h3>
                <p className="text-ink-mid leading-relaxed mb-6">{path.text}</p>
                <a
                  href={path.href}
                  className="mt-auto inline-flex gap-2 items-center text-ink border-b border-volt pb-1 no-underline"
                >
                  {path.cta}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="classes"
        className={`${section} bg-parchment-mid scroll-mt-[var(--site-header-height,130px)]`}
      >
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-xs tracking-[0.2em] uppercase mb-4">
            Adult classes
          </p>
          <h2 className="text-3xl lg:text-4xl font-light mb-5">
            Choose what you want to work on.
          </h2>
          <p className="text-ink-mid leading-relaxed max-w-3xl mb-4">
            {ADULT_CLASS_DETAILS}
          </p>
          <p className="text-ink-mid leading-relaxed max-w-3xl mb-10">
            NTRP and UTR are different player rating systems. You don’t need to
            know your rating to ask for help finding a class. Email Connor Vordale,
            our Adult Tennis Director, for guidance.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adultClasses.map((item, index) => (
              <article
                id={`class-${index}`}
                key={item.name}
                className="bg-parchment p-6 lg:p-8 scroll-mt-[var(--site-header-height,130px)]"
              >
                <p className="text-volt text-xs tracking-wider uppercase mb-4">
                  {item.level}
                </p>
                <h3 className="text-xl font-light mb-3">{item.name}</h3>
                <p className="text-ink-mid leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 border-t border-wsc-border pt-8 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-xl font-light mb-3">
                Ready to choose a time?
              </h3>
              <p className="text-ink-mid leading-relaxed">
                Open CourtReserve and look for the class name above to see
                available dates, exact pricing, and registration. A Class
                Registration Pass or a membership that includes class
                registration is required; class fees are separate.
              </p>
              <Link
                href="/membership"
                className="inline-block text-ink underline underline-offset-4 mt-3"
              >
                Compare membership options
              </Link>
            </div>
            <a
              href={PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button} bg-dark-bg text-parchment hover:bg-ink-mid shrink-0`}
            >
              Open CourtReserve
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="play"
        className={`${section} bg-parchment scroll-mt-[var(--site-header-height,130px)]`}
      >
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-xs tracking-[0.2em] uppercase mb-4">
            Keep playing
          </p>
          <h2 className="text-3xl lg:text-4xl font-light mb-10">
            From practice to your next match.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <article>
              <h3 className="text-xl font-light mb-4">
                Friday Night UTR Matchplay
              </h3>
              <p className="text-ink-mid leading-relaxed mb-5">
                Adult sessions are for ages 19+ and alternate with junior
                Fridays. Play verified singles using Fast 4 scoring against
                opponents near your UTR level. Check CourtReserve for the next
                adult date and registration details.
              </p>
              <a
                href={PORTAL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline underline-offset-4"
              >
                Check matchplay in CourtReserve
              </a>
            </article>
            <article>
              <h3 className="text-xl font-light mb-4">
                USTA & Cup team tennis
              </h3>
              <p className="text-ink-mid leading-relaxed mb-5">
                WSC hosts USTA and Seattle Area Cup Tennis teams. Contact the
                front desk about current team opportunities, captain contacts,
                and eligibility for your level.
              </p>
              <a
                href="mailto:info@woodinvillesportsclub.com?subject=Adult%20Tennis%20-%20Team%20Opportunities"
                className="text-ink underline underline-offset-4"
              >
                Ask about team tennis
              </a>
            </article>
            <article>
              <h3 className="text-xl font-light mb-4">
                Play with your partners
              </h3>
              <p className="text-ink-mid leading-relaxed mb-5">
                Book time to rally, practice doubles, or play a match. Court
                booking requires an eligible membership, and court and guest
                fees apply. Availability is shared with academy programming.
              </p>
              <a
                href={PORTAL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline underline-offset-4"
              >
                Check court availability
              </a>
            </article>
          </div>
        </div>
      </section>

      <section
        id="get-started"
        className={`${section} bg-dark-bg text-parchment scroll-mt-[var(--site-header-height,130px)]`}
      >
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20">
          <div>
            <p className="text-volt-bright text-xs tracking-[0.2em] uppercase mb-4">
              Let’s get you on court
            </p>
            <h2 className="text-3xl lg:text-4xl font-light mb-5">
              Not sure where you fit? Start here.
            </h2>
            <p className="text-parchment/75 leading-relaxed mb-6">
              Tell us whether you’re new, returning, or playing regularly, what
              you’d like to work on, and when you’re available. Ask about class
              placement, private instruction, or current social-play
              opportunities.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={HELP}
                className={`${button} bg-volt-bright text-dark-bg hover:bg-parchment`}
              >
                Email Connor for class guidance
              </a>
              <a
                href="tel:+14254871090"
                className={`${button} border border-parchment/40 text-parchment hover:bg-parchment/10`}
              >
                Front desk: (425) 487-1090
              </a>
            </div>
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-parchment/20 pt-8 lg:pt-0 lg:pl-10">
            <div className="flex flex-wrap items-center gap-6">
              <img
                src="/images/wsc/connor-vordale.jpg"
                alt="Connor Vordale, Adult Tennis Director at WSC"
                width={1373}
                height={1920}
                loading="lazy"
                decoding="async"
                className="w-40 h-auto"
              />
              <div>
                <p className="text-volt-bright text-xs tracking-[0.2em] uppercase mb-3">
                  Adult Tennis Director
                </p>
                <h3 className="text-2xl font-light">Connor Vordale</h3>
              </div>
            </div>
            <a
              href="mailto:cvordale@woodinvillesportsclub.com"
              className="inline-block mt-6 text-parchment underline underline-offset-4 break-all"
            >
              cvordale@woodinvillesportsclub.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
