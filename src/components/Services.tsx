import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { SITE_CONTENT } from "../content";
import { serviceUrl } from "../servicesData";

// Section copy for the carousel cards. The detailed copy for each service page stays in content.ts.
const CARD_COPY: Record<string, { description: string; alt: string }> = {
  construction: {
    description: "New buildings, renovation and structural works for commercial, institutional and industrial clients, built to your drawings and specifications.",
    alt: "Multi-storey concrete building frame under construction with a tower crane at sunset",
  },
  civil: {
    description: "Roads, drainage, culverts and site development that prepare the ground for the buildings that follow, and keep it working.",
    alt: "Road roller compacting fresh asphalt while workers finish the kerb line",
  },
  electrical: {
    description: "Low-voltage distribution, panels, wiring and lighting, installed, tested and handed over with the documents your facility team needs.",
    alt: "Electrician in a hard hat wiring circuit breakers in a distribution panel",
  },
  "fire-safety": {
    description: "Fire detection, alarm, hydrant and standpipe systems, tested and commissioned before handover.",
    alt: "Red fire sprinkler pipework, hose reel cabinet, alarm call point and extinguisher on a wall",
  },
  supply: {
    description: "Construction chemicals, hardware, electrical and fire safety materials, sourced to specification and delivered to site.",
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

// Infinite loop: the cards render three times and the track lives in the middle copy.
// When scrolling settles in an outer copy, it jumps by one copy width to the identical middle position.
// Only scrollLeft and scroll events are used, so it behaves the same in every browser.
const COPIES = 3;
const AUTOPLAY_MS = 1800;
const RESUME_AFTER_TOUCH_MS = 6000;
const SETTLE_MS = 140;
const SLIDE_MS = 400;

export const Services: React.FC = () => {
  const services = SITE_CONTENT.services;
  const total = services.length;
  const reduceMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const indexRef = useRef(0);
  const settleTimer = useRef<number | undefined>(undefined);
  const touchTimer = useRef<number | undefined>(undefined);
  const animFrame = useRef(0);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [touchHold, setTouchHold] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  /** Distance between card starts (card width + gap). */
  const step = useCallback(() => {
    const el = trackRef.current;
    const cards = el?.querySelectorAll<HTMLElement>(".svc-card");
    if (!el || !cards || cards.length === 0) return 0;
    // Measured between neighbouring cards, so it does not depend on how a browser reports `gap`.
    // Fractional on purpose: a rounded step would end each slide a few pixels off the snap point and tug back.
    if (cards.length > 1) return cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    return cards[0].getBoundingClientRect().width;
  }, []);

  /** Instant jump, ignoring smooth-scroll settings. */
  const jumpTo = useCallback((left: number) => {
    const el = trackRef.current;
    if (!el) return;
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";
    el.scrollLeft = left;
    el.style.scrollBehavior = prev;
  }, []);

  /** Keep the track inside the middle copy. Only called once scrolling has settled. */
  const recenter = useCallback(() => {
    const el = trackRef.current;
    const s = step();
    if (!el || s <= 0 || el.dataset.dragging) return;
    const copyWidth = s * total;
    if (el.scrollLeft < copyWidth - s / 2) jumpTo(el.scrollLeft + copyWidth);
    else if (el.scrollLeft >= copyWidth * 2 - s / 2) jumpTo(el.scrollLeft - copyWidth);
  }, [step, total, jumpTo]);

  const sync = useCallback(() => {
    const el = trackRef.current;
    const s = step();
    if (!el || s <= 0) return;
    const i = ((Math.round(el.scrollLeft / s) % total) + total) % total;
    indexRef.current = i;
    setIndex(i);
  }, [step, total]);

  // Start in the middle copy, and stay on the same card when the layout resizes.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const place = () => {
      const s = step();
      if (s > 0) jumpTo(s * (total + indexRef.current));
      sync();
    };
    place();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", place);
      return () => window.removeEventListener("resize", place);
    }
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => ro.disconnect();
  }, [step, total, jumpTo, sync]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      sync();
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(recenter, SETTLE_MS);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.clearTimeout(settleTimer.current);
    };
  }, [sync, recenter]);

  const scrollByCards = useCallback(
    (dir: 1 | -1) => {
      const el = trackRef.current;
      const s = step();
      if (!el || s <= 0) return;
      recenter();
      if (reduceMotion) {
        el.scrollBy({ left: dir * s, behavior: "auto" });
        return;
      }
      // Native smooth scrolling has a fixed, slow duration, so ease the scroll ourselves.
      // Snapping is switched off while animating so it does not fight each frame.
      cancelAnimationFrame(animFrame.current);
      const from = el.scrollLeft;
      const target = Math.round(from / s) * s + dir * s;
      const start = performance.now();
      el.dataset.dragging = "true";
      const tick = (now: number) => {
        const t = Math.min(1, Math.max(0, (now - start) / SLIDE_MS));
        el.scrollLeft = from + (target - from) * (1 - Math.pow(1 - t, 3));
        if (t < 1) {
          animFrame.current = requestAnimationFrame(tick);
        } else {
          delete el.dataset.dragging;
        }
      };
      animFrame.current = requestAnimationFrame(tick);
    },
    [step, recenter, reduceMotion]
  );

  // Autoplay runs only while the section is on screen, the tab is visible and nobody is interacting.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.25 });
    if (io) io.observe(section);
    else setOnScreen(true);
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const autoplay = playing && !reduceMotion && onScreen && !tabHidden && !hovering && !focusWithin && !touchHold;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => scrollByCards(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplay, scrollByCards]);

  useEffect(
    () => () => {
      window.clearTimeout(touchTimer.current);
      cancelAnimationFrame(animFrame.current);
    },
    []
  );

  /** Touch or drag holds autoplay; it resumes a few seconds after release. */
  const holdAutoplay = () => {
    window.clearTimeout(touchTimer.current);
    setTouchHold(true);
  };
  const releaseAutoplay = () => {
    window.clearTimeout(touchTimer.current);
    touchTimer.current = window.setTimeout(() => setTouchHold(false), RESUME_AFTER_TOUCH_MS);
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
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    holdAutoplay();
    cancelAnimationFrame(animFrame.current);
    delete e.currentTarget.dataset.dragging;
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
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

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    releaseAutoplay();
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
    "inline-flex w-12 h-12 items-center justify-center rounded-full border border-fg text-fg transition-colors duration-200 hover:bg-fg hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

  return (
    <section
      id="services"
      ref={sectionRef}
      className="svc cad-grid relative bg-bg text-fg py-[clamp(72px,9vw,120px)] overflow-hidden"
      aria-labelledby="services-heading"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="svc-label">What we do</p>
            <h2
              id="services-heading"
              className="mt-4 font-heading font-medium tracking-[-0.02em] leading-[1.05] text-[clamp(2rem,4vw,3.25rem)] [text-wrap:balance]"
            >
              Five disciplines.<br className="hidden sm:block" /> One accountable team.
            </h2>
            <p className="mt-5 max-w-[55ch] text-base sm:text-lg leading-relaxed text-fg-muted">
              Construction, civil, electrical, fire safety and supply, planned and delivered together, so your project never depends on five contractors agreeing with each other.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <p className="text-sm tabular-nums text-fg-muted" aria-hidden="true">
              <span className="text-fg">{pad(index + 1)}</span> / {pad(total)}
            </p>
            <div className="flex items-center gap-3">
              {!reduceMotion && (
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause services slideshow" : "Play services slideshow"}
                  aria-controls="services-track"
                  className={`${navBtn} !h-10 !w-10 !border-line-strong`}
                >
                  {playing ? (
                    <Pause className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                  ) : (
                    <Play className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                aria-label="Previous service"
                aria-controls="services-track"
                className={`${navBtn} max-md:hidden`}
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                aria-label="Next service"
                aria-controls="services-track"
                className={`${navBtn} max-md:hidden`}
              >
                <ArrowRight className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Looping carousel: left edge on the container, bleeding to the right viewport edge */}
      <div
        className="svc-viewport relative mt-12 lg:mt-16"
        role="region"
        aria-roledescription="carousel"
        aria-label="Services"
        onKeyDown={onKeyDown}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onFocus={() => setFocusWithin(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
        }}
      >
        <div
          id="services-track"
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onTouchStart={holdAutoplay}
          onTouchEnd={releaseAutoplay}
          onClickCapture={onClickCapture}
          aria-live={autoplay ? "off" : "polite"}
          className="svc-track"
        >
          {Array.from({ length: COPIES }, (_, copyIndex) =>
            services.map((service, i) => {
              const copy = CARD_COPY[service.id];
              const img = CARD_IMAGE[service.id];
              // Only the middle copy is reachable by keyboard and assistive tech; the others are visual loop padding.
              const isClone = copyIndex !== 1;
              return (
                <div
                  key={`${copyIndex}-${service.id}`}
                  className="svc-card"
                  aria-hidden={isClone || undefined}
                  role={isClone ? undefined : "group"}
                  aria-roledescription={isClone ? undefined : "slide"}
                  aria-label={isClone ? undefined : `${i + 1} of ${total}: ${service.name}`}
                >
                  <a
                    href={serviceUrl(service.id)}
                    tabIndex={isClone ? -1 : undefined}
                    draggable={false}
                    className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-surface">
                      <img
                        src={img?.src ?? service.image}
                        srcSet={img ? `${img.src.replace(".webp", "-480.webp")} 480w, ${img.src} ${img.width}w` : undefined}
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 44vw, 82vw"
                        alt={isClone ? "" : (copy?.alt ?? service.name)}
                        width={img?.width}
                        height={img?.height}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="svc-photo absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-midnight/40 to-transparent" />
                      <div className="absolute left-5 top-5 flex items-center gap-3 text-sm text-white tabular-nums" aria-hidden="true">
                        <span>{pad(i + 1)}</span>
                        <span className="h-px w-8 bg-white/40" />
                      </div>
                    </div>

                    <div className="mt-6 border-t border-line pt-5">
                      <p className="svc-label">{service.shortTag}</p>
                      {isClone ? (
                        <p className="mt-2 font-heading text-2xl font-medium leading-tight tracking-[-0.01em] text-fg">
                          {service.name}
                        </p>
                      ) : (
                        <h3 className="mt-2 font-heading text-2xl font-medium leading-tight tracking-[-0.01em] text-fg">
                          {service.name}
                        </h3>
                      )}
                      {copy && (
                        <p className="mt-3 text-[15px] leading-[1.6] text-fg-muted">{copy.description}</p>
                      )}
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-fg">
                        <span className="svc-underline">View service</span>
                        <ArrowRight
                          className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </a>
                </div>
              );
            })
          )}
        </div>

        {/* Edge fades: the track never ends, so both stay on */}
        <div
          aria-hidden="true"
          className="svc-fade-left pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-bg to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-bg to-transparent"
        />
      </div>

      <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
        {/* Position in the loop: one segment per service */}
        <div className="relative mt-10 h-[2px] bg-line" aria-hidden="true">
          <div
            className="absolute inset-y-0 left-0 bg-accent transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${100 / total}%`, transform: `translateX(${index * 100}%)` }}
          />
        </div>

        {/* Closing line */}
        <div className="mt-16 lg:mt-20 flex flex-col items-center justify-center gap-5 text-center sm:flex-row sm:flex-wrap sm:gap-x-7">
          <p className="text-base sm:text-lg text-fg">Need more than one discipline on your project?</p>
          <div className="flex items-center gap-6">
            <a
              href="#contact"
              className="inline-flex min-h-[48px] items-center justify-center px-6 rounded-[4px] bg-accent hover:bg-accent-hover text-on-accent text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Request a quote
            </a>
            <a
              href={`tel:${SITE_CONTENT.contact.phonePrimaryTel}`}
              className="group inline-flex min-h-[44px] items-center text-sm font-semibold text-fg"
            >
              <span className="svc-underline">Call {SITE_CONTENT.contact.phonePrimary}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
