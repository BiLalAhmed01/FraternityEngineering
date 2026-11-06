import React, { useState } from "react";
import { SITE_CONTENT } from "../content";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const categoryImages: Record<string, string> = {
  Construction: "/assets/service-construction.webp",
  Civil: "/assets/service-civil.webp",
  Electrical: "/assets/service-electrical.webp",
  "Fire & safety": "/assets/service-fire.webp",
  Supply: "/assets/service-supply.webp",
};

export const WhyFTE: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Construction", "Civil", "Electrical", "Fire & safety", "Supply"];

  const filteredWorks =
    activeCategory === "All"
      ? SITE_CONTENT.workShowcase
      : SITE_CONTENT.workShowcase.filter((w) => w.category === activeCategory);

  return (
    <section
      id="work"
      className="relative bg-brand-cream text-brand-brown py-20 md:py-28"
      aria-label="Our Work"
    >
      <div className="absolute inset-0 bg-blueprint-grid-light opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="kicker-label text-brand-navy mb-3">Our Work</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-brand-navy tracking-tight leading-tight">
              Projects delivered across Pakistan.
            </h2>
            <div className="w-16 h-1 bg-brand-orange mt-4 mb-4" />
            <p className="text-base sm:text-lg text-brand-brown/85 font-normal leading-relaxed">
              Government, corporate and industrial clients. Construction, civil, electrical, fire safety and supply.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
                  activeCategory === cat
                    ? "bg-brand-navy text-white border border-brand-navy"
                    : "bg-white border border-brand-stone/60 text-brand-navy hover:border-brand-orange hover:text-brand-orange"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Work Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredWorks.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white rounded-xl border border-brand-stone/60 overflow-hidden hover:border-brand-navy hover:shadow-xl transition-all duration-300"
            >
              {/* Project Image Area */}
              <div className="aspect-video bg-brand-charcoal relative overflow-hidden">
                <img
                  src={categoryImages[work.category]}
                  alt={`${work.title} - ${work.category} project`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/20 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-brand-navy text-white text-[10px] font-mono uppercase tracking-wider rounded">
                  {work.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg text-brand-navy mb-2">
                  {work.title}
                </h3>
                <p className="text-sm text-brand-brown/85 mb-3">
                  {work.scope}
                </p>
                <div className="space-y-1.5 text-xs text-brand-steel font-mono">
                  <div className="flex justify-between">
                    <span>Client:</span>
                    <span className="text-brand-navy">{work.clientType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="text-brand-navy">{work.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivered:</span>
                    <span className="text-brand-navy">{work.delivered}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote Preview Panel */}
        <div className="bg-white rounded-xl border border-brand-stone/60 overflow-hidden">
          <div className="p-6 border-b border-brand-stone/40 bg-brand-cream/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-brand-navy">
                  {SITE_CONTENT.quotePreview.title}
                </h3>
                <p className="text-sm text-brand-steel font-mono mt-1">
                  {SITE_CONTENT.quotePreview.reference} • {SITE_CONTENT.quotePreview.date}
                </p>
              </div>
              <span className="px-3 py-1 bg-brand-orange text-brand-charcoal text-xs font-bold uppercase tracking-wider rounded">
                SAMPLE
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <span className="text-brand-steel font-mono text-xs uppercase">Client:</span>
                <p className="text-brand-navy font-medium">{SITE_CONTENT.quotePreview.client}</p>
              </div>
              <div>
                <span className="text-brand-steel font-mono text-xs uppercase">Location:</span>
                <p className="text-brand-navy font-medium">{SITE_CONTENT.quotePreview.location}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-stone/40">
                    <th className="text-left py-2 px-2 font-mono text-xs uppercase text-brand-steel">Item</th>
                    <th className="text-left py-2 px-2 font-mono text-xs uppercase text-brand-steel">Description</th>
                    <th className="text-right py-2 px-2 font-mono text-xs uppercase text-brand-steel">Qty</th>
                    <th className="text-right py-2 px-2 font-mono text-xs uppercase text-brand-steel">Unit</th>
                    <th className="text-right py-2 px-2 font-mono text-xs uppercase text-brand-steel">Rate</th>
                    <th className="text-right py-2 px-2 font-mono text-xs uppercase text-brand-steel">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {SITE_CONTENT.quotePreview.lineItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-brand-stone/20">
                      <td className="py-2 px-2 text-brand-navy">{item.item}</td>
                      <td className="py-2 px-2 text-brand-brown">{item.description}</td>
                      <td className="py-2 px-2 text-right text-brand-navy">{item.quantity}</td>
                      <td className="py-2 px-2 text-right text-brand-steel">{item.unit}</td>
                      <td className="py-2 px-2 text-right text-brand-navy">{item.rate}</td>
                      <td className="py-2 px-2 text-right text-brand-navy">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-brand-navy">
                    <td colSpan={5} className="py-3 px-2 text-right font-bold text-brand-navy">Total:</td>
                    <td className="py-3 px-2 text-right font-bold text-brand-navy">{SITE_CONTENT.quotePreview.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-brand-stone/40 flex flex-col sm:flex-row justify-between gap-2 text-xs text-brand-steel font-mono">
              <span>Valid until: {SITE_CONTENT.quotePreview.validUntil}</span>
              <span>{SITE_CONTENT.quotePreview.terms}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
