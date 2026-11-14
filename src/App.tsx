/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useRef } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import type { ContactRef } from "./components/Contact";
import { MobileFloatingCta } from "./components/MobileFloatingCta";
import { WhatsAppBubble } from "./components/WhatsAppBubble";
import { CookieConsent } from "./components/CookieConsent";
import { SmoothScroll } from "./components/SmoothScroll";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { getServicePage } from "./servicesData";

// Below-the-fold sections and secondary routes load as separate chunks. The prerender waits for them,
// so their content is still in the HTML; hydration picks them up as each chunk arrives.
const Services = lazy(() => import("./components/Services").then((m) => ({ default: m.Services })));
const WhyFTE = lazy(() => import("./components/WhyFTE").then((m) => ({ default: m.WhyFTE })));
const ClientsMarquee = lazy(() => import("./components/ClientsMarquee").then((m) => ({ default: m.ClientsMarquee })));
const About = lazy(() => import("./components/About").then((m) => ({ default: m.About })));
const Testimonials = lazy(() => import("./components/Testimonials").then((m) => ({ default: m.Testimonials })));
const Process = lazy(() => import("./components/Process").then((m) => ({ default: m.Process })));
const Faq = lazy(() => import("./components/Faq").then((m) => ({ default: m.Faq })));
const Contact = lazy(() => import("./components/Contact").then((m) => ({ default: m.Contact })));
const Footer = lazy(() => import("./components/Footer").then((m) => ({ default: m.Footer })));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/TermsPage").then((m) => ({ default: m.TermsPage })));
const ServicePage = lazy(() => import("./pages/ServicePage").then((m) => ({ default: m.ServicePage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Routes />
      </Suspense>
    </ErrorBoundary>
  );
}

function Routes() {
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

      <div className="min-h-screen bg-bg text-fg font-body flex flex-col selection:bg-surface-2 selection:text-fg overflow-x-clip">
        {/* Fixed navbar: transparent over the hero, solid navy once scrolled */}
        <Header />

        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {/* Hero: disciplines index with image slideshow, trust row */}
          <Hero />

          <Suspense fallback={null}>
          {/* Services (looping carousel) */}
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

          {/* Process (four stages) */}
          <Process />

          {/* FAQ */}
          <Faq />

          {/* Contact (quote form, details, map) */}
          <Contact ref={contactRef} />
          </Suspense>
        </main>

        {/* Footer */}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        {/* Quick actions bar on phones */}
        <MobileFloatingCta />

        {/* WhatsApp chat bubble */}
        <WhatsAppBubble />

        {/* Cookie Consent Banner */}
        <CookieConsent />
      </div>
    </SmoothScroll>
  );
}
