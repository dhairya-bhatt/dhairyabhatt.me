"use client";

import React from "react";
import { motion } from "framer-motion";

interface PokeballButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function PokeballButton({ isOpen, onClick, className = "" }: PokeballButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      className={`relative group w-12 h-12 rounded-full flex items-center justify-center focus:outline-none transition-transform duration-300 hover:scale-105 ${className}`}
    >
      {/* Outer focus/glow ring */}
      <span className="absolute inset-0 rounded-full bg-accent/20 scale-0 group-hover:scale-125 transition-transform duration-300 opacity-0 group-hover:opacity-100 blur-sm pointer-events-none" />

      {isOpen ? (
        // Close 'X' Button matching the Figma Menu frame
        <motion.div
          key="close-icon"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center shadow-lg hover:border-accent transition-colors"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.div>
      ) : (
        // Pokéball Icon with animated top shell tilt and button glow
        <div key="pokeball-icon" className="relative w-10 h-10 select-none">
          {/* Subtle Outer Border */}
          <div className="w-10 h-10 rounded-full bg-black/60 shadow-md overflow-hidden relative border border-white/20 group-hover:border-accent/60 transition-colors">
            {/* Top Shell (Vermilion / Crisp White with interactive tilt) */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[19px] bg-white origin-bottom"
              whileHover={{
                y: -2.5,
                rotate: -4,
                transition: { type: "spring", stiffness: 400, damping: 15 },
              }}
            >
              <div className="w-full h-full bg-gradient-to-b from-white/95 to-neutral-200" />
            </motion.div>

            {/* Bottom Shell (Dark Obsidian) */}
            <div className="absolute bottom-0 left-0 right-0 h-[19px] bg-[#161616]" />

            {/* Middle Belt (Center Dividing Line) */}
            <div className="absolute top-[18px] left-0 right-0 h-[4px] bg-[#0E0E0E]" />

            {/* Center Button Housing */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0E0E0E] flex items-center justify-center border border-black z-10">
              {/* Center Button with Hover Glow */}
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-white transition-all duration-300 group-hover:bg-accent group-hover:shadow-[0_0_8px_rgba(255,70,50,0.9)]"
                whileHover={{ scale: 1.15 }}
              />
            </div>
          </div>
        </div>
      )}
    </button>
  );
}
