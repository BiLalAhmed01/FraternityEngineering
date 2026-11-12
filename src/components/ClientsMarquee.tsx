import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SITE_CONTENT, ClientLogo } from "../content";
import { Reveal } from "./Reveal";

const LogoBox: React.FC<{ client: ClientLogo; decorative?: boolean }> = ({ client, decorative }) => (
  <div className="client-logo flex h-14 w-full max-w-[140px] items-center justify-center" title={decorative ? undefined : client.fullName}>
    <img
      src={client.logo}
      alt={decorative ? "" : `${client.fullName} (${client.name}) logo`}
      width={140}
      height={56}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-contain"
    />
  </div>
);

export const ClientsMarquee: React.FC = () => {
  const logos = SITE_CONTENT.clientLogos;
  const [touchPaused, setTouchPaused] = useState(false);

  return (
    <section
      id="clients"
      className="relative bg-white text-brand-navy py-12 md:py-[72px] border-y border-brand-navy/10"
      aria-labelledby="clients-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-navy/60">Trusted by</p>
          <h2
            id="clients-title"
            className="mt-3 font-heading font-medium text-[28px] md:text-[36px] leading-tight tracking-tight text-brand-navy [text-wrap:balance]"
          >
            Selected organizations we've worked with.
          </h2>
        </Reveal>

        <Reveal className="mt-10 md:mt-12" delay={0.05}>
          {/* Tablet/desktop (and reduced motion on mobile): static logo grid */}
          <ul className="clients-static items-center gap-y-8 md:gap-y-10">
            {logos.map((client) => (
              <li key={client.name} className="flex justify-center px-3">
                <LogoBox client={client} />
              </li>
            ))}
          </ul>

          {/* Mobile: slow marquee, paused on hover/touch */}
          <div
            className="clients-marquee overflow-hidden"
            role="group"
            aria-label="Client logos"
            onTouchStart={() => setTouchPaused(true)}
            onTouchEnd={() => setTouchPaused(false)}
            onTouchCancel={() => setTouchPaused(false)}
          >
            <ul className={`clients-marquee-track ${touchPaused ? "is-paused" : ""}`}>
              {[...logos, ...logos].map((client, idx) => (
                <li
                  key={`${client.name}-${idx}`}
                  className="w-[152px] shrink-0 pr-8"
                  aria-hidden={idx >= logos.length || undefined}
                >
                  <LogoBox client={client} decorative={idx >= logos.length} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="mt-10 md:mt-12 text-center text-[14px] text-brand-navy/70" delay={0.1}>
          <p className="inline">References available on request. </p>
          <a
            href="#contact"
            className="group ml-1 inline-flex items-center gap-1.5 font-semibold text-brand-navy rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
          >
            <span className="relative after:absolute after:inset-x-0 after:-bottom-[3px] after:h-px after:bg-brand-orange after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
              Request references
            </span>
            <ArrowRight
              className="w-3.5 h-3.5 text-brand-orange transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
};
