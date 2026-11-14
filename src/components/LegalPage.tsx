import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { SITE_CONTENT } from "../content";

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

interface LegalPageProps {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  other: { href: string; label: string };
}

/** Body paragraph for a legal section. */
export const LegalP: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <p className={`text-[17px] leading-[1.75] text-fg-muted ${className}`}>{children}</p>
);

/** Bulleted list for a legal section. */
export const LegalList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="mt-4 space-y-3">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-4 text-[17px] leading-[1.7] text-fg-muted">
        <span aria-hidden="true" className="mt-[0.7em] w-2 h-2 bg-accent shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const LegalLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-white underline underline-offset-4 decoration-line-strong hover:decoration-accent transition-colors">
    {children}
  </a>
);

export const LegalPage: React.FC<LegalPageProps> = ({ title, updated, intro, sections, other }) => {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  /** After a contents click the page scrolls itself; keep the clicked section selected until it settles. */
  const lockUntil = useRef(0);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0] && Date.now() > lockUntil.current && !atBottom()) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    // The last sections are short and can never reach the observer band, so the page bottom selects the last one.
    const onScroll = () => {
      if (Date.now() > lockUntil.current) {
        const first = document.getElementById(sections[0].id);
        if (atBottom()) setActive(sections[sections.length - 1].id);
        else if (first && first.getBoundingClientRect().top > window.innerHeight * 0.3) setActive(sections[0].id);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  const onTocClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    setActive(id);
    lockUntil.current = Date.now() + 1200;
    e.currentTarget.closest("details")?.removeAttribute("open");
  };

  const toc = (
    <ol className="space-y-1">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            onClick={(e) => onTocClick(s.id, e)}
            aria-current={active === s.id ? "true" : undefined}
            className={`flex items-baseline gap-3 min-h-[40px] py-2 pl-4 border-l-2 text-[15px] transition-colors ${
              active === s.id ? "border-accent text-white" : "border-line text-fg-muted hover:text-white hover:border-line-strong"
            }`}
          >
            <span className="text-fg-subtle tabular-nums w-4">{i + 1}</span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="theme-dark min-h-screen bg-midnight text-fg font-body flex flex-col">
      <header className="bg-navy border-b border-line">
        <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)] py-3 flex items-center justify-between">
          <BrandLogo isBlueBg={true} />
          <a
            href="/"
            className="inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-white hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to site
          </a>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <section className="cad-grid relative bg-midnight pt-16 pb-14 md:pt-24 md:pb-20" aria-label={title}>
          <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
            <h1 className="font-heading font-semibold text-5xl sm:text-6xl tracking-tight text-white leading-[1.02]">{title}</h1>
            <div className="w-14 h-[3px] bg-accent mt-6 mb-6" />
            <p className="text-lg sm:text-xl text-fg-muted leading-relaxed max-w-2xl">{intro}</p>
            <p className="mt-8 inline-block border-l-2 border-accent pl-3 text-sm text-fg-muted">Last updated {updated}</p>
          </div>
        </section>

        <section className="bg-midnight pb-20 md:pb-28" aria-label={`${title} text`}>
          <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <nav aria-label="On this page" className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start">
              <details className="lg:hidden bg-navy border border-line-strong">
                <summary className="cursor-pointer min-h-[48px] flex items-center px-5 font-semibold text-white">On this page</summary>
                <div className="px-3 pb-4">{toc}</div>
              </details>
              <div className="hidden lg:block bg-navy border border-line p-6">
                <p className="font-heading font-semibold text-lg text-white mb-4">On this page</p>
                {toc}
              </div>
            </nav>

            <div className="lg:col-span-8 max-w-[68ch]">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-8 border-t border-line-strong py-10 first:pt-0 first:border-t-0">
                  <h2 id={`${s.id}-h`} className="font-heading font-semibold text-2xl sm:text-3xl text-white tracking-tight mb-5 flex items-baseline gap-4">
                    <span aria-hidden="true" className="text-navy [-webkit-text-stroke:1px_var(--steel)] text-4xl leading-none">
                      {i + 1}
                    </span>
                    <span>{s.title}</span>
                  </h2>
                  {s.body}
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy border-t border-line">
        <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)] py-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 text-sm text-fg-muted">
          <p>&copy; {new Date().getFullYear()} Fraternity Engineering &amp; Co. (SMC-Pvt) Ltd.</p>
          <div className="flex flex-wrap items-center gap-x-8">
            <a href={`mailto:${SITE_CONTENT.contact.email}`} className="inline-flex items-center min-h-[44px] hover:text-white transition-colors">
              {SITE_CONTENT.contact.email}
            </a>
            <a href={other.href} className="inline-flex items-center gap-1 min-h-[44px] text-white hover:text-accent transition-colors">
              {other.label}
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
