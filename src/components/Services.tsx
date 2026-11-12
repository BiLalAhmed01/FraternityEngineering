import React, { useState, useRef } from "react";
import { SITE_CONTENT, ServiceItem } from "../content";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { serviceUrl } from "../servicesData";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={serviceUrl(service.id)}
      aria-label={`Explore ${service.name}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="relative bg-brand-navy rounded-2xl border border-white/10 overflow-hidden group shadow-2xl transition-all duration-500 hover:border-brand-orange/60 hover:shadow-orange-500/20 hover:-translate-y-2 w-full h-[540px] flex-shrink-0 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange"
      style={{ width: "100%", maxWidth: "360px", minWidth: "0" }}
    >
      {/* Image Section */}
      <div className="relative h-[400px] overflow-hidden flex-shrink-0">
        <img
          src={service.image}
          alt={service.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        {/* Premium gradient overlay with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Service Number with enhanced styling */}
        <div className="absolute top-4 left-4">
          <span className="font-mono text-sm font-bold text-brand-orange bg-brand-navy/80 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-brand-orange/40 shadow-lg">
            0{index + 1}
          </span>
        </div>

        {/* Service Title Overlay with enhanced typography */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-cream/80 font-semibold">
            {service.shortTag}
          </span>
          <h3 className="font-heading font-bold text-2xl text-white leading-tight mt-2 group-hover:text-brand-orange transition-colors duration-300">
            {service.name}
          </h3>
        </div>

        {/* Hover indicator */}
        <div className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-brand-orange/20 backdrop-blur-sm border border-brand-orange/40 flex items-center justify-center transition-all duration-300 ${
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}>
          <ArrowRight className="w-5 h-5 text-brand-orange" />
        </div>
      </div>

      {/* Content Section with enhanced styling */}
      <div className="p-5 flex-1 flex flex-col bg-brand-navy relative">
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent" />

        <p className="text-sm text-brand-cream/85 leading-relaxed mb-4 flex-1 line-clamp-3">
          {service.summary}
        </p>

        {/* Explore Button with enhanced styling */}
        <span className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] text-xs font-bold uppercase tracking-[0.15em] text-brand-navy bg-brand-orange group-hover:bg-brand-orange-hover py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg group-hover:shadow-orange-500/30">
          <span>Explore Services</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange via-brand-orange-hover to-brand-orange transition-all duration-500 ${
        isHovered ? "opacity-100" : "opacity-0"
      }`} />
    </a>
  );
};

export const Services: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const services = SITE_CONTENT.services;
  const gap = 24;

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress((scrollLeft / maxScroll) * 100);
      }
    }
  };

  const scrollBy = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const highlights = [
    "Integrated Services",
    "Reliable Execution",
    "Multi-Disciplinary Team",
  ];

  return (
    <section
      id="services"
      className="relative bg-brand-navy text-brand-cream py-16 md:py-24 overflow-hidden"
      aria-label="Engineering Services"
    >
      <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="kicker-label text-brand-orange mb-3">Our Services</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white tracking-tight leading-tight mb-4">
            Five Engineering Disciplines Under One Roof.
          </h2>
          <div className="w-16 h-1 bg-brand-orange mx-auto mb-6" />
          <p className="text-base sm:text-lg text-brand-cream/80 font-normal leading-relaxed mb-8">
            Integrated engineering, construction, technical, safety, and procurement services for government, institutional, corporate and private-sector clients.
          </p>

          {/* Supporting Highlights */}
          <div className="flex flex-wrap justify-center gap-3">
            {highlights.map((highlight) => (
              <span
                key={highlight}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full bg-white/5 border border-white/10 text-brand-cream/80"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => scrollBy(-400)}
            aria-label="Scroll services left"
            className="p-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-brand-orange hover:text-brand-navy hover:border-brand-orange transition-all duration-300 hidden sm:flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-brand-orange transition-all duration-300 ease-out"
              style={{ width: `${Math.max(20, scrollProgress)}%` }}
            />
          </div>

          <button
            type="button"
            onClick={() => scrollBy(400)}
            aria-label="Scroll services right"
            className="p-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-brand-orange hover:text-brand-navy hover:border-brand-orange transition-all duration-300 hidden sm:flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Track */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-none"
          style={{ scrollBehavior: "smooth" }}
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              className="flex-shrink-0 snap-start w-[280px] sm:w-[320px] lg:w-[360px]"
            >
              <ServiceCard
                service={service}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* Mobile Swipe Indicator */}
        <div className="lg:hidden flex justify-center mt-4">
          <div className="flex gap-2">
            {services.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.round((scrollProgress / 100) * (services.length - 1)) === idx
                    ? "bg-brand-orange w-6"
                    : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-brand-cream/80 mb-6">
            Need multi-discipline coordination for your project?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-brand-navy font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
          >
            <span>Speak with our engineering team</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
