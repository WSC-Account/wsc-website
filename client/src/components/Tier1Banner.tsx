/**
 * Tier1Banner — Prominent full-width section highlighting
 * Tier 1 Sports as a world-class developmental program.
 * Used on the homepage and optionally on sport pages.
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface Tier1BannerProps {
  variant?: "full" | "compact";
}

export default function Tier1Banner({ variant = "full" }: Tier1BannerProps) {
  if (variant === "compact") {
    return (
      <section className="bg-[#0d1b2a] px-6 lg:px-14 py-14 lg:py-16 relative overflow-hidden">
        {/* Subtle gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a5c]/30 via-transparent to-[#1a3a5c]/30" />
        <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <p className="text-volt-bright text-[12px] tracking-[0.22em] uppercase mb-3">
              Tier 1 Sports
            </p>
            <h3 className="text-white text-[clamp(20px,2.2vw,28px)] font-light tracking-[-0.02em] leading-[1.2]">
              One of the nation's leading developmental programs.
            </h3>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="https://www.tier1nw.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-7 py-3 hover:bg-white transition-colors duration-200"
            >
              Explore Tier 1
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0d1b2a] px-6 lg:px-14 py-24 lg:py-32 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c]/40 via-transparent to-[#0d2847]/40" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-volt-bright/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-volt-bright/30 to-transparent" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Left: Messaging */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[3px] h-8 bg-volt-bright" />
              <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase">
                Tier 1 Sports
              </p>
            </div>
            <h2 className="text-white text-[clamp(30px,3.5vw,52px)] font-light tracking-[-0.025em] leading-[1.08] mb-6">
              World-Class<br />
              Developmental<br />
              Programming.
            </h2>
            <p className="text-white/70 text-[16px] leading-[1.8] max-w-[480px] mb-8">
              WSC is home to Tier 1 Sports — one of the nation's leading developmental programs in tennis, golf, and athletic performance. Our coaches develop athletes from first swing to collegiate and professional ranks.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.tier1nw.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline bg-volt-bright text-dark-bg px-7 py-3 hover:bg-white transition-colors duration-200"
              >
                Explore Tier 1 Programs
                <ArrowRight size={13} />
              </a>
              <Link
                href="/tennis"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline text-white border border-white/30 px-7 py-3 hover:bg-white/10 transition-colors duration-200"
              >
                Tennis Programs
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/golf"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase no-underline text-white border border-white/30 px-7 py-3 hover:bg-white/10 transition-colors duration-200"
              >
                Golf Programs
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right: Key stats */}
          <div className="grid grid-cols-2 gap-[1px] bg-white/[0.06]">
            {[
              {
                val: "Tier 1",
                label: "Tennis Academy",
                desc: "Full-time and after-school elite training led by former world-ranked professionals",
              },
              {
                val: "Tier 1",
                label: "Golf Academy",
                desc: "Junior and adult instruction with WGTF Master Certified coaching and Swing Lab technology",
              },
              {
                val: "APL",
                label: "Performance Lab",
                desc: "Integrated strength and conditioning for youth and adult athletes across all disciplines",
              },
              {
                val: "WSC",
                label: "Training Campus",
                desc: "A 67-acre home base for tennis, golf, fitness, and year-round athlete development",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#0d1b2a] p-7 lg:p-8 group hover:bg-[#122a42] transition-colors duration-300"
              >
                <div className="text-volt-bright text-[24px] lg:text-[28px] font-light tracking-[-0.02em] leading-none mb-1">
                  {item.val}
                </div>
                <p className="text-white text-[12px] tracking-[0.12em] uppercase mb-3">
                  {item.label}
                </p>
                <p className="text-white/60 text-[13px] leading-[1.65]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
