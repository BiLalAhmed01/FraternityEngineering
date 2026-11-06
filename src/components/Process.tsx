import React, { useState, useRef, useEffect } from "react";
import { SITE_CONTENT } from "../content";
import { MessageSquareText, FileSpreadsheet, HardHat, CheckCheck } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";

export const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // Automatically advance active step based on scroll depth
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest < 0.25) setActiveStep(0);
      else if (latest < 0.5) setActiveStep(1);
      else if (latest < 0.75) setActiveStep(2);
      else setActiveStep(3);
    });
  }, [scrollYProgress]);

  const stepIcons = [
    <MessageSquareText key="1" className="w-5 h-5" />,
    <FileSpreadsheet key="2" className="w-5 h-5" />,
    <HardHat key="3" className="w-5 h-5" />,
    <CheckCheck key="4" className="w-5 h-5" />,
  ];

  return (
    <section
      id="process"
      ref={containerRef}
      className="bg-brand-charcoal text-white py-20 md:py-28 relative overflow-hidden"
      aria-label="Engineering Execution Process"
    >
      <div className="absolute inset-0 bg-blueprint-grid opacity-35 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="kicker-label text-brand-orange mb-2">Our Operating Method</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            How we deliver your project.
          </h2>
          <div className="w-16 h-1 bg-brand-orange mt-4 mb-4" />
          <p className="text-base text-brand-stone">
            A structured four-phase delivery workflow designed to eliminate ambiguity, enforce budget
            discipline, and guarantee technical compliance.
          </p>
        </div>

        {/* 4-Step Timeline with scroll-linked drawn line */}
        <div className="relative">
          {/* Desktop Progress Line (Connecting horizontal line) */}
          <div className="hidden lg:block absolute top-12 left-12 right-12 h-1 bg-white/10 z-0">
            <motion.div
              className="h-full bg-brand-orange origin-left"
              style={{
                width: `${((activeStep + 0.5) / SITE_CONTENT.processSteps.length) * 100}%`,
                transition: "width 0.4s ease-out",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {SITE_CONTENT.processSteps.map((step, idx) => {
              const isSelected = activeStep === idx;
              const isPassed = activeStep >= idx;

              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStep(idx)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveStep(idx);
                    }
                  }}
                  className={`p-6 sm:p-7 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                    isSelected
                      ? "bg-white/[0.09] border-brand-orange shadow-2xl scale-[1.02]"
                      : isPassed
                      ? "bg-white/[0.04] border-brand-orange/40"
                      : "bg-white/[0.02] border-white/10 hover:border-white/30"
                  }`}
                >
                  <div>
                    {/* Step Node & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                          isPassed
                            ? "bg-brand-orange text-brand-charcoal ring-4 ring-brand-orange/25 shadow-lg"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        {stepIcons[idx]}
                      </div>
                      <span className="font-mono text-xs font-bold text-brand-orange">
                        PHASE {step.step}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-white mb-2">
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-brand-stone leading-relaxed mb-4">
                      {step.summary}
                    </p>
                  </div>

                  {/* Detail box */}
                  <div className="pt-4 border-t border-white/10 text-xs text-brand-stone/80">
                    <p>{step.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Guarantee Banner */}
        <div className="mt-12 p-6 rounded-lg bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-xs sm:text-sm text-brand-stone">
              Every phase is documented with formal sign-off sheets, site inspection logs, and verified material receipts.
            </span>
          </div>
          <a
            href="#contact"
            className="text-xs font-bold uppercase tracking-wider text-brand-orange hover:text-white transition-colors underline underline-offset-4 shrink-0"
          >
            Start with Phase 01 Consultation &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
