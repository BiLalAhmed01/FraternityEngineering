import React from "react";
import { SITE_CONTENT } from "../content";

export const About: React.FC = () => {
  const { story, founder, mission, vision, credentials } = SITE_CONTENT.about;

  return (
    <section
      id="about"
      className="relative bg-brand-navy text-white py-16 md:py-24 overflow-hidden"
      aria-label="About Fraternity Engineering"
    >
      <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="kicker-label text-brand-orange mb-2">About</p>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
          About Fraternity Engineering.
        </h2>
        <div className="w-16 h-1 bg-brand-orange mt-4 mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-5">
            <p className="text-brand-stone text-base leading-relaxed">{story}</p>
            {founder.name.trim() !== "" && (
              <div className="pt-4 border-t border-white/10">
                <p className="font-heading font-bold text-white">{founder.name}</p>
                {founder.role.trim() !== "" && (
                  <p className="text-xs font-mono uppercase tracking-wider text-brand-stone">{founder.role}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="kicker-label text-brand-orange mb-1">Mission</h3>
              <p className="text-brand-stone text-base leading-relaxed">{mission}</p>
            </div>
            <div>
              <h3 className="kicker-label text-brand-orange mb-1">Vision</h3>
              <p className="text-brand-stone text-base leading-relaxed">{vision}</p>
            </div>
          </div>
        </div>

        {credentials.length > 0 && (
          <ul className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-2 text-xs font-mono uppercase tracking-wider text-brand-stone">
            {credentials.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
