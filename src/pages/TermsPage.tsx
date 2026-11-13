import React from "react";
import { BrandLogo } from "../components/BrandLogo";
import { SITE_CONTENT } from "../content";
import { ArrowLeft } from "lucide-react";

const lastUpdated = "November 6, 2026";

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-brown font-body">
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
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-brand-steel font-mono mb-10">Last updated: {lastUpdated}</p>

        <div className="prose prose-stone max-w-none space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">1. Acceptance of Terms</h2>
            <p>
              By using this website or engaging Fraternity Engineering &amp; Co. (SMC-Pvt) Ltd.
              ("FTE") for services, you agree to these terms. If you do not agree, please do not use
              the website or engage our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">2. Our Services</h2>
            <p>
              FTE provides construction, civil engineering, electrical, fire &amp; safety, and general
              order supply services in Pakistan. All work is subject to formal quotation, scope
              agreement, and applicable contractual terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">3. Quotations &amp; Estimates</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Quotes are valid for the period stated in the quotation document</li>
              <li>Prices are based on the scope described and may change if scope, site conditions, or material costs change</li>
              <li>A formal purchase order or signed agreement is required before work commences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">4. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos and images, is the
              property of FTE or its licensors and may not be reproduced without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">5. Limitation of Liability</h2>
            <p>
              The website is provided "as is" for informational purposes. FTE does not guarantee that
              the site will be uninterrupted or error-free. Liability for services is governed by
              the specific contract for each engagement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">6. Governing Law</h2>
            <p>
              These terms are governed by the laws of Pakistan. Any disputes shall be subject to the
              exclusive jurisdiction of the courts of Islamabad, Pakistan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">7. Contact</h2>
            <p>
              Questions about these terms? Contact us at {SITE_CONTENT.contact.address},{" "}
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
