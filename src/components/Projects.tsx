import React, { useState } from "react";
import { SITE_CONTENT, ProjectPlaceholder } from "../content";
import { ProjectLightbox } from "./ProjectLightbox";
import { Maximize2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectsProps {
  onSelectProjectForQuote?: (projectName: string, serviceCategory: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProjectForQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProject, setActiveProject] = useState<ProjectPlaceholder | null>(null);

  const categories = ["All", "Construction", "Civil", "Electrical", "Fire & safety", "Supply"] as const;

  const filteredProjects = selectedCategory === "All"
    ? SITE_CONTENT.projects
    : SITE_CONTENT.projects.filter((p) => p.category === selectedCategory);

  const handleSelectForQuote = (projectName: string, serviceCategory: string) => {
    if (onSelectProjectForQuote) {
      onSelectProjectForQuote(projectName, serviceCategory);
    } else {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="projects"
      className="relative bg-brand-cream text-brand-brown py-20 md:py-28 border-t border-brand-stone/40"
      aria-label="Project Capabilities and Case Studies"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="kicker-label text-brand-navy mb-2">Technical Blueprints</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-brand-navy tracking-tight">
              Sample project scopes &amp; standards.
            </h2>
            <div className="w-16 h-1 bg-brand-orange mt-4 mb-4" />
            <p className="text-sm sm:text-base text-brand-brown/85">
              Review illustrative architectural blueprints and technical execution criteria demonstrating
              the standards applied across our contracts.
            </p>
          </div>

          <div className="self-start md:self-auto px-4 py-2 bg-brand-stone/40 border border-brand-stone rounded text-xs font-mono text-brand-navy flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span>Illustrative Engineering Specifications</span>
          </div>
        </div>

        {/* Filter Tabs with Framer Motion layoutId */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none" role="tablist" aria-label="Filter projects by discipline">
          <div className="flex items-center gap-1.5 p-1 bg-brand-stone/30 rounded-lg border border-brand-stone/60">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-4 py-2 text-xs md:text-sm font-semibold rounded-md transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange z-10 ${
                    isActive ? "text-white" : "text-brand-brown/80 hover:text-brand-navy"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-brand-navy rounded-md shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtered Grid with Layout Animation & Custom Cursor "VIEW" Hook */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                data-cursor="view"
                onClick={() => setActiveProject(project)}
                className="group relative bg-white rounded-xl border border-brand-stone/70 hover:border-brand-navy overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Blueprint Graphic Header */}
                <div className="relative h-48 bg-gradient-to-br from-brand-charcoal via-brand-navy to-[#182335] text-white p-5 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 bg-blueprint-grid opacity-50 group-hover:opacity-75 transition-opacity" />

                  {/* Slanted orange reveal panel on hover */}
                  <div
                    className="absolute inset-0 bg-brand-orange/90 opacity-0 group-hover:opacity-95 transition-opacity duration-300 flex items-center justify-center p-6 z-20 text-brand-charcoal"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)" }}
                  >
                    <div className="text-center font-heading">
                      <p className="font-mono text-xs uppercase tracking-widest text-brand-charcoal/80">Click to inspect</p>
                      <p className="font-bold text-xl uppercase tracking-wider text-brand-charcoal mt-1">Full Technical DWG</p>
                    </div>
                  </div>

                  {/* Abstract CAD Blueprint Lines */}
                  <svg
                    viewBox="0 0 200 120"
                    className="absolute inset-0 w-full h-full stroke-white/20 fill-none pointer-events-none"
                  >
                    <rect x="20" y="20" width="160" height="80" strokeWidth="1" strokeDasharray="4 2" />
                    <line x1="20" y1="20" x2="180" y2="100" strokeWidth="0.8" />
                    <line x1="20" y1="100" x2="180" y2="20" strokeWidth="0.8" />
                    <circle cx="100" cy="60" r="30" strokeWidth="1" />
                    <circle cx="100" cy="60" r="4" fill="#FF6B00" />
                    <line x1="20" y1="10" x2="180" y2="10" stroke="#FF6B00" strokeWidth="1.2" />
                  </svg>

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-brand-orange text-brand-charcoal font-bold rounded">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono text-brand-stone/80 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                      PLACEHOLDER SPEC
                    </span>
                  </div>

                  {/* Drawing Type */}
                  <div className="relative z-10">
                    <p className="text-[11px] font-mono text-brand-orange uppercase tracking-wide">
                      {project.blueprintType}
                    </p>
                    <h3 className="font-heading font-bold text-lg text-white mt-0.5 leading-snug line-clamp-1 group-hover:text-brand-cream transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-brand-brown/85 leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="space-y-1.5 mb-6">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-brand-steel">
                        Key Deliverables:
                      </p>
                      {project.specs.slice(0, 3).map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 text-xs text-brand-brown">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-brand-stone/40 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy group-hover:text-brand-orange transition-colors">
                      <Maximize2 className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Inspect specification</span>
                    </span>
                    <span className="text-[10px] font-mono text-brand-steel">DWG #{project.id}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectLightbox
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onSelectForQuote={handleSelectForQuote}
      />
    </section>
  );
};
