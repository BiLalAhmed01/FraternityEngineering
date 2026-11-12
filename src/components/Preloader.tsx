import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const SEEN_KEY = "fte-splash-seen";
const MAX_MS = 2500;

/**
 * Splash video. Shown once per session, desktop only, never with reduced motion.
 * Page content renders underneath from the start; the overlay is removed after
 * the video ends, the skip button is pressed, or 2.5 seconds, whichever is first.
 */
export const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage unavailable: treat as not seen */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    if (seen || reduced || mobile) return;

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setIsVisible(true);

    const timer = setTimeout(() => setIsVisible(false), MAX_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible]);

  const close = () => setIsVisible(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="fte-preloader"
          id="fte-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center select-none overflow-hidden"
          role="dialog"
          aria-label="Fraternity Engineering & Co."
        >
          <video
            src="/assets/splash-screen.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={close}
            onError={close}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={close}
            className="absolute bottom-6 right-6 min-h-[44px] px-5 text-xs font-mono text-white bg-black/50 hover:bg-black/70 rounded uppercase tracking-wider backdrop-blur-sm"
          >
            Skip &rarr;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
