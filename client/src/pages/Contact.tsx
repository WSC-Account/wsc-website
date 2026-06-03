/*
 * 4B Design — Contact Page
 * Real content from WSC website crawl
 */
import { useState } from "react";
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import StructuredData, { getContactPageSchema, getLocalBusinessSchema, getBreadcrumbSchema } from "@/components/StructuredData";
import { useFormProtection } from "@/hooks/useFormProtection";
import SEOHead from "@/components/SEOHead";
import { SEO } from "@/lib/seo-data";
import { submitWebsiteForm } from "@/lib/forms";
import { notifyError, notifySuccess } from "@/lib/notify";

const HERO_IMG = "/images/wsc/contact-campus.webp";

export default function Contact() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const { honeypotProps, validateSubmission } = useFormProtection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateSubmission();
    if (!check.valid) {
      // Silently reject bot submissions — show fake success so bots think it worked
      if (check.reason === "honeypot" || check.reason === "too_fast") {
        const message = "Message sent! We'll be in touch shortly.";
        setFormStatus({ type: "success", message });
        notifySuccess(message);
        setForm({ firstName: "", lastName: "", email: "", message: "" });
        return;
      }
      if (check.reason === "rate_limited") {
        const message = "Please wait a moment before sending another message.";
        setFormStatus({ type: "error", message });
        notifyError(message);
        return;
      }
    }
    const name = `${form.firstName} ${form.lastName}`.trim();

    setIsSubmitting(true);
    setFormStatus(null);
    try {
      await submitWebsiteForm({
        formType: "contact",
        source: "/contact",
        formName: "Contact Form",
        name,
        email: form.email,
        subject: `Website inquiry from ${name}`,
        message: form.message,
      });

      const message = "Message sent! We'll be in touch shortly.";
      setFormStatus({ type: "success", message });
      notifySuccess(message);
      setForm({ firstName: "", lastName: "", email: "", message: "" });
    } catch {
      const message = "We could not send your message right now. Please try again or email info@woodinvillesportsclub.com.";
      setFormStatus({ type: "error", message });
      notifyError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead {...SEO.contact} />
      <StructuredData schemas={[
        getLocalBusinessSchema(),
        getContactPageSchema(),
        getBreadcrumbSchema([
          { name: "Home", url: "https://www.woodinvillesportsclub.com/" },
          { name: "Contact", url: "https://www.woodinvillesportsclub.com/contact" },
        ]),
      ]} />
      <PageHero
        eyebrow="Contact Us"
        headline="Get in Touch."
        subtitle="Questions about membership, programs, or facilities? We'd love to hear from you."
        image={HERO_IMG}
      />

      {/* Form + Info */}
      <section className="bg-parchment px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Send a Message</p>
            <form onSubmit={handleSubmit} data-form-name="Contact Form" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-first-name" className="block text-ink-light text-[11px] tracking-[0.14em] uppercase mb-2">
                    First Name
                  </label>
                  <input
                    id="contact-first-name"
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full bg-parchment-mid border border-wsc-border px-4 py-3 text-[14px] text-ink focus:border-volt focus:outline-none transition-colors"
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-last-name" className="block text-ink-light text-[11px] tracking-[0.14em] uppercase mb-2">
                    Last Name
                  </label>
                  <input
                    id="contact-last-name"
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full bg-parchment-mid border border-wsc-border px-4 py-3 text-[14px] text-ink focus:border-volt focus:outline-none transition-colors"
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-ink-light text-[11px] tracking-[0.14em] uppercase mb-2">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-parchment-mid border border-wsc-border px-4 py-3 text-[14px] text-ink focus:border-volt focus:outline-none transition-colors"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-ink-light text-[11px] tracking-[0.14em] uppercase mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full bg-parchment-mid border border-wsc-border px-4 py-3 text-[14px] text-ink focus:border-volt focus:outline-none transition-colors resize-none"
                  required
                />
              </div>
              {/* Honeypot — invisible to humans, bots fill it */}
              <input {...honeypotProps} />
              {formStatus ? (
                <p
                  role={formStatus.type === "error" ? "alert" : "status"}
                  className={`text-[13px] leading-[1.6] ${
                    formStatus.type === "error" ? "text-red-700" : "text-ink"
                  }`}
                >
                  {formStatus.message}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 transition-colors duration-200 ${
                  isSubmitting
                    ? "bg-ink/15 text-ink-mid cursor-default"
                    : "bg-volt-bright text-dark-bg hover:bg-parchment-dark"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Information</p>
            <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-10">
              Woodinville<br />Sports Club
            </h2>

            <div className="space-y-8">
              <div>
                <p className="text-ink-light text-[11px] tracking-[0.14em] uppercase mb-2">Address</p>
                <p className="text-ink text-[16px] leading-[1.7]">
                  15327 140th Pl NE<br />
                  Woodinville, WA 98072
                </p>
              </div>
              <div>
                <p className="text-ink-light text-[11px] tracking-[0.14em] uppercase mb-2">Phone</p>
                <p className="text-ink text-[16px] leading-[1.7]">
                  Front Desk:{" "}
                  <a href="tel:4254871090" className="text-ink no-underline border-b border-volt pb-[2px]">
                    (425) 487-1090
                  </a>
                  <br />
                  Golf Desk:{" "}
                  <a href="tel:4254857319" className="text-ink no-underline border-b border-volt pb-[2px]">
                    (425) 485-7319
                  </a>
                </p>
              </div>
              <div>
                <p className="text-ink-light text-[11px] tracking-[0.14em] uppercase mb-2">Email</p>
                <a
                  href="mailto:info@woodinvillesportsclub.com"
                  className="text-ink text-[16px] no-underline border-b border-volt pb-[2px]"
                >
                  info@woodinvillesportsclub.com
                </a>
              </div>
              <div>
                <p className="text-ink-light text-[11px] tracking-[0.14em] uppercase mb-2">Sports</p>
                <p className="text-ink text-[16px] leading-[1.7]">
                  Tennis, Golf, Fitness, Pickleball
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Ways to Connect */}
      <section className="bg-parchment px-6 lg:px-14 pb-24 lg:pb-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">More Ways to Connect</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
            {[
              { href: "/sessions", title: "Session Dates", desc: "View 2026 registration windows and program calendars." },
              { href: "/events", title: "Private Events", desc: "Plan a party, corporate event, wedding, or family celebration." },
              { href: "/careers", title: "Careers", desc: "Explore open departments and work opportunities at WSC." },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="bg-parchment-mid p-7 no-underline group border-t-2 border-transparent hover:border-volt transition-colors duration-300">
                <h3 className="text-ink text-[18px] font-light tracking-[-0.01em] mb-3 group-hover:text-volt transition-colors duration-200">{item.title}</h3>
                <p className="text-ink-mid text-[13px] leading-[1.7]">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="bg-parchment-mid px-6 lg:px-14 py-24 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-volt text-[13px] tracking-[0.22em] uppercase mb-5">Hours of Operation</p>
          <h2 className="text-[clamp(26px,2.8vw,38px)] font-light tracking-[-0.02em] leading-[1.15] mb-14">
            When we're open.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
            {[
              {
                name: "Tennis & Gym",
                hours: [
                  { day: "Weekdays", time: "6:00 AM - 11:00 PM" },
                  { day: "Weekends", time: "7:00 AM - 10:00 PM" },
                ],
              },
              {
                name: "Golf Range",
                hours: [
                  { day: "Everyday", time: "9:00 AM - 10:00 PM" },
                ],
              },
              {
                name: "Pickleball",
                hours: [
                  { day: "Open Play", time: "7 days/week" },
                  { day: "See schedule", time: "for session times" },
                ],
              },
            ].map((h, i) => (
              <div key={i} className="bg-parchment p-8 lg:p-10">
                <h3 className="text-[20px] font-light tracking-[-0.01em] mb-5">{h.name}</h3>
                <div className="space-y-3">
                  {h.hours.map((hr, hi) => (
                    <div key={hi} className="flex justify-between py-2 border-b border-wsc-border">
                      <span className="text-ink-mid text-[14px]">{hr.day}</span>
                      <span className="text-ink text-[14px]">{hr.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Follow */}
      <section className="bg-dark-mid px-6 lg:px-14 py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-volt-bright text-[13px] tracking-[0.22em] uppercase mb-5">Follow Us</p>
          <h2 className="text-parchment text-[clamp(26px,3vw,42px)] font-light tracking-[-0.02em] leading-[1.15] mb-4">
            @woodinvillesportsclub
          </h2>
          <p className="text-parchment/75 text-[15px] leading-[1.75] max-w-[480px] mx-auto mb-8">
            Follow us on Instagram for updates, event highlights, and community stories.
          </p>
          <a
            href="https://www.instagram.com/woodinvillesportsclub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[12px] tracking-[0.14em] uppercase no-underline text-parchment border border-volt-bright px-8 py-3.5 hover:bg-volt hover:border-volt transition-colors duration-200"
          >
            Follow on Instagram
          </a>
        </div>
      </section>
    </div>
  );
}
