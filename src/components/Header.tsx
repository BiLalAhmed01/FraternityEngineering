import React, { useState, useEffect } from "react";
import { BrandLogo } from "./BrandLogo";
import { SITE_CONTENT } from "../content";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";

export const HEADER_OFFSET = 80;

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = window.location.pathname === "/";
  const [activeSection, setActiveSection] = useState(
    window.location.pathname.startsWith("/services") ? "services" : ""
  );

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Highlight the section under the sticky header (home page only)
  useEffect(() => {
    if (!isHome) return;
    const sections = ["services", "work", "clients", "about", "process", "faq", "contact"];
    const handleScroll = () => {
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= HEADER_OFFSET + 40) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Services", href: "/#services", id: "services" },
    { label: "Our Work", href: "/#work", id: "work" },
    { label: "Clients", href: "/#clients", id: "clients" },
    { label: "About", href: "/#about", id: "about" },
    { label: "Process", href: "/#process", id: "process" },
    { label: "Contact", href: "/#contact", id: "contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ${
          isScrolled
            ? "py-2 bg-brand-navy/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40"
            : "py-4 md:py-6 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <BrandLogo isBlueBg={true} />
            </div>

            {/* Desktop Navigation with premium styling */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative group px-4 min-h-[44px] inline-flex items-center text-sm font-medium transition-all duration-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                    activeSection === item.id
                      ? "text-brand-orange"
                      : "text-brand-stone hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Active indicator */}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-brand-orange/10 rounded-lg border border-brand-orange/30"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-brand-orange to-brand-orange-hover scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out" />
                </a>
              ))}
            </nav>

            {/* Header Right Actions with premium styling */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Phone number with enhanced styling */}
              <a
                href={`tel:${SITE_CONTENT.contact.phonePrimaryTel}`}
                className="hidden xl:flex items-center gap-2.5 text-xs font-semibold text-brand-stone hover:text-white transition-all duration-300 min-h-[44px] px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                title="Call office directly"
              >
                <div className="p-1.5 rounded-full bg-brand-orange/20">
                  <Phone className="w-3 h-3 text-brand-orange" />
                </div>
                <span>{SITE_CONTENT.contact.phonePrimary}</span>
              </a>

              {/* Premium Get a Quote button */}
              <MagneticButton
                as="a"
                href="/#contact"
                className="relative inline-flex min-h-[44px] items-center justify-center gap-2.5 px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-brand-orange to-brand-orange-hover hover:from-brand-orange-hover hover:to-brand-orange text-brand-charcoal transition-all duration-300 rounded-full shadow-lg hover:shadow-orange-500/40 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-orange focus-visible:ring-offset-brand-navy group"
              >
                <span className="relative z-10">Get a Quote</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </MagneticButton>
            </div>

            {/* Mobile Menu Button with premium styling */}
            <div className="flex lg:hidden items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative p-3 text-brand-stone hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* Premium scroll-progress line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-orange via-brand-orange-hover to-brand-orange origin-left pointer-events-none"
          style={{ scaleX }}
        />
      </header>

      {/* Premium Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 max-w-sm w-full bg-gradient-to-b from-brand-navy to-brand-charcoal border-l border-white/10 p-8 flex flex-col justify-between shadow-2xl"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-8 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center">
                      <span className="text-brand-orange font-bold text-sm">FTE</span>
                    </div>
                    <span className="font-heading font-bold text-white text-lg tracking-wide">
                      Menu
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 text-brand-stone hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-orange"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile Navigation">
                  {navLinks.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`px-4 py-3.5 min-h-[48px] text-base font-semibold rounded-xl transition-all duration-300 ${
                        activeSection === item.id
                          ? "text-brand-orange bg-brand-orange/10 border border-brand-orange/30"
                          : "text-white/90 hover:text-brand-orange hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {item.label}
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="pt-8 border-t border-white/10 space-y-5">
                {/* Contact Info */}
                <div className="text-xs text-brand-stone space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                    <p className="font-medium text-white">Islamabad Headquarters</p>
                  </div>
                  <p className="pl-3.5">{SITE_CONTENT.contact.address}</p>
                  <p className="pl-3.5 text-white font-semibold">{SITE_CONTENT.contact.phoneDisplay}</p>
                </div>

                {/* CTA Button */}
                <a
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-brand-orange to-brand-orange-hover text-brand-charcoal font-bold text-sm uppercase tracking-wider rounded-full shadow-lg hover:shadow-orange-500/40 transition-all duration-300"
                >
                  <span>Get a Quote</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
