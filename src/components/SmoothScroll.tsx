import React, { useEffect } from "react";

/**
 * Smooth wheel scrolling (Lenis). Loaded after the page is interactive so it never competes with the
 * first paint; skipped entirely under prefers-reduced-motion.
 */
export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let animationFrameId = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      const instance = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.3,
        anchors: { offset: -80 },
      });
      lenis = instance;
      const raf = (time: number) => {
        instance.raf(time);
        animationFrameId = requestAnimationFrame(raf);
      };
      animationFrameId = requestAnimationFrame(raf);
      (window as any).__lenis = instance;
    };

    const idle = (window as any).requestIdleCallback as ((cb: () => void, o?: { timeout: number }) => number) | undefined;
    const handle = idle ? idle(() => void start(), { timeout: 2000 }) : window.setTimeout(() => void start(), 1200);

    return () => {
      cancelled = true;
      if (idle) (window as any).cancelIdleCallback?.(handle);
      else window.clearTimeout(handle);
      cancelAnimationFrame(animationFrameId);
      lenis?.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
};
