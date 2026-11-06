import React from "react";
import { SITE_CONTENT } from "../content";

export const ClientsMarquee: React.FC = () => {
  // Duplicate for seamless infinite marquee loop
  const marqueeItems = [...SITE_CONTENT.clientLogos, ...SITE_CONTENT.clientLogos];

  return (
    <section
      id="clients"
      className="relative bg-brand-navy text-white py-16 md:py-20 overflow-hidden"
      aria-label="Client Organizations and Institutions"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <p className="kicker-label text-brand-orange mb-2">Trusted Client Relationships</p>
        <h2 className="text-xl md:text-2xl font-heading font-semibold text-white mb-3">
          Organizations We've Worked With
        </h2>
        <p className="text-sm md:text-base text-brand-cream/80 max-w-2xl mx-auto leading-relaxed">
          Our experience includes engagements with recognized government, public-sector, institutional and private-sector organizations.
        </p>
      </div>

      {/* Infinite Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Left and right fade gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-brand-navy to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-brand-navy to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-12 sm:gap-16 lg:gap-24 py-6">
          {marqueeItems.map((client, idx) => (
            <div
              key={`${client.name}-${idx}`}
              className="flex flex-col items-center justify-center shrink-0 group cursor-default transition-all duration-300"
            >
              <img
                src={client.logo}
                alt={client.fullName}
                loading="lazy"
                className="h-10 sm:h-14 lg:h-20 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="text-[10px] sm:text-xs font-mono text-brand-cream/60 group-hover:text-brand-cream transition-colors mt-2">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
