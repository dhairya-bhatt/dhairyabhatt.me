"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/content/site";

export interface FontTheme {
  id: string;
  name: string;
  fontFamily: string;
  fontSizeClass: string;
  colorClass: string;
  glowClass?: string;
  letterSpacing?: string;
  textTransform?: string;
}

const FONT_THEMES: FontTheme[] = [
  {
    id: "century",
    name: siteConfig.name,
    fontFamily: 'Century, "Century Schoolbook", "Century Offline", Georgia, serif',
    fontSizeClass: "text-5xl sm:text-7xl md:text-8xl lg:text-[96px]",
    colorClass: "text-white",
    letterSpacing: "tracking-tight",
    textTransform: "normal-case",
  },
  {
    id: "pokemon",
    name: siteConfig.name.toUpperCase(),
    fontFamily: '"Press Start 2P", monospace',
    fontSizeClass: "text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight",
    colorClass: "text-[#FFCB05]",
    glowClass: "drop-shadow-[0_4px_0_#2A75BB] sm:drop-shadow-[0_6px_0_#2A75BB]",
    letterSpacing: "tracking-wider",
    textTransform: "uppercase",
  },
  {
    id: "bleach",
    name: siteConfig.name.toUpperCase(),
    fontFamily: '"Rubik Glitch", Impact, sans-serif',
    fontSizeClass: "text-5xl sm:text-7xl md:text-8xl lg:text-[96px]",
    colorClass: "text-red-500",
    glowClass: "drop-shadow-[0_0_20px_rgba(239,68,68,0.85)]",
    letterSpacing: "tracking-wide",
    textTransform: "uppercase italic",
  },
  {
    id: "onepiece",
    name: siteConfig.name,
    fontFamily: '"Pirata One", cursive, Georgia, serif',
    fontSizeClass: "text-6xl sm:text-8xl md:text-9xl lg:text-[105px] leading-none",
    colorClass: "text-[#FBBF24]",
    glowClass: "drop-shadow-[0_4px_16px_rgba(245,158,11,0.5)]",
    letterSpacing: "tracking-normal",
    textTransform: "normal-case",
  },
  {
    id: "evangelion",
    name: siteConfig.name.toUpperCase(),
    fontFamily: '"Bodoni Moda", Century, Georgia, serif',
    fontSizeClass: "text-5xl sm:text-7xl md:text-8xl lg:text-[96px]",
    colorClass: "text-[#FF2A2A]",
    glowClass: "drop-shadow-[0_0_24px_rgba(255,42,42,0.65)]",
    letterSpacing: "tracking-tighter",
    textTransform: "uppercase italic",
  },
  {
    id: "aot",
    name: siteConfig.name.toUpperCase(),
    fontFamily: '"Cinzel", Georgia, serif',
    fontSizeClass: "text-5xl sm:text-7xl md:text-8xl lg:text-[92px]",
    colorClass: "text-stone-100",
    glowClass: "drop-shadow-[0_4px_22px_rgba(16,185,129,0.35)]",
    letterSpacing: "tracking-widest",
    textTransform: "uppercase",
  },
];

export function FontShiftName() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const revertTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeTheme = FONT_THEMES[themeIndex];

  // Advance to next font
  const advanceTheme = () => {
    setThemeIndex((prev) => (prev + 1) % FONT_THEMES.length);
  };

  // Hover cycling animation
  useEffect(() => {
    if (isHovered && !isLocked) {
      if (revertTimerRef.current) {
        clearTimeout(revertTimerRef.current);
        revertTimerRef.current = null;
      }

      // Immediately step to next theme on hover
      advanceTheme();

      // Cycle every 550ms while hovering
      cycleTimerRef.current = setInterval(() => {
        advanceTheme();
      }, 550);
    } else {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }

      // If not locked by click, smoothly revert to Century after 1.5s
      if (!isLocked && themeIndex !== 0) {
        revertTimerRef.current = setTimeout(() => {
          setThemeIndex(0);
        }, 1500);
      }
    }

    return () => {
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, [isHovered, isLocked]);

  // Click to manually cycle and lock
  const handleClick = () => {
    if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    advanceTheme();
    setIsLocked(true);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="relative w-full cursor-pointer select-none py-1"
      title="Click or hover to switch font"
    >
      {/* Semantic SEO & Screen Readers */}
      <h1 className="sr-only">{siteConfig.name}</h1>

      {/* Main Animated Title Container */}
      <div className="relative min-h-[72px] sm:min-h-[96px] md:min-h-[120px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTheme.id}
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 1.02 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            style={{ fontFamily: activeTheme.fontFamily }}
            className={`w-full leading-none transition-colors duration-200 font-bold ${activeTheme.fontSizeClass} ${activeTheme.colorClass} ${activeTheme.glowClass || ""} ${activeTheme.letterSpacing || ""} ${activeTheme.textTransform || ""}`}
          >
            {activeTheme.name}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
