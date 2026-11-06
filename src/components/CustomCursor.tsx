import React, { useEffect, useState, useRef } from "react";

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [cursorType, setCursorType] = useState<"default" | "hover" | "view">("default");
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable on desktop pointer devices and when reduced motion is not requested
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const viewElement = target.closest('[data-cursor="view"]');
      if (viewElement) {
        setCursorType("view");
        return;
      }

      const clickable = target.closest("a, button, [role='button'], input, select, textarea, [data-cursor='hover']");
      if (clickable) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let frameId: number;
    const animate = () => {
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;
      ringPos.current.x += dx * 0.2;
      ringPos.current.y += dy * 0.2;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(frameId);
    };
  }, [isVisible]);

  if (!enabled) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Central crisp dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-brand-orange transition-transform duration-75 ease-out ${
          cursorType === "view" ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Trailing interactive ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center transition-all duration-200 ease-out border rounded-full ${
          cursorType === "view"
            ? "w-16 h-16 -ml-8 -mt-8 bg-brand-orange text-brand-charcoal border-brand-orange font-heading font-black text-[11px] tracking-widest shadow-xl scale-100"
            : cursorType === "hover"
            ? "w-10 h-10 -ml-5 -mt-5 border-brand-orange bg-brand-orange/15 scale-110"
            : "w-7 h-7 -ml-3.5 -mt-3.5 border-brand-orange/40 bg-transparent scale-100"
        }`}
      >
        {cursorType === "view" && <span className="animate-pulse">VIEW</span>}
      </div>
    </div>
  );
};
