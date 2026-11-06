import React from "react";
import { SITE_CONTENT } from "../content";
import { Compass, Eye, ShieldAlert, CheckCircle } from "lucide-react";

export const MissionVision: React.FC = () => {
  const { mission, vision } = SITE_CONTENT.missionVision;

  return (
    <section
      id="about"
      className="relative bg-brand-navy text-white py-20 md:py-28 overflow-hidden"
      aria-label="Mission and Vision"
    >
      {/* Background Blueprint Grid on Deep Navy */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />

      {/* Slanted Beam Accent */}
      <div
        className="absolute -bottom-20 left-10 w-2 h-72 bg-brand-orange/40 fte-slant pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Attached Logomark on Blue Background */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="kicker-label text-brand-orange mb-2">Corporate Orientation</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
              Our mission and vision.
            </h2>
            <div className="w-16 h-1 bg-brand-orange mt-4 mb-4" />
            <p className="text-base text-brand-stone">
              Clear standards and transparent accountability form the bedrock of every contract we execute.
            </p>
          </div>
          <div className="shrink-0 p-3.5 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center self-start sm:self-auto shadow-lg">
            <img
              src="/assets/logo.webp"
              alt="Fraternity Engineering Logo"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </div>
        </div>

        {/* Two Side-by-Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission Panel */}
          <div className="relative p-8 md:p-10 rounded-lg bg-white/[0.04] border border-white/10 hover:border-brand-orange/60 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-brand-orange text-brand-charcoal text-[11px] font-bold uppercase tracking-wider rounded">
              Purpose
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/10 rounded-md text-brand-orange">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <p className="kicker-label text-brand-orange/90 text-xs">{mission.kicker}</p>
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white">
                    {mission.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-4 text-brand-stone text-sm sm:text-base leading-relaxed">
                {mission.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-brand-stone">
              <CheckCircle className="w-4 h-4 text-brand-orange shrink-0" />
              <span>Direct engineer accountability on all jobsites</span>
            </div>
          </div>

          {/* Vision Panel */}
          <div className="relative p-8 md:p-10 rounded-lg bg-white/[0.04] border border-white/10 hover:border-brand-orange/60 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-brand-stone text-brand-charcoal text-[11px] font-bold uppercase tracking-wider rounded">
              Outlook
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/10 rounded-md text-brand-orange">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <p className="kicker-label text-brand-stone text-xs">{vision.kicker}</p>
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white">
                    {vision.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-4 text-brand-stone text-sm sm:text-base leading-relaxed">
                {vision.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-brand-stone">
              <CheckCircle className="w-4 h-4 text-brand-orange shrink-0" />
              <span>Long-term institutional relationships</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
