import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Phone, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SITE_CONTENT } from "../content";
import { serviceUrl } from "../servicesData";
import { CountUp } from "./CountUp";

/* ---------- Data ---------- */

const DISCIPLINES = [
  { name: "Construction", scope: "Structures and buildings", slug: "construction" },
  { name: "Civil works", scope: "Infrastructure and earthworks", slug: "civil" },
  { name: "Electrical", scope: "Power and systems", slug: "electrical" },
  { name: "Fire and safety", scope: "Detection and protection", slug: "fire-safety" },
  { name: "Supply and chemicals", scope: "Procurement and materials", slug: "supply" },
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
    caption: "Materials in stock",
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

const imageSrc = (id: string) => `/assets/hero/${id}.webp`;

const HOLD_MS = 5000;
const PRELOAD_AT_MS = HOLD_MS - 1000;
const SELECT_PAUSE_MS = 8000;

const filled = (v: string) => v.trim() !== "";

const HeroPicture: React.FC<{ id: string; alt: string; className?: string; style?: React.CSSProperties; eager?: boolean }> = ({
  id,
  alt,
  className,
  style,
  eager,
}) => (
  <picture>
    <source srcSet={imageSrc(id)} type="image/webp" />
    <img
      src={imageSrc(id)}
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
  const reduceMotion = !!useReducedMotion();
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

  // Autoplay clock: drives the row progress line, preloads the next slide 1s early, advances after the hold.
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
      if (!preloaded && elapsed >= PRELOAD_AT_MS) {
        preloaded = true;
        ensureLoaded((slide + 1) % SLIDES.length);
      }
      if (elapsed >= HOLD_MS) {
        goTo(slide + 1);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, slide, goTo, ensureLoaded]);

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

  // Staggered fade-up for the text column: 500ms each, 100ms apart.
  const fadeUp = (i: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
        };

  const trust = (
    [
      filled(hero.yearsInOperation) && { value: hero.yearsInOperation, suffix: "+", label: "Years in business", count: true },
      filled(hero.projectsDelivered) && { value: hero.projectsDelivered, suffix: "+", label: "Projects delivered", count: true },
      filled(hero.pecCategory) && { value: `PEC ${hero.pecCategory}`, suffix: "", label: "Registered" },
      { value: "5", suffix: "", label: "Disciplines, one contract" },
      { value: "G-8/1", suffix: "", label: "Office in Islamabad" },
      { value: "Mon to Sat", suffix: "", label: "9:00 to 18:00" },
    ].filter(Boolean) as { value: string; suffix: string; label: string; count?: boolean }[]
  ).slice(0, 4);

  return (
    <section
      id="hero"
      className="relative bg-brand-navy text-white border-b border-white/12 pt-[var(--nav-h)] [--nav-h:80px] md:[--nav-h:104px] lg:[--nav-h:112px]"
      aria-labelledby="hero-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:min-h-[clamp(640px,calc(100svh-var(--nav-h)),900px)]">
        <div className="flex-1 flex items-center py-8 lg:py-8">
          <div className="grid w-full grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-20">
            {/* Text column */}
            <div className="lg:col-span-6 min-w-0">
              <motion.p {...fadeUp(0)} className="flex items-start gap-3 text-[14px] leading-[1.5] text-white/60">
                <span className="mt-[10px] h-px w-6 shrink-0 bg-brand-orange" aria-hidden="true" />
                Islamabad contractor for government, corporate and industrial clients
              </motion.p>

              <motion.h1
                {...fadeUp(1)}
                id="hero-title"
                className="mt-5 font-heading font-medium text-[clamp(2.25rem,min(4.6vw,6.2svh),4.25rem)] leading-[1.06] tracking-[-0.02em] [text-wrap:balance]"
              >
                Construction, electrical and fire safety.
                <br />
                <span className="text-white/55">One accountable team.</span>
              </motion.h1>

              <motion.p {...fadeUp(2)} className="mt-5 max-w-[50ch] text-[18px] leading-[1.65] text-white/75 [text-wrap:pretty]">
                Plus civil works, general supply and construction chemicals. One contract and one named contact,
                from site survey to handover.
              </motion.p>

              <motion.div {...fadeUp(3)} className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a
                  href="#contact"
                  className="inline-flex h-[52px] items-center justify-center rounded px-7 bg-brand-orange hover:bg-brand-orange-hover text-brand-charcoal text-[16px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
                >
                  Request a quote
                </a>
                <a
                  href={`tel:${contact.phonePrimaryTel}`}
                  className="group inline-flex min-h-[44px] items-center gap-2 rounded-sm text-[16px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
                >
                  <Phone className="h-4 w-4 text-white/70" strokeWidth={1.5} aria-hidden="true" />
                  <span className="relative after:absolute after:inset-x-0 after:-bottom-[3px] after:h-px after:bg-brand-orange after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
                    Call {contact.phonePrimary}
                  </span>
                </a>
              </motion.div>

              {/* Disciplines index: selects the image; a second click opens the service */}
              <motion.nav {...fadeUp(4)} aria-label="Disciplines" className="mt-10 lg:mt-14">
                <ol
                  className="border-t border-white/12"
                  onKeyDown={onArrowKeys}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
                  onPointerLeave={() => setHovering(false)}
                  {...focusHandlers}
                >
                  {DISCIPLINES.map((d, i) => {
                    const isActive = activeRow === i;
                    return (
                      <li key={d.slug} className="relative border-b border-white/12">
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
                          className="group flex items-baseline gap-4 py-3 lg:py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-orange"
                        >
                          <span
                            className={`flex-1 text-[18px] transition-colors duration-200 ${
                              isActive ? "text-white" : "text-white/70 group-hover:text-white"
                            }`}
                          >
                            {d.name}
                          </span>
                          <span
                            className={`hidden sm:block text-[14px] transition-colors duration-200 ${
                              isActive ? "text-white/60" : "text-white/35 group-hover:text-white/55"
                            }`}
                          >
                            {d.scope}
                          </span>
                          <ArrowRight
                            className={`h-4 w-4 self-center transition-[opacity,transform,color] duration-200 ${
                              isActive
                                ? "opacity-100 text-brand-orange"
                                : "opacity-0 -translate-x-1 text-white/70 group-hover:opacity-100 group-hover:translate-x-0"
                            }`}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </a>
                        {isActive && !reduceMotion && (
                          <span
                            ref={progressRef}
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-px left-0 h-[2px] w-full origin-left scale-x-0 bg-brand-orange"
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>
              </motion.nav>
            </div>

            {/* Image frame */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="order-first lg:order-none lg:col-span-6 min-w-0"
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
                  className="relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-[6px] border border-white/10 bg-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
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
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-brand-navy/70 to-transparent"
                  />
                  <p
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-5 left-5 min-[1100px]:left-[172px] pr-20 text-[16px] text-white"
                  >
                    <span className="mb-2.5 block h-px w-6 bg-white/40" />
                    {SLIDES[slide].caption}
                  </p>

                  {!reduceMotion && (
                    <button
                      type="button"
                      onClick={() => setPlaying((p) => !p)}
                      aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                      className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-white/20 bg-brand-navy/40 text-white transition-colors hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
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
                  <div className="aspect-[4/3] overflow-hidden rounded-t-[4px] border border-b-0 border-white/20">
                    <HeroPicture id="hse" alt={HSE_ALT} className="h-full w-full object-cover hero-grade" />
                  </div>
                  <figcaption className="rounded-b-[4px] border border-t-0 border-white/20 bg-brand-navy px-3 py-1.5 text-[12px] text-white">
                    HSE on every site
                  </figcaption>
                </figure>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust row */}
        {trust.length > 0 && (
          <dl
            className="grid grid-cols-2 gap-y-5 border-t border-white/12 py-6 sm:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
            style={{ "--cols": trust.length } as React.CSSProperties}
          >
            {trust.map((t) => {
              const numeric = /^\d+$/.test(t.value);
              return (
                <div key={t.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-[13px] text-white/55">{t.label}</dt>
                  <dd className="font-heading text-[26px] font-medium leading-none text-white">
                    {t.count && numeric ? <CountUp value={Number(t.value)} suffix={t.suffix} /> : `${t.value}${t.suffix}`}
                  </dd>
                </div>
              );
            })}
          </dl>
        )}
      </div>
    </section>
  );
};
