import React from "react";
import { motion, useScroll, useSpring } from "motion/react";

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-brand-orange origin-left z-50 pointer-events-none shadow-[0_1px_8px_rgba(255,107,0,0.6)]"
      style={{ scaleX }}
      role="progressbar"
      aria-label="Window scroll progress"
    />
  );
};
