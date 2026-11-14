import React, { useEffect } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SERVICE_PAGES, serviceUrl } from "../servicesData";
import { StatusPage, statusBtn } from "../components/StatusPage";

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
    <StatusPage
      code="404"
      title="This page does not exist"
      message="The address may be mistyped, or the page has moved. Start from the homepage or go straight to a service."
      actions={
        <>
          <a href="/" className={statusBtn}>
            <span>Back to homepage</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href="/#contact"
            className="inline-flex items-center min-h-[48px] text-sm font-semibold text-white underline underline-offset-8 decoration-line-strong hover:decoration-accent transition-colors"
          >
            Contact us
          </a>
        </>
      }
      links={
        <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
          {SERVICE_PAGES.map((s) => (
            <li key={s.slug}>
              <a
                href={serviceUrl(s.slug)}
                className="group flex items-center justify-between gap-3 min-h-[56px] px-5 bg-navy border border-line hover:border-accent transition-colors text-white"
              >
                <span className="font-medium">{s.name}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0 text-fg-subtle group-hover:text-accent transition-colors" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      }
    />
  );
};
