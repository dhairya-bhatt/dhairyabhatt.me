"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface MarqueeStripProps {
  text?: string;
  className?: string;
}

export function MarqueeStrip({
  text = "ABOUT ME · ABOUT ME · ABOUT ME · ABOUT ME · ",
  className = "",
}: MarqueeStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position relative to the container / page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Moves horizontally as the user scrolls the page
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-35%"]);

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden select-none border-y border-white/[0.08] py-3 md:py-5 bg-[#141414] ${className}`}
    >
      <motion.div
        style={{ x }}
        className="flex whitespace-nowrap will-change-transform"
      >
        <span className="font-century text-4xl sm:text-6xl md:text-8xl tracking-tight text-white uppercase font-normal mr-6">
          {text}
        </span>
        <span className="font-century text-4xl sm:text-6xl md:text-8xl tracking-tight text-white uppercase font-normal mr-6" aria-hidden="true">
          {text}
        </span>
        <span className="font-century text-4xl sm:text-6xl md:text-8xl tracking-tight text-white uppercase font-normal mr-6" aria-hidden="true">
          {text}
        </span>
        <span className="font-century text-4xl sm:text-6xl md:text-8xl tracking-tight text-white uppercase font-normal mr-6" aria-hidden="true">
          {text}
        </span>
      </motion.div>
    </div>
  );
}
