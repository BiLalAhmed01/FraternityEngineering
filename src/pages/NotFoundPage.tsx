import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { SERVICE_PAGES, serviceUrl } from "../servicesData";

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = "Page Not Found | Fraternity Engineering & Co.";
  }, []);

  return (
    <main className="min-h-screen bg-brand-navy text-white flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />
      <div className="relative max-w-lg text-center">
        <img src="/assets/logo.webp" alt="Fraternity Engineering & Co." className="h-16 w-auto mx-auto mb-8" />
        <p className="font-heading font-bold text-7xl text-brand-orange leading-none">404</p>
        <h1 className="font-heading font-bold text-2xl mt-4">Page not found</h1>
        <p className="text-brand-stone mt-3 mb-8">The page you are looking for does not exist or has moved.</p>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-brand-charcoal font-bold text-sm uppercase tracking-wider rounded-lg transition-colors"
        >
          <span>Back to homepage</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-1">
          {SERVICE_PAGES.map((s) => (
            <li key={s.slug}>
              <a
                href={serviceUrl(s.slug)}
                className="inline-flex items-center min-h-[44px] text-sm text-brand-cream hover:text-brand-orange underline-offset-4 hover:underline"
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};
