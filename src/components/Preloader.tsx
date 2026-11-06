import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(false);
      return;
    }

    // Fallback timeout in case video doesn't end properly (10 seconds max)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="fte-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center select-none overflow-hidden"
          role="status"
          aria-label="Loading Fraternity Engineering"
        >
          {/* Video Splash Screen */}
          <video
            src="/assets/splash-screen.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
          />

          {/* Loading indicator overlay */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-brand-orange animate-pulse" style={{ width: "60%" }} />
            </div>
            <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
              Loading...
            </p>
          </div>

          {/* Skip button */}
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="absolute bottom-6 right-6 text-[11px] font-mono text-white/60 hover:text-white px-3 py-1.5 rounded bg-black/20 hover:bg-black/40 transition-colors uppercase tracking-wider backdrop-blur-sm"
          >
            Skip &rarr;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
