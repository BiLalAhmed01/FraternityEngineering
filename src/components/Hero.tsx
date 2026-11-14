import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Phone, Play } from "lucide-react";
import { SITE_CONTENT } from "../content";
import { serviceUrl } from "../servicesData";
import { CountUp } from "./CountUp";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/* ---------- Data ---------- */

const DISCIPLINES = [
  { name: "Construction", scope: "Structures and buildings", slug: "construction" },
  { name: "Civil works", scope: "Infrastructure and earthworks", slug: "civil" },
  { name: "Electrical", scope: "Power and systems", slug: "electrical" },
  { name: "Fire and safety", scope: "Detection and protection", slug: "fire-safety" },
  { name: "Chemicals and materials", scope: "Procurement and chemical supplies", slug: "supply" },
];

interface Slide {
  id: string;
  /** Index into DISCIPLINES, or null for the intro slide. */
  row: number | null;
  caption: string;
  alt: string;
  position: string;
}

const SLIDES: Slide[] = [
  {
    id: "planning",
    row: null,
    caption: "Planned before it's built",
    alt: "FTE helmet and site plans on a desk overlooking a building under construction at sunset",
    position: "40% 50%",
  },
  {
    id: "construction",
    row: 0,
    caption: "Drawings checked on site",
    alt: "FTE engineer reviewing plans in front of a tower crane at a concrete building site",
    position: "40% 50%",
  },
  {
    id: "civil",
    row: 1,
    caption: "Foundation works",
    alt: "FTE engineer reviewing drawings beside foundation walls and an excavator on a civil works site",
    position: "30% 50%",
  },
  {
    id: "electrical",
    row: 2,
    caption: "Distribution panel wiring",
    alt: "FTE technician wiring a low-voltage distribution panel",
    position: "50% 50%",
  },
  {
    id: "fire-safety",
    row: 3,
    caption: "Fire alarm and protection",
    alt: "FTE technician at a fire alarm control panel beside red fire protection pipework",
    position: "50% 50%",
  },
  {
    id: "general-supply",
    row: 4,
    caption: "Chemical supplies in stock",
    alt: "Warehouse shelving with cables, pipes, breakers and safety equipment",
    position: "50% 50%",
  },
  {
    id: "chemicals",
    row: 4,
    caption: "Construction chemicals",
    alt: "Warehouse stock of construction chemicals, adhesives and waterproofing products",
    position: "35% 50%",
  },
];

const HSE_ALT = "FTE site team in a safety toolbox talk in front of an HSE board";

/** Responsive set for a hero image: 480/768/1200 (HSE inset only needs 360). */
const heroSrcSet = (id: string, widths: number[]) => widths.map((w) => `/assets/hero/${id}-${w}.webp ${w}w`).join(", ");
const SLIDE_WIDTHS = [480, 768, 1200];
// Frame: up to 568px wide on desktop (4:5, so the square image renders ~710px), full width minus gutters on smaller screens.
const SLIDE_SIZES = "(min-width: 1024px) 568px, calc(100vw - 40px)";

const HOLD_MS = 3000;
/** The next slide starts downloading this far into the hold, after the current one has settled. */
const PRELOAD_AT_MS = 400;
/** If the next photo is still not ready this long after the hold, advance anyway so a bad connection never stalls. */
const MAX_WAIT_MS = 5000;
const SELECT_PAUSE_MS = 8000;

const filled = (v: string) => v.trim() !== "";

/* established 2017 */
const ESTABLISHED_YEAR = 2017;

const HeroPicture: React.FC<{
  id: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  eager?: boolean;
  widths?: number[];
  sizes?: string;
}> = ({ id, alt, className, style, eager, widths = SLIDE_WIDTHS, sizes = SLIDE_SIZES }) => (
  <picture>
    <source srcSet={heroSrcSet(id, widths)} sizes={sizes} type="image/webp" />
    <img
      src={`/assets/hero/${id}-${widths[widths.length - 1]}.webp`}
      srcSet={heroSrcSet(id, widths)}
      sizes={sizes}
      alt={alt}
      width={1200}
      height={1200}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      className={className}
      style={style}
    />
  </picture>
);

/* ---------- Hero ---------- */

export const Hero: React.FC = () => {
  const reduceMotion = usePrefersReducedMotion();
  const { hero, contact } = SITE_CONTENT;

  const [slide, setSlide] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [holding, setHolding] = useState(false);

  const running = playing && !hovering && !focusWithin && !tabHidden && !holding && !reduceMotion;
  const activeRow = SLIDES[slide].row;

  const progressRef = useRef<HTMLSpanElement | null>(null);
  const elapsedRef = useRef(0);
  const holdTimer = useRef<number | undefined>(undefined);

  const ensureLoaded = useCallback((index: number) => {
    setLoaded((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
  }, []);

  /** Slides whose photo has been downloaded and decoded. Autoplay only advances onto a ready slide. */
  const readyRef = useRef<Set<number>>(new Set([0]));
  const preloading = useRef<Set<number>>(new Set());

  /** Fetches and decodes a slide's photo (same srcset and sizes as the <picture>, so it is a cache hit later). */
  const preloadSlide = useCallback(
    (index: number) => {
      const i = (index + SLIDES.length) % SLIDES.length;
      if (readyRef.current.has(i) || preloading.current.has(i)) return;
      preloading.current.add(i);
      const id = SLIDES[i].id;
      const img = new Image();
      const done = () => {
        readyRef.current.add(i);
        preloading.current.delete(i);
        ensureLoaded(i);
      };
      img.sizes = SLIDE_SIZES;
      img.srcset = heroSrcSet(id, SLIDE_WIDTHS);
      img.src = `/assets/hero/${id}-${SLIDE_WIDTHS[SLIDE_WIDTHS.length - 1]}.webp`;
      if (typeof img.decode === "function") img.decode().then(done, done);
      else if (img.complete) done();
      else {
        img.onload = done;
        img.onerror = done;
      }
    },
    [ensureLoaded]
  );

  const goTo = useCallback(
    (index: number) => {
      const next = (index + SLIDES.length) % SLIDES.length;
      ensureLoaded(next);
      elapsedRef.current = 0;
      if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";
      setSlide(next);
    },
    [ensureLoaded]
  );

  /** User interaction: pause autoplay for 8 seconds. */
  const holdAutoplay = useCallback(() => {
    setHolding(true);
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setHolding(false), SELECT_PAUSE_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(holdTimer.current), []);

  const selectRow = (row: number) => {
    holdAutoplay();
    if (activeRow === row) return;
    goTo(SLIDES.findIndex((s) => s.row === row));
  };

  const step = (dir: 1 | -1) => {
    holdAutoplay();
    goTo(slide + dir);
  };

  // Autoplay clock: drives the row progress line, preloads the next slide, advances after the hold once that
  // slide is ready (so slow connections wait instead of showing an empty frame).
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    let preloaded = false;
    const tick = (now: number) => {
      elapsedRef.current += now - last;
      last = now;
      const elapsed = elapsedRef.current;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${Math.min(elapsed / HOLD_MS, 1)})`;
      const next = (slide + 1) % SLIDES.length;
      if (!preloaded && elapsed >= PRELOAD_AT_MS) {
        preloaded = true;
        preloadSlide(next);
      }
      if (elapsed >= HOLD_MS && (readyRef.current.has(next) || elapsed >= HOLD_MS + MAX_WAIT_MS)) {
        goTo(slide + 1);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, slide, goTo, preloadSlide]);

  // Pause while the tab is hidden.
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const onArrowKeys = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const focusHandlers = {
    onFocus: () => setFocusWithin(true),
    onBlur: (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
    },
  };

  // Staggered fade-up for the text column (500ms each, 100ms apart). Pure CSS, so it plays from the
  // prerendered HTML without waiting for JavaScript; off under reduced motion (see .hero-rise).
  const riseDelay = (i: number): React.CSSProperties => ({ animationDelay: `${i * 100}ms` });

  const trust = (
    [
      { value: String(new Date().getFullYear() - ESTABLISHED_YEAR), suffix: "+", label: "Years in business", count: true },
      filled(hero.projectsDelivered) && { value: hero.projectsDelivered, suffix: "+", label: "Projects delivered", count: true },
      filled(hero.pecCategory) && { value: `PEC ${hero.pecCategory}`, suffix: "", label: "Registered" },
      { value: "5", suffix: "", label: "Disciplines" },
    ].filter(Boolean) as { value: string; suffix: string; label: string; count?: boolean }[]
  ).slice(0, 4);

  return (
    <section
      id="hero"
      className="theme-dark cad-grid relative bg-midnight text-fg border-b border-line pt-[var(--nav-h)] [--nav-h:64px] lg:[--nav-h:80px]"
      aria-labelledby="hero-title"
    >
      <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)] flex flex-col lg:min-h-[clamp(640px,calc(100svh-var(--nav-h)),900px)]">
        <div className="flex-1 flex items-center py-8 lg:py-8">
          <div className="grid w-full grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-20">
            {/* Text column */}
            <div className="lg:col-span-6 min-w-0">
              <p style={riseDelay(0)} className="hero-rise flex items-start gap-3 text-[14px] leading-[1.5] text-fg-subtle">
                <span className="mt-[10px] h-px w-6 shrink-0 bg-line-strong" aria-hidden="true" />
                Since 2017 · Islamabad, Pakistan
              </p>

              {/* Alternative headline: "Construction, electrical and fire safety." / "One accountable team." */}
              <h1
                style={riseDelay(1)}
                id="hero-title"
                className="hero-rise mt-5 font-heading font-medium text-[clamp(2.25rem,min(4.6vw,6.2svh),4.25rem)] leading-[1.06] tracking-[-0.02em] [text-wrap:balance]"
              >
                {/* Non-breaking spaces keep each phrase on one line */}
                Build&nbsp;it. Wire&nbsp;it. Protect&nbsp;it.
                <br />
                <span className="text-accent">One accountable team.</span>
              </h1>

              <p style={riseDelay(2)} className="hero-rise mt-5 max-w-[50ch] text-[18px] leading-[1.65] text-fg-muted [text-wrap:pretty]">
                Civil, telecommunications, electrical and fire and safety, delivered by one team across Pakistan. One contract, one point of accountability, and quality built to last at a price that makes sense.
              </p>

              <div style={riseDelay(3)} className="hero-rise mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a
                  href="#contact"
                  className="inline-flex h-[52px] items-center justify-center rounded px-7 bg-accent hover:bg-accent-hover text-on-accent text-[16px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  Request a quote
                </a>
                <a
                  href={`tel:${contact.phonePrimaryTel}`}
                  className="group inline-flex min-h-[44px] items-center gap-2 rounded-sm text-[16px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <Phone className="h-4 w-4 text-icon" strokeWidth={1.5} aria-hidden="true" />
                  <span className="relative after:absolute after:inset-x-0 after:-bottom-[3px] after:h-px after:bg-fg after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
                    Call {contact.phonePrimary}
                  </span>
                </a>
              </div>

              {/* Disciplines index: selects the image; a second click opens the service */}
              <nav style={riseDelay(4)} aria-label="Disciplines" className="hero-rise mt-10 lg:mt-14">
                <ol
                  className="border-t border-line"
                  onKeyDown={onArrowKeys}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
                  onPointerLeave={() => setHovering(false)}
                  {...focusHandlers}
                >
                  {DISCIPLINES.map((d, i) => {
                    const isActive = activeRow === i;
                    return (
                      <li key={d.slug} className="relative border-b border-line">
                        {isActive && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-4 z-[1] w-[2px] bg-accent" />}
                        <a
                          href={serviceUrl(d.slug)}
                          aria-current={isActive ? "true" : undefined}
                          onPointerEnter={(e) => e.pointerType === "mouse" && selectRow(i)}
                          onFocus={() => selectRow(i)}
                          onClick={(e) => {
                            // First tap selects; a click on the already-active row follows the link.
                            if (!isActive) {
                              e.preventDefault();
                              selectRow(i);
                            }
                          }}
                          className={`group -mx-4 flex items-baseline gap-4 px-4 py-3 lg:py-4 ${isActive ? "bg-navy" : ""} focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus`}
                        >
                          <span
                            className={`flex-1 text-[18px] ${
                              isActive ? "text-white" : "text-fg-muted group-hover:text-white"
                            }`}
                          >
                            {d.name}
                          </span>
                          <span
                            className={`hidden sm:block text-[14px] ${
                              isActive ? "text-fg-muted" : "text-fg-subtle group-hover:text-fg-muted"
                            }`}
                          >
                            {d.scope}
                          </span>
                          <ArrowRight
                            className={`h-4 w-4 self-center transition-[opacity,transform] duration-200 ${
                              isActive
                                ? "opacity-100 text-accent"
                                : "opacity-0 -translate-x-1 text-icon group-hover:opacity-100 group-hover:translate-x-0"
                            }`}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </a>
                        {isActive && !reduceMotion && (
                          <span
                            ref={progressRef}
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-px left-0 h-[2px] w-full origin-left scale-x-0 bg-accent"
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>

            {/* Image frame */}
            <div
              className="hero-frame-in order-first lg:order-none lg:col-span-6 min-w-0"
            >
              <div className="relative lg:ml-auto lg:w-full lg:max-w-[calc((100svh-160px)*0.8)]">
                <div
                  role="region"
                  aria-roledescription="carousel"
                  aria-label="Our disciplines"
                  tabIndex={0}
                  onKeyDown={onArrowKeys}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
                  onPointerLeave={() => setHovering(false)}
                  {...focusHandlers}
                  className="relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-[6px] border border-line-strong bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <div aria-live={running ? "off" : "polite"}>
                    {SLIDES.map((s, i) => {
                      const isCurrent = i === slide;
                      return (
                        <div
                          key={s.id}
                          role="group"
                          aria-roledescription="slide"
                          aria-label={`${i + 1} of ${SLIDES.length}: ${s.caption}`}
                          aria-hidden={!isCurrent}
                          className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out motion-reduce:transition-none ${
                            isCurrent ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {loaded.has(i) && (
                            <HeroPicture
                              id={s.id}
                              alt={s.alt}
                              eager={i === 0}
                              className={`hero-slide-img h-full w-full object-cover ${isCurrent ? "is-current" : ""}`}
                              style={{
                                objectPosition: s.position,
                                animationPlayState: running ? "running" : "paused",
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Caption over a soft navy gradient */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-midnight/70 to-transparent"
                  />
                  <p
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-5 left-5 min-[1100px]:left-[172px] pr-20 text-[16px] text-white"
                  >
                    <span className="mb-2.5 block h-px w-6 bg-line-strong" />
                    {SLIDES[slide].caption}
                  </p>

                  {!reduceMotion && (
                    <button
                      type="button"
                      onClick={() => setPlaying((p) => !p)}
                      aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                      className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-line-strong bg-navy/40 text-white transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      {playing ? (
                        <Pause className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      ) : (
                        <Play className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      )}
                    </button>
                  )}
                </div>

                {/* HSE inset (wide desktop only); fixed, not part of the slideshow */}
                <figure className="absolute -left-8 -bottom-6 hidden w-[180px] min-[1100px]:block">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-[4px] border border-b-0 border-line-strong">
                    <HeroPicture id="hse" alt={HSE_ALT} widths={[360]} sizes="180px" className="h-full w-full object-cover hero-grade" />
                  </div>
                  <figcaption className="rounded-b-[4px] border border-t-0 border-line-strong bg-navy px-3 py-1.5 text-[12px] text-white">
                    HSE on every site
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust row: full-width navy band */}
      {trust.length > 0 && (
        <div className="border-t border-line bg-navy">
          <dl
            className="mx-auto grid max-w-7xl grid-cols-2 gap-y-5 px-[clamp(20px,5vw,64px)] py-7 sm:divide-x sm:divide-line sm:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
            style={{ "--cols": trust.length } as React.CSSProperties}
          >
            {trust.map((t) => {
              const numeric = /^\d+$/.test(t.value);
              return (
                <div key={t.label} className="flex flex-col-reverse sm:pl-6 sm:first:pl-0">
                  <dt className="mt-1 text-[13px] text-fg-muted">{t.label}</dt>
                  <dd className="font-heading text-[28px] font-medium leading-none text-white">
                    {t.count && numeric ? <CountUp value={Number(t.value)} suffix={t.suffix} /> : `${t.value}${t.suffix}`}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}
    </section>
  );
};
