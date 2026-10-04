"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor for precise pointer devices (desktop mouse)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if target has interactive cursor attributes
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [role='button'], input, textarea, .cursor-pointer");
      setIsHovered(!!interactive);

      const customLabel = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      setCursorText(customLabel || "");
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center rounded-full"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isHovered ? 1.5 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 750,
        damping: 38,
        mass: 0.1,
      }}
    >
      <div
        className={`rounded-full transition-all duration-200 flex items-center justify-center ${
          cursorText
            ? "w-14 h-14 bg-white text-black font-mono text-[9px] uppercase tracking-wider font-bold shadow-xl"
            : isHovered
            ? "w-8 h-8 bg-accent/80 backdrop-blur-sm shadow-[0_0_12px_rgba(255,70,50,0.6)]"
            : "w-3 h-3 bg-white/90 shadow-md"
        }`}
      >
        {cursorText}
      </div>
    </motion.div>
  );
}
