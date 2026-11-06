import React, { useEffect } from "react";
import { ProjectPlaceholder } from "../content";
import { X, ArrowRight, Layers, FileText, CheckCircle2 } from "lucide-react";

interface ProjectLightboxProps {
  project: ProjectPlaceholder | null;
  onClose: () => void;
  onSelectForQuote: (projectName: string, serviceCategory: string) => void;
}

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({
  project,
  onClose,
  onSelectForQuote,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl bg-brand-charcoal text-white rounded-lg border border-white/20 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-brand-charcoal/95">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider bg-brand-orange text-brand-charcoal font-bold rounded">
              {project.categoryLabel}
            </span>
            <span className="text-xs font-mono text-brand-stone">
              ID: {project.id} // TECHNICAL PLACEHOLDER SPEC
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-brand-stone hover:text-white rounded-md hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Blueprint Graphic Banner */}
          <div className="relative h-48 sm:h-56 rounded-md bg-gradient-to-br from-brand-navy via-brand-charcoal to-[#162338] border border-white/10 p-6 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-blueprint-grid opacity-60 pointer-events-none" />
            
            {/* Technical watermark drawing */}
            <div className="absolute right-4 bottom-2 opacity-25 font-mono text-[10px] text-brand-orange text-right">
              <div>SCALE: 1:100 / CAD DWG</div>
              <div>TOLERANCE: ±2.5mm</div>
              <div>STATUS: SCOPE BLUEPRINT</div>
            </div>

            <div className="relative z-10">
              <span className="text-xs font-mono text-brand-orange uppercase tracking-wider">
                {project.blueprintType}
              </span>
              <h3 id="lightbox-title" className="text-xl sm:text-2xl font-heading font-bold text-white mt-1">
                {project.title}
              </h3>
            </div>

            <div className="relative z-10 inline-flex items-center gap-2 self-start px-2.5 py-1 rounded bg-black/40 border border-white/15 text-[11px] font-mono text-brand-stone">
              <FileText className="w-3.5 h-3.5 text-brand-orange" />
              <span>Standard Engineering Specification</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-brand-stone mb-2">
              Overview &amp; Purpose
            </h4>
            <p className="text-sm sm:text-base text-brand-stone/90 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Scope of Works */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-brand-stone mb-2">
              Execution Scope
            </h4>
            <p className="text-sm text-brand-stone/80 leading-relaxed bg-white/5 p-4 rounded border border-white/10">
              {project.scope}
            </p>
          </div>

          {/* Technical Specifications */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-brand-stone mb-3">
              Key Engineering Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.specs.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center gap-2.5 p-3 rounded bg-white/[0.03] border border-white/10 text-xs text-brand-stone"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Placeholder Notice */}
          <div className="p-3.5 rounded bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
            <span className="font-bold text-brand-orange">Specification Notice:</span> This card represents an illustrative technical scope layout demonstrating Fraternity Engineering’s operational capabilities and material standards.
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-brand-charcoal flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-brand-stone hover:text-white rounded border border-white/10 hover:bg-white/5 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectForQuote(project.title, project.category);
              onClose();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-brand-charcoal text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-md"
          >
            <span>Inquire About Similar Works</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
