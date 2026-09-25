interface UtilityPageHeaderProps {
  eyebrow: string;
  headline: string;
  subtitle?: string;
}

export default function UtilityPageHeader({
  eyebrow,
  headline,
  subtitle,
}: UtilityPageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] bg-dark-bg pt-[var(--site-header-height,130px)]">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-6 py-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:px-14 lg:py-14">
        <div>
          <p className="mb-4 text-[12px] uppercase tracking-[0.22em] text-volt-bright sm:text-[13px]">
            {eyebrow}
          </p>
          <h1 className="max-w-[760px] text-[clamp(34px,5vw,58px)] font-light leading-[1.04] tracking-[-0.03em] text-parchment">
            {headline}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-[700px] text-[15px] leading-[1.72] text-parchment/72 sm:text-[16px]">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className="hidden items-center gap-3 pb-1 lg:flex"
          aria-hidden="true"
        >
          <span className="h-px w-20 bg-volt-bright/80" />
          <span className="h-1.5 w-1.5 bg-volt-bright" />
        </div>
      </div>
    </section>
  );
}
