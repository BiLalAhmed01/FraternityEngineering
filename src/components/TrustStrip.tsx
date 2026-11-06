import React from "react";
import { SITE_CONTENT } from "../content";
import { Layers, Building2, CheckSquare, ShieldCheck } from "lucide-react";

export const TrustStrip: React.FC = () => {
  const icons = [
    <Layers key="1" className="w-6 h-6 text-brand-orange" />,
    <Building2 key="2" className="w-6 h-6 text-brand-orange" />,
    <CheckSquare key="3" className="w-6 h-6 text-brand-orange" />,
    <ShieldCheck key="4" className="w-6 h-6 text-brand-orange" />,
  ];

  return (
    <section
      className="relative z-10 bg-brand-charcoal text-white pt-8 pb-14 border-t border-white/10"
      aria-label="Core Engineering Pillars"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {SITE_CONTENT.trustPillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="relative p-6 rounded-md bg-white/[0.03] border border-white/10 hover:border-brand-orange/50 transition-colors duration-200 group flex flex-col justify-between"
            >
              {/* Subtle top orange indicator line on hover */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-brand-orange/20 group-hover:bg-brand-orange transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                    {icons[index]}
                  </div>
                  <span className="font-mono text-xs text-brand-stone/60">0{index + 1}</span>
                </div>

                <h3 className="font-heading font-semibold text-lg text-white group-hover:text-brand-cream transition-colors">
                  {pillar.title}
                </h3>

                <p className="mt-2 text-sm text-brand-stone font-normal leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Dependability tag */}
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-brand-orange/80 uppercase tracking-wider">
                Verified Principle
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Curved Orange Swoosh Transition into Cream Services Section */}
      <div className="relative w-full overflow-hidden leading-none mt-12 -mb-14 pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 text-brand-cream preserve-3d"
        >
          {/* Curved Orange Swoosh matching FTE Logo lower curve */}
          <path
            d="M0 48C360 48 520 12 900 18C1180 22 1340 38 1440 48V48H0Z"
            fill="currentColor"
          />
          <path
            d="M0 46C380 46 540 10 920 16C1200 20 1360 36 1440 46"
            stroke="#FF6B00"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
};
