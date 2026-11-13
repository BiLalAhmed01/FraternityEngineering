import React from "react";
import { SITE_CONTENT } from "../content";

export const Testimonials: React.FC = () => {
  const items = SITE_CONTENT.testimonials;
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="bg-bg text-fg py-16 md:py-24" aria-label="Client testimonials">
      <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
        <p className="kicker-label text-fg mb-3">Testimonials</p>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-fg tracking-tight">
          What clients say.
        </h2>
        <div className="w-16 h-1 bg-line-strong mt-4 mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <figure key={`${t.name}-${t.organisation}`} className="bg-surface rounded-xl border border-line p-6 hover:border-line-strong transition-colors duration-300">
              <blockquote className="text-sm sm:text-base leading-relaxed text-fg">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-bold text-fg">{t.name}</span>
                <span className="block text-xs font-mono text-fg-subtle">
                  {t.role}, {t.organisation}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
