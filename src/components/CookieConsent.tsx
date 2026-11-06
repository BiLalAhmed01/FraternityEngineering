import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "fte-cookie-consent";

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      /* storage unavailable */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6 pointer-events-none"
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <div className="max-w-3xl mx-auto pointer-events-auto bg-brand-navy/95 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-brand-cream/90 leading-relaxed">
            We use essential cookies for site functionality. No tracking or advertising cookies are
            used. See our{" "}
            <a href="/privacy" className="text-brand-orange hover:underline font-medium">
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={accept}
            className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-brand-charcoal text-xs font-bold uppercase tracking-wider rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={accept}
            className="p-2 text-brand-stone hover:text-white transition-colors"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
