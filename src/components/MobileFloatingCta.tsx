import React from "react";
import { Phone, MessageCircle, FileText } from "lucide-react";
import { SITE_CONTENT } from "../content";

/**
 * Sticky bottom bar on mobile and tablet: Call, WhatsApp, Quote.
 * It replaces the old floating WhatsApp/call buttons, so only one set of quick actions shows.
 */
export const MobileFloatingCta: React.FC = () => {
  const item =
    "flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-[11px] font-bold uppercase tracking-wider focus-visible:outline-2 focus-visible:outline-offset-[-3px]";

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex bg-brand-charcoal border-t border-white/15 pb-[env(safe-area-inset-bottom)]"
      aria-label="Quick contact"
    >
      <a href={`tel:${SITE_CONTENT.contact.phonePrimaryTel}`} className={`${item} text-white hover:bg-white/10`}>
        <Phone className="w-5 h-5" aria-hidden="true" />
        <span>Call</span>
      </a>
      <a
        href={SITE_CONTENT.contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${item} text-white hover:bg-white/10 border-x border-white/15`}
      >
        <MessageCircle className="w-5 h-5 text-[#25D366]" aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
      <a href="/#contact" className={`${item} bg-brand-orange text-brand-charcoal hover:bg-brand-orange-hover`}>
        <FileText className="w-5 h-5" aria-hidden="true" />
        <span>Quote</span>
      </a>
    </nav>
  );
};
