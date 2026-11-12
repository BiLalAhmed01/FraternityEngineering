import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { SITE_CONTENT } from "../content";
import { serviceUrl } from "../servicesData";

// Section copy for the carousel cards. The detailed copy for each service page stays in content.ts.
const CARD_COPY: Record<string, { description: string; alt: string }> = {
  construction: {
    description: "Building development, renovation and structural works for commercial and institutional facilities.",
    alt: "Multi-storey concrete building frame under construction with a tower crane at sunset",
  },
  civil: {
    description: "Roads, drainage and site infrastructure that support building and facility development.",
    alt: "Road roller compacting fresh asphalt while workers finish the kerb line",
  },
  electrical: {
    description: "Installation, distribution and maintenance for commercial and institutional buildings.",
    alt: "Electrician in a hard hat wiring circuit breakers in a distribution panel",
  },
  "fire-safety": {
    description: "Detection, alarm and protection systems for safer working environments.",
    alt: "Red fire sprinkler pipework, hose reel cabinet, alarm call point and extinguisher on a wall",
  },
  supply: {
    description: "Procurement and delivery of engineering, construction and industrial materials.",
    alt: "Warehouse shelving stocked with cables, pipes, safety helmets, tools and fire extinguishers",
  },
};

// 4:5 crops of the service photos (taken above the branded diagonal in the originals).
const CARD_IMAGE: Record<string, { src: string; width: number; height: number }> = {
  construction: { src: "/assets/service-card-construction.webp", width: 656, height: 820 },
  civil: { src: "/assets/service-card-civil.webp", width: 616, height: 770 },
  electrical: { src: "/assets/service-card-electrical.webp", width: 631, height: 789 },
  "fire-safety": { src: "/assets/service-card-fire.webp", width: 636, height: 795 },
  supply: { src: "/assets/service-card-supply.webp", width: 631, height: 789 },
};

const pad = (n: number) => String(n).padStart(2, "0");

export const Services: React.FC = () => {
  const services = SITE_CONTENT.services;
  const total = services.length;
  const reduceMotion = useReducedMotion();

  const trackRef = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const [state, setState] = useState({
    index: 0,
    canPrev: false,
    canNext: true,
    thumb: 1,
    progress: 0,
  });

  // Derive counter, button states and progress line from the scroll position.
  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const progress = max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0;
    const atEnd = el.scrollLeft >= max - 2;
    const card = el.querySelector<HTMLElement>("li");
    const stepPx = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : 0;
    // Counter follows the leftmost card; at the end of the track the last card is in view.
    const leftmost = stepPx > 0 ? Math.round(el.scrollLeft / stepPx) : 0;
    setState({
      index: atEnd && max > 0 ? total - 1 : Math.min(leftmost, total - 1),
      canPrev: el.scrollLeft > 2,
      canNext: !atEnd,
      thumb: el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1,
      progress,
    });
  }, [total]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const step = () => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>("li");
    if (!el || !card) return 0;
    return card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
  };

  const scrollByCards = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * step(), behavior: reduceMotion ? "auto" : "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCards(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCards(-1);
    }
  };

  // Mouse drag-to-scroll. Touch and pen use native scrolling.
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    const el = e.currentTarget;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.dataset.dragging = "true";
    }
    if (d.moved) el.scrollLeft = d.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    const el = e.currentTarget;
    if (!d.moved) return;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    // Settle on the nearest card before snapping is switched back on.
    const s = step();
    const target = s > 0 ? Math.round(el.scrollLeft / s) * s : el.scrollLeft;
    delete el.dataset.dragging;
    el.scrollTo({ left: target, behavior: reduceMotion ? "auto" : "smooth" });
  };

  // Swallow the click that ends a drag so it does not open the card.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const navBtn =
    "inline-flex w-12 h-12 items-center justify-center rounded-full border border-brand-navy text-brand-navy transition-colors duration-200 hover:bg-brand-navy hover:text-white disabled:opacity-25 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange";

  return (
    <section
      id="services"
      className="svc relative bg-[#F5F3EF] text-brand-navy py-[72px] lg:py-[120px] overflow-hidden"
      aria-labelledby="services-heading"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="svc-label">Our Services</p>
            <h2
              id="services-heading"
              className="mt-4 font-heading font-medium tracking-[-0.02em] leading-[1.05] text-[clamp(2rem,4vw,3.25rem)] [text-wrap:balance]"
            >
              Five disciplines.<br className="hidden sm:block" /> One accountable team.
            </h2>
            <p className="mt-5 max-w-[55ch] text-base sm:text-lg leading-relaxed text-brand-navy/70">
              Construction, civil, electrical, fire safety and supply, coordinated under one contract.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <p className="text-sm tabular-nums tracking-[0.12em] text-brand-navy/60" aria-hidden="true">
              <span className="text-brand-navy">{pad(state.index + 1)}</span> / {pad(total)}
            </p>
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={!state.canPrev}
                aria-label="Previous service"
                aria-controls="services-track"
                className={navBtn}
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={!state.canNext}
                aria-label="Next service"
                aria-controls="services-track"
                className={navBtn}
              >
                <ArrowRight className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel: left edge on the container, bleeding to the right viewport edge */}
      <div
        className="svc-viewport relative mt-12 lg:mt-16"
        role="region"
        aria-roledescription="carousel"
        aria-label="Services"
        onKeyDown={onKeyDown}
      >
        <ul
          id="services-track"
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          className="svc-track"
        >
          {services.map((service, i) => {
            const copy = CARD_COPY[service.id];
            const img = CARD_IMAGE[service.id];
            const eager = i < 2;
            return (
              <li key={service.id} className="svc-card">
                <a
                  href={serviceUrl(service.id)}
                  draggable={false}
                  className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-brand-navy/10">
                    <img
                      src={img?.src ?? service.image}
                      alt={copy?.alt ?? service.name}
                      width={img?.width}
                      height={img?.height}
                      loading={eager ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                      className="svc-photo absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-brand-navy/[0.12] transition-opacity duration-700 ease-out group-hover:opacity-0" />
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
                    <div className="absolute left-5 top-5 flex items-center gap-3 text-sm text-white tabular-nums" aria-hidden="true">
                      <span>{pad(i + 1)}</span>
                      <span className="h-px w-8 bg-white/40" />
                    </div>
                  </div>

                  <div className="mt-6 border-t border-brand-navy/[0.12] pt-5">
                    <p className="svc-label">{service.shortTag}</p>
                    <h3 className="mt-2 font-heading text-2xl font-medium leading-tight tracking-[-0.01em] text-brand-navy">
                      {service.name}
                    </h3>
                    {copy && (
                      <p className="mt-3 text-[15px] leading-[1.6] text-brand-navy/70">{copy.description}</p>
                    )}
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy">
                      <span className="svc-underline">View service</span>
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Edge fades, shown only while cards are clipped on that side */}
        <div
          aria-hidden="true"
          className={`svc-fade-left pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-[#F5F3EF] to-transparent transition-opacity duration-300 ${
            state.canPrev ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-[#F5F3EF] to-transparent transition-opacity duration-300 ${
            state.canNext ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Scroll progress */}
        <div className="relative mt-10 h-[2px] bg-brand-navy/15" aria-hidden="true">
          <div
            className="absolute inset-y-0 left-0 bg-brand-orange"
            style={{
              width: `${state.thumb * 100}%`,
              transform: `translateX(${(state.progress * (1 - state.thumb) * 100) / Math.max(state.thumb, 0.01)}%)`,
            }}
          />
        </div>

        {/* Closing line */}
        <div className="mt-16 lg:mt-20 flex flex-col items-center justify-center gap-5 text-center sm:flex-row sm:flex-wrap sm:gap-x-7">
          <p className="text-base sm:text-lg text-brand-navy">Need more than one discipline on your project?</p>
          <div className="flex items-center gap-6">
            <a
              href="#contact"
              className="inline-flex min-h-[48px] items-center justify-center px-6 rounded bg-brand-orange hover:bg-brand-orange-hover text-brand-navy text-sm font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
            >
              Request a Quote
            </a>
            <a
              href={`tel:${SITE_CONTENT.contact.phonePrimaryTel}`}
              className="group inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-navy"
            >
              <span className="svc-underline">Call {SITE_CONTENT.contact.phonePrimary}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
