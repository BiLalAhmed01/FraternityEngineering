import React, { useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqAccordion } from "../components/Faq";
import { MobileFloatingCta } from "../components/MobileFloatingCta";
import { BackToTop } from "../components/BackToTop";
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

const quoteCta =
  "inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-brand-charcoal font-bold text-sm uppercase tracking-wider rounded-lg transition-colors";

export const ServicePage: React.FC<{ service: ServicePageData }> = ({ service }) => {
  useEffect(() => {
    document.title = `${service.name} | Fraternity Engineering & Co.`;
    window.scrollTo(0, 0);
  }, [service]);

  const others = SERVICE_PAGES.filter((s) => s.slug !== service.slug);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-brand-cream text-brand-brown font-body flex flex-col overflow-x-hidden">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <section className="relative bg-brand-navy text-white pt-32 pb-16 md:pt-40 md:pb-24" aria-label={service.name}>
            <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <nav aria-label="Breadcrumb" className="text-xs font-mono text-brand-stone mb-4">
                  <a href="/" className="hover:text-white underline-offset-2 hover:underline">Home</a>
                  <span aria-hidden="true"> / </span>
                  <a href="/#services" className="hover:text-white underline-offset-2 hover:underline">Services</a>
                </nav>
                <p className="kicker-label text-brand-orange mb-2">{service.shortTag}</p>
                <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">{service.name}</h1>
                <div className="w-16 h-1 bg-brand-orange mt-4 mb-5" />
                <p className="text-base sm:text-lg text-brand-stone leading-relaxed max-w-xl">{service.overview}</p>
                <a href="/#contact" className={`${quoteCta} mt-8`}>
                  <span>Get a Quote</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
              <img
                src={service.image}
                alt={service.name}
                className="w-full aspect-[4/3] object-cover rounded-2xl border border-white/15 shadow-2xl"
              />
            </div>
          </section>

          {/* Overview + typical scopes */}
          <section className="py-16 md:py-24" aria-label="Typical scopes">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-heading font-bold text-brand-navy tracking-tight">Overview</h2>
                <div className="w-16 h-1 bg-brand-orange mt-4 mb-5" />
                <p className="leading-relaxed">{service.summary}</p>
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-brand-navy tracking-tight">Typical scopes</h2>
                <div className="w-16 h-1 bg-brand-orange mt-4 mb-5" />
                <ul className="space-y-3">
                  {service.subservices.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" aria-hidden="true" />
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
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-heading font-bold text-brand-navy tracking-tight">Standards followed</h2>
                <div className="w-16 h-1 bg-brand-orange mt-4 mb-5" />
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.standards.map((std) => (
                    <li key={std} className="flex items-start gap-3 bg-white rounded-lg border border-brand-stone/60 p-4">
                      <Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{std}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Mini process */}
          <section className="bg-brand-charcoal text-white py-16 md:py-24" aria-label="How we work">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-heading font-bold tracking-tight">How we work</h2>
              <div className="w-16 h-1 bg-brand-orange mt-4 mb-8" />
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SITE_CONTENT.processSteps.map((step) => (
                  <li key={step.step} className="rounded-xl border border-white/10 bg-white/[0.04] p-6 hover:border-brand-orange/60 transition-colors">
                    <span className="font-mono text-xs font-bold text-brand-orange">STEP {step.step}</span>
                    <h3 className="font-heading font-bold text-xl mt-2 mb-2">{step.title}</h3>
                    <p className="text-sm text-brand-stone leading-relaxed">{step.summary}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Related projects */}
          {service.relatedProjects.length > 0 && (
            <section className="py-16 md:py-24" aria-label="Related projects">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-heading font-bold text-brand-navy tracking-tight">Related projects</h2>
                <div className="w-16 h-1 bg-brand-orange mt-4 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.relatedProjects.map((work) => (
                    <article
                      key={work.id}
                      className="bg-white rounded-xl border border-brand-stone/60 overflow-hidden hover:border-brand-navy hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={CATEGORY_IMAGES[work.category]}
                        alt={`${work.category} work`}
                        loading="lazy"
                        className="w-full aspect-[16/9] object-cover"
                      />
                      <div className="p-5">
                        <h3 className="font-heading font-bold text-lg text-brand-navy mb-2">{work.title}</h3>
                        <p className="text-sm mb-3">{work.scope}</p>
                        <p className="text-xs font-mono text-brand-steel mb-2">
                          {work.location}
                          {work.year ? ` · ${work.year}` : ""}
                        </p>
                        <p className="text-sm font-medium text-brand-navy">{work.delivered}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="pb-16 md:pb-24" aria-label="Frequently asked questions">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-heading font-bold text-brand-navy tracking-tight">Common questions</h2>
              <div className="w-16 h-1 bg-brand-orange mt-4 mb-8" />
              <FaqAccordion items={service.faq} idPrefix="svc-faq" />
            </div>
          </section>

          {/* Quote CTA */}
          <section className="bg-brand-navy text-white py-16 md:py-24 text-center" aria-label="Request a quote">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
                Need {service.name.toLowerCase()}?
              </h2>
              <p className="text-brand-stone mt-4 mb-8">
                Send us your scope, drawings or tender documents and we will reply with an itemized quote.
              </p>
              <a href="/#contact" className={quoteCta}>
                <span>Get a Quote</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <p className="mt-10 text-xs font-mono uppercase tracking-wider text-brand-stone">Other services</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1">
                {others.map((o) => (
                  <li key={o.slug}>
                    <a
                      href={serviceUrl(o.slug)}
                      className="inline-flex items-center min-h-[44px] text-sm text-brand-cream hover:text-brand-orange underline-offset-4 hover:underline"
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
        <BackToTop />
      </div>
    </SmoothScroll>
  );
};
