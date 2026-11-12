import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { Phone } from "lucide-react";
import { SITE_CONTENT } from "../content";
import { Reveal } from "./Reveal";

const label = "text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-navy/60";

/** True from 768px up; false on the server. */
const useMinWidthMd = () => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return matches;
};

export const Process: React.FC = () => {
  const steps = SITE_CONTENT.processSteps;
  const reduceMotion = useReducedMotion();
  const isMdUp = useMinWidthMd();
  // Scroll-linked focus only on tablet/desktop with motion allowed.
  const interactive = isMdUp && !reduceMotion;

  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });

  // The step crossing the viewport's centre line is the active one.
  useEffect(() => {
    if (!interactive) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [interactive]);

  return (
    <section
      id="process"
      className="relative bg-brand-paper text-brand-navy py-[72px] lg:py-[120px]"
      aria-labelledby="process-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-24">
          {/* Intro (sticky on desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px] lg:self-start">
            <Reveal>
              <p className={label}>How we work</p>
              <h2
                id="process-title"
                className="mt-4 font-heading font-medium text-[clamp(2rem,1.4rem+2.4vw,3rem)] leading-[1.1] tracking-tight text-brand-navy [text-wrap:balance]"
              >
                From first visit to signed handover.
              </h2>
              <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.7] text-brand-navy/70">
                Four stages, each ending with a defined deliverable, so you always know what happens next.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href="#contact"
                  className="inline-flex min-h-[44px] items-center justify-center rounded bg-brand-orange px-6 py-3 text-sm font-bold text-brand-charcoal transition-colors hover:bg-brand-orange-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
                >
                  Request a quote
                </a>
                <a
                  href={`tel:${SITE_CONTENT.contact.phonePrimaryTel}`}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-sm text-sm font-semibold text-brand-navy transition-colors hover:text-brand-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>Call {SITE_CONTENT.contact.phonePrimary}</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Steps */}
          <div className="lg:col-span-8">
            <ol ref={listRef} className={`relative ${interactive ? "pl-10" : ""}`}>
              {interactive && (
                <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-navy/12">
                  <motion.div
                    className="absolute inset-0 origin-top bg-brand-orange"
                    style={{ scaleY: scrollYProgress }}
                  />
                </div>
              )}

              {steps.map((step, idx) => {
                const isActive = !interactive || active === idx;
                return (
                  <li
                    key={step.step}
                    ref={(el) => {
                      stepRefs.current[idx] = el;
                    }}
                    data-index={idx}
                    className={`relative py-12 transition-opacity duration-200 ease-out ${
                      idx > 0 ? "border-t border-brand-navy/12" : ""
                    } ${isActive ? "opacity-100" : "opacity-45"}`}
                    aria-current={interactive && active === idx ? "step" : undefined}
                  >
                    {interactive && (
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[43px] top-[64px] lg:top-[76px] h-2 w-2 rounded-full bg-brand-orange transition-opacity duration-200 ${
                          active === idx ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )}
                    <Reveal className="grid grid-cols-1 gap-4 lg:grid-cols-[96px_minmax(0,1fr)] lg:gap-8">
                      <span
                        aria-hidden="true"
                        className="font-heading font-light text-[40px] lg:text-[64px] leading-none tracking-tight text-brand-navy/[0.18] tabular-nums"
                      >
                        {step.step}
                      </span>
                      <div>
                        <h3 className="font-heading font-medium text-[28px] leading-tight text-brand-navy">
                          <span className="sr-only">Step {Number(step.step)}: </span>
                          {step.title}
                        </h3>
                        <p className="mt-3 max-w-[52ch] text-[17px] leading-[1.65] text-brand-navy/70">
                          {step.description}
                        </p>
                        <dl className="mt-6 grid grid-cols-1 gap-5 border-t border-brand-navy/12 pt-5 lg:grid-cols-2 lg:gap-8">
                          <div>
                            <dt className={label}>You receive</dt>
                            <dd className="mt-1.5 text-[15px] text-brand-navy">{step.deliverable}</dd>
                          </div>
                          {step.timing.trim() !== "" && (
                            <div>
                              <dt className={label}>Typical time</dt>
                              <dd className="mt-1.5 text-[15px] text-brand-navy">{step.timing}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>

            <p className="border-t border-brand-navy/12 pt-6 text-[14px] leading-relaxed text-brand-navy/60">
              Every stage is documented with sign-off sheets, site inspection logs and verified material receipts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
