import React, { useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";
import { SITE_CONTENT } from "../content";

export const MobileFloatingCta: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="lg:hidden fixed bottom-5 right-4 z-40 p-3 bg-brand-orange text-brand-charcoal rounded-full shadow-2xl border-2 border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        aria-label="Open contact quick actions"
      >
        <Phone className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div
      className="lg:hidden fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2"
      role="region"
      aria-label="Quick contact buttons"
    >
      <div className="flex items-center gap-2 bg-brand-charcoal/95 backdrop-blur-md p-1.5 pl-3 rounded-full border border-white/20 shadow-2xl">
        <span className="text-[11px] font-mono font-bold text-brand-orange tracking-wider uppercase pr-1">
          Quick Contact
        </span>

        {/* WhatsApp Button */}
        <a
          href={SITE_CONTENT.contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow transition-transform active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        {/* Direct Call Button */}
        <a
          href={`tel:${SITE_CONTENT.contact.phonePrimary.replace(/-/g, "")}`}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-orange text-brand-charcoal shadow font-bold transition-transform active:scale-95"
          aria-label="Direct Call to Fraternity Engineering"
        >
          <Phone className="w-4 h-4" />
        </a>

        {/* Minimize Button */}
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="p-1 text-brand-stone hover:text-white rounded-full"
          aria-label="Minimize quick contact actions"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
