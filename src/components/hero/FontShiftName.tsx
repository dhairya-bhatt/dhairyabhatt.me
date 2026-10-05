"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/content/site";
import { Sparkles, Shuffle } from "lucide-react";

export interface FontTheme {
  id: string;
  label: string;
  universeTag: string;
  fontClass: string;
  fontSizeClass: string;
  colorClass: string;
  glowClass?: string;
  letterSpacing?: string;
  textTransform?: string;
  badgeBorder: string;
  badgeText: string;
  badgeBg: string;
}

const FONT_THEMES: FontTheme[] = [
  {
    id: "century",
    label: "Century Bold",
    universeTag: "ORIGINAL CENTURY",
    fontClass: "font-century font-bold",
    fontSizeClass: "text-5xl sm:text-7xl md:text-8xl lg:text-[96px]",
    colorClass: "text-white",
    letterSpacing: "tracking-tight",
    textTransform: "normal-case",
    badgeBorder: "border-white/20",
    badgeText: "text-white/80",
    badgeBg: "bg-white/[0.04]",
  },
  {
    id: "pokemon",
    label: "Pokémon 8-Bit",
    universeTag: "⚡ POKÉMON RED/BLUE",
    fontClass: "font-pokemon font-normal",
    fontSizeClass: "text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight",
    colorClass: "text-[#FFCB05]",
    glowClass: "drop-shadow-[0_4px_0_#2A75BB] sm:drop-shadow-[0_6px_0_#2A75BB]",
    letterSpacing: "tracking-wider",
    textTransform: "uppercase",
    badgeBorder: "border-[#FFCB05]/40",
    badgeText: "text-[#FFCB05]",
    badgeBg: "bg-[#2A75BB]/20",
  },
  {
    id: "bleach",
    label: "Bleach Bankai",
    universeTag: "⚔️ BLEACH // 卍解",
    fontClass: "font-bleach font-black",
    fontSizeClass: "text-5xl sm:text-7xl md:text-8xl lg:text-[96px]",
    colorClass: "text-red-500",
    glowClass: "drop-shadow-[0_0_20px_rgba(239,68,68,0.85)]",
    letterSpacing: "tracking-wide",
    textTransform: "uppercase italic",
    badgeBorder: "border-red-500/40",
    badgeText: "text-red-400",
    badgeBg: "bg-red-950/40",
  },
  {
    id: "onepiece",
    label: "One Piece Bounty",
    universeTag: "🏴‍☠️ ONE PIECE // WANTED",
    fontClass: "font-onepiece font-normal",
    fontSizeClass: "text-6xl sm:text-8xl md:text-9xl lg:text-[105px] leading-none",
    colorClass: "text-[#FBBF24]",
    glowClass: "drop-shadow-[0_4px_16px_rgba(245,158,11,0.5)]",
    letterSpacing: "tracking-normal",
    textTransform: "normal-case",
    badgeBorder: "border-amber-500/40",
    badgeText: "text-amber-400",
    badgeBg: "bg-amber-950/30",
  },
  {
    id: "evangelion",
    label: "Evangelion NERV",
    universeTag: "🤖 EVANGELION // EMERGENCY",
    fontClass: "font-evangelion font-black",
    fontSizeClass: "text-5xl sm:text-7xl md:text-8xl lg:text-[96px]",
    colorClass: "text-[#FF2A2A]",
    glowClass: "drop-shadow-[0_0_24px_rgba(255,42,42,0.65)]",
    letterSpacing: "tracking-tighter",
    textTransform: "uppercase italic",
    badgeBorder: "border-red-500/40",
    badgeText: "text-red-400",
    badgeBg: "bg-red-950/40",
  },
  {
    id: "aot",
    label: "Attack on Titan",
    universeTag: "🛡️ ATTACK ON TITAN",
    fontClass: "font-aot font-black",
    fontSizeClass: "text-5xl sm:text-7xl md:text-8xl lg:text-[92px]",
    colorClass: "text-stone-100",
    glowClass: "drop-shadow-[0_4px_22px_rgba(16,185,129,0.35)]",
    letterSpacing: "tracking-widest",
    textTransform: "uppercase",
    badgeBorder: "border-emerald-500/40",
    badgeText: "text-emerald-400",
    badgeBg: "bg-emerald-950/30",
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
      // Clear any pending revert
      if (revertTimerRef.current) {
        clearTimeout(revertTimerRef.current);
        revertTimerRef.current = null;
      }

      // Immediately step to next theme on hover start
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

      // If not locked, gently revert to original Century font after 1.5s
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

  // Handle explicit click: advance and toggle lock
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
      className="relative w-full cursor-pointer select-none group py-1"
      title="Click or hover to shift anime font universes"
    >
      {/* Semantic SEO & Accessibility */}
      <h1 className="sr-only">{siteConfig.name}</h1>

      {/* Main Animated Title Container */}
      <div className="relative min-h-[72px] sm:min-h-[96px] md:min-h-[120px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTheme.id}
            initial={{ opacity: 0, y: 6, scale: 0.98, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, scale: 1.02, filter: "blur(4px)" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`w-full leading-none transition-colors duration-200 ${activeTheme.fontClass} ${activeTheme.fontSizeClass} ${activeTheme.colorClass} ${activeTheme.glowClass || ""} ${activeTheme.letterSpacing || ""} ${activeTheme.textTransform || ""}`}
          >
            {activeTheme.id === "pokemon" || activeTheme.id === "bleach" || activeTheme.id === "evangelion" || activeTheme.id === "aot"
              ? siteConfig.name.toUpperCase()
              : siteConfig.name}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle Micro-Tag showing the active anime universe */}
      <div className="flex items-center gap-3 pt-2">
        <span
          className={`font-mono text-[10px] sm:text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-all duration-300 flex items-center gap-1.5 ${activeTheme.badgeBorder} ${activeTheme.badgeText} ${activeTheme.badgeBg}`}
        >
          <Shuffle className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: "8s" }} />
          <span>{activeTheme.universeTag}</span>
          {isLocked && <span className="opacity-60 text-[9px]">· LOCKED</span>}
        </span>

        <span className="font-funnel text-xs text-ink-muted/50 hidden sm:inline lowercase">
          hover or click to shift fonts
        </span>
      </div>
    </div>
  );
}
