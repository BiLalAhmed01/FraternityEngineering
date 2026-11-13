import React from "react";
import { BrandLogo } from "../components/BrandLogo";
import { SITE_CONTENT } from "../content";
import { ArrowLeft } from "lucide-react";

const lastUpdated = "November 6, 2026";

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-brown font-body">
      {/* Simple header */}
      <header className="bg-brand-navy text-white py-4 px-[clamp(20px,5vw,64px)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" aria-label="Back to homepage">
            <BrandLogo isBlueBg={true} />
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-brand-stone hover:text-brand-orange transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-[clamp(20px,5vw,64px)] py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-navy mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-brand-steel font-mono mb-10">Last updated: {lastUpdated}</p>

        <div className="prose prose-stone max-w-none space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">1. Who We Are</h2>
            <p>
              Fraternity Engineering &amp; Co. (SMC-Pvt) Ltd. ("FTE", "we", "us") is an engineering,
              construction, and supply company based in Islamabad, Pakistan. This policy explains how
              we collect, use, and protect information when you visit our website or contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">2. Information We Collect</h2>
            <p>We collect information you voluntarily provide, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Name, company name, phone number, and email address submitted through our contact or quote request form</li>
              <li>Project details, service requirements, and messages you send us</li>
              <li>Basic technical data such as browser type and pages visited (via standard server logs)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To respond to inquiries and prepare quotations</li>
              <li>To deliver contracted engineering, construction, and supply services</li>
              <li>To communicate about ongoing projects and after-sales support</li>
              <li>To improve our website and services</li>
            </ul>
            <p className="mt-2">We do not sell, rent, or trade your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">4. Third-Party Services</h2>
            <p>
              Our website uses Google Fonts for typography and links to WhatsApp and Google Maps.
              These services may collect technical data under their own privacy policies. We do not
              use advertising trackers, analytics cookies, or sell visitor data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">5. Data Retention &amp; Security</h2>
            <p>
              We retain inquiry data only as long as needed to respond and fulfill contractual
              obligations. We apply reasonable administrative and technical safeguards to protect
              your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">6. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information by
              contacting us at{" "}
              <a href={`mailto:${SITE_CONTENT.contact.email}`} className="text-brand-orange-ink underline underline-offset-2">
                {SITE_CONTENT.contact.email}
              </a>
              . We will respond within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">7. Contact</h2>
            <p>
              Questions about this policy? Reach us at {SITE_CONTENT.contact.address},{" "}
              {SITE_CONTENT.contact.city}, or email{" "}
              <a href={`mailto:${SITE_CONTENT.contact.email}`} className="text-brand-orange-ink underline underline-offset-2">
                {SITE_CONTENT.contact.email}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};
