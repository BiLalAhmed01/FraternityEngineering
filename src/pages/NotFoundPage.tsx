import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { SERVICE_PAGES, serviceUrl } from "../servicesData";

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = "Page not found | Fraternity Engineering";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  return (
    <main className="theme-dark cad-grid min-h-screen bg-midnight text-fg flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="relative max-w-lg text-center">
        <img src="/assets/logo.webp" alt="Fraternity Engineering & Co." width={177} height={64} className="h-16 w-auto mx-auto mb-8" />
        <p className="font-heading font-bold text-7xl text-fg-subtle leading-none">404</p>
        <h1 className="font-heading font-bold text-2xl mt-4">Page not found</h1>
        <p className="text-fg-muted mt-3 mb-8">The page you are looking for does not exist or has moved.</p>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-4 bg-accent hover:bg-accent-hover text-on-accent font-bold text-sm uppercase tracking-wider rounded-[4px] transition-colors"
        >
          <span>Back to homepage</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-1">
          <li>
            <a
              href="/#contact"
              className="inline-flex items-center min-h-[44px] text-sm text-fg hover:underline hover:underline-offset-4 underline-offset-4 hover:underline"
            >
              Contact us
            </a>
          </li>
          {SERVICE_PAGES.map((s) => (
            <li key={s.slug}>
              <a
                href={serviceUrl(s.slug)}
                className="inline-flex items-center min-h-[44px] text-sm text-fg hover:underline hover:underline-offset-4 underline-offset-4 hover:underline"
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
