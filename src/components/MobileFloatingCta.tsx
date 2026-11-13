import React, { useEffect, useState } from "react";
import { FileText, MessageCircle, Phone } from "lucide-react";
import { SITE_CONTENT } from "../content";
import { sectionHref } from "./Header";

/**
 * Fixed quick actions on phones (<768px): Call, WhatsApp, Quote.
 * Hidden while the mobile menu is open (CSS, via body[data-menu]) and while the contact form is on screen.
 */
export const MobileFloatingCta: React.FC = () => {
  const [contactInView, setContactInView] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const observer = new IntersectionObserver(([entry]) => setContactInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  const item =
    "flex flex-1 items-center justify-center gap-2 text-[14px] font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus";

  return (
    <nav
      aria-label="Quick contact"
      aria-hidden={contactInView || undefined}
      className={`theme-dark quick-bar fixed inset-x-0 bottom-0 z-30 border-t border-line bg-navy pb-[env(safe-area-inset-bottom)] transition-opacity duration-200 md:hidden ${
        contactInView ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex h-14 divide-x divide-line">
        <a href={`tel:${SITE_CONTENT.contact.phonePrimaryTel}`} tabIndex={contactInView ? -1 : undefined} className={`${item} text-white`}>
          <Phone className="h-4 w-4 text-icon" strokeWidth={1.5} aria-hidden="true" />
          Call
        </a>
        <a
          href="https://wa.me/923315095004"
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={contactInView ? -1 : undefined}
          className={`${item} text-white`}
        >
          <MessageCircle className="h-4 w-4 text-icon" strokeWidth={1.5} aria-hidden="true" />
          WhatsApp
        </a>
        <a href={sectionHref("contact")} tabIndex={contactInView ? -1 : undefined} className={`${item} m-2 rounded-[4px] bg-accent text-on-accent transition-colors hover:bg-accent-hover`}>
          <FileText className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          Quote
        </a>
      </div>
    </nav>
  );
};
