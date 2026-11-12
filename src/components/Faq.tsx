import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SITE_CONTENT, FaqItem } from "../content";

export const FaqAccordion: React.FC<{ items: FaqItem[]; idPrefix?: string }> = ({ items, idPrefix = "faq" }) => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-brand-stone/60 border-y border-brand-stone/60">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <h3 className="font-heading font-bold">
              <button
                type="button"
                id={`${idPrefix}-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full min-h-[44px] flex items-center justify-between gap-4 py-4 text-left text-brand-navy hover:text-brand-orange transition-colors"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`${idPrefix}-a-${i}`}
              role="region"
              aria-labelledby={`${idPrefix}-q-${i}`}
              hidden={!isOpen}
              className="pb-4 text-sm sm:text-base leading-relaxed text-brand-brown/90"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Faq: React.FC = () => (
  <section id="faq" className="bg-brand-cream text-brand-brown py-16 md:py-24" aria-label="Frequently asked questions">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="kicker-label text-brand-navy mb-3">FAQ</p>
      <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-navy tracking-tight">
        Common questions.
      </h2>
      <div className="w-16 h-1 bg-brand-orange mt-4 mb-8" />
      <FaqAccordion items={SITE_CONTENT.faq} />
    </div>
  </section>
);
