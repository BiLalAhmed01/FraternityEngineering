import React, { useState, useEffect } from "react";

const SEEN_KEY = "fte-splash-seen";
const MAX_MS = 2500;
const FADE_MS = 300;

/** Skip the video on data saver or slow connections (2G/3G). */
const connectionAllowsVideo = () => {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (!conn) return true;
  if (conn.saveData) return false;
  return !["slow-2g", "2g", "3g"].includes(conn.effectiveType ?? "");
};

/**
 * Splash video. Shown once per session, desktop only, never with reduced motion, data saver or slow
 * connections. It mounts after the page has rendered (so it is not in the critical path and never the
 * LCP), shows the logo mark immediately, and is removed after the video ends, the skip button is
 * pressed, Escape, or 2.5 seconds, whichever is first.
 */
export const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage unavailable: treat as not seen */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    if (seen || reduced || mobile || !connectionAllowsVideo()) return;

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setIsVisible(true);

    const timer = setTimeout(() => setClosing(true), MAX_MS);
    return () => clearTimeout(timer);
  }, []);

  // Fade out, then unmount.
  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => setIsVisible(false), FADE_MS);
    return () => clearTimeout(t);
  }, [closing]);

  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setClosing(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible]);

  const close = () => setClosing(true);

  if (!isVisible) return null;

  return (
    <div
      id="fte-preloader"
      className={`splash ${closing ? "is-closing" : ""} fixed inset-0 z-[9999] bg-black flex items-center justify-center select-none overflow-hidden`}
      role="dialog"
      aria-label="Fraternity Engineering & Co."
    >
      {/* Logo shows at once; the video paints over it when its first frame is ready. */}
      <img src="/assets/logo-mark-160.webp" alt="" width={160} height={146} className="absolute h-24 w-auto" />
      <video
        src="/assets/splash-screen.mp4"
        autoPlay
        muted
        playsInline
        preload="metadata"
        onEnded={close}
        onError={close}
        className="relative w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={close}
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] min-h-[44px] px-5 text-sm font-medium text-white bg-black/50 hover:bg-black/70 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
      >
        Skip
      </button>
    </div>
  );
};
