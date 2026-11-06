import React, { useState, useRef } from "react";
import { SITE_CONTENT, ServiceItem } from "../content";
import { ArrowRight, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  onExplore: (service: ServiceItem) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  onExplore,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-brand-navy rounded-2xl border border-white/10 overflow-hidden group shadow-2xl transition-all duration-500 hover:border-brand-orange/60 hover:shadow-orange-500/20 hover:-translate-y-2 w-full h-[520px] flex-shrink-0 cursor-pointer"
      style={{ width: "100%", maxWidth: "380px", minWidth: "280px" }}
      onClick={() => onExplore(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onExplore(service);
        }
      }}
    >
      {/* Image Section - 70% of card */}
      <div className="relative h-[380px] overflow-hidden flex-shrink-0">
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
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-cream/70 font-semibold">
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
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExplore(service);
          }}
          className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-brand-navy bg-brand-orange hover:bg-brand-orange-hover py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy group-hover:scale-[1.02]"
        >
          <span>Explore Services</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange via-brand-orange-hover to-brand-orange transition-all duration-500 ${
        isHovered ? "opacity-100" : "opacity-0"
      }`} />
    </div>
  );
};

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-brand-navy rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-brand-navy/80 backdrop-blur-sm border border-white/20 text-white hover:bg-brand-orange hover:text-brand-navy transition-all duration-300 flex items-center justify-center"
            aria-label="Close service details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Header */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={service.image}
              alt={service.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-brand-cream/80 font-semibold">
                {service.shortTag}
              </span>
              <h2 className="font-heading font-bold text-3xl text-white mt-1">
                {service.name}
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-256px)]">
            <p className="text-brand-cream/90 leading-relaxed mb-6">
              {service.summary}
            </p>

            <h3 className="font-heading font-bold text-lg text-white mb-4">
              Sub-Services &amp; Scope
            </h3>
            <ul className="space-y-3 mb-8">
              {service.subservices.map((sub, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-brand-cream/90"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-brand-orange stroke-[3]" />
                  </div>
                  <span className="leading-relaxed">{sub}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="pt-4 border-t border-white/10">
              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-brand-orange hover:bg-brand-orange-hover text-brand-navy font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
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
      className="relative bg-brand-navy text-brand-cream py-20 md:py-28 overflow-hidden"
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
            className="p-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-brand-orange hover:text-brand-navy hover:border-brand-orange transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-orange transition-all duration-300 ease-out"
              style={{ width: `${Math.max(20, scrollProgress)}%` }}
            />
          </div>

          <button
            type="button"
            onClick={() => scrollBy(400)}
            aria-label="Scroll services right"
            className="p-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-brand-orange hover:text-brand-navy hover:border-brand-orange transition-all duration-300"
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
              className="flex-shrink-0 snap-start w-full sm:w-[calc(50%-12px)] lg:w-[380px]"
              style={{ maxWidth: "380px", minWidth: "280px" }}
            >
              <ServiceCard
                service={service}
                index={index}
                onExplore={setSelectedService}
              />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-brand-cream/80 mb-6">
            Need multi-discipline coordination for your project?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-brand-navy font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
          >
            <span>Speak with our engineering team</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};
