import React from "react";
import { SITE_CONTENT } from "../content";

export const ClientsMarquee: React.FC = () => {
  // Duplicate for seamless infinite marquee loop
  const marqueeItems = [...SITE_CONTENT.clientLogos, ...SITE_CONTENT.clientLogos];

  return (
    <section
      id="clients"
      className="relative bg-brand-navy text-white py-16 md:py-24 overflow-hidden"
      aria-label="Client Organizations and Institutions"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <p className="kicker-label text-brand-orange mb-2">Trusted Client Relationships</p>
        <h2 className="text-xl md:text-2xl font-heading font-bold text-white mb-3">
          Organizations We've Worked With
        </h2>
        <p className="text-sm md:text-base text-brand-cream/80 max-w-2xl mx-auto leading-relaxed">
          Our experience includes engagements with recognized government, public-sector, institutional and private-sector organizations.
        </p>
      </div>

      {/* Infinite marquee: pauses on hover and keyboard focus, replaced by a static grid for reduced motion */}
      <div
        className="relative w-full overflow-hidden motion-reduce:hidden group/marquee"
        tabIndex={0}
        role="group"
        aria-label="Client logos"
      >
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-brand-navy to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-brand-navy to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-12 sm:gap-16 lg:gap-24 py-6">
          {marqueeItems.map((client, idx) => (
            <div
              key={`${client.name}-${idx}`}
              aria-hidden={idx >= SITE_CONTENT.clientLogos.length}
              className="flex flex-col items-center justify-center shrink-0 group cursor-default transition-all duration-300"
            >
              <img
                src={client.logo}
                alt={idx >= SITE_CONTENT.clientLogos.length ? "" : client.fullName}
                loading="lazy"
                className="h-10 sm:h-14 lg:h-20 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="text-[10px] sm:text-xs font-mono text-brand-cream/80 group-hover:text-brand-cream transition-colors mt-2">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ul className="hidden motion-reduce:grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-5xl mx-auto px-4 py-6 place-items-center">
        {SITE_CONTENT.clientLogos.map((client) => (
          <li key={client.name} className="flex flex-col items-center">
            <img src={client.logo} alt={client.fullName} loading="lazy" className="h-14 w-auto object-contain" />
            <span className="text-xs font-mono text-brand-cream/80 mt-2">{client.name}</span>
          </li>
        ))}
      </ul>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 text-center space-y-1">
        {SITE_CONTENT.clientScopes.trim() !== "" && (
          <p className="text-sm text-brand-cream/80">Scopes delivered include {SITE_CONTENT.clientScopes}.</p>
        )}
        <p className="text-xs font-mono text-brand-stone">References available on request.</p>
      </div>
    </section>
  );
};
