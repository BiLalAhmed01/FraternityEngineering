import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  CircleCheck,
  FireExtinguisher,
  MessageCircle,
  Phone,
  TrafficCone,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SITE_CONTENT } from "../content";
import { serviceUrl } from "../servicesData";

const SLIDE_INTERVAL_MS = 6000;

// Large-image crossfade. The first slide is preloaded in index.html.
const SLIDES = [
  {
    src: "/assets/hero.webp",
    width: 1600,
    height: 1280,
    caption: "Integrated engineering",
    alt: "Modern glass office building at dusk beside a curved road interchange under construction",
  },
  {
    src: "/assets/service-construction.webp",
    width: 1024,
    height: 1536,
    caption: "Construction",
    alt: "Building construction site with structural framework and work in progress",
  },
  {
    src: "/assets/service-civil.webp",
    width: 1024,
    height: 1536,
    caption: "Civil",
    alt: "Civil engineering works: concrete, earthworks and site infrastructure",
  },
  {
    src: "/assets/service-electrical.webp",
    width: 1024,
    height: 1536,
    caption: "Electrical",
    alt: "Electrical installation with distribution panel wiring and cabling",
  },
  {
    src: "/assets/service-fire.webp",
    width: 1024,
    height: 1536,
    caption: "Fire & Safety",
    alt: "Fire protection and safety equipment installed in a facility",
  },
  {
    src: "/assets/service-supply.webp",
    width: 1024,
    height: 1536,
    caption: "Supply",
    alt: "Engineering materials and equipment ready for supply and delivery",
  },
];

const STRIP_ICONS: Record<string, { label: string; icon: LucideIcon }> = {
  construction: { label: "Construction", icon: Building2 },
  civil: { label: "Civil", icon: TrafficCone },
  electrical: { label: "Electrical", icon: Zap },
  "fire-safety": { label: "Fire & Safety", icon: FireExtinguisher },
  supply: { label: "Supply", icon: Truck },
};

const HERO_CLIENTS = ["NESCOM", "CDA", "PTCL", "Nayatel"];

const LOGO_SIZES: Record<string, { width: number; height: number }> = {
  NESCOM: { width: 302, height: 330 },
  CDA: { width: 400, height: 400 },
  PTCL: { width: 400, height: 151 },
  Nayatel: { width: 400, height: 133 },
};

const filled = (v: string) => v.trim() !== "";

export const Hero: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 });
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { hero, contact, services, clientLogos } = SITE_CONTENT;

  // Crossfade the large image; paused on hover/focus, off for reduced motion.
  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused]);

  // Scroll cue hides for good after the first scroll.
  useEffect(() => {
    if (scrolled) return;
    const onScroll = () => {
      if (window.scrollY > 8) setScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolled]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setGridOffset({ x: x * 18, y: y * 18 });
  };

  // Staggered fade-up: 150ms steps, 500ms each.
  const fadeUp = (step: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: step * 0.15, ease: [0.22, 1, 0.36, 1] as const },
        };

  const trustFacts = [
    filled(hero.yearsInOperation) && `${hero.yearsInOperation}+ years`,
    filled(hero.projectsDelivered) && `${hero.projectsDelivered}+ projects delivered`,
    filled(hero.pecCategory) && `PEC ${hero.pecCategory} registered`,
  ].filter(Boolean) as string[];

  const assurances = [
    "Free site visit",
    "Itemised BOQ",
    filled(contact.replyHours) && `Reply within ${contact.replyHours} hours`,
  ].filter(Boolean) as string[];

  const heroClients = HERO_CLIENTS.map((name) => clientLogos.find((c) => c.name === name)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative bg-brand-charcoal overflow-hidden text-white pt-[var(--nav-h)] [--nav-h:80px] md:[--nav-h:104px] lg:[--nav-h:112px]"
      aria-label="Fraternity Engineering Introduction"
    >
      {/* Background Layer 1: Interactive Blueprint Grid shifting with cursor (kept faint for text contrast) */}
      <div
        className="absolute inset-0 bg-blueprint-grid opacity-40 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${gridOffset.x}px, ${gridOffset.y}px, 0)`,
        }}
      />

      {/* Background Layer 2: Radial Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-charcoal/50 to-brand-charcoal pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100svh-var(--nav-h))] flex flex-col">
        {/* Main two-column content, vertically centred in the space above the strip */}
        <div className="flex-1 flex items-center py-8 md:py-10">
          <div className="grid w-full grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-12 items-center">
            {/* Left Column: text and actions */}
            <div className="min-w-0 space-y-6">
              <motion.div
                {...fadeUp(0)}
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-brand-orange kicker-label !text-[0.75rem] sm:!text-[0.8125rem] backdrop-blur-md shadow-sm"
              >
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange" />
                </span>
                <span>Construction · Electrical · Fire Safety · Supply</span>
              </motion.div>

              <motion.h1
                {...fadeUp(1)}
                className="font-heading font-bold text-white tracking-tight leading-[1.08] [text-wrap:balance] text-[clamp(2rem,8.5vw,2.25rem)] sm:text-[clamp(2.25rem,4.5vw,4rem)]"
              >
                Construction, electrical and fire safety.
                <br />
                <span className="text-brand-orange">One accountable team.</span>
              </motion.h1>

              <motion.p
                {...fadeUp(2)}
                className="text-base sm:text-lg text-brand-stone font-normal max-w-[52ch] leading-relaxed [text-wrap:pretty]"
              >
                One contract and one point of contact, from site survey to handover. Serving government, corporate and industrial clients across Pakistan.
              </motion.p>

              <motion.div {...fadeUp(3)} className="space-y-4 pt-1">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href="#contact"
                    className="group inline-flex min-h-[52px] items-center justify-center gap-3 px-7 py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-brand-charcoal font-bold text-sm md:text-base uppercase tracking-wider rounded transition-colors shadow-xl hover:shadow-orange-500/25 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-orange focus-visible:ring-offset-brand-charcoal"
                  >
                    <span>Request a Quote</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>

                  <a
                    href={`tel:${contact.phonePrimaryTel}`}
                    className="inline-flex min-h-[52px] items-center justify-center gap-2.5 px-6 py-3.5 border border-white/30 hover:border-brand-orange hover:text-brand-orange text-white font-bold text-sm md:text-base tracking-wide rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-orange focus-visible:ring-offset-brand-charcoal"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span>Call {contact.phonePrimary}</span>
                  </a>

                  <a
                    href="https://wa.me/923315095004"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    title="Chat on WhatsApp"
                    className="inline-flex min-h-[52px] sm:w-[52px] items-center justify-center gap-2.5 px-6 sm:px-0 border border-white/30 hover:border-[#25D366] text-white hover:text-[#25D366] font-bold text-sm rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-orange focus-visible:ring-offset-brand-charcoal"
                  >
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                    <span className="sm:hidden" aria-hidden="true">WhatsApp</span>
                  </a>
                </div>

                <p className="flex items-start gap-2 text-sm text-brand-stone">
                  <CircleCheck className="w-4 h-4 mt-0.5 shrink-0 text-brand-orange" aria-hidden="true" />
                  <span>{assurances.join(" · ")}</span>
                </p>
              </motion.div>
            </div>

            {/* Right Column: image composition */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="relative min-w-0 lg:pl-8 lg:pr-5 lg:pb-10 lg:pt-6"
            >
              <div
                className="relative aspect-[5/4] rounded-2xl overflow-hidden border border-white/15 bg-brand-navy shadow-2xl shadow-black/40"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {SLIDES.map((s, i) => (
                  <img
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    width={s.width}
                    height={s.height}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                    decoding={i === 0 ? "sync" : "async"}
                    aria-hidden={i !== slide}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                      i === slide ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/40 via-transparent to-transparent pointer-events-none" />

                {/* Current discipline caption */}
                <span
                  className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-charcoal/75 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-wider text-white"
                  aria-hidden="true"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  {SLIDES[slide].caption}
                </span>
              </div>

              {/* Overlapping detail images (desktop only) */}
              <img
                src="/assets/service-electrical.webp"
                alt="Close-up of electrical distribution panel wiring"
                width={1024}
                height={1536}
                loading="lazy"
                decoding="async"
                className="hidden lg:block absolute left-0 bottom-0 w-[30%] aspect-[3/4] object-cover rounded-xl border-4 border-brand-navy shadow-2xl shadow-black/50"
              />
              <img
                src="/assets/service-fire.webp"
                alt="Fire safety equipment mounted in a building"
                width={1024}
                height={1536}
                loading="lazy"
                decoding="async"
                className="hidden lg:block absolute right-0 top-0 w-[24%] aspect-[3/4] object-cover rounded-xl border-4 border-brand-navy shadow-2xl shadow-black/50"
              />

              {/* Floating glass badge (desktop only) */}
              <div className="hidden lg:flex absolute right-6 bottom-2 items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/30">
                <span className="font-heading font-bold text-lg leading-none text-white">
                  5 disciplines <span className="text-brand-orange">·</span> 1 contract
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue (replaces the corner scroll arrow); hides after first scroll */}
        <a
          href="#services"
          aria-label="Scroll to services"
          tabIndex={scrolled ? -1 : 0}
          className={`hidden md:flex self-center flex-col items-center gap-0.5 mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-stone hover:text-white transition-opacity duration-500 ${
            scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <span>Scroll</span>
          <ChevronDown className="w-4 h-4 text-brand-orange motion-safe:animate-bounce" aria-hidden="true" />
        </a>

        {/* Service strip + trust row, pinned to the bottom of the hero */}
        <motion.div {...fadeUp(4)} className="pb-6 lg:pb-8">
          <nav aria-label="Our services">
            <ul className="-mx-4 px-4 sm:mx-0 sm:px-0 flex lg:grid lg:grid-cols-5 gap-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-1">
              {services.map((svc) => {
                const meta = STRIP_ICONS[svc.id];
                if (!meta) return null;
                const Icon = meta.icon;
                return (
                  <li key={svc.id} className="snap-start shrink-0 w-[72%] sm:w-[40%] lg:w-auto">
                    <a
                      href={serviceUrl(svc.id)}
                      className="group flex h-full items-start gap-3 p-4 rounded-lg bg-white/[0.04] border border-white/10 border-t-2 border-t-transparent hover:border-t-brand-orange hover:bg-white/[0.07] hover:-translate-y-1 transition-[transform,background-color,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                    >
                      <Icon className="w-5 h-5 mt-0.5 shrink-0 text-brand-orange" strokeWidth={1.75} aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block font-heading font-bold text-base leading-tight text-white">{meta.label}</span>
                        <span className="block mt-1 text-xs leading-snug text-brand-stone">{svc.shortTag}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-4">
            {trustFacts.length > 0 && (
              <p className="text-xs font-bold uppercase tracking-wider text-brand-stone">
                {trustFacts.join(" · ")}
              </p>
            )}
            {heroClients.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6">
                <span className="text-xs uppercase tracking-wider text-brand-stone shrink-0">Clients include</span>
                <ul className="flex items-center gap-2 sm:gap-3">
                  {heroClients.map((c) => (
                    <li
                      key={c.name}
                      className="group/logo flex items-center h-10 sm:h-11 px-2.5 rounded-md bg-brand-cream/90 hover:bg-white transition-colors"
                    >
                      <img
                        src={c.logo}
                        alt={c.fullName}
                        title={c.fullName}
                        width={LOGO_SIZES[c.name]?.width}
                        height={LOGO_SIZES[c.name]?.height}
                        loading="lazy"
                        decoding="async"
                        className="h-6 sm:h-7 w-auto object-contain grayscale opacity-75 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-[filter,opacity] duration-300"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
