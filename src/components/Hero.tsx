import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export const Hero: React.FC = () => {
  const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setGridOffset({ x: x * 18, y: y * 18 });
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-[94vh] flex items-center bg-brand-charcoal overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24 text-white"
      aria-label="Fraternity Engineering Introduction"
    >
      {/* Background Layer 1: Interactive Blueprint Grid shifting with cursor */}
      <div
        className="absolute inset-0 bg-blueprint-grid opacity-80 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${gridOffset.x}px, ${gridOffset.y}px, 0)`,
        }}
      />

      {/* Background Layer 2: Radial Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-charcoal/50 to-brand-charcoal pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Architectural Branding, Headlines & Engagement */}
          <div className="lg:col-span-7 space-y-6 md:space-y-7">
            {/* Kicker with tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded bg-white/[0.06] border border-white/10 text-brand-orange kicker-label backdrop-blur-md shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange" />
              </span>
              <span>Makes Life Easier.</span>
            </motion.div>

            {/* Main Headline: Concrete utility */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white tracking-tight leading-[1.06] overflow-hidden">
              <span className="inline-flex flex-wrap items-baseline gap-x-3 sm:gap-x-4">
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                >
                  Construction, electrical and fire safety,
                </motion.span>
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.29,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                >
                  delivered by <span className="text-brand-orange">one team.</span>
                </motion.span>
              </span>
            </h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="text-base sm:text-lg md:text-xl text-brand-stone font-normal max-w-2xl leading-relaxed"
            >
              Fraternity Engineering builds, wires and protects facilities for government, corporate and industrial clients across Pakistan, from Islamabad. One contract. One point of contact.
            </motion.p>

            {/* Single Primary Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.58 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-brand-charcoal font-bold text-sm md:text-base uppercase tracking-wider rounded transition-colors shadow-xl hover:shadow-orange-500/25 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-orange focus-visible:ring-offset-brand-charcoal"
              >
                <span>Request a quote</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>

              <a
                href="#work"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-brand-stone hover:text-white transition-colors font-medium text-sm md:text-base"
              >
                <span>See our work</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Grounding Cards - Removed generic feature cards */}
          </div>

          {/* Right Column: Hero Photograph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            {/* Clean Architectural Frame */}
            <div className="relative rounded-2xl border border-white/15 bg-brand-charcoal backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Clean Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                  <span className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
                    FTE | INTEGRATED ENGINEERING
                  </span>
                </div>
                <div className="font-mono text-[10px] text-brand-stone/70">
                  ISLAMABAD, PAKISTAN
                </div>
              </div>

              {/* Hero Photograph */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/assets/hero.webp"
                  alt="FTE Engineering Project"
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* Subtle dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/20 to-transparent pointer-events-none" />
              </div>

              {/* Clean Footer */}
              <div className="px-4 py-2.5 border-t border-white/10 bg-black/30 flex items-center justify-between text-[10px] font-mono text-brand-stone/70">
                <span>PROJECT PHOTOGRAPHY</span>
                <span className="text-brand-orange">REAL ENGINEERING WORK</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
