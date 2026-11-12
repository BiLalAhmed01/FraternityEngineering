import React, { useState } from "react";
import { SITE_CONTENT } from "../content";
import { HardHat } from "lucide-react";
import { motion } from "motion/react";

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
              {/* Project Header - branded panel */}
              <div className="aspect-video bg-brand-navy relative overflow-hidden">
                <div className="absolute inset-0 bg-blueprint-grid opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-brand-orange text-brand-charcoal text-[10px] font-mono uppercase tracking-wider rounded font-bold">
                  {work.category}
                </div>
                <div className="absolute bottom-3 right-3 w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <HardHat className="w-5 h-5 text-brand-orange" />
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
      </div>
    </section>
  );
};
