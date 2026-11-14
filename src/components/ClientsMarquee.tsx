import React, { useEffect, useRef, useState } from "react";
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
  const [offscreen, setOffscreen] = useState(true);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Stop the marquee while it is off screen.
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="clients"
      className="theme-paper relative bg-white text-fg py-[clamp(48px,6vw,72px)] border-y border-line"
      aria-labelledby="clients-title"
    >
      <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
        <Reveal className="text-center">
          <p className="text-[13px] font-semibold text-fg-muted">Trusted by</p>
          <h2
            id="clients-title"
            className="mt-3 font-heading font-medium text-[28px] md:text-[36px] leading-tight tracking-tight text-fg [text-wrap:balance]"
          >
            Selected organisations we've worked with.
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
            ref={marqueeRef}
            className="clients-marquee overflow-hidden"
            role="group"
            aria-label="Client logos"
            onTouchStart={() => setTouchPaused(true)}
            onTouchEnd={() => setTouchPaused(false)}
            onTouchCancel={() => setTouchPaused(false)}
          >
            <ul className={`clients-marquee-track ${touchPaused || offscreen ? "is-paused" : ""}`}>
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

        <Reveal className="mt-10 md:mt-12 text-center text-[14px] text-fg-muted" delay={0.1}>
          <p className="inline">References available on request. </p>
          <a
            href="#contact"
            className="group ml-1 inline-flex items-center gap-1.5 font-semibold text-fg rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <span className="relative after:absolute after:inset-x-0 after:-bottom-[3px] after:h-px after:bg-fg after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
              Request references
            </span>
            <ArrowRight
              className="w-3.5 h-3.5 text-label transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
};
