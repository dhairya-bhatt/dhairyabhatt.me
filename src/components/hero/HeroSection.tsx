"use client";

import React from "react";
import { HeroScatterName } from "./HeroScatterName";
import { GoldenRatioSpiral } from "@/components/ui/GoldenRatioSpiral";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  isIntroComplete?: boolean;
}

export function HeroSection({ isIntroComplete = true }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-[100dvh] h-[100dvh] flex flex-col justify-between px-6 sm:px-12 md:px-20 lg:px-28 pt-24 md:pt-32 pb-10 md:pb-12 overflow-hidden bg-[#111111]"
    >
      {/* 1. Main Centered Hero Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto flex flex-col items-center text-center">
        {/* Interactive Sliced Scatter Name - Centered with Rose Gard font */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center"
        >
          <HeroScatterName
            text="Dhairya Bhatt"
            fontVariant="rosegard"
            align="center"
          />
        </motion.div>

        {/* Subtitle - Placed directly underneath Dhairya Bhatt, moved up closer */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl -mt-4 sm:-mt-6 md:-mt-8"
        >
          <p className="font-funnel text-base sm:text-lg md:text-xl text-[#929298] font-normal leading-relaxed lowercase tracking-wide">
            mathematics &amp; computer science undergrad
          </p>
        </motion.div>
      </div>

      {/* 2. Golden Ratio Spiral (Spans the Entire Landing Page with Center in Bottom-Right) */}
      <GoldenRatioSpiral className="z-0" isIntroComplete={isIntroComplete} />

      {/* 3. Bottom Bar: Explore Scroll Cue Centered / Minimal */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
        transition={{ duration: 0.85, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex items-center justify-center pt-6 border-t border-white/[0.06] font-mono text-[10px] sm:text-xs text-ink-muted"
      >
        <a
          href="#about"
          className="group inline-flex items-center gap-2 text-ink-muted hover:text-white transition-colors uppercase tracking-widest"
        >
          <span>EXPLORE</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform text-white/70" />
        </a>
      </motion.div>
    </section>
  );
}
