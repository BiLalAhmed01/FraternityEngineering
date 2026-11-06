import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="fte-preloader"
          id="fte-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center select-none overflow-hidden"
          role="status"
          aria-label="Loading Fraternity Engineering"
        >
          {/* Video Splash Screen - Desktop */}
          {!isMobile && !videoError && (
            <video
              src="/assets/splash-screen.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnd}
              onError={handleVideoError}
              className="w-full h-full object-cover"
            />
          )}

          {/* Video Splash Screen - Mobile/Tablet */}
          {isMobile && !videoError && (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <video
                src="/assets/splash-screen.mp4"
                autoPlay
                muted
                playsInline
                preload="metadata"
                onEnded={handleVideoEnd}
                onError={handleVideoError}
                className="w-full h-full object-cover object-center"
                style={{
                  // Mobile-specific object position to avoid cropping logo
                  objectPosition: "center center",
                }}
              />
              {/* Mobile overlay for better visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
            </div>
          )}

          {/* Static Fallback Logo - shows if video fails or on reduced motion */}
          {videoError && (
            <div className="flex flex-col items-center justify-center space-y-6">
              <motion.img
                src="/assets/logo.webp"
                alt="Fraternity Engineering & Co."
                className="w-48 h-48 md:w-64 md:h-64 object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
                  Fraternity Engineering & Co.
                </p>
                <p className="text-sm text-brand-stone mt-2 font-mono uppercase tracking-wider">
                  Makes Life Easier
                </p>
              </motion.div>
            </div>
          )}

          {/* Loading indicator overlay - Desktop */}
          {!isMobile && !videoError && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-brand-orange animate-pulse" style={{ width: "60%" }} />
              </div>
              <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
                Loading...
              </p>
            </div>
          )}

          {/* Loading indicator overlay - Mobile */}
          {isMobile && !videoError && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="w-6 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-brand-orange animate-pulse" style={{ width: "60%" }} />
              </div>
              <p className="text-[9px] font-mono text-white/60 uppercase tracking-widest">
                Loading...
              </p>
            </div>
          )}

          {/* Skip button - Desktop */}
          {!isMobile && !videoError && (
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="absolute bottom-6 right-6 text-[11px] font-mono text-white/60 hover:text-white px-3 py-1.5 rounded bg-black/20 hover:bg-black/40 transition-colors uppercase tracking-wider backdrop-blur-sm"
            >
              Skip &rarr;
            </button>
          )}

          {/* Skip button - Mobile */}
          {isMobile && !videoError && (
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="absolute bottom-4 right-4 text-[10px] font-mono text-white/60 hover:text-white px-3 py-1.5 rounded bg-black/30 hover:bg-black/50 transition-colors uppercase tracking-wider backdrop-blur-sm"
            >
              Skip &rarr;
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
