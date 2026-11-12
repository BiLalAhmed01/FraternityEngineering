import React from "react";
import { SITE_CONTENT } from "../content";

export const StatsBar: React.FC = () => {
  const stats = SITE_CONTENT.stats.filter((s) => s.value.trim() !== "");
  if (stats.length === 0) return null;

  return (
    <section className="bg-brand-navy border-y border-white/10 text-white" aria-label="Company at a glance">
      <dl className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-center sm:justify-between gap-x-8 gap-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-2">
            <dd className="font-heading font-bold text-lg text-brand-orange order-1">{stat.value}</dd>
            <dt className="text-xs font-mono uppercase tracking-wider text-brand-stone order-2">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
};
