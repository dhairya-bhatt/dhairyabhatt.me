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
    id: "pokemon-solid",
    name: siteConfig.name.toUpperCase(),
    fontFamily: '"Pokemon Solid", "Press Start 2P", monospace',
    fontSizeClass: "text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight",
    colorClass: "text-[#FFCB05]",
    glowClass: "drop-shadow-[0_4px_0_#2A75BB] sm:drop-shadow-[0_6px_0_#2A75BB]",
    letterSpacing: "tracking-wide",
    textTransform: "uppercase",
  },
  {
    id: "bleach",
    name: siteConfig.name.toUpperCase(),
    fontFamily: '"Bleach Anime", "Rubik Glitch", Impact, sans-serif',
    fontSizeClass: "text-5xl sm:text-7xl md:text-8xl lg:text-[96px]",
    colorClass: "text-red-500",
    glowClass: "drop-shadow-[0_0_20px_rgba(239,68,68,0.85)]",
    letterSpacing: "tracking-wider",
    textTransform: "uppercase",
  },
  {
    id: "onepiece",
    name: siteConfig.name.toUpperCase(),
    fontFamily: '"One Piece Manga", "Pirata One", cursive, Georgia, serif',
    fontSizeClass: "text-5xl sm:text-7xl md:text-8xl lg:text-[94px] leading-tight",
    colorClass: "text-[#FBBF24]",
    glowClass: "drop-shadow-[0_4px_16px_rgba(245,158,11,0.5)]",
    letterSpacing: "tracking-wider",
    textTransform: "uppercase",
  },
  {
    id: "evangelion",
    name: siteConfig.name.toUpperCase(),
    fontFamily: '"Evangelion Anime", "Bodoni Moda", Century, Georgia, serif',
    fontSizeClass: "text-5xl sm:text-7xl md:text-8xl lg:text-[96px]",
    colorClass: "text-[#FF2A2A]",
    glowClass: "drop-shadow-[0_0_24px_rgba(255,42,42,0.65)]",
    letterSpacing: "tracking-tighter",
    textTransform: "uppercase italic",
  },
  {
    id: "aot",
    name: siteConfig.name.toUpperCase(),
    fontFamily: '"Attack On Titan", "Cinzel", Georgia, serif',
    fontSizeClass: "text-4xl sm:text-6xl md:text-7xl lg:text-[84px]",
    colorClass: "text-stone-100",
    glowClass: "drop-shadow-[0_4px_22px_rgba(16,185,129,0.35)]",
    letterSpacing: "tracking-wider",
    textTransform: "uppercase",
  },
  {
    id: "pokemon-hollow",
    name: siteConfig.name.toUpperCase(),
    fontFamily: '"Pokemon Hollow", "Pokemon Solid", monospace',
    fontSizeClass: "text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight",
    colorClass: "text-[#2A75BB]",
    glowClass: "drop-shadow-[0_0_12px_rgba(255,203,5,0.7)]",
    letterSpacing: "tracking-wide",
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

  // Warm and force-load all user-uploaded offline fonts into the browser GPU immediately on mount
  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.load('32px "Pokemon Solid"');
      document.fonts.load('32px "Pokemon Hollow"');
      document.fonts.load('32px "Bleach Anime"');
      document.fonts.load('32px "One Piece Manga"');
      document.fonts.load('32px "Evangelion Anime"');
      document.fonts.load('32px "Attack On Titan"');
      document.fonts.load('32px "Century Offline"');
    }
  }, []);

  // Advance to next font
  const advanceTheme = () => {
    setThemeIndex((prev) => (prev + 1) % FONT_THEMES.length);
  };

  // Hover cycling animation: comfortably spaced at 1100ms
  useEffect(() => {
    if (isHovered && !isLocked) {
      if (revertTimerRef.current) {
        clearTimeout(revertTimerRef.current);
        revertTimerRef.current = null;
      }

      // Step to next font when hover begins
      advanceTheme();

      // Cycle every 1100ms while user maintains hover
      cycleTimerRef.current = setInterval(() => {
        advanceTheme();
      }, 1100);
    } else {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }

      // Smoothly revert to Century after mouse leaves
      if (!isLocked && themeIndex !== 0) {
        revertTimerRef.current = setTimeout(() => {
          setThemeIndex(0);
        }, 1200);
      }
    }

    return () => {
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, [isHovered, isLocked]);

  // Click advances immediately and toggles lock
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

      {/* Invisible font-warmer ensuring every font glyph is pre-rendered in memory */}
      <div className="absolute opacity-0 pointer-events-none -z-50 h-0 overflow-hidden" aria-hidden="true">
        <span style={{ fontFamily: '"Pokemon Solid"' }}>{siteConfig.name}</span>
        <span style={{ fontFamily: '"Pokemon Hollow"' }}>{siteConfig.name}</span>
        <span style={{ fontFamily: '"Bleach Anime"' }}>{siteConfig.name}</span>
        <span style={{ fontFamily: '"One Piece Manga"' }}>{siteConfig.name}</span>
        <span style={{ fontFamily: '"Evangelion Anime"' }}>{siteConfig.name}</span>
        <span style={{ fontFamily: '"Attack On Titan"' }}>{siteConfig.name}</span>
        <span style={{ fontFamily: '"Century Offline"' }}>{siteConfig.name}</span>
      </div>

      {/* Main Animated Title Container without any tags */}
      <div className="relative min-h-[72px] sm:min-h-[96px] md:min-h-[120px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTheme.id}
            initial={{ opacity: 0, y: 4, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 1.01 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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
