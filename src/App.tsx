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
import { MissionVision } from "./components/MissionVision";
import { Process } from "./components/Process";
import { Contact, ContactRef } from "./components/Contact";
import { Footer } from "./components/Footer";
import { MobileFloatingCta } from "./components/MobileFloatingCta";
import { BackToTop } from "./components/BackToTop";
import { CookieConsent } from "./components/CookieConsent";
import { FilmGrain } from "./components/FilmGrain";
import { CustomCursor } from "./components/CustomCursor";
import { Preloader } from "./components/Preloader";
import { SmoothScroll } from "./components/SmoothScroll";
import { SlantedBeamDivider } from "./components/SlantedBeamDivider";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";

export default function App() {
  const contactRef = useRef<ContactRef>(null);
  const path = window.location.pathname.replace(/\.html$/, "");

  if (path === "/privacy") return <PrivacyPage />;
  if (path === "/terms") return <TermsPage />;

  return (
    <SmoothScroll>
      {/* 1. Subtle Preloader under 1.2s */}
      <Preloader />

      {/* 2. Custom Cursor with "VIEW" states for desktop */}
      <CustomCursor />

      {/* 3. Fine Film-Grain Overlay (3% opacity) */}
      <FilmGrain />

      <div className="min-h-screen bg-brand-cream text-brand-brown font-body flex flex-col selection:bg-brand-orange selection:text-brand-charcoal overflow-x-hidden">
        {/* Sticky/Fixed Header with Glass Transition & Orange Progress line */}
        <Header />

        <main className="flex-1">
          {/* Hero Section with 3D Visualization */}
          <Hero />

          {/* Services (5 Interactive 3D Icons, Clean Accordion) */}
          <Services />

          {/* Slanted Beam Divider */}
          <SlantedBeamDivider fromColor="cream" toColor="charcoal" />

          {/* Our Work (Project Showcase with Quote Preview) */}
          <WhyFTE />

          {/* Slanted Beam Divider */}
          <SlantedBeamDivider fromColor="cream" toColor="charcoal" flip />

          {/* Clients (Plain Text List) */}
          <ClientsMarquee />

          {/* Mission and Vision (Side-by-Side Panels on Navy) */}
          <MissionVision />

          {/* Process (4-Step Timeline with Scroll-Linked Progress Line) */}
          <Process />

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
