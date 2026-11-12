import React from "react";
import { BrandLogo } from "./BrandLogo";
import { SITE_CONTENT } from "../content";
import { SERVICE_PAGES, serviceUrl } from "../servicesData";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { label: "Home", href: "/#hero" },
    { label: "About Us", href: "/#about" },
    { label: "Our Services", href: "/#services" },
    { label: "Our Projects", href: "/#work" },
    { label: "Our Clients", href: "/#clients" },
    { label: "FAQ", href: "/#faq" },
    { label: "Our Approach", href: "/#process" },
    { label: "Contact Us", href: "/#contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  const serviceLinks = SERVICE_PAGES.map((svc) => ({ label: svc.name, href: serviceUrl(svc.slug) }));

  return (
    <footer className="relative bg-[#14213D] text-[#F4EDE0] overflow-hidden pb-[72px] lg:pb-0">
      {/* Architectural Grid Background */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-10 pointer-events-none" />

      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large Brand Closing Statement */}
        <div className="pt-20 pb-16 md:pt-28 md:pb-20 border-b border-white/10">
          <div className="max-w-4xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-[#F4EDE0]">ENGINEERING EXCELLENCE.</span>
              <br />
              <span className="text-brand-orange">RELIABLE EXECUTION.</span>
            </h2>
            {/* Orange Divider */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-16 bg-brand-orange" />
              <div className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              <div className="h-px flex-1 bg-gradient-to-r from-brand-orange/40 to-transparent" />
            </div>
          </div>
        </div>

        {/* Main Footer Layout - Four Columns */}
        <div className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Column 1: Brand */}
            <div className="space-y-6">
              <BrandLogo variant="footer" isBlueBg={true} />
              <p className="text-sm text-brand-stone/80 leading-relaxed max-w-xs">
                Fraternity Engineering & Co. (SMC-Pvt) Ltd. provides integrated construction,
                civil engineering, electrical installations, fire & safety systems, and general
                order supplies across Pakistan.
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-mono text-brand-orange/90 uppercase tracking-wider">
                  Engineering | Construction | Electrical | Fire & Safety | General Order Supply
                </p>
              </div>
            </div>

            {/* Column 2: Explore */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4EDE0]">
                Explore
              </h3>
              <ul className="space-y-0">
                {exploreLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group relative inline-flex items-center min-h-[44px] text-sm text-brand-stone/90 hover:text-[#F4EDE0] transition-colors duration-300"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-brand-orange transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Our Services */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4EDE0]">
                Our Services
              </h3>
              <ul className="space-y-0">
                {serviceLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group relative inline-flex items-center min-h-[44px] text-sm text-brand-stone/90 hover:text-[#F4EDE0] transition-colors duration-300"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-brand-orange transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4EDE0]">
                Contact
              </h3>
              <div className="space-y-4 text-sm">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-brand-stone/80 leading-relaxed">
                    {SITE_CONTENT.contact.address}
                  </span>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <a
                      href={`tel:${SITE_CONTENT.contact.phonePrimaryTel}`}
                      className="block text-brand-stone/80 hover:text-[#F4EDE0] transition-colors"
                    >
                      0331-5095004
                    </a>
                    <span className="block text-xs text-brand-stone/75">Mobile</span>
                    <a
                      href={`tel:${SITE_CONTENT.contact.phoneSecondaryTel}`}
                      className="block text-brand-stone/80 hover:text-[#F4EDE0] transition-colors"
                    >
                      051-2331654
                    </a>
                    <span className="block text-xs text-brand-stone/75">Landline</span>
                  </div>
                </div>

                {/* Email (hidden until a domain email is set) */}
                {SITE_CONTENT.contact.domainEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    <a
                      href={`mailto:${SITE_CONTENT.contact.domainEmail}`}
                      className="text-brand-stone/80 hover:text-[#F4EDE0] transition-colors break-all"
                    >
                      {SITE_CONTENT.contact.domainEmail}
                    </a>
                  </div>
                )}

                {/* Office Hours */}
                <div className="flex items-start gap-3 pt-2 border-t border-white/10">
                  <Clock className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs text-brand-stone/80">
                    <p>Monday to Saturday: 9:00 AM - 6:00 PM</p>
                    <p>Friday Break: 1:00 PM - 2:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-brand-stone/75 font-light tracking-wide">
              &copy; {currentYear} Fraternity Engineering. All Rights Reserved.
            </p>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="py-6 border-t border-white/10">
          <div className="flex items-center justify-center">
            <p className="text-xs text-brand-stone/75 font-light tracking-wide">
              Powered by{" "}
              <a
                href="https://www.robosoftworks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-orange hover:text-[#F4EDE0] transition-colors font-medium"
              >
                RoboSoft Works
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
