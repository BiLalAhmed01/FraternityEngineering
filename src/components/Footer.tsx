import React from "react";
import { BrandLogo } from "./BrandLogo";
import { SITE_CONTENT } from "../content";
import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-brand-navy text-white pt-16 pb-12 border-t border-white/10 overflow-hidden">
      {/* Subtle blueprint grid overlay */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-20 pointer-events-none" />

      {/* Slanted Beam Motif in Footer */}
      <div
        className="absolute top-0 right-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Column 1: Company Profile & Logo (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo variant="footer" isBlueBg={true} />
            <p className="text-sm text-brand-stone max-w-sm leading-relaxed mt-4">
              Fraternity Engineering &amp; Co. (SMC-Pvt) Ltd. provides integrated construction,
              civil engineering, electrical installations, fire &amp; safety systems, and general order
              supplies across Pakistan.
            </p>
            <div className="pt-2 text-xs font-mono text-brand-orange/90">
              Makes Life Easier. // Single Point of Responsibility
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs md:text-sm text-brand-stone">
              <li>
                <a href="#services" className="hover:text-brand-orange transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-brand-orange transition-colors">
                  Our Work
                </a>
              </li>
              <li>
                <a href="#clients" className="hover:text-brand-orange transition-colors">
                  Clients
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-brand-orange transition-colors">
                  Operating Process
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand-orange transition-colors">
                  Mission &amp; Vision
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-orange transition-colors">
                  Request a Quote
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Engineering Services (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white">
              Disciplines
            </h4>
            <ul className="space-y-2 text-xs md:text-sm text-brand-stone">
              {SITE_CONTENT.services.map((svc) => (
                <li key={svc.id}>
                  <a href="#services" className="hover:text-brand-orange transition-colors">
                    {svc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Office (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white">
              Islamabad Office
            </h4>
            <div className="space-y-3 text-xs text-brand-stone">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>{SITE_CONTENT.contact.address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <a href="tel:03315095004" className="block hover:text-white transition-colors">
                    {SITE_CONTENT.contact.phonePrimary}
                  </a>
                  <a href="tel:0512331654" className="block hover:text-white transition-colors">
                    {SITE_CONTENT.contact.phoneSecondary}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a
                  href={`mailto:${SITE_CONTENT.contact.email}`}
                  className="hover:text-white transition-colors truncate"
                >
                  {SITE_CONTENT.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-stone">
          <p>
            &copy; {new Date().getFullYear()} {SITE_CONTENT.company.name} All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[11px] font-mono text-brand-steel">
              Islamabad, Pakistan
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-brand-orange" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
