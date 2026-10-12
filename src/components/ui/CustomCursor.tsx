"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [cursorMode, setCursorMode] = useState<"default" | "hover" | "read-me">("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable for desktop mice
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    // Hide default OS cursor so the blob IS the cursor (not a ghost follower)
    document.documentElement.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if inside a project tile requesting "read-me"
      const readMeTarget = target.closest("[data-cursor='read-me']");
      if (readMeTarget) {
        setCursorMode("read-me");
        return;
      }

      // Check if interactive link/button
      const interactive = target.closest("a, button, [role='button'], input, textarea, .cursor-pointer");
      if (interactive) {
        setCursorMode("hover");
      } else {
        setCursorMode("default");
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] hidden md:flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: "spring",
        stiffness: 900,
        damping: 42,
        mass: 0.08,
      }}
    >
      <AnimatePresence mode="wait">
        {cursorMode === "read-me" ? (
          /* Sahor-style "read-me" pill badge cursor */
          <motion.div
            key="read-me"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 600, damping: 30 }}
            className="px-3.5 py-1.5 rounded-full bg-white text-black font-mono text-[9px] uppercase tracking-wider font-bold shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-black/10 flex items-center gap-1.5 select-none"
          >
            <span>read-me</span>
            <span className="text-[10px] leading-none">↗</span>
          </motion.div>
        ) : cursorMode === "hover" ? (
          /* Interactive expanded blob */
          <motion.div
            key="hover"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.4 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 600, damping: 28 }}
            className="w-9 h-9 rounded-full bg-white/20 border border-white/50 backdrop-blur-[2px] shadow-[0_0_15px_rgba(255,255,255,0.25)]"
          />
        ) : (
          /* Default fluid organic blob cursor */
          <motion.div
            key="default"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 600, damping: 30 }}
            className="w-4 h-4 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
