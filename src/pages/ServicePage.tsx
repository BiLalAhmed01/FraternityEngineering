import React, { useEffect } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
  "inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-4 bg-accent hover:bg-accent-hover text-on-accent font-semibold text-sm rounded-[4px] transition-colors";

const gutter = "max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]";
const h2Class = "font-heading font-semibold text-3xl sm:text-4xl tracking-tight text-white";

/** Orange registration marks on the corners of a framed image, like a drawing sheet. */
const Brackets: React.FC = () => (
  <>
    <span aria-hidden="true" className="absolute -top-2 -left-2 w-7 h-7 border-t-2 border-l-2 border-accent" />
    <span aria-hidden="true" className="absolute -top-2 -right-2 w-7 h-7 border-t-2 border-r-2 border-accent" />
    <span aria-hidden="true" className="absolute -bottom-2 -left-2 w-7 h-7 border-b-2 border-l-2 border-accent" />
    <span aria-hidden="true" className="absolute -bottom-2 -right-2 w-7 h-7 border-b-2 border-r-2 border-accent" />
  </>
);

export const ServicePage: React.FC<{ service: ServicePageData }> = ({ service }) => {
  useEffect(() => {
    document.title = `${service.name} | Fraternity Engineering`;
    window.scrollTo(0, 0);
  }, [service]);

  const others = SERVICE_PAGES.filter((s) => s.slug !== service.slug);

  return (
    <SmoothScroll>
      <div className="theme-dark min-h-screen bg-midnight text-fg font-body flex flex-col overflow-x-hidden">
        <Header />

        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {/* Hero: headline on the left, framed photo with a title block on the right */}
          <section className="cad-grid relative bg-midnight pt-32 pb-20 md:pt-40 md:pb-28" aria-label={service.name}>
            <div className={`${gutter} grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12 items-center`}>
              <div className="lg:col-span-7 hero-rise">
                <nav aria-label="Breadcrumb" className="text-sm text-fg-muted mb-8">
                  <a href="/" className="hover:text-white underline-offset-4 hover:underline">Home</a>
                  <span aria-hidden="true" className="mx-2 text-accent">/</span>
                  <a href="/#services" className="hover:text-white underline-offset-4 hover:underline">Services</a>
                </nav>
                <p className="inline-block border-l-2 border-accent pl-3 text-base font-medium text-fg-muted mb-6">
                  {service.shortTag}
                </p>
                <h1 className="font-heading font-semibold text-5xl sm:text-6xl xl:text-7xl leading-[1.02] tracking-tight text-white">
                  {service.name}
                </h1>
                <p className="mt-8 text-lg sm:text-xl text-fg-muted leading-relaxed max-w-xl">{service.overview}</p>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <a href="/#contact" className={quoteCta}>
                    <span>Request a quote</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#scopes"
                    className="inline-flex items-center min-h-[48px] text-sm font-semibold text-white underline underline-offset-8 decoration-line-strong hover:decoration-accent transition-colors"
                  >
                    See what we deliver
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 hero-frame-in">
                <div className="relative mx-2">
                  <Brackets />
                  <img
                    src={service.image}
                    srcSet={photoSrcSet(service.image)}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    width={1024}
                    height={768}
                    fetchPriority="high"
                    decoding="async"
                    alt={service.name}
                    className="svc-photo w-full aspect-[4/5] object-cover"
                  />
                  <dl className="absolute left-0 right-0 bottom-0 sm:right-auto sm:-left-6 sm:-bottom-6 sm:min-w-[260px] grid grid-cols-2 bg-navy border border-line-strong">
                    <div className="px-4 py-3 border-r border-line-strong">
                      <dt className="text-xs text-fg-subtle">Scopes covered</dt>
                      <dd className="font-heading font-semibold text-2xl text-white">{service.subservices.length}</dd>
                    </div>
                    <div className="px-4 py-3">
                      <dt className="text-xs text-fg-subtle">Delivery</dt>
                      <dd className="font-heading font-semibold text-2xl text-white">Consult to handover</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>

          {/* Overview beside the scope list */}
          <section id="scopes" className="bg-navy py-20 md:py-28" aria-label="Overview and scopes">
            <div className={`${gutter} grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20`}>
              <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
                <h2 className={h2Class}>Overview</h2>
                <div className="w-14 h-[3px] bg-accent mt-5 mb-6" />
                <p className="text-lg text-fg-muted leading-relaxed max-w-md">{service.summary}</p>
              </div>
              <div className="lg:col-span-7">
                <h2 className={h2Class}>What we deliver</h2>
                <ul className="mt-8 border-t border-line-strong">
                  {service.subservices.map((item) => (
                    <li
                      key={item}
                      className="group flex items-center gap-5 border-b border-line-strong py-5 pl-1 pr-3 transition-colors hover:bg-midnight/60"
                    >
                      <span aria-hidden="true" className="w-2.5 h-2.5 bg-accent shrink-0 transition-transform group-hover:rotate-45" />
                      <span className="text-lg sm:text-xl text-white leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Standards followed (hidden until populated in servicesData.ts) */}
          {service.standards.length > 0 && (
            <section className="bg-midnight pt-20 md:pt-28" aria-label="Standards followed">
              <div className={gutter}>
                <h2 className={h2Class}>Standards followed</h2>
                <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.standards.map((std) => (
                    <li key={std} className="bg-navy border-l-2 border-accent p-5 text-white">
                      {std}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* How we work: a real sequence, so it gets numbers and a rail */}
          <section className="cad-grid bg-midnight py-20 md:py-28" aria-label="How we work">
            <div className={gutter}>
              <h2 className={h2Class}>How we work</h2>
              <div className="w-14 h-[3px] bg-accent mt-5 mb-14" />
              <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                <span aria-hidden="true" className="hidden lg:block absolute top-[11px] left-0 right-0 h-px bg-line-strong" />
                {SITE_CONTENT.processSteps.map((step) => (
                  <li key={step.step} className="relative">
                    <span aria-hidden="true" className="relative block w-[23px] h-[23px] rounded-full border-2 border-accent bg-midnight">
                      <span className="absolute inset-[4px] rounded-full bg-accent" />
                    </span>
                    <p className="mt-6 font-heading font-semibold text-5xl text-navy [-webkit-text-stroke:1px_var(--steel)] leading-none">
                      {step.step}
                    </p>
                    <h3 className="font-heading font-semibold text-2xl text-white mt-4 mb-2">{step.title}</h3>
                    <p className="text-fg-muted leading-relaxed">{step.summary}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Related projects */}
          {service.relatedProjects.length > 0 && (
            <section className="bg-navy py-20 md:py-28" aria-label="Related projects">
              <div className={gutter}>
                <h2 className={h2Class}>Related projects</h2>
                <div className="w-14 h-[3px] bg-accent mt-5 mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {service.relatedProjects.map((work) => (
                    <article key={work.id} className="group flex flex-col bg-midnight border border-line">
                      <div className="relative overflow-hidden">
                        <img
                          src={CATEGORY_IMAGES[work.category]}
                          srcSet={photoSrcSet(CATEGORY_IMAGES[work.category])}
                          sizes="(min-width: 768px) 50vw, 100vw"
                          width={1024}
                          height={576}
                          alt={`${work.category} work`}
                          loading="lazy"
                          decoding="async"
                          className="svc-photo w-full aspect-[16/9] object-cover"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/20 to-transparent" />
                        <h3 className="absolute left-0 right-0 bottom-0 px-6 pb-5 font-heading font-semibold text-2xl leading-snug text-white">
                          {work.title}
                        </h3>
                        <span
                          aria-hidden="true"
                          className="absolute left-0 bottom-0 h-[3px] w-full bg-accent origin-left scale-x-[0.18] transition-transform duration-500 group-hover:scale-x-100"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <dl className="flex flex-wrap gap-x-10 gap-y-2 text-sm">
                          <div>
                            <dt className="text-fg-subtle">Location</dt>
                            <dd className="font-semibold text-white">{work.location}</dd>
                          </div>
                          {work.year && (
                            <div>
                              <dt className="text-fg-subtle">Year</dt>
                              <dd className="font-semibold text-white">{work.year}</dd>
                            </div>
                          )}
                        </dl>
                        <p className="mt-4 text-fg-muted leading-relaxed">{work.scope}</p>
                        <p className="mt-3 font-semibold text-white">{work.delivered}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="bg-midnight py-20 md:py-28" aria-label="Frequently asked questions">
            <div className="max-w-3xl mx-auto px-[clamp(20px,5vw,64px)]">
              <h2 className={h2Class}>Questions</h2>
              <div className="w-14 h-[3px] bg-accent mt-5 mb-10" />
              <FaqAccordion items={service.faq} idPrefix="svc-faq" />
            </div>
          </section>

          {/* Quote CTA */}
          <section className="bg-navy py-20 md:py-28" aria-label="Request a quote">
            <div className={gutter}>
              <div className="relative bg-midnight border border-line-strong p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent" />
                <div className="lg:col-span-8">
                  <h2 className="font-heading font-semibold text-4xl sm:text-5xl tracking-tight text-white leading-[1.05]">
                    Tell us about your project.
                  </h2>
                  <p className="text-lg text-fg-muted mt-5 max-w-xl">
                    Send us your scope, drawings or tender documents and we will reply with an itemised quote.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:justify-self-end">
                  <a href="/#contact" className={quoteCta}>
                    <span>Request a quote</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <h3 className="mt-16 mb-5 font-heading font-semibold text-xl text-white">Other services</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {others.map((o) => (
                  <li key={o.slug}>
                    <a
                      href={serviceUrl(o.slug)}
                      className="group flex items-center justify-between gap-3 min-h-[64px] px-5 bg-midnight border border-line hover:border-accent transition-colors text-white"
                    >
                      <span className="font-medium">{o.name}</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0 text-fg-subtle group-hover:text-accent transition-colors" aria-hidden="true" />
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
