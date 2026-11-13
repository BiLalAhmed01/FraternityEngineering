import React from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/923315095004";

export const WhatsAppBubble: React.FC = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="back-to-top theme-dark fixed bottom-20 right-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-navy text-white transition-colors duration-200 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:bottom-6 md:right-6"
  >
    <MessageCircle className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
  </a>
);
