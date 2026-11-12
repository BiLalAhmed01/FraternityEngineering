/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { WhyFTE } from "./components/WhyFTE";
import { ClientsMarquee } from "./components/ClientsMarquee";
import { About } from "./components/About";
import { Testimonials } from "./components/Testimonials";
import { Faq } from "./components/Faq";
import { Process } from "./components/Process";
import { Contact, ContactRef } from "./components/Contact";
import { Footer } from "./components/Footer";
import { MobileFloatingCta } from "./components/MobileFloatingCta";
import { BackToTop } from "./components/BackToTop";
import { CookieConsent } from "./components/CookieConsent";
import { FilmGrain } from "./components/FilmGrain";
import { Preloader } from "./components/Preloader";
import { SmoothScroll } from "./components/SmoothScroll";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { ServicePage } from "./pages/ServicePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { getServicePage } from "./servicesData";

export default function App() {
  const contactRef = useRef<ContactRef>(null);
  const path = window.location.pathname.replace(/\.html$/, "");

  if (path === "/privacy") return <PrivacyPage />;
  if (path === "/terms") return <TermsPage />;
  if (path.startsWith("/services/")) {
    const service = getServicePage(path.slice("/services/".length).replace(/\/$/, ""));
    return service ? <ServicePage service={service} /> : <NotFoundPage />;
  }
  if (path !== "/" && path !== "") return <NotFoundPage />;

  return (
    <SmoothScroll>
      {/* 1. Subtle Preloader under 1.2s */}
      <Preloader />

      {/* 2. Fine Film-Grain Overlay (3% opacity) */}
      <FilmGrain />

      <div className="min-h-screen bg-brand-cream text-brand-brown font-body flex flex-col selection:bg-brand-orange selection:text-brand-charcoal overflow-x-clip">
        {/* Sticky/Fixed Header with Glass Transition & Orange Progress line */}
        <Header />

        <main className="flex-1">
          {/* Hero: disciplines index with image slideshow, trust row */}
          <Hero />

          {/* Services (5 Interactive 3D Icons, Clean Accordion) */}
          <Services />

          {/* Our Work (Project Showcase) */}
          <WhyFTE
            onRequestProject={(discipline, projectTitle) =>
              contactRef.current?.prefillService(discipline, projectTitle)
            }
          />

          {/* Clients (Logo Band) */}
          <ClientsMarquee />

          {/* About (Story, Mission and Vision, Credentials) */}
          <About />

          {/* Testimonials (hidden when empty) */}
          <Testimonials />

          {/* Process (4-Step Timeline with Scroll-Linked Progress Line) */}
          <Process />

          {/* FAQ */}
          <Faq />

          {/* Contact (Floating Labels, Inline Validation, Draw Checkmark) */}
          <Contact ref={contactRef} />
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating Call & WhatsApp Buttons on Mobile */}
        <MobileFloatingCta />

        {/* Smooth-Scrolling Back to Top Button */}
        <BackToTop />

        {/* Cookie Consent Banner */}
        <CookieConsent />
      </div>
    </SmoothScroll>
  );
}
