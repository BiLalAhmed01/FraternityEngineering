import React, { useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqAccordion } from "../components/Faq";
import { MobileFloatingCta } from "../components/MobileFloatingCta";
import { WhatsAppBubble } from "../components/WhatsAppBubble";
import { SmoothScroll } from "../components/SmoothScroll";
import { SITE_CONTENT } from "../content";
import { ServicePageData, SERVICE_PAGES, serviceUrl } from "../servicesData";

const CATEGORY_IMAGES: Record<string, string> = {
  Construction: "/assets/service-construction.webp",
  Civil: "/assets/service-civil.webp",
  Electrical: "/assets/service-electrical.webp",
  "Fire & safety": "/assets/service-fire.webp",
  Supply: "/assets/service-supply.webp",
};

/** 480/768 variants sit beside each 1024px service photo (service-x.webp -> service-x-480.webp). */
const photoSrcSet = (src: string) =>
  `${src.replace(".webp", "-480.webp")} 480w, ${src.replace(".webp", "-768.webp")} 768w, ${src} 1024w`;

const quoteCta =
  "inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-4 bg-accent hover:bg-accent-hover text-on-accent font-bold text-sm rounded-[4px] transition-colors";

export const ServicePage: React.FC<{ service: ServicePageData }> = ({ service }) => {
  useEffect(() => {
    document.title = `${service.name} | Fraternity Engineering`;
    window.scrollTo(0, 0);
  }, [service]);

  const others = SERVICE_PAGES.filter((s) => s.slug !== service.slug);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-bg text-fg font-body flex flex-col overflow-x-hidden">
        <Header />

        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {/* Hero */}
          <section className="theme-dark cad-grid relative bg-midnight text-fg pt-32 pb-16 md:pt-40 md:pb-24" aria-label={service.name}>
            <div className="relative max-w-7xl mx-auto px-[clamp(20px,5vw,64px)] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <nav aria-label="Breadcrumb" className="text-xs font-mono text-fg-muted mb-4">
                  <a href="/" className="hover:text-white underline-offset-2 hover:underline">Home</a>
                  <span aria-hidden="true"> / </span>
                  <a href="/#services" className="hover:text-white underline-offset-2 hover:underline">Services</a>
                </nav>
                <p className="kicker-label text-label mb-2">{service.shortTag}</p>
                <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">{service.name}</h1>
                <div className="w-16 h-1 bg-line-strong mt-4 mb-5" />
                <p className="text-base sm:text-lg text-fg-muted leading-relaxed max-w-xl">{service.overview}</p>
                <a href="/#contact" className={`${quoteCta} mt-8`}>
                  <span>Request a quote</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
              <img
                src={service.image}
                srcSet={photoSrcSet(service.image)}
                sizes="(min-width: 1024px) 50vw, 100vw"
                width={1024}
                height={768}
                fetchPriority="high"
                decoding="async"
                alt={service.name}
                className="w-full aspect-[4/3] object-cover rounded-2xl border border-line-strong"
              />
            </div>
          </section>

          {/* Overview + typical scopes */}
          <section className="py-16 md:py-24" aria-label="Typical scopes">
            <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)] grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-heading font-bold text-fg tracking-tight">Overview</h2>
                <div className="w-16 h-1 bg-line-strong mt-4 mb-5" />
                <p className="leading-relaxed">{service.summary}</p>
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-fg tracking-tight">What we deliver</h2>
                <div className="w-16 h-1 bg-line-strong mt-4 mb-5" />
                <ul className="space-y-3">
                  {service.subservices.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-icon shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Standards followed (hidden until populated in servicesData.ts) */}
          {service.standards.length > 0 && (
            <section className="pb-16 md:pb-24" aria-label="Standards followed">
              <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
                <h2 className="text-3xl font-heading font-bold text-fg tracking-tight">Standards followed</h2>
                <div className="w-16 h-1 bg-line-strong mt-4 mb-5" />
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.standards.map((std) => (
                    <li key={std} className="flex items-start gap-3 bg-surface rounded-lg border border-line p-4">
                      <Check className="w-5 h-5 text-icon shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{std}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Mini process */}
          <section className="theme-dark bg-navy text-fg py-16 md:py-24" aria-label="How we work">
            <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
              <h2 className="text-3xl font-heading font-bold tracking-tight">How we work</h2>
              <div className="w-16 h-1 bg-line-strong mt-4 mb-8" />
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SITE_CONTENT.processSteps.map((step) => (
                  <li key={step.step} className="rounded-xl border border-line bg-surface-2 p-6 hover:border-line-strong transition-colors">
                    <span className="text-xs font-bold text-label">STEP {step.step}</span>
                    <h3 className="font-heading font-bold text-xl mt-2 mb-2">{step.title}</h3>
                    <p className="text-sm text-fg-muted leading-relaxed">{step.summary}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Related projects */}
          {service.relatedProjects.length > 0 && (
            <section className="py-16 md:py-24" aria-label="Related projects">
              <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
                <h2 className="text-3xl font-heading font-bold text-fg tracking-tight">Related projects</h2>
                <div className="w-16 h-1 bg-line-strong mt-4 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.relatedProjects.map((work) => (
                    <article
                      key={work.id}
                      className="bg-surface rounded-xl border border-line overflow-hidden hover:border-line-strong transition-colors duration-300"
                    >
                      <img
                        src={CATEGORY_IMAGES[work.category]}
                        srcSet={photoSrcSet(CATEGORY_IMAGES[work.category])}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        width={1024}
                        height={576}
                        alt={`${work.category} work`}
                        loading="lazy"
                        decoding="async"
                        className="w-full aspect-[16/9] object-cover"
                      />
                      <div className="p-5">
                        <h3 className="font-heading font-bold text-lg text-fg mb-2">{work.title}</h3>
                        <p className="text-sm mb-3">{work.scope}</p>
                        <p className="text-xs font-mono text-fg-subtle mb-2">
                          {work.location}
                          {work.year ? ` · ${work.year}` : ""}
                        </p>
                        <p className="text-sm font-medium text-fg">{work.delivered}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="pb-16 md:pb-24" aria-label="Frequently asked questions">
            <div className="max-w-3xl mx-auto px-[clamp(20px,5vw,64px)]">
              <h2 className="text-3xl font-heading font-bold text-fg tracking-tight">Questions</h2>
              <div className="w-16 h-1 bg-line-strong mt-4 mb-8" />
              <FaqAccordion items={service.faq} idPrefix="svc-faq" />
            </div>
          </section>

          {/* Quote CTA */}
          <section className="theme-dark bg-navy text-fg py-16 md:py-24 text-center" aria-label="Request a quote">
            <div className="max-w-3xl mx-auto px-[clamp(20px,5vw,64px)]">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
                Tell us about your project.
              </h2>
              <p className="text-fg-muted mt-4 mb-8">
                Send us your scope, drawings or tender documents and we will reply with an itemised quote.
              </p>
              <a href="/#contact" className={quoteCta}>
                <span>Request a quote</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <p className="mt-10 text-xs font-mono uppercase tracking-wider text-fg-muted">Other services</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1">
                {others.map((o) => (
                  <li key={o.slug}>
                    <a
                      href={serviceUrl(o.slug)}
                      className="inline-flex items-center min-h-[44px] text-sm text-fg hover:underline hover:underline-offset-4 underline-offset-4 hover:underline"
                    >
                      {o.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        <Footer />
        <MobileFloatingCta />
        <WhatsAppBubble />
      </div>
    </SmoothScroll>
  );
};
